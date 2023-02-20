import { createTheme } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#0052cc',
    },
    secondary: {
      main: '#edf2ff',
    },
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});

/* This code imports the createTheme function from the @mui/material/styles 
module, which is a function used to create and customize a Material-UI theme.


A theme object is created using the createTheme function, which has two properties
 for the palette: primary and secondary. The primary property defines the main 
 color of the application, while the secondary property defines a secondary color.
The main property of each color specifies the main color value.

Then, the theme object is updated by calling the createTheme function again, 
but this time with the previous theme object as the first argument. This creates 
a new theme object that extends the original theme. The new object adds a new 
color to the palette object, called info, which uses the main value from the 
secondary color of the original theme.

To end with, the code creates and customizes a Material-UI theme using the 
createTheme function.
*/