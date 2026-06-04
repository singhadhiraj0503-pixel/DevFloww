"use client";

import React from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";

export const Form = FormProvider;

const FormFieldContext = React.createContext({});

export function FormField({ ...props }) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    name: fieldContext.name,
    ...fieldState,
  };
}

export function FormItem({ className = "", ...props }) {
  return <div className={`space-y-2 ${className}`} {...props} />;
}

export function FormLabel({ className = "", ...props }) {
  return <label className={`text-sm font-medium ${className}`} {...props} />;
}

export function FormControl({ children }) {
  return children;
}

export function FormDescription({ className = "", ...props }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props} />
  );
}

export function FormMessage({ className = "" }) {
  const { error } = useFormField();

  if (!error) return null;

  return <p className={`text-sm text-red-500 ${className}`}>{error.message}</p>;
}
