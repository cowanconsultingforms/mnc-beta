import styled from "@mui/material/styles";
import React, { useState, useEffect, forwardRef, useRef } from "react";
import Button from "@mui/material/Button";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "reactfire";
import { onAuthStateChanged } from "firebase/auth";
import { uuidv4 } from "@firebase/util";
export const NavBarButton = ({ handleAction,page,text,idx}) => {
  const auth = useAuth();
  const [profile,setProfile] = useState(null);

  useEffect(()=>{

  },[])
  return (
    <Button variant="contained" onClick={handleAction} disableElevation>
    <Link to={page} id={idx}></Link>
      {text}
    </Button>
  );
};

export default NavBarButton;

/* Exports a React functional component called NavBarButton using the default 
export syntax. 
It imports several libraries and modules at the beginning of the code, 
including styled, React, Button from @mui/material, Nav from react-bootstrap,
 Link from react-router-dom, useAuth and onAuthStateChanged from reactfire, 
 and uuidv4 from @firebase/util.

The NavBarButton component takes four props, namely handleAction, page, 
text, and idx, and returns a styled Material UI button with a link to a 
specified page.

The handleAction prop is a function to be executed when the button is 
clicked, page is a string indicating the path to the page the button will link 
to, text is the text to be displayed inside the button, and idx is the id of 
the button's link.

Inside the NavBarButton component, the useAuth hook from reactfire is called to
 get the current user's authentication status.
 
 The useState hook is also called to set the profile state to null.

Current Issue: The useEffect hook is currently empty, which means that it doesn't
 perform any side effects when the component is mounted or updated.*/