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

/* This code defines a NavBar component that renders a navigation bar with a logo 
and links to different pages of a website. The component uses several hooks from 
the reactfire and react-router-dom packages to interact with the Firebase 
authentication and Firestore database, and to handle the navigation between pages.

The component imports several functions and components from different packages, 
including useState, useEffect, startTransition, Suspense, useCallback, useMemo 
from the react package, useNavigate from the react-router-dom package, and 
onAuthStateChanged, signOut from the firebase/auth package, and others.

The NavBar component defines a set of pages that the user can navigate to, 
and renders buttons for each of these pages. The buttons call a function that uses
 the useNavigate hook to change the URL and navigate to the corresponding page. 
 The component also uses the useUser hook from reactfire to get the current user, 
 and displays a "Login/Register" button or a "Logout" button depending on whether 
 the user is logged in or not.

The component also uses a buttonHider function to display or hide certain buttons 
depending on the user's role, and uses the useEffect hook to call this function 
when the component mounts or updates. The useFirestore hook is used to get a 
reference to the Firestore database, and the useFirestoreDocData hook is used to 
get the data from a specific document in the database.

The NavBar component exports NavBar as the default export, and buttonHider as a 
named export.
*/



