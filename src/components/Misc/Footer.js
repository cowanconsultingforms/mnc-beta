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
