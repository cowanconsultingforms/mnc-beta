import { styled } from "@mui/system";
import { Paper } from "@mui/material";
import * as React from "react";
import {
  Radio,
  FormControlLabel,
  RadioGroup,
  useRadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";

export const Item = styled(Paper)({});

export const RadioButtonsGroup = ({ onChange }) => {
  return (
    <FormControl>
      <FormLabel id="listing-type">Select Listing Type</FormLabel>
      <RadioGroup
        aria-labelledby="listing-type"
        defaultValue="forSale"
        name="listing-group"
        onChange={onChange}
        sx={{ fontFamily: "Garamond" }}
      >
        <FormControlLabel
          value="forSale"
          control={<Radio />}
          label="List For Sale"
          sx={{ fontFamily: "Garamond" }}
        />
        <FormControlLabel
          value="forRent"
          control={<Radio />}
          label="List For Rent"
          sx={{ fontFamily: "Garamond" }}
        />
        <FormControlLabel
          value="sold"
          control={<Radio />}
          label="Sold Listings"
          sx={{ fontFamily: "Garamond" }}
        />
      </RadioGroup>
    </FormControl>
  );
};

export const MyFormControlLabel = (props) => {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <FormControlLabel checked={checked} {...props} />;
};

export const UseRadioGroup = ({ onChange }) => {
  return (
    <RadioGroup
      name="listing-type-group"
      defaultValue="null"
      onChange={onChange}
      sx={{ fontFamily: "Garamond" }}
    >
      <MyFormControlLabel
        value="forSale"
        control={<Radio />}
        label="List For Sale"
        sx={{ fontFamily: "Garamond" }}
      />
      <MyFormControlLabel
        value="forRent"
        control={<Radio />}
        label="List For Rent"
        sx={{ fontFamily: "Garamond" }}
      />
      <MyFormControlLabel
        value="sold"
        control={<Radio />}
        label="Sold"
        sx={{ fontFamily: "Garamond" }}
      />
    </RadioGroup>
  );
};

/*Breif: File exports several React components and some MUI components.

The MUI (Material UI) components imported at the top include:

styled from @mui/system: a utility function that allows you to create a styled component based on an existing component.
Paper from @mui/material: a component that provides a basic paper-like background for other components.

The React components that are exported include:

Item: a styled Paper component that can be used as a wrapper or container for other components.
RadioButtonsGroup: a component that renders a group of radio buttons to allow a user to select a listing type (for sale, for rent, or sold).
MyFormControlLabel: a custom component that extends the MUI FormControlLabel component and determines whether it should be checked based on 
the value of the parent radio group.
UseRadioGroup: a component that renders a group of radio buttons for selecting a listing type, using the MyFormControlLabel component to 
provide custom behavior for the labels.

Each component is a functional component that returns JSX, which can be rendered as a part of a React application.*/



