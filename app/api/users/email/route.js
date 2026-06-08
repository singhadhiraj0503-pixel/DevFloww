import userModel from "@/database/user.model";
import handleError from "@/lib/error";
import { NotFountError, ValidationError } from "@/lib/http-errors";
import { UserSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { success } from "zod";

export const POST = async (request) => {
  const { email } = await request.json();
  try {
    const validateData = UserSchema.partial().safeParse({ email });
    if (!validateData.success)
      throw new ValidationError(validateData.error.flatten().fieldErrors);

    const user = await userModel.findOne({ email });
    if (!user) throw new NotFountError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
};
