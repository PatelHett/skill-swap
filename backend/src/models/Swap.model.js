import mongoose from "mongoose";

const swapSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    offeredSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: true,
      },
    ],
    wantedSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
swapSchema.index({ requester: 1, status: 1 });
swapSchema.index({ recipient: 1, status: 1 });
swapSchema.index({ status: 1, createdAt: -1 });
swapSchema.index({ requester: 1, recipient: 1 });

// Virtual for checking if swap is active
swapSchema.virtual("isActive").get(function () {
  return ["pending", "accepted"].includes(this.status);
});

// Method to accept a swap
swapSchema.methods.accept = function () {
  this.status = "accepted";
  return this.save();
};

// Method to reject a swap
swapSchema.methods.reject = function () {
  this.status = "rejected";
  return this.save();
};

// Method to complete a swap
swapSchema.methods.complete = function () {
  this.status = "accepted";
  this.completedAt = new Date();
  return this.save();
};

// Method to cancel a swap
swapSchema.methods.cancel = function (userId, reason) {
  this.status = "rejected";
  this.cancelledAt = new Date();
  this.cancelledBy = userId;
  this.cancellationReason = reason;
  return this.save();
};

const Swap = mongoose.model("Swap", swapSchema);

export default Swap;
