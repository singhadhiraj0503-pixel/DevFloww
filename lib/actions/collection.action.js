"use server";

import { collectionModel, questionModel } from "@/database";
import handleError from "../error";
import action from "../handlers/actions";
import { CollectionBaseSchema } from "../validation";
import { success } from "zod";
import { revalidatePath } from "next/cache";
import Routes from "@/constants/routes";

export const toggleSaveQuestion = async (params) => {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult);
  }

  const { questionId } = validationResult.params;
  const userId = validationResult.session?.user?.id;

  try {
    const question = await questionModel.findById(questionId);

    if (!question) throw new Error("Question Not Found");

    const collection = await collectionModel.findOne({
      question: questionId,
      author: userId,
    });

    if (collection) {
      await collectionModel.findByIdAndDelete(collection.id);

      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }

    await collectionModel.create({
      question: questionId,
      author: userId,
    });

    revalidatePath(Routes.Question(questionId));

    return { success: true, data: { saved: true } };
  } catch (error) {
    return handleError(error);
  }
};
