import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const TenantList = () => {
  const { id } = useParams();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSingleListing = async (listingId) => {
    try {
      const docRef = doc(db, "propertyListings", listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const fetchedTenants = Array.isArray(data.tenants)
          ? data.tenants
          : [data.tenants];
        setTenants(fetchedTenants);
      } else {
        setError("No such document exists.");
      }
    } catch (error) {
      setError("Failed to fetch tenants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleListing(id);
  }, [id]);

  const formatDate = (timestamp) => {
    if (timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleDateString();
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl px-4">
        {tenants.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full">
            No tenants found for this property
          </p>
        ) : (
          tenants.map((tenant, index) => (
            <Link
              key={tenant.id || index}
              to={`/property-management/${id}/tenant/${tenant.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center"
              style={{ height: "auto" }} // Ensures box height is only as large as needed
            >
              <p className="text-lg font-semibold text-gray-800">
                {tenant.name}
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
    </div>
  );
};

export default TenantList;
