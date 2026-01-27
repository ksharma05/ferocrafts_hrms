const express = require('express');
const { register, login, logout, refreshToken } = require('../controllers/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Apply rate limiting to auth endpoints
router.post('/register', authLimiter, protect, authorize('admin', 'manager'), validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.get('/logout', logout);

module.exports = router;
