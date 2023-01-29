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
import { useState, useEffect, useRef } from "react";
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
import SearchForm from "../Home/SearchForm";
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

/*I tried to put the button outside the table container but it didn't work. 
So for now it will be there for now. Maybe there is way to change

*/
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
const BasicTable =({searchQuery})=>{
  
  const {bathrooms} = useParams();
  const firestore = useFirestore();
  const storage = useStorage();
  const batch = writeBatch(firestore);
  const formRef = useRef();
  const [listings, setListings] = useState([]);

  const listingsRef = collection(firestore, `listings/${Data.type}/properties`);
  
  useEffect(()=>{
    const getData = async ()=>{
     const data = await getDocs(listingsRef);
     setListings(data.docs.map((doc)=> ({...doc.data(), id: doc.id})));
     console.log(data);
    }
    getData();
 }, []);
  
  //const newDoc = doc(firestore, `$listings/${searchQuery.type}/properties/${docID}`, );
  /*
  const collectionRef = collection(
    firestore,
    `listings/${searchQuery.type}/properties/`
  );
*/
  function createData(name, info) {
    return { name, info};
  }
    
  const rows = [
    createData('Street',  ),
    createData('City', ),
    createData('State', ),
    createData('Zip', ),
    createData('Bedroom(s)', ),
    createData('Bathroom(s)', ),
    createData('Price', ),
    createData('Listed At',),
    createData('Listed By', ),
  ];
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
          <TableCell align="left" style={{display:"none"}}>{listing.listing_ID}</TableCell> 
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
      
      <ContactButton></ContactButton>
    </TableContainer>
        </div>
              ))}
    </div>
   
  )
}
export default BasicTable