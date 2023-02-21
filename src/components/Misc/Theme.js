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

/*Breif: Creates a MUI (Material-UI) theme using the createTheme function imported from the @mui/material/styles module.

Theme variable is assigned an object with a palette property that defines two color schemes, primary and secondary, with their corresponding colors.

CreateTheme function is called again with two arguments: the first argument is the theme object, and the second argument
 is another object that overrides the info color in the palette.

The info color is set to the same color as the secondary color in the original palette, by using theme.palette.secondary.main.

The resulting theme object has three color schemes: primary, secondary, and info. The info color is derived from the secondary color 
in the original palette. This theme can then be used to style MUI components in a React application.*/