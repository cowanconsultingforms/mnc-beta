import React, { useState, forwardRef, useRef, useEffect } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import { Item } from "../Admin/AdminPageComponents";
import {
  where,
  getDoc,
  doc,
  collection,
  query,
  setDoc,
} from "firebase/firestore";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";

export const ProfileEdit = () => {
  const { data: user } = useUser();
  const [isSubmit, setIsSubmit] = useState(false);
  const [formValue, setFormValue] = useState({
    email: "",
    userName: "",
    role: "",
    min: "",
    max: "",
  });
  const formRef = useRef();
  const docRef = doc(useFirestore(), "users", user.uid);
  const { status, data } = useFirestoreDocData(docRef);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmit(true);
    if (isSubmit) {
      setDoc(docRef, ...formValue).then((res) => {
        if (res) {
          return <Alert variant="success">Account Updated</Alert>;
        }
      });
    }
  };
  useEffect(() => {
    if (status === "success") {
      setFormValue(...data);
    }
  }, [status, setFormValue, data]);
  return (
    <Box
      className="account-page-portfolio"
      component="form"
      ref={formRef}
      sx={{
        width: "70%",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Garamond",
        backgroundColor: "gray",
      }}
    >
      <Item>
        <TextField
          label="Role"
          value={formValue.role}
          disabled
          sx={{ fontFamily: "Garamond" }}
          fullWidth
        />
        <TextField
          label="User ID"
          value={formValue.uid}
          disabled
          sx={{ fontFamily: "Garamond" }}
          fullWidth
        />
        <TextField
          label="Email"
          value={formValue.email}
          disabled
          sx={{ fontFamily: "Garamond" }}
          fullWidth
        />
        <TextField
          label="Portfolio Min"
          value={formValue.min}
          disabled
          sx={{ fontFamily: "Garamond" }}
          fullWidth
        />
        <TextField
          label="Portfolio Max"
          value={formValue.email}
          disabled
          sx={{ fontFamily: "Garamond" }}
          fullWidth
        />
        <Button onClick={handleSubmit} />
      </Item>
    </Box>
  );
};

export default ProfileEdit;

/*Breif: This is a React functional component that allows a user to edit their profile information in a form.
 The component uses React hooks, such as useState, useRef, and useEffect, to manage the state of the form and handle 
 the submission of the form data.

The component makes use of the useUser hook from the reactfire library 
to retrieve the current user's data, and the useFirestoreDocData hook to retrieve the data from the Firestore database.
 The useFirestore hook is used to initialize the Firestore instance, and the doc method is used to create a reference to the document 
 in the users collection for the current user.

The handleSubmit function is called when the form is submitted and updates the user's information in the Firestore database
 using the setDoc method. If the update is successful, a success alert is displayed to the user.

The form fields are rendered using the TextField component from the Material UI library and display the user's information.
 The form fields for role, user ID, email, portfolio min, and portfolio max are displayed as disabled text fields, meaning 
 that the user cannot edit these fields in the form.*/