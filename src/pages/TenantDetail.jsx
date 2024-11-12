import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const TenantDetail = () => {
  const { id, tenantId } = useParams();
  const [tenant, setTenant] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [editableTenant, setEditableTenant] = useState(null); // Track changes locally

 useEffect(() => {
  const fetchTenantDetails = async () => {
    const docRef = doc(db, "propertyListings", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const tenantList = docSnap.data().tenants || []; // Default to empty array if tenants doesn't exist
      
      if (Array.isArray(tenantList)) {
        // Find the tenant by tenantId
        const tenantDetail = tenantList.find((tenant) => tenant.id === tenantId);
        
        if (tenantDetail) {
          setTenant(tenantDetail);
          setEditableTenant({ ...tenantDetail }); // Create editable copy
        } else {
          console.error("No tenant found with the given ID");
        }
      } else {
        console.error("Tenants data is not an array or is undefined");
      }
    } else {
      console.log("No such document!");
    }
  };

  fetchTenantDetails();
}, [id, tenantId]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableTenant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const docRef = doc(db, "propertyListings", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Get current tenants list from Firestore or initialize as an empty array
        const tenants = docSnap.data().tenants || [];

        // Update the specific tenant in the tenants array
        const updatedTenants = tenants.map((tenant) =>
          tenant.id === tenantId ? { ...editableTenant } : tenant
        );

        // If tenant doesn't exist in the array, push the new tenant to the list
        if (!updatedTenants.some(tenant => tenant.id === tenantId)) {
          updatedTenants.push({ ...editableTenant });
        }

        // Save the updated tenants array back to Firestore
        await updateDoc(docRef, { tenants: updatedTenants });

        setTenant(editableTenant); // Update display to match saved data
        setIsEditing(false); // Exit edit mode
        console.log("Tenant details updated successfully!");
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error updating tenant details:", error);
    }
  };

  const profileImage = tenant?.imageUrl || "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";

  return tenant ? (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md max-w-xl md:max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Tenant Details</h2>

      {/* Image Section */}
      <div className="flex justify-center mb-4">
        <img
          src={profileImage}
          alt="Tenant Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Fields */}
        {[
          { label: "Name", name: "name", value: editableTenant?.name || "" },
          { label: "Property Name", name: "propertyName", value: editableTenant?.propertyName || "" },
          { label: "Building #", name: "building", value: editableTenant?.building || "" },
          { label: "Floor", name: "floor", value: editableTenant?.floor || "" },
          { label: "Unit #", name: "unitNumber", value: editableTenant?.unitNumber || "" },
          { label: "Unit Type", name: "unitType", value: editableTenant?.unitType || "" },
          { label: "Unit Rent", name: "unitRent", value: editableTenant?.unitRent || "" },
          { label: "SqFt", name: "sqFt", value: editableTenant?.sqFt || "" },
          { label: "Bedrooms", name: "bedrooms", value: editableTenant?.bedrooms || "" },
          { label: "Security Deposit", name: "securityDeposit", value: editableTenant?.securityDeposit || "" },
          { label: "Pet Deposit", name: "petDeposit", value: editableTenant?.petDeposit || "" },
          { label: "Guarantee Bond", name: "guaranteeBond", value: editableTenant?.guaranteeBond || "" },
          {
            label: "Date of Birth",
            name: "DOB",
            value: editableTenant?.DOB ? new Date(editableTenant.DOB.seconds * 1000).toLocaleDateString() : "",
          },
        ].map(({ label, name, value }) => (
          <div key={label} className="flex flex-col">
            <label className="font-semibold">{label}:</label>
            <input
              type="text"
              name={name}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder={`Enter ${label}`}
              value={value}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
          </div>
        ))}

        {/* Dropdown for Rental Type */}
        <div className="flex flex-col">
          <label className="font-semibold">Rental Type:</label>
          <select
            name="rentalType"
            className="w-full p-2 border border-gray-300 rounded bg-white"
            value={editableTenant?.rentalType || "Residential"}
            disabled={!isEditing}
            onChange={handleInputChange}
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
            name="internalNotes"
            className="w-full p-4 border border-gray-300 rounded h-24 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400 resize-none"
            placeholder="Enter internal notes here"
            value={editableTenant?.internalNotes || ""}
            readOnly={!isEditing}
            onChange={handleInputChange}
          ></textarea>
        </div>
      </div>

      <div className="text-center mt-6">
        {isEditing ? (
          <>
            <button onClick={handleSaveChanges} className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors mr-2">
              Save Changes
            </button>
            <button onClick={() => setIsEditing(false)} className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Edit Tenant
          </button>
        )}
      </div>
    </div>
  ) : (
    <p>Loading tenant details...</p>
  );
};

export default TenantDetail;
