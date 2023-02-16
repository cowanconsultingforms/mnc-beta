/*This code defines a functional React component called RegistrationInput 
that is meant to be used as a form input component.
 It imports various functions and components from external libraries, 
 such as react, @mui/material, and react-hook-form.*/
import { forwardRef } from "react";
import { TextField } from "@mui/material";
import {
  useController,
  useForm,
  UseControllerProps,
  useFormContext,
  Controller,
  useFieldArray,
} from "react-hook-form";

/*When the form is submitted, 
the RegistrationInput component calls the useForm and useFieldArray hooks 
from react-hook-form to create a form with an array of input fields and
 creates a onSubmit function that logs the form data to the console.*/
export const RegistrationInput = ({}) => {
  const {
    register,
    handleSubmit,
    control,
    resetField,
    field,
    formState: { errors },
  } = useForm();
  const { fields, append } = useFieldArray();
  const onSubmit = (data) => console.log(data);
  /*The component then returns a Controller component from react-hook-form, 
  which renders a TextField component from @mui/material. 
  The Controller component is used to manage the input field's state 
  and validation in a controlled way.*/
  return (
    <Controller
      onChange={(e) => e.target.value}
      onBlur={field.onBlur}
      value={field.value}
      name={field.name}
      inputRef={field.ref}
      control={TextField}
    ></Controller>
  );
};

/*The NestedInput function is a separate functional component 
that is used in the form to construct nested input fields. 
It retrieves all of the hook methods 
from the parent useForm hook using the useFormContext hook from react-hook-form and
 returns an input field with a register function that connects the field to the useForm hook.*/
function NestedInput() {
  const { register } = useFormContext(); // retrieve all hook methods
  return <input {...register("test")} />;
}

/*the RegistrationInput component is exported as the default export of this module.*/
export default RegistrationInput;


