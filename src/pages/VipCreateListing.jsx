import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { doc, getDocs, updateDoc } from "firebase/firestore";
import { addNotificationToCollection } from "../components/Notification";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import Home1 from "../css/Home1.css"; // For button fixes

const createVIPListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setImages] = useState([]);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    landSize: "",
    yearBuilt: "",
    schoolRating: "",
    stories: "",
    doorMan: false,
    privateOutdoorSpace: false,
    pool: false,
    basement: false,
    elevator: false,
    garage: false,
    airConditioning: false,
    smartHome: false,
    ecoFriendly: false,
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const navigate = useNavigate();
  const auth = getAuth();

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    landSize,
    yearBuilt,
    schoolRating,
    stories,
    doorMan,
    privateOutdoorSpace,
    pool,
    basement,
    elevator,
    garage,
    airConditioning,
    smartHome,
    ecoFriendly,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const handleAddNotificationClick = (notification) => {
    return async () => {
      addNotificationToCollection(notification);
      const usersCollectionRef = collection(db, "users");
      try {
        const querySnapshot = await getDocs(usersCollectionRef);
        querySnapshot.forEach(async (userDoc) => {
          const userData = userDoc.data();
          if (userData.clear !== undefined) {
            const userRef = doc(db, "users", userDoc.id);
            await updateDoc(userRef, { clear: false });
          } else {
            const userRef = doc(db, "users", userDoc.id);
            await updateDoc(userRef, { clear: false });
          }
        });
      } catch (error) {
        console.error("Error updating clear field:", error);
      }
    };
  };

  // Update all form data
  const onChange = (e) => {
    if (e.target.type === "checkbox") {
      // Handle checkboxes separately
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.checked, // Set the boolean value based on whether the checkbox is checked
      }));
    } else {
      let bool = null;
      if (e.target.value === "true") {
        bool = true;
      }
      if (e.target.value === "false") {
        bool = false;
      }

      // File (image) input
      if (e.target.files) {
        const selectedImages = Array.from(e.target.files);
        setImages(selectedImages);

        setFormData((prevState) => ({
          ...prevState,
          images: e.target.files,
        }));
      }

      // Text / Boolean / Number input
      if (!e.target.files) {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: bool ?? e.target.value, // If bool is null, updates field with value, otherwise updates field with bool value
        }));
      }
    }
    // console.log(formData);
  };

  // Submits form data to firebase
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Checks that discounted price is lower than regular price (if applicable)
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than the regular price.");
      return;
    }

    // Checks that no more than 6 images are uploaded
    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum of 6 images are allowed.");
      return;
    }

    if (selectedImages.length > 6) {
      setLoading(false);
      toast.error("Maximum of 6 images are allowed.");
      return;
    }

    // Converts address to coordinates if geolocationEnabled is true
    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
          import.meta.env.VITE_API_KEY
        }`
      );
      const data = await response.json();

      // Gets longitude and latitude from google maps api call
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;

      if (location === undefined) {
        setLoading(false);
        toast.error("Please enter a correct address.");
        return;
      }
    } else {
      // Otherwise use manually inputted form data for the latitude and longitude fields
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    // Uploads image to firestore database
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `images/${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            // eslint-disable-next-line default-case
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
              // Returns img object with filepath and url fields
              resolve({
                path: filename,
                url: downloadUrl,
              });
            });
          }
        );
      });
    };

    // Passes all images to storeImage function, displays error message if image upload fails
    const imgs = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded.");
      console.log(error);
      return;
    });

    // Copy of form data with additional fields for image urls, geolocation, and timestamp
    const formDataCopy = {
      ...formData,
      imgs,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    delete formDataCopy.images;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    // Adds form data to firestore database
    const docRef = await addDoc(
      collection(db, "vipPropertyListings"),
      formDataCopy
    );
    setLoading(false);
    toast.success("Listing created!");
    navigate(`/vip/category/${formDataCopy.type}/${docRef.id}`);
  };

  // Displays loading screen while listing is created
  if (loading) {
    return <Spinner />;
  }

  const cancelUpdate = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <main className="max-w-md px-2 mx-auto">
      <div className="flex flex-col">
        <h1 className="text-3xl text-center py-4 font-bold">
          Create a VIP Listing
        </h1>
      </div>

      <form onSubmit={onSubmit}>
        {/* Select buy/rent buttons */}
        <p className="text-lg mt-6 font-semibold">Buy / Rent / Sold</p>
        <div className="flex disable-hover">
        <button
            type="button"
            id="type"
            value="buy"
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded shadow-md transition duration-150 ease-in-out w-full 
              ${
                type === "rent" || type === "sold"
                  ? "bg-white text-gray-800 hover:bg-white hover:text-gray-700 active:bg-gray-200"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white active:bg-gray-700"
              }`}  
          >
            Buy
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded shadow-md transition duration-150 ease-in-out w-full 
              ${
                type === "buy" || type === "sold"
                  ? "bg-white text-gray-800 hover:bg-white hover:text-gray-700 active:bg-gray-200"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white active:bg-gray-700"
              }`}
          >
            Rent
          </button>
          <button
            type="button"
            id="type"
            value="sold"
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded shadow-md transition duration-150 ease-in-out w-full 
              ${
                type === "rent" || type === "buy"
                  ? "bg-white text-gray-800 hover:bg-white hover:text-gray-700 active:bg-gray-200"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white active:bg-gray-700"
              }`}
          >
            Sold
          </button>
        </div>
        {/* Name input field */}
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Property Name"
          maxLength="32"
          minLength="3"
          required
          className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
        />
        {/* Bedrooms and bathrooms input field */}
        <div className="flex space-x-6 mb-6">
          {/* Number of bedrooms */}
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 text-center"
            />
          </div>

          {/* Number of bathrooms */}
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 text-center"
            />
          </div>
        </div>
        {/* Parking availability buttons */}
        <p className="text-lg mt-6 font-semibold">Parking Spot</p>
        <div className="flex disable-hover">
        <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded shadow-md transition duration-150 ease-in-out w-full 
              ${
                !parking
                  ? "bg-white text-gray-800 hover:bg-white hover:text-gray-700 active:bg-gray-200"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white active:bg-gray-700"
              }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded shadow-md transition duration-150 ease-in-out w-full 
              ${
                parking
                  ? "bg-white text-gray-800 hover:bg-white hover:text-gray-700 active:bg-gray-200"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white active:bg-gray-700"
              }`}
          >
            No
          </button>
        </div>
        {/* Furnished buttons */}
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex disable-hover">
        <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded shadow-md transition duration-150 ease-in-out w-full 
              ${
                !furnished
                  ? "bg-white text-gray-800 hover:bg-white hover:text-gray-700 active:bg-gray-200"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white active:bg-gray-700"
              }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded shadow-md transition duration-150 ease-in-out w-full 
              ${
                furnished
                  ? "bg-white text-gray-800 hover:bg-white hover:text-gray-700 active:bg-gray-200"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white active:bg-gray-700"
              }`}
          >
            No
          </button>
        </div>
        {/* Address input field */}
        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
        />
        {/* Latitude and Longitude input field */}
        {!geolocationEnabled && (
          <div className="flex space-x-6 mb-6">
            <div>
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 text-center"
              />
            </div>
            <div>
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 text-center"
              />
            </div>
          </div>
        )}
        {/* Description input field */}
        <p className="text-lg font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
        />
        {/* Add discount buttons */}
        <p className="text-lg font-semibold">Add Discount?</p>
        <div className="flex mb-6 disable-hover">
        <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded shadow-md transition duration-150 ease-in-out w-full 
              ${
                !offer
                  ? "bg-white text-gray-800 hover:bg-white hover:text-gray-700 active:bg-gray-200"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white active:bg-gray-700"
              }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase rounded shadow-md transition duration-150 ease-in-out w-full 
              ${
                offer
                  ? "bg-white text-gray-800 hover:bg-white hover:text-gray-700 active:bg-gray-200"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white active:bg-gray-700"
              }`}
          >
            No
          </button>
        </div>
        {/* Regular Price input field */}
        <div className="flex items-center mb-6">
          <div>
            <p className="text-lg font-semibold">Listing Price</p>
            <div className="flex w-full justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="0"
                max="400000000"
                required
                className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 text-center"
              />

              {/* Shows $ / Month when rent option is selected */}
              {type === "rent" && (
                <div>
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ paddingBottom: "20px" }}>
          <div sytle={{ marginBottom: "100px" }}>
            <p className="text-lg font-semibold">Land Size</p>
            <input
              style={{ width: "100px", height: "35px" }}
              type="number"
              id="landSize"
              value={landSize}
              onChange={onChange}
              min="1"
              required
              className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 text-center"
            />{" "}
            <span> Square Feet</span>
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "100px", height: "35px" }}>
              <p className="text-lg font-semibold">Year Built</p>
              <input
                style={{ width: "100px", height: "35px" }}
                type="number"
                id="yearBuilt"
                value={yearBuilt}
                onChange={onChange}
                min="1900"
                required
                className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 text-center"
              />
            </div>
            <div style={{ width: "100px", height: "35px", margin: "0 40px" }}>
              <p style={{ width: "200px" }} className="text-lg font-semibold">
                School Rating
              </p>
              <input
                style={{ width: "100px", height: "35px" }}
                type="number"
                id="schoolRating"
                value={schoolRating}
                onChange={onChange}
                min="1"
                max="10"
                required
                className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 text-center"
              />
            </div>
            <div style={{ width: "100px", height: "40px", margin: "0 30px" }}>
              <p className="text-lg font-semibold">Stories</p>
              <input
                style={{ width: "100px", height: "35px" }}
                type="number"
                id="stories"
                value={stories}
                onChange={onChange}
                min="1"
                required
                className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 text-center"
              />
            </div>
          </div>
          <div
  style={{
    marginTop: "50px",
    display: "flex",
    flexDirection: "row", // Keeps items on the same row
    justifyContent: "flex-start", // Aligns items to the left
    flexWrap: "wrap", // Wrap items to the next line when necessary
    gap: "15px", // Slightly increased gap to make items more readable
  }}
>
  {/* Outdoor Space */}
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <p className="text-lg font-semibold">
      Outdoor Space &nbsp;
      <input
        type="checkbox"
        id="privateOutdoorSpace"
        checked={privateOutdoorSpace}
        onChange={onChange}
      />
    </p>
  </div>

  {/* Basement */}
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <p className="text-lg font-semibold">
      Basement &nbsp;
      <input
        type="checkbox"
        id="basement"
        checked={basement}
        onChange={onChange}
      />
    </p>
  </div>

  {/* Doorman */}
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <p className="text-lg font-semibold">
      Doorman &nbsp;
      <input
        type="checkbox"
        id="doorMan"
        checked={doorMan}
        onChange={onChange}
      />
    </p>
  </div>
</div>

<div
  style={{
    marginTop: "30px", // Increased marginTop to separate the groups
    display: "flex",
    flexDirection: "row", // Keeps items on the same row
    justifyContent: "flex-start", // Aligns items to the left
    flexWrap: "wrap", // Wrap items to the next line when necessary
    gap: "15px", // Slightly increased gap to make items more readable
  }}
>
  {/* Pool */}
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <p className="text-lg font-semibold">
      Pool &nbsp;
      <input
        type="checkbox"
        id="pool"
        checked={pool}
        onChange={onChange}
      />
    </p>
  </div>

  {/* Elevator */}
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <p className="text-lg font-semibold">
      Elevator &nbsp;
      <input
        type="checkbox"
        id="elevator"
        checked={elevator}
        onChange={onChange}
      />
    </p>
  </div>

  {/* Garage */}
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <p className="text-lg font-semibold">
      Garage &nbsp;
      <input
        type="checkbox"
        id="garage"
        checked={garage}
        onChange={onChange}
      />
    </p>
  </div>

  {/* Air Conditioning */}
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <p className="text-lg font-semibold">
      Air Conditioning &nbsp;
      <input
        type="checkbox"
        id="airConditioning"
        checked={airConditioning}
        onChange={onChange}
      />
    </p>
  </div>

  {/* Smart Technology */}
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <p className="text-lg font-semibold">
      Smart Technology &nbsp;
      <input
        type="checkbox"
        id="smartHome"
        checked={smartHome}
        onChange={onChange}
      />
    </p>
  </div>

  {/* Eco-Friendly/Green Technology */}
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <p className="text-lg font-semibold">
      Eco-Friendly/Green Technology &nbsp;
      <input
        type="checkbox"
        id="ecoFriendly"
        checked={ecoFriendly}
        onChange={onChange}
      />
    </p>
  </div>
</div>

        </div>{" "}
        &nbsp;
        {/* Discounted Price input field, only displays when offer field has 'yes' selection */}
        {offer && (
          <div className="flex items-center mb-6">
            <div>
              <p className="text-lg font-semibold">Discounted Price</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="0"
                  max="400000000"
                  required={offer}
                  className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 text-center"
                />

                {/* Shows $ / Month when rent option is selected */}
                {type === "rent" && (
                  <div>
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Submit images field */}
        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600">
            The first image will be the cover (max 6).
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300"
          />
        </div>
        {Array.isArray(selectedImages) && selectedImages.length > 0 && (
          <div>
            {selectedImages.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Uploaded Image ${index}`}
                style={{
                  filter: "grayscale(100%)",
                  marginBottom: "20px",
                }}
              />
            ))}
          </div>
        )}
        <button
          onClick={cancelUpdate}
          className="mb-2 w-full bg-gray-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-semibold hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
        >
          Cancel
        </button>
        {/* Submit form data button */}
        <button
          onClick={handleAddNotificationClick(`Vip ${name} is added!`)}
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-gray-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-600 focus:shadow-lg active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Create VIP Listing
        </button>
      </form>
    </main>
  );
};

export default createVIPListing;
