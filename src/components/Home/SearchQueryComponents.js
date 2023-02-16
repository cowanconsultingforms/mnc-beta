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

/*Breif: Imports various modules and components from the Material-UI library &
defines four React components: Item, RadioButtonsGroup, MyFormControlLabel, and UseRadioGroup.

The Item component creates a styled Paper component using the styled function from Material-UI.

The RadioButtonsGroup component is a form control that displays a group of radio buttons allowing the user to 
select one of three listing types. 
When the user selects a radio button, the onChange function passed as a prop is called with the selected value.

The MyFormControlLabel component is a custom implementation of the FormControlLabel component from Material-UI. 
It uses the useRadioGroup hook to get the current value of the radio group and sets the checked prop of the 
FormControlLabel based on whether the current value matches the value of the component.

The UseRadioGroup component is a more generic version of the RadioButtonsGroup component that can be used with any group of radio buttons. 
Uses the MyFormControlLabel component to render each radio button.
When the user selects a radio button, the onChange function passed as a prop is called with the selected value.*/