import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "../css/Home1.css";
import img1 from "../assets/img/mncthumbnail1.jpeg";
import img2 from "../assets/img/mncthumbnail2.jpeg";
import img3 from "../assets/img/mncthumbnail3.jpeg";

import ListingItem from "../components/ListingItem";
import { db } from "../firebase";

const Home = () => {
  const [timer, setTimer] = useState(null);
  const [selectedButton, setSelectedButton] = useState(1);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const images = [img1, img2, img3];
  const [showFilters, setShowFilters] = useState(false);
  const [input1Value, setInput1Value] = useState("");
  const [input2Value, setInput2Value] = useState("");
  const [bedroom1, setBedroom1] = useState(1);
  const [bedroom2, setBedroom2] = useState(1);
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
  const [parkingChecked, setParkingChecked] = useState(false);
  const [filter, setFilter] = useState();
  const [applyFilt, setApplyFilt] = useState();
  const [clicked, setClicked] = useState(false);
  const [buttonText, setButtonText] = useState("Filters");
  
useEffect(() =>{
  setBedroom2(10);
}, []);

  const handleClick = () => {
    setClicked(!clicked);
    if (clicked) {
      setButtonText("Filters");
    } else {
      setButtonText("Close Filters");
    }
  };
  // Updates search bar data when user types
  const onChange = (e) => {
    setSearchTerm(e.target.value);

    // Displays results after 500ms delay
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      fetchProperties(searchTerm);
    }, 500);
    setTimer(newTimer);
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
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(searchTerm);
  };

  // Filters properties based on searchbar form data
  const fetchProperties = async (searchTerm) => {
    const listingRef = collection(db, "propertyListings");

    // Get the category based on the selectedButton
    const category = getCategory(selectedButton);

    // Build the query based on the selectedButton and the searchTerm
    let q = query(listingRef, where("type", "==", category));

    // If there's a searchTerm, add the where clause for address field
    // If there's a searchTerm, create an array of address tokens and query against it

    const querySnap = await getDocs(q);

    // Adds all listings from query to 'listings' variable
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
        setFilteredProperties(filteredProperties);
  };


  //Filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = async() =>{
    const listingRef = collection(db, "propertyListings");
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
    const prices = (!input1Value || listing.data.regularPrice >= parseInt(input1Value, 10)) &&
                    (!input2Value || listing.data.regularPrice <= parseInt(input2Value, 10));
    const beds = (!bedroom1 || !bedroom2 ||
      (listing.data.bedrooms >= parseInt(bedroom1, 10) && listing.data.bedrooms <= parseInt(bedroom2, 10)));
    const meetsBathroomFilter = (!bathroomCount || listing.data.bathrooms >= bathroomCount);
    const meetsLandFilter = (!land1 || !land2 ||
      (listing.data.landSize >= parseInt(land1, 10) && listing.data.landSize <= parseInt(land2, 10)));
    const meetsYearBuiltFilter = (!year1 || !year2 ||
        (listing.data.yearBuilt >= parseInt(year1, 10) && listing.data.yearBuilt <= parseInt(year2, 10)));
    const meetsSchoolFilter = (!schoolRating || listing.data.schoolRating >= parseInt(schoolRating, 10));
    const meetsStoriesFilter = (!story1 || !story2 ||
          (listing.data.stories >= parseInt(story1, 10) && listing.data.stories <= parseInt(story2, 10)));
    
    
    const meetsParkingFilter = !parkingChecked || listing.data.parking;
    const meetsOutdoorSpaceFilter =  !privateOutdoorSpace || listing.data.privateOutdoorSpace;
    const meetsPoolFilter = !parkingChecked || listing.data.pool;
    const meetsschoolRatingFilter = !parkingChecked || listing.data.schoolRating;
    const meetsDoormanFilter = !parkingChecked || listing.data.doorMan;
    const meetsBasementFilter = !parkingChecked || listing.data.basement;
    const meetsGarageFilter = !parkingChecked || listing.data.garage;
    const meetsAirFilter = !parkingChecked || listing.data.airCondition;

    return prices || meetsSchoolFilter || meetsStoriesFilter || meetsYearBuiltFilter || meetsLandFilter || beds || meetsBathroomFilter || meetsParkingFilter || meetsOutdoorSpaceFilter || meetsPoolFilter || meetsschoolRatingFilter || meetsDoormanFilter || meetsBasementFilter || meetsGarageFilter || meetsAirFilter;
    });
       setFilteredProperties(filteredProperties);
  }

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
  const handleParkingCheckboxChange = () => {
    setParkingChecked(!parkingChecked);
  };

  const closeFilters = () => {
    setShowFilters(false); // Close the filter panel
  };

  return (
    <>
      <section className="max-w-md mx-auto flex justify-center items-center flex-col mb-16 mt-16">
        <div className="w-full px-3">
          {/* Logo */}
          {/* <img src={MncLogo} alt="logo" className="h-full w-full mt-20" /> */}

          <div className="flex flex-row space-x-3 mt-6">
            {/* Buy button */}
            <button
              className={`px-7 py-3 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                selectedButton === 1
                  ? "bg-gray-600 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setSelectedButton(1)}
            >
              Buy
            </button>

            {/* Rent button */}
            <button
              className={`px-7 py-3 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                selectedButton === 2
                  ? "bg-gray-600 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setSelectedButton(2)}
            >
              Rent
            </button>

            {/* Sold button */}
            <button
              className={`px-7 py-3 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                selectedButton === 3
                  ? "bg-gray-600 text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => setSelectedButton(3)}
            >
              Sold
            </button>
          </div>
        </div>
<div style={{display: "flex"}}>
        {/* Search bar + button */}
        <form
          onSubmit={handleSearch}
          className="max-w-md mt-6 w-full text flex justify-center"
        >
          {/* Search bar */}
          <div className="w-full px-3 relative">
            <input
              type="search"
              placeholder={"Search by location or point of interest"}
              value={searchTerm}
              onChange={onChange}
              onSubmit={handleSearch}
              className="text-lg w-full px-4 pr-9 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300"
            ></input>

            {/* Search button */}
            <button
              type="submit"
              className="absolute right-[20px] top-[12px] cursor-pointer"
            >
              <AiOutlineSearch className="text-gray-700 text-2xl" />
            </button>
          </div>
      </form>
{/* filters */}
<div style={{ marginTop: "25px" }}>
         <button
         id="close-button"
        className={`px-4 py-2 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
          buttonText === "Close Filters" ? "bg-gray-600 text-white" : "bg-white text-black"
        }`}
        onClick={() => {handleClick(); setApplyFilt("false"); setFilter("true"); {toggleFilters()}}}
        style={{ width: "120px", height: "auto" }} >
        {buttonText}
      </button>
      </div>
      </div>
      <div className={`filter-panel ${showFilters ? "open" : ""}`}>
        <h1 id = "panel-title">Explore This Neighborhood
         <button id="close-filters2" onClick={()=>{closeFilters();handleClick()}}>Close Filters</button></h1>
         
         &nbsp;<span> Price </span>
        <div style={{ padding: "10px", backgroundColor: "rgb(235, 232, 232)" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px"}}>
        <div style={{ display: "flex", alignItems: "center"}}>
          
          <span>$</span>
          <input
            type="text"
            value={input1Value}
            onChange={(e) => setInput1Value(e.target.value)}
            placeholder="MIN"
            style={{ fontSize: "14px", width: "100px", height: "35px" }}
          />
        </div>
        &nbsp;<span> - </span>&nbsp;
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>$</span>
          <input
            type="text"
            value={input2Value}
            onChange={(e) => setInput2Value(e.target.value)}
            placeholder="MAX"
            style={{ fontSize: "14px", width: "100px", height: "35px" }}
          />
        </div>
        
      </div>
      <span>Beds</span>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "30px"}}>
      <div style={{ display: "flex", alignItems: "center"}}>
            <select
              value={bedroom1}
              onChange={(e) => setBedroom1(e.target.value)}
              style={{ fontSize: "14px", width: "75px", height: "35px" }}
            >
              {Array.from({ length: 11 }, (_, i) => i).map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>
          &nbsp; <span>-</span>&nbsp;
          <div>
            <select
              value={bedroom2}
              onChange={(e) => setBedroom2(e.target.value)}
              style={{ fontSize: "14px", width: "75px", height: "35px" }}
            >
              <option>10</option>
              {Array.from({ length: 11 }, (_, i) => i).map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>
          </div>
          <span>Baths</span>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          
            <button onClick={handleDecrementBathrooms}
            style={{width: "50px", height: "35px", border: "1px solid" }}
            >-</button>
            <input
              type="text"
              value={bathroomCount}
              readOnly
              style={{ width: "400px", height: "35px", textAlign: "center",fontSize: "14px"
              }}
            />
            <button onClick={handleIncrementBathrooms} 
            style={{width: "50px", height: "35px", border: "1px solid" }}
            >+</button>
          </div>
            <div style={{ fontWeight: "bold", marginTop: "20px" }}><span>Property Facts</span></div>
          
      <div style={{ marginTop: "10px"}}><span >Square Feet</span></div>
       <div style={{ display: "flex", alignItems: "center", marginBottom: "10px"}}>
        <div style={{ display: "flex", alignItems: "center"}}>
          <input
            type="text"
            value={land1}
            onChange={(e) => setLand(e.target.value)}
            placeholder="MIN"
            style={{ fontSize: "14px", width: "170px", height: "35px" }}
          />
        </div>
        &nbsp;<span> - </span>&nbsp;
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={land2}
            onChange={(e) => setLand2(e.target.value)}
            placeholder="MAX"
            style={{ fontSize: "14px", width: "170px", height: "35px" }}
          />
        </div>
      </div>

      <div style={{ marginTop: "10px"}}><span >Year Built</span></div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px"}}>
        <div style={{ display: "flex", alignItems: "center"}}>
          <input
            type="text"
            value={year1}
            onChange={(e) => setYear1(e.target.value)}
            placeholder="MIN"
            style={{ fontSize: "14px", width: "170px", height: "35px" }}
          />
        </div>
        &nbsp;<span> - </span>&nbsp;
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={year2}
            onChange={(e) => setYear2(e.target.value)}
            placeholder="MAX"
            style={{ fontSize: "14px", width: "170px", height: "35px" }} />
        </div>
      </div>

      <div style={{ marginTop: "10px", fontWeight: "bold"}}><span >Schools</span></div>
      <span>GreatSchools Rating</span>
      <div>
            <select
              value={schoolRating}
              onChange={(e) => setSchoolRating(e.target.value)}
              style={{ fontSize: "14px", width: "170px", height: "35px" }} >
              <option>10</option>
              {Array.from({ length: 10 }, (_, i) => i).map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "10px"}}><span >Stories</span></div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "30px"}}>
      <div style={{ display: "flex", alignItems: "center"}}>
            <select
              value={story1}
              onChange={(e) => setstory1(e.target.value)}
              style={{ fontSize: "14px", width: "170px", height: "35px" }}
            >
              {Array.from({ length: 11 }, (_, i) => i).map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>
          &nbsp; <span>-</span>&nbsp;
          <div>
            <select
              value={story2}
              onChange={(e) => setStory2(e.target.value)}
              style={{ fontSize: "14px", width: "170px", height: "35px" }}
            >
              <option>10</option>
              {Array.from({ length: 11 }, (_, i) => i).map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>
          </div>

          <div style={{marginBottom: "10px"}}>
            <label>
              <input
                type="checkbox"
                checked={privateOutdoorSpace}
                onChange={handlePrivateOutdoorSpace}
              />&nbsp; Must Have Private Outdoor Space
            </label>
            <div style={{marginTop: "10px"}}>
            <label>
            <input
                type="checkbox"
                checked={parkingChecked}
                onChange={handleParkingCheckboxChange}
              />&nbsp; Must Have Parking Space
            </label>
            </div>
            <div style={{marginTop: "10px"}}>
            <label>
            <input
                type="checkbox"
                checked={doorMan}
                onChange={handleDoorman}
              />&nbsp; Must Have Doorman
            </label>
            </div>
            <div style={{marginTop: "10px"}}>
            <label>
            <input
                type="checkbox"
                checked={pool}
                onChange={handlePool}
              />&nbsp; Must Have Pool
            </label>
            </div>
            <div style={{marginTop: "10px"}}>
            <label>
            <input
                type="checkbox"
                checked={basement}
                onChange={handleBasement}
              />&nbsp; Must Have Basement
            </label>
            </div>
            <div style={{marginTop: "10px"}}>
            <label>
            <input
                type="checkbox"
                checked={elevator}
                onChange={handleElevator}
              />&nbsp; Must Have Elevator
            </label>
            </div>
            <div style={{marginTop: "10px"}}>
            <label>
            <input
                type="checkbox"
                checked={garage}
                onChange={handleGarage}
              />&nbsp; Must Have Garage
            </label>
            </div>
            <div style={{marginTop: "10px"}}>
            <label>
            <input
                type="checkbox"
                checked={airCondition}
                onChange={HandleAircondition}
              />&nbsp; Must Have Air Conditioning
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
              onClick={() => {applyFilters(); setApplyFilt("true")}}
            >
              Apply Filters
            </button>
            </div>
        </div>
        </div>
      </section>

      {/* Search results (only displays when results are found) */}
      {filteredProperties.length > 0 && (
        <div className=" w-full max-w-6xl mx-auto flex items-center justify-center">
          <ul className="w-full sm:grid sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {filteredProperties.map((listing) => (
              <ListingItem
                key={listing.id}
                id={listing.id}
                listing={listing.data}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Thumbnail images */}
      <div className="mb-6 mx-3 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-white">
        <ul className="mx-auto max-w-6xl w-full flex flex-col space-y-3 justify-center items-center sm:flex-row sm:space-x-3 sm:space-y-0">
          {images.map((img, i) => (
            <li
              key={i}
              className="w-full relative flex justify-between items-center shadow-md hover:shadow-xl rounded overflow-hidden transition-shadow duration-150"
            >
              <img
                className="grayscale h-[250px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in rounded"
                loading="lazy"
                src={img}
              />
            </li>
          ))}
        </ul>
      </div>

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

export default Home;
