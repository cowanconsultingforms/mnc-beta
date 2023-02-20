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

/* This is a JavaScript code snippet that defines a React component that renders a
 styled Paper component from the Material UI library.

The first line imports the entire React library and assigns it to the variable 
React.

The next three lines import three components from the Material UI library: Paper, 
Stack, and styled. The styled function is used to create a new, styled version of 
the Paper component.

The Item variable is defined as the result of calling the styled function with 
the Paper component as an argument. The argument to the styled function is an 
arrow function that takes a theme argument and returns an object that describes 
the styling for the Paper component. This styling includes setting the background 
color to a dark color if the current theme is dark, setting the padding and text 
alignment, and setting the text color based on the theme.

Finally, the Item component is exported as the default export of the module. 
This means that other modules can import this module and use the Item component 
directly.

*/

