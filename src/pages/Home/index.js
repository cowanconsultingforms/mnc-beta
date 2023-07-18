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

  <div class="home-search-bar">
  <input type="text" placeholder="Search" class="box">
  <button class="search-icon">
    <i class="fa fa-search"></i>
  </button>
  </input>
</div>

    //useLocation hook to get current location object from the react-router-dom library
  const location = useLocation();

    //useState hook to maintain a state variable named search
  const [search, setSearch] = useState("");
    
  //async function that prevents the default behavior of an event
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
             /* alignItems: "center",
              justifyContent: "center",*/
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

/*Brief - defines a React functional component called HomePage. It imports several other components and 
libraries, such as React, Footer, HomeTop, Stack, Grid, Box, Item, useLocation, NavBar, and MNCLogo. The
component has a state for the search term, managed using the useState hook, and an event handler for handling
the search form submission, handleSearch. It also has a state for tracking whether the user is logged in, 
managed using the useState hook.

The component renders a Box component with a Grid container inside. The grid container has two items - the MNCLogo
 component and a Item component containing the HomeSearchForm component. The component also renders a Footer component.*/