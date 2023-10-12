import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "../css/Home1.css";
import img1 from "../assets/img/mncthumbnail1.jpeg";
import img2 from "../assets/img/mncthumbnail2.jpeg";
import img3 from "../assets/img/mncthumbnail3.jpeg";
import { Link } from "react-router-dom";

import ListingItem from "../components/ListingItem";
import { db } from "../firebase";

const Home = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [timer, setTimer] = useState(null);
  const [selectedButton, setSelectedButton] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const images = [img1, img2, img3];
  const [showFilters, setShowFilters] = useState(false);
  const [zipcode, setZip] = useState(false);
  const [city, setCity] = useState(false);

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
  const handleItemClick = (selectedItem) => {
    // Navigate to the target page with the selected item as a URL parameter
    history.push(
      `/afterSearch?selectedItem=${encodeURIComponent(selectedItem)}`
    );
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
    if (searchTerm !== "") {
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

      // const filteredProperties = listings.filter((listing) =>
      //   listing.data.address.toLowerCase().includes(searchTerm.toLowerCase())
      // );

      // setInputValue(searchTerm);
      const filteredSuggestions = listings.filter((listing) => {
        const regexZipCode = /^\d{1,5}$/;
        const regexCity = /^[a-zA-Z\s]+$/;

        if (regexZipCode.test(searchTerm)) {
          setZip("true");
          setCity("false");
          // console.log("zip", {zipcode});
          return listing.data.address
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        if (regexCity.test(searchTerm)) {
          setCity("true");
          setZip("false");
          return listing.data.address
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }

        setZip("false");
        setCity("false");
        return listing.data.address
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });

      // setSuggestions(uniqueSuggestions);
      // setFilteredProperties(filteredProperties);
      if (searchTerm == "") {
        setSuggestions([]);
      } else {
        setSuggestions(filteredSuggestions);
      }
    }
  };

  //Filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
              className={`px-7 py-3 ring-1 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
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
              className={`px-7 py-3 ring-1 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
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
              className={`px-7 py-3 font-medium ring-1 uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
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
        <div style={{}}>
          {/* Search bar + button */}
          {/* <form
          onSubmit={handleSearch}
          className="max-w-md mt-6 w-full text flex justify-center"
        > */}
          {/* Search bar */}
          <div className="w-full px-3 relative" style={{ marginTop: "20px" }}>
            {/* <input
              type="search"
              placeholder={"Search by location or point of interest"}
              value={searchTerm}
              onChange={onChange}
              onSubmit={handleSearch}
              className="text-lg w-full px-4 pr-9 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300"
            ></input> */}
            <input
              type="text"
              id="location-lookup-input"
              className="uc-omnibox-input cx-textField ring-1"
              placeholder="City, Neighborhood, Address, School, ZIP"
              aria-label="city, zip, address, school"
              // value={searchTerm}
              onChange={onChange}
              style={{ width: "380px" }}
            />
            <div>
              {/* {city === "true" ? ( */}
              {/* <ul className="suggestions-list"> */}
              {/* {Array.from(new Set(suggestions.map((suggestion) => {
          const addressParts = suggestion.data.address.split(',');
          const city = addressParts[addressParts.length - 2]?.trim() || 'Unknown City';
          const stateAndZip = addressParts[addressParts.length - 1]?.trim() || 'Unknown State';
          const stateAndZipParts = stateAndZip.split(' ');
          const state = stateAndZipParts[0];
          return `${city}, ${state}`;
        }))).map((cityStatePair, index) => (
      <li key={index}>
        <Link to="/afterSearch">{cityStatePair}</Link>
      </li>
    ))} */}

              {city === "true" ? (
                <>
                  {searchTerm && suggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {Array.from(
                        new Set(
                          suggestions.map((suggestion) => {
                            const addressParts =
                              suggestion.data.address.split(",");
                            const city =
                              addressParts[addressParts.length - 2]?.trim() ||
                              "Unknown City";
                            const stateAndZip =
                              addressParts[addressParts.length - 1]?.trim() ||
                              "Unknown State";
                            const stateAndZipParts = stateAndZip.split(" ");
                            const state = stateAndZipParts[0];
                            return `${city}, ${state}`;
                          })
                        )
                      ).map((cityStatePair, index) => (
                        <li key={index}>
                          <Link
                            to={{
                              pathname: `/afterSearch/${encodeURIComponent(
                                cityStatePair.replace(/ /g, "%20")
                              )}`,
                              state: { fromListing: false, },
                            }}
                          >
                            {cityStatePair}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : zipcode === "true" ? (
                <>
                  {searchTerm && suggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {Array.from(
                        new Set(
                          suggestions.map((suggestion) => {
                            const addressParts =
                              suggestion.data.address.split(",");
                            const stateAndZip =
                              addressParts[addressParts.length - 1]?.trim() ||
                              "Unknown State";
                            return `${stateAndZip}`;
                          })
                        )
                      ).map((cityStatePair, index) => (
                        <li key={index}>
                          <Link
                            to={`/afterSearch/${encodeURIComponent(
                              cityStatePair
                            )}`}
                          >
                            {cityStatePair}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <>
                  {searchTerm && suggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {Array.from(
                        new Set(
                          suggestions.map((suggestion) => {
                            const addressParts =
                              suggestion.data.address.split(",");
                            return `${addressParts}`;
                          })
                        )
                      ).map((cityStatePair, index) => (
                        <li key={index}>
                          <Link
                            to={`/afterSearch/${encodeURIComponent(
                              cityStatePair
                            )}`}
                          >
                            {cityStatePair}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
            {/* Search button */}
            <button
              type="submit"
              className="absolute right-[20px] top-[12px] cursor-pointer"
            >
              <AiOutlineSearch className="text-gray-700 text-2xl" />
            </button>
          </div>
          {/* </form> */}
          {/* filters */}
          {/* <div style={{ marginTop: "25px", marginLeft: "120px" }}>
         <button
         id="close-button"
        className={`px-4 py-2 font-medium uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
          buttonText === "Close Filters" ? "bg-gray-600 text-white" : "bg-white text-black"
        }`}
        onClick={() => {handleClick(); setApplyFilt("false"); setFilter("true"); {toggleFilters()}}}
        style={{ width: "160px", height: "auto" }} >
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
            style={{ fontSize: "14px", width: "170px", height: "35px" }}
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
            style={{ fontSize: "14px", width: "170px", height: "35px" }}
          />
        </div>
        
      </div>
      <span>Beds</span>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "30px"}}>
      <div style={{ display: "flex", alignItems: "center"}}>
            <select
              value={bedroom1}
              onChange={(e) =>{ 
                const selectedValue = e.target.value;
                if(selectedValue !== "NO MIN"){
                  setBedroom1(selectedValue)
                }else{
                  setBedroom1('')
                  value="NO MIN"
                }}}
              style={{ fontSize: "14px", width: "170px", height: "35px" }}
            >
              <option>NO MIN</option>
              {Array.from({ length: 10 }, (_, i) => i+1).map((number) => (
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
              onChange={(e) =>{ 
                const selectedValue = e.target.value;
                if(selectedValue !== "NO MAX"){
                  setBedroom2(selectedValue)
                }else{
                  setBedroom2('')
                  value="NO MAX"
                }}}
              style={{ fontSize: "14px", width: "170px", height: "35px" }}
            >
              <option>NO MAX</option>
              {Array.from({ length: 11 }, (_, i) => i+1).map((number) => (
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
              onChange={(e) =>{ 
                const selectedValue = e.target.value;
                if(selectedValue !== "None"){
                  setSchoolRating(selectedValue)
                }else{
                  setSchoolRating('')
                  value="None"
                }}}
              style={{ fontSize: "14px", width: "170px", height: "35px" }} >
              <option>None</option>
              {Array.from({ length: 10 }, (_, i) => i+1).map((number) => (
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
              onChange={(e) =>{ 
                const selectedValue = e.target.value;
                if(selectedValue !== "NO MIN"){
                setstory1(selectedValue)
              }else{
                setstory1('')
                value="NO MIN"
              }
              } }
              style={{ fontSize: "14px", width: "170px", height: "35px" }}
            >
              <option>NO MIN</option>
              {Array.from({ length: 10 }, (_, i) => i+1).map((number) => (
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
              onChange={(e) =>{ 
                const selectedValue = e.target.value;
                if(selectedValue !== "NO MAX"){
                  setStory2(selectedValue)
                }else{
                  setStory2('')
                  value="NO MAX"
                }}}
              style={{ fontSize: "14px", width: "170px", height: "35px" }}
            >
              <option>NO MAX</option>
              {Array.from({ length: 10 }, (_, i) => i+1).map((number) => (
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
            </div> */}
          {/* </div> */}
        </div>
      </section>
      
      {/* Thumbnail images */}
      <div
        className="mb-6 mx-3 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-white"
        style={{
          position: "relative",
          bottom: "0PX",
          left: "0px",
          right: "0px",
        }}
      >
        <ul className="mx-auto max-w-6xl w-full flex flex-col space-y-3 justify-center items-center sm:flex-row sm:space-x-3 sm:space-y-0">
          {images.map((img, i) => (
            <li
              key={i}
              className="h-[250px] w-full relative  flex justify-between items-center shadow-md hover:shadow-xl rounded overflow-hidden transition-shadow duration-150"
              style={{
                backgroundImage: `url(${img})`, // Set the background image here
                backgroundRepeat: "no-repeat", // Prevent background image from repeating
                backgroundSize: "cover", // Adjust background image size as needed
                height: "200px",
              }}
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
