import { NextFunction, Request, Response } from "express";
import { contrlWrapper, errorHandler } from "../utils";
import service from "../service/auth";
import { CustomRequest } from "../interfaces";

const signin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const result = await service.signin({ email, password });

  res.status(200).json(result);
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, confirmPassword } = req.body;

  const result = await service.signup({
    name,
    email,
    password,
    confirmPassword,
  });

  res.status(201).json(result);
};

const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (!user || !user.id) throw errorHandler(401);

  await service.logout({ id: user.id });

  res.status(204).json();
};

export default {
  signin: contrlWrapper(signin),
  signup: contrlWrapper(signup),
  logout: contrlWrapper(logout),
};
