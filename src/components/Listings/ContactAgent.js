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

  export default function ContactButton() {
    const [isHover5, setIsHover5] = useState(false);

    const handleMouseEnter5 = () => {
      setIsHover5(true);
    };
  
    const handleMouseLeave5 = () => {
      setIsHover5(false);
    };
  

    const handleSubmit = (e) => {
      e.preventDefault();
      emailjs
        .sendForm(
          "service_pr7qyvs",
          "template_li0il5a",
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
  
    const formRef = useRef();
    return (
     
      <Button variant="outlined"
      onClick={handleSubmit}
      onMouseEnter={handleMouseEnter5}
      onMouseLeave={handleMouseLeave5}
      style={{
        fontSize: "14px",
        color: isHover5 ? "black" : "white",
        backgroundColor: isHover5 ? "white" : "#63666A",
        fontWeight: "bold",
        padding: "12px",
        fontFamily: "Garamond",
        width: "100%",
        border: "2px solid white",
        borderRadius: "10px",
      }}
     >
      Contact an agent about this listing
      </Button>
     
    );
  }

/*Breif: Defines a React component called ContactButton.

Imports various UI components and libraries such as Box, Typography, Button, TextField, TextareaAutosize, Divider, Paper, Stack, styled, and emailjs.

ContactButton component is used to render a button with the text "Contact an agent about this listing".
When the button is clicked, it invokes the handleSubmit function which sends an email using emailjs library with the information from the form.

The isHover5 state and the handleMouseEnter5 and handleMouseLeave5 functions are used to handle changes 
to the button's color and text when the mouse hovers over it.

The formRef is a reference to the form input element.
The handleSubmit function uses this reference to get the form data and send an email using emailjs.
ContactButton component can be used in the React application to provide a button for users to contact an agent about a particular listing. */










  