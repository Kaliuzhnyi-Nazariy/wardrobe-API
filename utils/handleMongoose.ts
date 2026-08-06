import { NextFunction } from "express";
import { IError } from "../interfaces";
import { CallbackWithoutResultAndOptionalError } from "mongoose";

export const handleMongoose = (
  error: IError,
  data: unknown,
  next: CallbackWithoutResultAndOptionalError,
) => {
  const { name, code } = error;
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  error.status = status;
  next();
};
