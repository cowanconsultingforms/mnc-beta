import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addNotificationToCollection } from "../components/Notification";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const VipEditListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
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
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
  } = formData;

  const params = useParams();

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
  
  // Checks that listing belongs to the user that is editing it
  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      // Get user info from firestore database
      const userRef = collection(db, "users");
      const userQuery = query(
        userRef,
        where(documentId(), "==", auth.currentUser.uid)
      );
      const user = [];
      const userSnap = await getDocs(userQuery);
      userSnap.forEach((doc) => {
        return user.push(doc.data());
      });

      // Gives user access to listings if they have the correct role
      if (!["agent", "admin", "superadmin"].includes(user[0]?.role)) {
        toast.error("You cannot edit this listing.");
        navigate("/");
      }
    };

    fetchUser();
    setLoading(false);
  }, [auth.currentUser.uid, navigate]);

  // Fetches listing data and adds it to the form
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      const docRef = doc(db, "vipPropertyListings", params.listingId); // Gets listingId from the id in the page link
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist.");
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  // Update all form data
  const onChange = (e) => {
    let bool = null;
    if (e.target.value === "true") {
      bool = true;
    }
    if (e.target.value === "false") {
      bool = false;
    }

    // Text / Boolean / Number input
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: bool ?? e.target.value, // If bool is null, updates field with value, otherwise updates field with bool value
    }));
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

    // Copy of form data with additional fields for geolocation, and timestamp
    const formDataCopy = {
      ...formData,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    // Adds form data to firestore database
    const docRef = doc(db, "vipPropertyListings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Listing edited!");
    navigate(`/vip/category/${formDataCopy.type}/${docRef.id}`);
  };

  // Displays loading screen while listing is updated
  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Edit Listing</h1>
      <form onSubmit={onSubmit}>
        {/* Select buy/rent buttons */}
        <p className="text-lg mt-6 font-semibold">Buy / Rent</p>
        <div className="flex disable-hover">
          <button
            type="button"
            id="type"
            value="buy"
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
            ${
              type === "rent" || type === "sold"
                ? "bg-white text-black"
                : "bg-gray-500 text-white"
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`ml-3 mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
            ${
              type === "buy" || type === "sold"
                ? "bg-white text-black"
                : "bg-gray-500 text-white"
            }`}
          >
            Rent
          </button>
          <button
            type="button"
            id="type"
            value="sold"
            onClick={onChange}
            className={`ml-3 mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
            ${
              type === "rent" || type === "buy"
                ? "bg-white text-black"
                : "bg-gray-500 text-white"
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
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
            ${!parking ? "bg-white text-black" : "bg-gray-500 text-white"}`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
            ${parking ? "bg-white text-black" : "bg-gray-500 text-white"}`}
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
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
            ${!furnished ? "bg-white text-black" : "bg-gray-500 text-white"}`}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
            ${furnished ? "bg-white text-black" : "bg-gray-500 text-white"}`}
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
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
            ${!offer ? "bg-white text-black" : "bg-gray-500 text-white"}`}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
            ${offer ? "bg-white text-black" : "bg-gray-500 text-white"}`}
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

        {/* Submit form data button */}
        <button
        onClick={handleAddNotificationClick(`Vip ${name} is updated!`)}
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-gray-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-600 focus:shadow-lg active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Edit Listing
        </button>
      </form>
    </main>
  );
};

export default VipEditListing;
