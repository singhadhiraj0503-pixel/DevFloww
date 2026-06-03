import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Routes from "@/constants/routes";
import React from "react";

const page = async () => {
  const session = await auth();
  console.log(session);

  return (
    <div>
      <h1 className="text-2xl">Welcome to NextJS</h1>

      <form
        className="mt-10 ml-5"
        action={async () => {
          "use server";

          await signOut({ redirectTo: Routes.Sign_in });
        }}
      >
        {/* <Button className="rounded active:scale-95 cursor-pointer">
          Log out
        </Button> */}
      </form>
    </div>
  );
};

export default page;
