const Joi = require('joi');

/**
 * Validation schemas for authentication endpoints
 */

// Password must contain at least one uppercase, lowercase, number, and special character
const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
    'any.required': 'Password is required',
  });

const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: passwordSchema,
  role: Joi.string()
    .valid('employee', 'manager', 'admin')
    .default('employee')
    .messages({
      'any.only': 'Role must be either employee, manager, or admin',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
};

