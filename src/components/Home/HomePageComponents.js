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
  ButtonGroup
} from "@mui/material";
import { useEffect, useState, useRef, forwardRef } from "react";

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
  const buttonGroup =  useRadioGroup();

  let checked = false;

  if (buttonGroup) {
    checked = buttonGroup.value === props.value;
  }

  return <Button checked={checked} {...props} />;
};
//Copy of Home Buttons


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
            //onClick={(e) => onchange(e.target.value)}
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

