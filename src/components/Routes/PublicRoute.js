import React, { useEffect, useState } from "react";
import {
  Route,
  useNavigate,
  Outlet,
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  Routes
} from "react-router-dom";
import { useAuth, useUser } from "reactfire";
import { AuthPage } from "./pages/Authentication";
import ListingPage from "./pages/Listings/index";
import AccountPage from "./pages/Account/index";
import Contact from "./pages/Contact/index";
import HomePage from "./pages/Home/index";
import AdminDashboard from "./pages/Admin";
import AuditLog from "./pages/Admin/AuditLog";
import NavBar from "./components/Misc/NavBar";
import { Spinner } from "react-bootstrap";
import SearchPage from "./pages/Search";
import ResetPasswordPage from "../../pages/ResetPassword";
import { confirmPasswordReset } from "firebase/auth";
/* 
<Route exact path="/login" element={<LoginPage />} />
<Route exact path="/register" element={<RegisterPage />} />
  */ 


const PublicRoute = ({ children, ...props }) => {
  const auth = useAuth();
  const [loggedIn, setLoggedIn] = useState(null);
  const { status, data: user } = useUser();

  useEffect(() => {
    if (status === "success") {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/contact" element={<Contact />} />
      <Route exact path="/account" element={<AccountPage />} />
      <Route exact path="/account:uid" element={<AccountPage />} />

      <Route exact path="/admin" element={<AdminDashboard />} />

      <Route
        exact
        path="/reset-password"
        element={<ResetPasswordPage user={auth.currentUser} />}
      />
      <Route exact path="confirm-reset" element={confirmPasswordReset} />
     
      <Route exact path="/auditlog" element={<AuditLog />} />
      <Route path="/listings/" element={<ListingPage />} />
      <Route path="/listings/:listing_ID" element={<ListingPage />} />
      <Route path="/search/:city" element={<SearchPage />} />
    </Routes>
  );
};

/* Breif: Imports several modules from the react-router-dom and reactfire libraries, and defines several components and pages using React. 
Defines a PublicRoute component that wraps a set of routes that are accessible to all users, whether or not they are logged in.

The useEffect hook is used to set the loggedIn state variable based on the status of the useUser hook. 
If the status is "success", indicating that a user is logged in, loggedIn is set to true. Otherwise, it is set to false.

The Routes component from react-router-dom is used to define a set of routes that will be rendered within the PublicRoute component. 
These routes include:

a. A HomePage component that will be rendered when the user visits the root URL ("/").
b. A Contact component that will be rendered when the user visits the "/contact" URL.
c. An AccountPage component that will be rendered when the user visits the "/account" URL. If a uid parameter is included in the URL, a different version of the AccountPage component will be rendered.
d. An AdminDashboard component that will be rendered when the user visits the "/admin" URL.
e. A ResetPasswordPage component that will be rendered when the user visits the "/reset-password" URL. The user prop is passed to this component to allow it to interact with the Firebase authentication API.
f. An AuditLog component that will be rendered when the user visits the "/auditlog" URL.
g. A ListingPage component that will be rendered when the user visits any URL that starts with "/listings/". If a listing_ID parameter is included in the URL, a different version of the ListingPage component will be rendered.
h. A SearchPage component that will be rendered when the user visits any URL that starts with "/search/". The city parameter is passed to this component to allow it to perform a search based on the specified city.
Overall, this code sets up a basic routing system for a React app with pages for various features and functionalities.*/