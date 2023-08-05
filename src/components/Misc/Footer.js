import React, { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { Link } from "react-router-dom";
import { Box, Grid, Stack, Divider, Paper } from "@mui/material";
import { useStorage, useStorageDownloadURL } from "reactfire";
export const FooterImage1 = () => {
  const storage = useStorage();
  const image1 = ref(
    storage,
    "gs://mnc-development.appspot.com/images/mncthumbnail1.jpg"
  );
  const { status, data: imageURL } = useStorageDownloadURL(image1);
  if (status === "loading") {
    return <span>loading...</span>;
  }
  return (
    <React.Fragment>
      <img
        src={imageURL}
        alt="i1"
        height="220px"
        width="320px"
        
        style={{ padding: "10px", border: "1px solid #ccc", // Adding a light grey border
        boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)",
       }}
      ></img>
    </React.Fragment>
  );
};
export const FooterImage2 = () => {
  const storage = useStorage();
  const image1 = ref(
    storage,
    "gs://mnc-development.appspot.com/images/mncthumbnail2.jpg"
  );
  const { status, data: imageURL } = useStorageDownloadURL(image1);

  if (status === "loading") {
    return <span>loading...</span>;
  }
  return (
    <React.Fragment>
      <img
        src={imageURL}
        alt="i2"
        height="220px"
        width="320px"
      
        style={{ padding: "10px", boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)" ,border: "1px solid #ccc" // Adding a light grey border
      }}
      />
    </React.Fragment>
  );
};
export const FooterImage3 = () => {
  const storage = useStorage();
  const image1 = ref(
    storage,
    "gs://mnc-development.appspot.com/images/mncthumbnail3.jpg"
  );
  const { status, data: imageURL } = useStorageDownloadURL(image1);
  if (status === "loading") {
    return <span>loading...</span>;
  }
  return (
    <React.Fragment>
      <img
        src={imageURL}
        alt="i2"
        height="220px"
        width="320px"
        
        style={{ padding: "10px", border: "1px solid #ccc", // Adding a light grey border
        boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)" }}
      />
    </React.Fragment>
  );
};
export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#fff", // Dark background color
        color: "##333", // White text color
        padding: "40px 0",
        textAlign: "center",
        fontSize: "10.0pt",
        lineHeight: "1.6",
        
      }}
    >
     <FooterImagesRow />
      <Divider sx={{ margin: "20px 0", borderColor: "#555" }} />
      <Box
        component="span"
        sx={{
          marginBottom: "10px",
        }}
      >
        © MNC Development, Inc. 2008-present. All rights reserved.
      </Box>
      <Box
        component="span"
        sx={{
          marginBottom: "10px" ,
        }}
      >
        31 Buffalo Avenue, Brooklyn, New York 11233 | Phone: 1-718-771-5811 or
        1-877-732-3492 | Fax: 1-877-760-2763 or 1-718-771-5900{" "}
        <Link to={"/contact"} style={{ color: "#333" }}>
          info@mncdevelopment.com  
        </Link>
      </Box>
      <Box
        component="span"
        sx={{
          marginBottom: "10px",
        }}
      >
        MNC Development and the MNC Development logos are trademarks of MNC
        Development, Inc.
      </Box>
      <Box
        component="span"
        sx={{
          marginBottom: "10px", 
          marginright: "10px",
        }}
      >
        MNC Development, Inc. as a NYS licensed Real Estate Broker fully
        supports the principles of the Fair Housing Act and the Equal
        Opportunity Act. Listing information is deemed reliable, but is not
        guaranteed.
      </Box>
    </Box>
  );
};

const FooterImagesRow = () => {
  return (
    <Grid
      container
      component="div"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      <Grid item>
        <FooterImage1 />
      </Grid>
      
     
      <Grid item>
        <FooterImage3 />
      </Grid>
      <Grid item>
        <FooterImage2 />
      </Grid>
    </Grid>
  );
};

export default Footer;





