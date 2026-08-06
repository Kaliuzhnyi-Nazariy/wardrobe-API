import type { IError } from "../interfaces";

const errorMessages: Record<number, string> = {
  400: "Bad request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
  500: "Server Error",
};

export const errorHandler = (code: number, message = errorMessages[code]) => {
  const error = new Error();
  error.message = message;
  (error as IError).status = code;
  return error;
};
