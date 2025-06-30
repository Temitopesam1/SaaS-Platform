const Joi = require('joi');

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  first_name: Joi.string().min(1).required(),
  last_name: Joi.string().min(1).required(),
  role: Joi.string().valid('admin', 'user').required()
});

module.exports = { createUserSchema };
