"use client";

import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLinks = ({ isMobileNav = false, userId }) => {
  const pathName = usePathname();
  // const userId = 1;

  return (
    <div>
      {sidebarLinks.map((item) => {
        // const isActive =
        //   (pathName.includes(item.route) && item.route.length > 1) ||
        //   pathName === item.route;

        // if (item.route === "/profile") {
        //   if (userId) item.route = `${item.route}/${userId}`;
        // } else return null;
        const route =
          item.route === "/profile" && userId
            ? `/profile/${userId}`
            : item.route;

        const isActive =
          (pathName.includes(route) && route.length > 1) || pathName === route;

        const LinkComponent = (
          <Link
            href={route}
            key={item.label}
            className={cn(
              isActive
                ? "bg-orange-500 text-white"
                : "bg-transparent text-white",
              "mt-3 flex items-center justify-start gap-3 p-4 text-[1.1rem] rounded",
            )}
          >
            <Image
              src={item.imgURL}
              width={20}
              height={20}
              alt={item.label}
              className={cn({ "inverted-colors": !isActive })}
            />
            <p
              className={cn(
                isActive ? "font-bold" : "font-medium",
                !isMobileNav && "max-lg:hidden",
              )}
            >
              {item.label}
            </p>
          </Link>
        );
        return isMobileNav ? (
          <SheetClose asChild key={route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={route}>{LinkComponent}</React.Fragment>
        );
      })}
    </div>
  );
};

export default NavLinks;
