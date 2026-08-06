import { model, Schema } from "mongoose";
import { handleMongoose } from "../utils";
import user from "../controller/user";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      //   select: false,
    },
    resetToken: String,
    resetPasswordExpires: Date,
    token: String,
  },
  { versionKey: false, timestamps: true },
);

userSchema.post("save", handleMongoose);

export const User = model("user", userSchema);
