import mongoose from "mongoose";
import { User } from "../models/user";
import { errorHandler } from "../utils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

interface SignIn {
  email: string;
  password: string;
}

interface SignUp extends SignIn {
  name: string;
  confirmPassword: string;
}

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw errorHandler(404, "JWT SECRET is not found");
}

const signin = async ({ email, password }: SignIn) => {
  const isUser = await User.findOne({ email });

  if (!isUser) return errorHandler(400, "Email or password is incorrect");

  const isPasswordMatch = await bcrypt.compare(password, isUser.password);

  if (!isPasswordMatch)
    return errorHandler(400, "Email or password is incorrect");

  const payload = {
    id: isUser.id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  await User.updateOne(
    { id: isUser.id },
    {
      token: hashedToken,
    },
  );

  return token;
};

const signup = async ({ email, password, name, confirmPassword }: SignUp) => {
  const isUser = await User.findOne({ email });

  if (isUser) return errorHandler(409, "Email is in use");

  if (password !== confirmPassword) {
    return errorHandler(400, "Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUserId = new mongoose.Types.ObjectId();

  const token = jwt.sign({ id: newUserId }, JWT_SECRET, { expiresIn: "30d" });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  await User.create({
    _id: newUserId,
    name,
    email,
    password: hashedPassword,
    token: hashedToken,
  });

  return token;
};

const logout = async ({ id }: { id: string }) => {
  await User.findByIdAndUpdate(
    { id },
    {
      token: null,
    },
  );

  return;
};

export default {
  signin,
  signup,
  logout,
};
