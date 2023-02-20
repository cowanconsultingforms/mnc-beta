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

/* This code defines a React component called Input, which renders an <input> 
element and provides a two-way binding between the input value and the component's
 state.

The component takes in several props, including a name prop, a value prop, and an 
optional onChange callback function. The value prop is used to set the initial 
value of the input, and is also used to update the input's value whenever the 
prop changes.

The useState hook is used to define a local state variable value, 
which holds the current value of the input. The useEffect hook is used to update 
the state variable value whenever the props.value changes.

The component returns an <input> element, which is bound to the local value state 
variable using the value prop. When the input value changes, the onChange callback 
function is called (if it exists), which updates the local value state variable 
using the setValue function. The onChange function is also called with the new 
value of the input as an argument, allowing parent components to respond to 
changes in the input's value.

Finally, the component is exported as both a named export (Input) and a default 
export ({ Input }).

*/

