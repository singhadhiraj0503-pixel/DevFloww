import React from "react";
import DataRender from "../DataRender";
import { EMPTY_ANSWERS } from "@/constants/state";
import AnswerCard from "../cards/AnswerCard";
import CommonFilter from "../filters/CommonFilter";
import { AnswerFilters } from "@/constants/filters";

const AllAnswers = ({ data, success, error, totalAnswers }) => {
  return (
    <div className="mt-11">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-orange-500">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>

        <CommonFilter
          filters={AnswerFilters}
          otherClasses="sm:min-w-15"
          containerClasses="max-xs:w-full"
        />
      </div>

      <DataRender
        data={data}
        success={success}
        error={error}
        empty={EMPTY_ANSWERS}
        render={(answers) =>
          answers.map((answer) => {
            return <AnswerCard key={answer._id} {...answer} />;
          })
        }
      />
    </div>
  );
};

export default AllAnswers;
