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
