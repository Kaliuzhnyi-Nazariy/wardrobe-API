import { NextFunction, Request, Response } from "express";
import { contrlWrapper, getUser } from "../utils";
import service from "../service/user";

const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  const id = getUser(req);

  const data = await service.getData(id);

  res.status(200).json(data);
};

const updateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const { name, email } = req.body;

  const data = await service.updateUserData({ id, name, email });

  res.status(200).json(data);
};

const updateUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  const { password } = req.body;

  const data = await service.updatePassword({ id, password });

  res.status(200).json(data);
};

const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = getUser(req);

  await service.deleteUser(id);

  res.status(204).end();
};

export default {
  getUserData: contrlWrapper(getUserData),
  updateUserData: contrlWrapper(updateUserData),
  updateUserPassword: contrlWrapper(updateUserPassword),
  deleteAccount: contrlWrapper(deleteAccount),
};
