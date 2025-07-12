import express from "express";
import { auth } from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/register", auth.registerUser);
authRouter.post("/login", auth.loginUser);
authRouter.post("/refresh", auth.refreshAccessToken);
authRouter.post("/logout", auth.logoutUser);

export default authRouter;
