import React, { useEffect, useState } from "react";
import Contact from "../../components/Contact/Contact";
import ContactForm from "../../components/Contact/ContactForm";
import MNCLogo from "../../components/Misc/MNCLogo";
import { Footer } from "../../components/Misc/Footer";
import { Stack } from "@mui/material";
import NavBar from "../../components/Misc/NavBar";
import { useAuth, useSigninCheck } from "reactfire";
import { useForm } from "react-hook-form";

const ContactPage = () => {
  const { status, data: signInCheckResult } = useSigninCheck();
  const methods = useForm();
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
    <Stack
      className="contact-container"
      component="div"
      ref={formRef}
      sx={{
        marginTop: "5%",
        marginLeft: "10%",
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MNCLogo />
      <ContactForm />
      <Footer />
    </Stack>
  );
};
export default ContactPage;
