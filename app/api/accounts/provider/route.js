import accountModel from "@/database/account.model";
import handleError from "@/lib/error";
import { NotFountError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { success } from "zod";

export const POST = async (request) => {
  const { providerAccountId } = await request.json();
  try {
    await dbConnect();

    const validateData = AccountSchema.partial().safeParse({
      providerAccountId,
    });
    if (!validateData.success)
      throw new ValidationError(validateData.error.flatten().fieldErrors);

    const account = await accountModel.findOne({ providerAccountId });
    if (!account) throw new NotFountError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
};
