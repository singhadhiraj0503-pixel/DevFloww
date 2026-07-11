import React from "react";
import DataRender from "../DataRender";
import { EMPTY_ANSWERS } from "@/constants/state";
import AnswerCard from "../cards/AnswerCard";

const AllAnswers = ({ data, success, error, totalAnswers }) => {
  return (
    <div className="mt-11">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-orange-500">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <p>filters</p>
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
