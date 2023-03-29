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
  setDoc,
  writeBatch,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import "firebase/firestore";
import "firebase/storage";
import "./FilterDropdown.css";

/* // Firebase configuration
const firebaseConfig = {
  // Your config values here
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage(); */

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
              <label>
                <input
                  type="radio"
                  name="bedrooms"
                  value="1"
                  checked={bedrooms === "1"}
                  onChange={
handleBedroomsChange
}
/>
1
</label>
<label>
<input
type="radio"
name="bedrooms"
value="2"
checked={bedrooms === "2"}
onChange={handleBedroomsChange}
/>
2
</label>
<label>
<input
type="radio"
name="bedrooms"
value="3"
checked={bedrooms === "3"}
onChange={handleBedroomsChange}
/>
3
</label>
<label>
<input
type="radio"
name="bedrooms"
value="4"
checked={bedrooms === "4"}
onChange={handleBedroomsChange}
/>
4
</label>
<label>
<input
type="radio"
name="bedrooms"
value="5"
checked={bedrooms === "5"}
onChange={handleBedroomsChange}
/>
5+
</label>
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
<label>
<input
type="radio"
name="bathrooms"
value="1"
checked={bathrooms === "1"}
onChange={handleBathroomsChange}
/>
1
</label>
<label>
<input
type="radio"
name="bathrooms"
value="2"
checked={bathrooms === "2"}
onChange={handleBathroomsChange}
/>
2
</label>
<label>
<input
type="radio"
name="bathrooms"
value="3"
checked={bathrooms === "3"}
onChange={handleBathroomsChange}
/>
3
</label>
<label>
<input
type="radio"
name="bathrooms"
value="4"
checked={bathrooms === "4"}
onChange={handleBathroomsChange}
/>
4
</label>
<label>
<input
type="radio"
name="bathrooms"
value="5"
checked={bathrooms === "5"}
onChange={handleBathroomsChange}
/>
5+
</label>
</div>
</div>
</div>
)}
</div>
);
};

export default FilterDropdown;