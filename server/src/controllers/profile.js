const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');
const EmployeeSiteAssignment = require('../models/EmployeeSiteAssignment');
const logger = require('../config/logger');
const { sendOTPEmail } = require('../config/email');
const crypto = require('crypto');

// @desc    Get current user profile
// @route   GET /api/v1/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password -refreshToken');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Get employee profile if exists
  const employeeProfile = await EmployeeProfile.findOne({ user: req.user.id });

  // Get current site assignment
  let currentSite = null;
  if (employeeProfile) {
    const assignment = await EmployeeSiteAssignment.findOne({
      employeeProfile: employeeProfile._id,
      endDate: null, // Current assignment has no end date
    })
      .populate('siteId', 'name location description')
      .sort({ startDate: -1 });

    if (assignment) {
      currentSite = {
        site: assignment.siteId,
        wageRatePerDay: assignment.wageRatePerDay,
        wageRatePerMonth: assignment.wageRatePerMonth,
        startDate: assignment.startDate,
      };
    }
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      profile: employeeProfile || null,
      currentSite: currentSite,
    },
  });
});

// @desc    Update profile picture
// @route   PUT /api/v1/profile/picture
// @access  Private
exports.updateProfilePicture = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Update profile picture URL
  user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
  await user.save();

  logger.info(`Profile picture updated for user ${user.email}`);

  res.status(200).json({
    success: true,
    data: {
      profilePicture: user.profilePicture,
    },
    message: 'Profile picture updated successfully',
  });
});

// @desc    Request email change OTP
// @route   POST /api/v1/profile/email/request-otp
// @access  Private
exports.requestEmailChangeOTP = asyncHandler(async (req, res, next) => {
  const { newEmail } = req.body;

  if (!newEmail) {
    return next(new ErrorResponse('Please provide new email', 400));
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email: newEmail });
  if (existingUser) {
    return next(new ErrorResponse('Email already in use', 400));
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Store OTP in user document with expiry (10 minutes)
  const user = await User.findById(req.user.id);
  user.emailChangeOTP = otp;
  user.emailChangeOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.pendingEmail = newEmail;
  await user.save({ validateBeforeSave: false });

  // Send OTP via email
  try {
    await sendOTPEmail(newEmail, otp, 'email_change');
    logger.info(`Email change OTP sent to ${newEmail} for user ${user.email}`);
  } catch (emailError) {
    // Log error but don't fail the request - OTP is still valid
    logger.error(`Failed to send OTP email: ${emailError.message}`);
    
    // If email fails in production, we should still inform the user
    if (process.env.NODE_ENV === 'production') {
      // Clean up the OTP since email failed
      user.emailChangeOTP = undefined;
      user.emailChangeOTPExpiry = undefined;
      user.pendingEmail = undefined;
      await user.save({ validateBeforeSave: false });
      
      return next(new ErrorResponse('Failed to send OTP email. Please try again later.', 500));
    }
  }

  // In development, return OTP (REMOVE IN PRODUCTION)
  const responseData = {
    success: true,
    message: 'OTP sent to your new email address',
  };

  if (process.env.NODE_ENV === 'development') {
    responseData.otp = otp; // Only for testing
    logger.info(`Development OTP for ${user.email}: ${otp}`);
  }

  res.status(200).json(responseData);
});

// @desc    Verify OTP and update email
// @route   POST /api/v1/profile/email/verify-otp
// @access  Private
exports.verifyEmailChangeOTP = asyncHandler(async (req, res, next) => {
  const { otp } = req.body;

  if (!otp) {
    return next(new ErrorResponse('Please provide OTP', 400));
  }

  const user = await User.findById(req.user.id).select('+emailChangeOTP +emailChangeOTPExpiry +pendingEmail');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Check if OTP exists
  if (!user.emailChangeOTP || !user.pendingEmail) {
    return next(new ErrorResponse('No email change request found', 400));
  }

  // Check if OTP is expired
  if (Date.now() > user.emailChangeOTPExpiry) {
    user.emailChangeOTP = undefined;
    user.emailChangeOTPExpiry = undefined;
    user.pendingEmail = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('OTP has expired', 400));
  }

  // Verify OTP
  if (user.emailChangeOTP !== otp) {
    return next(new ErrorResponse('Invalid OTP', 400));
  }

  // Update email
  const oldEmail = user.email;
  user.email = user.pendingEmail;
  user.emailChangeOTP = undefined;
  user.emailChangeOTPExpiry = undefined;
  user.pendingEmail = undefined;
  await user.save();

  logger.info(`Email changed from ${oldEmail} to ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Email updated successfully',
    data: {
      email: user.email,
    },
  });
});

