import log from "./logHandler.js";

const errorHandler = (err, req, res, next) => {
  log.error(`API Error: ${err.message}`);

  if (err.statuscode && err.statuscode >= 400 && err.statuscode < 500) {
    return res.status(err.statuscode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Unexpected server errors
  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
};

export default errorHandler;
