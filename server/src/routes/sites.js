const express = require('express');
const {
  getSites,
  createSite,
  updateSite,
  assignEmployeeToSite,
  getCurrentSite,
  getWorkHistory,
  getSiteEmployees,
} = require('../controllers/sites');
const validate = require('../middleware/validate');
const { createSiteSchema, updateSiteSchema, assignEmployeeToSiteSchema } = require('../validators/site.validator');

const ClientSite = require('../models/ClientSite');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('admin', 'manager'), advancedResults(ClientSite), getSites)
  .post(protect, authorize('admin', 'manager'), validate(createSiteSchema), createSite);

router
  .route('/:id')
  .put(protect, authorize('admin', 'manager'), validate(updateSiteSchema), updateSite);

router
  .route('/:id/employees')
  .get(protect, authorize('admin', 'manager'), getSiteEmployees);

router
  .route('/assign')
  .post(protect, authorize('admin', 'manager'), validate(assignEmployeeToSiteSchema), assignEmployeeToSite);

router.route('/current-site').get(protect, authorize('employee'), getCurrentSite);
router.route('/work-history').get(protect, authorize('employee'), getWorkHistory);

module.exports = router;
