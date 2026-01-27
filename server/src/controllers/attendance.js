const Attendance = require('../models/Attendance');
const EmployeeSiteAssignment = require('../models/EmployeeSiteAssignment');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { getFileUrl } = require('../config/storage');

// @desc      Check in
// @route     POST /api/v1/attendance/check-in
// @access    Private (Employee)
exports.checkIn = asyncHandler(async (req, res, next) => {
  // Check if user already has an active check-in today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingCheckIn = await Attendance.findOne({
    employeeId: req.user.id,
    date: { $gte: today },
    checkOutTime: { $exists: false },
  });

  if (existingCheckIn) {
    return next(new ErrorResponse('You already have an active check-in today', 400));
  }

  // Get selfie URL from uploaded file
  if (!req.file) {
    return next(new ErrorResponse('Selfie is required for check-in', 400));
  }

  const selfieUrl = getFileUrl(req.file.path);

  const attendance = await Attendance.create({
    employeeId: req.user.id,
    date: new Date(),
    checkInTime: new Date(),
    selfieUrl,
    location: req.body.location,
  });

  res.status(201).json({
    success: true,
    data: attendance,
  });
});

// @desc      Check out
// @route     POST /api/v1/attendance/check-out
// @access    Private (Employee)
exports.checkOut = asyncHandler(async (req, res, next) => {
  let attendance = await Attendance.findOne({
    employeeId: req.user.id,
    checkOutTime: { $exists: false },
  }).sort({ createdAt: -1 });

  if (!attendance) {
    return next(new ErrorResponse(`No active check-in found`, 404));
  }

  attendance.checkOutTime = new Date();
  await attendance.save();

  res.status(200).json({
    success: true,
    data: attendance,
  });
});

// @desc      Get pending attendance for a manager's employees
// @route     GET /api/v1/attendance/pending
// @access    Private (Manager)
exports.getPendingAttendance = asyncHandler(async (req, res, next) => {
  // This requires knowing which employees report to the manager.
  // For now, we'll assume a manager can see all pending attendance.
  // In a real app, you'd have a relationship between managers and employees.
  const attendance = await Attendance.find({ status: 'pending' }).populate({
    path: 'employeeId',
    select: 'name',
  });

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance,
  });
});

// @desc      Approve attendance
// @route     PUT /api/v1/attendance/:id/approve
// @access    Private (Manager)
exports.approveAttendance = asyncHandler(async (req, res, next) => {
  let attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(
      new ErrorResponse(`Attendance not found with id of ${req.params.id}`, 404)
    );
  }

  attendance.status = 'approved';
  attendance.approvedBy = req.user.id;
  if (req.body.notes) {
    attendance.notes = req.body.notes;
  }
  await attendance.save();

  // Update wage rates in EmployeeSiteAssignment if provided
  if (req.body.wageRatePerDay || req.body.wageRatePerMonth) {
    const assignment = await EmployeeSiteAssignment.findOne({
      employeeId: attendance.employeeId,
      endDate: { $exists: false }, // Current assignment
    });

    if (assignment) {
      if (req.body.wageRatePerDay !== undefined) {
        assignment.wageRatePerDay = req.body.wageRatePerDay;
      }
      if (req.body.wageRatePerMonth !== undefined) {
        assignment.wageRatePerMonth = req.body.wageRatePerMonth;
      }
      await assignment.save();
    }
  }

  res.status(200).json({
    success: true,
    data: attendance,
  });
});

// @desc      Reject attendance
// @route     PUT /api/v1/attendance/:id/reject
// @access    Private (Manager)
exports.rejectAttendance = asyncHandler(async (req, res, next) => {
  let attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(
      new ErrorResponse(`Attendance not found with id of ${req.params.id}`, 404)
    );
  }

  attendance.status = 'rejected';
  attendance.approvedBy = req.user.id;
  await attendance.save();

  res.status(200).json({
    success: true,
    data: attendance,
  });
});

// @desc      Alter attendance
// @route     PUT /api/v1/attendance/:id/alter
// @access    Private (Admin/Manager)
exports.alterAttendance = asyncHandler(async (req, res, next) => {
  let attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(
      new ErrorResponse(`Attendance not found with id of ${req.params.id}`, 404)
    );
  }

  req.body.alteredBy = req.user.id;
  attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: attendance,
  });
});

// @desc      Get employee attendance history
// @route     GET /api/v1/attendance/history
// @access    Private (Employee)
exports.getAttendanceHistory = asyncHandler(async (req, res, next) => {
  const attendance = await Attendance.find({ employeeId: req.user.id });

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance,
  });
});
