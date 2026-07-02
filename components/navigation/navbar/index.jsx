import Image from "next/image";
import React from "react";
import Theme from "./Theme";
import MobileNavigation from "./MobileNavigation";
import Link from "next/link";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="w-full bg-gray-900 text-white text-xl flex items-center justify-between fixed z-50 p-4">
      <Link href="/" className="left flex gap-2">
        <Image
          src="/images/site-logo.svg"
          width={25}
          height={25}
          alt="Dev-Flow logo"
        />
        <p className="font-bold">
          Dev<span className="text-orange-500">Floww</span>
        </p>
      </Link>

      <div className="middle">Global Search</div>

      <div className="right flex items-center gap-3 cursor-pointer">
        <Theme />

        {session?.user?.id && (
          <UserAvatar
            id={session.user.id}
            name={session.user.name}
            imageUrl={session.user?.image}
          />
        )}

        <div className="lg:hidden">
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
