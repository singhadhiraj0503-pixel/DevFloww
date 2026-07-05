import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import { redirect } from "next/navigation";
import React from "react";

const AskQuestion = async () => {
  const session = await auth();
  if (!session) return redirect("/sign-in");

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
