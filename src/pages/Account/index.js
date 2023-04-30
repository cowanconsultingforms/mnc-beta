import React, { useEffect, useState } from "react";
//This line imports the useNavigate and useLocation hooks from the react-router-dom library. 
//useNavigate provides a way to programmatically navigate between different routes in a React application that uses React Router
//.useLocation gives access to the current location (the URL) of the application and is used to get information about the current route that the user is on.

import { useNavigate, useLocation } from "react-router-dom";

//Imports from Material-UI Library - Google's Material Design Library
import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

// import SignOutBox from "../../components/Account/SignOutBox"; //imports SignOutBox Component - allow the user to sign out
//import NavBar from "../../components/Misc/NavBar";
import {ProfileChange} from "../../components/Account/ProfileChange";
// import ChangePassword from "../../components/Account/ChangePassword";
import { useFirestore,useUser } from "reactfire";
import { useAuth } from "reactfire";
//This is white
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light" ? "rgb(255 255 255)" : "rgb(255 255 225)",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
//This is gray item box, if need be. We can mix and match both
const Item2 = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(196 196 196)" : "rgb(196 196 196)",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  
}));

//need a profile edit component/form
//needs a component to display the profile automatically upon loading

//The component uses the useLocation hook to get the current location from the react-router-dom library. 
//It also uses the useAuth hook to get the authentication status and user data, and the useFirestore hook to get access to Firestore.
//The component uses the useEffect hook to perform a side effect when the component is mounted and the status is 'success'. The effect logic is currently empty.
export const AccountPage = (props) => {
  const { role,email,userName } = props;
  const location = useLocation();
  const { status, data: user } = useAuth();
  const firestore = useFirestore();
  useEffect(() => {
    if (status === 'success') {
      
    }
  })

 
  return (
    
   
        <Grid item xs={10}>
          <Item sx={{ height: 50  }}>

            <Typography
              variant="h4"
              sx={{
                fontFamily: "Garamond",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
              }}
            >
              Edit Profile
            </Typography>
          </Item>
        
        <Grid item xs={1}>
          {/* <Item sx={{ height: 400, width: 2000 }}> */}
            <Grid container spacing={0}>
              <Grid item xs={9}>
                  <ProfileChange role={props.role} userName={props.userName} email={props.email}></ProfileChange>
                
              </Grid>
              {/* <Grid item xs={4}> */}
                {/* <SignOutBox></SignOutBox>
                <ChangePassword></ChangePassword> */}
                
              {/* </Grid> */}
            </Grid>
          {/* </Item> */}
        </Grid>
       </Grid>
    
  );
};

export default AccountPage;


//The code defines a React component named "AccountPage" that allows users to edit their profile information and change their password. 
//The component uses other components such as "ProfileChange", "SignOutBox", and "ChangePassword". The component is styled using "styled" 
//from "@mui/material/styles" library to provide the appearance of the components. It uses hooks like useEffect, useLocation, useAuth, and
 //useFirestore to interact with Firebase for user authentication and data storage. The component displays two paper components with different
 //background colors for different items.