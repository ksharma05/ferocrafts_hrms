/**
 * Environment Variable Validation
 * Validates that all required environment variables are present at startup
 */

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_COOKIE_EXPIRE',
  'NODE_ENV',
  'PORT',
  'CLIENT_URL',
];

const validateEnv = () => {
  const missing = [];
  const invalid = [];

  // Check for missing required variables
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Validate specific formats
  if (process.env.JWT_COOKIE_EXPIRE) {
    const cookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRE);
    if (isNaN(cookieExpire) || cookieExpire <= 0) {
      invalid.push(`JWT_COOKIE_EXPIRE must be a positive number (got: ${process.env.JWT_COOKIE_EXPIRE})`);
    }
  }

  if (process.env.PORT) {
    const port = parseInt(process.env.PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
      invalid.push(`PORT must be a valid port number 1-65535 (got: ${process.env.PORT})`);
    }
  }

  if (process.env.NODE_ENV && !['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
    invalid.push(`NODE_ENV must be 'development', 'production', or 'test' (got: ${process.env.NODE_ENV})`);
  }

  // Report errors
  if (missing.length > 0 || invalid.length > 0) {
    console.error('❌ Environment variable validation failed!\n');
    
    if (missing.length > 0) {
      console.error('Missing required environment variables:');
      missing.forEach((varName) => console.error(`  - ${varName}`));
      console.error('\nPlease check your .env file against .env.example\n');
    }

    if (invalid.length > 0) {
      console.error('Invalid environment variable values:');
      invalid.forEach((error) => console.error(`  - ${error}`));
      console.error('');
    }

    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');

  // Warn about optional but recommended email variables
  const emailVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  const missingEmail = emailVars.filter(varName => !process.env[varName]);
  
  if (missingEmail.length > 0) {
    console.warn('⚠️  Email service not configured. Email features will be disabled.');
    console.warn('   See EMAIL_SETUP_GUIDE.md to configure email service.');
  }
};

module.exports = validateEnv;

