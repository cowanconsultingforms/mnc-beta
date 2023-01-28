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
