const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/**
 * Health check endpoint
 * Returns server status, database connectivity, and system info
 */

// @desc      Health check
// @route     GET /health
// @access    Public
router.get('/', async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  };

  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    healthcheck.database = {
      status: dbStatus[dbState] || 'unknown',
      connected: dbState === 1,
    };

    // Add memory usage info
    const memoryUsage = process.memoryUsage();
    healthcheck.memory = {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
    };

    // If database is not connected, return 503
    if (dbState !== 1) {
      return res.status(503).json(healthcheck);
    }

    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = 'ERROR';
    healthcheck.error = error.message;
    res.status(503).json(healthcheck);
  }
});

module.exports = router;

