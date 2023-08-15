import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
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
import Moment from "react-moment";

const Admin = () => {
  const [currentUser, setCurrentUser] = useState(null);
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
      setCurrentUser(user);

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
          <h2 className="flex items-center justify-center text-2xl text-center font-semibold mb-6">
            Users
          </h2>
          <div className="overflow-scroll">
            <table className="w-full lg:m-4 min-w-6xl lg:mx-auto rounded shadow-lg bg-white lg:space-x-5">
              <thead>
                <tr className="font-bold">
                  <td>Name</td>
                  <td>Email</td>
                  <td>Creation Date</td>
                  <td>User?</td>
                  <td>Agent?</td>
                  <td>Admin?</td>
                  <td>Superadmin?</td>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap">{user.data.name}</td>
                    <td className="whitespace-nowrap">{user.data.email}</td>
                    <td>
                      <Moment local>{user.data.timestamp?.toDate()}</Moment>
                    </td>
                    <td className="whitespace-nowrap">
                      {user.data.roles[0] === "user" ? (
                        <ImCheckboxChecked />
                      ) : (
                        <ImCheckboxUnchecked />
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {user.data.roles[1] === "agent" ? (
                        <ImCheckboxChecked />
                      ) : (
                        <ImCheckboxUnchecked />
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {user.data.roles[2] === "admin" ? (
                        <ImCheckboxChecked />
                      ) : (
                        <ImCheckboxUnchecked />
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {user.data.roles[3] === "superadmin" ? (
                        <ImCheckboxChecked />
                      ) : (
                        <ImCheckboxUnchecked />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
