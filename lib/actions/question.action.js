"use server";

import mongoose from "mongoose";
import handleError from "../error";
import action from "../handlers/actions";
import { AskQuestionSchema } from "../validation";
import questionModel from "@/database/question.model";
import tagModel from "@/database/tag.model";
import tagQuestionModel from "@/database/tag-question.model";

export const createQuestion = async (params) => {
  const validatedResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult);
  }

  const { title, content, tags } = validatedResult.params;
  const userId = validatedResult?.session?.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await questionModel.create(
      [{ title, content, author: userId }],
      { session }
    );

    if (!question) {
      throw new Error("Failed to create question");
    }

    const tagIds = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await tagModel.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session },
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await tagQuestionModel.insertMany(tagQuestionDocuments, { session });

    await questionModel.findByIdAndUpdate(
      question._id,
      {
        $push: { tags: { $each: tagIds } },
      },
      { session },
    );

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error);
  } finally {
    session.endSession();
  }
};
