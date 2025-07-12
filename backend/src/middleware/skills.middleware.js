import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Validate skill creation/update data
const validateSkillData = asyncHandler(async (req, res, next) => {
  const { name, category, description } = req.body;

  if (!name || name.trim().length === 0) {
    throw new ApiError(400, "Skill name is required and cannot be empty");
  }

  if (!category || category.trim().length === 0) {
    throw new ApiError(400, "Skill category is required and cannot be empty");
  }

  if (description && description.length > 500) {
    throw new ApiError(400, "Description cannot exceed 500 characters");
  }

  // Sanitize the data
  req.body.name = name.trim();
  req.body.category = category.trim();
  if (description) {
    req.body.description = description.trim();
  }

  next();
});

// Validate skill ID parameter
const validateSkillId = asyncHandler(async (req, res, next) => {
  const { skillId } = req.params;

  if (!skillId || skillId.trim().length === 0) {
    throw new ApiError(400, "Skill ID is required");
  }

  req.params.skillId = skillId.trim();
  next();
});

// Validate search query
const validateSearchQuery = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    throw new ApiError(400, "Search query is required");
  }

  if (q.trim().length < 2) {
    throw new ApiError(400, "Search query must be at least 2 characters long");
  }

  req.query.q = q.trim();
  next();
});

// Validate user ID parameter
const validateUserId = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId || userId.trim().length === 0) {
    throw new ApiError(400, "User ID is required");
  }

  // Check if userId is a valid MongoDB ObjectId format
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  if (!objectIdPattern.test(userId.trim())) {
    throw new ApiError(400, "Invalid user ID format");
  }

  req.params.userId = userId.trim();
  next();
});

export {
  validateSkillData,
  validateSkillId,
  validateSearchQuery,
  validateUserId,
};
