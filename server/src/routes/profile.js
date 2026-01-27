const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfilePicture,
  requestEmailChangeOTP,
  verifyEmailChangeOTP,
} = require('../controllers/profile');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  requestEmailChangeOTP: requestEmailChangeOTPSchema,
  verifyEmailChangeOTP: verifyEmailChangeOTPSchema,
} = require('../validators/profile.validator');
const { upload } = require('../middleware/upload');

// All routes are protected
router.use(protect);

// Profile routes
router.get('/', getProfile);

// Profile picture upload
router.put(
  '/picture',
  upload.single('profilePicture'),
  updateProfilePicture
);

// Email change with OTP verification
router.post(
  '/email/request-otp',
  validate(requestEmailChangeOTPSchema),
  requestEmailChangeOTP
);

router.post(
  '/email/verify-otp',
  validate(verifyEmailChangeOTPSchema),
  verifyEmailChangeOTP
);

module.exports = router;

