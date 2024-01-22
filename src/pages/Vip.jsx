import { getAuth } from "firebase/auth";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import img1 from "../assets/img/mncthumbnail1.jpeg";
import img2 from "../assets/img/mncthumbnail2.jpeg";
import img3 from "../assets/img/mncthumbnail3.jpeg";
import "../css/dealProgress.css";
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
  const [notFound, setNotFound] = useState(false);
  const notFoundRef = useRef(null);

  const handleNotFound = (e) => {
    e.preventDefault();
    if (searchTerm !== "" && vipFilteredProperties.length == 0) {
      setNotFound(!notFound);
    }
  };

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
          // toast.error("You cannot access this page.");
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
    const inputValue = e.target.value;

    setSearchTerm(inputValue);

    if (inputValue !== "") {
      // Displays results after 500ms delay
      clearTimeout(timer);
      const newTimer = setTimeout(() => {
        fetchProperties(inputValue);
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

    const filteredSuggestions = vipListings.filter((listing) => {
    if (searchTerm.length >= 2) {
      const address = listing.data?.address?.split(",");
      const stateAndZip =
        address?.length > 1 ? address[address.length - 1].trim() : null;
      const stateFound = stateAndZip?.split(" ");
      const state3 = stateFound && stateFound[0]?.toLowerCase();

      if(state3.trim().length === 2){
      let state = getState(searchTerm?.toLowerCase())?.toLowerCase();
      let state2 = getState2(searchTerm?.toLowerCase())?.toLowerCase();

      if (state === state3 || state2 === state3) {
        if (state.length > 1 || state2.length > 1) {
          return (
            listing.data?.address
              .toLowerCase()
              .includes(state.toLowerCase()) ||
            listing.data?.address
              .toLowerCase()
              .includes(state2.toLowerCase())
          );
        }
      }}
    }
    return listing.data.address
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  })

    // const vipFilteredProperties = vipListings.filter((vipListing) =>
    //   vipListing.data.address.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    setFilteredProperties(filteredSuggestions);
  };

  const getState = (stateFound) => {
    const stateMapping = {
      al: "Alabama",
      ak: "Alaska",
      az: "Arizona",
      ar: "Arkansas",
      ca: "California",
      co: "Colorado",
      ct: "Connecticut",
      de: "Delaware",
      fl: "Florida",
      ga: "Georgia",
      hi: "Hawaii",
      id: "Idaho",
      il: "Illinois",
      in: "Indiana",
      ia: "Iowa",
      ks: "Kansas",
      ky: "Kentucky",
      la: "Louisiana",
      me: "Maine",
      md: "Maryland",
      ma: "Massachusetts",
      mi: "Michigan",
      mn: "Minnesota",
      ms: "Mississippi",
      mo: "Missouri",
      mt: "Montana",
      ne: "Nebraska",
      nv: "Nevada",
      nh: "New Hampshire",
      nj: "New Jersey",
      nm: "New Mexico",
      ny: "New York",
      nc: "North Carolina",
      nd: "North Dakota",
      oh: "Ohio",
      ok: "Oklahoma",
      or: "Oregon",
      pa: "Pennsylvania",
      ri: "Rhode Island",
      sc: "South Carolina",
      sd: "South Dakota",
      tn: "Tennessee",
      tx: "Texas",
      ut: "Utah",
      vt: "Vermont",
      va: "Virginia",
      wa: "Washington",
      wv: "West Virginia",
      wi: "Wisconsin",
      wy: "Wyoming",
    };

    return stateMapping[stateFound] || "";
  };

  const getState2 = (stateName) => {
    const stateReverseMapping = {
      alabama: "AL",
      alaska: "AK",
      arizona: "AZ",
      arkansas: "AR",
      california: "CA",
      colorado: "CO",
      connecticut: "CT",
      delaware: "DE",
      florida: "FL",
      georgia: "GA",
      hawaii: "HI",
      idaho: "ID",
      illinois: "IL",
      indiana: "IN",
      iowa: "IA",
      kansas: "KS",
      kentucky: "KY",
      louisiana: "LA",
      maine: "ME",
      maryland: "MD",
      massachusetts: "MA",
      michigan: "MI",
      minnesota: "MN",
      mississippi: "MS",
      missouri: "MO",
      montana: "MT",
      nebraska: "NE",
      nevada: "NV",
      "new hampshire": "NH", // Corrected
      "new jersey": "NJ", // Corrected
      "new mexico": "NM", // Corrected
      "new york": "NY", // Corrected
      "north carolina": "NC", // Corrected
      "north dakota": "ND", // Corrected
      ohio: "OH",
      oklahoma: "OK",
      oregon: "OR",
      pennsylvania: "PA",
      "rhode island": "RI", // Corrected
      "south carolina": "SC", // Corrected
      "south dakota": "SD", // Corrected
      tennessee: "TN",
      texas: "TX",
      utah: "UT",
      vermont: "VT",
      virginia: "VA",
      washington: "WA",
      "west virginia": "WV", // Corrected
      wisconsin: "WI",
      wyoming: "WY",
    };

    return stateReverseMapping[stateName] || "";
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
         onSubmit={(e) => handleNotFound(e)}
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
                  <br></br> Don't see what you're looking for? Your search might
                  be outside our service areas.
                </div>
              </div>
            )}

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
      {/* <div className="mx-10 flex justify-center mb-10">
        <div className="text-center max-w-4xl">
          <p className="text-xl font-bold">"What to expect"</p>
          <p className="mt-5">
            "A private exclusive listing is an off-market home that can be
            shared by a Compass agent directly with their colleagues and their
            buyers. Property details aren’t disseminated widely and won’t appear
            on public home search websites."
          </p>
          <div className="mt-5 flex justify-center space-x-4 mb-5">
            <div className="max-w-xs relative">
              <p className="text-lg  font-bold mr-4">Discretion</p>
              <p className="text-sm mr-5">
                "Privacy is the ultimate commodity and the decision to sell your
                home is a personal one."
              </p>
              <div className="border-r border-solid border-black absolute top-0 bottom-0 right-0 h-full"></div>
            </div>

            <div className="max-w-xs relative">
              <p className="text-lg font-bold mr-3">Flexibility</p>
              <p className="text-sm mr-5">
                "Decide when to share details about your home, including price,
                more broadly on your own timing."
              </p>
              <div className="border-r border-solid border-black absolute top-0 bottom-0 right-0 h-full"></div>
            </div>

            <div className="max-w-xs relative">
              <p className="text-lg font-bold mr-5">Quality</p>
              <p className="text-sm mr-5">
                "Retain exposure to Compass agents, including premium placement
                on our agent facing platform."
              </p>
              <div className="border-r border-solid border-black absolute top-0 bottom-0 right-0 h-full"></div>
            </div>

            <div className="max-w-xs">
              <p className="text-lg font-bold mr-2">Value</p>
              <p className="text-sm">
                "Get the best offer by testing the market privately to gather
                key insights without your listing getting stale."
              </p>
              {/* No vertical line after the last div */}

      {/* Thumbnail images */}
      {/* <div className="middle" style={{maxWidth:"100%"}}>
        <div
          className="flex justify-center mx-auto "
          style={{ maxWidth: "900px" }}
        >
          <div className="bg-white p-3" style={{maxHeight: "400px"}}>
            <div
              style={{
                backgroundImage: `url(${img1})`,
                backgroundSize: "cover",
                height: "200px",
                width: "350px",
                marginBottom: "10px",
                marginTop: "10px"
              }}
            >
              {" "}
            </div>
            <div
              style={{
                backgroundImage: `url(${img2})`,
                backgroundSize: "cover",
                height: "150px",
                width: "250px",
                marginLeft: "90px",
              }}
            >
              {" "}
            </div>
          </div>
          <div>
            <p className="font-semibold text-2xl mt-20 ml-5 mb-8">
              "Reasons why you might choose to sell your home as a private
              exclusive:
            </p>
            <ul className="list-disc pl-5 ml-5">
              <li>New job or relocation</li>
              <li>Family changes like marriage or divorce</li>
              <li>Evolving financial circumstances</li>
              <li>Health issues</li>
              <li>Valuable belongings like art or furniture</li>
              <li>Opposition to holding open houses"</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-center mx-auto ">
          <p style={{ maxWidth: "600px", marginTop: "50px" }}>
           "My clients and I tested an aggressive price as a Private Exclusive
            on Compass. Another agent brought buyers to see the home and they
            submitted a full price, all cash offer within days. My clients said
            this was the easiest, no hassle sale they’ve experienced!"
          </p>
          <div className="bg-white p-3 mb-2" style={{maxHeight: "225px"}}>
          <div
            style={{
              backgroundImage: `url(${img3})`,
              backgroundSize: "cover",
              height: "200px",
              width: "350px",
              marginBottom: "10px",
            }}
          >
            {" "}
          </div>
          </div>
        </div>
      </div> */}
      {/* Thumbnail images */}
      <div style={{maxWidth: "1150px", margin: "0 auto"}} className=" bg-white">
        <div
          className="mb-6 mx-3 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-3 rounded shadow-lg"
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
        <div className="justify-center items-center text-center mb-6 mx-3 flex flex-col max-w-6xl lg:mx-auto p-3 rounded shadow-lg">
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
            Development, Inc. MNC Development, Inc. as a NYS licensed Real
            Estate Broker fully supports the principles of the Fair Housing Act
            and the Equal Opportunity Act. Listing information is deemed
            reliable, but is not guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vip;
