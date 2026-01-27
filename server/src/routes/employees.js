const express = require('express');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employees');
const validate = require('../middleware/validate');
const { createEmployeeSchema, updateEmployeeSchema } = require('../validators/employee.validator');

const EmployeeProfile = require('../models/EmployeeProfile');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    protect,
    authorize('admin', 'manager'),
    advancedResults(EmployeeProfile, {
      path: 'user',
      select: 'email role',
    }),
    getEmployees
  )
  .post(protect, authorize('admin', 'manager'), validate(createEmployeeSchema), createEmployee);

router
  .route('/:id')
  .get(protect, authorize('admin', 'manager'), getEmployee)
  .put(protect, authorize('admin', 'manager'), validate(updateEmployeeSchema), updateEmployee)
  .delete(protect, authorize('admin'), deleteEmployee);

module.exports = router;
