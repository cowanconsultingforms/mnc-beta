import { Alert, Box, Stack,Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useAuth, useUser } from "reactfire";
import { sendPasswordResetEmail } from "firebase/auth";
import { TextInput } from "../../components/Misc/constants";
import { FormatColorFillRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/Authentication/RegisterForm";

//fetches current user info with the hook useUser - sets email use useState function from authentication
export const ResetPasswordPage = () =>{
    const {status,data:user} = useUser();
    const [email,setEmail] = useState('');
    const auth = useAuth();
    const pwRef = useRef();
    const navigate = useNavigate()
    const handleSubmit = async(e) =>{
        e.preventDefault()
    if(email){
        sendPasswordResetEmail(auth,email,)
    }
    }
    const checkCurrentUser = async() =>{
        if(status!== "error" && status!=="success"  ){
            return setTimeout(<Alert typeof="warning">Currently Logged in as {auth.currentUser}  - If you forgot your password, change it from profile page.</Alert>,3000).then(()=>{
                navigate('/profile')
            })
        }else if(status!== "error" && status!== "loading"){
            console.log(user.displayName);
        }
    }
    //handles Password Change
    const handlePasswordChange = async(e)=>{
        e.preventDefault();
        if(user === auth.currentUser){
            return <Button type="submit" onClick={handleSubmit}>Click here and check email to reset password </Button>
        }
        
    }
    useEffect(()=>{
        checkCurrentUser().then((res)=>{
            if(res !==user){
               return <RegisterForm />
            }
        })
    })
    return(
        <Box className="reset-password" component="div" >
        <Stack direction="column" ref={pwRef} >
        <TextInput handleSubmit={handlePasswordChange}  type="submit" value={email} ref={pwRef} />
        </Stack>
        </Box>
        )
}

export default ResetPasswordPage;

/*defines a reset password page 
exports a functional component ResetPasswordPage that is used for resetting the password of a user.
 It makes use of the useUser and useAuth hooks from reactfire to retrieve information about the current 
 user and the authentication instance. The component checks whether the user is currently logged in and if so, 
 it displays a warning message that the user should change their password from the profile page. If the user is
  not logged in, the component allows them to input their email address and sends a password reset email to that 
  address. The component also includes a RegisterForm component that is used to register a new user.*/
