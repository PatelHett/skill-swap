import { Router } from "express";
import {
  createSwapRequest,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  getCurrentUserSwaps,
  getPendingSwapRequests,
  getSwapHistory,
  getSwapById,
} from "../controllers/swap.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import {
  validateSwapRequest,
  validateSwapId,
  validatePagination,
  validateStatusFilter,
  validateCancelRequest,
} from "../middleware/swap.middleware.js";

const router = Router();

// Apply JWT verification middleware to all swap routes
router.use(verifyJWT);

// Create a new swap request
router.post("/request", validateSwapRequest, createSwapRequest);

// Get current user's swap requests (sent by user)
router.get(
  "/current",
  validatePagination,
  validateStatusFilter,
  getCurrentUserSwaps
);

// Get pending swap requests for current user (received by user)
router.get("/pending", validatePagination, getPendingSwapRequests);

// Get swap history for current user
router.get(
  "/history",
  validatePagination,
  validateStatusFilter,
  getSwapHistory
);

// Get specific swap by ID
router.get("/:swapId", validateSwapId, getSwapById);

// Accept a swap request
router.put("/:swapId/accept", validateSwapId, acceptSwapRequest);

// Reject a swap request
router.put("/:swapId/reject", validateSwapId, rejectSwapRequest);

// Cancel a swap request (only by requester)
router.put(
  "/:swapId/cancel",
  validateSwapId,
  validateCancelRequest,
  cancelSwapRequest
);

export default router;
