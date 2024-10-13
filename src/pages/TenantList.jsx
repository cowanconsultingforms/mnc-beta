import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const TenantList = () => {
  const { id } = useParams(); // Get the property ID from the URL
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSingleListing = async (listingId) => {
    try {
      const docRef = doc(db, "propertyListings", listingId);
      const docSnap = await getDoc(docRef);

      // Check if the document exists
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(data); // Log data to check its structure

        // Ensure tenants is an array
        const fetchedTenants = Array.isArray(data.tenants) ? data.tenants : [data.tenants];
        setTenants(fetchedTenants); // Set tenants from fetched data
      } else {
        console.log("No such document!");
        setError("No such document exists.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setError("Failed to fetch tenants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleListing(id);
  }, [id]);

  // Function to format Firebase Timestamp
  const formatDate = (timestamp) => {
    if (timestamp) {
      const date = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date
      return date.toLocaleDateString(); // Format as a date string
    }
    return "N/A"; // Return N/A if no timestamp
  };

  if (loading) {
    return <p>Loading tenants...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex justify-center bg-slate-400">
      <div className="flex gap-12">
        {tenants.length === 0 ? (
          <p>No tenants found for this property</p>
        ) : (
          tenants.map((tenant, index) => (
            <Link
              key={tenant.id || index} // Use tenant.id if available, else fallback to index
              to={`/property-management/${id}/tenant/${tenant.id}`}
              className="flex justify-center items-center h-48 w-48 bg-cyan-400 rounded-lg"
            >
              <div className="flex justify-center items-center bg-white gap-4 p-4">
                <p>Name: {tenant.name}</p>
                <p>DOB: {tenant.DOB ? formatDate(tenant.DOB) : "N/A"}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TenantList;
