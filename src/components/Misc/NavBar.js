import React, { useState, useEffect, startTransition,Suspense ,useCallback, useMemo} from "react";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LogoutOutlined } from "@mui/icons-material";
import app, { auth } from "../../firebase";
import { useUser, useFirestore, useSigninCheck, useFirestoreDocData, checkOptions, useInitAuth, useFirestoreCollection } from "reactfire";
import { doc, getDoc, query, where, collection, orderBy } from "firebase/firestore";
import { setTokenAutoRefreshEnabled } from "firebase/app-check";
import { MNCLogo,MNCLogoGray } from "./MNCLogo";
const logoutButton = document.getElementById('logout');
const loginButton = document.getElementById('login-page');
const adminButton = document.getElementById('admin-page');


export const buttonHider = (userState) =>{
  if(userState.loggedIn === true && userState.role !== "Administrator"){
    logoutButton.style.display = "list-item";
    loginButton.style.display  = "none";
    adminButton.style.display = "none"
  }else if(userState.loggedIn === true && userState.role === "Administrator"){
    logoutButton.style.display = "list-item";
    loginButton.style.display = "none";
    adminButton.style.display = "list-item"
  }else{
    logoutButton.style.display = "none";
    loginButton.style.display = "list-item";
    adminButton.style.display ="none"
  }
}
export const NavBar = () => {
 
  const { status,data: user } = useUser();
  const firestore = useFirestore();
  
  const collectionRef = collection(firestore,'/users');
 
 
  const navigate = useNavigate();
  
  const { data: signInCheckResult } = useSigninCheck();
  const pages = [
    {
      page: "/admin",
      text: "Administrator",
      onClickFunc: () => navigate("/admin"),
      id: "admin-page",
      
    },
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
      
    },

    {
      page: "/",
      text: "Login/Register",
      onClickFunc: () => navigate("/login"),
      id: "login-page",
     
    },
    {
      page: "/",
      text: "Logout",
      onClickFunc: () => {
        signOut(auth).then((res) => {
          console.log(res);
          if(!res.error)
          navigate("/");
        });
      },
      id: "logout",
    },
  ];
  const buttonHider = (user) =>{
    
    if(user === true && user !== "Administrator"){
      logoutButton.style.display = "list-item";
      loginButton.style.display  = "none";
      adminButton.style.display = "none"
    }else if(user === true && user === "Administrator"){
      logoutButton.style.display = "list-item";
      loginButton.style.display = "none";
      adminButton.style.display = "list-item"
    }else{
      logoutButton.style.display = "none";
      loginButton.style.display = "list-item";
      adminButton.style.display ="none"
    }

  }
  useEffect(() => {
 
    const userCheck = async () => {
      if (status !== "loading" && signInCheckResult.user !==null ) 
       {
        console.log(signInCheckResult);
        const currentUser = signInCheckResult.user;
        const docRef = query(
          collection(firestore, "users"),
          where("email", "==", currentUser.email)
        );
        try {
          await getDoc(docRef).then((onSnapshot) => {
           const userResult = onSnapshot.data()
          
          });
        } catch (error) {
          console.log(error);
        }
      }
    };
    userCheck().then(()=>{
      setTokenAutoRefreshEnabled(app)
      onAuthStateChanged(auth,buttonHider())
      
    })
  });

  return (
    <header>
      <div className="navigation-bar">
        <div className="navigation-bar-left">
          <button className="nav-btn" href="/" onClick={() => navigate("/")}>
            <MNCLogoGray/>
          </button>
          <HomeIcon size={25} padding="2" />
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


