import React, { useState, useEffect, useReducer } from "react";
import Footer from "../../components/Misc/Footer";
import HomeTop from "../../components/Home/HomeTop";
import {  Grid, Box } from "@mui/material";
import { Item } from "../../components/Admin/AdminPageComponents";
import { useLocation, Link } from "react-router-dom";
import { NavBar } from "../../components/Misc/NavBar";
import { MNCLogoGray,MNCLogo } from "../../components/Misc/MNCLogo";
import { SearchForm } from "../../components/Search/SearchForm";
import { Testing } from "../Listings/testing";


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
            paddingTop: "0px",
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
      <Testing/>
      <div><Box
      component="div"
      sx={{
        display: "flex",
        alignItems: "bottom",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Grid
        spacing={2}
        container
        component="div"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        className="home-footer"
      >
      </Grid>
      <Box
        component="span"
        className="footer-bottom"
        sx={{
          paddingTop:"65px",
          margin: "0in",
          marginBottom: ".0001pt",
          textAlign: "center",
          fontSize: "10.0pt",
          lineHeight: "2",
          marginTop: "3px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Copyright © MNC Development, Inc. 2008-present. All rights reserved.
      </Box>
      <Box
        component="span"
        sx={{
          margin: "0in",
          marginBottom: ".0001pt",
          textAlign: "center",
          fontSize: "10.0pt",
          lineHeight: "2",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
      <Box
        component="span"
        sx={{
          margin: "0in",
          marginBottom: ".0001pt",
          textAlign: "center",
          fontSize: "10.0pt",
          lineHeight: "2",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        31 Buffalo Avenue, Brooklyn, New York 11233|Phone:1-718-771-5811 or
        1-877-732-3492|Fax: 1-877-760-2763 or 1-718-771-5900{" "}
        <Link to={"/contact"}> info@mncdevelopment.com</Link>
      </Box>
      <Box
        component="span"
        sx={{
          margin: "0in",
          marginBottom: ".0001pt",
          textAlign: "center",
          fontSize: "10.0pt",
          lineHeight: "2",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        MNC Development and the MNC Development logos are trademarks of MNC
        Development, Inc.
      </Box>
      <Box
        component="span"
        sx={{
          margin: "0in",
          marginBottom: ".0001pt",
          textAlign: "center",
          fontSize: "10.0pt",
          lineHeight: "2",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        MNC Development, Inc. as a NYS licensed Real Estate Broker fully
        supports the principles of the Fair Housing Act and the Equal
        Opportunity Act. Listing information is deemed reliable, but is not
        guaranteed
      </Box>
    </Box>
    </div>
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