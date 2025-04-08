import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase";
import { Timestamp } from "firebase/firestore";

const TenantDetail = () => {
  const { id, tenantId } = useParams();
  const [tenant, setTenant] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [editableTenant, setEditableTenant] = useState(null); // Track changes locally
  const [imageFile, setImageFile] = useState(null); // Store selected image file
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const tenantDocRef = doc(db, "tenants", tenantId);



  useEffect(() => {
    const fetchTenantDetails = async () => {
      let docRef = doc(db, "propertyListings", id);
      let docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        docRef = doc(db, "properties", id);
        docSnap = await getDoc(docRef);
      }
      

      if (docSnap.exists()) {
        const tenantList = docSnap.data().tenants || []; // Default to empty array if tenants doesn't exist

        if (Array.isArray(tenantList)) {
          // Find the tenant by tenantId
          const tenantDetail = tenantList.find(
            (tenant) => tenant.id === tenantId
          );

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
  
  const safeConvertToTimestamp = (value) => {
    if (!value) return null;
    if (value?.seconds) return value; // already a Timestamp
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : Timestamp.fromDate(date);
  };

  const handleSaveChanges = async () => {
    try {
      let docRef = doc(db, "propertyListings", id);
      let docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        docRef = doc(db, "properties", id);
        docSnap = await getDoc(docRef);
      }
      

      if (docSnap.exists()) {
        // Get current tenants list from Firestore or initialize as an empty array
        const tenants = docSnap.data().tenants || [];

        // Convert leaseStartDate, leaseEndDate, and DOB to Date objects
        editableTenant.id = tenantId; // Ensure ID is preserved

        editableTenant.leaseStartDate = safeConvertToTimestamp(editableTenant.leaseStartDate);
        editableTenant.leaseEndDate = safeConvertToTimestamp(editableTenant.leaseEndDate);
        editableTenant.DOB = safeConvertToTimestamp(editableTenant.DOB);




        // Update the specific tenant in the tenants array
        const updatedTenants = tenants.map((tenant) =>
          tenant.id === tenantId ? { ...editableTenant } : tenant
        );

        // If tenant doesn't exist in the array, push the new tenant to the list
        if (!updatedTenants.some((tenant) => tenant.id === tenantId)) {
          updatedTenants.push({ ...editableTenant });
        }

        // Save the updated tenants array back to Firestore
        await updateDoc(docRef, { tenants: updatedTenants });
        await updateDoc(tenantDocRef, editableTenant, { merge: true });

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

  const handleDeleteTenant = async () => {
    try {
      let docRef = doc(db, "propertyListings", id);
      let docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        docRef = doc(db, "properties", id);
        docSnap = await getDoc(docRef);
      }
      

      if (docSnap.exists()) {
        const tenants = docSnap.data().tenants || [];

        // Remove tenant from the tenants array
        const updatedTenants = tenants.filter(
          (tenant) => tenant.id !== tenantId
        );

        // Save the updated tenants array back to Firestore
        await updateDoc(docRef, { tenants: updatedTenants });

        // After deletion, clear the current tenant data
        setTenant(null);
        setEditableTenant(null);

        console.log("Tenant deleted successfully!");
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error deleting tenant:", error);
    }
  };

  const profileImage =
    tenant?.imageUrl ||
    "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=";

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
          {
            label: "Property Name",
            name: "propertyName",
            value: editableTenant?.propertyName || "",
          },
          {
            label: "Building #",
            name: "building",
            value: editableTenant?.building || "",
          },
          { label: "Floor", name: "floor", value: editableTenant?.floor || "" },
          {
            label: "Unit #",
            name: "unitNumber",
            value: editableTenant?.unitNumber || "",
          },
          {
            label: "Unit Type",
            name: "unitType",
            value: editableTenant?.unitType || "",
          },
          {
            label: "Unit Rent",
            name: "unitRent",
            value: editableTenant?.unitRent || "",
          },
          { label: "SqFt", name: "sqFt", value: editableTenant?.sqFt || "" },
          {
            label: "Bedrooms",
            name: "bedrooms",
            value: editableTenant?.bedrooms || "",
          },
          {
            label: "Security Deposit",
            name: "securityDeposit",
            value: editableTenant?.securityDeposit || "",
          },
          {
            label: "Pet Deposit",
            name: "petDeposit",
            value: editableTenant?.petDeposit || "",
          },
          {
            label: "Guarantee Bond",
            name: "guaranteeBond",
            value: editableTenant?.guaranteeBond || "",
          },
          {
            label: "Lease Start Date",
            name: "leaseStartDate",
            type: "date",
            value: editableTenant?.leaseStartDate
              ? typeof editableTenant.leaseStartDate === "string"
                ? editableTenant.leaseStartDate
                : new Date(editableTenant.leaseStartDate.seconds * 1000)
                    .toISOString()
                    .split("T")[0]
              : "",
          },
          {
            label: "Lease End Date",
            name: "leaseEndDate",
            type: "date",
            value: editableTenant?.leaseEndDate
              ? typeof editableTenant.leaseEndDate === "string"
                ? editableTenant.leaseEndDate
                : new Date(editableTenant.leaseEndDate.seconds * 1000)
                    .toISOString()
                    .split("T")[0]
              : "",
          },
          {
            label: "Date of Birth",
            name: "DOB",
            type: "date",
            value: editableTenant?.DOB
              ? typeof editableTenant.DOB === "string"
                ? editableTenant.DOB
                : new Date(editableTenant.DOB.seconds * 1000)
                    .toISOString()
                    .split("T")[0]
              : "",
          },
          
        ].map(({ label, name, value, type = "text" }) => (
          <div key={label} className="flex flex-col">
            <label className="font-semibold">{label}:</label>
            <input
              type={type}
              name={name}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder={`Enter ${label}`}
              value={value}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
          </div>
        ))}

        {/* Status Dropdown */}
        <div className="flex flex-col">
          <label className="font-semibold">Status:</label>
          <select
            name="status"
            className="w-full p-2 border border-gray-300 rounded bg-white"
            value={editableTenant?.status || "active"}
            disabled={!isEditing}
            onChange={handleInputChange}
          >
            <option value="active">Current Tenant</option>
            <option value="inactive">Past Tenant</option>
          </select>
        </div>


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
            <button
              onClick={handleSaveChanges}
              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors mr-2"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Edit Tenant
            </button>

            {/* Add space between Edit and Delete button */}
            <div className="mt-4">
              {/* Delete Tenant Button (only visible when not in editing mode) */}
              {!isEditing && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Delete Tenant
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-2xl p-5 w-full max-w-sm text-center">
              <p className="text-sm mb-6">
                Are you sure you want to delete this tenant? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-5 py-2  border-gray-300 rounded-full text-blue-500 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteTenant();
                    setShowDeleteConfirm(false);
                  }}
                  className="px-5 py-2  border-gray-300 rounded-full text-blue-500 transition-colors text-sm"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        )}



    </div>
  ) : (
    <p>Tenant not found</p>
  );
};

export default TenantDetail;
