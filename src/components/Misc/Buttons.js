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
