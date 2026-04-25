const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  role: Joi.string().valid("customer", "admin").default("customer")
});

module.exports = { userSchema };