import React, { useEffect, useState, useReducer } from "react";
import { Box, Table, TextField } from "@mui/material";
import {
  orderBy,
  doc,
  collection,
  collectionGroup,
  getDoc,
} from "firebase/firestore";
import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreDocDataOnce,
} from "reactfire";

const initialValues = {
  type: "",
  id: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  price: "",
  description: "",
  images: [],
  listed_by: "",
  created_at: "",
};
const reducer = (action, state) => {
  const { type, payload } = action;
  switch (type) {
    case "FIELD_SET":
      return {
        ...state,
        [payload.fieldName]: payload.field,
      };
    default:
      break;
  }
};
export const Listing = (props) => {
  const db = useFirestore();
  const {
    type,
    id,
    street,
    address,
    city,
    state,
    zip,
    price,
    description,
    images,
    listed_by,
    created_at,
  } = props;
  const listingBucket = collectionGroup(db, `${type}`);

  const listingDoc = useFirestoreCollection(
    collection(db, `listings/${type}/properties`)
  );
  const [docData, setDocData] = useState({ ...listingDoc });

  useEffect(() => {
    const fetchDoc = async () => {
      getDoc(listingDoc).then((onSnapshot) => {
        setDocData(...onSnapshot.data());
        console.log(...onSnapshot.data);
      });
    };
    fetchDoc();
  });

  return (
    <Box className="Listing" component="div">
     
    </Box>
  );
};
