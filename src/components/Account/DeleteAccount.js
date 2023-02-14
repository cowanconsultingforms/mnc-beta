import { useNavigate, useLocation } from "react-router-dom";
import {
  deleteDoc,
  collection,
  query,
  where,
  FirestoreError,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import { useFirestore, useUser } from "reactfire";
import { deleteUser } from "firebase/auth";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export function AlertDialog() {
  const [open, setOpen] = useState(false);
  const { data: user, status } = useUser();
  const firestore = useFirestore();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const deleteCurrentUser = async () => {
    if (status === "success" && user !== null) {
      const collectionRefName = collection(firestore, "users");

      const q = query(collectionRefName, ["where", "uid", "===", user.uid]);
      await getDoc(q).then((onSnapshot) => {
        if (onSnapshot.exists) {
          deleteDoc(onSnapshot);
          deleteUser(user);
        }
      });
    }
  };

  return (
    <div className="DeleteDialog">
      <Button variant="outlined" onClick={handleClickOpen}>
        Delete Account
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">DELETE ACCOUNT ?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteCurrentUser} autoFocus>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertDialog;


/*This is a React functional component that displays a dialog box asking the user if they want to delete their account.
The dialog box is opened when the user clicks on the "Delete Account" button and is closed when the user clicks 
either the "Cancel" or "Delete Account" button.

When the user clicks the "Delete Account" button, the deleteCurrentUser function is executed. 
This function retrieves the current user's information and their associated document in the "users" collection in Firestore. 
If the document exists, it is deleted, and then the user's account is deleted using the Firebase authentication API.

This code uses the useUser hook from the reactfire library to get the current user's information and the useFirestore hook 
to interact with the Firestore database. The useState hook is used to manage the state of the dialog box (whether it's open or closed).*/