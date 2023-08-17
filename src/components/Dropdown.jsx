import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { toast } from "react-toastify";

import { db } from "../firebase";
import Spinner from "./Spinner";

const Dropdown = ({ userId, selected }) => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState({
    name: "",
  });
  const [formData, setFormData] = useState({
    role: "user",
  });
  const { role } = formData;
  const { name } = userName;

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

  // Submits changed role to firestore database
  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formDataCopy = {
      ...formData,
    };

    // Adds form data to firestore database
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success(`Changed ${name}'s role to ${formDataCopy.role}!`);
  };

  return (
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

          {/* Displays role options when dropdown menu is clicked */}
          {isOpen && selected && (
            <div
              className="absolute flex flex-col top-11 sm:top-12 items-start text-start w-full overflow-hidden rounded-lg rounded-t-none shadow-2xl"
              // onTouchEnd={() => setIsOpen(false)}
              onClick={() => setIsOpen(false)}
            >
              {/* user role option */}
              <div className="flex flex-col z-30 w-full shadow-2xl ">
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
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default Dropdown;
