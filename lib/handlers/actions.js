"use server";

const { auth } = require("@/auth");
const { ValidationError, UnauthorizedError } = require("../http-errors");
const { default: dbConnect } = require("../mongoose");

//1. Checking whether the schema and params are provided and validated.
//2. Checking whether the user is authorized.
//3. Connecting to the database.
//4. Returning the params and session.

const action = async ({ params, schema, authorize = false }) => {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error) {
        return new ValidationError(error.flatten().fieldErrors);
      } else {
        return new Error("Schema Validation Failed");
      }
    }
  }

  let session = null;
  if (authorize) {
    session = await auth();

    if (!authorize) {
      return new UnauthorizedError();
    }
  }

  await dbConnect();

  return { session, params };
};

export default action;
