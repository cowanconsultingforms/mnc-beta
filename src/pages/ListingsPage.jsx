import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ListingItem from "../components/ListingItem";
import VipListingItem from "../components/VipListingItem"; 
import { toast } from "react-toastify";
import "../css/listingPage.css";
import { useNavigate } from "react-router-dom";
import listingVid from "../assets/listingVideo.mp4";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Spinner from "../components/Spinner";
import { useRef } from "react";
import { Link } from "react-router-dom";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [vipListings, setVipListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [topAgents, setTopAgents] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [slideDirection, setSlideDirection] = useState(null);
  const carouselRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);


  const checkNumber = (number) => {
    if (number > topAgents.length - 1) return 0;
    if (number < 0) return topAgents.length - 1;
    return number;
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    }

    if (touchStartX - touchEndX < -50) {
      prevSlide();
    }
  };

  const handleSearch = (searchInput) => {
    setSearchTerm(searchInput);
    const filteredAgents = users.filter((user) => {
      const { address } = user.data;
      const searchValue = searchInput.toLowerCase();
      return (
        user.data.name.toLowerCase().includes(searchValue) ||
        (address?.street && address.street.toLowerCase().includes(searchValue)) ||
        (address?.city && address.city.toLowerCase().includes(searchValue)) ||
        (address?.state && address.state.toLowerCase().includes(searchValue)) ||
        (address?.zipCode && address.zipCode.includes(searchValue))
      );
    });
    setSuggestions(filteredAgents);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      const firstSuggestion = suggestions[0];
      navigate(`/viewProfile/${firstSuggestion.id}`);
    }
  };

  const onChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value !== "") {
      const listingRef = collection(db, "users");
      const q = query(listingRef, where("role", "==", "agent"));
      const querySnap = await getDocs(q);
      let agents = [];
      querySnap.forEach((doc) => {
        agents.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      const filteredSuggestions = agents.filter((agent) => {
        const { address } = agent.data;
        const lowerSearchTerm = value.toLowerCase();
        return (
          agent.data.name.toLowerCase().includes(lowerSearchTerm) ||
          (address?.street && address.street.toLowerCase().includes(lowerSearchTerm)) ||
          (address?.city && address.city.toLowerCase().includes(lowerSearchTerm)) ||
          (address?.state && address.state.toLowerCase().includes(lowerSearchTerm)) ||
          (address?.zipCode && address.zipCode.includes(lowerSearchTerm))
        );
      });
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);
        let users = [];
        querySnap.forEach((doc) => {
          users.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setUsers(users);

        // Filter top agents
        const topAgents = users.filter(user => user.data.isTopAgent === true);
        setTopAgents(topAgents);

        setLoading(false);
      } catch (error) {
        toast.error("Insufficient permissions.");
        navigate("/");
      }
    };

    fetchUsers();
  }, [navigate]);

  const nextSlide = () => {
    setSlideDirection('next');
    setCurrentSlide((prev) => (prev + 1) % topAgents.length);
  };

  const prevSlide = () => {
    setSlideDirection('prev');
    setCurrentSlide((prev) => (prev - 1 + topAgents.length) % topAgents.length);
  };

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
    const updatedListings = listings.filter((listing) => listing.id !== listingID);
    setListings(updatedListings);
    toast.success("The listing was deleted!");
  };

  // Edit listing function
  const onEdit = (listingID) => {
    navigate(`/edit-listing/${listingID}`);
  };

  // VIP listing delete
  const deleteVipListing = async (id) => {
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
          src={listingVid}
          autoPlay
          muted
          loop
        
          
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
      {/* Foreground content */}
      <div className="flex-grow flex flex-col items-center justify-start text-center" style={{ position: "relative", zIndex: 1, paddingTop: "60px" }}>
        <div style={{ maxWidth: "100%" }}>
          {/* Search bar */}
          <h1 className="text-4xl font-bold text-white mb-6" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}>
            Agents
          </h1>
          <form
            className="mt-10 mb-15 flex items-center"
            style={{
              maxWidth: "456px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            onSubmit={handleSubmit}
          >
            <div className="search-bar-container" style={{ width: "100%", margin: "auto" }}>
              <input
                type="search"
                placeholder="Search agents by address or name"
                value={searchTerm}
                onChange={onChange}
                style={{
                  width: "100%",
                  maxWidth: "456px",
                  boxShadow: "10px 10px 10px 0px rgba(1, 1, 0, 0), -10px -10px 10px 0px rgba(0, 0, 0, 0), 0px 10px 10px 0px rgba(0, 0, 0, 0), 0px -10px 10px 0px rgba(0, 0, 0, 0.6)",
                }}
                className="search-bar rounded-md text-lg text-gray-700 bg-white border border-white hover:ring-1 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-gray-300"
              />
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div
                  className="absolute bg-white shadow-lg z-10 w-full mt-1 rounded-md"
                  style={{ width: "100%", maxWidth: "456px" }}
                >
                  {suggestions.map((suggestion) => (
                    <Link
                      key={suggestion.id}
                      to={`/viewProfile/${suggestion.id}`}
                      onClick={() => setSearchTerm(suggestion.data.name)}
                    >
                      <div className="py-2 px-4 hover:bg-gray-200 cursor-pointer">
                        {suggestion.data.name} {suggestion.data.address?.city && `- ${suggestion.data.address.city}`}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </form>
          {/* Agent Carousel */}
          
          <div className="mb-20 relative w-full flex justify-center">
            <div
              className="relative h-80 overflow-hidden md:h-96 flex items-center w-full max-w-3xl"
              ref={carouselRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-700 ease-in-out w-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {topAgents.length > 0 ? (
                  topAgents.map((agent, index) => (
                    <div
                      key={agent.id}
                      className="w-full flex-shrink-0"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <Link to={`/viewProfile/${agent.id}`} className="block w-full h-full">
                        <div className="flex h-full transition-transform duration-300 items-center p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl">
                          {/* Agent Picture */}
                          <div className="w-2/5 flex justify-center items-center">
                            <img
                              src={agent.data.imageUrl || "default-image-url"}
                              className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover filter grayscale"
                              alt={`${agent.data.name}'s profile`}
                            />
                          </div>
                          {/* Testimonial Section */}
                          <div className="w-3/5 flex flex-col justify-center items-center text-white text-center mr-10">
                            {agent.data.testimonial && (
                              <blockquote className="font-semibold italic text-sm md:text-lg flex justify-center items-center h-full">
                                “{agent.data.testimonial}”
                              </blockquote>
                            )}
                            <div className="short-divider">
                            <hr className="w-full border-t border-white" />                            </div>
                            <div className="w-full flex flex-col items-end justify-end">
                              <p className="text-sm font-semibold md:text-md mr-7"> -  {agent.data.name}</p>
                              <p className="text-xs font-semibold md:text-md mr-10">MNC Agent</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-white">No top agents available at the moment.</p>
                )}
              </div>

              {/* Navigation arrows */}
              {topAgents.length > 0 && (
                <>
                  <div className="hidden md:flex absolute top-1/2 left-0 transform -translate-y-1/2 p-2 cursor-pointer z-10 carousel-arrow" onClick={prevSlide}>
                    <FaChevronLeft className="text-white text-4xl" />
                  </div>
                  <div className="hidden md:flex absolute top-1/2 right-0 transform -translate-y-1/2 p-2 cursor-pointer z-10 carousel-arrow" onClick={nextSlide}>
                    <FaChevronRight className="text-white text-4xl" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* VIP Listings Section */}
      {userRole && (userRole === "admin" || userRole === "agent" || userRole === "vipcustomer") && (
        <div>
          <div className="relative z-10 max-w-6xl px-3 mt-6 mx-auto">
            {vipListings.length > 0 ? (
              <>
              <h2 className="text-2xl text-center font-semibold mb-6 text-white">VIP Listings</h2>
              <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 mt-6 mb-6">
                {vipListings.map((vipListing) => (
                  <VipListingItem
                    key={vipListing.id}
                    id={vipListing.id}
                    vipListing={vipListing}
                    onDelete={() =>
                      userRole &&
                      (userRole === "admin" || userRole === "superadmin") &&
                      deleteVipListing(vipListing.id)
                    }
                    onEdit={() =>
                      userRole &&
                      (userRole === "admin" || userRole === "superadmin") &&
                      navigate(`/edit-vip-listing/${vipListing.id}`)
                    }
                    showActions={userRole && (userRole === "admin" || userRole === "superadmin")}
                  />
                ))}
              </ul>
              </>
            ) : (
              <p className="text-center">No VIP listings available.</p>
            )}
          </div>
        </div>
      )}

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
        <p className="text-center text-white text-center" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>
          MNC Development and the MNC Development logos are trademarks of MNC Development, Inc. MNC Development, Inc. as a NYS licensed Real Estate Broker fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Listing information is deemed reliable, but is not guaranteed.
        </p>
      </div>
    </div>
  );
};

export default ListingsPage;
