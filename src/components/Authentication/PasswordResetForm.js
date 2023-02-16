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

/*Breif: Component exports a form to send a password reset email to the currently signed-in user using Firebase Authentication.
It uses the sendPasswordResetEmail function from firebase/auth to send the password reset email.

The component imports several hooks from reactfire and react-router-dom. 
It also imports getRedirectResult from firebase/auth, which is not used in the code.

The form has an input for the user to enter their email address, and a submit button. 
When the user clicks the submit button, the handleSubmit function is called, which prevents the default form submission, 
and calls the sendPasswordResetEmail function with the user's email address.

The component also has a useEffect hook that updates the email state when the status or signInCheckResult props change.
 It sets the email to the currently signed-in user's email address when the status is "success", and redirects 
 to another page if the status is not "success". However, the redirect code is missing, so it does not actually redirect.*/

//Issues: the setTimeout function in handleSubmit will not work as intended. 
//The setTimeout function expects a function to be called after a specified delay, but in this code, it is returning a JSX element,
// which will not be rendered to the page. - 2-15-23