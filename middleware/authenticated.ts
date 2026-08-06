import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces";
import { errorHandler } from "../utils";
import { jwtVerify } from "jose";
import { User } from "../models/user";

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw errorHandler(404, "JWT is not found");
}

const secret = new TextEncoder().encode(JWT_SECRET);

const isAuthenticated = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return errorHandler(401, "Bearer token is not bearer");
  }

  if (!token) return errorHandler(401, "No token");

  try {
    const { payload } = (await jwtVerify(token, secret)) as {
      payload: {
        id: string;
        iat: number;
        exp: number;
      };
    };

    if (payload.exp >= Date.now()) {
      await User.findByIdAndUpdate(payload.id, {
        token: null,
      });

      return errorHandler(403, "Token is expired");
    }

    req.user = { id: payload.id };
    next();
  } catch (error) {
    console.log(error);
    return errorHandler(500);
  }
};

export default isAuthenticated;
