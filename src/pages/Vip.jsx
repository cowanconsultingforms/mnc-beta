import { getAuth } from "firebase/auth";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import img1 from "../assets/img/mncthumbnail1.jpeg";
import img2 from "../assets/img/mncthumbnail2.jpeg";
import img3 from "../assets/img/mncthumbnail3.jpeg";

import { AiOutlineSearch } from "react-icons/ai";
import Spinner from "../components/Spinner";
import VipListingItem from "../components/VipListingItem";
import { db } from "../firebase";

const Vip = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const [timer, setTimer] = useState(null);
  const [selectedButton, setSelectedButton] = useState(1);
  const [vipFilteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const images = [img1, img2, img3];

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
        // Get user info from firestore database
        const userRef = collection(db, "users");
        const userQuery = query(
          userRef,
          where(documentId(), "==", auth.currentUser.uid)
        );
        const user = [];
        const userSnap = await getDocs(userQuery);
        userSnap.forEach((doc) => {
          return user.push(doc.data());
        });

        // Gives access to vip listings if current account has vip role
        if (!["vip", "agent", "admin", "superadmin"].includes(user[0]?.role)) {
          toast.error("You cannot access this page.");
          navigate("/");
        }
        setLoading(false);
      } catch (error) {
        // Does not allow access to vip listings if firestore rules blocks unauthorized user from accessing page
        toast.error("Insufficient permissions.");
        navigate("/");
      }
    };

    fetchUser();
  }, [auth.currentUser.uid, navigate]);

  if (loading) {
    return <Spinner />;
  }

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
    const listingRef = collection(db, "vipPropertyListings");

    // Get the category based on the selectedButton
    const category = getCategory(selectedButton);

    // Build the query based on the selectedButton and the searchTerm
    let q = query(listingRef, where("type", "==", category));

    // If there's a searchTerm, add the where clause for address field
    // If there's a searchTerm, create an array of address tokens and query against it

    const querySnap = await getDocs(q);

    // Adds all listings from query to 'listings' variable
    let vipListings = [];
    querySnap.forEach((doc) => {
      //if searchTerm != null, only return properties that contian the search term in the address

      return vipListings.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    const vipFilteredProperties = vipListings.filter((vipListing) =>
      vipListing.data.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProperties(vipFilteredProperties);
  };

  return (
    <div className="bg-gray-300 min-h-[calc(100vh-48px)] h-auto">
      <section className="max-w-md mx-auto flex justify-center items-center flex-col mb-16 pt-16">
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
      </section>

      {/* Search results (only displays when results are found) */}
      {vipFilteredProperties.length > 0 && (
        <div className=" w-full max-w-6xl mx-auto flex items-center justify-center">
          <ul className="w-full sm:grid sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {vipFilteredProperties.map((vipListing) => (
              <VipListingItem
                key={vipListing.id}
                id={vipListing.id}
                vipListing={vipListing.data}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Thumbnail images */}
      <div className="mx-3 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-white">
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
    </div>
  );
};

export default Vip;
