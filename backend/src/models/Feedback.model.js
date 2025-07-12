import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Prevent duplicate feedback from same user to same user
feedbackSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

// Prevent users from giving feedback to themselves
feedbackSchema.pre("save", function (next) {
  if (this.fromUser.toString() === this.toUser.toString()) {
    return next(new Error("Users cannot give feedback to themselves"));
  }
  next();
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
