import React, { useState, useEffect, useReducer } from "react";
import Footer from "../../components/Misc/Footer";
import HomeTop from "../../components/Home/HomeTop";
import { Stack, Grid, Box } from "@mui/material";
import { Item } from "../../components/Admin/AdminPageComponents";
import { useLocation } from "react-router-dom";
import { NavBar } from "../../components/Misc/NavBar";
import { MNCLogo } from "../../components/Misc/MNCLogo";
import { HomeSearchForm } from "../../components/Home/HomeSearchForm";

//actions needed to finish HomePage
//needs to be styled and modularized into a logo and search bar , and a footer underneath

export const HomePage = (props) => {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const handleSearch = async (e) => {
    e.preventDefault();
  };
  const [loggedIn, setLoggedIn] = useState(null);
  return (
    <Box component="div" direction="column" className="home__page">
      <Grid
        container={true}
        columns={12}
        rowSpacing={0}
        gridAutoRows
        sx={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Grid
          item
          sx={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            paddingTop: "150px",
          }}
        >
          <MNCLogo />
          <Item
            sx={{
              alignItems: "center",
              justifyContent: "center",
              width: "70",
              display: "flex",
            }}
          >
            <HomeSearchForm/>
          </Item>
        </Grid>
      </Grid>
      <Footer className="footer" />
    </Box>
  );
};

export default HomePage;
