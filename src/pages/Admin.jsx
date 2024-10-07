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
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Dropdown from "../components/Dropdown";
import Spinner from "../components/Spinner";
import { db } from "../firebase";

const Admin = () => {
  const [selectedRow, setSelectedRow] = useState();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null); // State to store filtered users
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [currentUserRole, setCurrentUserRole] = useState(""); // State to store the current user's role
  const navigate = useNavigate();
  const auth = getAuth();

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

        // Set the current user's role
        const role = user[0]?.role;
        setCurrentUserRole(role);

        // Gives access to user management data if current account has admin role
        if (["superadmin", "admin"].includes(role)) {
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
          setFilteredUsers(users); // Initialize filteredUsers with all users
        } else {
          // Does not allow access to user management data if user does not have admin role
          toast.error("You cannot access this page.");
          navigate("/");
        }
        setLoading(false);
      } catch (error) {
        // Does not allow access to user management data if firestore rules blocks unauthorized user from accessing page
        toast.error("Insufficient permissions.");
        navigate("/");
      }
    };

    fetchUser();
  }, [auth.currentUser.uid, navigate]);

  // Update filteredUsers based on searchQuery
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredUsers(users);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = users?.filter(user =>
        user.data.email.toLowerCase().includes(lowerCaseQuery) ||
        user.data.name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      {/* Search input */}
      <div className="max-w-6xl mx-auto mt-6">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 w-full border rounded"
        />
      </div>

      {/* Only displays table once data is fetched */}
      {!loading && filteredUsers?.length > 0 && (
        <div className="max-w-6xl mx-auto mt-6">
          <h1 className="text-3xl text-center font-bold">Users</h1>

          {/* Table for all queried users */}
          <div className="pb-20 text-sm sm:text-base mt-6 overflow-y-scroll overflow-x-visible overflow-visible">
            <table className="w-full lg:m-4 min-w-6xl lg:mx-auto rounded shadow-lg bg-white lg:space-x-5">
              <thead>
                <tr>
                  <th className="p-3 md:p-6 text-center">Role</th>
                  <th className="p-3 md:p-6 text-left">Email</th>
                  <th className="p-3 md:p-6 text-left">Name</th>
                  <th className="p-3 md:p-6 text-left">Creation Date</th>
                  <th className="p-3 md:p-6 text-left">Payment Management</th>
                  <th className="p-3 md:p-6 text-left">Document Management</th>
                  <th className="p-3 md:p-6 text-left">Profile Information</th>
                </tr>
              </thead>
              <tbody>
                {/* Dynamically adds rows for each user */}
                {filteredUsers.map((user, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
                  >
                    {/* Conditionally render the role selector menu based on currentUserRole */}
                    <td
                      onClick={() => {
                        setSelectedRow(user.id);
                      }}
                      className="p-3 md:p-6"
                    >
                      {currentUserRole === "superadmin" ? (
                        <Dropdown
                          userId={user.id}
                          selected={selectedRow === user.id}
                        />
                      ) : (
                        <div>{user.data.role}</div> // Display role as static text for non-superadmins
                      )}
                    </td>
                    <td className="p-3 md:p-6">{user.data.email}</td>
                    <td className="p-3 md:p-6">{user.data.name}</td>
                    <td className="p-3 md:p-6">
                      <Moment local>{user.data.timestamp?.toDate()}</Moment>
                    </td>

                    <td className="p-3 md:p-6">
                      {/* Payment Management Section */}
                      {/* Add code to display or manage payments */}
                      {currentUserRole === "superadmin" || "admin" && (
                        <button className="bg-blue-500 text-white p-2 rounded"
                        onClick={() => navigate(`/payments/${user.id}`)}>View Payments</button>
                      )}
                    </td>
                    <td className="p-3 md:p-6">
                      {/* User Documents Section */}
                      {/* Add code to display or upload leasing documents */}
                      {currentUserRole === "superadmin" || "admin" && (
                        <button className="bg-green-500 text-white p-2 rounded"
                        onClick={() => navigate(`/userDocuments/${user.id}`)}>View Documents</button>
                      )}
                    </td>

                    <td className="p-3 md:p-6">
                      {/* Profile Information Section */}
                      {/* Add code to display selected user profile */}
                      {currentUserRole === "superadmin" || "admin" && (
                        <button 
                        className="bg-yellow-500 text-white p-2 rounded" 
                        onClick={() => navigate(`/viewProfile/${user.id}`)}>View Profile</button>
                      )}
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
