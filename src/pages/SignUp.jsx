import SignInBackgroundImage from "../assets/img/sign-in-background.jpg";
import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  // Hook to show/hide password text
  const [showPassword, setShowPassword] = useState(false);

  // Sets name, email, and password forms to be empty on default
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roles: ["user"],
  });

  // Hook to update text when typing in form data
  const { name, email, password } = formData;
  const navigate = useNavigate();
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Add new account to authenticated users and firestore database
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      // Adds user to authenticated accounts
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update displayName with name field
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const user = userCredentials.user;
      const formDataCopy = { ...formData };

      delete formDataCopy.password; // Prevent unencrypted password from being stored in database
      formDataCopy.timestamp = serverTimestamp(); // Adds time of account creation

      // Adds account credentials to firestore database
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong with the registration.");
    }
  };

  return (
    <section
      className="object-cover h-[calc(100vh-48px)]"
      style={{
        backgroundImage: `url(${SignInBackgroundImage})`,
      }}
    >
      <h1 className="text-3xl text-center py-12 font-bold">Sign Up</h1>
      <div className="flex justify-center items-center mx-auto">
        <div className="max-w-md w-full mx-auto bg-gray-100 rounded px-6 py-6">
          <form onSubmit={onSubmit}>
            {/* Name form box */}
            <input
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
              type="text"
              id="name"
              value={name}
              onChange={onChange}
              placeholder="Full name"
            />
            {/* Email form box */}
            <input
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email address"
            />

            <div className="relative mb-6">
              {/* Password form box */}
              <input
                className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
              />

              {/* Show/hide password icon */}
              {showPassword ? (
                <AiFillEyeInvisible
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEye
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className="flex justify-between whitespace-nowrap text-sm">
              {/* Sign Up (Register) button */}
              <p className="mb-6">
                Have have an account?
                <Link
                  to="/sign-in"
                  className="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out ml-1"
                >
                  Sign in
                </Link>
              </p>

              {/* Forgot Password button */}
              <p>
                <Link
                  to="/forgot-password"
                  className="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>

            {/* Sign up button */}
            <button
              className="w-full bg-gray-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
              type="submit"
            >
              Sign Up
            </button>
            <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
              <p className="text-xs text-center font-semibold mx-4">OR</p>
            </div>

            {/* OAuth button */}
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
