import React, { useEffect, useState, useReducer } from 'react';
import { Box, Table, TextField } from '@mui/material';
import {
  orderBy,
  doc,
  collection,
  collectionGroup,
  getDoc,
} from 'firebase/firestore';
import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreDocDataOnce,
} from 'reactfire';
// Old Listings Design
const initialValues = {
  type: 'forSale',
  id: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  price: '',
  description: '',
  images: [],
  listed_by: '',
  created_at: '',
};
const reducer = (action, state) => {
  const { type, payload } = action;
  switch (type) {
    case 'FIELD_SET':
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
    collection(db, `listings/${type}/properties`),
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

  return <Box className="Listing" component="div"></Box>;
};

/*Breif: Imports various components and functions from external libraries such as React, MUI, and Firebase, 
and exports a React component called Listing. 

a.Defines an initial state object and a reducer function to update the state.
b.Sets up a connection to Firestore using the useFirestore hook from reactfire.
c.Defines a Firestore collection that will be queried later.
d.Defines a React component called Listing that takes in props including the type of the listing
 (forSale or forRent), id, address, city, state, zip, price, description, images, listed_by, and created_at.
e.Uses the useFirestoreCollection and useFirestoreDocDataOnce hooks from reactfire to fetch data from Firestore and
 store it in local state using useState.
f.Sets up an useEffect hook that fetches data from Firestore and updates the local state whenever the component mounts.
g.Returns a Box component that renders a listing, but at the moment the component doesn't display any content other than the empty box.*/