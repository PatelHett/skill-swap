import { log, ApiError, getCookieOptions } from "../utils/util.js";
import { User, RefreshToken } from "../models/model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res, next) => {
  log.info("registerUser endpoint hit");

  try {
    if (!req.body || typeof req.body !== "object") {
      log.warn("Empty or invalid request body");
      return next(new ApiError(400, "Request body is missing or invalid"));
    }

    const { email, password } = req.body;

    if (!email || !password) {
      log.warn("Missing email or password in registerUser");
      return next(new ApiError(400, "Email and password are required"));
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      log.warn(`User with email ${email} already exists`);
      return next(new ApiError(400, "User already exists. Please login."));
    }

    const user = new User({ email, password });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
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

    const { email, password } = req.body;

    if (!email || !password) {
      log.warn("Missing email or password in loginUser");
      return next(new ApiError(400, "Email and password are required"));
    }

    const user = await User.findOne({ email });

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

export const auth = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
