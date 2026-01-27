const Joi = require('joi');

/**
 * Validation schemas for site endpoints
 */

const createSiteSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(100)
    .messages({
      'any.required': 'Site name is required',
      'string.min': 'Site name must be at least 2 characters',
      'string.max': 'Site name must not exceed 100 characters',
    }),
  location: Joi.string()
    .required()
    .min(2)
    .max(200)
    .messages({
      'any.required': 'Site location is required',
      'string.min': 'Location must be at least 2 characters',
      'string.max': 'Location must not exceed 200 characters',
    }),
  description: Joi.string()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description must not exceed 500 characters',
    }),
});

const updateSiteSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  location: Joi.string().min(2).max(200).optional(),
  description: Joi.string().max(500).allow('').optional(),
}).min(1); // At least one field must be present

const assignEmployeeToSiteSchema = Joi.object({
  employeeId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid employee ID',
      'any.required': 'Employee ID is required',
    }),
  siteId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please provide a valid site ID',
      'any.required': 'Site ID is required',
    }),
  startDate: Joi.date()
    .required()
    .messages({
      'any.required': 'Start date is required',
    }),
  endDate: Joi.date()
    .greater(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.greater': 'End date must be after start date',
    }),
  wageRatePerDay: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.positive': 'Wage rate per day must be a positive number',
    }),
  wageRatePerMonth: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.positive': 'Wage rate per month must be a positive number',
    }),
}).or('wageRatePerDay', 'wageRatePerMonth').messages({
  'object.missing': 'Either wage rate per day or wage rate per month must be provided',
});

module.exports = {
  createSiteSchema,
  updateSiteSchema,
  assignEmployeeToSiteSchema,
};

