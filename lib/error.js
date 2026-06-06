const { NextResponse } = require("next/server");
const { success, ZodError } = require("zod");
const { ValidationError, RequestError } = require("./http-errors");

const formatResponse = (responseType, status, message, errors) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };
  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

const handleError = (error, responseType) => {
  if (error instanceof RequestError) {
    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors,
    );
  }

  //   if (error instanceof RequestError) {
  //     return formatResponse(
  //       responseType,
  //       error.statusCode,
  //       error.message,
  //       error.errors,
  //     );
  //   }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(error.flatten().fieldErrors);
    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors,
    );
  }

  if (error instanceof Error) {
    return formatResponse(responseType, 500, error.message);
  }

  return formatResponse(responseType, 500, "Unexpected Error occured");
};

export default handleError;
