import {
  Box,
  Typography,
  Button,
  TextField,
  ButtonGroup,
  TextareaAutosize,
  Divider,
} from "@mui/material";
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import emailjs from "@emailjs/browser";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(196 196 196)" : "rgb(196 196 196)",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
// needs an email service handler

/* 
I made the contact form and followed the instructions 
in this video to get up and running. https://www.youtube.com/watch?v=NgWGllOjkbs  

You can test this 
*/

export const ContactForm = ({ ref }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_pr7qyvs",
        "template_je5nkis",
        formRef.current,
        "7avGOyYSCkf7Kx45h"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  const navigate = useNavigate();
  const formRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  return (
    <Stack
      className="contact-form"
      component="div"
      direction="column"
      sx={{ alignItems: "center", justifyContent: "center",fontFamily:'Garamond' }}
    >
      <Item sx={{ border: "1px solid black", borderBottom: "none" }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Garamond",
            alignItems: "center",
            justifyContent: "center",
            width: 200,
          }}
        >
          Contact Form
        </Typography>
        <Divider />
        <Typography
          variant="h6"
          sx={{ fontFamily: "Garamond", fontWeight: "bold" }}
        >
          Send a Message to Us!{" "}
        </Typography>
      </Item>

      <Item
        className="contact-form"
        component="form"
        autoComplete="true"
        noValidate
        ref={formRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          border: "2px solid black",
          borderRadius: "5px",
          width: 500,
          fontFamily: "Garamond",
          height: "fit-content",
        }}
      >
        <TextField
          name="name"
          label="Name"
          sx={{
            fontFamily: "Garamond",
            background: "white",
            width: "95%",
            border: "2px solid gray",
            borderRadius: "5px;",
          }}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          name="email"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{
            fontFamily: "Garamond",
            background: "white",
            width: "95%",
            border: "2px solid gray",
            borderRadius: "10px;",
          }}
        />
        <TextField
          name="phone"
          label="Phone"
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          sx={{
            fontFamily: "Garamond",
            background: "white",
            width: "95%",
            border: "2px solid gray",
            borderRadius: "10px",
          }}
        />
        <TextareaAutosize
          name="message"
          label="Message"
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: 430, border: "2px solid gray", height: 180 }}
        />
        <ButtonGroup sx={{ marginTop: "10px", border: "2px solid gray" }}>
          <Button
            onClick={handleSubmit}
            sx={{
              fontFamily: "Garamond",
              background: "gray",
              width: "100%",
              border: "2px solid white",
              borderRadius: "10px;",
              color: "white",
            }}
          >
            Send Message
          </Button>
          <Button
            sx={{
              fontFamily: "Garamond",
              background: "gray",
              width: "100%",
              border: "2px solid white",
              borderRadius: "10px;",
              color: "white",
            }}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
        </ButtonGroup>
      </Item>
    </Stack>
  );
};

export default ContactForm;
