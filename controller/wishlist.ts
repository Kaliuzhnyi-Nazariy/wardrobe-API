import { NextFunction, Request, Response } from "express";
import { contrlWrapper } from "../utils";

const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export default {
  getWishlist: contrlWrapper(getWishlist),
};
