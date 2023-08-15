import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  collection,
  query,
  where,
  orderBy,
  documentId,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { db } from "../firebase";
import Spinner from "../components/Spinner";

const Admin = () => {
  const [users, setUsers] = useState(null);
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

      // Gives access to users if current account has admin role
      if (!user[0]?.roles.includes("admin")) {
        toast.error("You cannot access this page.");
        navigate("/");
      }

      if (user[0]?.roles.includes("admin")) {
        const usersRef = collection(db, "users");

        // Queries all users
        const q = query(usersRef, orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);

        // Adds all users from query to 'users' variable
        let users = [];
        querySnap.forEach((doc) => {
          return users.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setUsers(users);
      }
      setLoading(false);
    };

    fetchUser();
    console.log(users);
  }, [auth.currentUser.uid, navigate]);

  if (loading) {
    return <Spinner />;
  }

  const onChange = (e) => {
    e.preventDefault();
    console.log(users);
  };

  return (
    <div>
      {!loading && users?.length > 0 && (
        <>
          <h2 className="text-2xl text-center font-semibold mb-6">Users</h2>
          <ul className="">
            <li className="flex justify-between items-center font-bold">
              <p>Name</p>
              <p>Email</p>
              <p>Roles</p>
            </li>
            {users.map((user) => (
              <li key={user.id} className="flex justify-between items-center">
                <p>{user.data.name}</p>
                <p>{user.data.email}</p>
                <p>{user.data.roles.toString()}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Admin;
