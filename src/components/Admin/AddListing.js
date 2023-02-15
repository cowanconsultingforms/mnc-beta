import { PhotoCamera } from "@mui/icons-material";
import {
  Box,
  Button,
  Fab,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Alert,
} from "@mui/material";
import { uuidv4 } from "@firebase/util";
import React, { useRef, useState, Fragment } from "react";
import { UseRadioGroup } from "./AdminPageComponents";
import { states } from "../Misc/constants";
import {
  useFirestore,
  useFirestoreCollection,
  useStorage,
  useStorageDownloadURL,
  useStorageTask,
} from "reactfire";
import {
  addDoc,
  collection,
  doc,
  documentId,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import {
  getDownloadURL,
  uploadBytesResumable,
  uploadBytes,
  ref,
} from "firebase/storage";

const initialValues = {
  docId: "",
  type: "forSale",
  street: "",
  city: "",
  state: "",
  zip: "",
  price: "",
  bedrooms: "",
  bathrooms: "",
  sqft: "",
  description: "",
  images: [],
  imageCount: 0,
};

export const AddListingForm = () => {
  const firestore = useFirestore();
  const storage = useStorage();
  const batch = writeBatch(firestore);
  const formRef = useRef();
  const [data, setData] = useState(initialValues);
  const [docID, setDocID] = useState("");
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState([]);
  const collectionRef = collection(
    firestore,
    `listings/${data.type}/properties`
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDoc = doc(firestore, `$listings/${data.type}/properties/${docID}`);
    const docData = {
      street: data.street,
      city: data.city,
      state: data.state,
      zip: data.zip,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      images: data.images,
      sqft: data.sqft,
      price: data.price,
    };

    await setDoc(newDoc, docData).then((res) => {
      if (res) {
        return <Alert severity="success">Firestore Document Added</Alert>;
      } else {
        return <Alert severity="error"></Alert>;
      }
    });
  };
  const handleChange = async (e) => e.target.value;

  const handleFileChange = async (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };
  const handleUpload = (e) => {
    const newId = uuidv4();
    e.preventDefault();
    const newDoc = doc(firestore, `$listings/${data.type}/properties/${newId}`);
    const storageRef = ref(storage, `${newId}/images${data.imageCount}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          batch.update(newDoc, "images", `image${data.imageCount}`.concat(url));
          data.imageCount++;
          setDocID(newDoc.id);
          data.images.push(url);
        });
      }
    );
  };

  return (
    <Fragment>
      <Grid container>
        <Box
          className="add-listing-form"
          component="form"
          ref={formRef}
          onSubmit={handleSubmit}
          autoComplete="true"
          backgroundColor="white"
          /*
        The entire error is build.umd.js:3103 Warning: UploadImages: `ref` is not a prop. 
        Trying to access it will result in `undefined` being returned.
         If you need to access the same value within the child component, 
         you should pass it as a different prop. 
         
        */
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            padding: "10px",
            margin: "15%",
            border: "2px solid black",
            borderRadius: "5px",
            width: "100%",
            fontFamily: "Garamond",
          }}
        >
          <UseRadioGroup
            aria-label="listing-type"
            onChange={(e) => setData({ ...data, type: e.target.value })}
            name="type"
            sx={{
              fontFamily: "Garamond",
              alignItems: "center",
              fontSize: "20px",
            }}
          />

          <TextField
            aria-label="street"
            name="street"
            label="Street Address"
            onChange={(e) => setData({ ...data, street: e.target.value })}
            sx={{
              fontFamily: "Garamond",
              width: "80%",
              backgroundColor: "white",
            }}
          />
          <TextField
            name="city"
            label="City"
            onChange={(e) => setData({ ...data, city: e.target.value })}
            sx={{ fontFamily: "Garamond", width: "80%" }}
          />
          <FormControl>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              value={data.state}
              name="state"
              label="State"
              onChange={handleChange}
              sx={{
                fontFamily: "Garamond",
                width: "80%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {states.map((state, key) => (
                <MenuItem
                  value={data.state}
                  key={key}
                  children
                  dense={true}
                  onChange={(e) => setData({ ...data, state: e.target.value })}
                  /*
                  For some reason I tried to change the background color in sx but it wouldn't work and I don't know why.
                  So I had to use style and change it through it. 
                  Also interesting behavior I find, after change the color of the background. When I hovered over an item(state), it would 
                  highlight the item before selecting the item. It doesn't highlight the item anymore after changing the background color.
                  */
                  style={{ backgroundColor: "white" }}
                  sx={{
                    height: "30px",
                    width: "30  %",
                    justifyContent: "left",
                    alignItems: "left",
                    color: "black",
                  }}
                >
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="zip"
            label="Zip Code"
            onChange={(e) => setData({ ...data, zip: e.target.value })}
            sx={{ fontFamily: "Garamond", width: "80%" }}
          />
          <TextField
            name="bedrooms"
            label="# of Bedrooms"
            onChange={(e) => setData({ ...data, bedrooms: e.target.value })}
            sx={{ fontFamily: "Garamond", width: "80%" }}
          />
          <TextField
            name="bathrooms"
            label="# of Bathrooms"
            onChange={(e) => setData({ ...data, bathrooms: e.target.value })}
            sx={{ fontFamily: "Garamond", width: "80%" }}
          />
          <TextField
            name="price"
            label="Listing Price"
            onChange={(e) => setData({ ...data, price: e.target.value })}
            sx={{ fontFamily: "Garamond", width: "80%", fontSize: "18px" }}
          />
          <input
            type="textarea"
            label="Description"
            //component="textarea"
            /*error here 
          Use the `defaultValue` or `value` props instead of setting children on <textarea>.
          I tried to figure this out by typing all of it in pascal case with T capitalized 
          out but it didn't work. I figured it out, how to fix the error for name by commenting it out and
          adding the value. 
          This is the reference on how I found this out
          https://stackoverflow.com/questions/30730369/reactjs-component-not-rendering-textarea-with-state-variable
          */
            placeholder="Property Details"
            name="description"
            onChange={(e) => setData({ ...data, description: e.target.value })}
            style={{
              fontFamily: "Garamond",
              width: "80%",
              justifyContent: "left",
              fontSize: "18px",
            }}
          />
          <label htmlFor="icon-button-file">
            <Input
              accept="image/*"
              id="icon-button-file"
              type="file"
              ref={formRef}
              multiple
              onChange={handleFileChange}
            />
            <Fab
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={handleUpload}
            >
              <PhotoCamera />
            </Fab>
          </label>
          {data.images.map((url) => {
            return <img src={url} alt="def" width="160px" height="90px" />;
          })}
          <Button type="submit" variant="contained">
            Add Property
          </Button>
        </Box>
      </Grid>
    </Fragment>
  );
};

export default AddListingForm;

/*Breif: JS File contains a React component: AddListingForm. 
This component is a form that allows users to add a new real estate listing to a Firebase Firestore database.

The component imports various Material UI components, as well as Firebase and ReactFire hooks and functions for
 interacting with Firestore and Firebase Storage. The component also imports a custom radio button component called UseRadioGroup.

The initialValues object contains default values for the form fields, 
including docId, type, street, city, state, zip, price, bedrooms, bathrooms, sqft, description, images, and imageCount.

The component defines state variables using the useState hook, including data, docID, progress, and file.

The component contains event handlers for submitting the form and handling changes to form fields and file uploads.

The JSX code in the component renders a Material UI form with various fields for entering real estate listing details,
 as well as a file upload button. 
 When the user submits the form, the component uses Firebase Firestore and Storage functions 
 to add the new listing to the database and upload the associated images. */