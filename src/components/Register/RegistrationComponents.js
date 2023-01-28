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

export const RegistrationInput = ({ control, onSubmit, register }) => {
  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm();
  const { fields, append } = useFieldArray();
  const onSubmit = (data) => console.log(data);
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

function NestedInput() {
  const { register } = useFormContext(); // retrieve all hook methods
  return <input {...register("test")} />;
}

export default RegistrationInput;
