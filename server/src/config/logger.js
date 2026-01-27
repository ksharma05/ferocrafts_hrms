const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

/**
 * Winston logger configuration
 * Provides structured logging with different levels and outputs
 */

const { combine, timestamp, errors, printf, colorize, json } = winston.format;

// Custom format for console output (development)
const consoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  if (stack) {
    msg += `\n${stack}`;
  }
  
  return msg;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  defaultMeta: { service: 'ferocrafts-hrms' },
  transports: [],
});

// Console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), consoleFormat),
    })
  );
}

// File transports for production
if (process.env.NODE_ENV === 'production') {
  // JSON format for production logs (easier to parse)
  const productionFormat = combine(json());

  // Error logs - daily rotation
  logger.add(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d', // Keep logs for 14 days
      format: productionFormat,
    })
  );

  // Combined logs - daily rotation
  logger.add(
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: productionFormat,
    })
  );

  // Console with JSON format
  logger.add(
    new winston.transports.Console({
      format: productionFormat,
    })
  );
}

// Create stream for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;

