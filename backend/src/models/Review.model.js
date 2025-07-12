import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    swapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Swap",
      required: false, // Make swapId optional
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews for the same swap
reviewSchema.index(
  { reviewer: 1, reviewedUser: 1, swapId: 1 },
  { unique: true, sparse: true }
);

// Index for efficient queries
reviewSchema.index({ reviewedUser: 1, isActive: 1 });
reviewSchema.index({ reviewer: 1, isActive: 1 });
reviewSchema.index({ rating: 1 });

// Virtual for formatted rating
reviewSchema.virtual("formattedRating").get(function () {
  return this.rating.toFixed(1);
});

// Ensure virtuals are included when converting to JSON
reviewSchema.set("toJSON", { virtuals: true });
reviewSchema.set("toObject", { virtuals: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
