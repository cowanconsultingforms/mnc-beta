import React, { forwardRef, useRef, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  DocumentSnapshot,
  query,
  where,
  serverTimestamp,
  setDoc,
  db
} from "firebase/firestore";
import { useAuth, useFirestore,} from "reactfire";
import { Box, TextField, Button } from "@mui/material";
//code to render search user from the admin page
export const Search = () => {
  const formRef = useRef();
  const [email, setEmail] = useState("");

  const HandleSubmit = async () => {
    const q = query(collection(db, "users"), where("email", "===", email));
    try {
      await getDoc(q).then((snap) => {
        if (snap.exists) {
          console.log(snap.data());
          return (
            <Fragment>
              {snap.data().map((id, value) => {
                return (
                  <Fragment>
                    <Box className="search-result">
                      <input value={value} key={id} type="text"></input>
                    </Box>
                  </Fragment>
                );
              })}
            </Fragment>
          );
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <h5>Look Up User By Email</h5>

      <Box component="form" sx={{ display: "flex", justifyContent: "center" }}>
        <TextField value={email} label="Email"></TextField>

        <Button className="search-button" onClick={HandleSubmit} type="submit">
          Search
        </Button>
      </Box>
    </Fragment>
  );
};

export default Search;

/*Breif: Defines a React component called Search that renders a search form to look up a user by email.
 When the user clicks the "Search" button, it will query the Firestore database to find the user with the matching email.

The component imports several functions from the Firebase Firestore SDK, including doc, getDoc, onSnapshot, collection, query, where,
serverTimestamp, setDoc, and db. It also imports several components from the MUI (Material-UI) React component library, including Box,
TextField, and Button.

The component initializes a formRef and email state variable using the useRef and useState hooks, respectively. When the user clicks the
"Search" button, it calls the HandleSubmit function, which constructs a query to find the user with the given email using the collection
and query functions from Firestore. If the query is successful, it retrieves the user data using the getDoc function and then renders the
search results in the component.*/

//Note that the search results are not actually rendered in the component in a way that the user can see. 
//The code currently returns a JSX element, but it is not actually being rendered to the DOM. - Possible issues 2-15-23