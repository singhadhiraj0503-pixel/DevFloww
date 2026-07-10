"use server";

import mongoose from "mongoose";
import handleError from "../error";
import action from "../handlers/actions";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncrementViewsSchema,
  PaginatedSearchParamsShema,
} from "../validation";
import questionModel from "@/database/question.model";
import tagModel from "@/database/tag.model";
import tagQuestionModel from "@/database/tag-question.model";
import { success } from "zod";
import { revalidatePath } from "next/cache";
import Routes from "@/constants/routes";

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
      { session },
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

export const editQuestion = async (params) => {
  const validatedResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult);
  }

  const { title, content, tags, questionId } = validatedResult.params;
  const userId = validatedResult?.session?.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // console.log("Question ID:", questionId);

    const question = await questionModel.findById(questionId).populate("tags");

    // console.log(question);

    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;

      await question.save({ session });
    }

    // const tagsToAdd = tags.filter(
    //   (tag) => !question.tags.includes(tag.toLowerCase()),
    // );

    const existingTags = question.tags.map((tag) => tag.name.toLowerCase());

    const tagsToAdd = tags.filter(
      (tag) => !existingTags.includes(tag.toLowerCase()),
    );

    // const tagsToRemove = tags.filter(
    //   (tag) => !tags.includes(tag.name.toLowerCase()),
    // );

    const tagsToRemove = question.tags.filter(
      (tag) => !tags.includes(tag.name.toLowerCase()),
    );

    const newTagsDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await tagModel.findOneAndUpdate(
          {
            name: { $regex: new RegExp(`^${tag}$`, "i") },
          },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session },
        );

        newTagsDocuments.push({
          tag: existingTag._id,
          question: questionId,
        });

        question.tags.push(existingTag._id);
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag) => tag._id);

      await tagModel.updateMany(
        {
          _id: { $in: tagIdsToRemove },
        },
        { $inc: { questions: -1 } },
        { session },
      );

      await tagQuestionModel.deleteMany(
        {
          tag: { $in: tagIdsToRemove },
          question: questionId,
        },
        { session },
      );

      // question.tags = question.tags.filter(
      //   (tagIds) => !tagIdsToRemove.includes(tagId),
      // );

      // question.tags = question.tags.filter(
      //   (tagId) => !tagIdsToRemove.some((id) => id.equals(tagId)),
      // );

      question.tags = question.tags.filter(
        (tag) => !tagIdsToRemove.some((id) => id.equals(tag._id)),
      );
    }

    if (newTagsDocuments.length > 0) {
      await tagQuestionModel.insertMany(newTagsDocuments, { session });
    }

    await question.save({ session });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error);
  } finally {
    await session.endSession();
  }
};

export const getQuestion = async (params) => {
  const validatedResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult);
  }

  const { questionId } = validatedResult.params;

  try {
    // const question = await questionModel.findById(questionId);

    const question = await questionModel
      .findById(questionId)
      .populate("tags")
      .populate("author", "_id name image");

    if (!question) {
      throw new Error("Question not found");
    }
    // console.log(JSON.stringify(question, null, 2));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error);
  }
};

export const getQuestions = async (params) => {
  const validatedResult = await action({
    params,
    schema: PaginatedSearchParamsShema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult);
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery = {};

  if (filter === "recommended") {
    return { success: true, data: { question: [], isNext: false } };
  }

  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { content: { $regex: new RegExp(query, "i") } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswerd":
      filterQuery.answer = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalQuestions = await questionModel.countDocuments(filterQuery);

    const questions = await questionModel
      .find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error);
  }
};

export const incrementViews = async (params) => {
  const validatedResult = await action({
    params,
    schema: IncrementViewsSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult);
  }

  const { questionId } = validatedResult.params;

  try {
    const question = await questionModel.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    question.views += 1;

    await question.save();

    revalidatePath(Routes.Question(questionId));

    return { success: true, data: { views: question.views } };
  } catch (error) {
    return handleError(error);
  }
};
