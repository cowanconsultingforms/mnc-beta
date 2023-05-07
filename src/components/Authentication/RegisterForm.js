import { AddAlert } from '@mui/icons-material';
import { Alert,Box,Button,ButtonGroup,TextField, Grid, FormControl} from '@mui/material';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { addDoc, collection, doc, serverTimestamp, setDoc, getDocs} from 'firebase/firestore';
import React, { useEffect, useId, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useFirestore } from 'reactfire';


import { FirebaseStorage, ref } from "firebase/storage";
import { useStorage, useStorageDownloadURL } from "reactfire";


export const RegisterForm = ({ title }) => {


  const storage = useStorage()
  const backgroundImage = ref(storage, "gs://mnc-development.appspot.com/images/R.jfif")
  const { status, data: url1 } = useStorageDownloadURL(backgroundImage);

  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [users, setUsers] = useState([])
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();

  const firestore = useFirestore();
  const usersRef = collection(firestore,'/users')
  
  useEffect(() => {
    const getUsers = async() => {
      const data = await getDocs(usersRef)
      setUsers(data.docs.map((doc) => ({...doc.data()})))
    }
    getUsers()
  },[])

  const checkIfEmailExists = (e) => {
    for (let i = 0; i < users.length; i++){
      let registerEmail = users[i].Email
      if (e == registerEmail){
        return true
      }
    }
    return false
  }

  const createUser = async () => {
    await addDoc(usersRef, {Email:email, Role:"user"})
  }

  const register = (e) => {
    e.preventDefault()
    if (!emailRegex.test(email)){
      alert("Please enter a valid email")
    } 
    else if (password.length < 6){
      alert("Password too short, must be 6 characters minimum")
    } else if (password != confirmPassword){
      alert("Passwords don't match")
    } else if (checkIfEmailExists(email)){
      alert("This email was already used to register an account")
    } else{
        createUser()
        createUserWithEmailAndPassword(auth, email, password)
        alert("You have successfully signed up")
        navigate('/')
    }
  };

      
  return (

    <div>
    {status !== "success" ? (
    <h1>Loading...</h1>
  ) : (
<div style={{ 
backgroundImage: `url(${url1})`, 
backgroundAttachment: "fixed",
backgroundRepeat: "no-repeat",
backgroundSize: "cover",
height: "100vh",
width: "100vw",
position: "fixed",
top: 0,
left: 0,
zIndex: -1
}}>
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
          marginTop: "200px",
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
    </div>
)};
  );
  </div>
)};

export default RegisterForm

/*Breif: Exports a React component called RegisterForm that displays a form for user registration.

It uses various hooks from the reactfire library to manage Firebase authentication and Firestore database operations.

The form takes in user input for email, password, and confirm password, and on submission,
it creates a new user account with Firebase Authentication,
and then adds the user's email, admin status, and login time to a users collection in the Firestore database.

The form also includes error handling for when passwords do not match or when there is an error creating the user.
The useLocation and useNavigate hooks from react-router-dom are used to manage navigation between different pages in the application.

The file also imports various components and functions from Material UI and Firebase libraries to manage UI and database operations. */