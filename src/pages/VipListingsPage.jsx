import { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, orderBy, doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import VipListingItem from "../components/VipListingItem";
import listingVid from "../assets/listingVideo.mp4";
import "../css/listingPage.css";
import { db } from "../firebase";

const VipListingsPage = () => {
  const [vipListings, setVipListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        }
      }
    });

    const fetchVIPListings = async () => {
      try {
        const q = query(collection(db, "vipPropertyListings"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const listingsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVipListings(listingsData);
      } catch (error) {
        console.error("Error fetching VIP listings: ", error);
        toast.error("Failed to load VIP listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchVIPListings();
  }, []);

  const deleteVipListing = async (id) => {
    try {
      await deleteDoc(doc(db, "vipPropertyListings", id));
      toast.success("VIP listing deleted!");
      setVipListings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      toast.error("Failed to delete VIP listing.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Video background */}
      <div className="video-container">
        <video
          ref={videoRef}
          src={listingVid}
          autoPlay
          muted
          loop
          controls={false}
          playsInline
          className="w-full h-full object-cover"
        ></video>
      </div>

      {/* VIP Listings */}
      <div
        className="relative z-10 max-w-6xl px-3 mt-6 mx-auto flex-grow"
        style={{ paddingTop: "60px" }}
      >
        <h2 className="text-2xl text-center font-semibold mb-6 text-white">VIP Listings</h2>
        {vipListings.length > 0 ? (
          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {vipListings.map((vipListing) => (
              <VipListingItem
                key={vipListing.id}
                id={vipListing.id}
                vipListing={vipListing}
                onDelete={(id) =>
                  userRole &&
                  (userRole === "admin" || userRole === "superadmin") &&
                  setVipListings((prev) => prev.filter((item) => item.id !== id))
                }
                onEdit={() => navigate(`/edit-vip-listing/${vipListing.id}`)}
                showActions={userRole === "admin" || userRole === "superadmin"}
              />
            ))}
          </ul>
        ) : (
          <p className="text-white text-center">No VIP listings available right now.</p>
        )}
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
          <p className="text-center text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>
            MNC Development and the MNC Development logos are trademarks of MNC Development, Inc. MNC Development, Inc. as a NYS licensed Real Estate Broker fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Listing information is deemed reliable, but is not guaranteed.
          </p>
        </div>
    </div>
  );
};

export default VipListingsPage;
