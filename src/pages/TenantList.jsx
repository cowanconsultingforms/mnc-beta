import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const TenantList = () => {
  const { id } = useParams();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("active"); // Add state for filter (active or past)
  const [propertySource, setPropertySource] = useState("");

  const fetchSingleListing = async (listingId) => {
    try {
      let docRef = doc(db, "propertyListings", listingId);
      let docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        docRef = doc(db, "properties", listingId);
        docSnap = await getDoc(docRef);
      }

      if (docRef.path.includes("propertyListings")) {
        setPropertySource("propertyListings");
      } else if (docRef.path.includes("properties")) {
        setPropertySource("properties");
      }
      
      
  
      if (docSnap.exists()) {
        const data = docSnap.data();
  
        let fetchedTenants = Array.isArray(data.tenants)
          ? data.tenants
          : data.tenants
          ? [data.tenants]
          : [];
  
        const now = new Date();
        let didUpdate = false;
  
        // Auto-mark and prepare updates
        const updatedTenants = await Promise.all(
          fetchedTenants.map(async (tenant) => {
            const leaseEndRaw = tenant.leaseEndDate;
        
            let leaseEnd;
            if (leaseEndRaw?.seconds) {
              leaseEnd = new Date(leaseEndRaw.seconds * 1000);
            } else if (typeof leaseEndRaw === "string") {
              const parts = leaseEndRaw.includes("/")
                ? leaseEndRaw.split("/")
                : leaseEndRaw.split("-");
              if (parts.length === 3) {
                const [a, b, c] = parts;
                leaseEnd = leaseEndRaw.includes("/")
                  ? new Date(`${c}-${a}-${b}`)
                  : new Date(`${a}-${b}-${c}`);
              }
            } else if (leaseEndRaw) {
              leaseEnd = new Date(leaseEndRaw);
            }
        
            let updatedTenant = tenant;
        
            const hasValidLeaseEnd = leaseEnd instanceof Date && !isNaN(leaseEnd);
        
            if (hasValidLeaseEnd) {
              const shouldBeInactive = leaseEnd < now;
              const correctStatus = shouldBeInactive ? "inactive" : "active";
        
              if (tenant.status !== correctStatus) {
                didUpdate = true;
        
                const tenantDocRef = doc(db, "tenants", tenant.id);
                await updateDoc(tenantDocRef, { status: correctStatus });
        
                updatedTenant = { ...tenant, status: correctStatus };
              }
            }
        
            //  DO NOT override status if leaseEnd is missing
            return updatedTenant;
          })
        );
        
        
  
        // If any status changed, update the property listing document
        if (didUpdate) {
          await updateDoc(docRef, { tenants: updatedTenants });
        }
  
        // Filter by selected filter
        

        const filteredTenants = updatedTenants.filter((tenant) => {
          const leaseEndRaw = tenant.leaseEndDate;
        
          let leaseEnd;
          if (leaseEndRaw?.seconds) {
            leaseEnd = new Date(leaseEndRaw.seconds * 1000);
          } else if (typeof leaseEndRaw === "string") {
            const parts = leaseEndRaw.includes("/")
              ? leaseEndRaw.split("/")
              : leaseEndRaw.split("-");
            if (parts.length === 3) {
              const [a, b, c] = parts;
              leaseEnd = leaseEndRaw.includes("/")
                ? new Date(`${c}-${a}-${b}`)
                : new Date(`${a}-${b}-${c}`);
            }
          } else if (leaseEndRaw) {
            leaseEnd = new Date(leaseEndRaw);
          }
        
          const isInactive = tenant.status === "inactive";
          const leaseExpired = leaseEnd && leaseEnd < now;
        
          if (filter === "past") {
            return isInactive || leaseExpired;
          } else {
            // If no leaseEndDate, show only if tenant is marked active
            return !isInactive && (!leaseEnd || leaseEnd >= now);
          }
        });
        
        
        
  
        setTenants(filteredTenants);
      } else {
        setError("No such document exists.");
      }
    } catch (error) {
      setError("Failed to fetch tenants.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleListing(id);
  }, [id, filter]); // Fetch again if the filter or id changes

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";

  // Firestore Timestamp
  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate().toISOString().split("T")[0];
  }

  // JavaScript Date object
  if (timestamp instanceof Date) {
    return timestamp.toISOString().split("T")[0];
  }

  // String format (e.g., "2024-04-04")
  if (typeof timestamp === "string") {
    const date = new Date(timestamp);
    if (!isNaN(date)) {
      return date.toISOString().split("T")[0];
    }
  }

  return "N/A";
};


  if (loading) {
    return <p className="text-center text-lg">Loading tenants...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex justify-center bg-gray-50 py-10">
      <div className="max-w-6xl w-full px-4">
        {/* Filter Buttons */}
        <div className="mb-4 text-center">
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 mx-2 ${
              filter === "active" ? "bg-gray-500 text-white" : "bg-gray-200"
            }`}
          >
            Current Tenants
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-4 py-2 mx-2 ${
              filter === "past" ? "bg-gray-500 text-white" : "bg-gray-200"
            }`}
          >
            Past Tenants
          </button>  
        </div>

        {/* Tenant List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tenants.length === 0 ? (
            <p className="text-gray-600 text-center col-span-full">
              {filter === "active"
                ? "No Current tenants found for this property"
                : "No past tenants found for this property"}
            </p>
          ) : (
            tenants.map((tenant, index) => (
              <Link
                key={tenant.id || index}
                to={`/property-management/${id}/tenant/${tenant.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center"
                style={{ height: "auto" }}
              >
                <p className="text-lg font-semibold text-gray-800">
                  {tenant.name || "Unnamed Tenant"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  DOB:{" "}
                  <span className="font-medium text-gray-700">
                    {tenant.DOB ? formatDate(tenant.DOB) : "N/A"}
                  </span>
                </p>
              </Link>
            ))
          )}
        </div>
        
        {propertySource && (
            <div className="mt-8 text-center">
              <Link
                to={
                  propertySource === "propertyListings"
                    ? `/edit-listing/${id}`
                    : `/edit-property/${id}`
                }
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
              >
                Show Property Details
              </Link>
            </div>
        )}

      </div>



    </div>
  );
};

export default TenantList;
