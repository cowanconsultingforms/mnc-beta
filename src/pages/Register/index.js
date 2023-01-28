import React, { useEffect, useId, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth, useUser, } from "reactfire";
import { LoginForm } from "../../components/Authentication/LoginForm";
import { RegisterForm } from "../../components/Authentication/RegisterForm";
import { onAuthStateChanged } from "firebase/auth";
import "./styles.css";
import MNCLogo from "../../components/Misc/MNCLogo";
import NavBar from "../../components/Misc/NavBar";
import { uuidv4 } from "@firebase/util";
import { useForm } from "react-hook-form";
import { doc,documentId } from "firebase/firestore";

export const RegisterPage = ({children}) => {
  const { onAuthStateChanged,beforeAuthStateChanged } = useAuth();
  const {register,handleSubmit,watch,formState:{errors}} = useForm();
  const onSubmit = (e) => {
    e.preventDefault();
    const newUser = doc()
  }
  const {status,data:user}  = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const {data:signInCheckResult} = useAuth();
  const id = useId('');
  useEffect(() => {
    if(!user){
      return;
    }
    const createNewId = async() =>{
      

    }
    const unsubscribe = onAuthStateChanged(user,reportError(),unsubscribe);
    
   
  });

  return (
    <Box
      className="auth-page"
      style={{ display: "flex", flexDirection: "column", width: "100%", mt: 8 }}
    >

      <MNCLogo />
      <RegisterForm />
    </Box>
  );
};

export default RegisterPage;
