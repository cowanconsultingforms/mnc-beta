import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const geocodeAddress = async (address) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status === "OK") {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  } else {
    console.error("Geocoding failed:", data.status);
    return { lat: 0, lng: 0 };
  }
};

const AddProperty = () => {
  const navigate = useNavigate();
  const [property, setProperty] = useState({
    propertyName: "",
    location: "",
    totalFloors: "",
    totalUnits: "",
    totalSqFt: "",
    dateOfPurchase: "",
    propertyType: "Residential",
    internalNotes: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    const uniqueFileName = `${imageFile.name}-${uuidv4()}`;
    const imageRef = ref(storage, `images/${uniqueFileName}`);
    const snapshot = await uploadBytes(imageRef, imageFile);
    return await getDownloadURL(snapshot.ref);
  };

  const handleAddProperty = async () => {
    if (!property.propertyName || !property.location || !imageFile ) {
      setError("Property Name, Location, and Image are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const geolocation = await geocodeAddress(property.location);
      const imageUrl = await handleImageUpload();
      const imagePath = `images/${imageFile.name}-${uuidv4()}`; // crude fallback

      const normalizedProperty = {
        ...property,
        totalFloors: Number(property.totalFloors),
        totalUnits: Number(property.totalUnits),
        totalSqFt: Number(property.totalSqFt),
        dateOfPurchase: property.dateOfPurchase
          ? Timestamp.fromDate(new Date(property.dateOfPurchase))
          : null,
        createdAt: Timestamp.now(),

        // 🔄 Normalized structure to prevent crash
        name: property.propertyName,
        address: property.location,
        imgs: [
          {
            url: imageUrl,
            path: imageUrl.split("?alt")[0].split("/o/")[1],
          },
        ],
        bedrooms: 0,
        bathrooms: 0,
        landSize: property.totalSqFt?.toString() || "0",
        yearBuilt: "N/A",
        parking: false,
        furnished: false,
        regularPrice: "0",
        offer: false,
        type: "rent",
        geolocation,
        timestamp: Timestamp.now(),
      };

      await addDoc(collection(db, "properties"), normalizedProperty);
          /*  await addDoc(collection(db, "propertyListings"), normalizedProperty); */

      navigate("/property-management");
    } catch (err) {
      console.error("Error adding property:", err);
      setError("Failed to add property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Property</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { label: "Property Name", name: "propertyName" },
          { label: "Location", name: "location" },
          { label: "Total Floors", name: "totalFloors", type: "number" },
          { label: "Total Units", name: "totalUnits", type: "number" },
          { label: "Total SqFt", name: "totalSqFt", type: "number" },
          { label: "Date of Purchase", name: "dateOfPurchase", type: "date" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="font-semibold block">{label}:</label>
            <input
              type={type}
              name={name}
              className="w-full p-3 border border-gray-300 rounded"
              placeholder={`Enter ${label}`}
              value={property[name]}
              onChange={handleInputChange}
            />
          </div>
        ))}

        <div>
          <label className="font-semibold block">Property Type:</label>
          <select
            name="propertyType"
            className="w-full p-3 border border-gray-300 rounded bg-white"
            value={property.propertyType}
            onChange={handleInputChange}
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="font-semibold block">Internal Notes:</label>
          <textarea
            name="internalNotes"
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter internal notes"
            value={property.internalNotes}
            onChange={handleInputChange}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="font-semibold block">Upload Image:</label>
          <input
            type="file"
            className="w-full p-3 border border-gray-300 rounded"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          className="w-full bg-gray-500 text-white py-3 rounded-md font-semibold hover:bg-gray-600 transition"
          onClick={handleAddProperty}
          disabled={loading}
        >
          {loading ? "Adding..." : "Save"}
        </button>
      </div>

      <div className="mt-4">
        <button
          className="w-full bg-white text-gray-500 py-3 rounded-md font-semibold border border-gray-500 hover:bg-gray-100 transition"
          onClick={() => navigate("/property-management")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddProperty;
