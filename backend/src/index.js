import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import connectDb from "./db/index.js";
import { errorHandler } from "./utils/util.js";
import { authRouter, skillsRouter, swapRouter, usersRouter, reviewsRouter } from "./routes/router.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());

//routes middleware
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/skills", skillsRouter);
app.use("/api/v1/swaps", swapRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/reviews", reviewsRouter);

//error handler for requests
app.use(errorHandler);

connectDb().then(() => {
  app.listen(PORT || 3000, () => {
    console.log(`Server is running at port : ${PORT}`);
  });
});
