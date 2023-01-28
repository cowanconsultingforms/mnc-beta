import { IconButton, Grid, Button, Stack } from "@mui/material";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import CloseIcon from "@mui/icons-material/Close";
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
import { useNavigate, createSearchParams } from "react-router-dom";
import "../../pages/Home/styles.css";
import "../../pages/Listings/styles.css";
import "../../pages/Search/styles.css";
import { UseButtonGroup } from "./SearchPageComponents";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

//import FilterBox from "./Filter";
import App from "../../App";
import { async } from "@firebase/util";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
//import ListingPage from "../../pages/Listings";
import CarouselSearchImage from "./SearchCarousel";
import {
  CustomInput,
  grey,
  blue,
  StyledInputElement,
} from "./SearchPageComponents";

const initialValues = {
  type: "",
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

export const SearchForm = () => {
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
  const [info, setInfo] = useState(initialValues);
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const { city } = useParams();
  const goListings = () =>
    navigate({
      pathname: `/listings/properties/${searchQuery.bathrooms}`,
    });

  const firestore = useFirestore();

  const listingsRef = collection(firestore, `listings/${info.type}/properties`);
  const [searchQuery, setSearchQuery] = useState([]);

  const handleType = (e) => {
    setInfo({ ...info, type: e.target.value });
  };

  useEffect(() => {
    const getData = async () => {
      const data = await getDocs(listingsRef);
      setListings(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log(data);
    };
    getData();
  }, []);

  const handleFilter = (e) => {
    const searchWord = e.target.value;
    const searchFilter = listings.filter((listing) => {
      return (
        listing.bathrooms.includes(searchWord) ||
        listing.bedrooms.includes(searchWord) ||
        listing.street.toLowerCase().includes(searchWord) ||
        listing.street.toUpperCase().includes(searchWord) ||
        listing.zip.includes(searchWord) ||
        listing.price.includes(searchWord) ||
        listing.description.toLowerCase().includes(searchWord) ||
        listing.description.toUpperCase().includes(searchWord) ||
        listing.city.toLowerCase().includes(searchWord) ||
        listing.city.toUpperCase().includes(searchWord) ||
        listing.state.toLowerCase().includes(searchWord) ||
        listing.state.toUpperCase().includes(searchWord)
      );
    });
    if (searchWord === "") {
      setSearchQuery([]);
    } else {
      setSearchQuery(searchFilter);
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
      }}
    >
      <Grid2 sm={12}>
        <AppBar
          position="static"
          sx={{
            color: "white",
            backgroundColor: "rgb(196, 196, 196)",
            boxShadow: "0px 5px 10px 2px #888888",
            textDecoration: "none",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "20px",
          }}
        >
          <Toolbar>
            <CustomInput onChange={handleFilter}></CustomInput>

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
            <FormControl
              required
              sx={{
                m: 1,
                minWidth: 120,
                backgroundColor: "white",
                color: "black",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <InputLabel id="demo-simple-select-required-label">
                Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                value={info.type}
                onChange={(e) => setInfo({ ...info, type: e.target.value })}
                sx={{
                  color: "black",
                  fontFamily: "Garamond",
                  width: "100%",
                  fontSize: "20px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                variant="filled"
              >
                <MenuItem value={"forSale"}>Buy</MenuItem>
                <MenuItem value={"sold"}>Sold</MenuItem>
                <MenuItem value={"rentals"}>Rent</MenuItem>
              </Select>
            </FormControl>
          </Toolbar>
        </AppBar>
        <Item elevation={0} sx={{ flexDirection: "row", display: "flex" }}>
          <>
            {searchQuery.length !== 0 && (
              <div>
                {searchQuery
                  .slice(0, 15)
                  .filter((listing) => listing.city === city)
                  .map((listing, index) => {
                    return (
                      <div key={index} elevation={0}>
                        <Grid container spacing={1} elevation={0}>
                          <Grid xs={8} elevation={0}>
                            <Item sx={{}}>
                              <div>
                                <CarouselSearchImage></CarouselSearchImage>
                              </div>
                            </Item>
                          </Grid>
                          <Grid xs={4} elevation={0}>
                            <Item
                              sx={{
                                textAlign: "left",
                                margin: "3px",
                                width: "30rem",
                                paddingLeft: "10px",
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: "black",
                              }}
                            >
                              <div>
                                <a href={`/listings/${listing.listing_ID}`}>
                                  <p>Bathrooms: {listing.bathrooms}</p>
                                  <p>Bedrooms: {listing.bedrooms}</p>
                                  <p>Price: {listing.price}</p>
                                  <p>City: {listing.city}</p>
                                  <p>Description: {listing.description}</p>
                                  <p>State: {listing.state}</p>
                                  <p>Street: {listing.street}</p>
                                  <p>Zip: {listing.zip}</p>
                                  <p style={{ display: "none" }}>
                                    Listing ID: {listing.listing_ID}
                                  </p>
                                </a>
                              </div>
                            </Item>
                          </Grid>
                        </Grid>
                      </div>
                    );
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
