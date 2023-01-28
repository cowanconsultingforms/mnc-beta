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
