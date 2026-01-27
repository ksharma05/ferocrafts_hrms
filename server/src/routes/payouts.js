const express = require('express');
const {
  generatePayouts,
  getPayoutHistory,
  getPayoutSlip,
} = require('../controllers/payouts');
const validate = require('../middleware/validate');
const { generatePayoutSchema } = require('../validators/payout.validator');

const Payout = require('../models/Payout');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/generate')
  .post(protect, authorize('admin', 'manager'), validate(generatePayoutSchema), generatePayouts);

router.route('/history').get(protect, getPayoutHistory);

router.route('/:id/slip').get(protect, getPayoutSlip);

module.exports = router;
