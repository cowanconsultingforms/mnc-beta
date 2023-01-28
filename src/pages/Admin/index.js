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
