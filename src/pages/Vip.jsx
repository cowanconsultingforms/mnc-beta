import {
  collection,
  getDoc,
  getDocs,
  query,
  doc,
  where,
  setDoc,
  updateDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "../css/Home1.css";
import image1 from "../assets/img/mncthumbnail1.jpeg";
import image2 from "../assets/img/mncthumbnail2.jpeg";
import image3 from "../assets/img/mncthumbnail3.jpeg";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { db } from "../firebase";
import { app } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { getMessaging } from "firebase/messaging";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import notification from "../assets/img/notification.png";

// import { createNotification } from "../firebase";
// import { getFirebaseToken, onForegroundMessage } from "../firebase";
import { useContext } from "react";
const Home = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [propertySuggestions, setPropertySuggestions] = useState([]);
  const [timer, setTimer] = useState(null);
  const [selectedButton, setSelectedButton] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const imagesWithCaptions = [
    { src: image1, caption: 'We buy property in any condition anywhere!' },
    { src: image2, caption: 'We sell property at an affordable price.' },
    { src: image3, caption: 'We develop in partnership with the community.' },
  ];
  const [zipcode, setZip] = useState(false);
  const [city, setCity] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [signed, setSigned] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCaption, setSelectedCaption] = useState('');

  const [showToDoIcon, setShowToDoIcon] = useState(true);
 
  const [userId, setUserId] = useState("");

  const notFoundRef = useRef(null);


  const handleImageClick = (img, caption) => {
    setSelectedImage(img);
    setSelectedCaption(caption);
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setSelectedCaption('');
    setTimeout(() =>{
      setSelectedImage(null);
    }, 500);
  };

  const handleNotFoundRef = (e) => {
    if (notFoundRef.current && !notFoundRef.current.contains(e.target)) {
      setNotFound(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleNotFoundRef);
    return () => {
      document.removeEventListener("click", handleNotFoundRef);
    };
  }, []);

  const getUserRole = async (uid) => {
    const userRef = doc(db, "users", uid);

    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role);
      } else {
        setUserRole(null); // Handle the case when the user document doesn't exist
      }
    } catch (error) {
      console.error("Error getting user document:", error);
      setUserRole(null); // Handle errors by setting userRole to a fallback value
    }
  };

  useEffect(() => {
    const call = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid);
          await getUserRole(user.uid);
          setSigned(true);
          if (userRole == "admin") {
            const userRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              if (userData.clear === undefined) {
                await updateDoc(userRef, { clear: false });
              }
            } else {
              const userData = userSnapshot.data();
              if (userData.clear === undefined) {
                await updateDoc(userRef, { clear: false });
              }
            }
            copyNotificationsToUserNotifications(userId);
            fetchUserNotifications(userId);
          }
        } else {
          console.log("User is not authenticated.");
        }
      });
    };

    call();
  }, [userRole, userId]);

  const fetchUserNotifications = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.empty) {
      const userNotificationsData = userSnapshot.get("userNotifications");
      setNotifications(userNotificationsData);
    } else {
      console.log("emptu");
    }
  };

  const copyNotificationsToUserNotifications = async (userId) => {
    const notificationsRef = collection(db, "notifications");
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      if (userData.clear === false) {
        const userNotificationsData =
          userSnapshot.data().userNotifications || [];
        if (userNotificationsData.length === 0) {
          const latestTimestamp = await getLatestTimestamp();
          const querySnapshot = await getDocs(
            query(notificationsRef, where("timestamp", "==", latestTimestamp))
          );
          querySnapshot.forEach((doc) => {
            userNotificationsData.push(doc.data());
          });
          await updateDoc(userRef, {
            userNotifications: userNotificationsData,
          });
        } else {
          // Get the latest timestamp from the userNotificationsData
          const latestTimestamp = userNotificationsData.reduce(
            (latest, notification) =>
              notification.timestamp > latest ? notification.timestamp : latest,
            userNotificationsData[0].timestamp
          );
          // Query for notifications newer than the latestTimestamp
          const querySnapshot = await getDocs(
            query(notificationsRef, where("timestamp", ">", latestTimestamp))
          );
          // Append new notifications to userNotificationsData
          querySnapshot.forEach((doc) => {
            userNotificationsData.push(doc.data());
          });
          // Update the userNotifications field with the combined data
          await updateDoc(userRef, {
            userNotifications: userNotificationsData,
          });
        }
      }
    }
  };

  const getLatestTimestamp = async () => {
    const notificationsCollectionRef = collection(db, "notifications");
    const latestTimestampQuery = query(
      notificationsCollectionRef,
      orderBy("timestamp", "desc"),
      limit(1)
    );
    try {
      const querySnapshot = await getDocs(latestTimestampQuery);
      if (!querySnapshot.empty) {
        const latestNotification = querySnapshot.docs[0].data();
        return latestNotification.timestamp;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting the latest timestamp:", error);
      return null;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        toggleNotifications();
      }
    };
    if (showNotifications) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showNotifications]);

  // // Function to retrieve user role from Firebase Firestore

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const onChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);
  
    if (input.trim() !== "") {
      clearTimeout(timer);
      const newTimer = setTimeout(() => {
        console.log(`Fetching for input: ${input}`);
        fetchProperties(input);
      }, 500); // 500ms delay
      setTimer(newTimer);
    } else {
      setSuggestions([]);
      setPropertySuggestions([]);
    }
  };

  // Get the category based on the selectedButton
  const getCategory = (button) => {
    switch (button) {
      case 1:
        return "buy";
      case 2:
        return "rent";
      case 3:
        return "sold";
      default:
        console.error("Invalid button selected:", button);
        return "";
    }
  };

  const handleCategoryChange = (button) => {
    console.log(`Category changed to button: ${button}`);
    setSelectedButton(button);
  
    // Re-fetch properties to ensure updated "PROPERTIES" section
    if (searchTerm) {
      fetchProperties(searchTerm, button); // Pass the category (button)
    }
  };

  // Submit function for searchbar
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(searchTerm);
  };

  // Filters properties based on searchbar form data
  const fetchProperties = async (searchTerm, selectedCategoryButton) => {
    if (!searchTerm) {
      setPropertySuggestions([]);
      setSuggestions([]);
      return;
    }
  
    const listingRef = collection(db, "vipPropertyListings");
    const category = getCategory(selectedCategoryButton || selectedButton); // Use passed category or current one
    console.log(`Fetching properties for category: ${category}, searchTerm: ${searchTerm}`);
  
    try {
      const querySnap = await getDocs(listingRef);
      const listings = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
  
      console.log("Fetched listings:", listings);
  
      // Filter for property suggestions based on category
      const filteredProperties = listings.filter(
        (listing) =>
          listing.data.type === category &&
          listing.data.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      console.log("Filtered properties:", filteredProperties);
  
      // Filter for cities and ZIP codes suggestions
      const regexZipCode = /^\d{1,5}$/;
      const regexCity = /^[a-zA-Z\s]+$/;
      const filteredSuggestions = listings.filter((listing) => {
        if (regexZipCode.test(searchTerm)) {
          return listing.data.address
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        if (regexCity.test(searchTerm)) {
          return listing.data.address
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        return false;
      });
  
      console.log("Filtered suggestions:", filteredSuggestions);
  
      setPropertySuggestions(filteredProperties);
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setPropertySuggestions([]);
      setSuggestions([]);
    }
  };
  
  useEffect(() => {
    if (searchTerm) {
      fetchProperties(searchTerm, selectedButton); // Re-fetch with the new category
    }
  }, [selectedButton]);
  

  const handleVip = () => {
    navigate("/faqPage");
  };

  const handleNotFound = (e) => {
    e.preventDefault();
    if (searchTerm !== "" && suggestions.length == 0) {
      setNotFound(!notFound);
    }
  };
  

  return (
    <div className="bg-gray-300 min-h-[calc(100vh-48px)] h-auto">
      <section className="max-w-md mx-auto flex justify-center items-center flex-col mb-16 pt-16">
        <div className="w-full px-3">
          {/* Logo */}
          {/* <img src={MncLogo} alt="logo" className="h-full w-full mt-20" /> */}

          <div className="flex flex-row space-x-3 mt-6 disable-hover">
            {/* Buy button */}
            <button
              className={`px-7 py-3 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                selectedButton === 1
                  ? "bg-gray-600 text-white ring-gray-600" // Selected state
                  : "bg-white text-black ring-gray-300" // Non-selected state
              }`}
              onClick={() => handleCategoryChange(1)}
            >
              Buy
            </button>

            {/* Rent button */}
            <button
              className={`px-7 py-3 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                selectedButton === 2
                  ? "bg-gray-600 text-white ring-gray-600"
                  : "bg-white text-black ring-gray-300"
              }`}
              onClick={() => handleCategoryChange(2)}
            >
              Rent
            </button>

            {/* Sold button */}
            <button
              className={`px-7 py-3 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                selectedButton === 3
                  ? "bg-gray-600 text-white ring-gray-600"
                  : "bg-white text-black ring-gray-300"
              }`}
              onClick={() => handleCategoryChange(3)}
            >
              Sold
            </button>
          </div>
        </div>
        <div>
          {/* Search bar */}
          <div className="w-full px-3 relative" style={{ marginTop: "20px" }}>
            <form onSubmit={(e) => handleNotFound(e)}>
              <input
                type="text"
                id="location-lookup-input"
                className="text-lg w-full px-4 pr-9 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300"
                placeholder="City, Neighborhood, Address, School, ZIP"
                aria-label="city, zip, address, school"
                // value={searchTerm}
                onChange={onChange}
                style={{ width: "380px", borderRadius: "6px" }}
              />
              {notFound && (
                <div className=" fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-30">
                  <div ref={notFoundRef} className="w-auto h-auto bg-white p-5">
                    <div className="flex">
                      <p className="font-semibold">
                        We couldn't find '{searchTerm}'
                      </p>
                      <button
                        className="mx-0 font-semibold text-xl ml-auto"
                        onClick={() => {
                          setNotFound(false);
                        }}
                      >
                        X
                      </button>
                    </div>
                    <br></br>
                    <p>
                      Please check the spelling, try clearing the search box, or
                      try reformatting to match these examples:
                    </p>
                    <br></br>
                    <span className="font-semibold">Address:</span> 123 Main St,
                    Seattle, WA <br></br>
                    <span className="font-semibold">Neighborhood: </span>
                    Downtown
                    <br></br> <span className="font-semibold">Zip: </span> 98115{" "}
                    <br></br>
                    <span className="font-semibold">City: </span> 'Seattle' or
                    'Seattle, WA' <br></br>
                    <br></br> Don't see what you're looking for? Your search
                    might be outside our service areas.
                  </div>
                </div>
              )}
              <button
              type="submit"
              className="absolute right-[20px] top-[12px] cursor-pointer"
            >
              <AiOutlineSearch className="text-gray-700 text-2xl" />
            </button>
            </form>
             {/* Search button */}
             
            {/* {notFound && (
                <div className=" fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-30">
                  <div ref={notFoundRef} className="w-auto h-auto bg-white p-5">
                    <div className="flex">
                      <p className="font-semibold">
                        We couldn't find '{searchTerm}'
                      </p>
                      <button
                        className="mx-0 font-semibold text-xl ml-auto"
                        onClick={() => {
                          setNotFound(false);
                        }}
                      >
                        X
                      </button>
                    </div>
                    <br></br>
                    <p>
                      Please check the spelling, try clearing the search box, or
                      try reformatting to match these examples:
                    </p>
                    <br></br>
                    <span className="font-semibold">Address:</span> 123 Main St,
                    Seattle, WA <br></br>
                    <span className="font-semibold">Neighborhood: </span>
                    Downtown
                    <br></br> <span className="font-semibold">Zip: </span> 98115{" "}
                    <br></br>
                    <span className="font-semibold">City: </span> 'Seattle' or
                    'Seattle, WA' <br></br>
                    <br></br> Don't see what you're looking for? Your search
                    might be outside our service areas.
                    {console.log('sssss')}
                  </div>
                </div>
              )} */}
              
              {/* Search Bar Suggestions */}
              <div>
                {searchTerm && (suggestions.length > 0 || propertySuggestions.length > 0) && (
                  <div style={styles.suggestionsDropdown}>
                    <ul style={styles.suggestionsList}>
                      {/* PLACES Section */}
                      {suggestions.length > 0 && (
                        <>
                          <li style={styles.categoryHeader}>PLACES</li>
                          {Array.from(
                            new Set(
                              suggestions.map((suggestion) => {
                                const addressParts = suggestion.data.address.split(",");
                                const city = addressParts[addressParts.length - 2]?.trim() || "Unknown City";
                                const stateAndZip = addressParts[addressParts.length - 1]?.trim() || "Unknown State";
                                const stateAndZipParts = stateAndZip.split(" ");
                                const state = stateAndZipParts[0];
                                return `${city}, ${state}`;
                              })
                            )
                          ).map((cityStatePair, index) => (
                            <li
                              key={`city-${index}`}
                              style={styles.suggestionItem}
                              className="suggestion-item"
                              onClick={() => navigate(`/afterSearch/${encodeURIComponent(cityStatePair.replace(/ /g, "%20"))}`)}
                            >
                              <span style={styles.suggestionIcon}>📍</span> {cityStatePair}
                            </li>
                          ))}
                        </>
                      )}

                      {/* PROPERTIES Section */}
                      {propertySuggestions.length > 0 && (
                        <>
                          <li style={styles.categoryHeader}>PROPERTIES</li>
                          {propertySuggestions.map((property) => (
                            <li
                              key={property.id}
                              style={styles.suggestionItem}
                              className="suggestion-item"
                              onClick={() => navigate(`/category/${property.data.type}/${property.id}`)}
                            >
                              <span style={styles.suggestionIcon}>🏠</span> {property.data.address}
                            </li>
                          ))}
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
          </div>
        </div>
      </section>

      {/* Thumbnail images */}
      <div className="mb-6 mx-3 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-white">
        <ul className="mx-auto max-w-6xl w-full flex flex-col space-y-3 justify-center items-center sm:flex-row sm:space-x-3 sm:space-y-0">
          {imagesWithCaptions.map((imgObj, i) => (
            <li
              key={i}
              className="h-[250px] w-full relative flex justify-between items-center shadow-md hover:shadow-xl rounded overflow-hidden transition-shadow duration-150"
              style={{
                backgroundImage: `url(${imgObj.src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "200px",
              }}
              onClick={() => handleImageClick(imgObj.src, imgObj.caption)}
            >
              <img
                className="grayscale h-[250px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in rounded"
                loading="lazy"
                src={imgObj.src}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Modal pop-up */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={closeModal}
        >
          <div
            className={`relative p-4 rounded-md shadow-lg polaroid-container ${isAnimating ? 'show' : ''}`}
          >
            <div className="polaroid-image-container">
              <img
                src={selectedImage}
                alt="Selected"
                className="polaroid-image"
              />
            </div>
            <p className="polaroid-caption">{selectedCaption}</p>
          </div>
        </div>
      )}

      {/* Footer Information */}
      <div className="justify-center items-center text-center mb-6 mx-3 flex flex-col max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-white">
        <p>info@mncdevelopment.com</p>
        <div className="lg:flex lg:flex-row lg:justify-center lg:items-center lg:space-x-2">
          <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
            <p>All rights reserved.</p>
            <span className="hidden md:block">|</span>
            <p>© MNC Development, Inc. 2008-present.</p>
          </div>
          <span className="hidden lg:block">|</span>
          <p>31 Buffalo Avenue, Brooklyn, New York 11233</p>
        </div>
        <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
          <p>Phone: 1-718-771-5811 or 1-877-732-3492</p>
          <span className="hidden md:block">|</span>
          <p>Fax: 1-877-760-2763 or 1-718-771-5900</p>
        </div>
        <p className=" text-justify [text-align-last:center] ">
          MNC Development and the MNC Development logos are trademarks of MNC
          Development, Inc. MNC Development, Inc. as a NYS licensed Real Estate
          Broker fully supports the principles of the Fair Housing Act and the
          Equal Opportunity Act. Listing information is deemed reliable, but is
          not guaranteed.
        </p>
      </div>
    </div>
  );
};

export default Home;


const styles = {
  suggestionsDropdown: {
    position: "absolute",
    top: "100%",
    left: "0",
    width: "100%",
    maxHeight: "400px",
    overflowY: "auto",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
    zIndex: 20,
    animation: "fadeIn 0.3s ease",
  },
  suggestionsList: {
    listStyle: "none",
    margin: "0",
    padding: "10px",
  },
  categoryHeader: {
    padding: "12px 20px",
    backgroundColor: "#f9fafb",
    fontWeight: "600",
    fontSize: "16px",
    color: "#1f2937",
    borderBottom: "1px solid #e5e7eb",
    textTransform: "uppercase",
  },
  suggestionItem: {
    padding: "12px 20px",
    fontSize: "15px",
    color: "#374151",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "background-color 0.2s ease, transform 0.1s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  suggestionItemHover: {
    backgroundColor: "#f3f4f6",
    transform: "scale(1.02)",
  },
  suggestionIcon: {
    filter: 'grayscale(100%)', // Make the icon greyscale
    marginRight: '8px', // Add spacing
    fontSize: '1.2rem', // Optional: Adjust size
  },
};