import userModel from "@/database/user.model";
import handleError from "@/lib/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { success } from "zod";

export const GET = async () => {
  try {
    await dbConnect();

    const users = await userModel.find();

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
};

export const POST = async (request) => {
  try {
    await dbConnect();

    const body = await request.json();

    const validateData = UserSchema.safeParse(body);

    if (!validateData.success) {
      throw new ValidationError(validateData.error.flatten().fieldErrors);
    }

    const { email, username } = validateData.data;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) throw new Error("Username already exists");

    const newUser = await userModel.create(validateData.data);

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error, "api");
  }
};
