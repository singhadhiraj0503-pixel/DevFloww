import SocialAuthForm from "@/components/forms/SocialAuthForm";
import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <main
      className="w-full h-screen  bg-[url('/images/auth-dark.png')]
    bg-cover
    bg-center
    bg-no-repeat flex items-center justify-center"
    >
      <section className="bg-gray-800 p-6 rounded">
        <div className="flex justify-between gap-15">
          <div>
            <h1 className="text-2xl font-bold">
              Join Dev<span className="text-orange-500">Floww</span>
            </h1>
            <p className="opacity-70">To get your question answered</p>
          </div>
          <div>
            <Image
              src="/images/site-logo.svg"
              width={42}
              height={42}
              alt="Site-logo"
            />
          </div>
        </div>
        {children}
        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;
