import { Request } from "express";
import { errorHandler } from "./errorHandler";

export const getParams = (
  req: Request,
  param: string,
  paramInMessage: string,
) => {
  const searchingParam = req.params[param];

  const finalParam =
    typeof searchingParam !== "string" ? searchingParam[0] : searchingParam;

  if (!finalParam) throw errorHandler(404, `${paramInMessage} not found`);

  return finalParam;
};
