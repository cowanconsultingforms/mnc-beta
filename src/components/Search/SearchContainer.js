import { IconButton, Grid, Button, Stack } from "@mui/material";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, forwardRef, useEffect } from "react";
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
import "../../pages/Search/styles.css"
import { UseButtonGroup } from "./HomePageComponents";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
//import FilterBox from "./Filter";
import App from "../../App";
import { async } from "@firebase/util";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListingPage from "../../pages/Listings";
import SearchForm from "../components/Search";
import BasicTable from "../Listings/Table";
/*
This file was used to test props, this page should not be reused. 
*/
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
      placeholder="Search by zip, bathrooms, bedrooms, descriptions, price, etc..."
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


export const SearchContainer = (props) => {

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
      //pathname:'/listings'
    });
  
/*
  const [listings, setListings] = useState([
  {"street": ""},
  {"city": ""},
  {"state": ""},
  {"zip": ""},
  {"price": ""},
  {"description": ""},
  {"images": []},
  {"listed_by": ""},
  {"created_at": ""}]);
 */
 
  //const { status, data: signInCheckResult } = useSigninCheck();
  const firestore = useFirestore();
  //const [docID, setDocID] = useState("");
 
  //const [type, setType] = useState("forSale");
  const listingsRef = collection(firestore, `listings/${info.type}/properties`);
  const [searchQuery, setSearchQuery] = useState([]);
  
  const handleType = (e)=>{
    setInfo({ ...info, type: e.target.value })
  }
  /*
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    e.preventDefault();

  };
  */
  useEffect(()=>{
     const getData = async ()=>{
      const data = await getDocs(listingsRef);
      setListings(data.docs.map((doc)=> ({...doc.data(), id: doc.id})));
      console.log(data);
     }
     getData();
  }, []);

 const handleFilter =(e) =>{
  const searchWord = e.target.value;
  const seachFilter = listings.filter((listing)=>{
    return listing.bathrooms.includes(searchWord) || 
    listing.bedrooms.includes(searchWord) || 
    listing.street.toLowerCase().includes(searchWord) || 
    listing.zip.toLowerCase().includes(searchWord) ||
    listing.price.includes(searchWord) ||
    listing.description.toLowerCase().includes(searchWord) ||
    listing.city.toLowerCase().includes(searchWord) ||
    listing.state.toLowerCase().includes(searchWord) 
  });
  if (searchWord === ""){
    setSearchQuery([]);
  }else {
    setSearchQuery(seachFilter);
  }
 };
 /*const seachFilter = listings.filter((listing)=>{
    if (listings === ''){
       return listing;
    }
    else if (listing.bathrooms.includes(searchWord)) {
      return listing;
    }
  });
  setListings(seachFilter);
 } */

/*
  const getData = async ()=>{
    const data = await getDocs(listingsRef, where("bathrooms" , "==", `${searchQuery}`)).then((onSnapshot)=>{
      onSnapshot.docs.entries(listings.bathrooms);
      setListings(data.docs.map((doc)=> ({...doc.data(), id: doc.id})));
      console.log(data);
      })
  };
  getData();
  

  const handleSearch = (e) => {
    e.preventDefault();
  }
  */
/*
  const getInfo = async() =>{
      await getDocs(listingsRef, {bathrooms: searchQuery})
  };
*/
 

  return (
    <Grid2
    component="form"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        margin: "auto",
      }}>
         <Grid2 sm={12}>
      
               <AppBar position="static" sx ={{color:"white", backgroundColor:"rgb(196, 196, 196)",
    boxShadow: "0px 5px 10px 2px #888888", textDecoration: "none", overflow:"hidden", 
    display: "flex", flexDirection: "row",justifyContent: "space-between", alignItems: "center", fontSize: "20px"}}>
        <Toolbar>
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
               top: 5,
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
      <FormControl required sx={{ m: 1, minWidth: 120, backgroundColor:"white", color:"black",justifyContent: "center",
          alignItems: "center"}}>
        <InputLabel id="demo-simple-select-required-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={info.type}
          onChange={(e) => setInfo({ ...info, type: e.target.value })}
          sx={{ color: "black", fontFamily: "Garamond",
          width: "100%",
          fontSize:"20px",
          justifyContent: "center",
          alignItems: "center",}}
          variant="filled"
        >
          <MenuItem value={"forSale"}>Buy</MenuItem>
          <MenuItem value={"sold"}>Sold</MenuItem>
          <MenuItem value={"rentals"}>Rent</MenuItem>
        </Select>
        
      </FormControl>
  
      
        </Toolbar>
      </AppBar>
      <Item elevation={0}
sx={{flexDirection: "row", display: "flex" }}>
<>
{searchQuery.length !== 0 && (
 <div>
  {searchQuery.slice(0,15).map((listing, index)=>{
    return(
      <div key = {index} elevation={0}>
      <Grid container spacing={1} elevation={0}>
<Grid xs={8} elevation={0}>
<Item sx={{}}>
<div>
<img src ={listing.image} alt="" className="Image"/>
</div>
</Item>
</Grid>
<Grid xs={4} elevation={0}>
 <Item sx={{
  textAlign: "left",
  margin: "3px",width: "30rem",paddingLeft: "10px",
  fontSize:"20px",fontWeight: "bold",color:"black"}}> 
<div>
<Link to= {`/listings/${listing.bathrooms}`}> 
<p>Bathrooms: {listing.bathrooms}</p>
<p>Bedrooms: {listing.bedrooms}</p>
<p>Price: {listing.price}</p>
<p>City: {listing.city}</p>
<p>Description: {listing.description}</p> 
<p>State: {listing.state}</p>
<p>Street: {listing.street}</p>
<p>Zip: {listing.zip}</p>
</Link>
</div>
</Item>
<Item>
<SearchForm data = {searchQuery}/>
<ListingPage data ={searchQuery}/>
</Item>
</Grid>

</Grid>

   </div>
      
    )
  })}
 </div>
)}
</>
      </Item>
     
      </Grid2>
    </Grid2>

  );
};

export default SearchContainer;


/*Imports various libraries such as React, Firebase, MUI, and Bootstrap, among others. It also defines some constants for colors.

The SearchContainer component is defined, which is exported.
Defines state variables such as isHover, isHover2, isHover3, info, and listings. 
Defines functions for handling mouse hover events for three different elements.

The CustomInput component is defined using the InputUnstyled component from MUI. 
Uses a styled input element with custom styling for its appearance.

goListings function is defined, which navigates the user to the listings page when called.

Defines several MUI components, such as IconButton, Grid, Button, Stack, Box, Toolbar, Typography, and Select. 
It also imports several MUI icons, such as SearchTwoToneIcon, CloseIcon, and MenuIcon.

The SearchForm and BasicTable components are imported.

Exports the SearchContainer component.*/