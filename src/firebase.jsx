// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


//Currently configured for development

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_DEV_KEY,
  authDomain: "mnc-development.firebaseapp.com",
  // databaseURL: "https://mnc-development-default-rtdb.firebaseio.com",
  projectId: "mnc-development",
  storageBucket: "mnc-development.appspot.com",
  messagingSenderId: "963609543814",
  appId: "1:963609543814:web:e0661283a9000e45d17d07",
  measurementId: "G-5J0YJHVY1N",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
