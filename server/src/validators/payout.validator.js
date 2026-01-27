const Joi = require('joi');

/**
 * Validation schemas for payout endpoints
 */

const generatePayoutSchema = Joi.object({
  employeeId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid employee ID',
    }),
  period: Joi.string()
    .pattern(/^\d{4}-(0[1-9]|1[0-2])$/)
    .required()
    .messages({
      'string.pattern.base': 'Period must be in YYYY-MM format (e.g., 2024-01)',
      'any.required': 'Period is required',
    }),
});

module.exports = {
  generatePayoutSchema,
};

