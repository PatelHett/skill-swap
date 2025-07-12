import express from "express";
import { users } from "../controllers/users.controller.js";
import { verifyAccessToken } from "../middleware/middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const usersRouter = express.Router();

usersRouter.get("/", users.getAllUsers);

usersRouter.get("/search", users.searchUsers);

usersRouter.get("/:userId", users.getUserById);

export default usersRouter;
