import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase"; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase storage functions
import { v4 as uuidv4 } from "uuid";
import { getStorage } from "firebase/storage";
import { uploadBytes } from "firebase/storage";

const AddTenant = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    propertyId || ""
  );
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
    status: "active",
    imageUrl: "", // New imageUrl field
    leaseStartDate: "",
    leaseEndDate: "",
  });
  const [file, setFile] = useState(null); // State to store the file
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
          const selectedProperty = listings.find(
            (property) => property.id === propertyId
          );
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
    setTenant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  // Assuming handleImageUpload is defined here
  const handleImageUpload = async (file) => {
    if (!file) return ""; // Return early if no file selected
    try {
      const uniqueFileName = `${file.name}-${uuidv4()}`;
      const storageRef = ref(storage, `images/${uniqueFileName}`);

      // Upload the file to Firebase Storage using the uploadBytes function
      const snapshot = await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("Download URL:", downloadURL); // Log the download URL
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please ensure the file is valid.");
      return ""; // Return empty if upload fails
    }
  };

  const handleAddTenant = async () => {
    if (!tenant.name || !tenant.unitNumber || !tenant.DOB) {
      setError("Name, Unit Number, and Date of Birth are required.");
      return;
    }

    // Convert DOB to Firebase Timestamp
    const dobTimestamp = tenant.DOB
      ? Timestamp.fromDate(new Date(tenant.DOB))
      : null;
    
      const leaseStartTimestamp = tenant.leaseStartDate
      ? Timestamp.fromDate(new Date(tenant.leaseStartDate))
      : null;
    
    const leaseEndTimestamp = tenant.leaseEndDate
      ? Timestamp.fromDate(new Date(tenant.leaseEndDate))
      : null;
    

    // Handle file upload if a file was selected
    let imageUrl = "";
    if (file) {
      imageUrl = await handleImageUpload(file);
      if (!imageUrl) return; // Exit if image upload fails
    }

    // Ensure tenant object has property data before adding
    if (!tenant.propertyName || !tenant.building) {
      setError("Property details are missing.");
      return;
    }

    try {
      const tenantsRef = collection(db, "tenants");
      const tenantData = {
        ...tenant,
        DOB: dobTimestamp,
        leaseStartDate: leaseStartTimestamp,
        leaseEndDate: leaseEndTimestamp,
        imageUrl,
      };
      

      // Add the tenant to the Firestore collection
      const tenantDocRef = await addDoc(tenantsRef, tenantData);

      // After adding the tenant, get the document ID
      const tenantId = tenantDocRef.id;
      console.log("Tenant added with ID:", tenantId);

      // Fetch property data and update tenants array
      const propertyRef = doc(db, "propertyListings", selectedPropertyId);
      const propertyDoc = await getDoc(propertyRef);
      const propertyData = propertyDoc.data();

      const updatedTenants = propertyData.tenants
        ? [...propertyData.tenants, { id: tenantId, ...tenantData }]
        : [{ id: tenantId, ...tenantData }];

      await updateDoc(propertyRef, { tenants: updatedTenants });

      // Reset error state and navigate
      setError("");
      console.log("Tenant added successfully");
      navigate("/property-management");
    } catch (error) {
      console.error("Error adding tenant:", error);
      setError("Failed to add tenant. Please try again.");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Tenant</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <div className="mb-4">
        <label className="font-semibold block">Select Property:</label>
        <select
          className="w-full p-2 border border-gray-300 rounded bg-white"
          value={selectedPropertyId}
          onChange={(e) => {
            const selectedId = e.target.value;
            setSelectedPropertyId(selectedId);
            const selectedProperty = properties.find(
              (property) => property.id === selectedId
            );
            if (selectedProperty) {
              setTenant((prev) => ({
                ...prev,
                propertyName: selectedProperty.data.name,
                building: selectedProperty.data.building,
              }));
            }
          }}
        >
          <option value="" disabled>
            Select a Property
          </option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.data.name}
            </option>
          ))}
        </select>
      </div>

      {/* Grid for Desktop, Single-column on Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          { label: "Lease Start Date", name: "leaseStartDate", type: "date" },
          { label: "Lease End Date", name: "leaseEndDate", type: "date" },
          { label: "Pet Deposit", name: "petDeposit" },
          { label: "Guarantee Bond", name: "guaranteeBond" },
          { label: "Date of Birth", name: "DOB", type: "date" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="font-semibold block">{label}:</label>
            <input
              type={type}
              name={name}
              className="w-full p-3 border border-gray-300 rounded"
              placeholder={`Enter ${label}`}
              value={tenant[name]}
              onChange={handleInputChange}
            />
          </div>
        ))}

        <div>
          <label className="font-semibold block">Rental Type:</label>
          <select
            name="rentalType"
            className="w-full p-3 border border-gray-300 rounded bg-white"
            value={tenant.rentalType}
            onChange={handleInputChange}
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="font-semibold block">Status:</label>
          <select
            name="status"
            className="w-full p-3 border border-gray-300 rounded bg-white"
            value={tenant.status}
            onChange={handleInputChange}
          >
            <option value="active">Current Tenants</option>
            <option value="inactive">Past Tenants</option>
          </select>
        </div>

        <div>
          <label className="font-semibold block">Internal Notes:</label>
          <textarea
            name="internalNotes"
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter internal notes"
            value={tenant.internalNotes}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="font-semibold block">Upload Image:</label>
          <input
            type="file"
            className="w-full p-3 border border-gray-300 rounded"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          className="w-full bg-gray-500 text-white py-3 rounded-md font-semibold hover:bg-gray-600 transition"
          onClick={handleAddTenant}
        >
          Add Tenant
        </button>
      </div>
      <div className="mt-4">
        <button
          className="w-full bg-white text-gray-500 py-3 rounded-md font-semibold border border-gray-500 hover:bg-gray-100 transition"
          onClick={() => navigate("/property-management")} // Navigate back or any desired cancel action
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddTenant;
