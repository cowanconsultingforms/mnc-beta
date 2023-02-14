import { IconButton, Grid, Button, Stack } from "@mui/material";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, forwardRef, useEffect, useReducer, useCallback, useMemo } from "react";
import { InputUnstyled } from "@mui/base";
import Item from "../Misc/Surface";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { styled } from "@mui/system";
import { useUser, useFirestore, useSigninCheck } from "reactfire";
import {
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  collection,
  where,
  addDoc,
  Firestore,
} from "firebase/firestore";
import { Spinner } from "react-bootstrap";
import { useNavigate, createSearchParams } from "react-router-dom";
import "../../pages/Home/styles.css";
import "../../pages/Listings/styles.css";
import { UseButtonGroup } from "./HomeButtons";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import App from "../../App";
//import FilterBox from "./Filter";
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { async } from "@firebase/util";
const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
};
const grey = {
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
const StyledInputElement = styled("input")(
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
    outline: 3px solid ${
      theme.palette.mode === "dark" ? blue[500] : blue[200]
    };
  }
`
);
const CustomInput = forwardRef(function CustomInput(props, ref) {
  
  return (
    <InputUnstyled
      components={{ Input: StyledInputElement }}
      {...props}
      ref={ref}
      className="search-input"
      type="text"
      placeholder="Search by Location or point of interest"
    />
  );
});
const initialValues = {
  type: "forSale",
  street: "",
  city: "",
  state: "",
  zip: "",
  price: "",
  bedrooms: "",
  bathrooms: "",
  sqft: "",
  description: "",
  images: [],
  imageCount: 0,
};


export const HomeSearchForm = (props) => {

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

  //const [data, setData] = useState("");
  const[info, setInfo] = useState(initialValues);
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  
  const goListings = () =>
    navigate({
      pathname: `/listings/${searchQuery.bathrooms}`

    });
  
  const firestore = useFirestore();

 
  const listingsRef = collection(firestore, `listings/${info.type}/properties`);
  const [searchQuery, setSearchQuery] = useState([]);
  
  const handleType = (e)=>{
    setInfo({ ...info, type: e.target.value })
  }
  
  const getData = useCallback(async()=>{
    const data = await getDocs(listingsRef);
    setListings(data.docs.map((doc)=> ({...doc.data(), id: doc.id})));
    console.log(data);
  }, []);

  useEffect(()=>{
    getData();
  }, [getData])

 const handleFilter =(e) =>{
  const searchWord = e.target.value;
  const seachFilter = listings.filter((listing)=>{
    return listing.city.toLowerCase().startsWith(searchWord) ||
    listing.city.toUpperCase().startsWith(searchWord) ||
    listing.city.startsWith(searchWord)
  
  });
  if (searchWord === ""){
    setSearchQuery([]);
  }else {
    setSearchQuery(seachFilter);
  }
 };
 
 

  return (
    <Grid2
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        margin: "auto",
      }}
    >
      <Grid2 sm={8}>
        <Item
          elevation={0}
          sx={{ display: "flex", flexDirection: "row", width: "100%" }}
        >
    
        </Item>
      </Grid2>
     
      <Item
        elevation={0}
        sx={{ width: "100%", flexDirection: "column", display: "flex" }}
      >
        
        <Item elevation={0}
        sx={{ width: "100%", flexDirection: "row", display: "flex", 
        alignItems: "center", justifyContent: "center"}}>
        <UseButtonGroup
        /*
        This button group is responible for changing the directory
        but it doesn't work because I am calling firebase asynchronously
        The initial idea was to have the collection called like this
        const listingsRef = collection(firestore, `listings/${info.type}/properties`);
        and changed it through the buttons using useState. But it doesn't work. What 
        i think should be done it to switch the collection based on if the user click Buy, 
        it would point to const listingsRef = collection(firestore, 'listings/forSale/properties');
        and then have the useEffect could be called again. 
        This is an idea i have but i doubt it will work. One task you can guys can do 
        is to figure out a solution where a user can search based on Buy, Rent, Sold and 
        the directories switch.
        */ 
        aria-label="listing-type"
        onChange={(e) => setInfo({ ...info, type: e.target.value })}
        name="type"
        sx={{alignItems: "center", justifyContent: "center"}}
        />
        </Item>
      
      <Item elevation={0} 
      sx={{ width: "100%", flexDirection: "row", display: "flex" }}>
      <CustomInput onChange={handleFilter}>
          
          </CustomInput> 
        
        <IconButton
          className="search-icon"
          aria-label="search"
          type="submit"
          disableFocusRipple
          sx={{
            height: 35,
            width: 35,
            top: 6,
          }}
          onClick={goListings}
        >
  
          <SearchTwoToneIcon
            sx={{
              height: 35,
              width: 40,
            }}
          />
        </IconButton>
      </Item>

      </Item>
      <Item elevation={0}
sx={{flexDirection: "column", display: "flex" }}>
<>
{searchQuery.length !== 0 && (
 <div className= "dataResult">
  {searchQuery.slice(0,15).map((listing, index)=>{
    return(
      <div className = "dataItem" key = {index}>
      <a href = {`/search/${listing.city}`}> 
     
      <p>City: {listing.city}</p>
    
     </a>
      </div>
      
    )
  })}
 </div>
)}
</>
      </Item>
      <br></br>
    </Grid2>
  );
};

export default HomeSearchForm;




