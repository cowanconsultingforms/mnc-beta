import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/signup.css";

import SignInBackgroundImage from "../assets/img/sign-in-background.jpg";
import OAuth from "../components/OAuth";
import { db } from "../firebase";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    requestStatus: "completed",
    isTopAgent: "false",
    expirationDate: null,
  });
  const { name, email, password } = formData;
  const [isTenant, setIsTenant] = useState(false);
  const navigate = useNavigate();

  // Update text when typing in form data
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Function to send email for tenant application
  const sendEmail = async () => {
    const subject = "New Tenant Application";
    const to = "team@mncdevelopment.com";
    const message = `User with email ${email} wants to become a tenant.\n\nThank You\nTeam MNC Development`;

    try {
      const response = await fetch(
        "https://us-central1-mnc-development.cloudfunctions.net/contactUs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ to, message, subject }),
        }
      );
      if (!response.ok) throw new Error("Failed to send email.");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Add new account to authenticated users and Firestore database
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      const user = userCredentials.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      // Save user info to Firestore
      await setDoc(doc(db, "users", user.uid), formDataCopy);

      if (isTenant) {
        await sendEmail();
      }

      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with the registration.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <section
        className="flex-grow object-cover min-h-[calc(100vh-48px)] pb-12"
        style={{
          backgroundImage: `url(${SignInBackgroundImage})`,
          backgroundSize: "cover",
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

              {/* Tenant checkbox */}
              <div className="mb-4">
                <h1>Are you a tenant?</h1>
                <label className="mr-4">
                  <input
                    type="checkbox"
                    checked={isTenant}
                    onChange={() => setIsTenant(!isTenant)}
                  />{" "}
                  Yes
                </label>
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

            {/* Links for sign in and forgot password */}
            <div className="flex justify-between whitespace-nowrap text-sm mt-4">
              <p className="mb-6">
                Have an account?
                <Link
                  to="/sign-in"
                  className="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out ml-1"
                >
                  Sign in
                </Link>
              </p>

              <p>
                <Link
                  to="/forgot-password"
                  className="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto justify-center items-center text-center mx-3 flex flex-col max-w-6xl lg:mx-auto p-3 rounded shadow-lg bg-transparent text-white">
        <p className="text-black" style={{ fontSize: "0.9rem" }}>info@mncdevelopment.com</p>
        <div className="lg:flex lg:flex-row lg:justify-center lg:items-center lg:space-x-2">
          <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
            <p className="text-black" style={{ fontSize: "0.9rem" }}>All rights reserved.</p>
            <span className="hidden md:block">|</span>
            <p className="text-black" style={{ fontSize: "0.9rem" }}>© MNC Development, Inc. 2008-present.</p>
          </div>
          <span className="hidden lg:block">|</span>
          <p className="text-black" style={{ fontSize: "0.9rem" }}>31 Buffalo Avenue, Brooklyn, New York 11233</p>
        </div>
        <div className="md:flex md:flex-row md:justify-center md:items-center md:space-x-2">
          <p className="text-black" style={{ fontSize: "0.9rem" }}>Phone: 1-718-771-5811 or 1-877-732-3492</p>
          <span className="hidden md:block">|</span>
          <p className="text-black" style={{ fontSize: "0.9rem" }}>Fax: 1-877-760-2763 or 1-718-771-5900</p>
        </div>
        <p className="text-center text-black" style={{ fontSize: "0.8rem" }}>
          MNC Development and the MNC Development logos are trademarks of MNC Development, Inc. MNC Development, Inc. as a NYS licensed Real Estate Broker fully supports the principles of the Fair Housing Act and the Equal Opportunity Act. Listing information is deemed reliable, but is not guaranteed.
        </p>
      </footer>
    </div>
  );
};

export default SignUp;