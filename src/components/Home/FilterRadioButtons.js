import { useState, useEffect, useRef, forwardRef } from "react";
import Radio from '@mui/material/Radio';
import { Button } from "@mui/material";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function FilterRadioButtons() {
  //const [value, setValue] = useState('female');

  const [listing, setListing] = useState('listing');
  const [neighborhood, setNeighborhood] = useState('neighborhood');
  const [city, setCity] = useState('city');
  const [state, setState] = useState('state');
  const [address, setAddess] = useState('address');
  const [zip, setZip] = useState('zip');
  const [listing_ID, setListingID] = useState('listings_id');

  const handleChange = (event) => {
    setListing(event.target.value);
  };

  return (
    <FormControl sx={{display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    margin: "auto",
    }}>
    
        
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={listing}
        onChange={handleChange}
        sx={{ display: "flex", flexDirection: "row", width: "100%" }}
      >
        <FormControlLabel value={neighborhood} control={<Button />} label="Neighborhood" />
        <FormControlLabel value={city} control={<Radio />} label="City" />
        <FormControlLabel value={state} control={<Radio />} label="State" />
        <FormControlLabel value={address} control={<Radio />} label="Address" />
        <FormControlLabel value={zip} control={<Radio />} label="Zip" />
        <FormControlLabel value={listing_ID} control={<Radio />} label="Listing ID" />
        
      </RadioGroup>
    </FormControl>
  );
}
/*Breif: Defines a React component called FilterRadioButtons
that renders a set of radio buttons with different values, such as "Neighborhood", "City", "State", "Address", "Zip", and "Listing ID".
When a user selects one of these values, the handleChange function is called to set the listing state to the selected value.

The component uses Material UI components such as Radio, FormControl, FormLabel, and FormControlLabel to style and position the radio buttons.

This component can be used as a filter to search for listings on a real estate website, for example.*/