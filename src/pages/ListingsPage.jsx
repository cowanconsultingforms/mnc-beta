import { useRef, useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ListingItem from "../components/ListingItem";
import VipListingItem from "../components/VipListingItem";
import { toast } from "react-toastify";
import "../css/listingPage.css";
import { useNavigate } from "react-router-dom";
import listingVid from "../assets/listingVideo.mp4";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [vipListings, setVipListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current
          .play()
          .catch((error) => console.error("Video autoplay prevented:", error));
      }
    };

    playVideo(); // Play on mount

    // Ensure video resumes when the user switches back to the tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        playVideo();
      }
    };

    window.addEventListener("focus", playVideo);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", playVideo);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Fetch user role and VIP listings
  useEffect(() => {
    const fetchUserRole = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setIsAuthenticated(true);
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserRole(userSnap.data().role);
          } else {
            console.log("User document not found.");
          }
        } else {
          setIsAuthenticated(false);
        }
      });
    };

    fetchUserRole();

    // Fetching VIP Listings
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
      }
    };
    fetchVIPListings();
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
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;
    const updatedListings = listings.filter((listing) => listing.id !== listingID);
    setListings(updatedListings);
    toast.success("The listing was deleted!");
  };

  // Edit listing function
  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  };

  const deleteVipListing = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    try {
      const listingRef = doc(db, "vipPropertyListings", id);
      await deleteDoc(listingRef);
      toast.success("VIP listing deleted successfully!");
      setVipListings(vipListings.filter((listing) => listing.id !== id));
    } catch (error) {
      console.error("Error deleting VIP listing: ", error);
      toast.error("Failed to delete VIP listing.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Video Background */}
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

      {/* Foreground content */}
      <div className="flex-grow flex flex-col items-center justify-start text-center" style={{ position: "relative", zIndex: 1, paddingTop: "60px" }}>
        <div style={{ maxWidth: "100%" }}>
          {/* VIP Listings Section */}
          {userRole && (userRole === "admin" || userRole === "agent" || userRole === "vipcustomer") && (
            <div>
              <div className="relative z-10 max-w-6xl px-3 mt-6 mx-auto">
                {vipListings.length > 0 ? (
                  <>
                    <h2 className="text-2xl text-center font-semibold mb-6 text-white mt-20">VIP Listings</h2>
                    <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 mt-6 mb-6">
                      {vipListings.map((vipListing) => (
                        <VipListingItem
                          key={vipListing.id}
                          id={vipListing.id}
                          vipListing={vipListing}
                          onDelete={() => userRole && (userRole === "admin" || userRole === "superadmin") && deleteVipListing(vipListing.id)}
                          onEdit={() => userRole && (userRole === "admin" || userRole === "superadmin") && navigate(`/edit-vip-listing/${vipListing.id}`)}
                          showActions={userRole && (userRole === "admin" || userRole === "superadmin")}
                        />
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-white text-center">No VIP listings available at the moment.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Regular Listings Section */}
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
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                  showActions={isAuthenticated && ["admin", "superadmin"].includes(userRole)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
