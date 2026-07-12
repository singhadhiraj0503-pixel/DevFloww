"use server";

import { userModel } from "@/database";
import handleError from "../error";
import action from "../handlers/actions";
import { PaginatedSearchParamsShema } from "../validation";

export const getUsers = async (params) => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsShema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult);
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = Number(page) - 1 * pageSize;
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
