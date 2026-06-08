import userModel from "@/database/user.model";
import handleError from "@/lib/error";
import { NotFountError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { success } from "zod";

export const GET = async (request, { params }) => {
  const { id } = await params;
  if (!id) throw new NotFountError("User");
  try {
    await dbConnect();

    const user = await userModel.findById(id);
    if (!user) throw new NotFountError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
};

export const DELETE = async (request, { params }) => {
  const { id } = await params;
  if (!id) throw new NotFountError("User");

  try {
    await dbConnect();

    const user = await userModel.findByIdAndDelete(id);
    if (!user) throw new NotFountError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api");
  }
};

export const PUT = async (request, { params }) => {
  const { id } = await params;
  if (!id) throw new NotFountError("User");

  try {
    await dbConnect();

    const body = await request.json();
    const validateData = UserSchema.partial().parse(body);

    const updateUser = await userModel.findByIdAndUpdate(id, validateData, {
      new: true,
    });
    if (!updateUser) throw new NotFountError("User");

    return NextResponse.json(
      { success: true, data: updateUser },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api");
  }
};
