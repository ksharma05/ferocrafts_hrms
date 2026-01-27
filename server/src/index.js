const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
// Temporarily disabled due to Express 5 compatibility issues
// const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const { verifyEmailConfig } = require('./config/email');

// Route files
const auth = require('./routes/auth');
const employees = require('./routes/employees');
const attendance = require('./routes/attendance');
const sites = require('./routes/sites');
const payouts = require('./routes/payouts');
const profile = require('./routes/profile');
const health = require('./routes/health');

// Middleware
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Validate environment variables
const validateEnv = require('./config/validateEnv');
validateEnv();

// Connect to database
connectDB();

// Verify email configuration (non-blocking)
verifyEmailConfig();

const app = express();

// Serve static files (uploaded files and PDFs)
app.use('/uploads', express.static('uploads'));
app.use('/pdfs', express.static('pdfs'));

// Security middleware
// Set security headers
app.use(helmet());

// Sanitize data to prevent NoSQL injection
// Note: express-mongo-sanitize has Express 5 compatibility issues
// For production, NoSQL injection is mitigated by:
// 1. Mongoose schema validation (strict mode enabled by default)
// 2. Joi input validation on all routes (already implemented)
// 3. Proper query construction using Mongoose methods
// Consider upgrading to Express 5 compatible version when available
// app.use(mongoSanitize());

// Prevent XSS attacks
// Note: xss-clean has Express 5 compatibility issues
// For production, consider using alternative XSS protection:
// 1. Content Security Policy via helmet (already enabled)
// 2. Input validation/sanitization (already done via Joi)
// 3. Output encoding (React does this automatically)
// app.use(xss());

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Body parser
app.use(express.json());

// Enable gzip compression
app.use(compression());

// Cookie parser
app.use(cookieParser());

// Enable CORS with credentials and specific origin
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
};

// Allow multiple origins in production if needed
if (process.env.ALLOWED_ORIGINS) {
  corsOptions.origin = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
}

app.use(cors(corsOptions));

// Health check (no /api/v1 prefix)
app.use('/health', health);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'FeroCrafts HRMS API Docs',
}));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/employees', employees);
app.use('/api/v1/attendance', attendance);
app.use('/api/v1/sites', sites);
app.use('/api/v1/payouts', payouts);
app.use('/api/v1/profile', profile);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      // Close database connection
      const mongoose = require('mongoose');
      await mongoose.connection.close();
      logger.info('Database connection closed');

      process.exit(0);
    } catch (err) {
      logger.error(`Error during shutdown: ${err.message}`);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  process.exit(1);
});
