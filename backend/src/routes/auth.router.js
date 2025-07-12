import express from "express";
import { auth } from "../controllers/auth.controller.js";
import { verifyAccessToken } from "../middleware/middleware.js";
const authRouter = express.Router();

authRouter.get("/check-username", auth.checkUsername);
authRouter.post("/register", auth.registerUser);
authRouter.post("/login", auth.loginUser);
authRouter.post("/refresh", auth.refreshAccessToken);
authRouter.post("/logout", auth.logoutUser);
authRouter.post("/forgot-password", auth.forgotPassword);
authRouter.post("/verify-reset-code", auth.verifyResetCode);
authRouter.post("/reset-password", auth.resetPassword);
authRouter.post("/forgot-username", auth.forgotUsername);
authRouter.post(
  "/toggle-profile-visibility",
  verifyAccessToken,
  auth.toggleProfileVisibility
);

authRouter.get("/profile/:username", auth.getUserProfile);
authRouter.put("/profile", verifyAccessToken, auth.updateUserProfile);

export default authRouter;
