import React, { useState } from "react";
import {
    useFirestore,
    useStorage,
    useStorageDownloadURL,
    useFirestoreCollection,
    useStorageTask,
  } from "reactfire";
  import {
    getDocs,
    collection,
    serverTimestamp,
    orderBy,
    onSnapshot,
    addDoc,
    doc,
    getDoc,
    documentId,
    setDoc,
    writeBatch,
  } from "firebase/firestore";
import "firebase/firestore";
import "./FilterDropdown.css";

const FilterDropdown = ({ options, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [bedrooms, setBedrooms] = useState("Any");
  const [bathrooms, setBathrooms] = useState("Any");

  const handleFilterChange = () => {
    setIsOpen(!isOpen);
    onFilterChange({ minPrice, maxPrice, bedrooms, bathrooms });
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(parseInt(event.target.value));
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(parseInt(event.target.value));
  };

  const handleBedroomsChange = (event) => {
    setBedrooms(event.target.value);
  };

  const handleBathroomsChange = (event) => {
    setBathrooms(event.target.value);
  };

  return (
    <div className="FilterDropdown">
      <button className="FilterButton" onClick={() => setIsOpen(!isOpen)}>
        Filter
      </button>
      {isOpen && (
        <div className="FilterDropdown-content">
          <div className="FilterSection">
            <label htmlFor="minPrice">Minimum Price:</label>
            <input
              type="range"
              id="minPrice"
              name="minPrice"
              min="0"
              max="1000000"
              step="10000"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
            <span>${minPrice.toLocaleString()}</span>
          </div>
          <div className="FilterSection">
            <label htmlFor="maxPrice">Maximum Price:</label>
            <input
              type="range"
              id="maxPrice"
              name="maxPrice"
              min="0"
              max="1000000"
              step="10000"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
            <span>${maxPrice.toLocaleString()}</span>
          </div>
          <div className="FilterSection">
            <label htmlFor="bedrooms">Bedrooms:</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="bedrooms"
                  value="Any"
                  checked={bedrooms === "Any"}
                  onChange={handleBedroomsChange}
                />
                Any
              </label>
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num}>
                  <input
                    type="radio"
                    name="bedrooms"
                    value={num}
                    checked={bedrooms === num.toString()}
                    onChange={handleBedroomsChange}
                  />
                  {num}
                </label>
              ))}
            </div>
          </div>
          <div className="FilterSection">
            <label htmlFor="bathrooms">Bathrooms:</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="bathrooms"
                  value="Any"
                  checked={bathrooms === "Any"}
                  onChange={handleBathroomsChange}
                />
                Any
              </label>
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num}>
                  <input
type="radio"
name="bathrooms"
value={num}
checked={bathrooms === num.toString()}
onChange={handleBathroomsChange}
/>
{num}
</label>
))}
</div>
</div>
<button className="ApplyButton" onClick={handleFilterChange}>
Apply Filters
</button>
</div>
)}
</div>
);
};

export default FilterDropdown;


const db = firebase.firestore();

const getFilteredProperties = async (minPrice, maxPrice, bedrooms, bathrooms) => {
  try {
    let query = db.collection("properties");

    if (minPrice !== 0) {
      query = query.where("price", ">=", minPrice);
    }

    if (maxPrice !== 10000000) {
      query = query.where("price", "<=", maxPrice);
    }

    if (bedrooms !== "0") {
      query = query.where("bedrooms", "==", parseInt(bedrooms));
    }

    if (bathrooms !== "0") {
      query = query.where("bathrooms", "==", parseInt(bathrooms));
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching properties: ", error);
  }
};





