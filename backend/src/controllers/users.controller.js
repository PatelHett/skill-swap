import User from "../models/Users.model.js";
import Swap from "../models/Swap.model.js";
import Skill from "../models/Skills.model.js";
import { log, ApiError } from "../utils/util.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUsers = asyncHandler(async (req, res, next) => {
  log.info("getAllUsers endpoint hit");

  try {
    const {
      page = 1,
      limit = 10,
      role,
      isPublic,
      banned,
      availability,
      location,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    // Show all users except admin users (admin users are hidden from everyone)
    filter.role = { $ne: "admin" };

    // Only show public users to non-admin users
    if (!req.user || req.user?.role !== "admin") {
      filter.isPublic = true;
    }

    // Apply additional filters
    if (role) filter.role = role;
    if (isPublic !== undefined) filter.isPublic = isPublic === "true";
    if (banned !== undefined) filter.banned = banned === "true";
    if (availability) filter.availability = availability;
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return next(new ApiError(400, "Invalid pagination parameters"));
    }

    // Validate sort parameters
    const allowedSortFields = [
      "username",
      "email",
      "location",
      "createdAt",
      "updatedAt",
    ];
    const allowedSortOrders = ["asc", "desc"];

    if (!allowedSortFields.includes(sortBy)) {
      return next(new ApiError(400, "Invalid sort field"));
    }

    if (!allowedSortOrders.includes(sortOrder)) {
      return next(new ApiError(400, "Invalid sort order"));
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate skip value
    const skip = (pageNum - 1) * limitNum;

    // Execute query with population
    const users = await User.find(filter)
      .select("-password -resetCode -__v")
      .populate("skillsOffered", "name category")
      .populate("skillsWanted", "name category")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    // Get swap statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toObject();

        // Get offers made by this user
        const offersMade = await Swap.countDocuments({
          requester: user._id,
          status: { $in: ["pending", "accepted"] },
        });

        // Get requests received by this user
        const requestsReceived = await Swap.countDocuments({
          recipient: user._id,
          status: { $in: ["pending", "accepted"] },
        });

        // Get completed swaps
        const completedSwaps = await Swap.countDocuments({
          $or: [
            { requester: user._id, status: "accepted" },
            { recipient: user._id, status: "accepted" },
          ],
        });

        return {
          ...userObj,
          swapStats: {
            offersMade,
            requestsReceived,
            completedSwaps,
          },
          ratingStats: {
            averageRating: userObj.averageRating,
            totalReviews: userObj.totalReviews,
            formattedRating: userObj.averageRating.toFixed(1),
          },
        };
      })
    );

    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return res.status(200).json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          currentPage: pageNum,
          totalPages,
          total,
          limit: limitNum,
          hasNextPage,
          hasPrevPage,
        },
      },
      message: "Users retrieved successfully",
    });
  } catch (error) {
    log.error("Error in getAllUsers", error);
    next(error);
  }
});

// Search users with advanced filtering
const searchUsers = asyncHandler(async (req, res, next) => {
  log.info("searchUsers endpoint hit");

  try {
    const {
      q, // search query
      page = 1,
      limit = 10,
      role,
      isPublic,
      banned,
      availability,
      location,
      skillOffered, // skill ID they offer
      skillWanted, // skill ID they want
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build search filter
    const filter = {};

    // Show all users except admin users (admin users are hidden from everyone)
    filter.role = { $ne: "admin" };

    // Only show public users to non-admin users
    if (!req.user || req.user?.role !== "admin") {
      filter.isPublic = true;
    }

    // Text search across username, email, location, and skills
    if (q) {
      // First, try to find if the query matches any skill name
      const skill = await Skill.findOne({
        name: { $regex: q, $options: "i" },
      });

      if (skill) {
        // If it's a skill name, search for users who offer this skill
        filter.skillsOffered = skill._id;
      } else {
        // If not a skill name, search across username, email, and location
        filter.$or = [
          { username: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
          { location: { $regex: q, $options: "i" } },
        ];
      }
    }

    // Apply additional filters
    if (role) filter.role = role;
    if (isPublic !== undefined) filter.isPublic = isPublic === "true";
    if (banned !== undefined) filter.banned = banned === "true";
    if (availability) filter.availability = availability;
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Filter by skills offered
    if (skillOffered) {
      filter.skillsOffered = skillOffered;
    }

    // Filter by skills wanted
    if (skillWanted) {
      filter.skillsWanted = skillWanted;
    }

    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
      return next(new ApiError(400, "Invalid pagination parameters"));
    }

    // Validate sort parameters
    const allowedSortFields = [
      "username",
      "email",
      "location",
      "createdAt",
      "updatedAt",
    ];
    const allowedSortOrders = ["asc", "desc"];

    if (!allowedSortFields.includes(sortBy)) {
      return next(new ApiError(400, "Invalid sort field"));
    }

    if (!allowedSortOrders.includes(sortOrder)) {
      return next(new ApiError(400, "Invalid sort order"));
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate skip value
    const skip = (pageNum - 1) * limitNum;

    // Execute query with population
    const users = await User.find(filter)
      .select("-password -resetCode -__v")
      .populate("skillsOffered", "name category")
      .populate("skillsWanted", "name category")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    // Get swap statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toObject();

        // Get offers made by this user
        const offersMade = await Swap.countDocuments({
          requester: user._id,
          status: { $in: ["pending", "accepted"] },
        });

        // Get requests received by this user
        const requestsReceived = await Swap.countDocuments({
          recipient: user._id,
          status: { $in: ["pending", "accepted"] },
        });

        // Get completed swaps
        const completedSwaps = await Swap.countDocuments({
          $or: [
            { requester: user._id, status: "accepted" },
            { recipient: user._id, status: "accepted" },
          ],
        });

        return {
          ...userObj,
          swapStats: {
            offersMade,
            requestsReceived,
            completedSwaps,
          },
          ratingStats: {
            averageRating: userObj.averageRating,
            totalReviews: userObj.totalReviews,
            formattedRating: userObj.averageRating.toFixed(1),
          },
        };
      })
    );

    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return res.status(200).json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          currentPage: pageNum,
          totalPages,
          total,
          limit: limitNum,
          hasNextPage,
          hasPrevPage,
        },
        searchQuery: q || null,
      },
      message: "User search completed successfully",
    });
  } catch (error) {
    log.error("Error in searchUsers", error);
    next(error);
  }
});

// Get user by ID with detailed swap information
const getUserById = asyncHandler(async (req, res, next) => {
  log.info("getUserById endpoint hit");

  try {
    const { userId } = req.params;

    if (!userId) {
      return next(new ApiError(400, "User ID is required"));
    }

    // Find user
    const user = await User.findById(userId)
      .select("-password -resetCode -__v")
      .populate("skillsOffered", "name category description")
      .populate("skillsWanted", "name category description");

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    // Check if user is public (unless admin or viewing own profile)
    if (
      !user.isPublic &&
      req.user?.role !== "admin" &&
      req.user?._id !== userId
    ) {
      return next(new ApiError(404, "User profile not found or is private"));
    }

    // Get detailed swap information
    const [offersMade, requestsReceived, completedSwaps] = await Promise.all([
      // Offers made by this user
      Swap.find({
        requester: user._id,
        status: { $in: ["pending", "accepted"] },
      })
        .populate("recipient", "username email profilePhoto")
        .populate("offeredSkills", "name category")
        .populate("wantedSkills", "name category")
        .sort({ createdAt: -1 })
        .limit(10),

      // Requests received by this user
      Swap.find({
        recipient: user._id,
        status: { $in: ["pending", "accepted"] },
      })
        .populate("requester", "username email profilePhoto")
        .populate("offeredSkills", "name category")
        .populate("wantedSkills", "name category")
        .sort({ createdAt: -1 })
        .limit(10),

      // Completed swaps
      Swap.find({
        $or: [
          { requester: user._id, status: "accepted" },
          { recipient: user._id, status: "accepted" },
        ],
      })
        .populate("requester", "username email profilePhoto")
        .populate("recipient", "username email profilePhoto")
        .populate("offeredSkills", "name category")
        .populate("wantedSkills", "name category")
        .sort({ completedAt: -1 })
        .limit(10),
    ]);

    // Get swap statistics
    const [offersCount, requestsCount, completedCount] = await Promise.all([
      Swap.countDocuments({
        requester: user._id,
        status: { $in: ["pending", "accepted"] },
      }),
      Swap.countDocuments({
        recipient: user._id,
        status: { $in: ["pending", "accepted"] },
      }),
      Swap.countDocuments({
        $or: [
          { requester: user._id, status: "accepted" },
          { recipient: user._id, status: "accepted" },
        ],
      }),
    ]);

    const userObj = user.toObject();
    userObj.swapStats = {
      offersMade: offersCount,
      requestsReceived: requestsCount,
      completedSwaps: completedCount,
    };
    userObj.ratingStats = {
      averageRating: userObj.averageRating,
      totalReviews: userObj.totalReviews,
      formattedRating: userObj.averageRating?.toFixed(1) || "0.0",
    };

    return res.status(200).json({
      success: true,
      data: {
        user: userObj,
        swaps: {
          offersMade,
          requestsReceived,
          completedSwaps,
        },
      },
      message: "User details retrieved successfully",
    });
  } catch (error) {
    log.error("Error in getUserById", error);
    next(error);
  }
});

export const users = {
  getAllUsers,
  searchUsers,
  getUserById,
};
