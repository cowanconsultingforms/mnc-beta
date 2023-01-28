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
