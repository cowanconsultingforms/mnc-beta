import { Navigate, Outlet } from "react-router-dom";

import Spinner from "../components/Spinner";
import { useAuthStatus } from "../hooks/useAuthStatus";

const PrivateRoute = () => {
  const { loggedIn, checkStatus } = useAuthStatus();

  if (checkStatus) {
    return <Spinner />;
  }

  // Goes to profile if user is signed in, otherwise navigates to /sign-in
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
