import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

import { Box, Typography, TextField, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { useAuth } from "reactfire";
export const SignOutBox = () => {
  const { status, data: user } = useAuth();
  const navigate = useNavigate("/");

  const handleSignOut = async () => {
    try {
      signOut();
    } catch (error) {}
  };
  const getUser = () => {
    if (user) {
      return navigate;
    }
  };
  useEffect(() => {}, []);

  if (status === "loading") {
    return <span>loading...</span>;
  }
  return (
    <Box
      component="div"
      sx={{
        width: "100%",
        position: "relative",
        textAlign: "left",
        backgroundColor: "#eeeeee",
        color: "gray",
        fontSize: "20px",
        fontFamily: "Garamond",
      }}
      className="SignOutBox"
    >
      <Typography variant="h4" sx={{}}>Sign Out</Typography>

      <Typography variant="body1">
        Signing out? You can always log back in
      </Typography>

      <Button onClick={handleSignOut} sx={{color:"gray"}}>Sign Out</Button>
    </Box>
  );
};

export default SignOutBox;


/*Breif: This is a React component called "SignOutBox". It provides a sign-out button that allows a user to log out of a web application.

The component uses the useNavigate hook from react-router-dom to navigate to the "/" route when a user logs out. It also uses the useAuth hook
from reactfire to determine the current authentication status and access the user data.

When the "Sign Out" button is clicked, the component calls the handleSignOut function, which invokes the signOut function from the
firebase/auth library to log the user out.

The component also includes some Material UI components (Box, Typography, TextField, and Button) for styling and layout purposes.*/