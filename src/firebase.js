import { initializeApp } from "firebase/app";
import React from "react";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  StorageProvider,
  AuthProvider,
  useFirebaseApp,
  FirestoreProvider,useInitAuth,useInitFirestore,useInitStorage, AppCheckProvider
} from "reactfire";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { initializeAppCheck } from "firebase/app-check";
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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const GlobalFirebaseProvider = ({ children }) => {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  return (
    <BrowserRouter>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={db}>
          <StorageProvider sdk={storage}>
      
            <App />
         
          </StorageProvider>
        </FirestoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default app;
