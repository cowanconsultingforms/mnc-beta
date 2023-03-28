import React, { useState } from "react";
import FilterDropdown from "./FilterDropdown";
import { getFilteredProperties } from "./firebase";

const PropertyListings = () => {
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
    <>
      <FilterDropdown onFilterChange={handleFilterChange} />
      <div>
        {listings.map((listing) => (
          <div key={listing.id}>
            <h2>{listing.title}</h2>
            <p>{listing.description}</p>
            <p>{listing.price}</p>
            <p>{listing.bedrooms} Bedrooms</p>
            <p>{listing.bathrooms} Bathrooms</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default PropertyListings;
