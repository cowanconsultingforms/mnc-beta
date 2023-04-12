import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useFirestore } from 'reactfire';
import { collection, doc, getDocs } from "firebase/firestore"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import "./testing.css"

async function getProperties(firestore) {

  const listingsRef = collection(firestore, "listings")
  const forSaleDocRef = doc(listingsRef, "forSale");
  const propertiesRef = collection(forSaleDocRef, "properties");
  const querySnapshot = await getDocs(propertiesRef);

  const properties = [];
  querySnapshot.forEach((doc) => {
    properties.push({ id: doc.id, ...doc.data() });
  });
  return properties
}

export const Testing = () => {

  const [properties, setProperties] = useState([]);
  const firestore = useFirestore();

  useEffect(() => {
    async function fetchData() {
      const data = await getProperties(firestore);
      setProperties(data);
    }
    fetchData();
  }, [firestore]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    centerPadding: "45px",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };
  

  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <div
        className={className}
        style={{ display: "block", color: "black" }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <div
        className={className}
        style={{ display: "block", color: "black" }}
        onClick={onClick}
      />
    );
  }

  return (
    <div className="container">
      <Typography variant="h4" align="center" sx={{ fontWeight: 'normal', color: '#4d4d4d' }}>
      Recommended Properties
      </Typography>
      <br/>
      <Slider {...settings}>
        {properties.map((property) => (
          <div key={property.id}>
            <Card  sx={{ maxWidth: 400, maxHeight: 380, backgroundColor: "#eeeeee" }}>
              <CardMedia
                component="img"
                height="180"
                image={property.images.image1}
                alt={property.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {property.street}, {property.state}
                  <br/>
                  <p>Price: ${property.price}</p>
                </Typography>
                <Typography variant="h7" component="div" >
                  <p>{property.description}</p>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <p>Bathrooms: {property.bathrooms}</p>
                  <p>Bedrooms: {property.bedrooms}</p>
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
};