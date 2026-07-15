import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const Stats = ({ totalQuestions, totalAnswers, badges }) => {
  const StatsCard = ({ imgUrl, value, title }) => {
    return (
      <div className="flex flex-wrap items-center justify-start rounded-md border p-6 gap-4 bg-gray-700 text-white">
        <Image src={imgUrl} alt={title} width={40} height={50} />

        <div className="text-[0.7rem]">
          <p className="font-semibold">{value}</p>
          <p>{title}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-3">
      <h4 className="font-semibold text-lg">Stats</h4>

      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="flex flex-wrap items-center justify-evenly rounded-md border p-6 gap-4 bg-gray-700 text-white">
          <div>
            <p className="font-semibold">{formatNumber(totalQuestions)}</p>
            <p className="">Questions</p>
          </div>

          <div>
            <p className="font-semibold">{formatNumber(totalAnswers)}</p>
            <p className="">Answers</p>
          </div>
        </div>

        <StatsCard
          imgUrl="/icons/gold-medal.svg"
          value={badges.GOLD}
          title="Gold Badges"
        />

        <StatsCard
          imgUrl="/icons/silver-medal.svg"
          value={badges.SILVER}
          title="Silver Badges"
        />

        <StatsCard
          imgUrl="/icons/bronze-medal.svg"
          value={badges.BRONZE}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
};

export default Stats;
