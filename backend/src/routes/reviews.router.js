import express from "express";
import { reviews } from "../controllers/reviews.controller.js";
import { verifyAccessToken } from "../middleware/middleware.js";

const reviewsRouter = express.Router();

// All routes require authentication
reviewsRouter.use(verifyAccessToken);

// Create a new review
reviewsRouter.post("/", reviews.createReview);

// Update a review
reviewsRouter.put("/:reviewId", reviews.updateReview);

// Delete a review (soft delete)
reviewsRouter.delete("/:reviewId", reviews.deleteReview);

// Get all reviews for a specific user
reviewsRouter.get("/user/:userId", reviews.getUserReviews);

// Get average rating for a specific user
reviewsRouter.get("/user/:userId/rating", reviews.getUserAverageRating);

// Get reviews written by a specific user
reviewsRouter.get("/by-user/:userId", reviews.getReviewsByUser);

export default reviewsRouter;
