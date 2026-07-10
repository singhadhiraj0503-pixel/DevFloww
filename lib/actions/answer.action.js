"use server";

import mongoose from "mongoose";
import handleError from "../error";
import action from "../handlers/actions";
import { AnswerServerSchema } from "../validation";
import { answerModel, questionModel } from "@/database";
import { revalidatePath } from "next/cache";
import Routes from "@/constants/routes";

export const createAnswer = async (params) => {
  const validatedResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult);
  }

  const { content, questionId } = validatedResult.params;
  const userId = validatedResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await questionModel.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    const [newAnswer] = await answerModel.create(
      [
        {
          author: userId,
          question: questionId,
          content,
        },
      ],
      { session },
    );

    if (!newAnswer) throw new Error("Failed to create an Answer");

    question.answers += 1;
    await question.save({ session });

    await session.commitTransaction();

    revalidatePath(Routes.Question(questionId));

    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error);
  } finally {
    await session.endSession();
  }
};
