import {
  serverTimestamp,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { styled } from "@mui/system";
import { Paper } from "@mui/material";
import * as React from "react";
import {
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  useRadioGroup,
  FormControl,
  FormLabel,
  Button,
  ButtonGroup,
} from "@mui/material";
import { useEffect, useState, useRef, forwardRef } from "react";
import { InputUnstyled } from "@mui/base";
export const Item = styled(Paper)({});
export const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
};
export const grey = {
  50: "#F3F6F9",
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7",
  400: "#B2BAC2",
  500: "#A0AAB4",
  600: "#6F7E8C",
  700: "#3E5060",
  800: "#2D3843",
  900: "#1A2027",
};
export const StyledInputElement = styled("input")(
  ({ theme }) => `
  width: 550px;
  height: 50px;
  font-family: Garamond;
  fontSize: 75px;
  font-weight: 500;
  line-height: 1.5;
  padding: 12px;
  border-radius: 12px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 2px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${
    theme.palette.mode === "dark" ? grey[900] : grey[50]
  };
  
  &:hover {
    border-color: ${blue[400]};
  }
  
  &:focus {
    border-color: ${blue[400]};
    outline: 3px solid ${theme.palette.mode === "dark" ? blue[500] : blue[200]};
  }
`
);
export const CustomInput = forwardRef(function CustomInput(props, ref) {
  return (
    <InputUnstyled
      components={{ Input: StyledInputElement }}
      {...props}
      ref={ref}
      className="search-input"
      type="text"
      placeholder="Search by zip, bathrooms, bedrooms, descriptions, price, etc..."
    />
  );
});
export const RadioTypeGroup = ({ onChange }) => {
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
  const buttonGroup = useRadioGroup();

  let checked = false;

  if (buttonGroup) {
    checked = buttonGroup.value === props.value;
  }

  return <Button checked={checked} {...props} />;
};

export const UseButtonGroup = ({ onChange }) => {
  const [isHover, setIsHover] = useState(false);
  const [isHover2, setIsHover2] = useState(false);
  const [isHover3, setIsHover3] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleMouseEnter2 = () => {
    setIsHover2(true);
  };
  const handleMouseLeave2 = () => {
    setIsHover2(false);
  };

  const handleMouseEnter3 = () => {
    setIsHover3(true);
  };
  const handleMouseLeave3 = () => {
    setIsHover3(false);
  };

  return (
    <ButtonGroup
      name="listing-type-group"
      defaultValue="null"
      onChange={onChange}
      sx={{ fontFamily: "Garamond" }}
    >
      <Button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disableFocusRipple
        className="buy-button"
        //onChange={handleType}
        value={"forSale"}
        style={{
          fontSize: "16px",
          color: isHover ? "black" : "white",
          backgroundColor: isHover ? "white" : "#63666A",
          fontWeight: "bold",
          padding: "15px",
          fontFamily: "Garamond",
        }}
      >
        Buy
      </Button>

      <Button
        onMouseEnter={handleMouseEnter2}
        onMouseLeave={handleMouseLeave2}
        disableFocusRipple
        className="rent-button"
        style={{
          fontWeight: "bold",
          padding: "15px",
          fontSize: "16px",
          color: isHover2 ? "black" : "white",
          backgroundColor: isHover2 ? "white" : "#858181",
          fontFamily: "Garamond",
        }}
        //onChange={handleType}
        value={"rentals"}
        //onClick={(e) => (e.target.value)}
      >
        Rent
      </Button>

      <Button
        onMouseEnter={handleMouseEnter3}
        onMouseLeave={handleMouseLeave3}
        className="sold-button"
        style={{
          borderBox: "solid 1px black",
          textAlign: "center",
          padding: "15px",
          fontSize: "16px",
          width: "90px",
          fontFamily: "Garamond",
          backgroundColor: isHover3 ? "white" : "lightgrey",
          color: isHover3 ? "black" : "black",
          fontWeight: "bold",
        }}
        //onChange={handleType}
        value={"sold"}
        //onClick={(e) => (e.target.value)}
      >
        Sold
      </Button>
    </ButtonGroup>
  );
};

/*Imports various components and libraries from different packages such as firebase, MUI (Material-UI), and React.

Ddefines some constants such as colors and styled components.

CustomInput component is a custom input field with some specific styles.

RadioTypeGroup component is a radio button group for selecting a listing type.

UseButtonGroup component is a button group for choosing listing types (Buy, Rent, Sold).*/