# Email Service Setup Guide

This guide will help you configure email service for FeroCrafts HRMS to send OTP emails, welcome emails, and notifications.

## Quick Setup

### Step 1: Choose Email Provider

We support multiple email providers:
- **Gmail** (recommended for small-scale)
- **SendGrid** (recommended for production)
- **Mailtrap** (recommended for testing)
- **Amazon SES** (for large-scale)
- **Microsoft Outlook/Office 365**

### Step 2: Configure Environment Variables

Add these to your `server/.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM_NAME=FeroCrafts HRMS
```

### Step 3: Restart Server

```bash
cd server
npm start
```

You should see: `✅ Email service is ready`

---

## Provider-Specific Setup

### 1. Gmail (Easiest for Development)

**Pros:** Free, easy to set up, reliable  
**Cons:** Daily sending limit (500 emails/day), requires app password

**Setup Steps:**

1. **Enable 2-Factor Authentication:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "FeroCrafts HRMS"
   - Copy the 16-character password

3. **Configure .env:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   EMAIL_FROM_NAME=FeroCrafts HRMS
   ```

4. **Test:**
   ```bash
   npm start
   # Should see: ✅ Email service is ready
   ```

**Troubleshooting Gmail:**
- Error "Invalid credentials": Make sure you're using App Password, not your Gmail password
- Error "Less secure apps": Enable 2FA and use App Password
- Error "Daily limit exceeded": Gmail limits to 500 emails/day

---

### 2. SendGrid (Best for Production)

**Pros:** 100 emails/day free tier, scalable, reliable  
**Cons:** Requires signup, API key management

**Setup Steps:**

1. **Create Account:**
   - Go to https://sendgrid.com
   - Sign up for free account

2. **Verify Sender Identity:**
   - Go to Settings → Sender Authentication
   - Verify your email address or domain

3. **Create API Key:**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name: "FeroCrafts HRMS"
   - Permission: "Full Access" or "Mail Send"
   - Copy the API key (you won't see it again!)

4. **Configure .env:**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   EMAIL_FROM_NAME=FeroCrafts HRMS
   ```

5. **Test:**
   ```bash
   npm start
   # Should see: ✅ Email service is ready
   ```

**Troubleshooting SendGrid:**
- Error "Sender not verified": Complete sender verification in dashboard
- Error "Forbidden": Check API key permissions
- Emails not delivering: Check Activity Feed in dashboard

---

### 3. Mailtrap (Perfect for Testing)

**Pros:** Fake SMTP server, catches all emails, no real sending  
**Cons:** Emails don't actually deliver (testing only!)

**Setup Steps:**

1. **Create Account:**
   - Go to https://mailtrap.io
   - Sign up for free account

2. **Get Credentials:**
   - Go to Email Testing → Inboxes
   - Click on your inbox
   - Copy SMTP credentials from "Integrations" → "Nodemailer"

3. **Configure .env:**
   ```env
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_SECURE=false
   SMTP_USER=your-mailtrap-username
   SMTP_PASS=your-mailtrap-password
   EMAIL_FROM_NAME=FeroCrafts HRMS
   ```

4. **Test:**
   ```bash
   npm start
   # All emails will appear in Mailtrap inbox (not real recipients)
   ```

**Perfect for:**
- Development testing
- QA testing
- Staging environments
- Demo purposes

---

### 4. Amazon SES (Enterprise Scale)

**Pros:** Very cheap ($0.10 per 1000 emails), highly scalable  
**Cons:** Requires AWS account, more complex setup

**Setup Steps:**

1. **Set Up AWS SES:**
   - Go to AWS Console → SES
   - Verify email address or domain
   - Request production access (starts in sandbox mode)

2. **Create SMTP Credentials:**
   - SES → SMTP Settings
   - Click "Create My SMTP Credentials"
   - Download credentials

3. **Configure .env:**
   ```env
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-ses-access-key
   SMTP_PASS=your-ses-secret-key
   EMAIL_FROM_NAME=FeroCrafts HRMS
   ```

---

### 5. Microsoft Outlook/Office 365

**Pros:** Good for organizations already using Microsoft  
**Cons:** Requires Microsoft account, lower limits

**Configure .env:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
EMAIL_FROM_NAME=FeroCrafts HRMS
```

---

## Testing Your Email Setup

### 1. Check Server Logs

When you start the server:
```bash
npm start
```

Look for:
```
✅ Email transporter configured
✅ Email service is ready
```

If you see warnings:
```
⚠️  Email service not configured. Email features will be disabled.
```
Then check your .env file.

### 2. Test OTP Email

1. Start both servers:
   ```bash
   # Terminal 1
   cd server && npm start
   
   # Terminal 2
   cd client && npm run dev
   ```

2. Login to the app

3. Go to Profile page

4. Click "Change" next to email

5. Enter a new email and click "Send OTP"

6. Check:
   - **Production:** Check the recipient email inbox
   - **Development:** Check browser console (OTP is displayed)
   - **Mailtrap:** Check Mailtrap inbox

### 3. Manual API Test

```bash
# Login first
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"employee1@ferocrafts.com","password":"Employee@123"}' \
  -c cookies.txt

# Request OTP (will send email)
curl -X POST http://localhost:5000/api/v1/profile/email/request-otp \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"newEmail":"test@example.com"}'
```

---

## Email Templates

We provide beautiful HTML email templates for:

### 1. OTP Email
- Used for email change verification
- Can be used for password reset (future feature)
- Professional design with security warnings
- Mobile responsive

### 2. Welcome Email
- Sent when new users are created
- Lists key features
- Encourages engagement

### 3. Custom Emails
You can easily add more email templates by using the `sendEmail` function:

```javascript
const { sendEmail } = require('./config/email');

await sendEmail({
  to: 'user@example.com',
  subject: 'Your Subject',
  text: 'Plain text version',
  html: '<h1>HTML version</h1>',
});
```

---

## Common Issues and Solutions

### Issue: "Invalid credentials"
**Solution:**
- Gmail: Use App Password, not regular password
- SendGrid: Make sure you're using "apikey" as username
- Check for typos in SMTP_USER and SMTP_PASS

### Issue: "Connection timeout"
**Solution:**
- Check SMTP_HOST and SMTP_PORT
- Verify firewall isn't blocking SMTP ports
- Try different port (587, 465, or 25)

### Issue: "Self-signed certificate"
**Solution:**
- Set SMTP_SECURE=false for port 587
- Set SMTP_SECURE=true for port 465

### Issue: "Emails going to spam"
**Solution:**
- Verify your sender domain (SPF, DKIM records)
- Use professional email service (SendGrid, SES)
- Avoid spam trigger words
- Include unsubscribe link (for bulk emails)

### Issue: "Daily limit exceeded"
**Solution:**
- Gmail: Upgrade to Google Workspace or use SendGrid
- SendGrid Free: Upgrade to paid plan
- Consider using Amazon SES for unlimited sending

---

## Production Best Practices

### 1. Use Professional Email Service
Don't use Gmail for production:
- ❌ Gmail: 500 emails/day limit
- ✅ SendGrid: 100 emails/day free, scalable
- ✅ Amazon SES: $0.10 per 1000 emails

### 2. Verify Your Domain
Set up SPF, DKIM, and DMARC records:
- Improves deliverability
- Prevents emails going to spam
- Builds sender reputation

### 3. Monitor Email Delivery
- Set up bounce handling
- Track delivery rates
- Monitor spam complaints
- Use email analytics

### 4. Handle Failures Gracefully
Our implementation:
- Logs email errors
- Doesn't break app if email fails
- Provides fallback in development
- Returns OTP in console for testing

### 5. Rate Limiting
Consider adding rate limits:
- Max OTP requests per hour
- Max emails per user per day
- Prevent email bombing

---

## Security Considerations

### 1. OTP Security
✅ Already implemented:
- 10-minute expiration
- Single use (cleared after verification)
- Stored securely (not selected by default)
- Not sent in production API response

### 2. Email Content Security
✅ Already implemented:
- No sensitive data in emails
- Clear security warnings
- Professional templates
- Unsubscribe options ready

### 3. SMTP Credentials
🔒 Keep secure:
- Never commit .env to git
- Use environment variables
- Rotate passwords regularly
- Use API keys (not passwords) when possible

---

## Cost Comparison

| Provider | Free Tier | Paid Plans | Best For |
|----------|-----------|-----------|----------|
| Gmail | 500/day | N/A | Development |
| SendGrid | 100/day | $15/mo (40K) | Small-Medium |
| Mailtrap | 500 emails | $10/mo (1K) | Testing |
| Amazon SES | 62K/mo | $0.10/1K | Enterprise |
| Mailgun | 5K/mo | $35/mo (50K) | Medium-Large |

---

## Next Steps

1. **Choose a provider** based on your needs
2. **Configure .env** with your credentials
3. **Test the setup** with profile email change
4. **Monitor** email delivery in production
5. **Add more email templates** as needed

---

## Support

Having issues? Check:
1. Server logs for detailed error messages
2. Email provider dashboard for delivery status
3. This guide for troubleshooting tips
4. Provider documentation for specific issues

**Email Configuration Status:**
- ✅ Email service integrated
- ✅ OTP emails implemented
- ✅ Welcome emails ready
- ✅ Beautiful HTML templates
- ✅ Error handling
- ✅ Production ready

---

**Created:** January 20, 2026  
**Version:** 1.0  
**Status:** Production Ready

