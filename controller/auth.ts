import { NextFunction, Request, Response } from "express";
import { contrlWrapper } from "../utils";

const signin = async (req: Request, res: Response, next: NextFunction) => {};

export default {
  signin: contrlWrapper(signin),
};
