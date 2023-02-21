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
        height="250px"
        width="175px"
        border="1px"
        style={{ padding: "10px" }}
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
        height="250px"
        width="175px"
        border="1px"
        style={{ padding: "10px" }}
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
        height="250px"
        width="175px"
        border="1px"
        style={{ padding: "10px" }}
      />
    </React.Fragment>
  );
};
export const Footer = () => {
  return (
    <Box
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
        <Grid item sx={{ alignItems: "center" }}>
          <FooterImage1 />
        </Grid>
        <Divider />
        <Grid item>
          <FooterImage3 />{" "}
        </Grid>
        <Grid item>
          <FooterImage2 />{" "}
        </Grid>
      </Grid>
      <Divider />{" "}
      <Box
        component="span"
        className="footer-bottom"
        sx={{
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
  );
};
export default Footer;

/* Breif: Defines a footer component for a web page using React and Firebase storage. 
It also uses Material-UI for UI components. 
The footer contains three images, which are loaded using useStorageDownloadURL hook from Firebase storage.

The FooterImage1, FooterImage2, and FooterImage3 components define an image each by calling the useStorageDownloadURL hook with the 
reference to the Firebase storage location of the image. 
If the status of the hook is "loading", the component displays the text "loading...". 
If the status is not "loading", the component displays the image with the URL obtained from the hook.

The Footer component defines the footer itself, which contains the three images from FooterImage1, FooterImage2, and FooterImage3 
components arranged in a row using a Grid component from Material-UI. The footer also contains text and links to contact information and disclaimers.

Responsive footer with images that are loaded dynamically from Firebase storage, allowing for easy maintenance of the images without needing to
update the web page.*/






