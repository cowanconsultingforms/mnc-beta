import { getAuth } from "firebase/auth";
import {
  collection,
  documentId,
  getDocs,
  getDoc,
  orderBy,
  query,
  where,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const UserGrid = ({ users, handleUpdate }) => {
  return (
    <div className="grid  grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 sm:grid-cols-4 gap-5">
      {users.map((user, index) => (
        <div
          key={index}
          className={`bg-white  ml-5 rounded  shadow-lg flex flex-col h-90 w-60  justify-between  ${
            index % 2 === 0 ? "bg-gray-200" : "bg-white"
          }`}
        >
          {" "}
          <Link className="contents " to={`/viewProfile/${user.id}`}>
            {/* User picture */}
            <div className="text-center">
              <img
                src={user.data.imageUrl || "default-image-url"}
                alt={`${user.data.name}'s Picture`}
                className="w-full h-auto"
                style={{ filter: "grayscale(100%)" }}
              />
            </div>
            {/* User data */}
            <div>
              <p className="text-left ml-5 font-light font-bold text-2xl font-serif">
                {user.data.name}
              </p>
              <p className="mt-2 ml-5 text-left text-sm font-serif">
                {user.data.role}
              </p>
              {user.data.agent && (
                <p className="mt-2 ml-5 text-left text-sm">
                  <span className="font-semibold">Agent:</span> {user.data.agent}
                </p>
              )}
              {/* vip */}
              {user.data.role === "vip" && (
                <>
                  {user.data.numberOfDaysLeft && (
                    <p>
                      <span className="font-semibold ml-5">Expires in </span>{" "}
                      {user.data.numberOfDaysLeft} days
                    </p>
                  )}
                </>
              )}
              <p className="mt-2 ml-5 text-left text-sm">
                Email: {user.data.email}
              </p>
              <p className="text-left ml-5 text-sm">
                Creation Date:{" "}
                <Moment local>{user.data.timestamp?.toDate()}</Moment>
              </p>
              {user.data.dob && (
                <p className="mt-2 ml-5 text-left text-sm font-serif">
                  Dob:{" "}
                  {new Date(user.data.dob.seconds * 1000).toLocaleDateString()}
                </p>
              )}
            </div>{" "}
          </Link>
          {/* Update button */}
          <div className="text-center w-40 mx-auto mt-2">
            <button
              className="text-center bg-gray-600 text-white w-40 mx-auto mb-5"
              onClick={() => handleUpdate(user)}
            >
              Update
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ManageUsersProfile = () => {
  const [selectedRow, setSelectedRow] = useState();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const [role, setRole] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const superadmin = Array.isArray(users)
    ? users.filter((user) => user.data.role === "superadmin")
    : [];
  const admins = Array.isArray(users)
    ? users.filter((user) => user.data.role === "admin")
    : [];
    const staffs = Array.isArray(users)
    ? users.filter((user) => user.data.role === "staff")
    : [];
  const tenants = Array.isArray(users)
    ? users.filter((user) => user.data.role === "tenant")
    : [];
  const user = Array.isArray(users)
    ? users.filter((user) => user.data.role === "user")
    : [];
  const clients = Array.isArray(users)
    ? users.filter((user) => user.data.role === "client")
    : [];

  const vendors = Array.isArray(users)
    ? users.filter((user) => user.data.role === "vendor")
    : [];
  const partners = Array.isArray(users)
    ? users.filter((user) => user.data.role === "partner")
    : [];
  const vips = Array.isArray(users)
    ? users.filter((user) => user.data.role === "vip")
    : [];
  const agents = Array.isArray(users)
    ? users.filter((user) => user.data.role === "agent")
    : [];

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
          setRole(doc.data().role);
          return user.push(doc.data());
        });

        // Gives access to user management data if current account has admin role
        if (["superadmin", "admin", "agent"].includes(user[0]?.role)) {
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
          // Does not allow access to user management data if user does not have admin role
          // toast.error("You cannot access this page.");
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

  if (loading) {
    return <Spinner />;
  }

  const handleUpdate = (data) => {
    navigate(`/tenant/${data.id}`);
  };

  function filterUsersByRole(users, role) {
    if (role === "") {
      return users; // No filter selected, return all users
    }
    return users.filter((user) => user.data.role === role);
  }
  const filteredUsers = filterUsersByRole(users, filterRole);

  return (
    <div>
      {role && role === "agent" && (
        <>
          <h2 className="bg-gray-600 text-white text-center font-semibold mt-5 mb-5">
            Clients
          </h2>
          <UserGrid users={clients} handleUpdate={handleUpdate} />
        </>
      )}

      {role && role !== "agent" && (
        <>
          <h2 className="bg-gray-600 text-white text-center font-semibold mb-5">
            Super Admin
          </h2>
          <UserGrid users={superadmin} handleUpdate={handleUpdate} />
          <h2 className="bg-gray-600 text-white text-center font-semibold mb-5">
            Admin
          </h2>
          <UserGrid users={admins} handleUpdate={handleUpdate} />
          <h2 className="bg-gray-600 text-white text-center font-semibold mb-5">
            Staff
          </h2>
          <UserGrid users={staffs} handleUpdate={handleUpdate} />
          <h2 className="bg-gray-600 text-white text-center font-semibold mt-5 mb-5">
            Agents
          </h2>
          <UserGrid users={agents} handleUpdate={handleUpdate} />
          <h2 className="bg-gray-600 text-white text-center font-semibold mt-5 mb-5">
            Users
          </h2>
          <UserGrid users={user} handleUpdate={handleUpdate} />
          <h2 className="bg-gray-600 text-white text-center font-semibold mt-5 mb-5">
            Vips
          </h2>
          <UserGrid users={vips} handleUpdate={handleUpdate} />
          <h2 className="bg-gray-600 text-white text-center font-semibold mt-5 mb-5">
            Clients
          </h2>
          {/* <UserGrid users={clients} handleUpdate={handleUpdate} /> */}
          <UserGrid users={clients} handleUpdate={handleUpdate} />
          <h2 className="bg-gray-600 text-white text-center font-bold mt-5 mb-5">
            Tenants
          </h2>
          <UserGrid users={tenants} handleUpdate={handleUpdate} />
          <h2 className="bg-gray-600 text-white text-center font-semibold mt-5 mb-5">
            Vendors
          </h2>
          <UserGrid users={vendors} handleUpdate={handleUpdate} />
          <h2 className="bg-gray-600 text-white text-center font-semibold mt-5 mb-5">
            Partners
          </h2>
          <UserGrid users={partners} handleUpdate={handleUpdate} />
        </>
      )}
    </div>
  );
};

export default ManageUsersProfile;