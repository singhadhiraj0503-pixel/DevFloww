"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import Link from "next/link";
import Routes from "@/constants/routes";

// const formSchema = z.object({
//   title: z
//     .string()
//     .min(5, "Bug title must be at least 5 characters.")
//     .max(32, "Bug title must be at most 32 characters."),
//   description: z
//     .string()
//     .min(20, "Description must be at least 20 characters.")
//     .max(100, "Description must be at most 100 characters."),
// });

const AuthForm = ({ formType, schema, defaultValues, onSubmit }) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const handleSubmit = async () => {};

  const buttonText = formType === "SIGN_IN" ? "Sign-In" : "Sign-Up";

  return (
    <Card className="w-full mt-5 sm:max-w-md rounded">
      <CardHeader>{/* <CardTitle>Sign-In Form</CardTitle> */}</CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={handleSubmit}>
          {Object.keys(defaultValues).map((field) => {
            return (
              <FieldGroup className="mb-5" key={field}>
                <Controller
                  name={field}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        {field.name === "email" ? "Email Address" : field.name}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-title"
                        className="rounded outline-none"
                        // aria-invalid={fieldState.invalid}
                        placeholder={
                          field.name === "password" ? "password" : field.name
                        }
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            );
          })}
        </form>
      </CardContent>
      <CardFooter>
        <Field className="w-full flex flex-col" orientation="horizontal">
          <div className="w-full flex justify-center gap-10">
            <Button
              className="bg-gray-700 text-white font-bold rounded active:scale-95"
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              className="bg-orange-500 text-white font-bold rounded active:scale-95"
              type="submit"
              form="form-rhf-demo"
            >
              Submit
            </Button>
          </div>
          <div>
            {formType === "SIGN_IN" ? (
              <p className="mt-2">
                Dont have an account?{" "}
                <Link
                  className="italic underline text-orange-500"
                  href={Routes.Sign_up}
                >
                  Sign-up
                </Link>
              </p>
            ) : (
              <p className="mt-2">
                Already have an account?{" "}
                <Link
                  className="italic underline text-orange-500"
                  href={Routes.Sign_in}
                >
                  Sign-in
                </Link>
              </p>
            )}
          </div>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
