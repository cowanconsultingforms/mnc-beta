import React, { useEffect, useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import { LoginForm } from "../../components/Authentication/LoginForm";
import { RegisterForm } from "../../components/Authentication/RegisterForm";
import "./styles.css";
import MNCLogo from "../../components/Misc/MNCLogo";
import { useUser,useAuth } from "reactfire";
//initial state of auth page

//CSS needs work, auth needs to be passed up to the parent component
export const AuthPage = ({ title }) => {
  const auth = useAuth();
  const {status,data:user} = useUser()
  const navigate = useNavigate();
  const handleFormRender = (title) => {
    if (title === "Login") {
      return <LoginForm title={title} />;
    }
    if (title === "Register") {
      return <RegisterForm title={title} />;
    }
  };
  const getUser = () => {
    if (!user) {
      return;
    } else {
      setTimeout(()=>navigate('/'),2000);
      console.log("User is Logged in");
      return <Alert severity="warning">{auth.currentUser.displayName} logged in </Alert>
    }
  };
  useEffect(() => {
    getUser();
    handleFormRender(title);
  });

  return (
    <Box
      className="auth-page"
      style={{ display: "flex", flexDirection: "column", width: "100%", mt: 8 }}
    >
     
      <MNCLogo />
      {handleFormRender(title)}
    </Box>
  );
};

export default AuthPage;