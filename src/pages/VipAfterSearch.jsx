import {
    collection,
    getDocs,
    getDoc,
    query,
    where,
    updateDoc,
  } from "firebase/firestore";
  import { useEffect, createContext, useState, useRef } from "react";
  import { arrayUnion } from "firebase/firestore";
  import { AiOutlineSearch } from "react-icons/ai";
  import "../css/Home1.css";
  import img1 from "../assets/img/mncthumbnail1.jpeg";
  import img2 from "../assets/img/mncthumbnail2.jpeg";
  import img3 from "../assets/img/mncthumbnail3.jpeg";
  import React from "react";
  import ListingItem from "../components/ListingItem";
  import { db } from "../firebase";
  import { useParams, useNavigate, useLocation } from "react-router-dom";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import "../css/PopUp.css";
  import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  import { doc, serverTimestamp, setDoc } from "firebase/firestore";
  import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
  import { toast } from "react-toastify";
  
  const VipAfterSearch = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
    const [formData2, setFormData2] = useState({
      email2: "",
      password2: "",
    });
    const { email2, password2 } = formData2;
    const { name, email, password } = formData;
    const { location } = useParams();
    const [suggestions, setSuggestions] = useState([]);
    const [timer, setTimer] = useState(null);
    const [selectedButton, setSelectedButton] = useState(1);
    const [searchTerm, setSearchTerm] = useState(location);
    const images = [img1, img2, img3];
    const [showFilters, setShowFilters] = useState(false);
    const [input1Value, setInput1Value] = useState("");
    const [input2Value, setInput2Value] = useState("");
    const [bedroom1, setBedroom1] = useState();
    const [bedroom2, setBedroom2] = useState();
    const [bathroomCount, setBathroomCount] = useState(1);
    const [land1, setLand] = useState("");
    const [land2, setLand2] = useState("");
    const [year1, setYear1] = useState("");
    const [year2, setYear2] = useState("");
    const [schoolRating, setSchoolRating] = useState("");
    const [story1, setstory1] = useState("");
    const [story2, setStory2] = useState("");
    const [doorMan, setDoorman] = useState("");
    const [pool, setPool] = useState("");
    const [basement, setBasement] = useState("");
    const [privateOutdoorSpace, setPrivateOutdoorSpace] = useState("");
    const [elevator, setElevator] = useState("");
    const [garage, setGarage] = useState("");
    const [airCondition, setAirCondition] = useState("");
    const [smartHome, setSmartHome] = useState("");
    const [ecoFriendly, setEcoFriendly] = useState("");
    const [parkingChecked, setParkingChecked] = useState(false);
    const [filter, setFilter] = useState();
    const [applyFilt, setApplyFilt] = useState();
    const [clicked, setClicked] = useState(false);
    const [buttonText, setButtonText] = useState("Filters");
    const [zipcode, setZip] = useState(false);
    const [city, setCity] = useState(false);
    const [save, setSave] = useState("false");
    const [showPopup, setShowPopup] = useState(false);
    const [signUP, setSignUp] = useState(false);
    const [signIn, setSignIn] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [sortName, setSortName] = useState("");
    const [notFound, setNotFound] = useState(false);
    const notFoundRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState("Buy"); // Default to "Buy"
  
    const handleNotFound = (e) => {
      e.preventDefault();
      if (searchTerm !== "" && suggestions.length == 0) {
        setNotFound(!notFound);
      }
    };
  
    useEffect(() => {
      fetchProperties();
    }, [searchTerm, selectedCategory]);   
    
  
    useEffect(() => {
      async function fetchData() {
        const listingRef = collection(db, "vipPropertyListings");
        const category = getCategory(selectedButton);
        let q = query(listingRef, where("type", "==", category));
        const querySnap = await getDocs(q);
  
        let listings = [];
        querySnap.forEach((doc) => {
          //if searchTerm != null, only return properties that contian the search term in the address
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
  
        const filteredProperties = listings.filter((listing) =>
          listing.data.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filteredProperties);
      }
  
      fetchData();
    }, []);
  
    const handleClick = () => {
      setClicked(!clicked);
      if (clicked) {
        setButtonText("Filters");
      } else {
        setButtonText("Close Filters");
      }
    };
    const handleSave = () => {
      setSave("true");
    };
  
    // Updates search bar data when user types
    const onChange = (e) => {
      setSearchTerm(e.target.value);
  
      if (searchTerm !== "") {
        // Displays results after 500ms delay
        clearTimeout(timer);
        const newTimer = setTimeout(() => {
          fetchProperties(searchTerm);
        }, 500);
        setTimer(newTimer);
      }
    };
  
    // notification
    const handleSaveClick = () => {
      setTimeout(() => {
        setNotification("Saved");
      }, 1000);
    };
  
    const onSubmitSignIn = async (e) => {
      e.preventDefault();
      try {
        const auth = getAuth();
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email2,
          password2
        );
        if (userCredentials.user) {
          // navigate("/");
          saveFilters();
          handleCloseSignIn();
          closePopup();
        }
      } catch (error) {
        toast.error("Invalid user credentials.");
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
      }
    };
  
    const createAddressTokens = (searchTerm) => {
      // Split the searchTerm into individual tokens (words) and filter out empty strings
      const tokens = searchTerm.split(" ").filter((token) => token.trim() !== "");
      return tokens.map((token) => token.toLowerCase());
    };
  
    // Submit function for searchbar
    const handleSearch = (event) => {
      event.preventDefault();
      fetchProperties(selectedCategory, searchTerm); // Refetch properties on search
    };
  
    // Function to fetch properties by category
    const fetchProperties = async () => {
      try {
        console.log("Fetching properties with:", { selectedCategory, searchTerm });
    
        // Fetch all properties from Firestore
        const querySnapshot = await getDocs(collection(db, "vipPropertyListings"));
        const allProperties = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
    
        console.log("Fetched all properties:", allProperties);
    
        // Filter properties by selected category and search term
        const filteredSuggestions = allProperties.filter((property) => {
          const matchesCategory =
            !selectedCategory || property.data.type.toLowerCase() === selectedCategory.toLowerCase();
          const matchesSearchTerm =
            !searchTerm ||
            property.data.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.data.name.toLowerCase().includes(searchTerm.toLowerCase());
    
          return matchesCategory && matchesSearchTerm;
        });
    
        console.log("Filtered suggestions:", filteredSuggestions);
    
        setSuggestions(filteredSuggestions);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };  
    
    
    const handleCategoryChange = (category) => {
      setSelectedCategory(category);
    };
  
    if (typeof selectedCategory !== "string" || typeof searchTerm !== "string") {
      console.error("Invalid filters:", { selectedCategory, searchTerm });
      return;
    }  
  
    //Filters
    const toggleFilters = () => {
      setShowFilters(!showFilters);
    };
  
    const applyFilters = async () => {
      const listingRef = collection(db, "vipPropertyListings");
      const category = getCategory(selectedButton);
      let q = query(listingRef, where("type", "==", category));
      const querySnap = await getDocs(q);
  
      let listings = [];
      querySnap.forEach((doc) => {
        //if searchTerm != null, only return properties that contian the search term in the address
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
  
      const filteredProperties = listings.filter((listing) => {
        const prices =
          (!input1Value ||
            listing.data.regularPrice >= parseInt(input1Value, 10)) &&
          (!input2Value ||
            listing.data.regularPrice <= parseInt(input2Value, 10));
        const beds =
          (!bedroom1 || listing.data.bedrooms >= parseInt(bedroom1, 10)) &&
          (!bedroom2 || listing.data.bedrooms <= parseInt(bedroom2, 10));
        const meetsBathroomFilter =
          !bathroomCount || listing.data.bathrooms >= bathroomCount;
        const meetsLandFilter =
          (!land1 || listing.data.landSize >= parseInt(land1, 10)) &&
          (!land2 || listing.data.landSize <= parseInt(land2, 10));
        const meetsYearBuiltFilter =
          (!year1 || listing.data.yearBuilt >= parseInt(year1, 10)) &&
          (!year2 || listing.data.yearBuilt <= parseInt(year2, 10));
        const meetsStoriesFilter =
          (!story1 || listing.data.stories >= parseInt(story1, 10)) &&
          (!story2 || listing.data.stories <= parseInt(story2, 10));
        const meetsSchoolFilter =
          !schoolRating ||
          listing.data.schoolRating >= parseInt(schoolRating, 10);
  
        const meetsParkingFilter = (listing) =>
          !parkingChecked || listing.data.parking;
        const meetsOutdoorSpaceFilter = (listing) =>
          !privateOutdoorSpace || listing.data.privateOutdoorSpace;
        const meetsPoolFilter = (listing) => !pool || listing.data.pool;
        const meetsDoormanFilter = (listing) => !doorMan || listing.data.doorMan;
        const meetsBasementFilter = (listing) =>
          !basement || listing.data.basement;
        const meetsGarageFilter = (listing) => !garage || listing.data.garage;
        const meetsAirFilter = (listing) =>
          !airCondition || listing.data.airConditioning;
        const meetsSmartFilter = (listing) =>
          !smartHome || listing.data.smartHome;
        const meetsEcoFilter = (listing) =>
          !ecoFriendly || listing.data.ecoFriendly;
        // return prices && beds && meetsschoolRatingFilter && meetsBathroomFilter && meetsLandFilter && meetsYearBuiltFilter && meetsStoriesFilter;
        return (
          prices &&
          meetsSchoolFilter &&
          meetsStoriesFilter &&
          meetsYearBuiltFilter &&
          meetsLandFilter &&
          beds &&
          meetsBathroomFilter &&
          meetsParkingFilter(listing) &&
          meetsOutdoorSpaceFilter(listing) &&
          meetsPoolFilter(listing) &&
          meetsSchoolFilter &&
          meetsDoormanFilter(listing) &&
          meetsBasementFilter(listing) &&
          meetsGarageFilter(listing) &&
          meetsAirFilter(listing) &&
          meetsSmartFilter(listing) &&
          meetsEcoFilter(listing)
        );
      });
      setSuggestions(filteredProperties);
    };
  
    const handleIncrementBathrooms = () => {
      setBathroomCount(bathroomCount + 1);
    };
  
    const handleDecrementBathrooms = () => {
      if (bathroomCount > 1) {
        setBathroomCount(bathroomCount - 1);
      }
    };
  
    const handleDoorman = () => {
      setDoorman(!doorMan);
    };
  
    const handlePrivateOutdoorSpace = () => {
      setPrivateOutdoorSpace(!privateOutdoorSpace);
    };
  
    const handlePool = () => {
      setPool(!pool);
    };
  
    const handleBasement = () => {
      setBasement(!basement);
    };
  
    const handleElevator = () => {
      setElevator(!elevator);
    };
  
    const handleGarage = () => {
      setGarage(!garage);
    };
  
    const HandleAircondition = () => {
      setAirCondition(!airCondition);
    };
  
    const HandleSmartHome = () => {
      setSmartHome(!smartHome);
    };
  
    const HandleEcoFriendly = () => {
      setEcoFriendly(!ecoFriendly);
    };
  
    const handleParkingCheckboxChange = () => {
      setParkingChecked(!parkingChecked);
    };
  
    const closeFilters = () => {
      setShowFilters(false); // Close the filter panel
    };
  
    const closePopup = () => {
      setShowPopup(false);
    };
  
    const flattenArray = (arr) => {
      return arr.reduce((acc, val) => {
        return Array.isArray(val)
          ? acc.concat(flattenArray(val))
          : acc.concat(val);
      }, []);
    };
  
    const saveFilters = async () => {
      const auth = getAuth();
      // Check if the user is authenticated
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
  
          if (userDocSnapshot.exists()) {
            const existingSavedProperties =
              userDocSnapshot.data().savedProperties || [];
            const flattenedSavedProperties = existingSavedProperties.map(
              (property) => property
            );
  
            // Extract the IDs from the existing properties for deduplication
            const existingPropertyIds = new Set(
              flattenedSavedProperties.map((property) => property.id)
            );
  
            // Deduplicate the new properties and filter out existing ones
            const uniqueNewProperties = suggestions.filter(
              (listing) => !existingPropertyIds.has(listing.id)
            );
  
            // Merge the unique new properties with the existing properties
            const updatedSavedProperties =
              flattenedSavedProperties.concat(uniqueNewProperties);
  
            await updateDoc(userDocRef, {
              savedProperties: updatedSavedProperties,
            });
  
            handleSaveClick();
            toast.success(
              "The search results got saved into Go To / Save Searches!"
            );
          } else {
            console.log("User document does not exist.");
          }
        } else {
          console.log("User is not authenticated.");
          setShowPopup(true);
        }
      });
    };
  
    const handleCloseSignUp = () => {
      setSignUp(false);
    };
    const handleCloseSignIn = () => {
      setSignIn(false);
    };
    const handleSignIn = () => {
      setSignIn(true);
    };
    // Add new account to authenticated users and firestore database
    const onSubmitSignUp = async (e) => {
      e.preventDefault();
  
      try {
        const auth = getAuth();
        // Adds user to authenticated accounts
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
  
        // Update displayName with name field
        updateProfile(auth.currentUser, {
          displayName: name,
        });
  
        const user = userCredentials.user;
        const formDataCopy = { ...formData };
  
        delete formDataCopy.password; // Prevent unencrypted password from being stored in database
        formDataCopy.timestamp = serverTimestamp(); // Adds time of account creation
  
        // Adds account credentials to firestore database
        await setDoc(doc(db, "users", user.uid), formDataCopy);
        // navigate("/");
        saveFilters();
        handleCloseSignUp();
        closePopup();
      } catch (error) {
        toast.error("Something went wrong with the registration.");
      }
    };
  
    const onChange2 = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    };
    const onChange3 = (e) => {
      setFormData2((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    };
    //   const handleItemClick = async(item)=>{
    //     const listingRef = collection(db, "propertyListings");
    //     const category = getCategory(selectedButton);
    //     let q = query(listingRef, where("type", "==", category));
    //     const querySnap = await getDocs(q);
  
    //     let listings = [];
    //     querySnap.forEach((doc) => {
    //       //if searchTerm != null, only return properties that contian the search term in the address
    //       return listings.push({
    //         id: doc.id,
    //         data: doc.data(),
    //       });
    //     });
    // console.log("handle:")
    // const filteredProperties = listings.filter((listing) =>
    //       listing.data.address.toLowerCase().includes(item.toLowerCase())
    //     );
    //     setSuggestions(filteredProperties);
    //   }
    const handleSignUP = () => {
      setSignUp(true);
    };
    const sort = () => {
      setIsSortOpen(!isSortOpen);
    };
  
    const sortByInput = async (input) => {
      const listingRef = collection(db, "vipPropertyListings");
      const category = getCategory(selectedButton);
      let q = query(listingRef, where("type", "==", category));
      const querySnap = await getDocs(q);
  
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
  
      const filteredProperties = listings
        .filter((listing) =>
          listing.data.address.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          const propertyA = parseInt(a.data[input], 10);
          const propertyB = parseInt(b.data[input], 10);
  
          if (propertyA < propertyB) {
            return -1;
          }
          if (propertyA > propertyB) {
            return 1;
          }
          return 0;
        });
      setSuggestions(filteredProperties);
    };
  
    const sortByInputDescending = async (input) => {
      const listingRef = collection(db, "vipPropertyListings");
      const category = getCategory(selectedButton);
      let q = query(listingRef, where("type", "==", category));
      const querySnap = await getDocs(q);
  
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
  
      const filteredProperties = listings
        .filter((listing) =>
          listing.data.address.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          const propertyA = parseInt(a.data[input], 10);
          const propertyB = parseInt(b.data[input], 10);
  
          if (propertyA < propertyB) {
            return 1;
          }
          if (propertyA > propertyB) {
            return -1;
          }
          return 0;
        });
      setSuggestions(filteredProperties);
    };
  
    return (
      <>
        <section className="max-w-md mx-auto flex justify-center items-center flex-col mb-16 mt-16">
          <div className="w-full px-3">
            {/* Logo */}
            {/* <img src={MncLogo} alt="logo" className="h-full w-full mt-20" /> */}
  
            <div className="flex flex-row space-x-3 mt-6 disable-hover">
              {/* Buy button */}
              <button
                className={`px-7 py-3 ring-1 font-medium uppercase shadow-md rounded transition duration-150 ease-in-out w-full 
        ${selectedCategory === "buy" 
          ? "bg-gray-600 text-white ring-gray-600" 
          : "bg-white text-black ring-gray-300 hover:bg-gray-100 hover:text-gray-800"}`}
                onClick={() => {
                  setSelectedCategory("buy");
                  fetchProperties();
                }}
              >
                Buy
              </button>
  
              {/* Rent button */}
              <button
                className={`px-7 py-3 ring-1 font-medium uppercase shadow-md rounded transition duration-150 ease-in-out w-full 
        ${selectedCategory === "rent" 
          ? "bg-gray-600 text-white ring-gray-600" 
          : "bg-white text-black ring-gray-300 hover:bg-gray-100 hover:text-gray-800"}`}
                onClick={() => {
                  setSelectedCategory("rent");
                  fetchProperties();
                }}
              >
                Rent
              </button>
  
              {/* Sold button */}
              <button
                className={`px-7 py-3 ring-1 font-medium uppercase shadow-md rounded transition duration-150 ease-in-out w-full 
        ${selectedCategory === "sold" 
          ? "bg-gray-600 text-white ring-gray-600" 
          : "bg-white text-black ring-gray-300 hover:bg-gray-100 hover:text-gray-800"}`}
                onClick={() => {
                  setSelectedCategory("sold");
                  fetchProperties();
                }}
              >
                Sold
              </button>
            </div>
          </div>
          <div>
            <form
              onSubmit={(e) => handleNotFound(e)}
              className="max-w-md mt-6 w-full text flex justify-center"
            >
              {/* Search bar */}
              <div
                className="w-full px-3 relative"
                style={{ width: "400px", marginLeft: "5px" }}
              >
                <input
                  type="search"
                  placeholder={"Search by location or point of interest"}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetchProperties(); // Trigger property fetch
                  }}
                  className="text-lg w-full px-4 ring-1 pr-9 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300"
                ></input>
  
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
                {/* Search button */}
                <button
                  type="submit"
                  className="absolute right-[20px] top-[12px] cursor-pointer"
                  onClick={fetchProperties} // Fetch properties on search button click
                >
                  <AiOutlineSearch className="text-gray-700 text-2xl" />
                </button>
              </div>
            </form>
            {/* filters */}
            <div style={{ marginTop: "20px", marginLeft: "55px" }}>
              <button
                id="close-button"
                className={`px-4 py-2 font-medium uppercase shadow-md rounded ring-1 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  buttonText === "Close Filters"
                    ? "bg-gray-600 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => {
                  handleClick();
                  setApplyFilt("false");
                  setFilter("true");
                  {
                    toggleFilters();
                  }
                }}
                style={{ width: "140px", height: "auto" }}
              >
                {buttonText}
              </button>
            </div>
            {/* save search */}
            <div>
              <button
                className={`px-4 py-2 font-medium uppercase shadow-md rounded ring-1 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                  save === "false"
                    ? "bg-gray-600 text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => {
                  {
                    saveFilters();
                  }
                }}
                style={{ marginLeft: "225px", width: "140px", height: "auto" }}
              >
                Save Search
              </button>
            </div>
            {showPopup && (
              <div className="popup-container">
                <div className="popup">
                  <button
                    onClick={closePopup}
                    className="mb-2 pl-2 pr-2 bg-gray-600 text-white"
                  >
                    Close
                  </button>
                  <h2>Sign In or Create an Account</h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "20px",
                    }}
                  >
                    {/* Add your sign-in and create account forms here */}
                    <button
                      className={` signIn-button  font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out `}
                      onClick={handleSignIn}
                    >
                      Sign In
                    </button>
                    <button
                      className={` signUp-button  font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out`}
                      onClick={handleSignUP}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            )}
  
            <div className={`filter-panel ${showFilters ? "open" : ""}`}>
              <span id="panel-title" className="font-semibold ">
                Explore This Neighborhood
                <button
                  id="close-filters2"
                  className="px-4 py-2 font-medium uppercase shadow-md rounded ring-1 hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out bg-gray-600 text-white flex items-center justify-center"
                  onClick={() => {
                    closeFilters();
                    handleClick();
                  }}
                >
                  Close
                </button>
              </span>
  
              <div
                style={{ padding: "10px", backgroundColor: "rgb(235, 232, 232)" }}
              >
                {/* sort by */}
  
                <button
                  onClick={sort}
                  className={` font-medium uppercase hover:underline focus:underline transition duration-150 ease-in-out flex items-center ${
                    isSortOpen === "false"
                      ? "bg-gray-600 text-white"
                      : "bg-white text-black"
                  }`}
                  style={{
                    width: "auto",
                    display: "flex",
                    height: "30px",
                    marginTop: "-14px",
                    border: "none",
                    background: "none",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <span className="mr-2">Sort by</span>
                    <svg
                      className={`w-4 h-4 fill-current hover:underline focus:underline transform transition-transform duration-300 ${
                        isSortOpen ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 12l-6-6 1.41-1.41L8 9.17l4.59-4.58L14 6z" />
                    </svg>
                    <span className="mr-2"> {sortName}</span>
                  </div>
                </button>
  
                {isSortOpen && (
                  <div
                    className=" ring-1 bg-white absolute z-10 w-48 grid grid-cols-2 gap-2  shadow-lg  ring-2 ring-black ring-opacity-5"
                    style={{ marginLeft: "0px" }}
                  >
                    <button className="ring-1 px-4  text-left text-sm text-gray-700 hover:bg-gray-100">
                      Ascending
                    </button>
                    <button className="ring-1 px-4  text-left text-sm  text-gray-700 hover:bg-gray-100">
                      Descending
                    </button>
                    <button
                      onClick={() => {
                        sortByInput("regularPrice");
                        setIsSortOpen(false);
                        setSortName("PRICE");
                      }}
                      className="px-4 py-2  text-left  text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Price
                    </button>
                    <button
                      onClick={() => {
                        sortByInputDescending("regularPrice");
                        setIsSortOpen(false);
                        setSortName("PRICE");
                      }}
                      className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Price
                    </button>
                    <button
                      onClick={() => {
                        sortByInput("bedrooms");
                        setIsSortOpen(false);
                        setSortName("BEDS");
                      }}
                      className=" px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Beds
                    </button>
                    <button
                      onClick={() => {
                        sortByInputDescending("bedrooms");
                        setIsSortOpen(false);
                        setSortName("BEDS");
                      }}
                      className=" px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Beds
                    </button>
                    <button
                      onClick={() => {
                        sortByInput("bathrooms");
                        setIsSortOpen(false);
                        setSortName("BATHS");
                      }}
                      className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Baths
                    </button>
                    <button
                      onClick={() => {
                        sortByInputDescending("bathrooms");
                        setIsSortOpen(false);
                        setSortName("BATHS");
                      }}
                      className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Baths
                    </button>
  
                    <button
                      onClick={() => {
                        sortByInput("landSize");
                        setIsSortOpen(false);
                        setSortName("SQ. FT.");
                      }}
                      className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Square Feet
                    </button>
                    <button
                      onClick={() => {
                        sortByInputDescending("landSize");
                        setIsSortOpen(false);
                        setSortName("SQ. FT.");
                      }}
                      className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Square Feet
                    </button>
                    <button
                      onClick={() => {
                        sortByInput("yearBuilt");
                        setIsSortOpen(false);
                        setSortName("YR. BLT.");
                      }}
                      className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Year Built
                    </button>
                    <button
                      onClick={() => {
                        sortByInputDescending("yearBuilt");
                        setIsSortOpen(false);
                        setSortName("YR. BLT.");
                      }}
                      className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Year Built
                    </button>
                  </div>
                )}
                <span> Price </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>$</span>
                    <input
                      type="text"
                      value={input1Value}
                      onChange={(e) => setInput1Value(e.target.value)}
                      placeholder="MIN"
                      className="text-sm w-42 h-9 rounded-md border border-gray-300 px-2"
                    />
                  </div>
                  &nbsp;<span> - </span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>$</span>
                    <input
                      type="text"
                      value={input2Value}
                      onChange={(e) => setInput2Value(e.target.value)}
                      placeholder="MAX"
                      className="text-sm w-42 h-9 rounded-md border border-gray-300 px-2"
                    />
                  </div>
                </div>
                <span>Beds</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "30px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <select
                      value={bedroom1}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (selectedValue !== "NO MIN") {
                          setBedroom1(selectedValue);
                        } else {
                          setBedroom1("");
                          value = "NO MIN";
                        }
                      }}
                      style={{ fontSize: "14px", width: "170px", height: "35px", borderRadius:"8px", border: "0px solid" }}
                    >
                      <option>NO MIN</option>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (number) => (
                          <option key={number} value={number}>
                            {number}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  &nbsp; <span>-</span>&nbsp;
                  <div>
                    <select
                      value={bedroom2}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (selectedValue !== "NO MAX") {
                          setBedroom2(selectedValue);
                        } else {
                          setBedroom2("");
                          value = "NO MAX";
                        }
                      }}
                      style={{ fontSize: "14px", width: "170px", height: "35px", borderRadius:"8px", border: "0px solid" }}
                    >
                      <option>NO MAX</option>
                      {Array.from({ length: 11 }, (_, i) => i + 1).map(
                        (number) => (
                          <option key={number} value={number}>
                            {number}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
                <span>Baths</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <button
                    onClick={handleDecrementBathrooms}
                    style={{ width: "50px", height: "35px", border: "0px solid", borderRadius:"8px" }}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={bathroomCount}
                    readOnly
                    style={{
                      width: "400px",
                      height: "35px",
                      textAlign: "center",
                      fontSize: "14px",
                      borderRadius:"8px",
                      border: "0px solid",
                    }}
                  />
                  <button
                    onClick={handleIncrementBathrooms}
                    style={{ width: "50px", height: "35px", border: "0px solid", borderRadius:"8px" }}
                  >
                    +
                  </button>
                </div>
                <div style={{ fontWeight: "bold", marginTop: "20px" }}>
                  <span>Property Facts</span>
                </div>
  
                <div style={{ marginTop: "10px" }}>
                  <span>Square Feet</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      value={land1}
                      onChange={(e) => setLand(e.target.value)}
                      placeholder="MIN"
                      className="text-sm w-42 h-9 rounded-md border border-gray-300 px-2"
                    />
                  </div>
                  &nbsp;<span> - </span>&nbsp;
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      value={land2}
                      onChange={(e) => setLand2(e.target.value)}
                      placeholder="MAX"
                      className="text-sm w-42 h-9 rounded-md border border-gray-300 px-2"
                    />
                  </div>
                </div>
  
                <div style={{ marginTop: "10px" }}>
                  <span>Year Built</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      value={year1}
                      onChange={(e) => setYear1(e.target.value)}
                      placeholder="MIN"
                      className="text-sm w-42 h-9 rounded-md border border-gray-300 px-2"
                    />
                  </div>
                  &nbsp;<span> - </span>&nbsp;
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      value={year2}
                      onChange={(e) => setYear2(e.target.value)}
                      placeholder="MAX"
                      className="text-sm w-42 h-9 rounded-md border border-gray-300 px-2"
                    />
                  </div>
                </div>
  
                <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                  <span>Schools</span>
                </div>
                <span>Great Schools Rating</span>
                <div>
                  <select
                    value={schoolRating}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue !== "None") {
                        setSchoolRating(selectedValue);
                      } else {
                        setSchoolRating("");
                        value = "None";
                      }
                    }}
                    style={{ fontSize: "14px", width: "170px", height: "36px", borderRadius:"8px", border: "0px solid" }}
                  >
                    <option>None</option>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div style={{ marginTop: "10px" }}>
                  <span>Stories</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "30px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <select
                      value={story1}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (selectedValue !== "NO MIN") {
                          setstory1(selectedValue);
                        } else {
                          setstory1("");
                          value = "NO MIN";
                        }
                      }}
                      style={{ fontSize: "14px", width: "170px", height: "36px", borderRadius:"8px", border: "0px solid" }}
                    >
                      <option>NO MIN</option>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (number) => (
                          <option key={number} value={number}>
                            {number}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  &nbsp; <span>-</span>&nbsp;
                  <div>
                    <select
                      value={story2}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        if (selectedValue !== "NO MAX") {
                          setStory2(selectedValue);
                        } else {
                          setStory2("");
                          value = "NO MAX";
                        }
                      }}
                      style={{ fontSize: "14px", width: "170px", height: "35px", borderRadius:"8px", border: "0px solid" }}
                    >
                      <option>NO MAX</option>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (number) => (
                          <option key={number} value={number}>
                            {number}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
  
                <div style={{ marginBottom: "10px" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={privateOutdoorSpace}
                      onChange={handlePrivateOutdoorSpace}
                    />
                    &nbsp; Must Have Private Outdoor Space
                  </label>
                  <div style={{ marginTop: "10px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={parkingChecked}
                        onChange={handleParkingCheckboxChange}
                      />
                      &nbsp; Must Have Parking Space
                    </label>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={doorMan}
                        onChange={handleDoorman}
                      />
                      &nbsp; Must Have Doorman
                    </label>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={pool}
                        onChange={handlePool}
                      />
                      &nbsp; Must Have Pool
                    </label>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={basement}
                        onChange={handleBasement}
                      />
                      &nbsp; Must Have Basement
                    </label>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={elevator}
                        onChange={handleElevator}
                      />
                      &nbsp; Must Have Elevator
                    </label>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={garage}
                        onChange={handleGarage}
                      />
                      &nbsp; Must Have Garage
                    </label>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={airCondition}
                        onChange={HandleAircondition}
                      />
                      &nbsp; Must Have Air Conditioning
                    </label>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={smartHome}
                        onChange={HandleSmartHome}
                      />
                      &nbsp; Must Have Smart Technology
                    </label>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={ecoFriendly}
                        onChange={HandleEcoFriendly}
                      />
                      &nbsp; Must Have Eco-Friendly/Green Technology
                    </label>
                  </div>
                </div>
                <div style={{ marginTop: "10px" }}>
                  <button
                    className={`px-4 py-1 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                      applyFilt === "true"
                        ? "bg-gray-600 text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => {
                      applyFilters();
                      setApplyFilt("true");
                    }}
                  >
                    Apply Filters
                  </button>
                  <button
                    id="close-filters3"
                    className="px-4 py-1 mt-4 bg-white text-black border border-gray-300 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full"
                    onClick={() => {
                      closeFilters();
                      handleClick();
                    }}
                  >
                    Close Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </section>
  
        {signUP && (
          <div className="popup-container">
            <div className="popup">
              <button className="close-button2" onClick={handleCloseSignUp}>
                Close
              </button>
              <form onSubmit={onSubmitSignUp}>
                {/* Name form box */}
                <input
                  className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
                  type="text"
                  id="name"
                  value={name}
                  onChange={onChange2}
                  placeholder="Full name"
                />
                {/* Email form box */}
                <input
                  className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
                  type="email"
                  id="email"
                  value={email}
                  onChange={onChange2}
                  placeholder="Email address"
                />
  
                <div className="relative mb-6">
                  {/* Password form box */}
                  <input
                    className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={onChange2}
                    placeholder="Password"
                  />
  
                  {/* Show/hide password icon */}
                  {showPassword ? (
                    <AiFillEyeInvisible
                      className="absolute right-3 top-3 text-xl cursor-pointer"
                      onClick={() => setShowPassword((prevState) => !prevState)}
                    />
                  ) : (
                    <AiFillEye
                      className="absolute right-3 top-3 text-xl cursor-pointer"
                      onClick={() => setShowPassword((prevState) => !prevState)}
                    />
                  )}
                </div>
                {/* Sign up button */}
                <button
                  className="w-full bg-gray-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
                  type="submit"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        )}
  
        {signIn && (
          <div className="popup-container">
            <div className="popup">
              <button className="close-button2" onClick={handleCloseSignIn}>
                Close
              </button>
              <form onSubmit={onSubmitSignIn}>
                {/* Email form box */}
                <input
                  className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
                  type="email"
                  id="email2"
                  value={email2}
                  onChange={onChange3}
                  placeholder="Email address"
                />
  
                <div className="relative mb-6">
                  {/* Password form box */}
                  <input
                    // className="w-full text-lg px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                    className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300"
                    type={showPassword ? "text" : "password"}
                    id="password2"
                    value={password2}
                    onChange={onChange3}
                    placeholder="Password"
                  />
  
                  {/* Show/hide password icon */}
                  {showPassword ? (
                    <AiFillEyeInvisible
                      className="absolute right-3 top-3 text-xl cursor-pointer"
                      onClick={() => setShowPassword((prevState) => !prevState)}
                    />
                  ) : (
                    <AiFillEye
                      className="absolute right-3 top-3 text-xl cursor-pointer"
                      onClick={() => setShowPassword((prevState) => !prevState)}
                    />
                  )}
                </div>
  
                {/* Sign in button */}
                <button
                  className="w-full bg-gray-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
                  type="submit"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        )}
  
        
        {/* Render Search Results */}
        {suggestions.length > 0 ? (
          <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
            <ul className="w-full sm:grid sm:grid-cols-2 lg:grid-cols-3 mb-6">
              {suggestions.map((suggestion) => (
                <ListingItem
                  key={suggestion.id}
                  id={suggestion.id}
                  listing={suggestion.data}
                  isVip={true}
                />
              ))}
            </ul>
          </div>
        ) : (
          <div className="w-full max-w-6xl mx-auto flex items-center justify-center mt-6 mb-20">
            <div className="bg-gray-50 shadow-lg rounded-lg p-6 w-full max-w-xl">
              <p className="text-gray-700 text-lg font-medium text-center">
                No properties found for{" "}
                <span className="font-bold">
                  "{searchTerm}"
                </span>{" "}
                in{" "}
                <span className="font-bold capitalize">
                  {selectedCategory}
                </span>
                .
              </p>
              <p className="text-gray-500 font-semibold text-sm text-center mt-2">
                Try searching with a different term or explore other categories.
              </p>
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
      </>
    );
  };
  
  export default VipAfterSearch;
  