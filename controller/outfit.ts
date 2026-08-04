import { NextFunction, Request, Response } from "express";
import { contrlWrapper } from "../utils";

const getOutfitById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export default {
  getOutfitById: contrlWrapper(getOutfitById),
};
