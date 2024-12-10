import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SavedSearches from "./pages/SavedSearches";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Admin from "./pages/Admin";
import ContactUs from "./pages/ContactUs";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import Map from "./pages/Map";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Vip from "./pages/Vip";
import CreateVipListing from "./pages/VipCreateListing";
import VipEditListing from "./pages/VipEditListing";
import VipListing from "./pages/VipListing";
import AfterSearch from "./pages/AfterSearch";
import MortgageCalculator from "./pages/MortgageCalculator";
import config from "./pages/config";
import MessageParser from "./pages/MessageParser";
import ActionProvider from "./pages/ActionProvider";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { useState } from "react";
import "../src/css/chat.css";
import chatIcon from "../src/assets/img/ssss.png";
import ManageUsersProfile from "./pages/ManageUsersProfile";
import EditUser from "./pages/EditAllUsers";
import ViewProfile from "./pages/ViewProfile";
// import Agents from "./pages/Agents";
import FAQPage from "./pages/Faq";
import ManageRequests from "./pages/ManageRequests";
import TrackDealsProgress from "./pages/TrackDealsProgress";
import TrackIndividualDealsProgress from "./components/TrackIndividualDealsProgress";
import MyProfile from "./pages/MyProfile";
import TaskManager from "./pages/TaskManager";
import PropertyManagement from "./pages/PropertyManagement";
import TenantList from "./pages/TenantList";
import ListingsPage from "./pages/ListingsPage";
import TenantDetail from "./pages/TenantDetail";
import AddTenant from "./pages/AddTenant";
import Payments from "./components/Payments";
import UserDocuments from "./pages/userDocuments";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ViewPaymentHistory from "./pages/ViewPaymentHistory";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [iconVisible, setIconVisible] = useState(true);
  // const location = useLocation();
  const [showHelp, setShowHelp] = useState(true);

  const handleHelpClick = () => {
    setShowHelp(!showHelp);
  };

  const handleChatClick = () => {
    setChatOpen(!chatOpen);
    setIconVisible(false);
  };

  const handleIconClick = () => {
    setChatOpen(false);
    setIconVisible(true);
  };

  // useEffect(() => {
  //   return async() => {
  //     try {
  //       const response = await fetch(' https://us-central1-mnc-development.cloudfunctions.net/updateUsersFunction', {
  //         method: 'POST', // or 'GET' depending on your function's setup
  //       });

  //       if (response.ok) {
  //         console.log('Update triggered successfully');
  //       } else {
  //         console.error('Failed to trigger update');
  //       }
  //     } catch (error) {
  //       console.error('Error triggering update:', error);
  //     }
  //   };
  // }, []);

  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          {/* Displays corresponding component when navigating to specified path */}
          <Route path="/" element={<Home />} />
          <Route path="/mortgageCalculator" element={<MortgageCalculator />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/afterSearch/:location" element={<AfterSearch />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/vip-create-listing" element={<CreateVipListing />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/map" element={<Map />} />
          <Route path="/savedSearches" element={<SavedSearches />} />
          {/* Navigates to dynamic listing URL */}
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          />

          {/* Navigates to dynamic vip listing URL */}
          <Route
            path="/vip/category/:categoryName/:listingId"
            element={<VipListing />}
          />

          {/* Navigates to /profile if user is signed in, otherwise navigates to /sign-in */}
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Navigates to /create-listing if user is signed in, otherwise navigates to /sign-in */}
          <Route path="/create-listing" element={<PrivateRoute />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>

          {/* Navigates to /edit-listing when user clicks on the edit icon otherwise navigates to /sign-in */}
          <Route path="/edit-listing" element={<PrivateRoute />}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>

          <Route path="/edit-vip-listing" element={<PrivateRoute />}>
            <Route
              path="/edit-vip-listing/:listingId"
              element={<VipEditListing />}
            />
          </Route>

          <Route path="/vip" element={<PrivateRoute />}>
            <Route path="/vip" element={<Vip />} />
          </Route>

          <Route path="/admin" element={<PrivateRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route path="/manageUsersProfile" element={<PrivateRoute />}>
            <Route
              path="/manageUsersProfile"
              element={<ManageUsersProfile />}
            />
          </Route>
          <Route path="/faqPage" element={<FAQPage />} />
          <Route path="/myProfile" element={<MyProfile />} />
          <Route path="/viewProfile/:uid" element={<ViewProfile />} />
          {/* <Route path="/agents" element={<Agents />} /> */}
          <Route path="/manageRequests/:uid" element={<ManageRequests />} />
          <Route path="/trackDealsProgress" element={<TrackDealsProgress />} />
          <Route path="/property-management" element={<PropertyManagement />} />
          <Route path="/add-tenant/:propertyId" element={<AddTenant />} />
          <Route
            path="/property-management/:id/tenants"
            element={<TenantList />}
          />
          <Route path="/property-management/:id/tenant/:tenantId" element={<TenantDetail />} />
          <Route path="/listings" element={<ListingsPage />} />
          

          <Route
            path="/trackIndividualDealsProgress/:uid"
            element={<TrackIndividualDealsProgress />}
          />
          <Route path="/taskManager/:uid" element={<TaskManager />} />
          {/* <Route path="/editTenant" element={<PrivateRoute />}> */}
          <Route path="/tenant/:uid" element={<EditUser />} />

          {/* Payments and User Documents from Profile Page */}
          <Route
          path="/payments/:uid"
          element={
            <Elements stripe={stripePromise}>
              <Payments />
            </Elements>
          }
          />
          <Route path="/payment-history/:uid" element={<ViewPaymentHistory />} />
          <Route path="/userDocuments/:uid" element={<UserDocuments />} />

        </Routes>

        <div>
          {iconVisible && (
            <div className="chat-icon" onClick={handleChatClick}>
              <button>
                <img style={{ width: "70px" }} src={chatIcon} alt="Chat Icon" />
              </button>
            </div>
          )}
          {chatOpen && (
            <div
              className="chatbot-overlay"
              style={{ backgroundColor: "white", height: "510px" }}
            >
              <div style={{ padding: "0px", width: "40px" }}>
                <button
                  className="close-button"
                  style={{
                    width: "auto",
                    paddingRight: "11px",
                    paddingTop: "6px",
                    paddingLeft: "10px",
                    height: "auto",
                    cursor: "pointer",
                    backgroundColor: "black",
                    zIndex: "9999",
                  }}
                  onClick={() => {
                    handleChatClick(); // Close the chat
                    handleIconClick(); // Show the chat icon
                  }}
                >
                  X
                </button>
              </div>
              <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
                actions={ActionProvider}
              />
            </div>
          )}
        </div>
      </BrowserRouter>

      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
}

export default App;
