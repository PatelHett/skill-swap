import { Router } from "express";
import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  getSkillsByCategory,
  searchSkills,
  getSkillsByUserId,
} from "../controllers/skills.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import {
  validateSkillData,
  validateSkillId,
  validateSearchQuery,
  validateUserId,
} from "../middleware/skills.middleware.js";

const router = Router();

// Public routes - Specific routes first to avoid conflicts
router.get("/", getAllSkills);
router.get("/search", validateSearchQuery, searchSkills);
router.get("/category/:category", getSkillsByCategory);
router.get("/user/:userId", validateUserId, getSkillsByUserId);

// Protected routes (require authentication and admin privileges)
router.use(verifyJWT); // Apply JWT verification middleware to all routes below
router.use(verifyAdmin); // Apply admin verification middleware to all routes below

router.post("/", validateSkillData, createSkill);

// Parameterized routes after specific routes to avoid conflicts
router.get("/:skillId", validateSkillId, getSkillById);
router.put("/:skillId", validateSkillId, validateSkillData, updateSkill);
router.delete("/:skillId", validateSkillId, deleteSkill);

export default router;
