import logger from "./logger";

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
  logger.error({ err: error }, ``);
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

    logger.err({ err: error }, `Validation Error: ${validationError.message}`);

    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors,
    );
  }

  if (error instanceof Error) {
    logger.error(error.message);
    return formatResponse(responseType, 500, error.message);
  }

  logger.error({ err: error }, "An unexpected error occured");
  return formatResponse(responseType, 500, "Unexpected Error occured");
};

export default handleError;
