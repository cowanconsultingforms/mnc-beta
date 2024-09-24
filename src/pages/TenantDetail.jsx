import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const TenantDetail = () => {
  const { propertyId, tenantId } = useParams(); // Get property and tenant IDs from the URL
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTenantDetails = async () => {
    try {
      const docRef = doc(db, "propertyListings", propertyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const tenantDetails = data.tenants.find(t => t.id === tenantId);
        setTenant(tenantDetails || {});
      } else {
        setError("No such document exists.");
      }
    } catch (error) {
      setError("Failed to fetch tenant details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantDetails();
  }, [propertyId, tenantId]);

  if (loading) {
    return <p>Loading tenant details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Tenant Details</h2>
      {tenant ? (
        <div>
          <p>Name: {tenant.name}</p>
          <p>DOB: {tenant.DOB ? new Date(tenant.DOB.seconds * 1000).toLocaleDateString() : "N/A"}</p>
          <p>Unit Number: {tenant.unitNumber || "N/A"}</p>
          <p>Down Payment: ${tenant.downPayment || "N/A"}</p>
          {/* Add other tenant details here */}
        </div>
      ) : (
        <p>No tenant details available</p>
      )}
    </div>
  );
};

export default TenantDetail;
