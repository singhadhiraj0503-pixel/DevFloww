import handleError from "../error";
import { RequestError } from "../http-errors";
import logger from "../logger";

const isError = (error) => {
  return error instanceof Error;
};

export const fetchHandler = async (url, options = {}) => {
  const { timeout = 5000, headers = {}, ...restOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders = {
    "Content-type": "application/json",
    Accept: "application/json",
  };

  const mergedHeaders = { ...defaultHeaders, ...headers };
  const config = {
    ...restOptions,
    headers: mergedHeaders,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    clearTimeout(id);

    if (!response.ok) {
      throw new RequestError(
        response.status,
        `HTTP error: ${response.statusText} `,
      );
    }

    return await response.json();
  } catch (error) {
    const actualError = isError(error) ? error : new Error("Unknown Error");

    if (actualError.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.error(`Error fetching ${url}: ${actualError.message}`);
    }

    return handleError(actualError);
  }
};
