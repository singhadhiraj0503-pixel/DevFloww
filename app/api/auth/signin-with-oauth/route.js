import accountModel from "@/database/account.model";
import userModel from "@/database/user.model";
import handleError from "@/lib/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validation";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { success } from "zod";

export const POST = async (request) => {
  const { provider, providerAccountId, user } = await request.json();

  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });
    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const { name, username, email, image } = user;

    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await userModel.findOne({ email }).session(session);

    if (!existingUser) {
      [existingUser] = await userModel.create(
        [
          {
            name,
            username: slugifiedUsername,
            email,
            image,
          },
        ],
        { session },
      );
    } else {
      const updatedData = {};
      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await userModel
          .updateOne({ _id: existingUser._id }, { $set: updatedData })
          .session(session);
      }
    }

    const existingAccount = await accountModel
      .findOne({
        userId: existingUser._id,
        provider,
        providerAccountId,
      })
      .session(session);

    if (!existingAccount) {
      await accountModel.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, "api");
  } finally {
    await session.endSession();
  }
};
