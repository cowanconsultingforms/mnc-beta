import React, { useState, useRef, Fragment } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Box, TextField, Button } from "@mui/material";
import { useAuth,useInitAuth } from "reactfire";
const ResetPassword = ({ title }) => {
  const [ email, setEmail ] = useState("");
  const auth = useAuth();
  const pwRef = useRef({email})
  return (
    <Fragment>
      <Box
        component="form"
        className="password-reset"
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          marginTop: "5%",
          fontFamily: "Garamond",
        }}
        ref={pwRef}
      >
       
        <TextField value="email" onChange={(e) => setEmail(e.target.value)} ref={pwRef} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => sendPasswordResetEmail(email)}
          type="submit"
          ref={pwRef}
        />
      </Box>
    </Fragment>
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