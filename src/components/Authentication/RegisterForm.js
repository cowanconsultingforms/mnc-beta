import { ConstructionOutlined } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  TextField,
} from '@mui/material';
import {
  beforeAuthStateChanged,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useId, useReducer, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  useAuth,
  useFirestore,
  useFirestoreCollectionData,
  useUser,
} from 'reactfire';

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
  const { data: user } = useUser();
  const firestore = useFirestore();
  const collectionRef = collection(firestore, 'users');
  const auth = useAuth();
  /* const createUserInFirestore = async (e) => {
  e.preventDefault()
  createUserWithEmailAndPassword(auth, email, password).then((user) => {
    user = user;
  })

}*/
    const resetPassword = () => {
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
   
  });
      
  return (
    <div className="register-form">
      <h1>{title} Form</h1>
      <Box
        component="form"
        autoComplete
        noValidate
        ref={formRef}
        onSubmit={handleSubmit}
        onChange={handleChange}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '20px',
          paddding: '20px',
        }}
      >
        <TextField
          id="email"
          label="Email :"
          variant="outlined"
          autocomplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            backgroundColor: 'whitesmoke',
            fontFamily: 'Garamond',
            margin: '5%',
          }}
        />
        <TextField
          id="password"
          label="Password :"
          variant="outlined"
          type="password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            backgroundColor: 'whitesmoke',
            fontFamily: 'Garamond',
            margin: '5%',
          }}
        />
        <TextField
          id="confirmPassword"
          label="Confirm Password :"
          variant="outlined"
          type="password"
          value={confirmPassword}
          autoComplete="new-password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{
            backgroundColor: 'whitesmoke',
            fontFamily: 'Garamond',
            margin: '5%',
          }}
        />
        <ButtonGroup>
          <Button type="submit" onClick={handleSubmit}>
            Register
          </Button>
          <Button onClick={resetPassword}>Forgot Password?</Button>
        </ButtonGroup>
      </Box>
    </div>
  );
};

export default RegisterForm
