import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// Validate swap request data
const validateSwapRequest = asyncHandler(async (req, res, next) => {
  const { recipientId, offeredSkillIds, wantedSkillIds, message } = req.body;

  // Check required fields
  if (!recipientId || !offeredSkillIds || !wantedSkillIds) {
    throw new ApiError(
      400,
      "Recipient ID, offered skills, and wanted skills are required"
    );
  }

  // Validate that offeredSkillIds and wantedSkillIds are arrays
  if (!Array.isArray(offeredSkillIds) || !Array.isArray(wantedSkillIds)) {
    throw new ApiError(400, "Offered skills and wanted skills must be arrays");
  }

  // Validate that arrays are not empty
  if (offeredSkillIds.length === 0 || wantedSkillIds.length === 0) {
    throw new ApiError(
      400,
      "Offered skills and wanted skills arrays cannot be empty"
    );
  }

  // Validate ObjectId format for recipient
  if (!mongoose.Types.ObjectId.isValid(recipientId)) {
    throw new ApiError(400, "Invalid recipient ID format");
  }

  // Validate ObjectId format for all skill IDs
  const allSkillIds = [...offeredSkillIds, ...wantedSkillIds];
  for (const skillId of allSkillIds) {
    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      throw new ApiError(400, "Invalid skill ID format");
    }
  }

  // Validate message length if provided
  if (message && message.length > 500) {
    throw new ApiError(400, "Message cannot exceed 500 characters");
  }

  next();
});

// Validate swap ID parameter
const validateSwapId = asyncHandler(async (req, res, next) => {
  const { swapId } = req.params;

  if (!swapId) {
    throw new ApiError(400, "Swap ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(swapId)) {
    throw new ApiError(400, "Invalid swap ID format");
  }

  next();
});

// Validate pagination parameters
const validatePagination = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    throw new ApiError(400, "Page must be a positive number");
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    throw new ApiError(400, "Limit must be between 1 and 100");
  }

  next();
});

// Validate status filter
const validateStatusFilter = asyncHandler(async (req, res, next) => {
  const { status } = req.query;
  const validStatuses = [
    "pending",
    "accepted",
    "rejected",
    "completed",
    "cancelled",
  ];

  if (status && !validStatuses.includes(status)) {
    throw new ApiError(
      400,
      "Invalid status filter. Valid statuses: " + validStatuses.join(", ")
    );
  }

  next();
});

// Validate cancel swap request
const validateCancelRequest = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  if (reason && reason.length > 200) {
    throw new ApiError(400, "Cancellation reason cannot exceed 200 characters");
  }

  next();
});

export {
  validateSwapRequest,
  validateSwapId,
  validatePagination,
  validateStatusFilter,
  validateCancelRequest,
};
