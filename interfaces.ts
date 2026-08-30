import { Request } from "express";

export interface IError extends Error {
  status?: number;
  code?: number;
}

export interface CustomRequest extends Request {
  user?: { id: string };
}

export type SeasonsType = "winter" | "spring" | "fall" | "summer";
export type Size = "s" | "m" | "l" | "xl" | "2xl" | "3xl";
