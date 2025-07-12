import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    skillId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Skill category is required"],
      trim: true,
    },
    createdBy: {
      type: String,
      required: [true, "Creator information is required"],
      enum: ["admin"],
      default: "admin",
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for better search performance (excluding _id to avoid warning)
skillSchema.index({ name: "text", category: "text" });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
