import React from "react";
import NavLinks from "./navbar/NavLinks";
import Link from "next/link";
import { Button } from "../ui/button";
import Routes from "@/constants/routes";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

const LeftSidebar = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    // <section className="h-screen bg-gray-900 flex flex-col justify-between overflow-y-auto border-r p-4 pt-22 max-sm:hidden">
    //   <div className="flex flex-col">
    //     <NavLinks />
    //     <div className="w-full flex flex-col mt-3 gap-5">
    //       <Link href={Routes.Sign_in}>
    //         <Image
    //           src="icons/account.svg"
    //           width={20}
    //           height={20}
    //           alt="Account"
    //           className="invert-colors lg:hidden"
    //         />
    //         <Button
    //           asChild
    //           className="w-full bg-black py-2 text-orange-500 font-bold border-none rounded active:scale-95 max-lg:hidden"
    //         >
    //           Log In
    //         </Button>
    //       </Link>

    //       <Link href={Routes.Sign_up}>
    //         <Image
    //           src="icons/sign-up.svg"
    //           width={20}
    //           height={20}
    //           alt="Account"
    //           className="invert-colors lg:hidden"
    //         />
    //         <Button
    //           asChild
    //           className="w-full bg-gray-600 text-white font-bold border-none rounded active:scale-95 max-lg:hidden"
    //         >
    //           Sign Up
    //         </Button>
    //       </Link>
    //     </div>
    //   </div>
    // </section>

    // <section className="h-screen bg-gray-900 flex flex-col justify-between border-r p-4 pt-22 max-sm:hidden">
    <section
      className="
    sticky
    top-[80px]
    h-[calc(100vh-80px)]
    bg-gray-900
    border-r
    p-4
    flex
    flex-col
    justify-between
    overflow-y-auto
    max-sm:hidden
  "
    >
      <NavLinks userId={userId} />

      <div className="flex flex-col gap-3">
        {userId ? (
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <Button
              type="submit"
              className="hidden lg:flex gap-3 w-full bg-black text-orange-500 font-bold text-md p-5 rounded cursor-pointer active:scale-95"
            >
              <LogOut size={40} />
              <span>Logout</span>
            </Button>
          </form>
        ) : (
          <>
            {/* Mobile Login Icon */}
            <Link
              href={Routes.Sign_in}
              className="flex lg:hidden items-center justify-center"
            >
              <Image
                src="/icons/account.svg"
                width={24}
                height={24}
                alt="Login"
                className=""
              />
            </Link>

            {/* Desktop Login Button */}
            <Button
              asChild
              className="hidden lg:flex w-full bg-black text-orange-500 font-bold"
            >
              <Link href={Routes.Sign_in}>Log In</Link>
            </Button>

            {/* Mobile Signup Icon */}
            <Link
              href={Routes.Sign_up}
              className="flex lg:hidden items-center justify-center"
            >
              <Image
                src="/icons/sign-up.svg"
                width={24}
                height={24}
                alt="Sign Up"
                className=""
              />
            </Link>

            {/* Desktop Signup Button */}
            <Button
              asChild
              className="hidden lg:flex w-full bg-gray-600 text-white font-bold"
            >
              <Link href={Routes.Sign_up}>Sign Up</Link>
            </Button>
          </>
        )}

        {/* Mobile Login Icon */}
        {/* <Link
          href={Routes.Sign_in}
          className="flex lg:hidden items-center justify-center"
        >
          <Image
            src="/icons/account.svg"
            width={24}
            height={24}
            alt="Login"
            className=""
          />
        </Link> */}

        {/* Desktop Login Button */}
        {/* <Button
          asChild
          className="hidden lg:flex w-full bg-black text-orange-500 font-bold"
        >
          <Link href={Routes.Sign_in}>Log In</Link>
        </Button> */}

        {/* Mobile Signup Icon */}
        {/* <Link
          href={Routes.Sign_up}
          className="flex lg:hidden items-center justify-center"
        >
          <Image
            src="/icons/sign-up.svg"
            width={24}
            height={24}
            alt="Sign Up"
            className=""
          />
        </Link> */}

        {/* Desktop Signup Button */}
        {/* <Button
          asChild
          className="hidden lg:flex w-full bg-gray-600 text-white font-bold"
        >
          <Link href={Routes.Sign_up}>Sign Up</Link>
        </Button> */}
      </div>
    </section>
  );
};

export default LeftSidebar;
