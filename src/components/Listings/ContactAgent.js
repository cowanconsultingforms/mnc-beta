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











  