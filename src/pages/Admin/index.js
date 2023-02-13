import React, { useEffect, useState } from "react";
import AddListingForm from "../../components/Admin/AddListing";
import { Alert, Stack, Typography } from "@mui/material";
import ViewAuditLog from "../../components/Admin/ViewAuditLog";
import { ManageUsers } from "../../components/Admin/ManageUsers";
import { useFirestore, useUser, useSigninCheck } from "reactfire";
import { Spinner } from "react-bootstrap";
import { doc, getDoc } from "firebase/firestore";
import { Navigate, useNavigate } from "react-router-dom";
import { useId } from "react";

//defines the Admin Page component and uses hooks - useNavigatem useID, useUser, userFirestore
//Checks if the user's status is "loading" - returns a spinner component 
//Performs a check to see if the user is signed in and gets the user's data role from the Firestore database
//If the user is not a Admin returns an error message - if admin sens to page '/'
export const AdminPage = () => {
  const navigate = useNavigate();
  const uid = useId("");
  const { status, data: user } = useUser();
  const firestore = useFirestore();
  const { data: signInCheckResult } = useSigninCheck();
  useEffect(() => {
    const userCheck = async () => {
      if (status === "loading") {
        return <Spinner />;
      }
    //Checks if signInResult is true - retrieves current user's data and stores into constant currentSUer
    //logs snapshot of the data and retrieves the users role from the firestore

      if (signInCheckResult.signedIn === true) {
        const currentUser = signInCheckResult.user;

        if (user !== null) {
          const docRef = doc(firestore, "users", currentUser.uid);
          await getDoc(docRef).then((onSnapshot) => {
            console.log(onSnapshot);
            const userRole = onSnapshot.get("role");
            console.log(userRole);
            if (userRole !== "Administrator") {
              setTimeout(() => 1000);
              return (
                <Alert severity="error">
                  Not an Administrator! If this is incorrect, contact the site
                  Admin
                </Alert>
              );
            }
            navigate("/");
          });
        }
      }
    };
    userCheck();
  });
  return (
    <Stack
      className="admin-container"
      component="div"
      direction="column"
      sx={{ justifyContent: "center" }}
    >
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Garamond",
          fontWeight: "bold",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {" "}
        Add New Listing
      </Typography>
      <AddListingForm />
      <br></br>
      <ManageUsers />
      <ViewAuditLog />
    </Stack>
  );
};

export default AdminPage;

/*This code defines a React component named AdminPage. The component uses the useNavigate, useId,
useUser, useFirestore, and useSigninCheck hooks to handle user authentication and Firestore database
 operations. The component retrieves the current users data and role and checks if the user is an Administrator. 
 If the user is not an administrator, it displays an error message. If the user is an administrator, it navigates to
  the "/" page. The component also displays the addListingForm, ManageUsers, and ViewAuditLog components.*/