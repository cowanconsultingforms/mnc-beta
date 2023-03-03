import { Alert,Box,Button,ButtonGroup,TextField, Grid, FormControl} from '@mui/material';
import {createUserWithEmailAndPassword,reauthenticateWithCredential,} from 'firebase/auth';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useId, useReducer, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {useAuth,useFirestore,useUser} from 'reactfire';

export const RegisterForm = ({ title }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const formRef = useRef();
  const userID = useId();
  const { status,data: user } = useUser();
  const firestore = useFirestore();
  const collectionRef = collection(firestore, 'users');
  const auth = useAuth();
  /* const createUserInFirestore = async (e) => {
  e.preventDefault()
  createUserWithEmailAndPassword(auth, email, password).then((user) => {
    user = user;
  })

}*/
    const resetPassword = ({data:user}) => {
    navigate('/reset-password');
  };
  const getCurrentLocation = async (e) => {
    e.preventDefault();
    if (location.pathname === '/register') {
      return (
        <Button>
          <Link></Link>
        </Button>
      );
    }
  };
  const listErrors = (ref) => {
    formRef.current = ref;
    const errors = {};
    Object.keys(error).forEach((key) => {
      errors[key] = error[key].message;
    });
    return errors;
  };
  const handleChange = (e) => e.target.value;

  const validatePassword = () => {
    let isValid = true;
    if (password !== '' && confirmPassword !== '') {
      if (password !== confirmPassword) {
        isValid = false;
        setError('Passwords does not match');
      }
    }
    return isValid;
  };
  const handleSubmit = async (e,) => {
    const id =userID
    e.preventDefault();
    setLoading(true);
    if (!validatePassword()) {
      listErrors();
      return <Alert severity="error">Passwords dont match</Alert>;
    } else {
      try {
        await createUserWithEmailAndPassword(auth, email, password).then(
          (userCred) => {
            const email = userCred.user.email;
            const admin = false;
            const loggedIn = serverTimestamp()
            const uuid = userCred.user.uid
            setDoc(collectionRef, doc(firestore, `users/${userID}`, { email, admin, loggedIn, uuid }).then((res) => {
              if (!res.error) {
                return (
                  (<Alert severity="success"> New User  created</Alert>),
                  setLoading(false),
                  navigate('/')
                );
              } else {
                setLoading(false)
                return <Alert severity="error"> Problem Creating User</Alert>;
              }
            })
            )
          }
        
    
        )
      } catch (error) {
        console.log(error.message);
      };
    }
  }  

  useEffect(() => {
    if (status === "error") {
     <Alert severity='error'>Problem Loading page - contact Server Admin</Alert>
   }
  });
      
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
        noValidate
        ref={formRef}
        onSubmit={handleSubmit}
        onChange={handleChange}
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
          onClick={handleSubmit}>
          Register
        </Button>
        <p style={{padding:10}}>Already have an account? <a href="#" onClick={() => navigate("/login")} style={{"color": "#4444A6"}}>Login</a></p>
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