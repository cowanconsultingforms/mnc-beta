import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GlobalFirebaseProvider } from './firebase';
import { FirebaseAppProvider } from 'reactfire';
const root = createRoot(document.getElementById('root'));
export const firebaseConfig = {
  apiKey: 'AIzaSyDWCSguMcsxy-39ZV2vfPJwQdmd44JP0rk',
  authDomain: 'mnc-development.firebaseapp.com',
  databaseURL: 'https://mnc-development-default-rtdb.firebaseio.com',
  projectId: 'mnc-development',
  storageBucket: 'mnc-development.appspot.com',
  messagingSenderId: '963609543814',
  appId: '1:963609543814:web:3b15ab14993c1f49d17d07',
  measurementId: 'G-E3FYEFLBKE',
};

root.render(
    <GlobalFirebaseProvider>
        <App />
    </GlobalFirebaseProvider>
);


/*This code sets up a React application using the ReactDOM library's "createRoot" function to 
render the app into a specific HTML element with the id "root". The code imports several dependencies, including:

React: the core React library

"createRoot" from "react-dom/client": a utility function for rendering React applications on the client-side
"./index.css": a stylesheet for the app
"./App": the main component for the app
"BrowserRouter" from "react-router-dom": a component for routing within a React app
"GlobalFirebaseProvider" and "FirebaseAppProvider" from "./firebase": components for integrating the app with Firebase
The code also defines a constant "firebaseConfig", which is an object containing the configuration information for a Firebase project.
Finally, the code calls the "render" method on the "root" object to render the app, which consists of several components wrapped in each other:
"FirebaseAppProvider" component, which sets up a Firebase app with the given "firebaseConfig" object as its configuration
"GlobalFirebaseProvider" component, which makes the Firebase app instance available to other parts of the app
"BrowserRouter" component, which provides routing capabilities to the app
"App" component, the main component for the app
All of these components are rendered within the "root" element, which is created by the "createRoot" function.*/