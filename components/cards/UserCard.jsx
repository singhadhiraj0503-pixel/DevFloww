import React from "react";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import Routes from "@/constants/routes";

const UserCard = ({ _id, name, username, image }) => {
  return (
    <div className="w-60 xs:w-[230px] ml-4">
      <article className="w-full flex flex-col items-center justify-center rounded-2xl border p-8 bg-gray-700">
        <UserAvatar
          id={_id}
          name={name}
          imageUrl={image}
          className="size-[100px] rounded-full object-cover"
          fallbackClassname="text-3xl tracking-widest"
        />

        <Link href={Routes.Profile(_id)}>
          <div className="mt-4 text-center">
            <h3 className="text-lg font-bold line-clamp-1">{name}</h3>
            <p className="mt-2 opacity-50">@{username}</p>
          </div>
        </Link>
      </article>
    </div>
  );
};

export default UserCard;
