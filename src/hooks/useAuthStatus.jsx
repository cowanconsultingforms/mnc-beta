import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

// Hook that determines whether user is logged in or not
const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkStatus, setCheckStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    // If user is authenticated, loggedIn set to true
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckStatus(false); // Setting checkStatus to false stops loading
    });
  }, []);
  return { loggedIn, checkStatus };
};

export { useAuthStatus };
