"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/url";

const filters = [
  {
    name: "Newest",
    value: "newest",
  },
  {
    name: "Popular",
    value: "popular",
  },
  {
    name: "Unanswered",
    value: "unanswered",
  },
  {
    name: "Recommended",
    value: "recommended",
  },
];

const HomeFilter = () => {
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter");
  const [active, setactive] = useState(filterParams || "");
  const router = useRouter();

  const handleTypeClick = (filter) => {
    let newUrl = "";
    if (filter === active) {
      setactive("");

      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      setactive(filter);

      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
    }
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="w-full flex justify-center gap-10 mt-2 max-sm:hidden">
      {filters.map((filter) => {
        return (
          <Button
            className={cn(
              `rounded active:scale-95 text-[1rem] cursor-pointer capitalize`,
              active === filter.value
                ? "bg-orange-500 text-white"
                : "bg-gray-900 text-white",
            )}
            key={filter.name}
            onClick={() => {
              handleTypeClick(filter.value);
            }}
          >
            {filter.value}
          </Button>
        );
      })}
    </div>
  );
};

export default HomeFilter;
