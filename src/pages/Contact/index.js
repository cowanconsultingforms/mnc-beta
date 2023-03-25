import React, { useEffect, useState,useRef } from "react";
import Contact from "../../components/Contact/Contact";
import ContactForm from "../../components/Contact/ContactForm";
import{ MNCLogo} from "../../components/Misc/MNCLogo";
import { Footer } from "../../components/Misc/Footer";
import { Stack } from "@mui/material";
import { useAuth, useSigninCheck } from "reactfire";

const ContactPage = () => {
    //useAuth hook from reactfire library to access firebase authentication

  const auth = useAuth();
    //useSignInCheck hook to check if the user is signed in
  const { status, data: signInCheckResult } = useSigninCheck();
 
  //checks if user is actually signed in
  const getSignedInUser = async () => {
    try {
      if (signInCheckResult.user !== false) {
      }
    } catch (err) {
      console.log(err.response);
    }
  };
  useEffect(() => {});
  return (
        
    //Stack component from @mui/material library
      <ContactForm />
  );
};
export default ContactPage;
