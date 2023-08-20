import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";

import MncLogo from "../assets/svg/mnc-logo.svg";
import { db } from "../firebase";

const Header = () => {
  const [pageState, setPageState] = useState("Sign in");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleData, setRoleData] = useState({
    role: "",
  });
  const { role } = roleData;
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  // Filter menu data
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [selectedBedrooms, setSelectedBedrooms] = useState("Any");
  const [selectedBathrooms, setSelectedBathrooms] = useState("Any");
  const [selectedPropertyType, setSelectedPropertyType] = useState("Any");
  const [selectedSqft, setSelectedSqft] = useState("Any");
  const [selectedLotSize, setSelectedLotSize] = useState("Any");
  const [selectedStories, setSelectedStories] = useState("Any");
  const [selectedParkingSpaces, setSelectedParkingSpaces] = useState("Any");
  const [hasWasherDryer, setHasWasherDryer] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [hasDoorman, setHasDoorman] = useState(false);

  // Filter menu functions
  const toggleFilter = () => {
    setFilterOpen(!isFilterOpen);
  };

  const handleBedroomsChange = (event) => {
    setSelectedBedrooms(event.target.value);
  };

  const handleBathroomsChange = (event) => {
    setSelectedBathrooms(event.target.value);
  };

  const handlePropertyTypeChange = (event) => {
    setSelectedPropertyType(event.target.value);
  };

  // Dynamically changes Sign in button text depending on if user is signed in or not
  useEffect(() => {
    // Gets user role
    const fetchUserRole = async () => {
      const docRef = doc(db, "users", auth?.currentUser?.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRoleData({ ...docSnap.data() });
      }
    };
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign in");
      }
      fetchUserRole();
    });
  }, [role]);

  // Highlights respective button on navigation bar depending on current page
  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
    return false;
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40 lg:px-16">
      {/* Navigation Bar container */}
      <header className="flex justify-between items-center px-3 mx-auto">
        {/* Logo (& home button) */}
        <div>
          <img
            src={MncLogo}
            alt="logo"
            className="h-3 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden block cursor-pointer py-3 text-[20px] font-semibold  border-b-[3px] border-b-transparent
              ${!isMobileMenuOpen && "text-gray-400"} 
              ${isMobileMenuOpen && "text-black"}`}
          onClick={() => toggleMobileMenu()}
        >
          <AiOutlineMenu />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <ul className="flex space-x-10">
            {/* Home button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] 
              ${!pathMatchRoute("/") && "text-gray-400 border-b-transparent"} 
              ${pathMatchRoute("/") && "text-black border-b-gray-900 "}`}
              onClick={() => navigate("/")}
            >
              Home
            </li>

            {/* Vip button */}
            {["vip", "agent", "admin", "superadmin"].includes(role) && (
              <li
                className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                  !pathMatchRoute("/vip") &&
                  "text-gray-400 border-b-transparent"
                } ${pathMatchRoute("/vip") && "text-black border-b-gray-900"}`}
                onClick={() => navigate("/vip")}
              >
                VIP
              </li>
            )}

            {/* Map button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                !pathMatchRoute("/map") && "text-gray-400 border-b-transparent"
              } ${pathMatchRoute("/map") && "text-black border-b-gray-900"}`}
              onClick={() => navigate("/map")}
            >
              Map
            </li>

            {/* Contact button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                !pathMatchRoute("/contact-us") &&
                "text-gray-400 border-b-transparent"
              } ${
                pathMatchRoute("/contact-us") && "text-black border-b-gray-900"
              }`}
              onClick={() => navigate("/contact-us")}
            >
              Contact Us
            </li>

            {/* Filter menu */}
            <div className="relative ml-auto">
              <button
                onClick={toggleFilter}
                className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                  !isFilterOpen && "text-gray-400 border-b-transparent"
                } ${isFilterOpen && "text-black border-b-gray-900 "}`}
              >
                Filter
              </button>
              {isFilterOpen && (
                <div className="absolute top-[48px] right-0 w-[50vw]  bg-white border rounded p-4 space-y-4">
                  {/* Filter options */}
                  <div className="gap-4">
                    <h2 className="text-lg font-semibold mb-2">
                      Filter Options
                    </h2>

                    {/* Bedrooms */}
                    <label className="block mb-2">
                      Bedrooms:
                      <select
                        value={selectedBedrooms}
                        onChange={(e) => setSelectedBedrooms(e.target.value)}
                        className="ml-2 px-2 py-1 border rounded"
                      >
                        <option value="Any">Any Bedrooms</option>
                        <option value="1">1 Bedroom</option>
                        <option value="2">2 Bedrooms</option>
                        {/* Add more bedroom options */}
                      </select>
                    </label>

                    {/* Bathrooms */}
                    <label className="block mb-2">
                      Bathrooms:
                      <select
                        value={selectedBathrooms}
                        onChange={(e) => setSelectedBathrooms(e.target.value)}
                        className="ml-2 px-2 py-1 border rounded"
                      >
                        <option value="Any">Any Bathrooms</option>
                        <option value="1">1 Bathroom</option>
                        <option value="2">2 Bathrooms</option>
                        {/* Add more bathroom options */}
                      </select>
                    </label>

                    {/* Property Type */}
                    <label className="block mb-2">
                      Property Type:
                      <select
                        value={selectedPropertyType}
                        onChange={(e) =>
                          setSelectedPropertyType(e.target.value)
                        }
                        className="ml-2 px-2 py-1 border rounded"
                      >
                        <option value="Any">Any Property Type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        {/* Add more property type options */}
                      </select>
                    </label>

                    {/* Sqft */}
                    <label className="block mb-2">
                      Sqft:
                      <select
                        value={selectedSqft}
                        onChange={(e) => setSelectedSqft(e.target.value)}
                        className="ml-2 px-2 py-1 border rounded"
                      >
                        <option value="Any">Any Sqft</option>
                        <option value="1000">1000 Sqft</option>
                        <option value="1500">1500 Sqft</option>
                        {/* Add more sqft options */}
                      </select>
                    </label>

                    {/* Lot Size */}
                    <label className="block mb-2">
                      Lot Size:
                      <select
                        value={selectedLotSize}
                        onChange={(e) => setSelectedLotSize(e.target.value)}
                        className="ml-2 px-2 py-1 border rounded"
                      >
                        <option value="Any">Any Lot Size</option>
                        <option value="5000">5000 sqft</option>
                        <option value="10000">10000 sqft</option>
                        {/* Add more lot size options */}
                      </select>
                    </label>

                    {/* Number of Stories */}
                    <label className="block mb-2">
                      Number of Stories:
                      <select
                        value={selectedStories}
                        onChange={(e) => setSelectedStories(e.target.value)}
                        className="ml-2 px-2 py-1 border rounded"
                      >
                        <option value="Any">Any Stories</option>
                        <option value="1">1 Story</option>
                        <option value="2">2 Stories</option>
                        {/* Add more story options */}
                      </select>
                    </label>

                    {/* Parking Spaces */}
                    <label className="block mb-2">
                      Parking Spaces:
                      <select
                        value={selectedParkingSpaces}
                        onChange={(e) =>
                          setSelectedParkingSpaces(e.target.value)
                        }
                        className="ml-2 px-2 py-1 border rounded"
                      >
                        <option value="Any">Any Parking Spaces</option>
                        <option value="1">1 Space</option>
                        <option value="2">2 Spaces</option>
                        {/* Add more parking options */}
                      </select>
                    </label>

                    {/* Amenities */}
                    <h3 className="text-md font-semibold mb-2">Amenities:</h3>

                    {/* Washer/Dryer */}
                    <label className="block">
                      <input
                        type="radio"
                        name="washerDryer"
                        value="yes"
                        checked={hasWasherDryer === "yes"}
                        onChange={() => setHasWasherDryer("yes")}
                        className="mr-2"
                      />
                      Washer/Dryer
                    </label>

                    {/* Doorman */}
                    <label className="block">
                      <input
                        type="radio"
                        name="doorman"
                        value="yes"
                        checked={hasDoorman === "yes"}
                        onChange={() => setHasDoorman("yes")}
                        className="mr-2"
                      />
                      Doorman
                    </label>
                    <label className="block">
                      <input
                        type="radio"
                        name="pets"
                        value="yes"
                        checked={hasPets === "yes"}
                        onChange={() => setHasPets("yes")}
                        className="mr-2"
                      />
                      Pets
                    </label>

                    {/* Add more filter options */}
                  </div>
                </div>
              )}
            </div>

            {/* Admin button */}
            {["admin", "superadmin"].includes(role) && (
              <li
                className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                  !pathMatchRoute("/admin") &&
                  "text-gray-400 border-b-transparent"
                } ${
                  pathMatchRoute("/admin") && "text-black border-b-gray-900"
                }`}
                onClick={() => navigate("/admin")}
              >
                Admin
              </li>
            )}

            {/* Sign in button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px]
              ${
                !pathMatchRoute("/sign-in") &&
                !pathMatchRoute("/profile") &&
                "text-gray-400 border-b-transparent"
              } 
              ${
                (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
                "text-black border-b-gray-900"
              }`}
              onClick={() => navigate("/profile")}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <ul className="flex flex-col space-y-2 ml-3">
            {/* Home button */}
            <li
              className={`cursor-pointer py-3 text-lg font-semibold  border-b-[3px] border-b-transparent 
              ${!pathMatchRoute("/") && "text-gray-400"} 
              ${pathMatchRoute("/") && "text-black"}`}
              onClick={() => {
                navigate("/");
                toggleMobileMenu();
              }}
            >
              Home
            </li>

            {/* VIP button */}
            {["vip", "agent", "admin", "superadmin"].includes(role) && (
              <li
                className={`cursor-pointer py-3 text-lg font-semibold border-b-[3px] border-b-transparent
              ${!pathMatchRoute("/vip") && "text-gray-400"} ${
                  pathMatchRoute("/vip") && "text-black"
                }`}
                onClick={() => {
                  navigate("/vip");
                  toggleMobileMenu();
                }}
              >
                VIP
              </li>
            )}

            {/* Map button */}
            <li
              className={`cursor-pointer py-3 text-lg font-semibold border-b-[3px] border-b-transparent
              ${!pathMatchRoute("/map") && "text-gray-400"} ${
                pathMatchRoute("/map") && "text-black"
              }`}
              onClick={() => {
                navigate("/map");
                toggleMobileMenu();
              }}
            >
              Map
            </li>

            {/* Contact button */}
            <li
              className={`cursor-pointer py-3 text-lg font-semibold border-b-[3px] border-b-transparent
              ${!pathMatchRoute("/contact-us") && "text-gray-400"} ${
                pathMatchRoute("/contact-us") && "text-black"
              }`}
              onClick={() => {
                navigate("/contact-us");
                toggleMobileMenu();
              }}
            >
              Contact Us
            </li>

            {/* Admin button */}
            {["admin", "superadmin"].includes(role) && (
              <li
                className={`cursor-pointer py-3 text-lg font-semibold border-b-[3px] border-b-transparent
              ${!pathMatchRoute("/admin") && "text-gray-400"} ${
                  pathMatchRoute("/admin") && "text-black"
                }`}
                onClick={() => {
                  navigate("/admin");
                  toggleMobileMenu();
                }}
              >
                Admin
              </li>
            )}

            {/* Sign in / Profile button */}
            <li
              className={`cursor-pointer py-3 text-lg font-semibold border-b-[3px] border-b-transparent
              ${
                !pathMatchRoute("/sign-in") &&
                !pathMatchRoute("/profile") &&
                "text-gray-400"
              } 
              ${
                (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
                "text-black"
              }`}
              onClick={() => {
                navigate("/profile");
                toggleMobileMenu();
              }}
            >
              {pageState}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
