import { auth, db } from "../../firebase";
import { useState, useEffect, useRef, forwardRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
/*Do not remove the carousel css */
import "bootstrap/dist/css/bootstrap.css";
import Carousel from "react-bootstrap/Carousel";
//import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase";
//import { getDownloadURL } from "firebase/storage";
//import { ref } from "firebase/storage";
import { getDownloadURL, ref as reff } from "firebase/storage";
import {
  useFirestore,
  useStorage,
  useStorageDownloadURL,
  useFirestoreCollection,
  useStorageTask,
} from "reactfire";
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
import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//import "../../pages/Listings/styles.css";
import "../../pages/Search/styles.css";
import { useParams } from "react-router-dom";

//import {StyleSheet, Text, View, Imahe, TouchableHighlight} from 'react-native';
//import firebaseConfig from '.friebaseConfig.tsx';
//import { initializeApp } from "firebase/app";
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
  created_at: "",
};

export function CarouselSearchImage() {
  const firestore = useFirestore();
  const storage = useStorage();
  const batch = writeBatch(firestore);
  const formRef = useRef();
  const [data, setData] = useState(initialValues);
  const [docID, setDocID] = useState("");
  const [listings, setListings] = useState([]);
  const { listing_ID } = useParams();
  const { city } = useParams();

  const listingsRef = collection(firestore, `listings/${data.type}/properties`);
  useEffect(() => {
    const getData = async () => {
      const data = await getDocs(listingsRef);
      setListings(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log(data);
    };
    getData();
  }, []);

  const imageRef1 = reff(
    storage,
    "gs://mnc-development.appspot.com/images/listingImages/TestBathroomImage.jpg"
  );
  const imageRef2 = reff(
    storage,
    "gs://mnc-development.appspot.com/images/listingImages/TestImage.jpg"
  );
  const imageRef3 = reff(
    storage,
    "gs://mnc-development.appspot.com/images/listingImages/TestlivingRoom.jpg"
  );
  const { status, data: url1 } = useStorageDownloadURL(imageRef1);
  const { status2, data: url2 } = useStorageDownloadURL(imageRef2);
  const { status3, data: url3 } = useStorageDownloadURL(imageRef3);
  if (status === "loading") {
    return <span>loading...</span>;
  }
  if (status2 === "loading") {
    return <span>loading...</span>;
  }
  if (status3 === "loading") {
    return <span>loading...</span>;
  }

  return (
    <div>
      {listings
        .filter((listing) => listing.city === city)
        .map((listing, index) => (
          <div className="full-card" key={index}>
            <Carousel
              style={{ width: "850px", height: "400px", margin: "auto" }}
            >
              <Carousel.Item>
                <img
                  className="CarouselImage"
                  src={listing.images1}
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>First slide label</h3>
                  <p>
                    Nulla vitae elit libero, a pharetra augue mollis interdum.
                  </p>
                  <p style={{ display: "none" }}>{listing.city}</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="CarouselImage"
                  src={listing.images2}
                  alt="Second slide"
                />

                <Carousel.Caption>
                  <h3>Second slide label</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="CarouselImage"
                  src={listing.images3}
                  alt="Third slide"
                />

                <Carousel.Caption>
                  <h3>Third slide label</h3>
                  <p>
                    Praesent commodo cursus magna, vel scelerisque nisl
                    consectetur.
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
        ))}
    </div>
  );
}

export default CarouselSearchImage;


/*Defines a React component CarouselSearchImage that renders a Bootstrap carousel displaying images of property listings
filtered by a city parameter received through React Router. The component uses Firebase for storing and retrieving data and images.

The component imports various modules and components from React, React Router, Firebase, and Material UI. 
The useEffect hook is used to fetch the property listings from Firebase Firestore and store them in the listings state variable.

The component then creates references to three images stored in Firebase Storage, retrieves their download URLs using the useStorageDownloadURL 
hook, and renders them as carousel items using the Carousel component from React Bootstrap.

The listing.images1, listing.images2, and listing.images3 properties referenced in the src attributes of the img tags correspond to the 
download URLs retrieved from Firebase Storage.

The component returns the rendered carousel wrapped in a div element.*/