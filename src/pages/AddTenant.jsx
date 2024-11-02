import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const AddTenant = () => {
  const { propertyId } = useParams(); // Get propertyId from URL
  const navigate = useNavigate(); // For navigation after adding tenant
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
  const [error, setError] = useState(""); // For error messages

  useEffect(() => {
    const fetchProperties = async () => {
      const listingRef = collection(db, "propertyListings");
      const snapshot = await getDocs(listingRef);
      const listings = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setProperties(listings);

      // If a propertyId is in the URL, set the tenant's property details
      if (propertyId) {
        const selectedProperty = listings.find((property) => property.id === propertyId);
        if (selectedProperty) {
          setSelectedPropertyId(propertyId);
          setTenant((prev) => ({
            ...prev,
            propertyName: selectedProperty.data.propertyName,
            building: selectedProperty.data.building,
          }));
        }
      }
    };

    fetchProperties();
  }, [propertyId]);

  const handleAddTenant = async () => {
    // Basic validation for required fields
    if (!tenant.name || !tenant.unitNumber) {
      setError("Name and Unit Number are required.");
      return;
    }

    try {
      const tenantsRef = collection(db, "tenants");
      await addDoc(tenantsRef, tenant);
      console.log("Tenant added successfully");
      navigate("/property-management"); // Redirect to Property Management after success
    } catch (error) {
      console.error("Error adding tenant: ", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Add Tenant</h2>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Dropdown for Selecting Property */}
      <div className="mb-4">
        <label className="font-semibold">Select Property:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded bg-white"
          value={selectedPropertyId}
          onChange={(e) => {
            const selectedId = e.target.value;
            setSelectedPropertyId(selectedId);
            const selectedProperty = properties.find(property => property.id === selectedId);
            if (selectedProperty) {
              setTenant(prev => ({
                ...prev,
                propertyName: selectedProperty.data.propertyName,
                building: selectedProperty.data.building,
              }));
            }
          }}
        >
          <option value="" disabled>Select a Property</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.data.propertyName}
            </option>
          ))}
        </select>
      </div>

      {/* Input Fields for Tenant */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Name", value: tenant.name },
          { label: "Property Name", value: tenant.propertyName },
          { label: "Building #", value: tenant.building },
          { label: "Floor", value: tenant.floor },
          { label: "Unit #", value: tenant.unitNumber },
          { label: "Unit Type", value: tenant.unitType },
          { label: "Unit Rent", value: tenant.unitRent },
          { label: "SqFt", value: tenant.sqFt },
          { label: "Bedrooms", value: tenant.bedrooms },
          { label: "Security Deposit", value: tenant.securityDeposit },
          { label: "Pet Deposit", value: tenant.petDeposit },
          { label: "Guarantee Bond", value: tenant.guaranteeBond },
          {
            label: "Date of Birth",
            value: tenant.DOB ? new Date(tenant.DOB.seconds * 1000).toLocaleDateString() : "",
          },
        ].map(({ label, value }) => (
          <div key={label}>
            <label className="font-semibold">{label}:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder={`Enter ${label}`}
              value={value}
              onChange={(e) => setTenant(prev => ({ ...prev, [label.toLowerCase().replace(" ", "")]: e.target.value }))} 
            />
          </div>
        ))}

        {/* Dropdown for Rental Type */}
        <div>
          <label className="font-semibold">Rental Type:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded bg-white"
            value={tenant.rentalType}
            onChange={(e) => setTenant(prev => ({ ...prev, rentalType: e.target.value }))}
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Notes Section */}
        <div className="col-span-2 border-t border-gray-200 mt-4 pt-4">
          <label className="font-semibold text-lg text-gray-700 mb-2 block">
            Internal Notes:
          </label>
          <textarea
            className="w-full p-4 border border-gray-300 rounded h-24 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400 resize-none"
            placeholder="Enter internal notes here"
            value={tenant.internalNotes}
            onChange={(e) => setTenant(prev => ({ ...prev, internalNotes: e.target.value }))}
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
