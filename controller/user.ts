import { NextFunction, Request, Response } from "express";
import { contrlWrapper } from "../utils";

const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export default {
  deleteAccount: contrlWrapper(deleteAccount),
};
