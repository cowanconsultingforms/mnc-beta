import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../../firebase";
import { Carousel } from "react-bootstrap";
import ReactBootstrapCarousel from "react-bootstrap-carousel";
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-carousel/dist/react-bootstrap-carousel.css";
import { useAuth } from "reactfire";
import * as ReactDOM from "react-dom";
import BasicTable from "./Table";

import {
  query,
  getDocs,
  where,
  collection,
  orderBy,} from "firebase/firestore";
import {useCollectionData} from "react-firebase-hooks/firestore";
import { Container,Header,Content,Footer,} from "rsuite";

// primary container for Listing Page data

const initialListingData = {
  type:['forSale','forRent','sold'],
  street:'',
  city:'',
  state:'',
  zip:'',
  bedrooms:'',
  bathrooms:'',
  description:'',
  listed_at:'',
  listed_by:'',
  images:[],
  price:0,
  id:'',

}
export const ListingPage = () => {
  const [user, loading, error] = useAuth(auth);
  const formRef = useRef();
  const [type, setType] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [price, setPrice] = useState("");
  const [listed_at, setListedAt] = useState("");
  const [listed_by, setListedBy] = useState("");
  const [images, setImages] = useState("");
  const [description, setDescription] = useState("");
  const [id, setID] = useState("");
  const [listings] = useCollectionData(db, collection("listings"));
  const listingRef = collection(db, "listings", where(type, "==", type));
  const placeholder = useRef();
  const q = query(listingRef, orderBy("listed_at", "desc"));
  const [listing] = useCollectionData(q, { idField: "listed_at" });

  //function to getNextListing
  const getNextListing = async (e) => {
    e.preventDefault();

  //retrieves data from the Firestore using 'getdocs'
    const listings = await getDocs(listingRef).then((docs) => {
      return docs.map((doc) => {
        return (listings = {
          id: doc.id,
          ...doc.data(),
        });
      });
    });
  };

 //function to getPrevListing
  const getPrevListing = async (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    return () => {};
  }, [listings]);

  return (
    <div
      style={{
        display: "block",
        width: 500,
        paddingLeft: 30,
      }}
    >
      <Container>
        <Header style={{ color: "#808080", fontSize: "20px" }}>
          MCN Development Listings
        </Header>
        <Content>
          <Carousel>
            <Carousel.Item>
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>
                  Nulla vitae elit libero, a pharetra augue mollis interdum.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>
                  Praesent commodo cursus magna, vel scelerisque nisl
                  consectetur.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>

          <BasicTable></BasicTable>
        </Content>
        <Footer></Footer>
      </Container>
    </div>
  );
};

export default ListingPage;

/*This is a React functional component that displays a listings page for real estate listings. 
It fetches data from a Firebase Firestore database and displays it in a React-Bootstrap Carousel 
and a table. The component uses several React hooks such as useEffect, useState, and useRef, as 
well as data retrieval functions provided by the reactfire library. The listing page includes 
information such as type of listing, address, number of bedrooms and bathrooms, description, listed by,
 images, price, and ID.*/