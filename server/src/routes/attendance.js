const express = require('express');
const {
  checkIn,
  checkOut,
  getPendingAttendance,
  approveAttendance,
  rejectAttendance,
  alterAttendance,
  getAttendanceHistory,
} = require('../controllers/attendance');
const validate = require('../middleware/validate');
const { checkInSchema, alterAttendanceSchema, approveRejectSchema } = require('../validators/attendance.validator');
const { uploadSelfie, handleUploadError } = require('../middleware/upload');
const parseCheckInData = require('../middleware/parseCheckInData');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/check-in').post(
  protect,
  authorize('employee'),
  uploadSelfie,
  handleUploadError,
  parseCheckInData,
  validate(checkInSchema),
  checkIn
);
router.route('/check-out').post(protect, authorize('employee'), checkOut);
router.route('/history').get(protect, authorize('employee'), getAttendanceHistory);

router
  .route('/pending')
  .get(protect, authorize('admin', 'manager'), getPendingAttendance);

router
  .route('/:id/approve')
  .put(protect, authorize('admin', 'manager'), validate(approveRejectSchema), approveAttendance);

router
  .route('/:id/reject')
  .put(protect, authorize('admin', 'manager'), validate(approveRejectSchema), rejectAttendance);

router
  .route('/:id/alter')
  .put(protect, authorize('admin', 'manager'), validate(alterAttendanceSchema), alterAttendance);

module.exports = router;
