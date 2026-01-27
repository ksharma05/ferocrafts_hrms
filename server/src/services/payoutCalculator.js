const Attendance = require('../models/Attendance');
const EmployeeSiteAssignment = require('../models/EmployeeSiteAssignment');
const mongoose = require('mongoose');

/**
 * Payout Calculator Service
 * Calculates employee payouts based on attendance and wage rates
 */

/**
 * Calculate payout for an employee for a given period
 * @param {String} employeeId - Employee ID
 * @param {String} period - Period in YYYY-MM format (e.g., '2024-01')
 * @returns {Object} - Payout calculation details
 */
const calculatePayout = async (employeeId, period) => {
  // Parse period
  const [year, month] = period.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  // Get approved attendance records for the period
  const attendanceRecords = await Attendance.find({
    employeeId,
    date: { $gte: startDate, $lte: endDate },
    status: 'approved',
  }).sort({ date: 1 });

  if (attendanceRecords.length === 0) {
    return {
      employeeId,
      period,
      totalDaysWorked: 0,
      grossPay: 0,
      deductions: 0,
      netPay: 0,
      details: {
        message: 'No approved attendance records found for this period',
      },
    };
  }

  // Get employee's site assignments for the period
  const assignments = await EmployeeSiteAssignment.find({
    employeeId,
    startDate: { $lte: endDate },
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gte: startDate } },
    ],
  }).populate('siteId');

  if (assignments.length === 0) {
    return {
      employeeId,
      period,
      totalDaysWorked: attendanceRecords.length,
      grossPay: 0,
      deductions: 0,
      netPay: 0,
      details: {
        message: 'No site assignment found for this employee',
        daysWorked: attendanceRecords.length,
      },
    };
  }

  // Calculate gross pay
  let grossPay = 0;
  const siteWageMap = new Map();

  // Build site-wage map
  assignments.forEach((assignment) => {
    siteWageMap.set(assignment.siteId._id.toString(), {
      siteId: assignment.siteId._id,
      siteName: assignment.siteId.name,
      wageRatePerDay: assignment.wageRatePerDay || 0,
      wageRatePerMonth: assignment.wageRatePerMonth || 0,
      daysWorked: 0,
    });
  });

  // Calculate pay based on attendance
  const daysInMonth = endDate.getDate();
  const totalDaysWorked = attendanceRecords.length;

  // Try to use monthly rate first (more common for salaried employees)
  const primaryAssignment = assignments[0];
  if (primaryAssignment.wageRatePerMonth && primaryAssignment.wageRatePerMonth > 0) {
    // Pro-rated monthly salary based on days worked
    grossPay = (primaryAssignment.wageRatePerMonth / daysInMonth) * totalDaysWorked;
  } else if (primaryAssignment.wageRatePerDay && primaryAssignment.wageRatePerDay > 0) {
    // Daily wage
    grossPay = primaryAssignment.wageRatePerDay * totalDaysWorked;
  } else {
    // No wage rate found, return zero
    return {
      employeeId,
      period,
      totalDaysWorked,
      grossPay: 0,
      deductions: 0,
      netPay: 0,
      details: {
        message: 'No wage rate configured for this employee',
        daysWorked: totalDaysWorked,
      },
    };
  }

  // Round to 2 decimal places
  grossPay = Math.round(grossPay * 100) / 100;

  // Calculate deductions (simplified - in real app, would be more complex)
  // Example: 5% for taxes/insurance
  const deductions = Math.round(grossPay * 0.05 * 100) / 100;

  // Calculate net pay
  const netPay = Math.round((grossPay - deductions) * 100) / 100;

  return {
    employeeId,
    period,
    totalDaysWorked,
    grossPay,
    deductions,
    netPay,
    details: {
      daysInMonth,
      attendanceRecords: attendanceRecords.length,
      siteName: primaryAssignment.siteId.name,
      wageRatePerDay: primaryAssignment.wageRatePerDay || 0,
      wageRatePerMonth: primaryAssignment.wageRatePerMonth || 0,
      deductionPercentage: 5,
    },
  };
};

/**
 * Calculate payouts for all employees for a given period
 * @param {String} period - Period in YYYY-MM format
 * @returns {Array} - Array of payout calculations
 */
const calculatePayoutsForPeriod = async (period) => {
  // Get all active employees (those with site assignments)
  const assignments = await EmployeeSiteAssignment.find({
    endDate: { $exists: false },
  }).distinct('employeeId');

  const payouts = [];
  for (const employeeId of assignments) {
    const payout = await calculatePayout(employeeId.toString(), period);
    if (payout.totalDaysWorked > 0) {
      payouts.push(payout);
    }
  }

  return payouts;
};

module.exports = {
  calculatePayout,
  calculatePayoutsForPeriod,
};

