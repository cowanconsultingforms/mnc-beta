import { GoogleAuthProvider } from "firebase/auth";
import { useAuth } from "reactfire";

export const signInWithGoogle = () => {
  const auth = useAuth();
};


/*Breif: Imports the GoogleAuthProvider class from the firebase/auth module, 
which is a utility provided by the Firebase Authentication SDK to authenticate users with Google.

The useAuth() function from reactfire is also imported, 
which is a React hook that returns the auth instance provided by the FirebaseAppProvider component.

The signInWithGoogle() function does not actually perform the sign-in action,
but only initializes the auth instance by calling the useAuth() hook. Once the auth instance is obtained,
it can be used to sign in with Google by calling the signInWithPopup() method with the GoogleAuthProvider instance as a parameter.*/

//Issues: In order to actually sign in with Google, 
//the signInWithGoogle() function needs to be extended to include the logic for handling the authentication process. 2-15-23



