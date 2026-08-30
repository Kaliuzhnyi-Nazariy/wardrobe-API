import { CookieOptions } from "express";

export const cookieSettings: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};
