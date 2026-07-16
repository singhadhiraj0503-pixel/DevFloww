import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section>
      <h1 className="font-bold text-2xl">All Users</h1>

      <div className="mt-5 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28" />
      </div>

      <div className="mt-10 flex flex-wrap gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
          return (
            <Skeleton
              key={item}
              className="w-full h-60 rounded-2xl xs:w-[230px]"
            />
          );
        })}
      </div>
    </section>
  );
};

export default Loading;
