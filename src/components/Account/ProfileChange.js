import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import {
  Typography,
  ButtonGroup,
  TextareaAutosize,
  TextField,
  Alert,
} from "@mui/material";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import { auth } from "../../firebase";
import { useUser, useFirestore, useSigninCheck } from "reactfire";
import {
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/system";
import { useParams } from "react-router-dom";

const Item2 = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(196 196 196)" : "rgb(196 196 196)",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const ProfileChange = (props) => {
  const { role, email } = props;
  const { data: user } = useUser();
  const firestore = useFirestore();
  const navigate = useNavigate();
  const formRef = useRef();
  const [isSubmit, setIsSubmit] = useState(false);
  const { status, data: signInCheckResult } = useSigninCheck();
  const logAction = async (e) => {
    e.preventDefault();
    const auditForm = new FormData();

    try {
      const uid = signInCheckResult.user.uid;
      const email = signInCheckResult.user.email;
      const action = "Changed Profile";
      await addDoc(
        collection(firestore, "auditLogger", { auditForm, uid, email, action })
      ).then((res) => {
        console.log(res);
      });
    } catch (error) {
      console.log(error);
    }
  };
  //const navigate = useNavigate();
  const [formValue, setFormValue] = useState({
    email: "",
    userName: "",
    role: "",
    min: "",
    max: "",
  });
  const userDoc = [
    { email: "", id: "email" },
    { userName: "", id: "userName" },
    { role: "", id: "role" },
    { userID: "", id: "userID" },
  ];
  useEffect(() => {
    const userCheck = async () => {
      if (status === "loading") {
        return <Spinner />;
      }
      if (signInCheckResult.signedIn === true) {
        const currentUser = signInCheckResult.user;
        const q = query(
          collection(firestore, "users"),
          where("email", "==", currentUser.email)
        );
        try {
          getDoc(q).then((onSnapshot) => {
            if (onSnapshot.exists()) {
              for (doc in onSnapshot) {
                console.log(doc);
              }
            }
          });
        } catch (error) {}
        if (user !== null) {
          const docRef = doc(firestore, "users", [
            "email",
            "==",
            currentUser.email,
          ]);
          await getDoc(docRef).then((onSnapshot) => {
            console.log(onSnapshot);
            const userRole = onSnapshot.get("role");
            const userEmail = onSnapshot.get("email");
          });
        }
      }
    };
    userCheck();
  }, [status, firestore, user, setFormValue, signInCheckResult]);
  //const currentUser = signInCheckResult.user;

  const handleSubmit = async () => {
    const currentUser = signInCheckResult.user;
    const docRef = doc(firestore, "users", ['email','==',currentUser.email]);
    
    setIsSubmit(true);
    if (isSubmit) {
      setDoc(docRef, ...formValue).then((res) => {
        if (res) {
          logAction();
          setIsSubmit(false);
          return <Alert variant="success">Account Updated</Alert>;
        }
      });
    }
  };

  return (
    <Stack
      component="form"
      ref={formRef}
      sx={{
        "& .MuiTextField-root": { m: 1,width:'50%' },
        border: 1,
        borderColor: "lightgray",
        borderRadius: "5px",
        backgroundColor: "#eeeeee",
        fontFamily: "Garamond",
      }}
      noValidate
      onSubmit={handleSubmit}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Garamond",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          color: "gray",
        }}
      >
        Edit User Info
      </Typography>

      <TextField
        required
        label="UserName: "
        autoComplete="email"
        value={formValue.userName}
        sx={{
          backgroundColor: "white",
          border: 1,
          borderColor: "gray",
          borderRadius: "5px",
          width:'80%',
          justifyContent:'left'
        }}
      />

      <TextField
        required
        label="Required"
        autoComplete="email"
        value={formValue.email}
        sx={{
          backgroundColor: "white",
          border: 1,
          borderColor: "gray",
          borderRadius: "5px",
        }}
      />

      <TextField
        disabled
        id="outlined-disabled"
        label="UserID: "
        value={formValue.userName}
        sx={{
          backgroundColor: "white",
          border: 1,
          borderColor: "gray",
          borderRadius: "5px",
        }}
      />

      <TextField
        disabled
        label="Role Change Disabled"
        defaultValue="Role"
        value={formValue.role}
        sx={{
          backgroundColor: "white",
          border: 1,
          borderColor: "gray",
          borderRadius: "5px",
        }}
      />
      <TextField
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

      <TextField
        value={formValue.max}
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
      <Button
        variant="contained" 
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Stack>
  );
};
