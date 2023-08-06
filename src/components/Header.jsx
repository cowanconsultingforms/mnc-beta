import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MncLogo from "../assets/svg/mnc-logo.svg";

const Header = () => {
  const [pageState, setPageState] = useState("Sign in");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  // Dynamically changes Sign in button text depending on if user is signed in or not
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign in");
      }
    });
  }, [auth]);

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
        <div className="lg:hidden">
          <button
            className="flex items-center px-3 py-2  rounded text-gray-500 hover:text-black"
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h20v20H0z" fill="none" />
              <path
                d="M2.5 6h15M2.5 10h15M2.5 14h15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <ul className="flex space-x-10">
            {/* Home button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold  border-b-[3px] 
              ${!pathMatchRoute("/") && "text-gray-400 border-b-transparent"} 
              ${pathMatchRoute("/") && "text-black border-b-gray-900 "}`}
              onClick={() => navigate("/")}
            >
              Home
            </li>

            {/* Contact button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                !pathMatchRoute("/map") && "text-gray-400 border-b-transparent"
              } ${pathMatchRoute("/map") && "text-black border-b-gray-900"}`}
              onClick={() => navigate("/map")}
            >
              Map
            </li>

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

            {/* Offers button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px]
              ${
                !pathMatchRoute("/offers") &&
                "text-gray-400 border-b-transparent"
              } 
              ${pathMatchRoute("/offers") && "text-black border-b-gray-900"}`}
              onClick={() => navigate("/offers")}
            >
              Offers
            </li>

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
          <ul className="flex flex-col space-y-2 ml-8">
            {/* Home button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold  border-b-[3px] 
              ${!pathMatchRoute("/") && "text-gray-400 border-b-transparent"} 
              ${pathMatchRoute("/") && "text-black border-b-gray-900 "}`}
              onClick={() => {
                navigate("/");
                toggleMobileMenu();
              }}
            >
              Home
            </li>

            {/* Contact button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                !pathMatchRoute("/map") && "text-gray-400 border-b-transparent"
              } ${pathMatchRoute("/map") && "text-black border-b-gray-900"}`}
              onClick={() => {
                navigate("/map");
                toggleMobileMenu();
              }}
            >
              Map
            </li>

            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                !pathMatchRoute("/contact-us") &&
                "text-gray-400 border-b-transparent"
              } ${
                pathMatchRoute("/contact-us") && "text-black border-b-gray-900"
              }`}
              onClick={() => {
                navigate("/contact-us");
                toggleMobileMenu();
              }}
            >
              Contact Us
            </li>

            {/* Offers button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px]
              ${
                !pathMatchRoute("/offers") &&
                "text-gray-400 border-b-transparent"
              } 
              ${pathMatchRoute("/offers") && "text-black border-b-gray-900"}`}
              onClick={() => {
                navigate("/offers");
                toggleMobileMenu();
              }}
            >
              Offers
            </li>

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
