import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Skill from "../models/Skills.model.js";

// Create a new skill (Admin only)
const createSkill = asyncHandler(async (req, res) => {
  const { name, category, description } = req.body;
  const adminId = req.user?._id;

  if (!name || !category) {
    throw new ApiError(400, "Name and category are required");
  }

  // Generate skill ID (you can customize this logic)
  const skillId = `skill_${name.toLowerCase().replace(/\s+/g, "_")}`;

  // Check if skill already exists
  const existingSkill = await Skill.findOne({ skillId });
  if (existingSkill) {
    throw new ApiError(409, "Skill with this name already exists");
  }

  const skill = await Skill.create({
    skillId,
    name,
    category,
    description,
    createdBy: "admin",
    creatorId: adminId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, skill, "Skill created successfully by admin"));
});

// Get all skills with filtering and pagination
const getAllSkills = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, search, isActive } = req.query;

  const filter = {};

  // Add category filter
  if (category) {
    filter.category = category;
  }

  // Add search filter
  if (search) {
    filter.$text = { $search: search };
  }

  // Add active status filter
  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };

  const skills = await Skill.find(filter)
    .limit(options.limit * 1)
    .skip((options.page - 1) * options.limit)
    .sort(options.sort);

  const total = await Skill.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        skills,
        totalPages: Math.ceil(total / options.limit),
        currentPage: options.page,
        total,
      },
      "Skills retrieved successfully"
    )
  );
});

// Get skill by ID
const getSkillById = asyncHandler(async (req, res) => {
  const { skillId } = req.params;

  const skill = await Skill.findOne({ skillId });
  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, skill, "Skill retrieved successfully"));
});

// Update skill (Admin only)
const updateSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.params;
  const { name, category, description, isActive } = req.body;

  const skill = await Skill.findOne({ skillId });
  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  const updatedSkill = await Skill.findOneAndUpdate(
    { skillId },
    {
      $set: {
        ...(name && { name }),
        ...(category && { category }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedSkill, "Skill updated successfully by admin")
    );
});

// Delete skill (Admin only)
const deleteSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.params;

  const skill = await Skill.findOne({ skillId });
  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  await Skill.findOneAndDelete({ skillId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Skill deleted successfully by admin"));
});

// Get skills by category
const getSkillsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const skills = await Skill.find({
    category: { $regex: category, $options: "i" },
    isActive: true,
  })
    .limit(options.limit * 1)
    .skip((options.page - 1) * options.limit)
    .sort({ createdAt: -1 });

  const total = await Skill.countDocuments({
    category: { $regex: category, $options: "i" },
    isActive: true,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        skills,
        totalPages: Math.ceil(total / options.limit),
        currentPage: options.page,
        total,
      },
      "Skills by category retrieved successfully"
    )
  );
});

// Search skills
const searchSkills = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q) {
    throw new ApiError(400, "Search query is required");
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const skills = await Skill.find({
    $text: { $search: q },
    isActive: true,
  })
    .limit(options.limit * 1)
    .skip((options.page - 1) * options.limit)
    .sort({ score: { $meta: "textScore" } });

  const total = await Skill.countDocuments({
    $text: { $search: q },
    isActive: true,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        skills,
        totalPages: Math.ceil(total / options.limit),
        currentPage: options.page,
        total,
      },
      "Skills search completed successfully"
    )
  );
});

// Get skills by user ID
const getSkillsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const skills = await Skill.find({
    creatorId: userId,
    isActive: true,
  })
    .limit(options.limit * 1)
    .skip((options.page - 1) * options.limit)
    .sort({ createdAt: -1 });

  const total = await Skill.countDocuments({
    creatorId: userId,
    isActive: true,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        skills,
        totalPages: Math.ceil(total / options.limit),
        currentPage: options.page,
        total,
        userId,
      },
      "Skills by user retrieved successfully"
    )
  );
});

export {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  getSkillsByCategory,
  searchSkills,
  getSkillsByUserId,
};
