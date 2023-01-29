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
