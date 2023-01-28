import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, PropTypes } from "@mui/material";
import CarouselImage from "../../components/Listings/Carousel";
import BasicTable from "../../components/Listings/Table";
import { onSnapshot, getDocs, doc } from "firebase/firestore";
import Footer from "../../components/Misc/Footer";
import NavBar from "../../components/Misc/NavBar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Button,
  TextField,
  ButtonGroup,
  TextareaAutosize,
  Divider,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import NestedList from "../../components/Listings/Sidenav.js";
import SearchForm from "../../components/Search/SearchForm";
import { useParams } from "react-router-dom";
import {
  collection,
  serverTimestamp,
  orderBy,
  addDoc,
  getDoc,
documentId,
setDoc,
writeBatch,
} from "firebase/firestore";
import {
  useFirestore,
  useFirestoreCollection,
  useStorage,
  useStorageDownloadURL,
  useStorageTask,
} from "reactfire";
//Actions Needed to Complete Listing Page
// 1. Get Listing Data
// 2. Get Listing Images
// 3. Display them in appropriate containers
// 4. come up with a system of navigation to cycle through images + also listings

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const initialValues = {
  type: "forSale",
  id: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  price: "",
  description: "",
  images: [],
  listed_by: "",
  bathrooms:"",
  created_at: "",
};
/*  <p style={{display:"none"}}>{listing_ID}</p> inside the topography and it causes invaild dom nesting */
export const ListingPage = ({}) => {
  const {listing_ID} = useParams();
  const firestore = useFirestore();
  const [listings, setListings] = useState([]);
  const [Data, SetData] = useState(initialValues);
  const listingsRef = collection(firestore, `listings/${Data.type}/properties`);
  
  useEffect(()=>{
    const getData = async ()=>{
     const data = await getDocs(listingsRef);
     setListings(data.docs.map((doc)=> ({...doc.data(), id: doc.id})));
     console.log(data);
    }
    getData();
 }, []);
  return (
   <div>
    {
       listings
              .filter((listing) => listing.listing_ID === listing_ID)
              .map((listing, index) => (
                <div key={ index }>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={0.1}>
        <Grid item xs={10}>
          <CarouselImage Data={Data}></CarouselImage>
          <Box
            sx={{
              margin: "10px",
              width: "1000px",
              height: "200px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>
             {listing.description}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
            <BasicTable Data={Data}></BasicTable>
        </Grid>
      </Grid>
    </Box>
                </div>
              ))}
   </div>
  );
};

export default ListingPage;
