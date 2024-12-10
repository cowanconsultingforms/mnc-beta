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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Dropdown from "../components/Dropdown";
import Spinner from "../components/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../firebase";

import { Menu } from '@headlessui/react';

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
          const usersQuery = query(usersRef, orderBy("timestamp", "desc"));
          const usersSnap = await getDocs(usersQuery);
          const usersList = usersSnap.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));
          setUsers(usersList);
          setFilteredUsers(usersList);

          // Initialize checkboxValues and expirationDates
          const initialCheckboxValues = {};
          const initialExpirationDates = {};
          usersList.forEach((user) => {
            initialCheckboxValues[user.id] = user.data.isTopAgent || false;
            initialExpirationDates[user.id] = user.data.expirationDate ? new Date(user.data.expirationDate.seconds * 1000) : null;
          });
          setCheckboxValues(initialCheckboxValues);
          setExpirationDates(initialExpirationDates);
        }
      } catch (error) {
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [auth.currentUser.uid]);

  const handleCheckboxChange = async (userId) => {
    const newValue = !checkboxValues[userId];
    setCheckboxValues((prev) => ({
      ...prev,
      [userId]: newValue,
    }));

    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, {
        isTopAgent: newValue,
      });
      toast.success("User updated successfully.");
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  const handleDateChange = async (date, userId) => {
    setExpirationDates((prev) => ({
      ...prev,
      [userId]: date,
    }));

    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, {
        expirationDate: date,
      });
      toast.success("Expiration date updated successfully.");
    } catch (error) {
      toast.error("Failed to update expiration date.");
    }
  };

  const handleDropdownChange = (option, userId) => {
    switch (option) {
      case 'payment-history':
        navigate(`/payment-history/${userId}`);
        break;
      case 'userDocuments':
        navigate(`/userDocuments/${userId}`);
        break;
      case 'viewProfile':
        navigate(`/viewProfile/${userId}`);
        break;
      default:
        break;
    }
  };

  const MyDropdown = ({ userId }) => (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-150 ease-in-out">
        More
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg outline-none z-50">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-gray-100' : ''
                } w-full text-left px-4 py-2 text-sm text-gray-700`}
                onClick={() => handleDropdownChange('payment-history', userId)}
              >
                View Payments
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-gray-100' : ''
                } w-full text-left px-4 py-2 text-sm text-gray-700`}
                onClick={() => handleDropdownChange('userDocuments', userId)}
              >
                View Documents
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-gray-100' : ''
                } w-full text-left px-4 py-2 text-sm text-gray-700`}
                onClick={() => handleDropdownChange('viewProfile', userId)}
              >
                View Profile
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <div className="min-h-screen h-auto bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 p-8 admin-container">
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
                    <th className="px-6 py-3">Action</th>
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
                        {currentUserRole === 'superadmin' ||
                        (currentUserRole === 'admin' &&
                          user.data.role !== 'admin' &&
                          user.data.role !== 'superadmin') ? (
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
                        {currentUserRole === 'superadmin' || currentUserRole === 'admin' ? (
                          <MyDropdown userId={user.id} />
                        ) : null}
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