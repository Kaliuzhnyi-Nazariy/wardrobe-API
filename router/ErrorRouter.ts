import { NextFunction, Request, Response } from "express";
import { IError } from "../interfaces";

export const notFoundRoute = (req: Request, res: Response) => {
  return res.status(404).json({ message: "Route is not found" });
};

export const errorRoute = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { status = 500, message = "Error occured" } = err;
  res.status(status).json({ message });
};
