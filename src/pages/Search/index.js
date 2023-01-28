import React, { useState, useEffect, useReducer } from "react";
import Footer from "../../components/Misc/Footer";
import HomeTop from "../../components/Home/HomeTop";
import {  Grid, Box } from "@mui/material";
import { Item } from "../../components/Admin/AdminPageComponents";
import { useLocation } from "react-router-dom";
import { NavBar } from "../../components/Misc/NavBar";
import { MNCLogoGray,MNCLogo } from "../../components/Misc/MNCLogo";
import { SearchForm } from "../../components/Search/SearchForm";


export const SearchPage = (props) => {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const handleSearch = async (e) => {
    e.preventDefault();
  };
  const [loggedIn, setLoggedIn] = useState({});
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
          <SearchForm />
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
 
          <Item
            sx={{
              alignItems: "center",
              justifyContent: "center",
              width: "70",
              display: "flex",
            }}
          >
   
          </Item>
        </Grid>
      </Grid>
      <Footer className="footer" />
    </Box>
  );
};

export default SearchPage;
