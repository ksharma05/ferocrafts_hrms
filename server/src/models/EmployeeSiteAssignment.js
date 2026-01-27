const mongoose = require('mongoose');

const EmployeeSiteAssignmentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  siteId: {
    type: mongoose.Schema.ObjectId,
    ref: 'ClientSite',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  wageRatePerDay: {
    type: Number,
  },
  wageRatePerMonth: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound indexes for performance
EmployeeSiteAssignmentSchema.index({ employeeId: 1, siteId: 1 });
EmployeeSiteAssignmentSchema.index({ employeeId: 1, endDate: 1 });

module.exports = mongoose.model(
  'EmployeeSiteAssignment',
  EmployeeSiteAssignmentSchema
);
