import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Regular site imports
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

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Displays corresponding component when navigating to specified path */}
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/sign-in"
            element={<SignIn />}
          />
          <Route
            path="/afterSearch"
            element={<AfterSearch />}
          />
          <Route
            path="/sign-up"
            element={<SignUp />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/offers"
            element={<Offers />}
          />
          <Route
            path="/create-listing"
            element={<CreateListing />}
          />
          <Route
            path="/vip-create-listing"
            element={<CreateVipListing />}
          />
          <Route
            path="/contact-us"
            element={<ContactUs />}
          />
          <Route
            path="/map"
            element={<Map />}
          />

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
          <Route
            path="/profile"
            element={<PrivateRoute />}
          >
            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>

          {/* Navigates to /create-listing if user is signed in, otherwise navigates to /sign-in */}
          <Route
            path="/create-listing"
            element={<PrivateRoute />}
          >
            <Route
              path="/create-listing"
              element={<CreateListing />}
            />
          </Route>

          {/* Navigates to /edit-listing when user clicks on the edit icon otherwise navigates to /sign-in */}
          <Route
            path="/edit-listing"
            element={<PrivateRoute />}
          >
            <Route
              path="/edit-listing/:listingId"
              element={<EditListing />}
            />
          </Route>

          <Route
            path="/edit-vip-listing"
            element={<PrivateRoute />}
          >
            <Route
              path="/edit-vip-listing/:listingId"
              element={<VipEditListing />}
            />
          </Route>

          <Route
            path="/vip"
            element={<PrivateRoute />}
          >
            <Route
              path="/vip"
              element={<Vip />}
            />
          </Route>

          <Route
            path="/admin"
            element={<PrivateRoute />}
          >
            <Route
              path="/admin"
              element={<Admin />}
            />
          </Route>
        </Routes>
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
