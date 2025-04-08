import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [collectionPath, setCollectionPath] = useState(null); // Track which collection it's from

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        let docRef = doc(db, "propertyListings", id);
        let docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          docRef = doc(db, "properties", id);
          docSnap = await getDoc(docRef);
          setCollectionPath("properties");
        } else {
          setCollectionPath("propertyListings");
        }

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProperty({
            ...data,
            name: data.name || data.propertyName || "",
            address: data.address || data.location || "",
            dateOfPurchase: data.dateOfPurchase?.seconds
              ? new Date(data.dateOfPurchase.seconds * 1000)
                  .toISOString()
                  .split("T")[0]
              : "",
            imageUrl: data.imageUrl || data.imgs?.[0]?.url || "",
          });
        } else {
          setError("Property not found.");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property.");
      }
    };

    fetchProperty();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      return {
        url: property.imageUrl || property.imgs?.[0]?.url || "",
        path: property.imgs?.[0]?.path || "",
      };
    }

    const filename = `images/${imageFile.name}-${uuidv4()}`;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload failed:", error);
          reject("Image upload failed.");
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ url, path: filename });
          } catch (err) {
            reject("Failed to retrieve image URL.");
          }
        }
      );
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");

      const { url: imageUrl, path } = await handleImageUpload();

      const updatedProperty = {
        ...property,
        totalFloors: Number(property.totalFloors),
        totalUnits: Number(property.totalUnits),
        totalSqFt: Number(property.totalSqFt),
        dateOfPurchase: property.dateOfPurchase
          ? Timestamp.fromDate(new Date(property.dateOfPurchase))
          : null,
        name: property.name,
        address: property.address,
        imageUrl,
        imgs: [
          {
            url: imageUrl,
            path,
          },
        ],
        updatedAt: Timestamp.now(),
      };

      const docRef = doc(db, collectionPath, id);
      await updateDoc(docRef, updatedProperty);
      navigate("/property-management");
    } catch (err) {
      console.error("Error updating property:", err);
      setError("Failed to update property.");
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return (
      <div className="p-4 md:p-6 text-center text-lg text-gray-600">
        Loading property data...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Property</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { label: "Property Name", name: "name" },
          { label: "Location", name: "address" },
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
              value={property[name] || ""}
              onChange={handleInputChange}
            />
          </div>
        ))}

        <div>
          <label className="font-semibold block">Property Type:</label>
          <select
            name="propertyType"
            className="w-full p-3 border border-gray-300 rounded bg-white"
            value={property.propertyType || "Residential"}
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
            value={property.internalNotes || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="font-semibold block">Upload New Image:</label>
          <input
            type="file"
            className="w-full p-3 border border-gray-300 rounded"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {!imageFile && (property?.imageUrl || property?.imgs?.[0]?.url) && (
        <div className="mt-6 text-center">
          <p className="font-semibold block mb-2">Current Image:</p>
          <img
            src={property.imageUrl || property.imgs?.[0]?.url}
            alt="Property"
            className="w-full max-w-sm mx-auto rounded-lg shadow-md grayscale"
          />
        </div>
      )}

      <div className="mt-6">
        <button
          className="w-full bg-gray-500 text-white py-3 rounded-md font-semibold hover:bg-gray-600 transition"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
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

export default EditProperty;
