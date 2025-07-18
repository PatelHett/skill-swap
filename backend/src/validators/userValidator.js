import Joi from "joi";

const userValidationSchema = Joi.object({
  // username: Joi.string().trim().required(),

  email: Joi.string().email().lowercase().required(),

  password: Joi.string().min(6).required(),
});

export default userValidationSchema;
