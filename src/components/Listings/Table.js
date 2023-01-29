import {
  getDocs,
  collection,
  serverTimestamp,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
documentId,
setDoc,
writeBatch,
} from "firebase/firestore";
import { useState, useEffect, useRef, useCallback } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { TableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ContactButton from "./ContactAgent";
import {
  useFirestore,
  useFirestoreCollection,
  useStorage,
  useStorageDownloadURL,
  useStorageTask,
} from "reactfire";
import SearchForm from "../Home/HomeSearchForm";
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import emailjs from "@emailjs/browser";
import { Button } from "@mui/material";

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
const BasicTable =({Data})=>{
  const {listing_ID} = useParams();
  const firestore = useFirestore();
  const storage = useStorage();
  const batch = writeBatch(firestore);
  const formRef = useRef();
  const [listings, setListings] = useState([]);

  const listingsRef = collection(firestore, `listings/${Data.type}/properties`);
  
  const getData = useCallback(async()=>{
    const data = await getDocs(listingsRef);
    setListings(data.docs.map((doc)=> ({...doc.data(), id: doc.id})));
    console.log(data);
  }, []);

  useEffect(()=>{
    getData();
  }, [getData])


  const [isHover5, setIsHover5] = useState(false);

  const handleMouseEnter5 = () => {
    setIsHover5(true);
  };

  const handleMouseLeave5 = () => {
    setIsHover5(false);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_pr7qyvs",
        "template_li0il5a",
        formRef.current,
        "7avGOyYSCkf7Kx45h"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  return(
    <div>
      {  
              listings.filter((listing) => listing.listing_ID === listing_ID)
              .map((listing, index) => (
                <div key={index}>
          <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200, minHeight: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell sx ={{fontWeight:"bold"}}>{Data.type}</TableCell>
          <TableCell align="left" ></TableCell> 
          </TableRow>
          </TableHead>
        <TableBody>
          <TableRow>
          <TableCell component="th" scope="row">
          Street
          </TableCell>
          <TableCell align="left">{listing.street}</TableCell>
          </TableRow>
          <TableRow>
          <TableCell component="th" scope="row">
          City
          </TableCell>
          <TableCell align="left">{listing.city}</TableCell>
          </TableRow>
          <TableRow>
          <TableCell component="th" scope="row">
          State
          </TableCell>
          <TableCell align="left">{listing.state}</TableCell>
          </TableRow>
          <TableRow>
          <TableCell component="th" scope="row">
          Zip
          </TableCell>
          <TableCell align="left">{listing.zip}</TableCell>
          </TableRow>
          <TableRow>
          <TableCell component="th" scope="row">
         Bedroom(s)
          </TableCell>
          <TableCell align="left">{listing.bedrooms}</TableCell>
          </TableRow>
          <TableRow>
          <TableCell component="th" scope="row">
          Bathroom(s)
          </TableCell>
          <TableCell align="left">{listing.bathrooms}</TableCell>
          </TableRow>
          <TableRow>
          <TableCell component="th" scope="row">
          Price
          </TableCell>
          <TableCell align="left">{listing.price}</TableCell>
          </TableRow>
          
          
        </TableBody>
      </Table>
      <div></div>
      <Button variant="outlined"
      onClick={handleSubmit}
      onMouseEnter={handleMouseEnter5}
      onMouseLeave={handleMouseLeave5}
      ref={formRef}
      style={{
        fontSize: "14px",
        color: isHover5 ? "black" : "white",
        backgroundColor: isHover5 ? "white" : "#63666A",
        fontWeight: "bold",
        padding: "12px",
        fontFamily: "Garamond",
        width: "100%",
        border: "2px solid white",
        borderRadius: "10px",
      }}
     >
      Contact an agent about this listing
      </Button>
    </TableContainer>
        </div>
              ))}
    </div>
   
  )
}
export default BasicTable