import { useState, useEffect, useRef, forwardRef } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useUser, useFirestore, useSigninCheck } from "reactfire";
import { doc, getDoc } from "firebase/firestore";
export default function FilterBox() {
  const [listing, setListing] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [address, setAddess] = useState('');
  const [zip, setZip] = useState('');
  const [listing_ID, setListingID] = useState('');
  const { data: user } = useUser();
const firestore = useFirestore();

  const handleChange = (event) => {
    setListing(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Listing Filter</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={listing}
          label="Age"
          onChange={handleChange}
          >
          <MenuItem value={neighborhood}>Neighborhood</MenuItem>
          <MenuItem value={city}>City</MenuItem>
          <MenuItem value={state}>State</MenuItem>
          <MenuItem value={address}>Address</MenuItem>
          <MenuItem value={zip}>Zip</MenuItem>
          <MenuItem value={listing_ID}>listing_ID</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
/*Breif:React component that defines a FilterBox that allows a user to select a filter for a listing. 
It imports several modules including useState, useEffect, useRef, forwardRef from the react package, 
as well as several modules from the @mui/material package. 
It also imports several hooks from the reactfire package that allow it to interact with Firebase services.

The FilterBox component defines several state variables using the useState hook, including listing, neighborhood,
city, state, address, zip, and listing_ID. 
It then uses the useUser and useFirestore hooks from the reactfire package to access the currently logged-in user and the Firestore database.

The handleChange function is called when the user selects a new value from the Select dropdown list,
and it sets the value of the listing state variable to the new value.

Finally, the component returns a Box element that contains a FormControl element and a Select element.
The Select element allows the user to choose a filter from the dropdown list, 
and the selected value is stored in the listing state variable. 
The MenuItem elements define the various filter options that the user can choose from.   */