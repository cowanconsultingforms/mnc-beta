// TODO: Create home page
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import { AiOutlineSearch } from "react-icons/ai";
import ListingItem from "../components/ListingItem";

// Thumbnail image imports
import img1 from "../assets/img/mncthumbnail1.jpeg";
import img2 from "../assets/img/mncthumbnail2.jpeg";
import img3 from "../assets/img/mncthumbnail3.jpeg";

// Import created components
import Slider from "../components/Slider";

const Home = () => {
  const images = [img1, img2, img3];
  const [selectedButton, setSelectedButton] = useState(1);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Updates search bar data
  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Updates buy/rent/sold buttons when one is selected
  // const setSelectedButton = (buttonId) => {
  //   setSelectedButton(buttonId);
  // };

  const getCategory = (button) => {
    switch (button) {
      case 1:
        return "sale";
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(searchTerm);
  };

  return (
    <>
      <Slider />
      <section className="max-w-md mx-auto flex justify-center items-center flex-col mb-6">
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

        {/* Search bar + button */}
        <form
          onSubmit={handleSearch}
          className="max-w-md mt-6 w-full text flex justify-center"
        >
          {/* Search bar */}
          <div className="w-full px-3 relative">
            <input
              type="text"
              placeholder={"Search by borough"}
              value={searchTerm}
              onChange={onChange}
              onSubmit={handleSearch}
              className="text-lg w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300"
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
      <div className="mb-6 mx-3 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-white">
        <ul className="mx-auto max-w-6xl w-full flex flex-col justify-center items-center space-x-3">
          <li>info@mncdevelopment.com</li>
          <li>© MNC Development, Inc. 2008-present. All rights reserved.</li>
          <li>
            31 Buffalo Avenue, Brooklyn, New York 11233 | Phone: 1-718-771-5811
            or 1-877-732-3492 | Fax: 1-877-760-2763 or 1-718-771-5900
          </li>
          <li>
            MNC Development and the MNC Development logos are trademarks of MNC
            Development, Inc. MNC Development, Inc. as a NYS licensed Real
            Estate Broker fully supports the principles of the Fair Housing Act
            and the Equal Opportunity Act. Listing information is deemed
            reliable, but is not guaranteed.
          </li>
        </ul>
      </div>
    </>
  );
};

export default Home;
