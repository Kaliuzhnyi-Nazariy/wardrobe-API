import { NextFunction, Request, Response } from "express";
import { contrlWrapper, cookieSettings, errorHandler } from "../utils";
import service from "../service/auth";
import { CustomRequest } from "../interfaces";

const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const result = await service.signin({ email, password });

  res.cookie("authToken", result, cookieSettings);

  res.status(200).end();
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, confirmPassword } = req.body;

  const result = await service.signup({
    name,
    email,
    password,
    confirmPassword,
  });

  res.cookie("authToken", result, cookieSettings);

  res.status(201).end();
};

const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (!user || !user.id) throw errorHandler(401);

  await service.logout({ id: user.id });

  res.clearCookie("authToken", cookieSettings);

  res.status(204).end();
};

export default {
  signin: contrlWrapper(signin),
  signup: contrlWrapper(signup),
  logout: contrlWrapper(logout),
};
