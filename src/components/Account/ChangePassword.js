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
