import { Outlet, Navigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "../components/Spinner";

const PrivateRoute = () => {
  const { loggedIn, checkStatus } = useAuthStatus();
  if (checkStatus) {
    return <Spinner />;
  }

  // Goes to profile if user is signed in, otherwise navigates to /sign-in
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
