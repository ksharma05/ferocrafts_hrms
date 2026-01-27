const mongoose = require('mongoose');

const EmployeeProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true, // Explicit index, will be handled by schema.index() below
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  aadhaarNo: {
    type: String,
    required: [true, 'Please add an Aadhaar number'],
    unique: true,
    index: true, // Explicit index, will be handled by schema.index() below
  },
  dob: {
    type: Date,
    required: [true, 'Please add a date of birth'],
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
  },
  upiId: String,
  documents: [
    {
      name: String,
      url: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Note: Indexes for 'user' and 'aadhaarNo' are already created via unique: true
// No need to create duplicate indexes here
// The warning was caused by specifying both unique: true and schema.index()

module.exports = mongoose.model('EmployeeProfile', EmployeeProfileSchema);
