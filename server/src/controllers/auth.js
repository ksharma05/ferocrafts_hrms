const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Private (Admin/Manager)
exports.register = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  // Prevent managers from creating admin accounts
  if (req.user.role === 'manager' && role === 'admin') {
    return next(
      new ErrorResponse('Managers cannot create admin accounts', 403)
    );
  }

  // Create user
  const user = await User.create({
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

const getCookieOptions = (expiresOverride) => {
  const expireDays = parseInt(process.env.JWT_COOKIE_EXPIRE) || 7;
  const options = {
    expires: expiresOverride || new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  const sameSite = process.env.COOKIE_SAMESITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax');
  const secure = process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === 'true'
    : process.env.NODE_ENV === 'production';

  if (sameSite) {
    options.sameSite = sameSite;
  }

  if (sameSite === 'none') {
    options.secure = true;
  } else {
    options.secure = secure;
  }

  if (process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
  }

  return options;
};

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  const logoutOptions = getCookieOptions(new Date(Date.now() + 10 * 1000));

  res.cookie('accessToken', 'none', logoutOptions);
  res.cookie('refreshToken', 'none', logoutOptions);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Refresh access token
// @route     POST /api/v1/auth/refresh
// @access    Public (requires valid refresh token)
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new ErrorResponse('Refresh token not found', 401));
  }

  try {
    // Verify refresh token
    const decoded = require('jsonwebtoken').verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    // Get user and check token version
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if token version matches (for revocation)
    if (decoded.tokenVersion !== user.refreshTokenVersion) {
      return next(new ErrorResponse('Invalid refresh token', 401));
    }

    // Generate new access token
    const accessToken = user.getSignedAccessToken();

    // Optionally rotate refresh token (security best practice)
    const newRefreshToken = user.getSignedRefreshToken();

    const cookieOptions = getCookieOptions();

    res
      .status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .cookie('refreshToken', newRefreshToken, cookieOptions)
      .json({
        success: true,
        message: 'Token refreshed successfully',
      });
  } catch (err) {
    return next(new ErrorResponse('Invalid or expired refresh token', 401));
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const accessToken = user.getSignedAccessToken();
  const refreshToken = user.getSignedRefreshToken();

  const options = getCookieOptions();

  res
    .status(statusCode)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
};
