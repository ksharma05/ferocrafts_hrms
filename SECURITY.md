# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of FeroCrafts HRMS seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not create a public GitHub issue for security vulnerabilities.

### 2. Report Privately

Send an email to: **security@ferocrafts.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Time

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies by severity (see below)

### 4. Severity Levels

| Severity | Response Time | Examples |
|----------|--------------|----------|
| **Critical** | 24-48 hours | Authentication bypass, SQL injection, RCE |
| **High** | 3-7 days | XSS, CSRF, privilege escalation |
| **Medium** | 14 days | Information disclosure, weak encryption |
| **Low** | 30 days | Minor configuration issues |

## Security Measures Implemented

### Authentication & Authorization

- ✅ JWT-based authentication with refresh tokens
- ✅ Token rotation on refresh
- ✅ HttpOnly cookies for token storage
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Password strength requirements

### Input Validation

- ✅ Joi validation on all endpoints
- ✅ Request sanitization (XSS prevention)
- ✅ NoSQL injection prevention
- ✅ File upload validation (type, size)

### API Security

- ✅ Rate limiting (prevents brute force)
- ✅ Helmet (security headers)
- ✅ CORS configuration
- ✅ Request logging
- ✅ Error handling (no sensitive data leakage)

### Data Protection

- ✅ Encrypted passwords
- ✅ Secure session management
- ✅ HTTPS enforcement (production)
- ✅ Environment variable protection

### Infrastructure

- ✅ Docker containerization
- ✅ Non-root user in containers
- ✅ Health checks
- ✅ Graceful shutdown
- ✅ Log rotation

## Security Best Practices for Deployment

### 1. Environment Variables

**Never** commit these to version control:

```env
JWT_SECRET=<strong-random-string>
JWT_REFRESH_SECRET=<strong-random-string>
MONGO_URI=<database-connection-string>
```

Generate strong secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Database Security

- Use MongoDB Atlas with IP whitelisting
- Enable authentication
- Use strong passwords
- Regular backups
- Encryption at rest

### 3. HTTPS/SSL

- Always use HTTPS in production
- Use Let's Encrypt for free SSL certificates
- Enable HSTS headers

### 4. Monitoring

- Set up error tracking (Sentry)
- Monitor failed login attempts
- Track unusual activity
- Set up alerts for critical errors

### 5. Regular Updates

- Keep dependencies updated
- Run `npm audit` regularly
- Monitor security advisories
- Apply patches promptly

### 6. Access Control

- Principle of least privilege
- Regular access reviews
- Strong password policies
- Multi-factor authentication (recommended)

## Security Checklist

Before deploying to production:

- [ ] All environment variables set securely
- [ ] Strong JWT secrets (32+ characters)
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Database access restricted
- [ ] File upload limits set
- [ ] Logging configured (no sensitive data logged)
- [ ] Security headers enabled (Helmet)
- [ ] Dependencies audited (`npm audit`)
- [ ] Backup strategy implemented
- [ ] Monitoring/alerting configured

## Known Security Considerations

### 1. File Storage

Currently, files are stored locally. For production:
- Consider using cloud storage (S3, Cloudinary)
- Implement virus scanning
- Set up CDN for serving files

### 2. Session Management

- Tokens expire after 15 minutes (configurable)
- Refresh tokens expire after 7 days
- Consider implementing token blacklisting for immediate logout

### 3. Geolocation

- Location data is stored for attendance
- Ensure compliance with data protection laws
- Consider anonymizing location data

### 4. Selfie Images

- Selfies are stored for attendance verification
- Implement retention policy
- Ensure GDPR/privacy compliance
- Consider face blurring after verification

## Compliance

### GDPR Considerations

- User data collection is minimal and necessary
- Users can request data deletion
- Implement data export functionality
- Document data processing activities
- Obtain explicit consent for data collection

### Data Retention

- Attendance records: 7 years (recommended)
- Payout records: 7 years (tax compliance)
- User accounts: Active until deletion request
- Selfies: Consider 90-day retention

## Security Audit History

| Date | Type | Findings | Status |
|------|------|----------|--------|
| 2025-01-01 | Internal | Initial security review | Completed |

## Contact

For security concerns:
- Email: security@ferocrafts.com
- Response time: Within 48 hours

## Acknowledgments

We appreciate responsible disclosure. Contributors who report valid security issues will be acknowledged (with permission) in our security advisories.

---

**Last Updated**: January 2025

