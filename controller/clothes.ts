import { NextFunction, Request, Response } from "express";
import { contrlWrapper } from "../utils";

const getClothesById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export default {
  getClothesById: contrlWrapper(getClothesById),
};
