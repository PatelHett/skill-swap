import jwt from "jsonwebtoken";
import { ApiError, log } from "../utils/util.js";

const verifyAccessToken = (req, res, next) => {
  log.info("verifyAccessToken middleware hit");

  // Check for token in cookies first, then in Authorization header
  let token = req.cookies?.accessToken;

  if (!token) {
    // Check Authorization header for Bearer token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }

  if (!token) {
    log.warn("Access token missing from cookies and Authorization header");
    return next(new ApiError(401, "Access token missing. Please login."));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // attach decoded info to request
    next(); // proceed to the next handler
  } catch (err) {
    log.error("Access token invalid or expired", err);
    return next(new ApiError(401, "Invalid or expired access token"));
  }
};

export default verifyAccessToken;
