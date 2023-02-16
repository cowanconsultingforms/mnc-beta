/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { Box, TextField, Alert } from "@mui/material";
import {
  beforeAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate, Outlet, useOutlet } from "react-router-dom";
import { ButtonGroup, Button } from "@mui/material";
import { setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAuth, useFirestore, useUser } from "reactfire";
import { useForm } from "react-hook-form";

export const LoginForm = () => {
  const firestore = useFirestore();

  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(null);
  const [userInfo, setUserInfo] = useCallback();
  const { status, data: signInCheckResult } = useUser();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const { handleSubmit, register, resetField } = useForm({
    defaultValues: {
      email: "",
      user: null,
    },
  });

  const handleNavigate = () => {
    beforeAuthStateChanged(
      auth,
      user ? setLoggedIn(true) : setLoggedIn(false),
      () =>
        user.email === true ? (
          navigate("/")
        ) : (
          <Alert severity="warning">Logged in , Navigating Home</Alert>
        )
    );
  };
  const handleRedirect = () => {
    if (status === "success") {
      setTimeout(() => <Alert type="success"> Already Logged in </Alert>);
    }
    navigate("/");
  };

  const navToRegister = () => {
    if (status !== "loading" && status !== "sucess") {
      setTimeout(
        () => (
          (<Alert type="warning"> No Account - Register using Link </Alert>),
          2000
        )
      );
      navigate("/");
    }
  };
  const handleRender = (location, signInCheckResult) => {
    if (signInCheckResult.signedIn === true) {
      setLoggedIn(true).then();
    }
    if (location === "/login" && loggedIn === false) return <LoginForm />;
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    await signInWithEmailAndPassword(auth, email, password).then((response) => {
      if (
        status === "success" &&
        signInCheckResult === true &&
        response.user.uid
      ) {
        setDoc(
          updateDoc(firestore, `users/${user.uid}`, {
            lastSignedIn: serverTimestamp(),
          })
        );
        setTimeout(() => 2000);
        navigate("/");
      }
    });
  };

  useEffect(() => {
    if (signInCheckResult.signedIn === true) {
      return (
        <Alert type="warning">
          Already Signed in as {() => setUserInfo(user.email)}
        </Alert>
      );
    } else {
      return (
        <React.Fragment>
          <LoginForm />
        </React.Fragment>
      );
    }
  }, []);
  return (
    <Box
      className="login-form-box"
      component="form"
      autoComplete="true"
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
        paddding: "20px",
      }}
    >
      <h1>Login Form</h1>
      <TextField
        className="form-text-field"
        id="email"
        label="Email :"
        variant="outlined"
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        autoFocus
        fullWidth={true}
        required
        margin="normal"
        value={email}
      />
      <TextField
        id="password"
        label="Password :"
        variant="outlined"
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
        fullWidth={true}
        required
        margin="normal"
        type="password"
        value={password}
      />
      <ButtonGroup sx={{ m: 5, alignItems: "center" }}>
        <Button
          key="Login"
          variant="contained"
          type="submit"
          sx={{ backgroundColor: "gray" }}
          onClick={handleSubmit}
        >
          Login
        </Button>
        <Button key="Register" onClick={handleNavigate} variant="contained">
          Register
        </Button>
        <Button></Button>
      </ButtonGroup>
    </Box>
  );
};

export default LoginForm;

/*Breif: Exports a React component named LoginForm.
It imports various libraries such as React, @mui/material, firebase/auth, react-router-dom, and reactfire. 
The component has a form for logging in that accepts an email and password, 
and it handles authentication using Firebase's authentication service. 
When the user submits the form, it calls the signInWithEmailAndPassword function from the Firebase authentication library to authenticate the user.

The component also imports useForm from react-hook-form to manage the form data, 
and uses hooks like useState, useEffect, and useCallback to manage the component's state.

The LoginForm component renders a box containing the login form with two buttons: "Login" and "Register."
When the user clicks the "Register" button, the component navigates to the registration page. 
The component also checks whether the user is already logged in and displays a message if they are. */