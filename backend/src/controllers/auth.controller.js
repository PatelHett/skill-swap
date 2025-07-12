import { log, ApiError, getCookieOptions } from "../utils/util.js";
import { User, RefreshToken } from "../models/model.js";
import { userValidationSchema } from "../validators/validators.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const checkUsername = async (req, res, next) => {
  log.info("checkUsername endpoint hit");

  try {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      log.warn("Username not provided or invalid in query");
      return next(new ApiError(400, "Username query param is required"));
    }

    const user = await User.findOne({ username });

    if (user) {
      log.info(`Username ${username} is already taken`);
      return res.status(200).json({
        available: false,
        message: "Username is already taken",
      });
    }

    log.info(`Username ${username} is available`);
    return res.status(200).json({
      available: true,
      message: "Username is available",
    });
  } catch (error) {
    log.error("Unexpected error in checkUsername", error);
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  log.info("registerUser endpoint hit");

  try {
    if (!req.body || typeof req.body !== "object") {
      log.warn("Empty or invalid request body");
      return next(new ApiError(400, "Request body is missing or invalid"));
    }

    const { error } = userValidationSchema.validate(req.body);

    if (error) {
      log.warn("Validation error while registering user:", error.details);
      return next(new ApiError(400, error.details[0].message));
    }

    const { email, password, username } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      log.warn(`User with email ${email} already exists`);
      return next(new ApiError(400, "User already exists. Please login."));
    }

    const user = new User({ email, password, username });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    log.error("Unexpected error in registerUser", error);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  log.info("loginUser endpoint hit");

  try {
    if (!req.body || typeof req.body !== "object") {
      log.warn("Empty or invalid request body");
      return next(new ApiError(400, "Request body is missing or invalid"));
    }

    const { error } = userValidationSchema.validate(req.body);

    if (error) {
      log.warn("Validation error while logging user in:", error.details);
      return next(new ApiError(400, error.details[0].message));
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }],
    });

    if (!user) {
      log.warn(`No user found with email ${email}`);
      return next(new ApiError(404, "User not found. Please register."));
    }

    const isCorrectPassword = await user.isPasswordCorrect(password);

    if (!isCorrectPassword) {
      log.warn("Invalid credentials provided");
      return next(new ApiError(401, "Invalid email or password"));
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      log.error("Token generation failed");
      return next(new ApiError(500, "Internal server error"));
    }

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
    });

    const loggedUser = user.toObject();
    delete loggedUser.password;
    delete loggedUser.__v;

    return res
      .status(200)
      .cookie(
        "accessToken",
        accessToken,
        getCookieOptions(process.env.ACCESS_TOKEN_EXPIRY_MS)
      )
      .cookie(
        "refreshToken",
        refreshToken,
        getCookieOptions(process.env.REFRESH_TOKEN_EXPIRY_MS)
      )
      .json({
        success: true,
        message: "Login successful",
        user: loggedUser,
        accessToken: accessToken, // Also return token in response for API usage
        refreshToken: refreshToken,
      });
  } catch (error) {
    log.error("Unexpected error in loginUser", error);
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  log.info("refreshAccessToken endpoint hit");

  const receivedToken = req.cookies?.refreshToken;

  if (!receivedToken) {
    log.warn("No refreshToken found in cookies");
    return next(new ApiError(401, "Refresh token not provided"));
  }

  const existingToken = await RefreshToken.findOne({ token: receivedToken });

  if (!existingToken) {
    log.warn("Refresh token not found in database");
    return next(new ApiError(403, "Invalid refresh token"));
  }

  try {
    const decoded = jwt.verify(receivedToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      log.warn("User associated with refresh token not found");
      return next(new ApiError(404, "User not found"));
    }

    const newAccessToken = await user.generateAccessToken();

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY_MS),
      })
      .json({
        success: true,
        message: "Access token refreshed",
      });
  } catch (err) {
    log.error("Refresh token verification failed", err);
    return next(new ApiError(401, "Invalid or expired refresh token"));
  }
};

const logoutUser = async (req, res, next) => {
  log.info("logoutUser endpoint hit");

  const receivedToken = req.cookies?.refreshToken;

  if (!receivedToken) {
    log.warn("No refresh token in logout request");
    return next(new ApiError(400, "No refresh token provided"));
  }

  await RefreshToken.findOneAndDelete({ token: receivedToken });

  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

const forgotPassword = async (req, res, next) => {
  log.info("forgotPassword endpoint hit");

  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      log.warn("Invalid or missing email");
      return next(new ApiError(400, "Email is required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      log.warn(`No user found with email ${email}`);
      return res.status(200).json({
        message: "If your email is registered, a reset code has been sent.",
      });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetCode = resetCode;
    await user.save();

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Skill Swap" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}`,
    };

    await transporter.sendMail(mailOptions);

    log.info(`Reset code sent to ${user.email}`);

    return res.status(200).json({
      message: "If your email is registered, a reset code has been sent.",
    });
  } catch (error) {
    log.error("Unexpected error in forgotPassword", error);
    next(error);
  }
};

const verifyResetCode = async (req, res, next) => {
  log.info("verifyResetCode endpoint hit");

  try {
    const { email, code } = req.body;

    if (!email || !code) {
      log.warn("Missing email or code in request");
      return next(new ApiError(400, "Email and reset code are required"));
    }

    const user = await User.findOne({ email });

    if (!user || user.resetCode !== code) {
      log.warn(`Invalid reset code attempt for email: ${email}`);
      return next(new ApiError(400, "Invalid or expired reset code"));
    }

    log.info(`Reset code verified for user ${email}`);
    return res.status(200).json({
      success: true,
      message: "Reset code verified successfully",
    });
  } catch (error) {
    log.error("Unexpected error in verifyResetCode", error);
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  log.info("resetPassword endpoint hit");

  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      log.warn("Missing required fields in reset-password");
      return next(
        new ApiError(400, "Email, code, and new password are required")
      );
    }

    const user = await User.findOne({ email });

    if (!user || user.resetCode !== code) {
      log.warn(`Invalid reset attempt for email: ${email}`);
      return next(new ApiError(400, "Invalid or expired reset code"));
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the reset code
    user.resetCode = undefined;

    await user.save();

    log.info(`Password reset successful for user ${email}`);
    return res.status(200).json({
      success: true,
      message: "Password updated successfully. Please login.",
    });
  } catch (error) {
    log.error("Unexpected error in resetPassword", error);
    next(error);
  }
};

const forgotUsername = async (req, res, next) => {
  log.info("forgotUsername endpoint hit");

  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      log.warn("Invalid or missing email");
      return next(new ApiError(400, "Email is required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      log.warn(`No user found with email ${email}`);
      return res.status(200).json({
        message: "If your email is registered, your username has been sent.",
      });
    }

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Skill Swap" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Your Username",
      text: `Hi there,\n\nHere is your username: ${user.username}\n\nUse it to log into your account.\n\n- Skill Swap Team`,
    };

    await transporter.sendMail(mailOptions);
    log.info(`Username sent to ${user.email}`);

    return res.status(200).json({
      message: "If your email is registered, your username has been sent.",
    });
  } catch (error) {
    log.error("Unexpected error in forgotUsername", error);
    next(error);
  }
};

const toggleProfileVisibility = async (req, res, next) => {
  log.info("toggleProfileVisibility endpoint hit");

  try {
    const userId = req.user?.id;

    if (!userId) {
      log.warn("Missing user ID in toggleProfileVisibility");
      return next(new ApiError(401, "Unauthorized"));
    }

    const user = await User.findById(userId);

    if (!user) {
      log.warn(`User not found with ID: ${userId}`);
      return next(new ApiError(404, "User not found"));
    }

    // Flip the isPublic flag
    user.isPublic = !user.isPublic;

    await user.save();

    log.info(`User ${user.email} visibility set to ${user.isPublic}`);

    return res.status(200).json({
      message: `Profile visibility updated to ${
        user.isPublic ? "public" : "private"
      }`,
      isPublic: user.isPublic,
    });
  } catch (error) {
    log.error("Error in toggleProfileVisibility", error);
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  log.info("getUserProfile endpoint hit");

  try {
    const { username } = req.params;

    if (!username) {
      log.warn("Missing username param");
      return next(new ApiError(400, "Username is required"));
    }

    const user = await User.findOne({ username, isPublic: true })
      .select("-password -resetCode -__v")
      .populate("skillsOffered skillsWanted");

    if (!user) {
      log.warn(`Public profile not found for username: ${username}`);
      return next(new ApiError(404, "Profile not found or is private"));
    }

    return res.status(200).json({
      success: true,
      profile: user,
    });
  } catch (error) {
    log.error("Error in getUserProfile", error);
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  log.info("updateUserProfile endpoint hit");

  try {
    const userId = req.user?._id;

    if (!userId) {
      log.warn("Missing user ID in request (unauthenticated)");
      return next(new ApiError(401, "Unauthorized"));
    }

    const updates = req.body;

    // Allowed fields only — ignore sensitive/internal
    const allowedFields = [
      "location",
      "profilePhoto",
      "skillsOffered",
      "skillsWanted",
      "availability",
      "isPublic",
    ];

    const filteredUpdates = {};
    for (const key of allowedFields) {
      if (updates.hasOwnProperty(key)) {
        filteredUpdates[key] = updates[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdates },
      { new: true }
    )
      .select("-password -resetCode -__v")
      .populate("skillsOffered skillsWanted");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedUser,
    });
  } catch (error) {
    log.error("Error in updateUserProfile", error);
    next(error);
  }
};

export const auth = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  checkUsername,
  forgotPassword,
  resetPassword,
  verifyResetCode,
  forgotUsername,
  toggleProfileVisibility,
  getUserProfile,
  updateUserProfile,
};
