const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['employee', 'manager', 'admin'],
    default: 'employee',
  },
  profilePicture: {
    type: String,
    default: null,
  },
  emailChangeOTP: {
    type: String,
    select: false,
  },
  emailChangeOTPExpiry: {
    type: Date,
    select: false,
  },
  pendingEmail: {
    type: String,
    select: false,
  },
  refreshTokenVersion: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign access token and return
UserSchema.methods.getSignedAccessToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

// Sign refresh token and return (with version for revocation)
UserSchema.methods.getSignedRefreshToken = function () {
  return jwt.sign(
    { id: this._id, tokenVersion: this.refreshTokenVersion },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
