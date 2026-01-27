const Joi = require('joi');

// Request email change OTP
const requestEmailChangeOTP = Joi.object({
  newEmail: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'New email is required',
  }),
});

// Verify OTP for email change
const verifyEmailChangeOTP = Joi.object({
  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    'string.length': 'OTP must be 6 digits',
    'string.pattern.base': 'OTP must contain only numbers',
    'any.required': 'OTP is required',
  }),
});

module.exports = {
  requestEmailChangeOTP,
  verifyEmailChangeOTP,
};

