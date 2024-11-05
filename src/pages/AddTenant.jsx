import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const AddTenant = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyId || "");
  const [tenant, setTenant] = useState({
    name: "",
    propertyName: "",
    building: "",
    floor: "",
    unitNumber: "",
    unitType: "",
    unitRent: "",
    sqFt: "",
    bedrooms: "",
    securityDeposit: "",
    petDeposit: "",
    guaranteeBond: "",
    DOB: "",
    rentalType: "Residential",
    internalNotes: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const listingRef = collection(db, "propertyListings");
        const snapshot = await getDocs(listingRef);
        const listings = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setProperties(listings);

        if (propertyId) {
          const selectedProperty = listings.find((property) => property.id === propertyId);
          if (selectedProperty) {
            setSelectedPropertyId(propertyId);
            setTenant((prev) => ({
              ...prev,
              propertyName: selectedProperty.data.name,
              building: selectedProperty.data.building,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };

    fetchProperties();
  }, [propertyId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTenant((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTenant = async () => {
    if (!tenant.name || !tenant.unitNumber) {
      setError("Name and Unit Number are required.");
      return;
    }

    try {
      const tenantsRef = collection(db, "tenants");
      await addDoc(tenantsRef, tenant);
      setError("");
      console.log("Tenant added successfully");
      navigate("/property-management");
    } catch (error) {
      console.error("Error adding tenant:", error);
      setError("Failed to add tenant. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Add Tenant</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="font-semibold">Select Property:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded bg-white"
          value={selectedPropertyId}
          onChange={(e) => {
            const selectedId = e.target.value;
            setSelectedPropertyId(selectedId);
            const selectedProperty = properties.find((property) => property.id === selectedId);
            if (selectedProperty) {
              setTenant((prev) => ({
                ...prev,
                propertyName: selectedProperty.data.name,
                building: selectedProperty.data.building,
              }));
            }
          }}
        >
          <option value="" disabled>Select a Property</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.data.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Name", name: "name" },
          { label: "Property Name", name: "propertyName" },
          { label: "Building #", name: "building" },
          { label: "Floor", name: "floor" },
          { label: "Unit #", name: "unitNumber" },
          { label: "Unit Type", name: "unitType" },
          { label: "Unit Rent", name: "unitRent" },
          { label: "SqFt", name: "sqFt" },
          { label: "Bedrooms", name: "bedrooms" },
          { label: "Security Deposit", name: "securityDeposit" },
          { label: "Pet Deposit", name: "petDeposit" },
          { label: "Guarantee Bond", name: "guaranteeBond" },
          { label: "Date of Birth", name: "DOB" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="font-semibold">{label}:</label>
            <input
              type="text"
              name={name}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder={`Enter ${label}`}
              value={tenant[name]}
              onChange={handleInputChange}
            />
          </div>
        ))}

        <div>
          <label className="font-semibold">Rental Type:</label>
          <select
            name="rentalType"
            className="w-full p-2 border border-gray-300 rounded bg-white"
            value={tenant.rentalType}
            onChange={handleInputChange}
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="col-span-2 border-t border-gray-200 mt-4 pt-4">
          <label className="font-semibold text-lg text-gray-700 mb-2 block">
            Internal Notes:
          </label>
          <textarea
            name="internalNotes"
            className="w-full p-4 border border-gray-300 rounded h-24 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400 resize-none"
            placeholder="Enter internal notes here"
            value={tenant.internalNotes}
            onChange={handleInputChange}
          ></textarea>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={handleAddTenant}
        >
          Add Tenant
        </button>
      </div>
    </div>
  );
};

export default AddTenant;
