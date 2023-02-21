import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  direction:'row'
}));

export default Item;


/*Breif: Imports various components and utilities from the MUI (Material UI) library, including the Paper and Stack components, and the styled 
utility function.

The code then defines a new component called Item using the styled function to create a customized version of the Paper component with
additional styles applied to it. 

The Item component takes advantage of the MUI theme to change its background color based on whether the current theme mode is dark or light, 
and sets other properties such as padding, text alignment, and color.

Item component is exported as the default export of the module, which means it can be imported and used in other parts of the application.*/

