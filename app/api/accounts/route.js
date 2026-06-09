import accountModel from "@/database/account.model";
import handleError from "@/lib/error";
import { ForbiddenError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { success } from "zod";

export const GET = async () => {
  try {
    await dbConnect();

    const account = await accountModel.find();

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
};

export const POST = async (request) => {
  try {
    await dbConnect();
    const body = await request.json();

    const validateData = AccountSchema.parse(body);

    const existingAccount = await accountModel.findOne({
      provider: validateData.provider,
      providerAccountId: validateData.providerAccountId,
    });
    if (existingAccount)
      throw new ForbiddenError("A user with the same provider already exists");

    const newAccount = await accountModel.create(validateData);

    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "api");
  }
};
