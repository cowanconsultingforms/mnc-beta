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
  getDocs
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


/*
Jose: I had changed ProfileChange. 
In this version displays the user information and uses useParams to navigate to user page. 
But the profile page cannot be navigated through the navbar. I think that navbar has to have a 
usercheck and have the user information to get navbar to work. 
If you see homesearch or search page, the information is nested inside 
map of the listing information and have navigation inside the map to successfully 
navigate to listing. Useparams is used to navigate and compare the information inside the 
map filter. 

Example https://mnc-development.web.app/search/Brooklyn, this would take a user to page 
where the listing information is filtered to Brooklyn. 

*/




export const ProfileChange = (props) => {
 /* 
 const{ role, email } = props;
  const{ data: user } = useUser()
 */
  const firestore = useFirestore();
  const navigate = useNavigate();
  const formRef = useRef();
  const [isSubmit, setIsSubmit] = useState(false);
  const {uid} = useParams();
  const [users, setUsers] = useState([]);
  const usersRef = collection(firestore, "users");
  
  useEffect(()=>{
    const getData = async ()=>{
     const data = await getDocs(usersRef);
     setUsers(data.docs.map((doc)=> ({...doc.data(), id: doc.id})));
     console.log(data);
    }
    getData();
 }, []);

  //const { status, data: signInCheckResult } = useSigninCheck();

/*

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

  const [formValue, setFormValue] = useState({
    email: "",
    userName: "",
    role: "",
    min: "",
    max: "",
  });

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
            const userRole = onSnapshot.get("role");
            const userEmail = onSnapshot.get("email");
            console.log(onSnapshot);
            
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
*/
  return (

    <div className="">
      {
        users
          .filter((user) => user.uid === uid)
          .map((user, index) => (
            <div className="full-card" key={ index }>
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
      //onSubmit={handleSubmit}
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
        value={user.userName}
        sx={{
          backgroundColor: "white",
          border: 1,
          borderColor: "gray",
          borderRadius: "5px",
          width:'80%',
          justifyContent:'left',
        }}
        
      />

      <TextField
        required
        label="Required Email"
        autoComplete="email"
        value={user.email}
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
        value={user.uid}
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
        value={user.role}
        sx={{
          backgroundColor: "white",
          border: 1,
          borderColor: "gray",
          borderRadius: "5px",
        }}
      />
      <TextField
        value={user.portfolioMin}
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
        value={user.portfolioMax}
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
        //onClick={handleSubmit}
      >
        Submit
      </Button>
    </Stack>
            </div>
          ))}
    </div>
  );
};
