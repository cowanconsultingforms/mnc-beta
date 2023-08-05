import MncLogo from "../assets/svg/mnc-logo.svg";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const Header = () => {
  const [pageState, setPageState] = useState("Sign in");
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
        <div>
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
    </div>
  );
};

export default Header;
