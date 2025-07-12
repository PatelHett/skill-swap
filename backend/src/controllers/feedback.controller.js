import Feedback from "../models/Feedback.model.js";
import User from "../models/Users.model.js";
import { log, ApiError } from "../utils/util.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create feedback for a user
const createFeedback = asyncHandler(async (req, res, next) => {
  log.info("createFeedback endpoint hit");

  const { toUserId, rating, comment } = req.body;
  const fromUserId = req.user._id;

  // Validate required fields
  if (!toUserId || !rating || !comment) {
    return next(
      new ApiError(400, "All fields are required: toUserId, rating, comment")
    );
  }

  // Validate rating range
  if (rating < 1 || rating > 5) {
    return next(new ApiError(400, "Rating must be between 1 and 5"));
  }

  // Validate comment length
  if (comment.length < 1 || comment.length > 500) {
    return next(
      new ApiError(400, "Comment must be between 1 and 500 characters")
    );
  }

  // Check if target user exists
  const targetUser = await User.findById(toUserId);
  if (!targetUser) {
    return next(new ApiError(404, "Target user not found"));
  }

  try {
    // Create the feedback
    const feedback = await Feedback.create({
      fromUser: fromUserId,
      toUser: toUserId,
      rating,
      comment,
    });

    // Populate user details for response
    await feedback.populate([
      { path: "fromUser", select: "username email" },
      { path: "toUser", select: "username email" },
    ]);

    return res.status(201).json({
      success: true,
      data: feedback,
      message: "Feedback created successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(
        new ApiError(409, "You have already given feedback to this user")
      );
    }
    throw error;
  }
});

// Get average review for a specific user
const getUserAverageReview = asyncHandler(async (req, res, next) => {
  log.info("getUserAverageReview endpoint hit");

  const { userId } = req.params;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  // Get all feedback for this user
  const feedbacks = await Feedback.find({ toUser: userId });

  if (feedbacks.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        userId,
        username: user.username,
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
        recentFeedbacks: [],
      },
      message: "No reviews found for this user",
    });
  }

  // Calculate average rating
  const totalRating = feedbacks.reduce(
    (sum, feedback) => sum + feedback.rating,
    0
  );
  const averageRating = totalRating / feedbacks.length;

  // Calculate rating breakdown
  const ratingBreakdown = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  feedbacks.forEach((feedback) => {
    ratingBreakdown[feedback.rating]++;
  });

  // Get recent feedbacks (last 5)
  const recentFeedbacks = await Feedback.find({ toUser: userId })
    .populate("fromUser", "username")
    .sort({ createdAt: -1 })
    .limit(5)
    .select("rating comment createdAt fromUser");

  return res.status(200).json({
    success: true,
    data: {
      userId,
      username: user.username,
      averageRating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
      totalReviews: feedbacks.length,
      ratingBreakdown,
      recentFeedbacks,
    },
    message: "User review data retrieved successfully",
  });
});

// Get all feedback for a specific user (with pagination)
const getUserFeedbacks = asyncHandler(async (req, res, next) => {
  log.info("getUserFeedbacks endpoint hit");

  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  // Validate pagination parameters
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (pageNum < 1 || limitNum < 1 || limitNum > 50) {
    return next(new ApiError(400, "Invalid pagination parameters"));
  }

  const skip = (pageNum - 1) * limitNum;

  // Get feedbacks with pagination
  const feedbacks = await Feedback.find({ toUser: userId })
    .populate("fromUser", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const total = await Feedback.countDocuments({ toUser: userId });

  const totalPages = Math.ceil(total / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  return res.status(200).json({
    success: true,
    data: {
      feedbacks,
      pagination: {
        currentPage: pageNum,
        totalPages,
        total,
        limit: limitNum,
        hasNextPage,
        hasPrevPage,
      },
    },
    message: "User feedbacks retrieved successfully",
  });
});

// Get feedback given by a user
const getFeedbackGivenByUser = asyncHandler(async (req, res, next) => {
  log.info("getFeedbackGivenByUser endpoint hit");

  const fromUserId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  // Validate pagination parameters
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (pageNum < 1 || limitNum < 1 || limitNum > 50) {
    return next(new ApiError(400, "Invalid pagination parameters"));
  }

  const skip = (pageNum - 1) * limitNum;

  // Get feedbacks given by the user
  const feedbacks = await Feedback.find({ fromUser: fromUserId })
    .populate("toUser", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const total = await Feedback.countDocuments({ fromUser: fromUserId });

  const totalPages = Math.ceil(total / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  return res.status(200).json({
    success: true,
    data: {
      feedbacks,
      pagination: {
        currentPage: pageNum,
        totalPages,
        total,
        limit: limitNum,
        hasNextPage,
        hasPrevPage,
      },
    },
    message: "Feedbacks given by user retrieved successfully",
  });
});

export const feedback = {
  createFeedback,
  getUserAverageReview,
  getUserFeedbacks,
  getFeedbackGivenByUser,
};
