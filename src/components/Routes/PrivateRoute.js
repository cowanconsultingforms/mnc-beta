import { async } from "@firebase/util";
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
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth, useFirestore, useSigninCheck, useUser } from "reactfire";
import AdminPage from "pages/Admin";
export const PrivateRoutes = ({Component:<AdminPage />,...rest }),  {
  const auth = useAuth();
  const location = useLocation();
  const firestore = useFirestore();
  const { data: user } = useUser();
  const { status, data: signInCheckResult } = useSigninCheck();
  const [loggedIn, setLoggedIn] = useState(null);
  const [userData, setUserData] = useState({userEmail:''});
  const handleAuthorization = async (e) => {
    e.preventDefault();

    if (status === success) {
      setLoggedIn(true);
      const userEmail = auth.currentUser.email.toString();
      getDocs(query(collection(firestore,'users'),where()))
    }
  };
  const pullUserData = async (e) => {
    e.preventDefault()
    if (user) {
        setUserData({userEmail:user.email})
      try {
        getDocs(query(collection(firestore, "users", where("email", "==", userData.userEmail).toLowerCase()))).
          then((onSnapshot) =>
            onSnapshot.docs.filter())
      } catch (e) {}
    }
  };
  useEffect(() => {
    if (handleAuthorization() === true) {
      pullUserData(userData)
    }
      if (loggedIn) {
        const q = query(
          collection(firestore, "users"),
          where("email", "!=", null)
        );
      }
    });
    const q = query(collection(firestore, "users"));
  
  return (
    <div className="PrivateRoute">
      <Route></Route>
    </div>
  );
};
export default { PrivateRoute };
