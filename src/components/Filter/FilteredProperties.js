import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FilterDropdown from "./FilterDropdown";
import { getFilteredProperties } from "./firebase";
import {
Typography,
Container,
Box,
Card,
CardHeader,
CardContent,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
root: {
display: "flex",
flexDirection: "column",
alignItems: "center",
marginTop: theme.spacing(4),
},
card: {
marginTop: theme.spacing(2),
maxWidth: 600,
},
}));

const PropertyListings = () => {
const classes = useStyles();
const [listings, setListings] = useState([]);

const handleFilterChange = async (minPrice, maxPrice, bedrooms, bathrooms) => {
const filteredListings = await getFilteredProperties(
minPrice,
maxPrice,
bedrooms,
bathrooms
);

setListings(filteredListings);
};

return (
<Container className={classes.root}>
<FilterDropdown onFilterChange={handleFilterChange} />
<Box mt={2}>
{listings.map((listing) => (
<Card key={listing.id} className={classes.card}>
<CardHeader title={listing.title} />
<CardContent>
<Typography variant="body1" component="p">
{listing.description}
</Typography>
<Typography variant="body2" color="textSecondary" component="p">
{listing.price}
</Typography>
<Typography variant="body2" color="textSecondary" component="p">
{listing.bedrooms} Bedrooms, {listing.bathrooms} Bathrooms
</Typography>
</CardContent>
</Card>
))}
</Box>
</Container>
);
};

export default PropertyListings;




