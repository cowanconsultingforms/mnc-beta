import { initializeApp } from "firebase/app";
//This method is used to initialize a Firebase app instance, which is required before any other Firebase services, such as authentication and database, 
//can be used in the app.
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
//This code imports the Firebase Authentication, Firestore and Storage modules from the firebase library.

import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { initializeAppCheck } from "firebase/app-check";

//firebase Configurations 
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
/*This code exports a React component GlobalFirebaseProvider that uses the useFirebaseApp hook to get the initialized 
Firebase app, then uses getAuth, getFirestore, and getStorage functions to get the Firebase Authentication, Firestore, 
and Storage services, respectively. The component returns a component tree with the BrowserRouter component and three 
other components, AuthProvider, FirestoreProvider, and StorageProvider, which are provided by the reactfire library. 
These components wrap the children with the Firebase services so that they can be used in the children components.*/
export default app;

/*This code exports a React component GlobalFirebaseProvider which provides the Firebase services of authentication, 
firestore, and storage for a web app. It also exports an instance of the Firebase app created using the provided 
firebase configuration. The component wraps the main app component, App, and provides the Firebase services as context 
to the app using React context. The component is rendered inside a BrowserRouter component to enable client-side routing. 
Additionally, this code imports and uses the AuthProvider, FirestoreProvider, and StorageProvider components from the 
reactfire library to provide the Firebase services to the app.*/