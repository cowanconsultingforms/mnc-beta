
import React, { useState, useRef, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import MNCLogo from "../Misc/MNCLogo";

export const HomeTop = () => {
 
  return (
    <Fragment>
      {" "}
      <MNCLogo id="logo"  />
      {""}
    </Fragment>
  );
};

export default HomeTop;

/*Breif: Defines a React functional component called HomeTop that returns some JSX code to be rendered on the web page.

HomeTop returns a Fragment element that contains a custom MNCLogo component. 
The MNCLogo component is imported from a file located at "../Misc/MNCLogo.js".

The HomeTop component does not use any state or props passed down from a parent component, but it does import the useNavigate hook 
from the react-router-dom library, which may be used elsewhere in the application for navigation purposes.

Component is exported as both a named export (HomeTop) and a default export, which allows it to be imported and used in other parts of the application.*/