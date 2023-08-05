import signInBackgroundImage from "../assets/img/sign-in-background.jpg";
import { useState } from "react";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  // Sets email form to be empty on default
  const [email, setEmail] = useState("");

  // Updates text when typing in email data
  const onChange = (e) => {
    setEmail(e.target.value);
  };

  // If email exists in firestore database, sends reset email
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent!");
    } catch (error) {
      toast.error("Could not send reset email.");
    }
  };

  return (
    <section
      className="object-cover h-[calc(100vh-48px)]"
      style={{
        backgroundImage: `url(${signInBackgroundImage})`,
      }}
    >
      <h1 className="text-3xl text-center py-12 font-bold">Forgot Password?</h1>
      <div className="flex justify-center flex-wrap items-center mx-auto">
        <div className="max-w-md w-full bg-gray-100 rounded px-6 py-6">
          <form onSubmit={onSubmit}>
            {/* Email form box */}
            <input
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-white shadow-md rounded transition duration-150 ease-in-out focus:shadow-lg focus:text-gray-700 focus:bg-white focus:border-gray-300 mb-6"
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email address"
            />
            <div className="flex justify-between whitespace-nowrap text-sm">
              {/* Sign Up button */}
              <p className="mb-6">
                Don't have an account?
                <Link
                  to="/sign-up"
                  className="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out ml-1"
                >
                  Register
                </Link>
              </p>

              {/* Sign in button */}
              <p>
                <Link
                  to="/sign-in"
                  className="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out"
                >
                  Sign in instead
                </Link>
              </p>
            </div>

            {/* Send reset Email button */}
            <button
              className="w-full bg-gray-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
              type="submit"
            >
              Send reset Email
            </button>
            <div className="flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
              <p className="text-xs text-center font-semibold mx-4">OR</p>
            </div>

            {/* OAuth buttton */}
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
