import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GlobalFirebaseProvider } from "./firebase";
import { FirebaseAppProvider } from "reactfire";
const root = ReactDOM.createRoot(document.getElementById("root"));
export const firebaseConfig = {
  apiKey: "AIzaSyDWCSguMcsxy-39ZV2vfPJwQdmd44JP0rk",
  authDomain: "mnc-development.firebaseapp.com",
  databaseURL: "https://mnc-development-default-rtdb.firebaseio.com",
  projectId: "mnc-development",
  storageBucket: "mnc-development.appspot.com",
  messagingSenderId: "963609543814",
  appId: "1:963609543814:web:3b15ab14993c1f49d17d07",
  measurementId: "G-E3FYEFLBKE",
};

root.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <GlobalFirebaseProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalFirebaseProvider>
  </FirebaseAppProvider>
);
