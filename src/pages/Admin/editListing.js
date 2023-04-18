import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Card, CardContent, CardMedia } from "@mui/material";
import { collection, doc, updateDoc, getDoc } from "firebase/firestore"
import { useFirestore } from "reactfire";

const EditListing = ({ listingId }) => {
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
  const [listing, setListing] = useState(null)
  const firestore = useFirestore()

  useEffect(() => {
    async function fetchListing() {
      if (listingId) {
        const listingRef = doc(collection(firestore, "listings", "forSale", "properties"), listingId)
        const listingDoc = await getDoc(listingRef)
        setListing(listingDoc.data())
      }
    }
    fetchListing()
  }, [firestore, listingId])

  async function updateListing() {
    const listingRef = doc(collection(firestore, "listings", "forSale", "properties"), listingId)
    await updateDoc(listingRef, {
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
      await updateListing()
      alert("Listing successfully updated")
    } catch {
      alert("Error, listing could not be updated")
    }
  };

  if (!listing) {
    return <div>Loading...</div>
  }

  return (
    <Box sx={{ width: 750, margin: "0 auto", marginTop: "30px" }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>Edit Listing</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <TextField
            label="Zip"
            value={zip || listing.zip}
            onChange={(event) => setZip(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Street"
            value={street || listing.street}
            onChange={(event) => setStreet(event.target.value)}
            required
            fullWidth
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <TextField
            label="City"
            value={city || listing.city}
            onChange={(event) => setCity(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="State"
            value={state || listing.state}
            onChange={(event) => setState(event.target.value)}
            required
            fullWidth
            />
        </Box>
        <TextField
          label="Description"
          value={description || listing.description}
          onChange={(event) => setDescription(event.target.value)}
          multiline
          required
          fullWidth
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Button variant="contained" onClick="">Cancel</Button>
    <Button variant="contained" type="submit">Save</Button>
    </Box>
  </Box>
</Box>
);
}

export default EditListing
