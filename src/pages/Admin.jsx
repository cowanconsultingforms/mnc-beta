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
import Spinner from "../components/Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../firebase";
import "../css/admin.css";
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

const Admin = () => {
  const [selectedRow, setSelectedRow] = useState();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [checkboxValues, setCheckboxValues] = useState({});
  const [expirationDates, setExpirationDates] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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

  useEffect(() => {
    if (users) {
      const searchFiltered = users.filter(
        (user) =>
          user.data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.data.email.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const roleFiltered = selectedRole
        ? searchFiltered.filter((user) => user.data.role === selectedRole)
        : searchFiltered;

      setFilteredUsers(roleFiltered);
    }
  }, [searchQuery, selectedRole, users]);

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

  const handleRoleChange = async (e, userId) => {
    const newRole = e.target.value;
    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, {
        role: newRole,
      });
      setSelectedUser((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          role: newRole,
        },
      }));
      setFilteredUsers((prevFilteredUsers) =>
        prevFilteredUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                data: {
                  ...user.data,
                  role: newRole,
                },
              }
            : user
        )
      );
      toast.success("Role updated successfully.");
    } catch (error) {
      toast.error("Failed to update role.");
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

  const handleDeleteUser = async (userId, userEmail) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      toast.error("You must be logged in as an admin to delete users.");
      return;
    }
  
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete ${userEmail}? This action is irreversible.`)) {
      return;
    }
  
    try {
      // Get the admin's ID token
      const idToken = await user.getIdToken();
  
      // Send request to delete user
      const response = await fetch("https://us-central1-mnc-development.cloudfunctions.net/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, idToken }),
      });
  
      if (response.ok) {
        toast.success("User deleted successfully.");
  
        // Update the UI by removing the deleted user
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setFilteredUsers((prevFilteredUsers) => prevFilteredUsers.filter((user) => user.id !== userId));
  
        // Close the modal after successful deletion
        closeModal();
      } else {
        const errorMessage = await response.text();
        toast.error(`Failed to delete user: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user.");
    }
  };
  

  const openModal = (user) => {
    setSelectedUser(user);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
  };

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
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mt-4 p-3 w-full border border-gray-400 rounded bg-gray-50 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="client">Client</option>
            <option value="partner">Partner</option>
            <option value="staff">Staff</option>
            <option value="superadmin">Superadmin</option>
            <option value="vendor">Vendor</option>
            <option value="vip">Vip</option>
            <option value="user">User</option>
          </select>
        </div>

        {!loading && filteredUsers?.length > 0 && (
          <div className="max-w-full mx-auto mt-7">
            <h1 className="text-3xl text-center font-bold mb-8">User Management</h1>
            <div className="overflow-x-hidden shadow-md sm:rounded-lg mt-7">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xl uppercase bg-gray-300 text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-6 py-3">Role</th>
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
                      <td className="px-4 py-4">{user.data.name}</td>
                      <td className="px-6 py-4">{user.data.role}</td>
                      <td className="px-6 py-4">
                        <button
                          className="bg-gray-600 text-white mr-20 px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-150 ease-in-out"
                          onClick={() => openModal(user)}
                        >
                          More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedUser && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="User Details"
            className="modal"
            overlayClassName="modal-overlay"
          >
            <div className="modal-content">
              <h2 className="text-2xl font-bold mb-4">User Details</h2>
              <p><strong>Email:</strong> {selectedUser.data.email}</p>
              <p><strong>Role:</strong></p>
              <select
                value={selectedUser.data.role}
                onChange={(e) => handleRoleChange(e, selectedUser.id)}
                className="p-2 border rounded"
              >
                <option value="superadmin">Superadmin</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="user">User</option>
                <option value="vip">Vip</option>
                <option value="client">Client</option>
                <option value="agent">Agent</option>
                <option value="vendor">Vendor</option>
                <option value="partner">Partner</option>
              </select>
              {selectedUser.data.role === 'agent' && (
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checkboxValues[selectedUser.id] || false}
                      onChange={() => handleCheckboxChange(selectedUser.id)}
                      className="mr-2"
                    />
                    Top Agent
                  </label>
                  {checkboxValues[selectedUser.id] && (
                    <DatePicker
                      selected={expirationDates[selectedUser.id]}
                      onChange={(date) => handleDateChange(date, selectedUser.id)}
                      className="mt-2 p-1 border rounded w-full"
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
              <div className="modal-buttons mt-4">
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-150 ease-in-out"
                  onClick={() => handleDropdownChange('payment-history', selectedUser.id)}
                >
                  View Payments
                </button>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150 ease-in-out"
                  onClick={() => handleDropdownChange('userDocuments', selectedUser.id)}
                >
                  View Documents
                </button>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150 ease-in-out"
                  onClick={() => handleDropdownChange('viewProfile', selectedUser.id)}
                >
                  View Profile
                </button>

                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150 ease-in-out"
                  onClick={() => handleDeleteUser(selectedUser.id, selectedUser.data.email)}
                >
                  Delete User
                </button>

                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150 ease-in-out"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Admin;
