import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const TenantDetail = () => {
  const { id, tenantId } = useParams();
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    const fetchTenantDetails = async () => {
      const docRef = doc(db, "propertyListings", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const tenantDetail = docSnap.data().tenants; // Directly access the tenants field
        if (tenantDetail && tenantDetail.id === tenantId) {
          setTenant(tenantDetail);
        } else {
          console.error("No tenant found with the given ID");
        }
      } else {
        console.log("No such document!");
      }
    };

    fetchTenantDetails();
  }, [id, tenantId]);

  return tenant ? (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Tenant Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Fields */}
        {[
          { label: "Name", value: tenant.name || "" },
          { label: "Property Name", value: tenant.propertyName || "" },
          { label: "Building #", value: tenant.building || "" },
          { label: "Floor", value: tenant.floor || "" },
          { label: "Unit #", value: tenant.unitNumber || "" },
          { label: "Unit Type", value: tenant.unitType || "" },
          { label: "Unit Rent", value: tenant.unitRent || "" },
          { label: "SqFt", value: tenant.sqFt || "" },
          { label: "Bedrooms", value: tenant.bedrooms || "" },
          { label: "Security Deposit", value: tenant.securityDeposit || "" },
          { label: "Pet Deposit", value: tenant.petDeposit || "" },
          { label: "Guarantee Bond", value: tenant.guaranteeBond || "" },
          {
            label: "Date of Birth",
            value: tenant.DOB
              ? new Date(tenant.DOB.seconds * 1000).toLocaleDateString()
              : "",
          },
        ].map(({ label, value }) => (
          <div key={label}>
            <label className="font-semibold">{label}:</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder={`Enter ${label}`}
              value={value}
              readOnly
            />
          </div>
        ))}
        {/* Dropdown for Rental Type */}
        <div>
          <label className="font-semibold">Rental Type:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded bg-white"
            value={tenant.rentalType || "Residential"}
            disabled
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="text-center mt-6">
        <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Edit Tenant
        </button>
      </div>
    </div>
  ) : (
    <p>Loading tenant details...</p>
  );
};

export default TenantDetail;
