"use server";

import { collectionModel, questionModel } from "@/database";
import handleError from "../error";
import action from "../handlers/actions";
import {
  CollectionBaseSchema,
  PaginatedSearchParamsShema,
} from "../validation";
import { success } from "zod";
import { revalidatePath } from "next/cache";
import Routes from "@/constants/routes";
import mongoose from "mongoose";

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
      await collectionModel.findByIdAndDelete(collection._id);

      revalidatePath(Routes.Question(questionId));

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

export const hasSavedQuestion = async (params) => {
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
    const collection = await collectionModel.findOne({
      question: questionId,
      author: userId,
    });

    return { success: true, data: { saved: !!collection } };
  } catch (error) {
    return handleError(error);
  }
};

export const getSavedQuestions = async (params) => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsShema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult);
  }

  const userId = validationResult.session?.user?.id;
  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const sortOptions = {
    mostrecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostvoted: { "question.upvotes": -1 },
    mostviewed: { "question.views": -1 },
    mostanswered: { "question.answers": -1 },
  };

  const sortCriteria = sortOptions[filter] || { "question.createdAt": -1 };

  try {
    const pipeline = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      { $unwind: "question.author" },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: query, $options: "i" } },
            { "question.content": { $regex: query, $options: "i" } },
          ],
        },
      });
    }

    const [totalCount] = await collectionModel.aggregate([
      ...pipeline,
      { $count: "count" },
    ]);

    pipeline.push({ $sort: sortCriteria }, { $skip: skip }, { $limit: limit });
    pipeline.push({ $project: { question: 1, author: 1 } });

    const questions = await collectionModel.aggregate(pipeline);

    const isNext = totalCount.count > skip + questions.length;

    return {
      success: true,
      data: { collection: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error);
  }
};
