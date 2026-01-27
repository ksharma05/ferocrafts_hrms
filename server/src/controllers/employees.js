const EmployeeProfile = require('../models/EmployeeProfile');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get all employees
// @route     GET /api/v1/employees
// @access    Private (Admin/Manager)
exports.getEmployees = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single employee
// @route     GET /api/v1/employees/:id
// @access    Private (Admin/Manager)
exports.getEmployee = asyncHandler(async (req, res, next) => {
  const employee = await EmployeeProfile.findById(req.params.id).populate({
    path: 'user',
    select: 'email role',
  });

  if (!employee) {
    return next(
      new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: employee });
});

// @desc      Create new employee
// @route     POST /api/v1/employees
// @access    Private (Admin/Manager)
exports.createEmployee = asyncHandler(async (req, res, next) => {
  const { email, password, role, name, phoneNumber, aadhaarNo, dob, bankDetails, upiId } = req.body;

  // Prevent managers from creating admin accounts
  if (req.user.role === 'manager' && role === 'admin') {
    return next(
      new ErrorResponse('Managers cannot create admin accounts', 403)
    );
  }

  // Use transaction to ensure both user and profile are created or neither
  const session = await require('mongoose').startSession();
  session.startTransaction();

  try {
    // Create user
    const userArray = await User.create(
      [
        {
          email,
          password,
          role,
        },
      ],
      { session }
    );
    const user = userArray[0];

    // Create employee profile
    const employeeProfileArray = await EmployeeProfile.create(
      [
        {
          user: user._id,
          name,
          phoneNumber,
          aadhaarNo,
          dob,
          bankDetails,
          upiId,
        },
      ],
      { session }
    );
    const employeeProfile = employeeProfileArray[0];

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      data: { user, employeeProfile },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

// @desc      Update employee
// @route     PUT /api/v1/employees/:id
// @access    Private (Admin/Manager)
exports.updateEmployee = asyncHandler(async (req, res, next) => {
  let employee = await EmployeeProfile.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404)
    );
  }

  employee = await EmployeeProfile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: employee });
});

// @desc      Delete employee
// @route     DELETE /api/v1/employees/:id
// @access    Private (Admin)
exports.deleteEmployee = asyncHandler(async (req, res, next) => {
  const employee = await EmployeeProfile.findById(req.params.id);

  if (!employee) {
    return next(
      new ErrorResponse(`Employee not found with id of ${req.params.id}`, 404)
    );
  }

  // Use transaction to ensure both are deleted or neither
  const session = await require('mongoose').startSession();
  session.startTransaction();

  try {
    // Use deleteOne() instead of deprecated remove()
    await User.findByIdAndDelete(employee.user, { session });
    await employee.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
