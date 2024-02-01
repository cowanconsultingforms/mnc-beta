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
  deleteDoc,
  orderBy,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addNotificationToCollection } from "../components/Notification";
import Spinner from "../components/Spinner";
import { getMessaging, onMessage } from "firebase/messaging";
import emailjs from "@emailjs/browser";
import fetch from "node-fetch";
import deleteIcon from "../assets/img/deleteImage.png";

const EditListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [price, setPrice] = useState("");
  const [toggle, setToggle] = useState(true);
  const [recipients, setRecipients] = useState([]);
  const [selectedImages, setImages] = useState([]);
  const [previousImages, setPreviousImages] = useState([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [imageIndexToDelete, setImageIndexToDelete] = useState(null);
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
    images: {},
  });
  const navigate = useNavigate();
  const auth = getAuth();
  const [signed, setSigned] = useState("false");
  const [userRole, setUserRole] = useState("");
  const [emailSent, setEmailSent] = useState(false);

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
    images,
  } = formData;
  const [message, setMessage] = useState("");
  const params = useParams();
  const [sent, setSent] = useState("Send Email");
  const [image, setImage] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("timestamp", "desc"));
      const querySnap = await getDocs(q);
      const emailList = [];
      querySnap.forEach((doc) => {
        return emailList.push(doc.data().email);
      });
      const docSnapshot = await getDoc(
        doc(db, "propertyListings", params.listingId)
      );
      const address = docSnapshot.data().address;
      const commaCount = address?.split(",")?.length;

      if (commaCount !== 3) {
        setAddressError(
          "(Enter the full address (i.e. 277 Broadway, New York, NY 10007). No abbreviations except the state are allowed.)"
        );
      } else {
        setAddressError("");
      }
      setPreviousImages(
        (docSnapshot.exists() &&
          docSnapshot.data().imgs.map((img) => img.url)) ||
          []
      );
      setRecipients(emailList);
    };
    fetchUser();
  }, [toggle, selectedImages]);

  const [emailData, setEmailData] = useState({
    to: recipients,
    subject: "price change",
    text: `Take a look at new price of this listing ${listing?.address}`,
  });

  const subject = "price change";
  const text = `Hello,\n\nYou got a new message from MNC Team Development.\nTake a look at the new price of this listing ${listing?.address}\n\nBest Wishes,\nTeam MNC Development`;

  const sendEmail = async () => {
    try {
      const response = await fetch(
        "https://us-central1-mnc-development.cloudfunctions.net/sendEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recipients, subject, text }),
        }
      );

      if (response.ok) {
        console.log("Email sent successfully");
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleEmail = (regularPrice) => {
    if (price !== regularPrice) {
      sendEmail();
    }
    handleAddNotificationClick(`${name} is updated!`);
  };

  const handleAddNotificationClick = async (notification) => {
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
      const docRef = doc(db, "propertyListings", params.listingId); // Gets listingId from the id in the page link
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setPrice(docSnap.regularPrice);
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist.");
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      const docRef = doc(db, "propertyListings", params.listingId); // Gets listingId from the id in the page link
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPrice(docSnap.regularPrice);
      } else {
        navigate("/");
        toast.error("Listing does not exist.");
      }
    };

    fetchListing();
  }, []);

  // Update all form data
  const onChange = (e) => {
    const { id, value } = e.target;

    let bool = null;
    if (e.target.value === "true") {
      bool = true;
    }
    if (e.target.value === "false") {
      bool = false;
    }

    if (id === "address") {
      // Check if the address contains two commas
      const commaCount = value?.split(",")?.length;

      if (commaCount === 3) {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: bool ?? e.target.value,
        }));
        setAddressError("");
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: bool ?? e.target.value,
        }));
        setAddressError(
          "(Enter the full address (i.e. 277 Broadway, New York, NY 10007). No abbreviations except the state are allowed.)"
        );
      }
    } else if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      const objectURLs = selectedImages.map((image) =>
        URL.createObjectURL(image)
      );
      const updatedImages = [...previousImages, ...objectURLs];
      setImages(updatedImages);
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    } else if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: bool ?? e.target.value, // If bool is null, updates field with value, otherwise updates field with bool value
      }));
    }
  };

  function isGoogleMapsLoaded() {
    return window.google && window.google.maps;
  }

  // Function to load the Google Maps API script
  function loadGoogleMapsScript(callback) {
    const apiKey = `${import.meta.env.VITE_API_KEY}`;
    console.log("Attempting to load Google Maps API script");
    if (isGoogleMapsLoaded()) {
      if (typeof callback === "function") {
        callback();
      }
    } else {
      if (window.googleMapsScriptLoading) {
        // If script is already in the process of loading, add the callback to a queue
        window.googleMapsScriptCallbackQueue.push(callback);
      } else {
        window.googleMapsScriptLoading = true;
        window.googleMapsScriptCallbackQueue = [callback];
  
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&callback=googleMapsScriptLoaded`;
        script.defer = true;
  
        window.googleMapsScriptLoaded = () => {
          window.googleMapsScriptLoading = false;
          if (typeof callback === "function") {
            callback();
          }
  
          // Call any additional callbacks in the queue
          window.googleMapsScriptCallbackQueue.forEach((cb) => cb());
          window.googleMapsScriptCallbackQueue = [];
        };
  
        document.head.appendChild(script);
      }
    }
  }

  // Your geocoding logic function
  const geocodeAddress = async (address) => {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results.length > 0) {
          resolve(results[0].geometry.location);
        } else {
          reject(
            new Error("Geocoding failed. Please enter a correct address.")
          );
        }
      });
    });
  };

  // Submits form data to firebase
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("1");

    console.log("2");
    if (!addressError) {
      setLoading(true);
      // Checks that discounted price is lower than regular price (if applicable)
      if (+discountedPrice >= +regularPrice) {
        setLoading(false);
        toast.error(
          "Discounted price needs to be less than the regular price."
        );
        return;
      }

      if (selectedImages?.length > 6) {
        setLoading(false);
        toast.error("Maximum of 6 images are allowed.");
        return;
      }
      
      let geolocation = {};

      try {
        await new Promise((resolve) => {
          loadGoogleMapsScript(resolve);
        });

        const location = await geocodeAddress(address);
        geolocation.lat = location.lat() || 0;
        geolocation.lng = location.lng() || 0;
      } catch (error) {
        setLoading(false);
        toast.error("Please enter a correct address.");
        return;
      }
      // Converts address to coordinates if geolocationEnabled is true
      // let geolocation = {};
      // let location;
      // if (geolocationEnabled) {
      //   const response = await fetch(
      //     `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
      //       import.meta.env.VITE_API_KEY
      //     }`
      //   );
      //   const data = await response.json();

      //   console.log("location error data: ", data)
      //   // Gets longitude and latitude from google maps api call
      //   geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      //   geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      //   location = data.status === "ZERO_RESULTS" && undefined;

      //   if (location === undefined) {
      //     setLoading(false);
      //     toast.error("Please enter a correct address.");
      //     return;
      //   }
      // } else {
      //   // Otherwise use manually inputted form data for the latitude and longitude fields
      //   geolocation.lat = latitude;
      //   geolocation.lng = longitude;
      // }

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

      const docSnapshot = await getDoc(
        doc(db, "propertyListings", params.listingId)
      );

      // Extract existing images from the Firestore document
      const existingImages =
        (docSnapshot.exists() && docSnapshot.data().imgs) || [];

      // Passes all images to storeImage function, displays error message if image upload fails
      const newImages = await Promise.all(
        images && Object.keys(images).length > 0
          ? [...images].map((image) => storeImage(image))
          : []
      ).catch((error) => {
        setLoading(false);
        toast.error("Images not uploaded.");
        console.log(error);
        return;
      });

      const allImages = [...existingImages, ...newImages];

      // Copy of form data with additional fields for geolocation, and timestamp
      const formDataCopy = {
        ...formData,
        imgs: allImages,
        geolocation,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
      };

      delete formDataCopy.images;
      delete formDataCopy.latitude;
      delete formDataCopy.longitude;
      !formDataCopy.offer && delete formDataCopy.discountedPrice;

      // Adds form data to firestore database
      const docRef = doc(db, "propertyListings", params.listingId);
      await updateDoc(docRef, formDataCopy);
      setLoading(false);
      toast.success("Listing edited!");

      navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    } else {
    }
    // });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const storage = getStorage();
      const uniqueFileName = `${file?.name}-${uuidv4()}`;
      const storageRef = ref(storage, `images/${uniqueFileName}`);

      try {
        const snapshot = await uploadBytes(storageRef, file); // Upload the file to Firebase Storage

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(snapshot.ref);

        const imgs = []; // Initialize an empty array

        // Add an object with a 'url' field to the 'imgs' array
        imgs.push({ url: downloadURL });

        // Update your formData with the download URL
        setFormData({ ...formData, imgs: imgs });
        // setFormData({ ...formData, url: downloadURL });
        setImage(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // Function to handle image deletion
  const handleDeleteImage = async (imageIndex) => {
    try {
      const docRef = doc(db, "propertyListings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const imgsArray = docSnap.data().imgs;
        const deletedImageUrl = imgsArray[imageIndex]?.url;

        if (deletedImageUrl) {
          setConfirmationVisible(true);
          setImageIndexToDelete(imageIndex);
        } else {
          const updatedImages = [...selectedImages];
          updatedImages.splice(imageIndex, 1);
          setImages(updatedImages);
        }
      } else {
        navigate("/");
        toast.error("Listing does not exist.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const confirmDelete = async () => {
    if (imageIndexToDelete !== null) {
      try {
        const docRef = doc(db, "propertyListings", params.listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const imgsArray = docSnap.data().imgs;
          const deletedImageUrl = imgsArray[imageIndexToDelete]?.url;

          setConfirmationVisible(true);
          setImageIndexToDelete(imageIndexToDelete);

          const updatedImages = imgsArray.filter(
            (img) => img.url !== deletedImageUrl
          );
          const updatedImages2 = selectedImages.filter(
            (_, index) => index !== imageIndexToDelete
          );
          setImages(updatedImages2);

          await updateDoc(docRef, { imgs: updatedImages });
          toast.success("Image has been deleted!");
          setToggle(!toggle);
          // Close confirmation dialog
          setConfirmationVisible(false);
          setImageIndexToDelete(null);
        } else {
          navigate("/");
          toast.error("Listing does not exist.");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  const cancelDelete = () => {
    // Close confirmation dialog
    setConfirmationVisible(false);
    setImageIndexToDelete(null);
  };

  // Displays loading screen while listing is updated
  if (loading) {
    return <Spinner />;
  }

  const cancelUpdate = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Edit Listing</h1>
      <form onSubmit={onSubmit}>
        {/* Select buy/rent buttons */}
        <p className="text-lg mt-6 font-semibold">Buy / Rent / Sold</p>
        <div className="flex ">
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
        <div className="flex ">
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
        <div className="flex ">
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
          className="w-full px-4 py-2 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300"
        />
        {addressError && (
          <>
            <p
              style={{ fontSize: "12px", color: "gray", marginBottom: "10px" }}
            >
              {addressError}
            </p>
          </>
        )}
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
        <div className="flex mb-6">
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

        <input
          style={{ marginBottom: "15px", marginTop: "15px" }}
          type="file"
          id="images"
          multiple
          accept=".jpg,.png,.jpeg"
          onChange={onChange}
          className="w-full px-3 py-1.5 text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300"
        />
        <div>
          {(Array.isArray(previousImages) && previousImages.length > 0) ||
          (Array.isArray(selectedImages) && selectedImages.length > 0) ? (
            <div>
              {Array.isArray(selectedImages) && selectedImages.length > 0
                ? selectedImages.map((image, index) => (
                    <div key={index} className="relative inline-block">
                      <button
                        className="absolute top-0 right-0 z-10 p-2 bg-white rounded-full"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent the form submission
                          handleDeleteImage(index);
                        }}
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          className="w-6 h-5"
                        />
                      </button>
                      <img
                        src={image}
                        alt={`Uploaded Image ${index}`}
                        className="filter grayscale-100 mb-6"
                        style={{
                          filter: "grayscale(100%)",
                        }}
                      />
                    </div>
                  ))
                : previousImages.map((image, index) => (
                    <div key={index} className="relative inline-block">
                      <button
                        className="absolute top-0 right-0 z-10 p-2 bg-white rounded-full"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent the form submission
                          handleDeleteImage(index);
                        }}
                      >
                        <img
                          src={deleteIcon}
                          alt="Delete"
                          className="w-6 h-5"
                        />
                      </button>
                      <img
                        src={image}
                        alt={`Uploaded Image ${index}`}
                        className="filter grayscale-100 mb-6"
                        style={{
                          filter: "grayscale(100%)",
                        }}
                      />
                    </div>
                  ))}
            </div>
          ) : (
            <p>No images to display</p>
          )}
        </div>
        {confirmationVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-8 rounded">
              <p className="mb-4">
                This action will delete the selected image from database.
                <br />
                Press <strong>"Yes"</strong> to proceed.
              </p>
              <button
                onClick={(e) => {
                  confirmDelete();
                  e.preventDefault();
                }}
                className="mr-4 px-4 py-2 bg-gray-600 text-white rounded"
              >
                Yes
              </button>
              <button
                onClick={(e) => {
                  cancelDelete();
                  e.preventDefault();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                No
              </button>
            </div>
          </div>
        )}
        <button
          onClick={cancelUpdate}
          className="mt-1 mb-2 w-full bg-gray-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-semibold hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
        >
          Cancel
        </button>

        {/* Submit form data button */}
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-gray-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-600 focus:shadow-lg active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out"
          onClick={() => handleEmail(regularPrice)}
        >
          Edit Listing
        </button>
      </form>
    </main>
  );
};

export default EditListing;
