"use server";

import mongoose from "mongoose";
import handleError from "../error";
import action from "../handlers/actions";
import { CreateVoteSchema, UpdateVoteCountSchema } from "../validation";
import { answerModel, questionModel, voteModel } from "@/database";
import { success } from "zod";

export const updateVoteCount = async (params) => {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult);
  }

  const { targetId, targetType, voteType, change } = validationResult.params;

  const Model = targetType === "question" ? questionModel : answerModel;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      {
        $inc: { [voteField]: change },
      },
      { new: true, session },
    );

    if (!result) return handleError(new Error("Failed to update vote count"));

    return { success: true };
  } catch (error) {
    return handleError(error);
  }
};

export const createVote = async (params) => {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult);
  }

  const { targetId, targetType, voteType } = validationResult.params;
  const userId = validationResult.session?.user?.id;

  if (!userId) handleError(new Error("Unauthorized"));

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVote = await voteModel
      .findOne({
        author: userId,
        actionId: targetId,
        actionType: targetType,
      })
      .session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await voteModel.deleteOne({ _id: existingVote._id }).session(session);
        await updateVoteCount(
          { targetId, targetType, voteType, change: -1 },
          session,
        );
      } else {
        await voteModel.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session },
        );
        await updateVoteCount(
          { targetId, targetType, voteType, change: -1 },
          session,
        );
      }
    } else {
      await voteModel.create([{ targetId, targetType, voteType, change: 1 }], {
        session,
      });
      await updateVoteCount(
        { targetId, targetType, voteType, change: 1 },
        session,
      );
    }

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(error);
  }
};
