import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust import if necessary
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ListingItem from "../components/ListingItem"; // Assuming this component displays a listing
import { toast } from "react-toastify"; // Import toast for notifications
import "../css/listingPage.css";
import { useNavigate } from "react-router-dom";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setIsAuthenticated(true);
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserRole(userSnap.data().role); // Get and set the user role
          } else {
            console.log("User document not found.");
          }
        } else {
          setIsAuthenticated(false);
        }
      });
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, "propertyListings");
        const q = query(listingRef, orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);

        const listings = querySnap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        setListings(listings);
      } catch (error) {
        toast.error("Failed to load listings.");
        console.error("Error fetching listings: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Delete listing function
  const onDelete = (listingID) => {
    const updatedListings = listings.filter((listing) => listing.id !== listingID);
    setListings(updatedListings);
    toast.success("The listing was deleted!"); // Show success notification
  };

  // Edit listing function
  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  };

  return (
    <div className="relative font-semibold text-gray-900">
      {/* Video Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/8BBE1Ui8yo4?si=5BNr_sLaivrlXusM&controls=0&autoplay=1&mute=1&loop=1&playlist=8BBE1Ui8yo4&modestbranding=1&vq=hd2160&iv_load_policy=3&showinfo=0&rel=0"
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            top: "0",
            left: "0",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6 text-white">Listings</h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 mt-6 mb-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)} // Pass down onDelete method
                  onEdit={() => onEdit(listing.id)}
                  showActions={isAuthenticated && ["admin", "superadmin"].includes(userRole)}
                />
              ))}
            </ul>
          </>
        )}
        {!loading && listings.length === 0 && <p className="text-center">No listings available.</p>}
      </div>

      {/* Legal Section */}
<div className="relative z-20 justify-center items-center text-center mb-6 mx-3 flex flex-col max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-transparent text-white">
  <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>info@mncdevelopment.com</p> {/* Apply text shadow here */}
  <div className="lg:flex lg:flex-row lg:justify-center lg:items-center lg:space-x-2">
    <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
      <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>All rights reserved.</p> {/* Apply text shadow here */}
      <span className="hidden md:block">|</span>
      <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>© MNC Development, Inc. 2008-present.</p> {/* Apply text shadow here */}
    </div>
    <span className="hidden lg:block">|</span>
    <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>31 Buffalo Avenue, Brooklyn, New York 11233</p> {/* Apply text shadow here */}
  </div>
  <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
    <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>Phone: 1-718-771-5811 or 1-877-732-3492</p> {/* Apply text shadow here */}
    <span className="hidden md:block">|</span>
    <p className="text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>Fax: 1-877-760-2763 or 1-718-771-5900</p> {/* Apply text shadow here */}
  </div>
  <p className="text-justify text-white text-center" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>
    MNC Development and the MNC Development logos are trademarks of MNC Development, Inc. MNC Development, Inc. as a NYS licensed Real Estate Broker fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Listing information is deemed reliable, but is not guaranteed.
  </p>
</div>

    </div>
  );
};

export default ListingsPage;
