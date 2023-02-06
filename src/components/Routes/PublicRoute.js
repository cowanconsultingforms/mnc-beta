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
