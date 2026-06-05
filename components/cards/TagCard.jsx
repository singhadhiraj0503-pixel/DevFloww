"use client";

import Routes from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { getDevIconClassName } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";

const TagCard = ({
  _id,
  name,
  question,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}) => {
  const iconClass = getDevIconClassName(name);

  const handleClick = (e) => {
    e.preventDefault();
  };

  const Content = (
    <>
      <Badge className="bg-gray-700 text-white px-2 py-3 mt-1 uppercase rounded">
        <div className="flex items-center gap-3">
          <i className={`${iconClass} text-md`}></i>
          <span>{name}</span>
        </div>

        {remove && (
          <Image
            src="/icons/close.svg"
            width={12}
            height={12}
            alt="close icon"
            className="cursor-pointer object-cover object-center invert"
            onClick={handleRemove}
          />
        )}
      </Badge>
      {showCount && <p>{question}</p>}
    </>
  );

  if (compact) {
    return isButton ? (
      <button
        onClick={handleClick}
        variant="ghost"
        className="p-0 h-auto bg-transparent hover:bg-transparent"
      >
        {Content}
      </button>
    ) : (
      <Link href={Routes.Tags(_id)} className="flex justify-between gap-2">
        {/* <Badge className="bg-gray-700 text-orange-500 px-2 py-3 mt-1 uppercase rounded">
          <div className="flex items-center gap-3">
            <i className={`${iconClass} text-md`}></i>
            <span>{name}</span>
          </div>
        </Badge>
        {showCount && <p>{question}</p>} */}
        {Content}
      </Link>
    );
  }
};

export default TagCard;
