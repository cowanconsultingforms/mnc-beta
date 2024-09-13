import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const TenantList = () => {
  const { id } = useParams(); // Get the property ID from the URL
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSingleListing = async (listingId) => {
    try {
      const docRef = doc(db, "propertyListings", listingId);

      // Fetch the document
      const docSnap = await getDoc(docRef);

      // Check if the document exists
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTenants(data.tenants || []); // Assuming `tenants` is an array field in the document
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
    const date = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date
    return date.toLocaleDateString(); // Format as a date string
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
            <div
              key={index}
              className="flex justify-center items-center h-48 w-48 bg-cyan-400 rounded-lg"
            >
              <div className="flex justify-center items-center bg-white gap-4">
                <p>Name: {tenant.name}</p>
                <p>DOB: {tenant.DOB ? formatDate(tenant.DOB) : "N/A"}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TenantList;
