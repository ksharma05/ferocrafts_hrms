const Joi = require('joi');

/**
 * Validation schemas for employee endpoints
 */

const createEmployeeSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
  role: Joi.string()
    .valid('employee', 'manager', 'admin')
    .default('employee'),
  name: Joi.string()
    .required()
    .min(2)
    .max(100)
    .messages({
      'any.required': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 100 characters',
    }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be exactly 10 digits',
      'any.required': 'Phone number is required',
    }),
  aadhaarNo: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .required()
    .messages({
      'string.pattern.base': 'Aadhaar number must be exactly 12 digits',
      'any.required': 'Aadhaar number is required',
    }),
  dob: Joi.date()
    .max('now')
    .required()
    .messages({
      'date.max': 'Date of birth cannot be in the future',
      'any.required': 'Date of birth is required',
    }),
  bankDetails: Joi.object({
    accountNumber: Joi.string().allow(''),
    ifscCode: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).allow('').messages({
      'string.pattern.base': 'Please provide a valid IFSC code',
    }),
  }).optional(),
  upiId: Joi.string().allow('').optional(),
});

const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  aadhaarNo: Joi.string().pattern(/^[0-9]{12}$/).optional(),
  dob: Joi.date().max('now').optional(),
  bankDetails: Joi.object({
    accountNumber: Joi.string().allow(''),
    ifscCode: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).allow(''),
  }).optional(),
  upiId: Joi.string().allow('').optional(),
}).min(1); // At least one field must be present

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
};

