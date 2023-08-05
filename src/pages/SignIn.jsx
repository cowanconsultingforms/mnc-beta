import SignInBackgroundImage from "../assets/img/sign-in-background.jpg";
import { useState } from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";

const SignIn = () => {
  // Hook to show/hide password text
  const [showPassword, setShowPassword] = useState(false);

  // Sets email and password forms to be empty on default
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  // Update text when typing in form data
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Redirects user to homepage if sign in is successful, shows error message otherwise
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredentials.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Invalid user credentials.");
    }
  };

  return (
    <section
      className="object-cover h-[calc(100vh-48px)]"
      style={{
        backgroundImage: `url(${SignInBackgroundImage})`,
      }}
    >
      <h1 className="text-3xl text-center py-12 font-bold">Sign In</h1>
      <div className="flex justify-center items-center mx-auto">
        <div className="max-w-md w-full mx-auto bg-gray-100 rounded px-6 py-6">
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

            <div className="relative mb-6">
              {/* Password form box */}
              <input
                // className="w-full text-lg px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
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

            {/* Sign in button */}
            <button
              className="w-full bg-gray-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
              type="submit"
            >
              Sign in
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

export default SignIn;
