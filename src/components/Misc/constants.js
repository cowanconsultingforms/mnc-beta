import { serverTimestamp, collection, addDoc } from "firebase/firestore";
import { Alert } from "@mui/material";
import React, { useState, forwardRef, useReducer } from "react";

export const TextInput = forwardRef((props, ref) => (
  <input ref={ref} className="TextInput" {...props} />
));

export const AuditLogger = ({ action, username, userDoc, targetid }) => {
 
  switch (action) {
    case "created user":
      return { action: action, timestamp: serverTimestamp(),username:username,userDoc:userDoc,targetid:targetid };
    case "deleted user":
      return { action: action, timestamp: serverTimestamp(),username:username,userDoc:userDoc,targetid:targetid};
    case "added listing":
      return { action: action, timestamp: serverTimestamp(),username:username,userDoc:userDoc,targetid:targetid };
    case "edited listing":
      return { action: action, timestamp: serverTimestamp(),username:username,userDoc:userDoc,targetid:targetid};
    case "removed listing":
      return {action: action, timestamp: serverTimestamp(),username:username,userDoc:userDoc,targetid:targetid};
      case "change profile":
        return {action: action, timestamp: serverTimestamp(),username:username,userDoc:userDoc,targetid:targetid};
        default:
          return;
  }
};
export const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

/* This Block of code imports several functions and modules from Firebase, 
MUI, and React libraries.

The serverTimestamp, collection, and addDoc are imported from firebase/firestore. 
These are functions that are used to interact with Firestore database.

The Alert component is imported from the @mui/material library, 
which is used to render a user-friendly alert component to display 
messages to the user.

The useState, forwardRef, and useReducer hooks are imported from the React library. 
These are used to manage and update the state of the component, as well as to
 pass a reference to a child component.


The TextInput component is a forwardRef component that renders an input element 
with the classname TextInput. It takes in props and a reference to the input 
element.


The AuditLogger component is a function that takes in four props - action, 
username, userDoc, and targetid. It returns an object with these four props and 
a timestamp prop that is set to the server timestamp using the serverTimestamp() 
function from Firebase.


The states array is a list of US states' abbreviations.
*/



