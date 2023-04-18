import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Card, CardContent, CardMedia } from "@mui/material";
import { collection, doc, updateDoc, query, getDocs } from "firebase/firestore"
import { useFirestore } from "reactfire";

const EditListing = () => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [editedListing, setEditedListing] = useState(null);
  const firestore = useFirestore();
  
  async function fetchListings() {
    const listingsQuery = query(collection(firestore, "listings", "forSale", "properties"));
    const listingsSnapshot = await getDocs(listingsQuery);
    const listingsData = listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setListings(listingsData);
  }

  const handleListingChange = (event) => {
    const { value } = event.target;
    setSelectedListing(value === "none" ? null : value);
    setEditedListing(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedListing(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    try {
      await updateDoc(doc(collection(firestore, "listings", "forSale", "properties"), selectedListing), editedListing);
      fetchListings();
      alert("Listing successfully edited");
    } catch {
      alert("Error, listing could not be edited");
    }
  };

  useEffect(() => {
    fetchListings();
  },[])

  return (
    <Box sx={{ width: 750, margin: "0 auto", marginTop: "30px" }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>Delete Listing</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <label htmlFor="listings">Select a listing to delete:</label>
          <select name="listings" id="listings" value={selectedListing} onChange={handleListingChange}>
            <option value="none">Select a listing</option>
            {listings.map((listing) => (
              <option key={listing.id} value={listing.id}>
                {listing.street}, {listing.city}, {listing.state} - ${listing.price}
              </option>
            ))}
          </select>
        </Box>
        {selectedListing && (
          <Box sx={{ margin: "0 auto" }}>
            <Card sx={{ minWidth: 410, minHeight: 380, backgroundColor: "#eeeeee" }}>
              <CardMedia component="img" height="180" image={listings.find(listing => listing.id === selectedListing).images.image1} />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {listings.find(listing => listing.id === selectedListing).street}, {listings.find(listing => listing.id === selectedListing).city}, {listings.find(listing => listing.id === selectedListing).state}
                  <br />
                  <p>Price: ${listings.find(listing => listing.id === selectedListing).price}</p>
                </Typography>
                <Typography variant="h7" component="div" >
                  <p>{listings.find(listing => listing.id === selectedListing).description}</p>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <p>Bathrooms: {listings.find(listing => listing.id === selectedListing).bathrooms}</p>
                  <p>Bedrooms: {listings.find(listing => listing.id === selectedListing).bedrooms}</p>
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      <Button variant="contained" type="submit" disabled={!selectedListing} sx={{ justifySelf: "center" }}>Delete Listing</Button>
    </Box>
  </Box>
  );
}

export default DeleteListing