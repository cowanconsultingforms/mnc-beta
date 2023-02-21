import React from "react";
//import { TextField } from "@mui/material";

import { useState, useEffect } from "react";

export const Input = (props) => {
  const [value, setValue] = useState(props.value || "");
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <input
      name={props.name}
      onChange={(e) => {
        setValue(e.target.value);
        props.onChange && props.onChange(e.target.value);
      }}
      value={value}
    />
  );
};
export default { Input };

/* Breif: Exports a custom component called Input which is a wrapper around the HTML input element. 
The component takes in props such as name, value, and onChange to customize the behavior of the input field.

The useState hook is used to create a value state variable and the initial value is either the value passed in the props or an empty string. 
The useEffect hook is used to update the state variable when the props.value changes.

The Input component renders an input element with the name and value props passed in. 
The onChange prop is used to update the state variable value with the current input value and then the props.
onChange callback function is called with the current input value as an argument (if it exists).

The component is exported as an object with the key Input using ES6 shorthand syntax.*/

