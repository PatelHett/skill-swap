import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () =>
      new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRY_MS)), // 7 days from now (this will expire)  , procces env returns string
  },
});

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); //It will now auto-remove the document once expiresAt is passed.

const RefreshToken = new mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
