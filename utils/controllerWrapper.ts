import { NextFunction, Request, Response } from "express";

export const contrlWrapper = <T>(
  fn: (req: Request<T>, res: Response, next: NextFunction) => unknown,
) => {
  const func = async (req: Request<T>, res: Response, next: NextFunction) => {
    try {
      fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
  return func;
};
