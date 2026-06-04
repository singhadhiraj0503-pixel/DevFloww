import QuestionForm from "@/components/forms/QuestionForm";
import React from "react";

const AskQuestion = () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl text-center font-bold">AskQuestion</h1>
      <div className="mt-5">
        <QuestionForm />
      </div>
    </div>
  );
};

export default AskQuestion;
