import { CustomRequest } from "../interfaces";
import { errorHandler } from "./errorHandler";

export const getUser = (req: CustomRequest) => {
  const user = req.user;

  if (!user) throw errorHandler(401, "No id");

  return user.id;
};
