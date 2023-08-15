import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "../components/Spinner";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

const RoleAssign = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const fetchListings = async () => {
      // Get user info from firestore database
      const userRef = collection(db, "users");
      const userQuery = query(
        userRef,
        where(documentId(), "==", auth.currentUser.uid)
      );
      const user = [];
      const userSnap = await getDocs(userQuery);
      userSnap.forEach((doc) => {
        return user.push(doc.data());
      });
      console.log(user);

      //if user has admin role, set admin to true
      if (user[0]?.roles.includes("admin")) {
        setIsAdmin(true);
      }
    };
  }, []);
  return (
    <div>
      {isAdmin ? (
        <div>
          <h1>Admin</h1>
        </div>
      ) : (
        <div>
          <h1>Not Admin</h1>
        </div>
      )}
    </div>
  );
};

export default RoleAssign;
