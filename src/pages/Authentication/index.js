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


/*This code is a functional component  Reactjs that implements an authentication page.
The AuthPage component receives a title prop and based on the title, it either renders a 
LoginForm component or a RegisterForm component.
It also uses the useAuth hook to access the authentication status of the user and useUser 
hook to get the user information. The component uses the useNavigate hook from react-router-dom 
to navigate to different pages in the app.
It also contains a getUser function that checks if the user is already logged in. If the user is 
logged in, it returns an alert message with the users display name and navigates to the 
route after 2 seconds.
The components main component is displayed in a Box component that has a auth-page class and the styles
of flexbox to display elements in a column. The component also uses the MNCLogo component to display a logo.*/