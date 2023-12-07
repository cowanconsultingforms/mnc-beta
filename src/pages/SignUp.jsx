import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile, 
} from "firebase/auth";
import { doc, serverTimestamp , setDoc } from "firebase/firestore";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import SignInBackgroundImage from "../assets/img/sign-in-background.jpg";
import OAuth from "../components/OAuth";
import { db } from "../firebase";
import emailjs from "@emailjs/browser";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    requestStatus: "completed",
  });
  const navigate = useNavigate();
  const { name, email, password } = formData;
  const [isTenant, setIsTenant] = useState(false);
  const [sent, setSent] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsTenant(e.target.checked);
  };

  const handleSent =()=>{
    setSent(!sent);
  }
  const sendEmail = async() => {
    // Send the form data to the server
    const subject = "New Tenant Application";
    const to = "team@mncdevelopment.com";
   
    const message = `User with email ${email} wants to become a tenant.`;

    try {
      const response = await fetch('https://us-central1-mnc-development.cloudfunctions.net/contactUs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, message, subject }),
      });
  
      if (response.ok) {
        console.log('Email sent successfully');
      } else {
        console.error('Failed to send email', response);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // Update text when typing in form data
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

      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp(); 
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      await sendEmail();
      navigate("/");
    } catch (error) {
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
              <h1>Are you a tenant?</h1>
              <label>
                <input
                  type="checkbox"
                  checked={isTenant}
                  onChange={handleCheckboxChange}
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={!isTenant}
                  onChange={(e) => setIsTenant(!e.target.checked)}
                />{" "}
                No
              </label>
              <p>You are a {isTenant ? "tenant." : "not a tenant."}</p>
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
            onClick={handleSent}
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
