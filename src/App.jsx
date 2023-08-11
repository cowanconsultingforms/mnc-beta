import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Regular site imports
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import ContactUs from "./pages/ContactUs";
import Map from "./pages/Map";

// Admin control panel imports
import AdminHome from "./pages/Admin/AdminHome";
import List from "./pages/Admin/List";
import Single from "./pages/Admin/Single";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          {/* Displays corresponding component when navigating to specified path */}
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/map" element={<Map />} />

          {/* Navigates to dynamic listing URL (different for each listing) */}
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
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

          {/* Admin panel */}
          <Route path="/admin">
            {/* Admin home page */}
            <Route index element={<AdminHome />} />

            {/* Admin user overview */}
            <Route path="users">
              <Route index element={<List />} />
              <Route path=":userId" element={<Single />} />
            </Route>
          </Route>
        </Routes>
      </Router>

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
