import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import Filter from "./Filter"

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
            
            {/* Devak's Filter Componenet*/}
            <Filter></Filter>

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
