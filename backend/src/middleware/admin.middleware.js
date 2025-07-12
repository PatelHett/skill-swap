import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Middleware to check if user is admin
const verifyAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  if (user.role !== "admin") {
    throw new ApiError(403, "Access denied. Admin privileges required");
  }

  next();
});

export { verifyAdmin };
