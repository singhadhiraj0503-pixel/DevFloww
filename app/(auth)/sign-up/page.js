"use client";

import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { SignUpSchema } from "@/lib/validation";
import React from "react";
import { promise, success } from "zod";

const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={signUpWithCredentials}
    />
  );
};

export default SignUp;
