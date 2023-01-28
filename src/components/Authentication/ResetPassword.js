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
