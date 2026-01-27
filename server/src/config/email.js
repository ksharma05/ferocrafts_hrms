const nodemailer = require('nodemailer');
const logger = require('./logger');

/**
 * Email Configuration
 * Supports multiple email providers (Gmail, SendGrid, Mailtrap, etc.)
 */

// Create reusable transporter
let transporter = null;

const createTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const emailConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // For development with Gmail, you might need to enable "Less secure apps"
  // or use an "App Password" if 2FA is enabled
  if (process.env.SMTP_HOST === 'smtp.gmail.com') {
    emailConfig.service = 'gmail';
  }

  try {
    transporter = nodemailer.createTransport(emailConfig);
    logger.info('✅ Email transporter configured');
  } catch (error) {
    logger.error('❌ Email transporter configuration failed:', error);
  }

  return transporter;
};

/**
 * Verify email configuration
 */
const verifyEmailConfig = async () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    logger.warn('⚠️  Email service not configured. Email features will be disabled.');
    return false;
  }

  try {
    const transport = createTransporter();
    await transport.verify();
    logger.info('✅ Email service is ready');
    return true;
  } catch (error) {
    logger.error('❌ Email verification failed:', error.message);
    return false;
  }
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transport = createTransporter();
    
    if (!transport) {
      throw new Error('Email transporter not configured');
    }

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'FeroCrafts HRMS'} <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || text,
    };

    const info = await transport.sendMail(mailOptions);
    logger.info(`📧 Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

/**
 * Send OTP email
 * @param {string} to - Recipient email
 * @param {string} otp - OTP code
 * @param {string} purpose - Purpose of OTP (e.g., 'email_change')
 */
const sendOTPEmail = async (to, otp, purpose = 'email_change') => {
  const purposes = {
    email_change: {
      subject: 'Email Change Verification - FeroCrafts HRMS',
      title: 'Email Change Request',
      message: 'You requested to change your email address. Please use the OTP below to verify:',
    },
    password_reset: {
      subject: 'Password Reset - FeroCrafts HRMS',
      title: 'Password Reset Request',
      message: 'You requested to reset your password. Please use the OTP below to proceed:',
    },
    account_verification: {
      subject: 'Account Verification - FeroCrafts HRMS',
      title: 'Verify Your Account',
      message: 'Please use the OTP below to verify your account:',
    },
  };

  const config = purposes[purpose] || purposes.email_change;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${config.subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9f9f9;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 10px 10px 0 0;
          text-align: center;
          margin: -30px -30px 30px -30px;
        }
        .otp-box {
          background-color: #667eea;
          color: white;
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          padding: 20px;
          border-radius: 10px;
          letter-spacing: 8px;
          margin: 30px 0;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${config.title}</h1>
        </div>
        
        <p>Hello,</p>
        
        <p>${config.message}</p>
        
        <div class="otp-box">
          ${otp}
        </div>
        
        <div class="warning">
          <strong>⚠️ Security Notice:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>This OTP is valid for <strong>10 minutes</strong></li>
            <li>Do not share this OTP with anyone</li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>
        </div>
        
        <p>If you have any questions or concerns, please contact our support team.</p>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} FeroCrafts HRMS. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
${config.title}

${config.message}

Your OTP: ${otp}

⚠️ Security Notice:
- This OTP is valid for 10 minutes
- Do not share this OTP with anyone
- If you didn't request this, please ignore this email

© ${new Date().getFullYear()} FeroCrafts HRMS
  `;

  return sendEmail({
    to,
    subject: config.subject,
    text,
    html,
  });
};

/**
 * Send welcome email
 * @param {string} to - Recipient email
 * @param {string} name - User name
 */
const sendWelcomeEmail = async (to, name) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to FeroCrafts HRMS</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9f9f9;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
          margin: -30px -30px 30px -30px;
        }
        .features {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
        }
        .feature-item {
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .feature-item:last-child {
          border-bottom: none;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to FeroCrafts HRMS! 🎉</h1>
        </div>
        
        <p>Hello ${name},</p>
        
        <p>Welcome to FeroCrafts Human Resource Management System! We're excited to have you on board.</p>
        
        <div class="features">
          <h3>What you can do:</h3>
          <div class="feature-item">✅ Check in/out with selfie verification</div>
          <div class="feature-item">📊 View your attendance history</div>
          <div class="feature-item">💰 Track your payouts and download payslips</div>
          <div class="feature-item">👤 Manage your profile information</div>
          <div class="feature-item">🏢 View your site assignments</div>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} FeroCrafts HRMS. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to FeroCrafts HRMS!

Hello ${name},

Welcome to FeroCrafts Human Resource Management System! We're excited to have you on board.

What you can do:
✅ Check in/out with selfie verification
📊 View your attendance history
💰 Track your payouts and download payslips
👤 Manage your profile information
🏢 View your site assignments

If you have any questions or need assistance, please don't hesitate to reach out to our support team.

© ${new Date().getFullYear()} FeroCrafts HRMS
  `;

  return sendEmail({
    to,
    subject: 'Welcome to FeroCrafts HRMS',
    text,
    html,
  });
};

module.exports = {
  createTransporter,
  verifyEmailConfig,
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail,
};

