import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  documentId,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Dropdown from "../components/Dropdown";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import { db } from "../firebase";
import "../css/admin.css";

const Admin = () => {
  const [selectedRow, setSelectedRow] = useState();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState({});
  const [expirationDates, setExpirationDates] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userRef = collection(db, "users");
        const userQuery = query(
          userRef,
          where(documentId(), "==", auth.currentUser.uid)
        );
        const user = [];
        const userSnap = await getDocs(userQuery);
        userSnap.forEach((doc) => user.push(doc.data()));

        if (["superadmin", "admin"].includes(user[0]?.role)) {
          const usersRef = collection(db, "users");
          const q = query(usersRef, orderBy("timestamp", "desc"));
          const querySnap = await getDocs(q);

          const usersData = [];
          querySnap.forEach((doc) => {
            usersData.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          setUsers(usersData);

          const initialCheckboxValues = {};
          const initialExpirationDates = {};
          usersData.forEach((user) => {
            initialCheckboxValues[user.id] = user.data.isTopAgent || false;
            initialExpirationDates[user.id] = user.data.expirationDate?.toDate() || null;
          });
          setCheckboxValues(initialCheckboxValues);
          setExpirationDates(initialExpirationDates);
        } else {
          navigate("/");
        }
      } catch (error) {
        toast.error("Insufficient permissions.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [auth.currentUser.uid, navigate]);

  const updateUser = async (userId, isTopAgent, expirationDate) => {
    const userDocRef = doc(db, "users", userId);
    try {
      await updateDoc(userDocRef, {
        isTopAgent: isTopAgent,
        expirationDate: expirationDate || null,
      });
      console.log(`Updated user ${userId}: isTopAgent = ${isTopAgent}, expirationDate = ${expirationDate}`);
      toast.success(`Top agent status ${isTopAgent ? 'granted' : 'revoked'}!`);
    } catch (error) {
      toast.error("Failed to update top agent status.");
      console.error("Error updating document: ", error.message);
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

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      for (const user of users) {
        const expirationDate = expirationDates[user.id];
        if (expirationDate && expirationDate <= now) {
          console.log(`Expiring user ${user.id}...`);
          setCheckboxValues((prevState) => ({
            ...prevState,
            [user.id]: false,
          }));
          setExpirationDates((prevState) => ({
            ...prevState,
            [user.id]: null,
          }));
          await updateUser(user.id, false, null);
          toast.info(`Top agent status for ${user.data.name} has expired.`);
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [users, expirationDates]);

  return (
    <div className="admin-container">
      <div className="pb-20 text-sm sm:text-base mt-6 overflow-y-hidden overflow-x-auto">
        <table className="w-full lg:m-4 min-w-6xl lg:mx-auto rounded shadow-lg bg-white lg:space-x-5">
          <thead>
            <tr>
              <th className="p-3 md:p-6 text-center">Role</th>
              <th className="p-3 md:p-6 text-center">Top Agent</th>
              <th className="p-3 md:p-6 text-left">Email</th>
              <th className="p-3 md:p-6 text-left">Name</th>
              <th className="p-3 md:p-6 text-left">Creation Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={`${index % 2 === 0 ? "bg-gray-200" : "bg-white"}`}>
                <td onClick={() => setSelectedRow(user.id)} className="p-3 md:p-6">
                  <Dropdown userId={user.id} selected={selectedRow === user.id} />
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
                <td className="p-3 md:p-6">{user.data.email}</td>
                <td className="p-3 md:p-6">{user.data.name}</td>
                <td className="p-3 md:p-6">
                  <Moment local>{user.data.timestamp?.toDate()}</Moment>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;