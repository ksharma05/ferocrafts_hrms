const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  checkInTime: {
    type: Date,
    required: true,
  },
  checkOutTime: {
    type: Date,
  },
  selfieUrl: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  notes: String,
  alteredBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  alterationReason: String,
});

// Compound indexes for performance
AttendanceSchema.index({ employeeId: 1, date: -1 });
AttendanceSchema.index({ status: 1 });
// 2dsphere index for geospatial queries
AttendanceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Attendance', AttendanceSchema);
