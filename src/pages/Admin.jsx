import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  collection,
  query,
  where,
  documentId,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { db } from "../firebase";
import Spinner from "../components/Spinner";

const Admin = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      // Get user info from firestore database
      const userRef = collection(db, "users");
      const userQuery = query(
        userRef,
        where(documentId(), "==", auth.currentUser.uid)
      );
      const user = [];
      const userSnap = await getDocs(userQuery);
      userSnap.forEach((doc) => {
        return user.push(doc.data());
      });

      // Gives user access to listings if they have the correct role
      if (!user[0]?.roles.includes("admin")) {
        toast.error("You cannot access this page.");
        navigate("/");
      }
    };

    fetchUser();
    setLoading(false);
  }, [auth.currentUser.uid, navigate]);

  if (loading) {
    return <Spinner />;
  }

  return <div>Admin</div>;
};

export default Admin;
