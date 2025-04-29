import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProperty = async () => {
    try {
      await addDoc(collection(db, "propertyListings"), property);
      alert("Property added successfully!");
      navigate("/property-management"); // go back to property management view
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Property</h2>

      {[
        { label: "Property Name", name: "propertyName" },
        { label: "Location", name: "location" },
        { label: "Total Floors", name: "totalFloors", type: "number" },
        { label: "Total Units", name: "totalUnits", type: "number" },
        { label: "Total SqFt", name: "totalSqFt", type: "number" },
        { label: "Date of Purchase", name: "dateOfPurchase", type: "date" },
        { label: "Upload Image URL", name: "imageUrl" },
      ].map(({ label, name, type = "text" }) => (
        <div key={name} className="mb-4">
          <label className="block font-medium mb-1">{label}:</label>
          <input
            type={type}
            name={name}
            value={property[name]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      ))}

      {/* Property Type Dropdown */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Property Type:</label>
        <select
          name="propertyType"
          value={property.propertyType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Internal Notes */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Internal Notes:</label>
        <textarea
          name="internalNotes"
          value={property.internalNotes}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={4}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleAddProperty}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Property
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddProperty;
