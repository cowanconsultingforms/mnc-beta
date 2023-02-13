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

/*Page Definition: "SearchPage". 
The component makes use of hooks such as useState and useLocation, as well as several
 other imported components such as Footer, HomeTop, Grid, Box, Item, NavBar, MNCLogoGray, and MNCLogo.

The component has a search state, initialized using the useState hook with an empty string as its initial 
value. The component also contains a function named handleSearch, which is triggered by the form submit 
event and prevents the default behavior of the form.

The component also has a loggedIn state initialized using the useState hook with an empty object as its initial value.

The component renders a Box component which acts as the main container for the page, and has a Grid component inside of
 it which creates a grid layout. The SearchForm component is also rendered within the Grid component. The Footer component
  is also rendered at the end.*/