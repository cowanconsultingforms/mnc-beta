import { sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuth, useSigninCheck, useUser } from "reactfire";
import { getRedirectResult } from "firebase/auth";
import { Outlet } from "react-router-dom";
export const PasswordRessetForm = () => {
  const { status, data: signInCheckResult } = useSigninCheck();
  const { user } = useUser();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, signInCheckResult.user.email).then(
      setTimeout(() => <Alert type="success"> Email send to user</Alert>)
    );
  };
  useEffect(() => {
    if (status === "success") {
      setEmail(signInCheckResult.user.email);
    } else {
      Redirec;
    }
  });
};

export default PasswordRessetForm;
