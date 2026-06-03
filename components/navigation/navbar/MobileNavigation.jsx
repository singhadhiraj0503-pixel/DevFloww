"use client";

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import Routes from "@/constants/routes";
import { Button } from "@/components/ui/button";
import NavLinks from "./NavLinks";

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image src="/icons/hamburger.svg" width={20} height={20} alt="Menu" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="h-full">
          <SheetTitle className="hidden">Navigation</SheetTitle>
          {/* <SheetDescription>This action cannot be undone.</SheetDescription> */}
          <Link
            href="/"
            className="mt-2 flex items-center gap-1 cursor-pointer"
          >
            <Image
              src="/images/site-logo.svg"
              width={20}
              height={20}
              alt="Logo"
            />
            <p className="font-bold text-lg">
              Dev<span className="text-orange-500">Floww</span>
            </p>
          </Link>
          <SheetClose asChild>
            <section className="h-full flex flex-col gap-5 mt-3">
              <NavLinks isMobileNav />
            </section>
          </SheetClose>

          <div className="h-full flex flex-col justify-end gap-2">
            <SheetClose className="w-full" asChild>
              <Link href={Routes.Sign_in}>
                <Button className="w-full bg-gray-900 text-orange-500 font-bold border-none rounded active:scale-95">
                  Log In
                </Button>
              </Link>
            </SheetClose>

            <SheetClose className="w-full" asChild>
              <Link href={Routes.Sign_up}>
                <Button className="w-full bg-gray-600 text-white font-bold border-none rounded active:scale-95">
                  Sign Up
                </Button>
              </Link>
            </SheetClose>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
