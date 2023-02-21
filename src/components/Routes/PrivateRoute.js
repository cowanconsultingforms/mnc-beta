import { JoinFull } from "@mui/icons-material";
import {
  collection,
  getDoc,
  namedQuery,
  query,
  where,
  queryEqual,
  getDocs,
  onSnapshot,
  doc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth, useFirestore, useSigninCheck, useUser } from "reactfire";
import AdminPage from "pages/Admin";

const PrivateRoutes = ({ Component: AdminPage, ...rest }) => {
  const auth = useAuth();
  const location = useLocation();
  const firestore = useFirestore();
  const { data: user } = useUser();
  const { status, data: signInCheckResult } = useSigninCheck();
  const [loggedIn, setLoggedIn] = useState(null);
  const [userData, setUserData] = useState({ userEmail: '' });

  const handleAuthorization = async (e) => {
    e.preventDefault();

    if (status === 'success') {
      setLoggedIn(true);
      const userEmail = auth.currentUser.email.toString();
      getDocs(query(collection(firestore, 'users'), where('email', '==', userEmail)))
    }
  };

  const pullUserData = async (e) => {
    e.preventDefault();
    if (user) {
      setUserData({ userEmail: user.email });
      try {
        getDocs(query(collection(firestore, 'users'), where('email', '==', userData.userEmail.toLowerCase()))).then(
          (onSnapshot) => onSnapshot.docs.filter()
        );
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (handleAuthorization() === true) {
      pullUserData(userData);
    }
    if (loggedIn) {
      const q = query(collection(firestore, 'users'), where('email', '!=', null));
    }
  }, [loggedIn, userData, firestore]);

  const q = query(collection(firestore, 'users'));

  return (
    <div className="PrivateRoute">
      <Route {...rest} />
    </div>
  );
};

export default PrivateRoutes;


//Known Issues: Some syntax errors and issues with this code that make it difficult to understand what it is intended to do. 

/*Breif: The code imports various functions and components from different libraries, including Firebase's Firestore, React Router DOM, and ReactFire.

There is a function component called PrivateRoutes that receives an object with two properties (Component and rest) as its first argument, 
followed by an empty object. 
The Component property is being destructured from the object and immediately passed as a prop to an AdminPage component. The rest property is not being used in this code snippet.

The PrivateRoutes component uses various hooks, including useAuth, useLocation, useFirestore, useSigninCheck, and useUser, 
to access authentication and database information, as well as the current location of the application.

The component defines various state variables using the useState hook, including loggedIn, userData, and potentially others depending on the 
implementation of the useFirestore hook.
The component defines two functions called handleAuthorization and pullUserData, which appear to be used to check if the user is authorized and
retrieve user data from Firestore, respectively. 

****there are some issues with their implementation, including the fact that 
handleAuthorization is asynchronous but does not return a Promise, and that pullUserData is using the getDocs function incorrectly 
(it should use await instead of .then() to retrieve data).
The useEffect hook is being used to trigger various side effects based on changes in the state or props of the component.
The implementation of the hook is incomplete, as it defines two different q variables that are not being used anywhere else in the component.

Returns a Route component wrapped in a div. 
*** However no content or path specified for the Route, so it is unclear what this component is intended to render.*/