import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, styled, Paper } from "@mui/material";
import { MNCLogo } from "../Misc/MNCLogo";
import { ContactForm } from "./ContactForm";
import { Footer } from "../Misc/Footer";

/*
This was Adam's design.
 I made the contact form and followed the instructions 
in this video to get up and running. https://www.youtube.com/watch?v=NgWGllOjkbs 
*/

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
