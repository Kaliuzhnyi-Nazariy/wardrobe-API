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
    // app.listen(3001, () => {
    //   console.log("Database connection successful");
    // });
    app.listen(3001, "0.0.0.0", () => {
      console.log(`Serwer działa na porcie ${3001}`);
    });
  })
  .catch((error: Error) => {
    console.log(error);
    process.exit(1);
  });
