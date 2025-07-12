import jwt from "jsonwebtoken";
import { ApiError, log } from "../utils/util.js";

const verifyAccessToken = (req, res, next) => {
  log.info("verifyAccessToken middleware hit");

  const token = req.cookies?.accessToken;

  if (!token) {
    log.warn("Access token missing from cookies");
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
