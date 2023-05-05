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
import { Grid } from "@mui/material";

import { FirebaseStorage, ref } from "firebase/storage";
import { getDocs, collection } from "firebase/firestore";
import { useAuth, useFirestore, useStorage, useStorageDownloadURL } from "reactfire";








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

export const ContactForm = ({ }) => {

  const storage = useStorage()
  const backgroundImage = ref(storage, "gs://mnc-development.appspot.com/images/contact.jpg")
  const { status, data: url1 } = useStorageDownloadURL(backgroundImage);




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
  const [zip, setZip] = useState("");

  return (

<div>
      {status !== "success" ? (
      <h1>Loading...</h1>
    ) : (
<div style={{ 
  backgroundImage: `url(${url1})`, 
  backgroundAttachment: "fixed",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100vh",
  width: "100vw",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: -1
}}>



    <Grid 
      className = "contact-form"
      container 
      alignItems="center" 
      direction="column"
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
      }}>
      <Box
      className="contact-form-box"
      component="form"
      autoComplete="true"
      noValidate
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
        alignItems: "center",
        borderRadius: "20px",
        backgroundColor: "#eeeeee",
        marginBottom: "30px",
        marginTop: "150px",
        width: "525px"
      }}>




        
      <Grid display="flex" justifyContent="center" alignItems="center">
        <h1>Contact Us</h1>
      </Grid>
      <Stack
        direction="row"
        spacing={5}>
        <TextField
          name="name"
          label="Name"
          variant="outlined"
          fullWidth
          sx={{
            fontFamily: "Garamond",
            width: "50%",
            backgroundColor: 'whitesmoke'
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
            width: "50%",
            backgroundColor: 'whitesmoke'
          }}
        />
        </Stack>
        <br/>
        <Stack
        direction="row"
        spacing={5}>
        <TextField
          name="phone"
          label="Phone"
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          sx={{
            fontFamily: "Garamond",
            width: "50%",
            backgroundColor: 'whitesmoke'
          }}
        />
        <TextField
          name="zip"
          label="Zip"
          onChange={(e) => setZip(e.target.value)}
          fullWidth
          sx={{
            fontFamily: "Garamond",
            width: "50%",
            backgroundColor: 'whitesmoke'
          }}
        />
        </Stack>
        <br/>
        <TextareaAutosize
          name="message"
          label="Message"
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: 430, border: "2px solid gray", height: 180,backgroundColor: 'whitesmoke' }}
          />
          <br/>
          <Button
          key="Submit"
          variant="contained"
          type="submit"
          sx={{ backgroundColor: "gray"}}
          onClick={handleSubmit}>
          Send Message
        </Button>
        <br/>
      </Box>
    </Grid>
    </div>
)}; </div>
  );
};

export default ContactForm;

/*Breif:JS File that exports a React component called ContactForm.

The component renders a contact form that allows a user to enter their name, email address, phone number, and message. 
When the user submits the form, the component uses the emailjs library to send an email to a specified email address.

The component also uses the useNavigate hook from the react-router-dom library to navigate to the home page of the application
when the user clicks the "Home" button.

The component uses various Material UI components such as Box, Typography, Button, TextField, ButtonGroup, TextareaAutosize, Divider,
Paper, and Stack to create the UI of the contact form. The component also uses the styled function from the Material UI library to
create a custom styled Paper component called Item. */