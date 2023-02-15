import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, styled, Paper } from "@mui/material";
import { MNCLogo } from "../Misc/MNCLogo";
import { ContactForm } from "./ContactForm";
import { Footer } from "../Misc/Footer";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const Contact = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const formRef = useRef();

  return (
    <React.Fragment>
      <Item>
        {" "}
        <ContactForm />
      </Item>
    </React.Fragment>
  );
};
export default Contact;

/* const sendEmail = ({ name, email, message, phone }) => {
    email = data.email;
    phone = data.phone;
    message = data.message;
    name = data.name;

    /*  Email.send({
    Host: "smtp.gmail.com",
    Username: "slimmyyimmy1@gmail.com",
    Password: "yjuqmfklixryjpna",
    To: "slimmyyimmy1@gmail.com",
    From: "slimmyyimmy1@gmail.com",
    Subject: `Message from ${name} | MNCDevelopment`,
    Body: `Name: ${name}<br>Email: ${email}<br>Phone: ${phone}<br>Message: ${message}`
  }).then((message) => alert("Mail Sent! Response times vary from 24 - 48 Hours!")); 
  };
  const onSubmit = (data) => {
    setData(data);
    sendEmail(data.name, data.email, data.phone, data.message);
    navigate("/");
  }; */

  /*Breif: Defines a React functional component called Contact, which returns a ContactForm component wrapped in a styled Paper component. 
  The ContactForm component is a form used to collect contact information and a message from the user, which can be submitted to send an email.
  
  The useState hook is used to manage the form data, and the useNavigate hook from the react-router-dom library is used to navigate 
  to a different page after the form is submitted. The useRef hook is used to reference the form element.*/

  //Issue: Code for sending the email has been commented out and is not currently functional. 2-15-23