import { ConstructionOutlined } from "@mui/icons-material";
import { Alert, Box, Button, ButtonGroup, Dialog, TextField } from "@mui/material";
import { beforeAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { CustomButton } from "../Misc/Buttons";


export const RegisterForm = ({ title }) => {
  const [loading,setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const formRef = useRef();
  const {data:user} = useUser();
  const firestore = useFirestore();
  const collectionRef = collection(firestore,'/users');
  const {data:auth} = useAuth();
  const createUserInFirestore =async(email,uuid) =>{
    try{
    const uuid = uuid;
    const email = email;
    addDoc(collectionRef +`${uuid}`,{email:email,role:"user",uid:uuid,created_at:serverTimestamp(),portfolioMin:0,portfolioMax:1000000}).then((onComplete)=>{
      console.log(onComplete);
      setTimeout(onComplete,3000);
      navigate('/',)
    })
    }catch(error){
      console.log(error,"error creating user in firestore");
    }
  } 
  const handleSubmit = async() =>{
    setLoading=true;
    if(!validatePassword())
    {
      listErrors();
    }else{
      
      try {
        await createUserWithEmailAndPassword(auth,email,password).then((userCred)=>{
          const email = userCred.user.email;
          const uuid = userCred.user.uid;
          const subscribe = beforeAuthStateChanged(auth,userCred,()=>createUserInFirestore(email,uuid))
         
           createUserInFirestore(email,uuid).then((res)=>{
            setTimeout(res,2000);
            if(!res.error){
            return <Alert severity="success"> New User {uuid} created</Alert>
            }else{
              return <Alert severity="error"> Problem Creating User</Alert>
            }
            
          });
        });
      } catch (error) {
        console.log(error,"error message")
      }
    }
  }
  const resetPassword = () => {
    navigate("/reset-password");
  };
  const getCurrentLocation = async (e) => {
    e.preventDefault();
    if (location.pathname === "/register") {
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
    if (password !== "" && confirmPassword !== "") {
      if (password !== confirmPassword) {
        isValid = false;
        setError("Passwords does not match");
      }
    }
    return isValid;
  };
<<<<<<< HEAD
  useEffect(() => {
    userCheck();
  }, [status, user]);
=======
 useEffect(()=>{
  
 })
>>>>>>> master
  return (
    <div className="register-form">
      <h1> Registration Form</h1>
      <Box
        component="form"
        autoComplete
        noValidate
<<<<<<< HEAD
        onChange={handleChange}
=======
>>>>>>> master
        ref={formRef}
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "20px",
          paddding: "20px",
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
            backgroundColor: "whitesmoke",
            fontFamily: "Garamond",
            margin: "5%",
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
            backgroundColor: "whitesmoke",
            fontFamily: "Garamond",
            margin: "5%",
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
            backgroundColor: "whitesmoke",
            fontFamily: "Garamond",
            margin: "5%",
          }}
        />
        <ButtonGroup>
          <NavBarButton type="submit">Register</NavBarButton>
          <Button onClick={resetPassword}>Forgot Password?</Button>
        </ButtonGroup>
      </Box>
    </div>
  );
};

export default RegisterForm;
