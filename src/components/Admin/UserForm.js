import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

export default function AdminUserForm() {
  const methods = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <FormProvider {...methods}>
      {" "}
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <NestedInput />
        <input type="submit" />
      </form>
    </FormProvider>
  );
}

function NestedInput() {
  const { register } = useFormContext(); // retrieve all hook methods
  return <input {...register("test")} />;
}

/*Breif: React component that defines a form for entering user data in an admin panel. 
The form uses the react-hook-form library to handle form inputs and validation.

The component AdminUserForm creates a FormProvider to wrap the form and provide the useForm hook to all child components. 
It also defines an onSubmit function that logs the form data when the form is submitted.

The form contains a NestedInput component that registers an input field with the useFormContext hook to get access to the form methods. 
The input field is registered with the name "test".

When the form is submitted, the onSubmit function will be called with an object containing the form data.
The NestedInput component will contribute to the form data by registering an input field with the name "test".*/