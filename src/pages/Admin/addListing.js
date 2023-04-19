import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Card, CardContent, CardMedia } from "@mui/material";
import { collection, doc, addDoc } from "firebase/firestore"
import { useFirestore } from "reactfire";

const AddListing = () => {
  const [zip, setZip] = useState('')
  const [street, setStreet] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const firestore = useFirestore()

  async function addListing() {
    const listingsRef = collection(firestore, "listings");
    const forSaleDocRef = doc(listingsRef, "forSale");
    const propertiesRef = collection(forSaleDocRef, "properties");
    await addDoc(propertiesRef, {
      zip,
      street,
      state,
      price,
      description,
      bathrooms,
      bedrooms,
      city,
      images: {"image1":image1, "image2":image2, "image3":image3}
    });
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      await addListing()
      alert("Listing successfully created")
    } catch {
      alert("Error, listing could not be added")
    }
    
  };

  return (
    <Box sx={{ width: 750, margin: "0 auto", marginTop: "30px" }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>Add New Listing</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <TextField
            label="Zip"
            value={zip}
            onChange={(event) => setZip(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Street"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
            required
            fullWidth
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <TextField
            label="City"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="State"
            value={state}
            onChange={(event) => setState(event.target.value)}
            required
            fullWidth
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <TextField
            label="Price"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Bathrooms"
            type="number"
            value={bathrooms}
            onChange={(event) => setBathrooms(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Bedrooms"
            type="number"
            value={bedrooms}
            onChange={(event) => setBedrooms(event.target.value)}
            required
            fullWidth
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <TextField
            label="Image 1"
            value={image1}
            onChange={(event) => setImage1(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Image 2"
            value={image2}
            onChange={(event) => setImage2(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Image 3"
            value={image3}
            onChange={(event) => setImage3(event.target.value)}
            required
            fullWidth
          />
        </Box>
        <TextField
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          fullWidth
        />
        <Box sx={{margin: "0 auto"}}>
          <Card  sx={{ minWidth: 410, minHeight: 380, backgroundColor: "#eeeeee" }}>
            <CardMedia
              component="img"
              height="180"
              image={image1}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {street}, {state}
                <br/>
                <p>Price: ${price}</p>
              </Typography>
              <Typography variant="h7" component="div" >
                <p>{description}</p>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <p>Bathrooms: {bathrooms}</p>
                <p>Bedrooms: {bedrooms}</p>
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Button type="submit" variant="contained">
          Submit
        </Button>
        <br/>
      </Box>
    </Box>
  );
};

export default AddListing