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
import { UseButtonGroup } from "./HomePageComponents";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom'

//import FilterBox from "./Filter";
//import FormControlLabelPlacement from "./FilterRadioButtons";
import FilterRadioButtons  from "../../components/Home/FilterRadioButtons";
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


  //const [data, setData] = useState("");
  //const[info, setInfo] = useState(initialValues);
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
      //pathname: `/listings/${searchQuery.bathrooms}`
      pathname:'/listings'
    });
/*
  const [listings, setListings] = useState([
    {
    bathrooms:"",
    bedrooms:"",
    street:"", 
    city:"", 
    state:"", 
    zip:"", 
    price:"",
    description:"",
    images:[],
    listed_by:"",
    created_at:""
  }
  ]);
 
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
      const q = await getDocs(listingsRef,where()).then((onSnapshot)=>{
        onSnapshot.docs.entries();
        setListings(data.docs.map((doc)=> ({...doc.data(), id: doc.id})));
        console.log(data);
        })
      
    };
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

  const getInfo = async() =>{
      await getDocs(listingsRef, {bathrooms: searchQuery})
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    e.preventDefault();

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
       <UseButtonGroup
        aria-label="listing-type"
        onChange={(e) => setInfo({ ...info, type: e.target.value })}
        name="type"
        />
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
 <div>
  {searchQuery.slice(0,15).map((listing, index)=>{
    return(
      <div className = "box" key = {index}>
      <p>Bathrooms: {listing.bathrooms}</p>
      <p>Bedrooms: {listing.bedrooms}</p>
      <p>Price: {listing.price}</p>
      <p>City: {listing.city}</p>
     <p>Description: {listing.description}</p> 
     <p>State: {listing.state}</p>
     <p>Street: {listing.street}</p>
     <p>Zip: {listing.zip}</p>
    
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

export default SearchForm;






