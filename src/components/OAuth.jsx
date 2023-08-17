import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { RiGoogleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { db } from "../firebase";

// OAuth (Sign in with google) component
const OAuth = () => {
  const navigate = useNavigate();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user is already in database
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // If user is not in database, add them to it
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
          role: "user",
        });
      }

      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google.");
    }
  };

  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="flex items-center justify-center w-full bg-gray-600 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-gray-700 active:bg-gray-800 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded  "
    >
      <RiGoogleFill className="text-gray-500 text-2xl bg-white rounded-full mr-2" />
      Continue with Google
    </button>
  );
};

export default OAuth;
