"use server";

import mongoose from "mongoose";
import handleError from "../error";
import userModel from "@/database/user.model";
import bcrypt from "bcryptjs";
import accountModel from "@/database/account.model";
import { signIn } from "@/auth";

import action from "../handlers/actions";
import { SignUpSchema } from "../validation";

// const { default: action } = require("../handlers/actions");
// const { SignUpSchema } = require("../validation");

export const signUpWithCredentials = async (params) => {
  const validationResult = await action({ params, schema: SignUpSchema });

  console.log(validationResult);

  if (validationResult instanceof Error) {
    return handleError(validationResult);
  }

  const { name, email, username, password } = validationResult.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await userModel.findOne({ email }).session(session);

    if (existingUser) {
      throw new Error("User Already Exists");
    }

    const existingUsername = await userModel
      .findOne({ username })
      .session(session);

    if (existingUsername) {
      throw new Error("Username Already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await userModel.create(
      [{ username, name, email, password: hashedPassword }],
      {
        session,
      },
    );

    console.log({
      userId: newUser._id,
      name,
      provider: "credentials",
      providerAccountId: email,
      password: hashedPassword,
    });

    await accountModel.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return handleError(error);
  } finally {
    await session.endSession();
  }
};
