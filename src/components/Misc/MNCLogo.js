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

/* This code exports two React components, MNCLogo and MNCLogoGray, which render 
the MNC Development logo with different styles.

Both components use the Firebase useStorage() and useStorageDownloadURL() hooks 
to get the download URL for the logo image file stored in a Firebase Storage
 bucket. The download URL is then used as the src attribute for an <img> tag that 
 displays the logo image.

The MNCLogo component displays the logo with a full-color style, while the 
MNCLogoGray component displays a grayscale version of the logo using the grayStyle 
object.

In both components, if the download URL is still loading, the component displays 
the text "loading...".

Finally, the code exports an object with the two components as properties.

*/








