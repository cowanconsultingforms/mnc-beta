import { Alert, Box, Button } from "@mui/material";
import React, { useEffect } from "react";
import { useAuth, useUser } from "reactfire";
import {
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { useRef } from "react";
import LoginForm from "../../components/Authentication/LoginForm";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Misc/Footer";

const initialValue = {
  email: "",
  password: "",
  confirmPassword: "",
};

export const LoginPage = () => {
  const auth = useAuth();
  const { status, data: user } = useUser();
  const formRef = useRef(initialValue);
  const navigate = useNavigate();
  const validateInput = () => {
    if (formRef.current.email === null || formRef.current.email === "") {
      return setTimeout(
        () => <Alert severity="warning">Email must be filled in</Alert>,
        2000
      );
    } else if (formRef.current.password !== formRef.current.confirmPassword) {
      return setTimeout(
        () => <Alert severity="warning">Passwords must match</Alert>,
        2000
      );
    } else {
      try {
      } catch (error) {}
    }
  };

  const handleChange = (e) => {
    e = e.target.value;
  };
  const emailLink = (auth, email) => {
    sendSignInLinkToEmail(auth, email)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const handleLogin = async (e) => {
    if (!user) {
      try {
        validateInput()
          .then(() =>
            signInWithEmailAndPassword(
              auth,
              formRef.current.email,
              formRef.current.password
            )
          )
          .then((res) => navigate("/", { user: res.user }));
      } catch (error) {
        console.log(error);
      }
    }
  };
  const renderLoginForm = async () => {
    if (status !== "success" || status !== "error") {
      return <LoginForm ref={formRef} />;
    }
  };
  useEffect(() => {
    if (!user) renderLoginForm();
  }, [user]);

  return (
    <Box
      className="LoginPage"
      component="form"
      onSubmit={handleLogin}
      ref={formRef}
      onChange={handleChange}
    >
      {renderLoginForm()}
      <Button type="submit"></Button>
      <Footer />
    </Box>
  );
};

export default LoginPage;
