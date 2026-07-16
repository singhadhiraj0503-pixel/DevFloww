"use server";

import mongoose, { Types } from "mongoose";
import handleError from "../error";
import action from "../handlers/actions";
import {
  AskQuestionSchema,
  DeleteQuestionSchema,
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
import dbConnect from "../mongoose";
import {
  answerModel,
  collectionModel,
  interactionModel,
  voteModel,
} from "@/database";

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
        { $setOnInsert: { name: tag }, $inc: { question: 1 } },
        { upsert: true, new: true, session },
      );

      // console.log(existingTag);

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
          { $setOnInsert: { name: tag }, $inc: { question: 1 } },
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
        { $inc: { question: -1 } },
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

    // return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error);
  }
};

export const getRecommendedQuestions = async ({
  userId,
  query,
  skip,
  limit,
}) => {
  const interactions = await interactionModel
    .find({
      user: new Types.ObjectId(userId),
      actionType: "question",
      actions: { $in: ["view", "upvote", "bookmark", "post"] },
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const interactedQuestionIds = interactions.map((i) => i.actionId);

  const interactedQuestions = await questionModel
    .find({
      _id: { $in: interactedQuestionIds },
    })
    .select("tags");

  const allTags = interactedQuestions.flatMap((q) =>
    q.tags.map((tag) => tag.toString()),
  );

  const uniqueTagIds = [...new Set(allTags)];

  const recommendedQuery = {
    _id: { $nin: interactedQuestionIds },
    author: { $ne: new Types.ObjectId(userId) },
    tags: { $in: uniqueTagIds.map((id) => new Types.ObjectId(id)) },
  };

  if (query) {
    recommendedQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];
  }

  const total = await questionModel.countDocuments(recommendedQuery);

  const questions = await questionModel
    .find(recommendedQuery)
    .populate("tags", "name")
    .populate("author", "name image")
    .sort({ upvotes: -1, views: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    questions: JSON.parse(JSON.stringify(questions)),
    isNext: total > skip + questions.length,
  };
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

    // revalidatePath(Routes.Question(questionId));

    return { success: true, data: { views: question.views } };
  } catch (error) {
    return handleError(error);
  }
};

export const getHotQuestions = async () => {
  try {
    await dbConnect();

    const questions = await questionModel
      .find()
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return { success: true, data: JSON.parse(JSON.stringify(questions)) };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteQuestion = async (params) => {
  const validationResult = await action({
    params,
    schema: DeleteQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult);
  }

  const { questionId } = validationResult.params;
  const { user } = validationResult.session;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const question = await questionModel.findById(questionId).session(session);
    if (!question) throw new Error("Questions not found");

    if (question.author.toString() !== user?.id)
      throw new Error("You are not authorized to delete this question");

    await collectionModel.deleteMany({ question: questionId }).session(session);
    await tagQuestionModel
      .deleteMany({ question: questionId })
      .session(session);

    if (question.tags.length > 0) {
      await tagModel.updateMany(
        { _id: { $in: question.tags } },
        { $inc: { questions: -1 } },
        { session },
      );
    }

    await voteModel
      .deleteMany({
        actionId: questionId,
        actionType: "question",
      })
      .session(session);

    const answers = await answerModel
      .find({ question: questionId })
      .session(session);

    if (answers.length > 0) {
      await answerModel.deleteMany({ question: questionId }).session(session);

      await voteModel
        .deleteMany({
          actionId: { $in: answers.map((answer) => answer.id) },
          actionType: "answer",
        })
        .session(session);
    }

    await questionModel.findByIdAndDelete(questionId).session(session);

    await session.commitTransaction();
    session.endSession();

    revalidatePath(`/profile/${user?.id}`);

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return handleError(error);
  }
};
