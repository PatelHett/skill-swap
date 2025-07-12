import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Swap from "../models/Swap.model.js";
import User from "../models/Users.model.js";
import Skill from "../models/Skills.model.js";

// Create a new swap request
const createSwapRequest = asyncHandler(async (req, res) => {
  const { recipientId, offeredSkillIds, wantedSkillIds, message } = req.body;
  const requesterId = req.user._id;

  // Validate required fields
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

  // Check if requester is trying to swap with themselves
  if (requesterId.toString() === recipientId) {
    throw new ApiError(400, "Cannot create swap request with yourself");
  }

  // Validate that recipient exists
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    throw new ApiError(404, "Recipient user not found");
  }

  // Validate that all skills exist
  const offeredSkills = await Skill.find({ _id: { $in: offeredSkillIds } });
  const wantedSkills = await Skill.find({ _id: { $in: wantedSkillIds } });

  if (
    offeredSkills.length !== offeredSkillIds.length ||
    wantedSkills.length !== wantedSkillIds.length
  ) {
    throw new ApiError(404, "One or more skills not found");
  }

  // Check if requester has all the offered skills
  const requester = await User.findById(requesterId);
  const requesterHasAllOfferedSkills = offeredSkillIds.every((skillId) =>
    requester.skillsOffered.includes(skillId)
  );

  if (!requesterHasAllOfferedSkills) {
    throw new ApiError(
      400,
      "You don't have all the offered skills in your skills list"
    );
  }

  // Check if recipient has all the wanted skills
  const recipientHasAllWantedSkills = wantedSkillIds.every((skillId) =>
    recipient.skillsOffered.includes(skillId)
  );

  if (!recipientHasAllWantedSkills) {
    throw new ApiError(400, "Recipient doesn't have all the wanted skills");
  }

  // Check if there's already a pending swap between these users for these skills
  // We'll check if any of the skill combinations already exist
  const existingSwap = await Swap.findOne({
    $or: [
      {
        requester: requesterId,
        recipient: recipientId,
        status: "pending",
        $and: [
          { offeredSkills: { $all: offeredSkillIds } },
          { wantedSkills: { $all: wantedSkillIds } },
        ],
      },
      {
        requester: recipientId,
        recipient: requesterId,
        status: "pending",
        $and: [
          { offeredSkills: { $all: wantedSkillIds } },
          { wantedSkills: { $all: offeredSkillIds } },
        ],
      },
    ],
  });

  if (existingSwap) {
    throw new ApiError(
      409,
      "A swap request already exists between you and this user for these skills"
    );
  }

  // Create the swap request
  const swap = await Swap.create({
    requester: requesterId,
    recipient: recipientId,
    offeredSkills: offeredSkillIds,
    wantedSkills: wantedSkillIds,
    message: message || "",
  });

  // Populate the swap with user and skill details
  await swap.populate([
    { path: "requester", select: "username email profilePhoto" },
    { path: "recipient", select: "username email profilePhoto" },
    { path: "offeredSkills", select: "name category" },
    { path: "wantedSkills", select: "name category" },
  ]);

  return res
    .status(201)
    .json(new ApiResponse(201, swap, "Swap request created successfully"));
});

// Accept a swap request
const acceptSwapRequest = asyncHandler(async (req, res) => {
  const { swapId } = req.params;
  const userId = req.user._id;

  const swap = await Swap.findById(swapId);
  if (!swap) {
    throw new ApiError(404, "Swap request not found");
  }

  // Check if user is the recipient of this swap request
  if (swap.recipient.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only accept swap requests sent to you");
  }

  // Check if swap is still pending
  if (swap.status !== "pending") {
    throw new ApiError(400, "This swap request is no longer pending");
  }

  await swap.accept();

  await swap.populate([
    { path: "requester", select: "username email profilePhoto" },
    { path: "recipient", select: "username email profilePhoto" },
    { path: "offeredSkills", select: "name category" },
    { path: "wantedSkills", select: "name category" },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, swap, "Swap request accepted successfully"));
});

// Reject a swap request
const rejectSwapRequest = asyncHandler(async (req, res) => {
  const { swapId } = req.params;
  const userId = req.user._id;

  const swap = await Swap.findById(swapId);
  if (!swap) {
    throw new ApiError(404, "Swap request not found");
  }

  // Check if user is the recipient of this swap request
  if (swap.recipient.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only reject swap requests sent to you");
  }

  // Check if swap is still pending
  if (swap.status !== "pending") {
    throw new ApiError(400, "This swap request is no longer pending");
  }

  // Reject the swap
  await swap.reject();

  // Populate the swap with user and skill details
  await swap.populate([
    { path: "requester", select: "username email profilePhoto" },
    { path: "recipient", select: "username email profilePhoto" },
    { path: "offeredSkills", select: "name category" },
    { path: "wantedSkills", select: "name category" },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, swap, "Swap request rejected successfully"));
});

// Cancel a swap request (only by requester)
const cancelSwapRequest = asyncHandler(async (req, res) => {
  const { swapId } = req.params;
  const { reason } = req.body;
  const userId = req.user._id;

  const swap = await Swap.findById(swapId);
  if (!swap) {
    throw new ApiError(404, "Swap request not found");
  }

  // Check if user is the requester of this swap request
  if (swap.requester.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only cancel swap requests you created");
  }

  // Check if swap is still pending
  if (swap.status !== "pending") {
    throw new ApiError(400, "This swap request is no longer pending");
  }

  // Cancel the swap
  await swap.cancel(userId, reason);

  // Populate the swap with user and skill details
  await swap.populate([
    { path: "requester", select: "username email profilePhoto" },
    { path: "recipient", select: "username email profilePhoto" },
    { path: "offeredSkills", select: "name category" },
    { path: "wantedSkills", select: "name category" },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, swap, "Swap request cancelled successfully"));
});

// Get current user's swap requests (sent by user)
const getCurrentUserSwaps = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, status } = req.query;

  const filter = {
    $or: [{ requester: userId }, { recipient: userId }],
    status: "accepted",
  };

  if (status) {
    filter.status = status;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const swaps = await Swap.find(filter)
    .populate([
      { path: "requester", select: "username email profilePhoto" },
      { path: "recipient", select: "username email profilePhoto" },
      { path: "offeredSkills", select: "name category" },
      { path: "wantedSkills", select: "name category" },
    ])
    .limit(options.limit * 1)
    .skip((options.page - 1) * options.limit)
    .sort({ createdAt: -1 });

  const total = await Swap.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        swaps,
        totalPages: Math.ceil(total / options.limit),
        currentPage: options.page,
        total,
      },
      "Current user swaps retrieved successfully"
    )
  );
});

// Get pending swap requests for current user (received by user)
const getPendingSwapRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const swaps = await Swap.find({
    recipient: userId,
    status: "pending",
  })
    .populate([
      { path: "requester", select: "username email profilePhoto" },
      { path: "offeredSkills", select: "name category" },
      { path: "wantedSkills", select: "name category" },
    ])
    .limit(options.limit * 1)
    .skip((options.page - 1) * options.limit)
    .sort({ createdAt: -1 });

  const total = await Swap.countDocuments({
    recipient: userId,
    status: "pending",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        swaps,
        totalPages: Math.ceil(total / options.limit),
        currentPage: options.page,
        total,
      },
      "Pending swap requests retrieved successfully"
    )
  );
});

// Get swap history for current user
const getSwapHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, status } = req.query;

  const filter = {
    $or: [{ requester: userId }, { recipient: userId }],
  };

  if (status) {
    filter.status = status;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const swaps = await Swap.find(filter)
    .populate([
      { path: "requester", select: "username email profilePhoto" },
      { path: "recipient", select: "username email profilePhoto" },
      { path: "offeredSkills", select: "name category" },
      { path: "wantedSkills", select: "name category" },
    ])
    .limit(options.limit * 1)
    .skip((options.page - 1) * options.limit)
    .sort({ createdAt: -1 });

  const total = await Swap.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        swaps,
        totalPages: Math.ceil(total / options.limit),
        currentPage: options.page,
        total,
      },
      "Swap history retrieved successfully"
    )
  );
});

// Get specific swap by ID
const getSwapById = asyncHandler(async (req, res) => {
  const { swapId } = req.params;
  const userId = req.user._id;

  const swap = await Swap.findById(swapId).populate([
    { path: "requester", select: "username email profilePhoto" },
    { path: "recipient", select: "username email profilePhoto" },
    { path: "offeredSkills", select: "name category" },
    { path: "wantedSkills", select: "name category" },
  ]);

  if (!swap) {
    throw new ApiError(404, "Swap request not found");
  }

  // Check if user is involved in this swap
  if (
    swap.requester.toString() !== userId.toString() &&
    swap.recipient.toString() !== userId.toString()
  ) {
    throw new ApiError(403, "You can only view swaps you're involved in");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, swap, "Swap retrieved successfully"));
});

export {
  createSwapRequest,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  getCurrentUserSwaps,
  getPendingSwapRequests,
  getSwapHistory,
  getSwapById,
};
