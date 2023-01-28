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
} from "firebase/firestore";
import { useAuth, useFirestore } from "reactfire";
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
