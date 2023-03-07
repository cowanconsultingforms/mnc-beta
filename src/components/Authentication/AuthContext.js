import { createContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

export const AuthContext = createContext();

export const Authfunction = ({ children}) => {

    const [user, setUser] = useState();
    const [loggedIn, setLoggedIn] = useState(false);
  
  
    const register = async (auth,registerEmail, registerPassword) => {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          registerEmail,
          registerPassword
        );
        console.log(user);
      } catch (error) {
        console.log(error.message);
      }
    };
  
    const login = async (auth, loginEmail, loginPassword) => {
      try {
        const user = await signInWithEmailAndPassword(
          auth,
          loginEmail,
          loginPassword
        );
        setLoggedIn(true);
        setUser()
      } catch (error) {
        console.log(error.message);
      }
    };
  
    
    const logout = async (auth) => {
      await signOut(auth);
    };

    return (
      <AuthContext.AuthFunctions value={{ user, setUser, loggedIn, setLoggedIn, login, register, logout }}>
        {children}
      </AuthContext.AuthFunctions>
    );
  
}