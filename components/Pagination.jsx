"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/url";

const Pagination = ({ page = 1, isNext, containerClasses }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNavigation = (type) => {
    const nextPageNumber =
      type === "prev" ? Number(page) - 1 : Number(page) + 1;

    // const value = nextPageNumber > 1 ? nextPageNumber.toString() : null;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  return (
    <div
      className={cn(
        "w-full flex items-center justify-center gap-2 mt-3.5 mb-5",
        containerClasses,
      )}
    >
      {Number(page) > 1 && (
        <Button
          onClick={() => handleNavigation("prev")}
          className="bg-gray-800 text-white rounded cursor-pointer active:scale-95"
        >
          <p className="text-[1rem]">Prev</p>
        </Button>
      )}

      <div className="flex items-center justify-center rounded-md bg-orange-500 px-3.5 py-2">
        <p className="text-white text-[0.9rem] font-bold">{page}</p>
      </div>

      {isNext && (
        <Button
          onClick={() => handleNavigation("next")}
          className="bg-gray-800 text-white rounded cursor-pointer active:scale-95"
        >
          <p className="text-[1rem]">Next</p>
        </Button>
      )}
    </div>
  );
};

export default Pagination;
