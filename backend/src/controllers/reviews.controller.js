import Review from "../models/Review.model.js";
import User from "../models/Users.model.js";
import Swap from "../models/Swap.model.js";
import { log, ApiError } from "../utils/util.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  reviewValidationSchema,
  reviewUpdateSchema,
} from "../validators/reviewValidator.js";

// Create a new review
const createReview = asyncHandler(async (req, res, next) => {
  log.info("createReview endpoint hit");

  try {
    const { error } = reviewValidationSchema.validate(req.body);
    if (error) {
      return next(new ApiError(400, error.details[0].message));
    }

    const { rating, comment, swapId, reviewedUser } = req.body;
    const reviewerId = req.user._id;
    let reviewedUserId;

    if (swapId) {
      // Check if swap exists and is completed
      const swap = await Swap.findById(swapId);
      if (!swap) {
        return next(new ApiError(404, "Swap not found"));
      }
      if (swap.status !== "accepted") {
        return next(new ApiError(400, "Can only review completed swaps"));
      }
      // Determine the user being reviewed (the other person in the swap)
      reviewedUserId = swap.requester.equals(reviewerId)
        ? swap.recipient
        : swap.requester;
      // Check if user is trying to review themselves
      if (reviewerId.equals(reviewedUserId)) {
        return next(new ApiError(400, "Cannot review yourself"));
      }
      // Check if user is part of this swap
      if (
        !swap.requester.equals(reviewerId) &&
        !swap.recipient.equals(reviewerId)
      ) {
        return next(
          new ApiError(403, "You can only review swaps you participated in")
        );
      }
      // Check if review already exists for this swap and reviewer
      const existingReview = await Review.findOne({
        reviewer: reviewerId,
        swapId: swapId,
        isActive: true,
      });
      if (existingReview) {
        return next(new ApiError(400, "You have already reviewed this swap"));
      }
    } else {
      // No swapId: reviewedUser must be provided
      if (!reviewedUser) {
        return next(
          new ApiError(
            400,
            "reviewedUser is required if swapId is not provided"
          )
        );
      }
      reviewedUserId = reviewedUser;
      // Check if user is trying to review themselves
      if (reviewerId.equals(reviewedUserId)) {
        return next(new ApiError(400, "Cannot review yourself"));
      }
      // Check if review already exists for this reviewer and reviewedUser (general review)
      const existingReview = await Review.findOne({
        reviewer: reviewerId,
        reviewedUser: reviewedUserId,
        swapId: { $exists: false },
        isActive: true,
      });
      if (existingReview) {
        return next(new ApiError(400, "You have already reviewed this user"));
      }
    }

    // Create the review
    const review = await Review.create({
      reviewer: reviewerId,
      reviewedUser: reviewedUserId,
      rating,
      comment,
      ...(swapId ? { swapId } : {}),
    });

    // Populate reviewer and reviewed user details
    await review.populate([
      { path: "reviewer", select: "username email profilePhoto" },
      { path: "reviewedUser", select: "username email profilePhoto" },
    ]);

    // Update the reviewed user's average rating and total reviews
    await updateUserRatingStats(reviewedUserId);

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    log.error("Error in createReview", error);
    log.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    next(error);
  }
});

// Update a review
const updateReview = asyncHandler(async (req, res, next) => {
  log.info("updateReview endpoint hit");

  try {
    const { reviewId } = req.params;
    const { error } = reviewUpdateSchema.validate(req.body);
    if (error) {
      return next(new ApiError(400, error.details[0].message));
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new ApiError(404, "Review not found"));
    }

    // Check if user owns this review
    if (!review.reviewer.equals(req.user._id)) {
      return next(new ApiError(403, "You can only update your own reviews"));
    }

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $set: req.body },
      { new: true }
    ).populate([
      { path: "reviewer", select: "username email profilePhoto" },
      { path: "reviewedUser", select: "username email profilePhoto" },
    ]);

    // Update the reviewed user's average rating and total reviews
    await updateUserRatingStats(review.reviewedUser);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    log.error("Error in updateReview", error);
    next(error);
  }
});

// Delete a review (soft delete)
const deleteReview = asyncHandler(async (req, res, next) => {
  log.info("deleteReview endpoint hit");

  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new ApiError(404, "Review not found"));
    }

    // Check if user owns this review or is admin
    if (!review.reviewer.equals(req.user._id) && req.user.role !== "admin") {
      return next(new ApiError(403, "You can only delete your own reviews"));
    }

    // Soft delete the review
    await Review.findByIdAndUpdate(reviewId, { isActive: false });

    // Update the reviewed user's average rating and total reviews
    await updateUserRatingStats(review.reviewedUser);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    log.error("Error in deleteReview", error);
    next(error);
  }
});

// Get all reviews for a specific user
const getUserReviews = asyncHandler(async (req, res, next) => {
  log.info("getUserReviews endpoint hit");

  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return next(new ApiError(400, "Invalid pagination parameters"));
    }

    // Validate sort parameters
    const allowedSortFields = ["rating", "createdAt", "updatedAt"];
    const allowedSortOrders = ["asc", "desc"];

    if (!allowedSortFields.includes(sortBy)) {
      return next(new ApiError(400, "Invalid sort field"));
    }

    if (!allowedSortOrders.includes(sortOrder)) {
      return next(new ApiError(400, "Invalid sort order"));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate skip value
    const skip = (pageNum - 1) * limitNum;

    // Get reviews
    const reviews = await Review.find({
      reviewedUser: userId,
      isActive: true,
    })
      .populate("reviewer", "username email profilePhoto")
      .populate("reviewedUser", "username email profilePhoto")
      .populate("swapId", "offeredSkills wantedSkills")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Review.countDocuments({
      reviewedUser: userId,
      isActive: true,
    });

    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: pageNum,
          totalPages,
          total,
          limit: limitNum,
          hasNextPage,
          hasPrevPage,
        },
        userStats: {
          averageRating: user.averageRating,
          totalReviews: user.totalReviews,
        },
      },
      message: "User reviews retrieved successfully",
    });
  } catch (error) {
    log.error("Error in getUserReviews", error);
    next(error);
  }
});

// Get average rating for a specific user
const getUserAverageRating = asyncHandler(async (req, res, next) => {
  log.info("getUserAverageRating endpoint hit");

  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    return res.status(200).json({
      success: true,
      data: {
        averageRating: user.averageRating,
        totalReviews: user.totalReviews,
        formattedRating: user.averageRating.toFixed(1),
      },
      message: "User rating stats retrieved successfully",
    });
  } catch (error) {
    log.error("Error in getUserAverageRating", error);
    next(error);
  }
});

// Get reviews written by a specific user
const getReviewsByUser = asyncHandler(async (req, res, next) => {
  log.info("getReviewsByUser endpoint hit");

  try {
    const { userId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return next(new ApiError(400, "Invalid pagination parameters"));
    }

    // Validate sort parameters
    const allowedSortFields = ["rating", "createdAt", "updatedAt"];
    const allowedSortOrders = ["asc", "desc"];

    if (!allowedSortFields.includes(sortBy)) {
      return next(new ApiError(400, "Invalid sort field"));
    }

    if (!allowedSortOrders.includes(sortOrder)) {
      return next(new ApiError(400, "Invalid sort order"));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate skip value
    const skip = (pageNum - 1) * limitNum;

    // Get reviews written by the user
    const reviews = await Review.find({
      reviewer: userId,
      isActive: true,
    })
      .populate("reviewer", "username email profilePhoto")
      .populate("reviewedUser", "username email profilePhoto")
      .populate("swapId", "offeredSkills wantedSkills")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Review.countDocuments({
      reviewer: userId,
      isActive: true,
    });

    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: pageNum,
          totalPages,
          total,
          limit: limitNum,
          hasNextPage,
          hasPrevPage,
        },
      },
      message: "User's written reviews retrieved successfully",
    });
  } catch (error) {
    log.error("Error in getReviewsByUser", error);
    next(error);
  }
});

// Helper function to update user rating statistics
const updateUserRatingStats = async (userId) => {
  try {
    const reviews = await Review.find({
      reviewedUser: userId,
      isActive: true,
    });

    if (reviews.length === 0) {
      // No reviews, reset to default values
      await User.findByIdAndUpdate(userId, {
        averageRating: 0,
        totalReviews: 0,
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await User.findByIdAndUpdate(userId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: reviews.length,
    });
  } catch (error) {
    log.error("Error updating user rating stats", error);
  }
};

export const reviews = {
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  getUserAverageRating,
  getReviewsByUser,
};
