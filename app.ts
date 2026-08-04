import express from "express";
import cors from "cors";
import { errorRoute, notFoundRoute } from "./router/ErrorRouter";
import authRoute from "./router/api/auth";
import userRoute from "./router/api/user";
import clothesRoute from "./router/api/clothes";
import outfitRoute from "./router/api/outfit";
import wishlistRoute from "./router/api/wishlist";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", clothesRoute);
app.use("/api", outfitRoute);
app.use("/api", wishlistRoute);

app.use(notFoundRoute);
app.use(errorRoute);

export default app;
