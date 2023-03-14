import React, { useState, useEffect, startTransition,Suspense ,useCallback, useMemo} from "react";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, getInstance } from "firebase/auth";
import { LogoutOutlined } from "@mui/icons-material";
import { useUser, useFirestore, useSigninCheck, useAuth, useFirestoreCollection, useFirestoreCollectionData} from "reactfire";
import { MNCLogo,MNCLogoGray } from "./MNCLogo";
import 'firebase/firestore';
import app from '../../firebase.js';
const logoutButton = document.getElementById('logout');
const loginButton = document.getElementById('login-page');
const adminButton = document.getElementById('admin-page');

export const NavBar = () => {
 
  const auth = useAuth();
  const navigate = useNavigate();

  const admins = ["anik@gmail.com"]

  try{
    console.log(auth.currentUser.email)
  } catch {

  }

  const pages = [
    {
      page:"/search",
      text:"Search Narrowly!",
      onClickFunc: () =>navigate('/search',{}),
      id:"search-page",
    },
    {
      page: "/contact",
      text: "Contact",
      onClickFunc: () => navigate("/contact"),
      id: "contact-page",
    },
    {
      page: "/listings",
      text: "Listings",
      onClickFunc: () => navigate("/listings"),
      id: "listing-page",
    },
    {
      page: "/account",
      text: "Profile",
      onClickFunc: () => navigate("/account"),
      id: "account-page",
      
    }
  ];

  const logOut = {
    page: "/",
    text: "Logout",
    onClickFunc: () => {
      signOut(auth).then((res) => {
        navigate("/");
      });
    },
    id: "logout",
  }
  
  const logIn = {
    page: "/",
    text: "Login/Register",
    onClickFunc: () => navigate("/login"),
    id: "login-page",
  }

  const admin = {
    page: "/admin",
    text: "Administrator",
    onClickFunc: () => navigate("/admin"),
    id: "admin-page",
    
  }


  if (auth.currentUser != null){
    pages.push(logOut)
    const userEmail = auth.currentUser.email
    if (admins.includes(userEmail)){
      pages.unshift(admin)
    }
  } else{
    pages.push(logIn)
  }

  
  return (
    <header>
      <div className="navigation-bar">
        <div className="navigation-bar-left">
          <button className="nav-btn" href="/" onClick={() => navigate("/")}>
            <HomeIcon size={25} padding="2" sx={{marginBottom:"10"}} />
          </button>
          <MNCLogoGray/>
        </div>
        <div className="navigation-bar-right">
          {pages.map((page, idx) => (
            <button
              className="nav-btn"
              id={page.id}
              key={idx}
              onClick={page.onClickFunc}
              sx={{ fontFamily: "Garamond" }}
            >
              {page.text}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
export default NavBar;

/*Breig: This is a React component named NavBar. 

Imports various modules from React and Firebase, as well as other custom hooks and components.

The component contains a function called buttonHider, which takes in the userState and modifies the visibility of the logoutButton, 
loginButton, and adminButton elements based on the user's login status and role.

Inside the component, there are several hooks being used: useUser, useFirestore, useNavigate, useSigninCheck, useFirestoreDocData, and
useFirestoreCollection. 

These hooks provide data and methods for interacting with Firebase and the current user's authentication status.

The component also contains an array of objects called pages, each representing a navigation button with text, an onClick function, and an
id. These buttons are rendered in the component's render() method.

The component also includes a useEffect hook, which runs some code after the component is mounted. 
This code retrieves data from Firebase, updates the visibility of the buttons based on the user's authentication status, 
and enables auto-refresh of Firebase app tokens.*/


