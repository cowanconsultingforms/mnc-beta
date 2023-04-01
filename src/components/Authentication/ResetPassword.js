import React, { useState, useRef, Fragment } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuth,useInitAuth, useFirestore } from "reactfire";
import { useNavigate } from 'react-router-dom';
import { Alert,Box,Button,ButtonGroup,TextField, Grid, FormControl} from '@mui/material';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate('');

  const firestore = useFirestore()
  const auth = useAuth()

  const reset = (e) => {
    e.preventDefault()
    sendPasswordResetEmail(auth, email).then(() => {
      alert("Password reset email sent successfully");
    })
    .catch((error) => {
      alert("Error sending password reset email: ", error);
    });
  }
      
  return (
    <div className="reset-form">
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
        <h1>Reset Password</h1>
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
        </FormControl>
        <br/>
        <Button
          key="Reset"
          variant="contained"
          type="submit"
          sx={{ backgroundColor: "gray"}}
          onClick={reset}>
          Reset Password
        </Button>
        <br/>
      </Box>
      </Grid>
    </div>
  );
};

export default ResetPassword;

/*Breif:React component that renders a form to reset a user's password. 

Import required dependencies:

React: the core React library
useState: a React hook that allows functional components to have state variables
useRef: a React hook that returns a mutable ref object
Fragment: a React component that can be used to group children without adding an extra node to the DOM
sendPasswordResetEmail: a function imported from the Firebase auth module to send password reset email to the user
Box, TextField, and Button components from the @mui/material package for styling

Define the ResetPassword component:

The ResetPassword component accepts a title prop, which is not used in this code.
The component declares two state variables: email (an empty string) and pwRef (a ref object with the initial value of {email}).
The component then uses the useAuth hook from reactfire to get the Firebase authentication instance.
The component renders a form using the Box, TextField, and Button components.
The TextField component is used to input the user's email address. The value prop is set to the email state variable and 
the onChange prop is used to update the email state variable with the new value.
The Button component is used to submit the form. The onClick prop is set to call the sendPasswordResetEmail function with the 
email state variable as its argument.
The Box component wraps the TextField and Button components and sets some styles using the sx prop.
The Fragment component is used to group the Box component without adding an extra node to the DOM.
The pwRef ref object is assigned to the Box, TextField, and Button components using the ref prop.
*/