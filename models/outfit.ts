import { Schema } from "mongoose";
import { handleMongoose } from "../utils";
import { model } from "mongoose";

const outfitSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    season: {
      type: [String],
      enum: ["winter", "spring", "summer", "fall"],
    },
    image: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    clothes: {
      type: [Schema.Types.ObjectId],
      ref: "cloth",
      required: [true, "Clothes are required"],
    },
    isOwned: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { versionKey: false, timestamps: true },
);

outfitSchema.post("save", handleMongoose);

export const Outfit = model("outfit", outfitSchema);
