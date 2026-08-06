import { model, Schema } from "mongoose";
import { handleMongoose } from "../utils";

const clothesSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    color: { type: [String], required: [true, "Colors are required"] },
    season: {
      type: [String],
      enum: ["winter", "spring", "summer", "fall"],
    },
    image: String,
    brand: String,
    size: {
      type: String,
      required: [true, "Size is required"],
      enum: {
        values: ["s", "m", "l", "xl", "2xl", "3xl"],
        message: "{VALUE} is not a valid size",
      },
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    isOwned: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { versionKey: false, timestamps: true },
);

clothesSchema.post("save", handleMongoose);

export const Clothes = model("cloth", clothesSchema);
