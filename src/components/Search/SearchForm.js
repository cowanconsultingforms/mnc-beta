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
import "../../pages/Search/styles.css";
import { useParams } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

//import { async } from "@firebase/util";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CarouselSearchImage from "./SearchCarousel";
import 'bootstrap/dist/css/bootstrap.css';
import Carousel from 'react-bootstrap/Carousel';

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

/*
const ACTIONS= {
  BUYCHANGE:'BuyChange',
  SOLDCHANGE:'SoldChange',
  RENTCHANGE:'RentChange',
}

function reducer(state, action){
 switch(action.Type)
 {
  case ACTIONS.BUYCHANGE:
    return{Type:'forSale'};
  case ACTIONS.SOLDCHANGE:
  return{Type:'sold'};
  case ACTIONS.RENTCHANGE:
    return{Type:'rentals'}
    default:
      return state
 }
 
}
*/
export const SearchForm = () => {

 
  const [index1, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const[info, setInfo] = useState(initialValues);
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const {city} = useParams();

  const goListings = () =>
    navigate({
      //pathname: `/listings/${listings.listing_ID}`
     
    });
    const showType = useCallback((e)=>
    {
      alert(`Type Changed ${info.type}`)
      setInfo( {...info, type: e.target.value})
      console.log(setInfo);
    }, [info])
  
  /*
  Old useEffect

  useEffect(()=>{
     const getData = async ()=>{
      const data = await getDocs(listingsRef);
      setListings(data.docs.map((doc)=> ({...doc.data(), id: doc.id})));
      console.log(data);
     };
     getData();
  }, []);
 */
  const firestore = useFirestore();
  const listingsRef = collection(firestore, `listings/${info.type}/properties`);
  const [searchQuery, setSearchQuery] = useState([]);
  //Do not add listingsRef to the array, the setlistings will go on infinitely. 
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
    return listing.bathrooms.startsWith(searchWord) || 
    listing.bedrooms.startsWith(searchWord) || 
    listing.street.toLowerCase().startsWith(searchWord) || 
    listing.street.toUpperCase().startsWith(searchWord)||
    listing.zip.startsWith(searchWord) ||
    listing.price.startsWith(searchWord) ||
    listing.description.toLowerCase().startsWith(searchWord) ||listing.description.toUpperCase().startsWith(searchWord)||
    listing.city.toLowerCase().startsWith(searchWord) ||listing.city.toUpperCase().startsWith(searchWord)||
    listing.state.toLowerCase().startsWith(searchWord)|| listing.state.toUpperCase().startsWith(searchWord)
  });
  if (searchWord === ""){
    setSearchQuery([]);
  }else {
    setSearchQuery(seachFilter);
  }
 };


 const ACTIONS= {
  BUYCHANGE:'BuyChange',
  SOLDCHANGE:'SoldChange',
  RENTCHANGE:'RentChange',
}
function reducer(state, action){
 switch(action.Type)
 {
  case ACTIONS.BUYCHANGE:
    return{Type:'forSale'};
  case ACTIONS.SOLDCHANGE:
  return{Type:'sold'};
  case ACTIONS.RENTCHANGE:
    return{Type:'rentals'}
    default:
      return state
 }
 
}
 const [state, dispatch] = useReducer(reducer,{ Type: 'forSale'});

  function BuyChange(){
    dispatch({ change: ACTIONS.BUYCHANGE})
    console.log(dispatch);
  }
  function SoldChange(){
    dispatch({change: ACTIONS.RENTCHANGE})
    console.log(dispatch);
  }
  function RentChange(){
    dispatch({change: ACTIONS.SOLDCHANGE})
    console.log(dispatch);
  }


  const handleChange = (event) => {
    setInfo({...info, type: event.target.value});
    console.log(setInfo);
  };

  
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
      <FormControl required sx={{ m: 1, minWidth: 160, backgroundColor:"white", color:"black",justifyContent: "center",
          alignItems: "center"}}>
        <InputLabel id="demo-simple-select-required-label" sx={{color:"black"}}>Please Select a Type</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={info.type}
          onChange={showType}
          sx={{ color: "black", fontFamily: "Garamond",
          width: "100%",
          fontSize:"20px",
          justifyContent: "center",
          alignItems: "center",}}
          variant="filled"
        >
           <MenuItem disabled value="">
            <em>none</em>
          </MenuItem>
          <MenuItem 
          value={"forSale"}
          //onSelect={BuyChange}
          >Buy</MenuItem>
          <MenuItem 
          value={"sold"}
          //onSelect={SoldChange}
          >Sold</MenuItem>
          <MenuItem 
          value={"rentals"}
         // onSelect={RentChange}
          >Rent</MenuItem>
        </Select>
      </FormControl>
  
      
        </Toolbar>
      </AppBar>
      <Item elevation={0}
sx={{flexDirection: "row", display: "flex" }}>
<>
{searchQuery.length !== 0 && (
 <div>
  {searchQuery.slice(0,15).filter((listing) => listing.city === city).map((listing, index)=>{
    return(
      <div key = {index} elevation={0}>
      <Grid container spacing={1} elevation={0}>
<Grid xs={8} elevation={0} spacing={1} >
<Item xs={8} elevation={0} spacing={2} >
<div className="full-card" key={ index }>
    <Carousel activeIndex={index1} onSelect={handleSelect} fade style={{ width: "850px",
  height: "400px",margin: "auto"}}>
      <Carousel.Item>
        <img className="CarouselImage" src={listing.images.image1} alt="First slide" />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="CarouselImage" src={listing.images.image2} alt="Second slide" />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="CarouselImage" src={listing.images.image3} alt="Third slide" />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
      </div>
</Item>
</Grid>
<Grid xs={4} elevation={0}>
 <Item style={{textAlign: "left",
  margin: "3px",width: "30rem",paddingLeft: "10px",
  fontSize:"20px",fontWeight: "bold", color:"black" }}> 
<div>
<a href={`/listings/${listing.listing_ID}`} style={{textDecoration: "none",
color: "black"}}> 
<p>Bathrooms: {listing.bathrooms}</p>
<p>Bedrooms: {listing.bedrooms}</p>
<p>Price: {listing.price}</p>
<p>City: {listing.city}</p>
<p>Description: {listing.description}</p> 
<p>State: {listing.state}</p>
<p>Street: {listing.street}</p>
<p>Zip: {listing.zip}</p>
<p style={{display:"none"}}>Listing ID: {listing.listing_ID}</p>
</a>
</div>
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

export default SearchForm;
