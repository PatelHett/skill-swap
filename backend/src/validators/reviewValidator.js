import Joi from "joi";

const reviewValidationSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.integer": "Rating must be a whole number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot exceed 5",
    "any.required": "Rating is required",
  }),
  comment: Joi.string().trim().max(500).optional().messages({
    "string.max": "Comment cannot exceed 500 characters",
  }),
  swapId: Joi.string().optional(),
  reviewedUser: Joi.when("swapId", {
    is: Joi.exist(),
    then: Joi.string().optional(),
    otherwise: Joi.string().required().messages({
      "any.required": "reviewedUser is required if swapId is not provided",
    }),
  }),
});

const reviewUpdateSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional().messages({
    "number.base": "Rating must be a number",
    "number.integer": "Rating must be a whole number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot exceed 5",
  }),
  comment: Joi.string().trim().max(500).optional().messages({
    "string.max": "Comment cannot exceed 500 characters",
  }),
});

export { reviewValidationSchema, reviewUpdateSchema };
