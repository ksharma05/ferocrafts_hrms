const Joi = require('joi');

/**
 * Validation schemas for attendance endpoints
 */

const checkInSchema = Joi.object({
  selfieUrl: Joi.any()
    .optional() // Optional because it comes from req.file, not req.body
    .messages({
      'any.unknown': 'Selfie is required for check-in',
    }),
  location: Joi.object({
    type: Joi.string()
      .valid('Point')
      .required(),
    coordinates: Joi.array()
      .items(Joi.number())
      .length(2)
      .required()
      .messages({
        'array.length': 'Coordinates must contain exactly 2 values [longitude, latitude]',
      }),
  }).required().messages({
    'any.required': 'Location is required for check-in',
  }),
});

const alterAttendanceSchema = Joi.object({
  checkInTime: Joi.date().optional(),
  checkOutTime: Joi.date().optional(),
  alterationReason: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Alteration reason must be at least 10 characters',
      'string.max': 'Alteration reason must not exceed 500 characters',
      'any.required': 'Alteration reason is required',
    }),
}).min(2); // At least one time field + reason

const approveRejectSchema = Joi.object({
  notes: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Notes must not exceed 500 characters',
    }),
});

module.exports = {
  checkInSchema,
  alterAttendanceSchema,
  approveRejectSchema,
};

