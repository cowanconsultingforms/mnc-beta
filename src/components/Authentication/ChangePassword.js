import React, { useState, useRef, Fragment, useEffect } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { useAuth,useFirestore,useInitAuth } from "reactfire";
import { useNavigate } from 'react-router-dom';
import { Alert,Box,Button,ButtonGroup,TextField, Grid, FormControl} from '@mui/material';
import { collection, getDocs, query, where } from "firebase/firestore";

export const ChangePassword = () => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const navigate = useNavigate('');

  const auth = useAuth()
  const firestore = useFirestore()

  const usersRef = collection(firestore,'/users')
  const [users, setUsers] = useState([])

  useEffect(() => {
    const getUsers = async() => {
      const data = await getDocs(usersRef)
      setUsers(data.docs.map((doc) => ({...doc.data()})))
    }
    getUsers()
  },[])

  const update = () => {
    auth.currentUser.updatePassword(newPassword)
  }

  const reset = (e) =>{
      e.preventDefault()
      signInWithEmailAndPassword(auth, email, oldPassword)
      update()
      alert("Password updated successfully!")
  }

      
  return (
    <div className="reset-form">
      <Grid 
      container 
      alignItems="center" 
      direction="column"
      sx={{
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
        paddding: "20px",
      }}>
      <Box
        component="form"
        autoComplete
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "20px",
          paddding: "20px",
          alignItems: "center",
          borderRadius: "20px",
          backgroundColor: "#eeeeee",
          marginBottom: "30px",
          marginTop: "30px",
          width: "300px",
        }}>
        <h1>Reset Password</h1>
        <FormControl sx={{ width: '25ch'}}>
        <TextField
          id="email"
          label="Email :"
          variant="outlined"
          autocomplete="username"
          value={email}
          fullWidth={true}
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            backgroundColor: 'whitesmoke',
            fontFamily: 'Garamond'
          }}
        />
        <TextField
          id="confirmPassword"
          label="Old Password :"
          variant="outlined"
          type="password"
          value={oldPassword}
          fullWidth={true}
          autoComplete="new-password"
          margin="normal"
          onChange={(e) => setOldPassword(e.target.value)}
          sx={{
            backgroundColor: 'whitesmoke',
            fontFamily: 'Garamond'
          }}/>
        <TextField
          id="confirmPassword"
          label="New Password :"
          variant="outlined"
          type="password"
          value={newPassword}
          fullWidth={true}
          autoComplete="new-password"
          margin="normal"
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{
            backgroundColor: 'whitesmoke',
            fontFamily: 'Garamond'
          }}/>
        </FormControl>
        <br/>
        <Button
          key="Login"
          variant="contained"
          type="submit"
          sx={{ backgroundColor: "gray"}}
          onClick={reset}>
          Reset password
        </Button>
        <br/>
      </Box>
      </Grid>
    </div>
  );
};