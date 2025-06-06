import { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, orderBy, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ListingItem from "../components/ListingItem";
import { toast } from "react-toastify";
import "../css/listingPage.css";
import { useNavigate } from "react-router-dom";
import listingVid from "../assets/listingVideo.mp4";
import { FaBars } from "react-icons/fa";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const buyRef = useRef(null);
  const rentRef = useRef(null);
  const soldRef = useRef(null);

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
    toast.success("The listing was deleted!");
  };

  // Edit listing function
  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      const yOffset = -80; 
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setSidebarOpen(false);
    }
  };

  const listingsToBuy = listings.filter((listing) => listing.data.type === "buy");
  const listingsToRent = listings.filter((listing) => listing.data.type === "rent");
  const listingsSold = listings.filter((listing) => listing.data.type === "sold");

  if (loading) {
    return <div>Loading...</div>;
  }

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

                        {/*<iframe
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/8BBE1Ui8yo4?si=5BNr_sLaivrlXusM&controls=0&autoplay=1&mute=1&loop=1&playlist=8BBE1Ui8yo4&modestbranding=1&vq=hd2160&iv_load_policy=3&showinfo=0&rel=0"
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        /> */}


      </div>

      {/* Hamburger Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-30 text-white text-2xl bg-black bg-opacity-40 rounded p-2"
      >
        <FaBars />
      </button>

      {/* Collapsible Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-47 pt-36 px-4 transition-transform duration-300 z-20 bg-black bg-opacity-60 text-white shadow-lg transform ${

          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-lg font-bold mb-4">Navigate</h2>
        <ul className="space-y-3">
          <li>
            <button onClick={() => scrollToSection(buyRef)} className="w-full text-left hover:text-blue-300">Listings To Buy</button>
          </li>
          <li>
            <button onClick={() => scrollToSection(rentRef)} className="w-full text-left hover:text-blue-300">Listings To Rent</button>
          </li>
          <li>
            <button onClick={() => scrollToSection(soldRef)} className="w-full text-left hover:text-blue-300">Listings Sold</button>
          </li>
        </ul>
      </div>
      <div style={{ position: "relative", zIndex: 1, marginTop: "20px", textAlign: "center" }}></div>
      {/* Foreground content */}
      <div className="flex-grow flex flex-col items-center justify-start text-center" style={{ position: "relative", zIndex: 1, paddingTop: "40px" }}>
        <div style={{ maxWidth: "100%" }}></div>

        <div ref={buyRef} className="relative z-10 max-w-6xl px-3 mt-6 mx-auto">
          {listingsToBuy.length > 0 && (
            <>
              <h2 className="text-2xl text-center font-semibold mb-6 text-white">Listings To Buy</h2>
              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 mt-6 mb-6">
                {listingsToBuy.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                    showActions={isAuthenticated && ["admin", "superadmin"].includes(userRole)}
                    videoRef={videoRef}
                    source="listingsPage"
                  />
                ))}
              </ul>
            </>
          )}
        </div>

        <div ref={rentRef} className="relative z-10 max-w-6xl px-3 mt-6 mx-auto">
          {listingsToRent.length > 0 && (
            <>
              <h2 className="text-2xl text-center font-semibold mb-6 text-white">Listings To Rent</h2>
              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 mt-6 mb-6">
                {listingsToRent.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                    showActions={isAuthenticated && ["admin", "superadmin"].includes(userRole)}
                    videoRef={videoRef}
                    source="listingsPage"
                  />
                ))}
              </ul>
            </>
          )}
        </div>
        {/* Regular Listings Section */}
        <div ref={soldRef} className="relative z-10 max-w-6xl px-3 mt-6 mx-auto">
          {listingsSold.length > 0 && (
            <>
              <h2 className="text-2xl text-center font-semibold mb-6 text-white">Listings Sold</h2>
              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 mt-6 mb-6">
                {listingsSold.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                    showActions={isAuthenticated && ["admin", "superadmin"].includes(userRole)}
                    videoRef={videoRef}
                    source="listingsPage"
                  />
                ))}
              </ul>
            </>
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
    </div>
  );
};

export default ListingsPage;
