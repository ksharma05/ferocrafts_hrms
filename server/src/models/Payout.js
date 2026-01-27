const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  period: {
    type: String, // e.g., '2024-01'
    required: true,
  },
  totalDaysWorked: {
    type: Number,
    default: 0,
  },
  grossPay: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  netPay: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['generated', 'paid'],
    default: 'generated',
  },
  generatedDate: {
    type: Date,
    default: Date.now,
  },
  payoutSlipUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for performance
PayoutSchema.index({ employeeId: 1, period: -1 });
PayoutSchema.index({ status: 1 });

module.exports = mongoose.model('Payout', PayoutSchema);
