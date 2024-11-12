import { getAuth } from "firebase/auth";
import {
  collection,
  documentId,
  getDocs,
  orderBy,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Dropdown from "../components/Dropdown";
import Spinner from "../components/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../firebase";

const Admin = () => {
  const [selectedRow, setSelectedRow] = useState();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [checkboxValues, setCheckboxValues] = useState({});
  const [expirationDates, setExpirationDates] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
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

        const role = user[0]?.role;
        setCurrentUserRole(role);

        if (["superadmin", "admin"].includes(role)) {
          const usersRef = collection(db, "users");
          const q = query(usersRef, orderBy("timestamp", "desc"));
          const querySnap = await getDocs(q);

          let usersData = [];
          querySnap.forEach((doc) => {
            usersData.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          setUsers(usersData);
          setFilteredUsers(usersData);

          // Initialize checkbox and expiration date state
          const initialCheckboxValues = {};
          const initialExpirationDates = {};
          usersData.forEach((user) => {
            initialCheckboxValues[user.id] = user.data.isTopAgent || false;
            initialExpirationDates[user.id] = user.data.expirationDate?.toDate() || null;
          });
          setCheckboxValues(initialCheckboxValues);
          setExpirationDates(initialExpirationDates);
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

  const updateUser = async (userId, isTopAgent, expirationDate) => {
    const userDocRef = doc(db, "users", userId);
    try {
      await updateDoc(userDocRef, {
        isTopAgent: isTopAgent,
        expirationDate: expirationDate || null,
      });
      toast.success(`Top agent status ${isTopAgent ? 'granted' : 'revoked'}!`);
    } catch (error) {
      toast.error("Failed to update top agent status.");
    }
  };

  const handleCheckboxChange = async (userId) => {
    const newValue = !checkboxValues[userId];
    setCheckboxValues((prevState) => ({
      ...prevState,
      [userId]: newValue,
    }));

    const expirationDate = newValue ? expirationDates[userId] : null;
    await updateUser(userId, newValue, expirationDate);
  };

  const handleDateChange = async (date, userId) => {
    setExpirationDates((prevState) => ({
      ...prevState,
      [userId]: date,
    }));
    await updateUser(userId, checkboxValues[userId], date);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div style={{ zoom: 0.825 }}>
      <div className="min-h-screen h-auto bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 p-8">
        <div className="max-w-full mx-auto mt-auto">
          <input
            type="text"
            placeholder="Search user by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 w-full border border-gray-400 rounded bg-gray-50 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        {!loading && filteredUsers?.length > 0 && (
          <div className="max-w-full mx-auto mt-7">
            <h1 className="text-6xl text-center font-bold mb-8">User Management</h1>

            <div className="overflow-x-auto shadow-md sm:rounded-lg mt-7">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xl uppercase bg-gray-300 text-gray-600">
                  <tr>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Top Agent</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Creation Date</th>
                    <th className="px-6 py-3">Payment Management</th>
                    <th className="px-6 py-3">Document Management</th>
                    <th className="px-6 py-3">Profile Information</th>
                  </tr>
                </thead>
                <tbody className="text-lg font-medium text-gray-700">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                      } hover:bg-gray-300 transition duration-200`}
                    >
                      <td onClick={() => setSelectedRow(user.id)} className="px-6 py-4">
                        {currentUserRole === "superadmin" || (currentUserRole === "admin" && user.data.role !== "admin" && user.data.role !== "superadmin") ? (
                          <Dropdown userId={user.id} selected={selectedRow === user.id} />
                        ) : (
                          <div>{user.data.role}</div>
                        )}
                      </td>
                      <td className="p-3 md:p-6 text-center">
                        {user.data.role === 'agent' && (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={checkboxValues[user.id] || false}
                              onChange={() => handleCheckboxChange(user.id)}
                            />
                            {checkboxValues[user.id] && (
                              <DatePicker
                                selected={expirationDates[user.id]}
                                onChange={(date) => handleDateChange(date, user.id)}
                                className="ml-2 p-1 border rounded"
                                placeholderText="Select expiration date"
                                minDate={new Date()}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={1}
                                dateFormat="Pp"
                              />
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">{user.data.email}</td>
                      <td className="px-6 py-4">{user.data.name}</td>
                      <td className="px-6 py-4">
                        <Moment local>{user.data.timestamp?.toDate()}</Moment>
                      </td>

                      <td className="px-6 py-4">
                        {currentUserRole === "superadmin" || currentUserRole === "admin" && (
                          <button
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                            onClick={() => navigate(`/payment-history/${user.id}`)}
                          >
                            View Payments
                          </button>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {currentUserRole === "superadmin" || currentUserRole === "admin" && (
                          <button
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                            onClick={() => navigate(`/userDocuments/${user.id}`)}
                          >
                            View Documents
                          </button>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {currentUserRole === "superadmin" || currentUserRole === "admin" && (
                          <button
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                            onClick={() => navigate(`/viewProfile/${user.id}`)}
                          >
                            View Profile
                          </button>
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
    </div>
  );
};

export default Admin;
