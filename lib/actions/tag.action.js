import { questionModel, tagModel } from "@/database";
import handleError from "../error";
import action from "../handlers/actions";
import {
  GetTagQuestionSchema,
  PaginatedSearchParamsShema,
} from "../validation";
import { success } from "zod";
import dbConnect from "../mongoose";

export const getTags = async (params) => {
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

  if (query) {
    filterQuery.$or = [
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;

    case "recent":
      sortCriteria = { createdAt: -1 };
      break;

    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;

    case "name":
      sortCriteria = { name: 1 };
      break;

    default:
      break;
  }

  try {
    const totalTags = await tagModel.countDocuments(filterQuery);

    const tags = await tagModel
      .find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalTags > skip + tags.length;

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getTagQuestions = async (params) => {
  const validatedResult = await action({
    params,
    schema: GetTagQuestionSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult);
  }

  const { page = 1, pageSize = 10, query, tagId } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const tag = await tagModel.findById(tagId);
    if (!tag) throw new Error("Tag not found");

    const filterQuery = {
      tags: { $in: [tagId] },
    };

    if (query) {
      filterQuery.title = { $regex: query, $options: "i" };
    }

    const totalQuestions = await questionModel.countDocuments(filterQuery);

    const questions = await questionModel
      .find(filterQuery)
      .select("_id title views answers upvotes downvotes author createdAt")
      .populate([
        { path: "author", select: "name image" },
        { path: "tags", select: "name" },
      ])
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getTopTags = async () => {
  try {
    await dbConnect();

    const tags = await tagModel.find().sort({ questions: -1 }).limit(5);

    return { success: true, data: JSON.parse(JSON.stringify(tags)) };
  } catch (error) {
    return handleError(error);
  }
};
