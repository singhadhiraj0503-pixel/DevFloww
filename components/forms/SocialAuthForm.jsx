"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
// import { signIn } from "@/auth";
import Routes from "@/constants/routes";

const SocialAuthForm = () => {
  const handleSignIn = async (provider) => {
    console.log("provior: ", provider);
    try {
      await signIn(provider, {
        callbackUrl: Routes.Home,
        // redirect: false,
      });
    } catch (error) {
      console.log(error);
      toast("Sign in Failed");
    }
  };

  return (
    <div className="w-full mt-8 flex gap-5">
      <Button
        onClick={() => {
          handleSignIn("github");
        }}
        className=" rounded active:scale-95 cursor-pointer"
      >
        <Image
          src="/icons/github.svg"
          width={20}
          height={20}
          alt="github logo"
          className="invert object-center object-contain"
        />
        <span className="font-bold">Login with GitHub</span>
      </Button>

      <Button
        onClick={() => {
          handleSignIn("google");
        }}
        className="rounded active:scale-95 cursor-pointer"
      >
        <Image
          src="/icons/google.svg"
          width={20}
          height={20}
          alt="github logo"
          className="object-center object-contain"
        />
        <span className="font-bold">Login with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
