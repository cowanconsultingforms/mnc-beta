import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  limit,
  getDocs,
  orderBy,
  where,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import MncLogo from "../assets/svg/mnc-logo.svg";
import { db } from "../firebase";
import TrackDealsProgress from "../pages/TrackDealsProgress";
import notification from "../assets/img/notification.png";

const Header = () => {
  const [pageState, setPageState] = useState("Sign in");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleData, setRoleData] = useState({
    role: "",
  });
  const { role } = roleData;
  const [userRole, setUserRole] = useState("");
  const [userId2, setUserId2] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState();
  const [isToolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [signed, setSigned] = useState(false);
  const notificationsRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toolsClicked, setToolsClicked] = useState(false);
  let userId = "";
  const googleFormUrl =
    "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeJEKEmhkNChaStTLliCwconvj07lyfvKA-fQuIpLqQguApMw/viewform?usp=send_form&pli=1";

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getUserRole = async (uid) => {
    const userRef = doc(db, "users", uid);

    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role);
      } else {
        setUserRole(null); // Handle the case when the user document doesn't exist
      }
    } catch (error) {
      console.error("Error getting user document:", error);
      setUserRole(null); // Handle errors by setting userRole to a fallback value
    }
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId2(user.uid);
        userId = user.uid;
        await getUserRole(user.uid);
        setSigned(true);
        if (userRole == "admin") {
          const userRef = doc(db, "users", userId);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            if (userData.clear === undefined) {
              await updateDoc(userRef, { clear: false });
            }
          } else {
            const userData = userSnapshot.data();
            if (userData.clear === undefined) {
              await updateDoc(userRef, { clear: false });
            }
          }
          copyNotificationsToUserNotifications(userId);
          fetchUserNotifications(userId);
        }
      } else {
        console.log("User is not authenticated.");
      }
    });
  }, [isToolsDropdownOpen, role, navigate, auth, userRole]);

  const fetchUserNotifications = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.empty) {
      const userNotificationsData = userSnapshot.get("userNotifications");
      setNotifications(userNotificationsData);
    } else {
      console.log("empty");
    }
  };
  const copyNotificationsToUserNotifications = async (userId) => {
    const notificationsRef = collection(db, "notifications");
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      if (userData.clear === false) {
        const userNotificationsData =
          userSnapshot.data().userNotifications || [];
        if (userNotificationsData.length === 0) {
          const latestTimestamp = await getLatestTimestamp();
          const querySnapshot = await getDocs(
            query(notificationsRef, where("timestamp", "==", latestTimestamp))
          );
          querySnapshot.forEach((doc) => {
            userNotificationsData.push(doc.data());
          });
          await updateDoc(userRef, {
            userNotifications: userNotificationsData,
          });
        } else {
          // Get the latest timestamp from the userNotificationsData
          const latestTimestamp = userNotificationsData.reduce(
            (latest, notification) =>
              notification.timestamp > latest ? notification.timestamp : latest,
            userNotificationsData[0].timestamp
          );
          // Query for notifications newer than the latestTimestamp
          const querySnapshot = await getDocs(
            query(notificationsRef, where("timestamp", ">", latestTimestamp))
          );
          // Append new notifications to userNotificationsData
          querySnapshot.forEach((doc) => {
            userNotificationsData.push(doc.data());
          });
          // Update the userNotifications field with the combined data
          await updateDoc(userRef, {
            userNotifications: userNotificationsData,
          });
        }
      }
    }
  };

  const getLatestTimestamp = async () => {
    const notificationsCollectionRef = collection(db, "notifications");
    const latestTimestampQuery = query(
      notificationsCollectionRef,
      orderBy("timestamp", "desc"),
      limit(1)
    );
    try {
      const querySnapshot = await getDocs(latestTimestampQuery);
      if (!querySnapshot.empty) {
        const latestNotification = querySnapshot.docs[0].data();
        return latestNotification.timestamp;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting the latest timestamp:", error);
      return null;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        toggleNotifications();
      }
    };
    if (showNotifications) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showNotifications]);

  // // Function to retrieve user role from Firebase Firestore

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const clearNotifications = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { clear: true });
    try {
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        if (userData && userData.userNotifications) {
          const clearedUserNotifications = [];
          await updateDoc(userRef, {
            userNotifications: clearedUserNotifications,
          });
        }
      }
      setNotifications("");
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };
  const toggleToolsDropdown = () => {
    setToolsDropdownOpen(!isToolsDropdownOpen);
  };

  const navigateToSavedSearches = () => {
    setIsDropdownOpen(false);
    navigate("/savedSearches");
  };

  useEffect(() => {
    const auth = getAuth();
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        userId = user.uid;
        setUserId2(user.uid);
        // User is logged in
        setUser("true");
      } else {
        // No user is logged in
        setUser("false");
      }
    });
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Dynamically changes Sign in button text depending on if user is signed in or not
  useEffect(() => {
    // Gets user role
    const fetchUserRole = async () => {
      if (!auth || !auth.currentUser || !auth.currentUser.uid) {
        return; // Return early if not defined
      }
      const docRef = doc(db, "users", auth?.currentUser?.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRoleData({ ...docSnap.data() });
        // console.log("roleee: ", role==="tenant")
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

  const handleSelect = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate(`/taskManager/${user.uid}`);
        setMobileMenuOpen(false);
        setToolsDropdownOpen(false);
      }
    });
  };

  const manageClients = () => {
    navigate(`/manageRequests/${userId}`);
  };

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40 lg:px-16">
      {/* Navigation Bar container */}
      <header className="flex justify-between items-center mx-auto">
        {/* //notification */}
        {signed && (userRole === "admin" || userRole === "agent") && (
          <div>
            <button ref={notificationsRef} onClick={toggleNotifications}>
              <img
                style={{ width: "20px", height: "20px" }}
                src={notification}
                alt="Notification Icon"
              />
            </button>
            {showNotifications && (
              <div
                className="notification-container"
                style={{
                  zIndex: 9999,
                  position: "fixed",
                  top: 2,
                  left: 0,
                  backgroundColor: "rgb(235, 232, 232)",
                  padding: "10px",
                  border: "1px solid #000",
                  width: "auto",
                  height: "auto",
                }}
              >
                <h3>Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    style={{ backgroundColor: "white", fontWeight: "500" }}
                    onClick={() => clearNotifications()}
                  >
                    Clear
                  </button>
                )}
                {notifications && (
                  <ul>
                    {notifications.map((notification, index) => (
                      <li key={index}>
                        {notification.text} -{" "}
                        {notification.timestamp.toDate().toLocaleString()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
        {/* Logo (& home button) */}
        <div>
          <img
            src={MncLogo}
            alt="logo"
            className="h-3 cursor-pointer"
            onClick={() => {
              navigate("/"), setToolsDropdownOpen(false);
            }}
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
        <div className="hidden lg:block" hover:text-blue-500>
          <ul className="flex space-x-10">
            {/* Home button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] 
              ${!pathMatchRoute("/") && "text-gray-400 border-b-transparent"} 
              ${
                pathMatchRoute("/") && "text-black border-b-gray-900 "
              }hover:text-gray-500 hover:border-b-gray-500 transition-all duration-300`}
              onClick={() => {
                navigate("/"), setToolsDropdownOpen(false);
                setToolsClicked(false);
              }}
            >
              Home
            </li>

            {/* Listings button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                !pathMatchRoute("/listings") &&
                "text-gray-400 border-b-transparent"
              } ${pathMatchRoute("/listings") && "text-black border-b-gray-900"}
                hover:text-gray-500 hover:border-b-gray-500 transition-all duration-300`}
              onClick={() => {
                navigate("/listings"),
                  setToolsDropdownOpen(false),
                  setToolsClicked(false);
              }}
            >
              Listings
            </li>

            {/* Vip button */}
            {["vip", "agent", "admin", "superadmin"].includes(role) && (
              <li
                className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                  !pathMatchRoute("/vip") &&
                  "text-gray-400 border-b-transparent"
                } ${pathMatchRoute("/vip") && "text-black border-b-gray-900"}
                hover:text-gray-500 hover:border-b-gray-500 transition-all duration-300`}
                onClick={() => {
                  navigate("/vip"), setToolsDropdownOpen(false);
                  setToolsClicked(false);
                }}
              >
                VIP
              </li>
            )}

            {/* Map button */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                !pathMatchRoute("/map") && "text-gray-400 border-b-transparent"
              } ${pathMatchRoute("/map") && "text-black border-b-gray-900"}
              hover:text-gray-500 hover:border-b-gray-500 transition-all duration-300`}
              onClick={() => {
                navigate("/map"), setToolsDropdownOpen(false);
                setToolsClicked(false);
              }}
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
              }
            hover:text-gray-500 hover:border-b-gray-500 transition-all duration-300`}
              onClick={() => {
                navigate("/contact-us"),
                  setToolsDropdownOpen(false),
                  setToolsClicked(false);
              }}
            >
              Contact Us
            </li>

            {/* //tools */}
            <li
              className={`cursor-pointer  mt-2.5 font-semibold border-b-transparent
              `}
              onClick={() => {
                toggleToolsDropdown(), setToolsClicked(true);
              }}
            >
              <span
                style={{
                  display: "flex",
                  color: toolsClicked ? "black" : "gray",
                }}
              >
                Tools
                <svg
                  className={`w-4 mt-1 ml-1 h-4 fill-current hover:underline focus:underline transform transition-transform duration-300`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 12l-6-6 1.41-1.41L8 9.17l4.59-4.58L14 6z" />
                </svg>
              </span>

              {isToolsDropdownOpen && (
                <div
                  className="dropdown-container absolute text-sm bg-white h-8 shadow-md mr-5 hover:bg-gray-200"
                  style={{ marginLeft: "-60px" }}
                >
                  <Link
                    to="/mortgageCalculator"
                    className=" cursor-pointer block px-2"
                    onClick={() => {
                      navigate("/mortgageCalculator"),
                        setMobileMenuOpen(false),
                        setToolsDropdownOpen(false);
                    }}
                  >
                    Mortgage Calculator
                  </Link>
                </div>
              )}
              {isToolsDropdownOpen && role === "tenant" && (
                <div
                  className="dropdown-container absolute text-sm bg-white h-8 shadow-md mr-5 hover:bg-gray-200  mt-7"
                  style={{ marginLeft: "-60px" }}
                >
                  <a
                    href={googleFormUrl}
                    target="_blank"
                    className="cursor-pointer px-2"
                    onClick={() => {
                      setMobileMenuOpen(false), setToolsDropdownOpen(false);
                    }}
                  >
                    Repair Request Form
                  </a>
                </div>
              )}

              {isToolsDropdownOpen &&
                (role === "agent" ||
                  role === "admin" ||
                  role === "superadmin") && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/manageRequests/${userId2}`),
                          setMobileMenuOpen(false),
                          setToolsDropdownOpen(false);
                      }}
                      className="text-left pl-2 mt-5 dropdown-container absolute bg-white text-sm h-6 shadow-md hover:bg-gray-200"
                      style={{ marginLeft: "-60px", width: "147px" }}
                    >
                      Request Tracker
                    </button>
                  </>
                )}

              {isToolsDropdownOpen &&
                (role === "admin" ||
                  role === "superadmin" ||
                  role === "agent") && (
                  <>
                    <div
                      className="mt-11 dropdown-container absolute bg-white text-sm h-8 shadow-md mr-5 hover:bg-gray-200"
                      style={{ marginLeft: "-60px", width: "147px" }}
                    >
                      <Link
                        to="/trackDealsProgress"
                        className=" cursor-pointer block px-2 pb-0"
                        onClick={() => {
                          navigate("/trackDealsProgress"),
                            setMobileMenuOpen(false),
                            setToolsDropdownOpen(false);
                        }}
                      >
                        Deal Tracker
                      </Link>
                    </div>
                  </>
                )}

              {isToolsDropdownOpen &&
                (role === "admin" ||
                  role === "superadmin" ||
                  role === "agent") && (
                  <>
                    <div
                      className=" dropdown-container absolute bg-white text-sm h-8 shadow-md mr-5 hover:bg-gray-200"
                      style={{
                        marginLeft: "-60px",
                        width: "147px",
                        marginTop: "65px",
                      }}
                    >
                      <button
                        className=" cursor-pointer block px-2 pb-0"
                        onClick={() => {
                          handleSelect();
                        }}
                      >
                        Task Manager
                      </button>
                    </div>
                  </>
                )}
            </li>
            {/* faqPage */}
            <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                !pathMatchRoute("/faqPage") &&
                "text-gray-400 border-b-transparent"
              } ${pathMatchRoute("./faqPage") && "text-black border-b-gray-900"}
            hover:text-gray-500 hover:border-b-gray-500 transition-all duration-300`}
              onClick={() => {
                navigate("./faqPage");
                setToolsClicked(false);
              }}
            >
              FAQ
            </li>
            {/* agents */}
            {/* <li
              className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                !pathMatchRoute("/agents") &&
                "text-gray-400 border-b-transparent"
              } ${pathMatchRoute("/agents") && "text-black border-b-gray-900"}
              hover:text-gray-500 hover:border-b-gray-500 transition-all duration-300`}
              onClick={() => {
                navigate("/agents");
                setToolsClicked(false);
              }}
            >
              Agents
            </li> */}

            {/* Admin button */}
            {["admin", "superadmin"].includes(role) && (
              <li
                className={`cursor-pointer py-3 text-sm font-semibold border-b-[3px] ${
                  !pathMatchRoute("/admin") &&
                  "text-gray-400 border-b-transparent"
                } ${pathMatchRoute("/admin") && "text-black border-b-gray-900"}
                hover:text-gray-500 hover:border-b-gray-500 transition-all duration-300`}
                onClick={() => {
                  navigate("/admin"), setToolsDropdownOpen(false);
                  setToolsClicked(false);
                }}
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
              }
              hover:text-gray-500 hover:border-b-gray-500 transition-all duration-300`}
              onClick={() => {
                navigate("/profile"), setToolsDropdownOpen(false);
                setToolsClicked(false);
              }}
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
                setToolsDropdownOpen(false);
                setToolsClicked(false);
              }}
            >
              Home
            </li>
            {/* VIP button */}
            {["vip", "agent", "admin", "superadmin"].includes(role) && (
              <li
                className={`cursor-pointer py-3 text-lg font-semibold border-b-[3px] border-b-transparent
              ${!pathMatchRoute("/listings") && "text-gray-400"} ${
                  pathMatchRoute("/listings") && "text-black"
                }`}
                onClick={() => {
                  navigate("/listings");
                  toggleMobileMenu();
                  setToolsDropdownOpen(false);
                  setToolsClicked(false);
                }}
              >
                Listings
              </li>
            )}

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
                  setToolsDropdownOpen(false);
                  setToolsClicked(false);
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
                setToolsDropdownOpen(false);
                setToolsClicked(false);
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
                setToolsDropdownOpen(false);
                setToolsClicked(false);
              }}
            >
              Contact Us
            </li>
            {/* tools */}
            <li
              className={`cursor-pointer py-3 text-lg font-semibold border-b-transparent border-b-[3px]
              ${!pathMatchRoute("/mortgageCalculator") && "text-gray-400"} ${
                pathMatchRoute("/mortgageCalculator") && "text-black"
              }`}
              onClick={() => {
                toggleToolsDropdown(), setToolsClicked(true);
              }}
            >
              <span
                style={{
                  display: "flex",
                  color: toolsClicked ? "black" : "gray",
                }}
              >
                Tools
                <svg
                  className={`w-4 mt-2 ml-1 h-4 fill-current hover:underline focus:underline transform transition-transform duration-300`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 12l-6-6 1.41-1.41L8 9.17l4.59-4.58L14 6z" />
                </svg>
              </span>

              {/* Mortgage Calculator */}

              {isToolsDropdownOpen && (
                <div className=" absolute bg-white h-8 shadow-md mr-5 hover:bg-gray-200">
                  <Link
                    to="/mortgageCalculator"
                    className=" cursor-pointer  px-2 "
                    onClick={() => {
                      navigate("/mortgageCalculator"),
                        setMobileMenuOpen(false),
                        setToolsDropdownOpen(false);
                    }}
                  >
                    Mortgage Calculator
                  </Link>
                </div>
              )}
              {/* Repair Request Form */}
              {isToolsDropdownOpen && role === "tenant" && (
                <div className=" absolute bg-white h-8 shadow-md mr-5 hover:bg-gray-200 mt-7">
                  <a
                    href={googleFormUrl}
                    target="_blank"
                    className="cursor-pointer px-2"
                    onClick={() => {
                      setMobileMenuOpen(false), setToolsDropdownOpen(false);
                    }}
                  >
                    Repair Request Form
                  </a>
                </div>
              )}

              {/* Request Tracker */}
              {isToolsDropdownOpen &&
                (role === "agent" ||
                  role === "admin" ||
                  role === "superadmin") && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/manageRequests/${userId2}`),
                          setMobileMenuOpen(false),
                          setToolsDropdownOpen(false);
                      }}
                      className="mt-7 text-left pl-2 dropdown-container absolute bg-white h-8 shadow-md mr-5 hover:bg-gray-200"
                      style={{ width: "184px" }}
                    >
                      Request Tracker
                    </button>
                  </>
                )}

              {/* Deal Tracker */}

              {isToolsDropdownOpen &&
                (role === "admin" ||
                  role === "superadmin" ||
                  role === "agent") && (
                  <>
                    <div
                      className="mt-14 dropdown-container absolute bg-white h-8 shadow-md mr-5 hover:bg-gray-200"
                      style={{ width: "184px" }}
                    >
                      <Link
                        to="/trackDealsProgress"
                        className=" cursor-pointer block px-2"
                        onClick={() => {
                          navigate("/trackDealsProgress"),
                            setMobileMenuOpen(false),
                            setToolsDropdownOpen(false);
                        }}
                      >
                        Deal Tracker
                      </Link>
                    </div>
                  </>
                )}
              {/* Task Manager */}
              {isToolsDropdownOpen &&
                (role === "admin" ||
                  role === "superadmin" ||
                  role === "agent") && (
                  <>
                    <div
                      className=" dropdown-container absolute bg-white text-lg h-8 shadow-md mr-5 hover:bg-gray-200"
                      style={{
                        width: "184px",
                        marginTop: "85px",
                      }}
                    >
                      <button
                        className=" cursor-pointer block px-2 pb-0"
                        onClick={() => {
                          handleSelect();
                        }}
                      >
                        Task Manager
                      </button>
                    </div>
                  </>
                )}
            </li>
            {/* faq */}
            <li
              className={`cursor-pointer py-3 text-lg font-semibold border-b-[3px] ${
                !pathMatchRoute("./faqPage") &&
                "text-gray-400 border-b-transparent"
              } ${
                pathMatchRoute("./faqPage") && "text-black border-b-gray-900"
              }`}
              onClick={() => {
                navigate("./faqPage");
                toggleMobileMenu();
                setToolsDropdownOpen(false);
                setToolsClicked(false);
              }}
            >
              FAQ
            </li>
            {/* agents */}
            {/* <li
              className={`cursor-pointer py-3 text-lg font-semibold border-b-[3px] border-b-transparent ${
                !pathMatchRoute("/agents") &&
                "text-gray-400 border-b-transparent"
              } ${pathMatchRoute("/agents") && "text-black border-b-gray-900"}`}
              onClick={() => {
                navigate("/agents");
                toggleMobileMenu();
                setToolsDropdownOpen(false);
                setToolsClicked(false);
              }}
            >
              Agents
            </li> */}
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
                  setToolsClicked(false);
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
                setToolsDropdownOpen(false);
                setToolsClicked(false);
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
