import express from "express";
import { feedback } from "../controllers/feedback.controller.js";
import { verifyAccessToken } from "../middleware/middleware.js";

const feedbackRouter = express.Router();

// Create feedback (requires authentication)
feedbackRouter.post("/", verifyAccessToken, feedback.createFeedback);

// Get average review for a specific user (public endpoint)
feedbackRouter.get("/user/:userId/average", feedback.getUserAverageReview);

// Get all feedback for a specific user (public endpoint)
feedbackRouter.get("/user/:userId", feedback.getUserFeedbacks);

// Get feedback given by authenticated user (requires authentication)
feedbackRouter.get(
  "/given",
  verifyAccessToken,
  feedback.getFeedbackGivenByUser
);

export default feedbackRouter;
