import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useFirestore } from 'reactfire';
import { collection, doc, getDocs } from "firebase/firestore"
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  return (
    <div className="container">
      <h1>Properties:</h1>
      <div className="row">
        {properties.map((property) => (
          <div key={property.id} className="col-sm-6 col-md-4 col-lg-3">
            <Card sx={{ maxWidth: 345, backgroundColor: "#eeeeee" }}>
              <CardMedia
                component="img"
                height="270"
                image={property.images.image1}
                alt={property.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {property.street}, {property.state}
                  <br/>
                  Price: ${property.price}
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  <p>{property.description}</p>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <p>Bathrooms: {property.bathrooms}</p>
                  <p>Bedrooms: {property.bedrooms}</p>
                  <p>{property.city}, {property.zip}</p>
                </Typography>
              </CardContent>
              
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
