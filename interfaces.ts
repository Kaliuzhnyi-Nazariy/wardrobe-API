import { Request } from "express";

export interface IError extends Error {
  status?: number;
  code?: number;
}

export interface CustomRequest extends Request {
  user?: { id: string };
}
