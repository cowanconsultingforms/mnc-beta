import React, { useState } from "react";
import { getDownloadURL, ref as reff } from "firebase/storage";

import { FirebaseStorage, ref } from "firebase/storage";
import { getDocs, collection } from "firebase/firestore";
import { useAuth, useFirestore, useStorage, useStorageDownloadURL } from "reactfire";

//components used to render the logo on various pages. 



const style = {
  alignItems: "center",
  justifyContent: "center",
  padding: "100px",
};

 export const Adminbg = () => {
  const storage = useStorage();
  const image1= reff(storage,
 "gs://mnc-development.appspot.com/images/admin3.jpg"
  );
  const { status, data: imageURL } = useStorageDownloadURL(image1);

  if (status === "loading") {
    return <span>loading...</span>;
  }

  return (
    <React.Fragment>
    <div style={{ 
  backgroundImage: `url(${imageURL})`, 
  backgroundAttachment: "fixed",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "250vh",
  width: "100vw",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: -1
}}>
</div>
    </React.Fragment>
  );
};


export default {Adminbg};

/* Breif: Defines two React functional components MNCLogo and MNCLogoGray that render an image logo on a webpage. 
The logos are retrieved from a Firebase storage bucket using useStorage() and useStorageDownloadURL() hooks from the reactfire library.

The MNCLogo component renders a full-color logo image while the MNCLogoGray component renders a grayscale logo image. 
Both components display a "loading..." message while the image is being retrieved from the Firebase storage.

The style and grayStyle objects define some styling for the logos, such as centering them and setting their padding.

Components are exported using export statements, and are also exported as the default export of the module using export default.*/








