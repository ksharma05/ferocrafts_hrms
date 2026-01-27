const Payout = require('../models/Payout');
const Attendance = require('../models/Attendance');
const EmployeeSiteAssignment = require('../models/EmployeeSiteAssignment');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// @desc      Generate payouts for a period
// @route     POST /api/v1/payouts/generate
// @access    Private (Admin/Manager)
exports.generatePayouts = asyncHandler(async (req, res, next) => {
  const { period, employeeId } = req.body; // e.g., '2024-01'

  const payoutCalculator = require('../services/payoutCalculator');

  // Check if payouts already exist for this period
  const existingPayouts = await Payout.find({ period });
  if (existingPayouts.length > 0 && !employeeId) {
    return next(new ErrorResponse(`Payouts already generated for period ${period}. Delete existing payouts first or specify an employeeId.`, 400));
  }

  let payoutsToGenerate = [];

  if (employeeId) {
    // Generate for specific employee
    const calculation = await payoutCalculator.calculatePayout(employeeId, period);
    if (calculation.totalDaysWorked > 0) {
      payoutsToGenerate.push(calculation);
    }
  } else {
    // Generate for all employees
    payoutsToGenerate = await payoutCalculator.calculatePayoutsForPeriod(period);
  }

  if (payoutsToGenerate.length === 0) {
    return next(new ErrorResponse('No payouts to generate. No approved attendance found for this period.', 404));
  }

  // Create payout records
  const createdPayouts = await Payout.create(payoutsToGenerate);

  res.status(201).json({
    success: true,
    count: createdPayouts.length,
    data: createdPayouts,
  });
});

// @desc      Get payout history for an employee
// @route     GET /api/v1/payouts/history
// @access    Private (Employee/Manager/Admin)
exports.getPayoutHistory = asyncHandler(async (req, res, next) => {
  let query = {};
  
  // If user is employee, only show their own payouts
  // If user is admin/manager, show all payouts
  if (req.user.role === 'employee') {
    query.employeeId = req.user.id;
  }

  const EmployeeProfile = require('../models/EmployeeProfile');
  
  const payouts = await Payout.find(query)
    .populate({
      path: 'employeeId',
      select: 'email',
    })
    .sort({
      period: -1,
    });

  // Get employee profiles for all unique employee IDs
  const employeeIds = [...new Set(payouts.map(p => p.employeeId?._id?.toString()).filter(Boolean))];
  const profiles = await EmployeeProfile.find({ user: { $in: employeeIds } }).select('user name');
  const profileMap = new Map(profiles.map(p => [p.user.toString(), p.name]));

  // Transform the data to match frontend expectations
  const transformedPayouts = payouts.map((payout) => {
    const payoutObj = payout.toObject();
    
    // If employeeId is populated, add name from profile
    if (payoutObj.employeeId && typeof payoutObj.employeeId === 'object') {
      const employeeIdStr = payoutObj.employeeId._id.toString();
      payoutObj.employeeId = {
        _id: payoutObj.employeeId._id,
        email: payoutObj.employeeId.email,
        name: profileMap.get(employeeIdStr) || payoutObj.employeeId.email,
      };
    }
    
    return payoutObj;
  });

  res.status(200).json({
    success: true,
    count: transformedPayouts.length,
    data: transformedPayouts,
  });
});

// @desc      Get specific payout slip
// @route     GET /api/v1/payouts/:id/slip
// @access    Private (Employee)
exports.getPayoutSlip = asyncHandler(async (req, res, next) => {
  const payout = await Payout.findById(req.params.id);

  if (!payout) {
    return next(new ErrorResponse(`Payout not found`, 404));
  }

  // Check if user owns the payout
  if (payout.employeeId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to access this payout`, 401));
  }

  const User = require('../models/User');
  const EmployeeProfile = require('../models/EmployeeProfile');
  const { generatePayoutSlip, getPdfUrl } = require('../services/pdfGenerator');

  // Check if PDF already exists
  if (payout.payoutSlipUrl) {
    return res.status(200).json({
      success: true,
      data: {
        url: payout.payoutSlipUrl,
      },
    });
  }

  // Get employee details
  const user = await User.findById(payout.employeeId);
  const profile = await EmployeeProfile.findOne({ user: payout.employeeId });

  const employee = {
    email: user?.email,
    name: profile?.name || user?.email,
  };

  // Generate PDF
  const filepath = await generatePayoutSlip(payout, employee);
  const pdfUrl = getPdfUrl(filepath);

  // Save PDF URL to payout record
  payout.payoutSlipUrl = pdfUrl;
  await payout.save();

  res.status(200).json({
    success: true,
    data: {
      url: pdfUrl,
    },
  });
});
