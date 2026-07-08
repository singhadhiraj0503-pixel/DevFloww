import { questionModel, tagModel } from "@/database";
import handleError from "../error";
import action from "../handlers/actions";
import { PaginatedSearchParamsShema } from "../validation";
import { success } from "zod";

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
