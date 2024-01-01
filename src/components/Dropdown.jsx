import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import { db } from "../firebase";
import Spinner from "./Spinner";
import fetch from "node-fetch";

const Dropdown = ({ userId, selected }) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
const [loadingDeteting, setLoadingDeleting] = useState(false);
  const [userName, setUserName] = useState({
    name: "",
  });
  const [formData, setFormData] = useState({
    role: "user",
  });
  const { role } = formData;
  const { name } = userName;
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirm = () => {
    deleteUser(userId);
    setShowModal(false);
  };
  const handleCancel = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserName(docSnap.data());
        setFormData({ ...docSnap.data() });
      }
    };
    fetchUser();

    setLoading(false);
  }, [userId]);

  if (loading) {
    return <Spinner />;
  }

  // Changes role form data when corresponding button is selected
  const onChange = (e) => {
    setFormData({
      role: e.target.value,
    });
    setIsOpen(false);
  };

  const RefreshButton = () => {
    window.location.reload();
  };

  // Submits changed role to firestore database
  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formDataCopy = {
      ...formData,
      subscriptionEmailSent: "false",
      subscriptionAgentEmailSent: "false",
    };

    if (role === "vip") {
      const timestamp = serverTimestamp();
      formDataCopy.subscription = timestamp;
    }

    // Adds form data to firestore database
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success(`Changed ${name}'s role to ${formDataCopy.role}!`);
  };

  const deleteUser = async (userId) => {
    try {
      setLoadingDeleting(true);
      const response = await fetch(
        "https://us-central1-mnc-development.cloudfunctions.net/deleteUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        RefreshButton();
        console.log("User deleted successfully");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally{
      setLoadingDeleting(false);
    }
  };

  return (
    <div>
    <div onMouseLeave={() => setIsOpen(false)}>
      {role === "superadmin" ? (
        <div className="relative w-full">
          <button
            type="button"
            className="w-full text-center p-3 z-10 bg-gray-600 text-white rounded-lg"
          >
            {role}
          </button>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="relative w-full flex justify-center items-center shadow-xl rounded-lg"
        >
          {/* Dropdown button */}
          <div className="relative w-full">
            <button
              className={`min-w-[90px] w-full flex justify-between items-center p-3 z-10 bg-gray-600 text-white rounded-l-lg ${
                isOpen && "rounded-bl-none"
              }`}
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {role}
              {/* Displays downward arrow when menu is closed, upward arrow when menu is open  */}
              {!isOpen ? (
                <AiOutlineCaretDown className="text-lg" />
              ) : (
                <AiOutlineCaretUp className="text-lg" />
              )}
            </button>
          </div>

          {/* Apply changes button */}
          <div className="relative w-full">
            <button
              type="submit"
              className={`w-full flex justify-center items-center p-3 z-10 bg-white text-gray-600 rounded-r-lg hover:bg-gray-100 focus:bg-gray-100 hover:text-gray-700 focus:text-gray-700 active:bg-gray-300 active:text-gray-800 ${
                isOpen && "rounded-br-none"
              }`}
            >
              Apply
            </button>
          </div>
          {/* delete */}
          <div className="relative w-full">
            <button
              type="submit"
              className={`w-full ml-2 flex justify-center items-center p-3 z-10 bg-white text-gray-600  hover:bg-gray-100 focus:bg-gray-100 hover:text-gray-700 focus:text-gray-700 active:bg-gray-300 active:text-gray-800 rounded`}
              onClick={(e) => handleButtonClick(e)}
            >
              Delete
            </button>
          </div>

          {/* Displays role options when dropdown menu is clicked */}
          {isOpen && selected && (
            <div
              className="absolute flex flex-col top-11 sm:top-12 items-start text-start w-full overflow-hidden rounded-lg rounded-t-none shadow-2xl"
              // onTouchEnd={() => setIsOpen(false)}
              onClick={() => setIsOpen(false)}
            >
              {/* user role option */}
              <div className="flex flex-col z-30 w-full shadow-2xl ">
                {/* admin role option */}
                <button
                  value="admin"
                  type="button"
                  onClick={onChange}
                  className={`p-3 ${
                    role === "admin"
                      ? "bg-gray-300 text-gray-800"
                      : "bg-white text-gray-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-gray-700 focus:text-gray-700 active:bg-gray-300 active:text-gray-800"
                  }`}
                >
                  admin
                </button>

                <button
                  value="staff"
                  type="button"
                  onClick={onChange}
                  className={`p-3 ${
                    role === "staff"
                      ? "bg-gray-300 text-gray-800"
                      : "bg-white text-gray-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-gray-700 focus:text-gray-700 active:bg-gray-300 active:text-gray-800"
                  }`}
                >
                  staff
                </button>

                <button
                  value="user"
                  type="button"
                  onClick={onChange}
                  className={`p-3 ${
                    role === "user"
                      ? "bg-gray-300 text-gray-800"
                      : "bg-white text-gray-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-gray-700 focus:text-gray-700 active:bg-gray-300 active:text-gray-800"
                  }`}
                >
                  user
                </button>

                {/* vip role option */}
                <button
                  value="vip"
                  type="button"
                  onClick={onChange}
                  className={`p-3 ${
                    role === "vip"
                      ? "bg-gray-300 text-gray-800"
                      : "bg-white text-gray-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-gray-700 focus:text-gray-700 active:bg-gray-300 active:text-gray-800"
                  }`}
                >
                  vip
                </button>

                {/* agent role option */}
                <button
                  value="agent"
                  type="button"
                  onClick={onChange}
                  className={`p-3 ${
                    role === "agent"
                      ? "bg-gray-300 text-gray-800"
                      : "bg-white text-gray-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-gray-700 focus:text-gray-700 active:bg-gray-300 active:text-gray-800"
                  }`}
                >
                  agent
                </button>

                <button
                  value="client"
                  type="button"
                  onClick={onChange}
                  className={`p-3 ${
                    role === "client"
                      ? "bg-gray-300 text-gray-800"
                      : "bg-white text-gray-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-gray-700 focus:text-gray-700 active:bg-gray-300 active:text-gray-800"
                  }`}
                >
                  client
                </button>

                <button
                  value="tenant"
                  type="button"
                  onClick={onChange}
                  className={`p-3 ${
                    role === "tenant"
                      ? "bg-gray-300 text-gray-800"
                      : "bg-white text-gray-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-gray-700 focus:text-gray-700 active:bg-gray-300 active:text-gray-800"
                  }`}
                >
                  tenant
                </button>

                <button
                  value="vendor"
                  type="button"
                  onClick={onChange}
                  className={`p-3 ${
                    role === "vendor"
                      ? "bg-gray-300 text-gray-800"
                      : "bg-white text-gray-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-gray-700 focus:text-gray-700 active:bg-gray-300 active:text-gray-800"
                  }`}
                >
                  vendor
                </button>

                <button
                  value="partner"
                  type="button"
                  onClick={onChange}
                  className={`p-3 ${
                    role === "partner"
                      ? "bg-gray-300 text-gray-800"
                      : "bg-white text-gray-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-gray-700 focus:text-gray-700 active:bg-gray-300 active:text-gray-800"
                  }`}
                >
                  partner
                </button>
              </div>
            </div>
          )}
        </form>
      )}
     
      </div>
      {loadingDeteting && (
      <div className="bg-gray-900 bg-opacity-50 fixed inset-0 flex items-center justify-center z-10">
      <p className="font-semibold" style={{fontSize: "25px", color: "white"}}>Deleting...</p>
      </div>
      )}
      {showModal && (
        <>
          <div className="bg-gray-600 bg-opacity-50 fixed inset-0 flex items-center justify-center z-10">
            <div className="modal-content bg-white p-6 rounded shadow-lg flex flex-col items-center">
              <p className="flex-grow">Are you sure you want to delete this user?</p>
              <div className="mt-5 ml-auto">
              <button
              type="button"
                onClick={()=>handleCancel()}
                className="bg-gray-600 text-white px-4 py-2 rounded "
              >
                Cancel
              </button>
              <button
              type="button"
                onClick={()=>handleConfirm()}
                className="bg-gray-600 text-white px-4 py-2 rounded ml-5"
              >
                OK
              </button>
              
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;
