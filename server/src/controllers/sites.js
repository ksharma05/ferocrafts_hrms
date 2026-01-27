const ClientSite = require('../models/ClientSite');
const EmployeeSiteAssignment = require('../models/EmployeeSiteAssignment');
const EmployeeProfile = require('../models/EmployeeProfile');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get all sites
// @route     GET /api/v1/sites
// @access    Private (Admin/Manager)
exports.getSites = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Create new site
// @route     POST /api/v1/sites
// @access    Private (Admin/Manager)
exports.createSite = asyncHandler(async (req, res, next) => {
  const site = await ClientSite.create(req.body);
  res.status(201).json({
    success: true,
    data: site,
  });
});

// @desc      Update site
// @route     PUT /api/v1/sites/:id
// @access    Private (Admin/Manager)
exports.updateSite = asyncHandler(async (req, res, next) => {
  let site = await ClientSite.findById(req.params.id);

  if (!site) {
    return next(
      new ErrorResponse(`Site not found with id of ${req.params.id}`, 404)
    );
  }

  site = await ClientSite.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: site });
});

// @desc      Assign employee to site
// @route     POST /api/v1/sites/assign
// @access    Private (Admin/Manager)
exports.assignEmployeeToSite = asyncHandler(async (req, res, next) => {
  const assignment = await EmployeeSiteAssignment.create(req.body);
  res.status(201).json({
    success: true,
    data: assignment,
  });
});

// @desc      Get current assigned site for an employee
// @route     GET /api/v1/sites/current-site
// @access    Private (Employee)
exports.getCurrentSite = asyncHandler(async (req, res, next) => {
  const assignment = await EmployeeSiteAssignment.findOne({
    employeeId: req.user.id,
    endDate: { $exists: false },
  }).populate('siteId');

  if (!assignment) {
    return next(new ErrorResponse(`No current site assignment found`, 404));
  }

  res.status(200).json({ success: true, data: assignment });
});

// @desc      Get work history for an employee
// @route     GET /api/v1/sites/work-history
// @access    Private (Employee)
exports.getWorkHistory = asyncHandler(async (req, res, next) => {
  const assignments = await EmployeeSiteAssignment.find({
    employeeId: req.user.id,
  }).populate('siteId');

  // This is a simplified version. A more complex aggregation would be needed
  // to calculate payouts as described in the brief.
  res.status(200).json({ success: true, data: assignments });
});

// @desc      Get employees assigned to a specific site
// @route     GET /api/v1/sites/:id/employees
// @access    Private (Admin/Manager)
exports.getSiteEmployees = asyncHandler(async (req, res, next) => {
  const siteId = req.params.id;

  // Check if site exists
  const site = await ClientSite.findById(siteId);
  if (!site) {
    return next(new ErrorResponse(`Site not found with id of ${siteId}`, 404));
  }

  // Get all active assignments for this site (where endDate doesn't exist or is in the future)
  const assignments = await EmployeeSiteAssignment.find({
    siteId: siteId,
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gte: new Date() } },
    ],
  })
    .populate({
      path: 'employeeId',
      select: 'email role',
    })
    .sort({ startDate: -1 });

  // Get employee profiles for all assigned employees
  const employeeIds = assignments.map((assignment) => assignment.employeeId._id);
  const employeeProfiles = await EmployeeProfile.find({
    user: { $in: employeeIds },
  }).select('user name phoneNumber');

  // Create a map of user ID to employee profile for quick lookup
  const profileMap = {};
  employeeProfiles.forEach((profile) => {
    profileMap[profile.user.toString()] = profile;
  });

  // Attach employee profiles to assignments
  const assignmentsWithProfiles = assignments.map((assignment) => {
    const assignmentObj = assignment.toObject();
    const profile = profileMap[assignment.employeeId._id.toString()];
    if (profile) {
      assignmentObj.employeeId.employeeProfile = {
        name: profile.name,
        phoneNumber: profile.phoneNumber,
      };
    }
    return assignmentObj;
  });

  res.status(200).json({
    success: true,
    count: assignmentsWithProfiles.length,
    data: assignmentsWithProfiles,
  });
});
