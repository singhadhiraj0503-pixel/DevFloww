"use server";

import { answerModel, questionModel, userModel } from "@/database";
import handleError from "../error";
import action from "../handlers/actions";
import { GetUserSchema, PaginatedSearchParamsShema } from "../validation";
import { Types } from "mongoose";

export const getUsers = async (params) => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsShema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult);
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUsers = await userModel.countDocuments(filterQuery);

    const users = await userModel.find(filterQuery).skip(skip).limit(limit);

    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: { users: JSON.parse(JSON.stringify(users)), isNext },
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getUser = async (params) => {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult);
  }

  const { userId } = params;

  try {
    const user = await userModel.findById(userId);

    if (!user) throw new Error("User not found");

    const totalQuestions = await questionModel.countDocuments({
      author: userId,
    });
    const totalAnswers = await answerModel.countDocuments({ author: userId });

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalQuestions,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getUserQuestions = async (params) => {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult);
  }

  const { userId, page = 1, pageSize = 10 } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    const totalQuestions = await questionModel.countDocuments({
      author: userId,
    });

    const questions = await questionModel
      .find({ author: userId })
      .populate("tags", "name")
      .populate("author", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;
    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getUserAnswers = async (params) => {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult);
  }

  const { userId, page = 1, pageSize = 10 } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    const totalAnswers = await answerModel.countDocuments({
      author: userId,
    });

    const answers = await answerModel
      .find({ author: userId })

      .populate("author", "_id name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;
    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getUserTopTags = async (params) => {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult);
  }

  const { userId } = params;

  try {
    const pipeline = [
      { $match: { author: new Types.ObjectId(userId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      { $unwind: "$tagInfo" },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: "$tagInfo._id",
          name: "$tagInfo.name",
          count: 1,
        },
      },
    ];

    const tags = await questionModel.aggregate(pipeline);

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
      },
    };
  } catch (error) {
    return handleError(error);
  }
};
