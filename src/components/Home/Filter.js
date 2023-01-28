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