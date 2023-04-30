import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useFirestore } from 'reactfire';
import { collection, doc, getDocs } from "firebase/firestore"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

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
    centerMode: true,
    centerPadding: "-5px",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "#000000" }}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "#000000" }}
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
          <div>
            <Card  sx={{ maxWidth: 410, maxHeight: 380, backgroundColor: "#eeeeee" }}>
              <CardMedia
                component="img"
                height="180"
                image={property.images.image1 || property.images[0]}
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

/*
This is a React component that displays recommended properties in a slider.

It imports various dependencies, including React, Bootstrap, reactfire, and slick-carousel 
and defines two arrow functions for rendering the slider arrows.

The component uses the useEffect hook to fetch the recommended properties from Firestore database 
via getProperties function and update the state with useState hook.

It then defines settings for the slider and maps over the properties array to render each property as a 
Card component in the slider. The Card component displays information about the property, including its image,
 address, price, description, and number of bedrooms and bathrooms.
*/