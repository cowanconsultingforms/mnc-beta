import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import SignOutBox from "../../components/Account/SignOutBox";

import {ProfileChange} from "../../components/Account/ProfileChange";
import ChangePassword from "../../components/Account/ChangePassword";
import { useFirestore,useUser } from "reactfire";
import { useAuth } from "reactfire";
//This is white
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light" ? "rgb(255 255 255)" : "rgb(255 255 225)",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
//This is gray item box, if need be. We can mix and match both
const Item2 = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgb(196 196 196)" : "rgb(196 196 196)",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  
}));

//need a profile edit component/form
//needs a component to display the profile automatically upon loading
export const AccountPage = (props) => {
  const { role,email,userName } = props;
  const location = useLocation();
  const { status, data: user } = useAuth();
  const firestore = useFirestore();
  useEffect(() => {
    if (status === 'success') {
      
    }
  })

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={0.001}>
        <Grid item xs={9}>
          <Item sx={{ height: 120, width: 1444 }}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: "Garamond",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "50px",
              }}
            >
              Edit Profile
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item sx={{ height: 540, width: 1444 }}>
            <Grid container spacing={5}>
              <Grid item xs={6}>
                  <ProfileChange role={props.role} userName={props.userName} email={props.email}></ProfileChange>
                
              </Grid>
              <Grid item xs={4}>
                <SignOutBox></SignOutBox>
                <ChangePassword></ChangePassword>
                
              </Grid>
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountPage;
