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
