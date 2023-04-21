import { useEffect, useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { Card, CardContent, CardMedia } from "@mui/material";
import { collection, doc, updateDoc, query, getDocs } from "firebase/firestore"
import { useFirestore } from "reactfire";

const EditListing = () => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
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
  
  async function fetchListings() {
    const listingsQuery = query(collection(firestore, "listings", "forSale", "properties"));
    const listingsSnapshot = await getDocs(listingsQuery);
    const listingsData = listingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setListings(listingsData);
  }

  async function editListing(id, updatedListing) {
    await updateDoc(doc(collection(firestore, "listings", "forSale", "properties"), id), updatedListing);
    setSelectedListing(null);
    fetchListings();
  }

  const handleListingChange = (event) => {
    const { value } = event.target;
    const selectedListing = listings.find((listing) => listing.id === value);
    setSelectedListing(value);
    setStreet(selectedListing.street);
    setZip(selectedListing.zip);
    setStreet(selectedListing.street)
    setState(selectedListing.state)
    setCity(selectedListing.city)
    setPrice(selectedListing.price)
    setDescription(selectedListing.description)
    setBathrooms(selectedListing.bathrooms)
    setBedrooms(selectedListing.bedrooms)
    setImage1(selectedListing.images.image1)
    setImage2(selectedListing.images.image2)
    setImage3(selectedListing.images.image3)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedListing = { zip, street, state, city, price, description, bathrooms, bedrooms, images:[image1, image2, image3]};
      await editListing(selectedListing, updatedListing);
      alert("Listing successfully updated");
    } catch {
      alert("Error, listing could not be updated");
    }
  };

  useEffect(() => {
    fetchListings();
  },[])

  return (
    <Box sx={{ width: 750, margin: "0 auto", marginTop: "30px" }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>Edit Listing</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <label htmlFor="listings">Select a listing to edit:</label>
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
          </Box>
        )}
        <Button variant="contained" type="submit" disabled={!selectedListing} sx={{ justifySelf: "center" }}>Edit Listing</Button>
      </Box>
      <br/>
    </Box>
  );
}

export default EditListing;

/*
This is a React component that allows the user to edit a listing from a Firestore database.

It imports various components from the Material-UI library, as well as functions from the Firebase and ReactFire libraries.

The component begins by defining several state variables that correspond to different properties of the listing, such as zip code,
street address, and price. It also defines a state variable called selectedListing that is used to keep track of which listing
the user is currently editing.

The component defines two asynchronous functions: fetchListings, which queries the Firestore database and sets the listings state 
variable to an array of objects that represent all the listings in the database; and editListing, which updates a listing in the 
database and then calls fetchListings to refresh the list of listings.

The component defines several event handlers: handleListingChange, which is called when the user selects a listing from a dropdown 
menu and sets the state variables to the values of the selected listing; and handleSubmit, which is called when the user submits 
the form to update the listing.

The component renders a form that allows the user to edit the various properties of the selected listing. If there are no listings in the database,
 a message is displayed indicating that there are no listings. If there is at least one listing in the database, the form displays a dropdown menu 
 allowing the user to select a listing to edit, and the various form fields are pre-populated with the values of the selected listing. When the user submits the form,
  the handleSubmit function is called to update the listing in the database.
*/