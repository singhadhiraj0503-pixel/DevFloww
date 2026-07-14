"use client";

import Routes from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { cn, getDevIconClassName, getTechDescription } from "@/lib/utils";
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
  const iconDescription = getTechDescription(name);

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
      <Link href={Routes.Tag(_id)} className="flex justify-between gap-2">
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

  return (
    <Link href={Routes.Tag(_id)} className="">
      <article className="w-full flex flex-col rounded-2xl border bg-gray-800 px-8 py-10 sm:w-[260px]">
        <div className="flex justify-between items-center gap-3">
          <div className="w-fit rounded-sm px-5 py-1.5 bg-gray-500">
            <p className="font-semibold text-lg">{name}</p>
          </div>
          <i className={cn(iconClass, "text-2xl")} aria-hidden="true" />
        </div>
        <p className="w-full mt-3 line-clamp-3">{iconDescription}</p>

        <p className="mt-3.5 text-lg">
          <span className="font-semibold text-xl text-orange-500 mr-2.5">
            {question}+
          </span>
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
