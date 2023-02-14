import { useState, useEffect, useRef, forwardRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { Stack, Alert } from "@mui/material";
import { Typography, ButtonGroup, TextareaAutosize } from "@mui/material";
import {
  useUser,
  useFirestore,
  useSigninCheck,
  useFirestoreDocData,
  useAuth,
} from "reactfire";

import {
  where,
  getDoc,
  doc,
  collection,
  query,
  setDoc,
} from "firebase/firestore";

/*
Old Design for Portifolio change, I moved it to the profile change and merged it with the 
changing profile. I was having trouble having the Portifolio below the profile, I spoke with Adam and 
Mr. Cowan about the design and I decided to merge them together. 
*/


export const PortfolioChange = forwardRef((props, ref) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const auth = useAuth();
  const { status, data: user } = useUser();
  const firestore = useFirestore();
  const navigate = useNavigate();
  const formRef = useRef();
  const [userRole, setUserRole] = useState("");
  const { data: signInCheckResult } = useSigninCheck();
  const [formValue, setFormValue] = useState({
    min: "",
    max: "",
  });
  const userDoc = [
    { min: "", id: "min" },
    { min: "", id: "max" },
  ];

  const handleSubmit = async (e) => {
    setIsSubmit(true);
    const currentUser = signInCheckResult.user;
    const docRef = doc(firestore, "users", currentUser.uid);
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
      setFormValue(signInCheckResult);
    }
  }, [status, setFormValue, signInCheckResult]);

  return (
    <Box
      component="form"
      //ref={formRef}
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        border: 1,
        borderColor: "gray",
        borderRadius: "5px",
        width: 600,
      }}
      noValidate
      autoComplete="off"
      backgroundColor="#808080"
    >
      <div>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Garamond",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            color: "white",
          }}
        >
          Edit Portfolio Info
        </Typography>
        {userDoc.map((min, idx) => (
          <TextField
            id={min.id}
            key={idx}
            value={formValue.min}
            label=" Portfolio Min:"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              backgroundColor: "white",
              border: 1,
              borderColor: "gray",
              borderRadius: "5px",
            }}
          />
        ))}
        {userDoc.map((max, idx) => (
          <TextField
            id={max.id}
            value={formValue.max}
            key={idx}
            label=" Portfolio Max:"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              backgroundColor: "white",
              border: 1,
              borderColor: "gray",
              borderRadius: "5px",
            }}
          />
        ))}
      </div>
      <Button
        variant="contained"
        sx={{ bottom: 0, right: -255 }}
        disabled={isSubmit}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
});
