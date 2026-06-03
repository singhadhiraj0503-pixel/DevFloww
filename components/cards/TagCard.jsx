"use client";

import Routes from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { getDevIconClassName } from "@/lib/utils";

const TagCard = ({ _id, name, question, showCount, compact }) => {
  const iconClass = getDevIconClassName(name);

  return (
    <Link href={Routes.Tags(_id)} className="flex justify-between gap-2">
      <Badge className="bg-gray-700 text-orange-500 px-2 py-3 mt-1 uppercase rounded">
        <div className="flex items-center gap-3">
          <i className={`${iconClass} text-md`}></i>
          <span>{name}</span>
        </div>
      </Badge>
      {showCount && <p>{question}</p>}
    </Link>
  );
};

export default TagCard;
