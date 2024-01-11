// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// import firebase from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getToken, getMessaging, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "mnc-development.firebaseapp.com",
  // databaseURL: "https://mnc-development-default-rtdb.firebaseio.com",
  projectId: "mnc-development",
  storageBucket: "mnc-development.appspot.com",
  messagingSenderId: "963609543814",
  appId: "1:963609543814:web:e0661283a9000e45d17d07",
  measurementId: "G-5J0YJHVY1N",
};


export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);
export const db = getFirestore();

// const getOrRegisterServiceWorker = async () => {
//   if ('serviceWorker' in navigator) {
//     const serviceWorker = await window.navigator.serviceWorker.getRegistration();
//     if (serviceWorker) return serviceWorker;
//     return window.navigator.serviceWorker.register('/firebase-messaging-sw.js');
//   }
//   throw new Error("The browser doesn`t support service worker.");
// };

// export const getFirebaseToken = () =>
//   getOrRegisterServiceWorker().then((serviceWorkerRegistration) =>
//     getToken(messaging, {
//       vapidKey: import.meta.env.VAPID_KEY,
//       serviceWorkerRegistration,
//     })
//   );

// export const onForegroundMessage = () =>
//   new Promise((resolve) => onMessage(messaging, (payload) => resolve(payload)));

  // getFirebaseToken().then((token) => {
//   console.log("Firebase token: ", token);
// });
// export const firestore = firebase.firestore();
// export const createNotification = async (text) => {
//   try {
//     const notificationsRef = collection(db, 'notifications');
//     const docData = {
//       text,
//       timestamp: new Date(),
//     };
//     const docRef = await addDoc(notificationsRef, docData);
//     console.log('Notification added with ID: ', docRef.id);
//   } catch (error) {
//     console.error('Error adding notification: ', error);
//   }
// };

export const deleteOldNotifications = async () => {
  const now = new Date();
  now.setDate(now.getDate() - 2);
  const notificationsRef = collection(db, 'notifications');
  const querySnapshot = await getDocs(query(notificationsRef, where('timestamp', '<', now)));

  const batch = db.batch();
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
};