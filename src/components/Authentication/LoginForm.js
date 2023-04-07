/* eslint-disable no-unused-vars */
import React, { useState, useEffect, u} from "react";
import { Box, TextField, Alert, Grid, FormControl } from "@mui/material";
//import { AuthContext } from "./AuthContext.js";
import { useNavigate, } from "react-router-dom";
import { Button } from "@mui/material";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from "firebase/auth"
import { FirebaseStorage, ref } from "firebase/storage";
import { getDocs, collection } from "firebase/firestore";
import { useAuth, useFirestore, useStorage, useStorageDownloadURL } from "reactfire";

export const LoginForm = () => {

  const auth = useAuth()
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  
  const storage = useStorage()
  const backgroundImage = ref(storage, "gs://mnc-development.appspot.com/images/R.jfif")
  const { status, data: url1 } = useStorageDownloadURL(backgroundImage);

  const navigate = useNavigate()
  
  const login = async(e) => {
    e.preventDefault()
    try{
        const user = await signInWithEmailAndPassword(auth, email, password)
        if (user != null){
          setLoggedIn(true)
        }
    } catch (error) {
      alert("You have entered an incorrect email or password")
    }
  };

  useEffect(() => { //redirects to front page after logging in
    if (loggedIn) {
      return navigate("/", {exact: true});
    }
  }, [loggedIn]);

  return (
    <div>
      {status !== "success" ? (
      <h1>Loading...</h1>
    ) : (
      <div style={{ backgroundImage: `url(${url1})`, backgroundAttachment: "fixed",
                    backgroundRepeat: "no-repeat",float:"down", whiteSpace: "nowrap"}}>
      <Grid 
        container 
        alignItems="center" 
        direction="column"
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "0px",
          paddding: "20px",
        }}>
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
          alignItems: "center",
          borderRadius: "20px",
          backgroundColor: "#eeeeee",
          marginBottom: "30px",
          marginTop: "30px",
          width: "300px",
        }}>
        <Grid display="flex" justifyContent="center" alignItems="center">
          <h1>Login</h1>
        </Grid>
        <FormControl sx={{ width: '25ch'}}>
        <TextField
          className="form-text-field"
          id="email"
          label="Email :"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          fullWidth={true}
          required
          margin="normal"
          value={email}
          sx = {{
            backgroundColor: 'whitesmoke'
          }}
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
          sx = {{
            backgroundColor: 'whitesmoke'
          }}
        />
        </FormControl>
        <br/>
          <Button
            key="Login"
            variant="contained"
            type="submit"
            sx={{ backgroundColor: "gray"}}
            onClick={login}
            >
            Login
          </Button>
          <p style={{padding:10}}>Don't have an account? <a onClick={() => navigate('/register')} style={{"color": "#4444A6"}}>Sign up</a></p>
          <Button onClick={() => navigate('/reset-password')}>Forgot Password?</Button>
          </Box>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </Grid>
      </div>
      )}
    </div>
  );
};

export default LoginForm;

/*UPDATE

There's a problem with the handleRender() function which was causing this page to not load.
Currently it's not being using, so the page will load. In order to actually login users
we have to fix it
*/

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