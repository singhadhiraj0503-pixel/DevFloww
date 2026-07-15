import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import Routes from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { notFound, redirect } from "next/navigation";
import React from "react";

const EditQuestion = async ({ params }) => {
  const { id } = await params;

  console.log("ID:", id);

  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("/sign-in");

  //   const result = await getQuestion({
  //     questionId: id,
  //   });

  //   console.log("RESULT:", result);

  //   const { success, data: question } = result;

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success) return notFound();

  if (question?.author._id.toString() !== session?.user?.id)
    redirect(Routes.Question(id));

  return (
    <div className="w-full">
      <QuestionForm question={question} isEdit />
    </div>
  );
};

export default EditQuestion;
