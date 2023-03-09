import { Alert,Box,Button,ButtonGroup,TextField, Grid, FormControl} from '@mui/material';
import {createUserWithEmailAndPassword,reauthenticateWithCredential,} from 'firebase/auth';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useId, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../firebase.js"

export const RegisterForm = ({ title }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword( 
        auth,
        email,
        password
      );
      navigate('/login')
    } catch (error) {
      console.log(error.message);
    }
  };

      
  return (
    <div className="register-form">
      <Grid 
      container 
      alignItems="center" 
      direction="column"
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
        paddding: "20px",
      }}>
      <Box
        component="form"
        autoComplete
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
        <h1>Sign Up</h1>
        <FormControl sx={{ width: '25ch'}}>
        <TextField
          id="email"
          label="Email :"
          variant="outlined"
          autocomplete="username"
          value={email}
          fullWidth={true}
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            backgroundColor: 'whitesmoke',
            fontFamily: 'Garamond'
          }}
        />
        <TextField
          id="password"
          label="Password :"
          variant="outlined"
          type="password"
          value={password}
          fullWidth={true}
          autoComplete="new-password"
          margin="normal"
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            backgroundColor: 'whitesmoke',
            fontFamily: 'Garamond'
          }}
        />
        <TextField
          id="confirmPassword"
          label="Confirm Password :"
          variant="outlined"
          type="password"
          value={confirmPassword}
          fullWidth={true}
          autoComplete="new-password"
          margin="normal"
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{
            backgroundColor: 'whitesmoke',
            fontFamily: 'Garamond'
          }}/>
        </FormControl>
        <br/>
        <Button
          key="Login"
          variant="contained"
          type="submit"
          sx={{ backgroundColor: "gray"}}
          onClick={register}>
          Register
        </Button>
        <p style={{padding:10}}>Already have an account? <a href="./login" onClick={() => navigate("/login")} style={{"color": "#4444A6"}}>Login</a></p>
      </Box>
      </Grid>
    </div>
  );
};

export default RegisterForm

/*Breif: Exports a React component called RegisterForm that displays a form for user registration.

It uses various hooks from the reactfire library to manage Firebase authentication and Firestore database operations.

The form takes in user input for email, password, and confirm password, and on submission,
it creates a new user account with Firebase Authentication,
and then adds the user's email, admin status, and login time to a users collection in the Firestore database.

The form also includes error handling for when passwords do not match or when there is an error creating the user.
The useLocation and useNavigate hooks from react-router-dom are used to manage navigation between different pages in the application.

The file also imports various components and functions from Material UI and Firebase libraries to manage UI and database operations. */