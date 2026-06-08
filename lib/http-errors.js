export class RequestError extends Error {
  constructor(statusCode, errors, message) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "RequestError";
  }
}

export class ValidationError extends RequestError {
  constructor(fieldErrors) {
    const message = ValidationError.formatFieldErrors(fieldErrors);
    super(400, fieldErrors, message);
    this.name = "ValidationError";
    this.errors = fieldErrors;
  }
  static formatFieldErrors(errors) {
    const formattedMessage = Object.entries(errors).map(([field, message]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

      if (message[0] === "Required") {
        return `${fieldName} is required`;
      } else {
        return message.join(" and ");
      }
    });
  }
}

export class NotFountError extends RequestError {
  constructor(resource) {
    super(404, `${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}
