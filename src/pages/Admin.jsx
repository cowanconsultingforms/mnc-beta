import { getAuth } from "firebase/auth";
import {
  collection,
  documentId,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Moment from "react-moment";
import Dropdown from "../components/Dropdown";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const Admin = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
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
        setCurrentUser(user);

        // Gives access to users if current account has admin role
        if (["superadmin", "admin"].includes(user[0]?.role)) {
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
        } else {
          toast.error("You cannot access this page.");
          navigate("/");
        }
        setLoading(false);
      } catch (error) {
        toast.error("Insufficient permissions.");
        navigate("/");
      }
    };

    fetchUser();
  }, [auth.currentUser.uid, navigate]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      {!loading && users?.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl text-center mt-6 font-bold">Users</h1>

          {/* Table for all queried users */}
          <div className="mt-6 overflow-auto md:overflow-visible">
            <table className="w-full lg:m-4 min-w-6xl lg:mx-auto rounded shadow-lg bg-white lg:space-x-5">
              <thead>
                <tr>
                  <th className="p-6 text-center">Role</th>
                  <th className="p-6 text-left">Email</th>
                  <th className="p-6 text-left">Name</th>
                  <th className="p-6 text-left">Creation Date</th>
                </tr>
              </thead>
              <tbody>
                {/* Dynamically adds rows for each user */}
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 == 0 ? "bg-gray-200" : "bg-white"}`}
                  >
                    {/* Role selector menu */}
                    <td className="p-6">
                      <Dropdown userId={user.id} />
                    </td>
                    <td className="p-6">{user.data.email}</td>
                    <td className="p-6">{user.data.name}</td>
                    <td className="p-6">
                      <Moment local>{user.data.timestamp?.toDate()}</Moment>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
