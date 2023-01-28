import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes
 } from "react-router-dom";
import "./App.css";
import { AuthPage } from "./pages/Authentication";
import ListingPage from "./pages/Listings/index";
import { useEffect, useState, useReducer } from "react";
import AccountPage from "./pages/Account/index";
import Contact from "./pages/Contact/index";
import HomePage from "./pages/Home/index";
import AdminDashboard from "./pages/Admin";
import AuditLog from "./pages/Admin/AuditLog";
import { preloadFirestoreDoc, useSigninCheck, useUser,preloadUser, useFirestore, useFirestoreDoc, useObservable, useAuth } from "reactfire";
import NavBar from "./components/Misc/NavBar";
import { Spinner } from "react-bootstrap";
import { useParams } from 'react-router-dom'
import SearchForm from "./components/Home/SearchForm";




export const App = ({searchQuery}) => {

  
  const { status, data: user } = useUser();

  useEffect(() => {

  });

  return (
    <div className="App">
<<<<<<< HEAD
      <NavBar />

=======
   <NavBar />
>>>>>>> master
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/account" element={<AccountPage />} />
        <Route exact path="/account:uid" element={<AccountPage />} />

        <Route exact path="/admin" element={<AdminDashboard />} />

<<<<<<< HEAD
        <Route exact path="/reset-password" element={<ResetPasswordPage />} />

        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/register" element={<RegisterPage />} />

        <Route exact path="/auditlog" element={<AuditLog />} />
        <Route path="/listings/" element={<ListingPage />} />
        <Route path="/listings/:listing_ID" element={<ListingPage />} />
        <Route path="/search/:city" element={<SearchPage />} />
=======
        <Route
          path="/reset-password"
          element={<AuthPage title={"Password Reset"} />}
        />
        <Route path="/login" element={<AuthPage title="Login" />} />
        <Route path="/register" element={<AuthPage title="Register" />} />
        <Route path="/listings" element={<ListingPage />} />
        
        <Route
          path="/create-profile"
          element={<AuthPage title="New User Profile" />}
        />
        <Route path="/admin/auditlog" element={<AuditLog />} />
>>>>>>> master
      </Routes>
    </div>
  );
};
//  <Route path="/editListing/:id" element={<EditDocs database={database}/>} />
export default App;
