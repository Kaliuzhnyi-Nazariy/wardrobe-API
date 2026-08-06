import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.log("No mongo uri");
  process.exit(1);
}

mongoose.set("strictQuery", true);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3001, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error: Error) => {
    console.log(error);
    process.exit(1);
  });
