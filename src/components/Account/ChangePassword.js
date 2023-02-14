import TextField from "@mui/material/TextField";
//import { ProfileButton } from "../../components/Buttons";
import { Alert, Box, Button, Typography } from "@mui/material";
//import { auth } from "../../firebase";
//import { useAuthState, useUpdateEmail } from "react-firebase-hooks/auth";
import { query, getDoc } from "firebase/firestore";
import React, { useState, useEffect, Fragment } from "react";
import {
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  signInWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useUser } from "reactfire";

export const ChangePassword = () => {
  //const [useUpdatePassword] = useState("");
  const { data: user } = useUser();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handlePWChange = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      try {
        
        const credential = EmailAuthProvider.credential(user, oldPassword);

        await reauthenticateWithCredential(user, credential).then(() => {
          if (newPassword === confirmPassword) {
            updatePassword(user, newPassword).then((res) => {
              if (res) {
                return <Alert severity="success"> Password </Alert>;
              }
              
            })
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Passwords do not match");
    }
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <React.Fragment>
      <Box
        className="account-password-container"
        component="form"
        style={{backgroundColor: "#eeeeee",}}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h4" sx={{color: "gray", fontFamily: "Garamond"}}>Change Password</Typography>
      
        <TextField
          name="oldPassword"
          onChange={(e) => setOldPassword(e.target.value)}
          style={{backgroundColor:"white", fontFamily: "Garamond",}}
         />
         
        <TextField
          name="newPassword"
          onChange={(e) => setNewPassword(e.target.value)}
          style={{backgroundColor:"white", fontFamily: "Garamond",}}
          
        />
        <TextField
          name="confirmNewPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{backgroundColor:"white"}}
          
        />
        <Button onClick={handlePWChange}
        style={{color: "gray", fontFamily: "Garamond",}}>Change Password</Button>
        <Button
        style={{color: "gray", fontFamily: "Garamond",}}>Change</Button>
      </Box>
    </React.Fragment>
  );
};

export default ChangePassword;

/*Breif: This code is a React component for a password change form.
 It uses the useState hook to manage the state of the old password, new password, and confirm password fields. 
 The handlePWChange function is called when the "Change Password" button is clicked, which validates if 
 the new password and confirm password match, then re-authenticates the user using the current email and old password. 
 If re-authentication is successful, it updates the password using the new password. If the passwords don't match, 
 it shows an alert saying "Passwords do not match".

It's using EmailAuthProvider.credential method to get the credentials of the user and then passing this credential to the
 reauthenticateWithCredential method. If the password is successfully updated, it returns a success alert.

It uses the useUser hook from reactfire to retrieve the user data and then uses the updatePassword method from Firebase's
 authentication module to change the password.*/

