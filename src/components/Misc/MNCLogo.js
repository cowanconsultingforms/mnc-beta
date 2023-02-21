import React, { useState } from "react";
import { getDownloadURL, ref as reff } from "firebase/storage";
import { useStorage, useStorageDownloadURL } from "reactfire";
//components used to render the logo on various pages. 
const style = {
  alignItems: "center",
  justifyContent: "center",
  padding: "100px",
};
export const MNCLogo = () => {
  const storage = useStorage();
  const logoRef = reff(
    storage,
    "gs://mnc-development.appspot.com/images/mncdevelopmentlogo.jpg"
  );
  const { status, data: imageURL } = useStorageDownloadURL(logoRef);

  if (status === "loading") {
    return <span>loading...</span>;
  }

  return (
    <React.Fragment>
      <img src={imageURL} alt="logo" id="logo" sx={{style}} />
    </React.Fragment>
  );
};
const grayStyle = {
  alignItems: "center",
  justifyContent: "center",
  padding: "100px",
};
export const MNCLogoGray = () => {
  const storage = useStorage();
  const logoRef = reff(
    storage,
    "gs://mnc-development.appspot.com/images/mncdevelopmentlogoAdjusted.jpg"
  );
  const { status, data: imageURL } = useStorageDownloadURL(logoRef);

  if (status === "loading") {
    return <span>loading...</span>;
  }

  return (
    <React.Fragment>
      <img src={imageURL} alt="logo" id="logo" sx={{ grayStyle }} />
    </React.Fragment>
  );
};
export default {MNCLogo,MNCLogoGray};

/* Breif: Defines two React functional components MNCLogo and MNCLogoGray that render an image logo on a webpage. 
The logos are retrieved from a Firebase storage bucket using useStorage() and useStorageDownloadURL() hooks from the reactfire library.

The MNCLogo component renders a full-color logo image while the MNCLogoGray component renders a grayscale logo image. 
Both components display a "loading..." message while the image is being retrieved from the Firebase storage.

The style and grayStyle objects define some styling for the logos, such as centering them and setting their padding.

Components are exported using export statements, and are also exported as the default export of the module using export default.*/








