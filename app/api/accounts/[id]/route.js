import accountModel from "@/database/account.model";
import handleError from "@/lib/error";
import { NotFountError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { success } from "zod";

export const GET = async (request, { params }) => {
  const { id } = await params;
  if (!id) throw new NotFountError("Account");
  try {
    await dbConnect();

    const account = await accountModel.findOne(id);
    if (!account) throw new NotFountError("Account");

    return NextResponse.json({ success: true, sata: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
};

export const POST = async (request, { params }) => {
  const { id } = await params;
  if (!id) throw new NotFountError("Account");
  try {
    await dbConnect();

    const account = await accountModel.findByIdAndDelete(id);
    if (!account) throw new NotFountError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
};

export const PUT = async (request, { params }) => {
  const { id } = await params;
  if (!id) throw new NotFountError("Account");

  try {
    await dbConnect();

    const body = await request.json();
    const validateData = AccountSchema.partial().safeParse(body);
    if (!validateData.success)
      throw new ValidationError(validateData.error.flatten().fieldErrors);

    const updatedAccount = await accountModel.findByIdAndUpdate(
      id,
      validateData,
      { new: true },
    );
    if (!updatedAccount) throw new NotFountError("Account");

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api");
  }
};
