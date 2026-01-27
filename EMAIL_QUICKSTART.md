# Email Service - Quick Start (5 minutes)

## Choose Your Provider

### Option 1: Gmail (Easiest - 2 minutes)
Perfect for development and testing.

**Steps:**
1. Go to https://myaccount.google.com/apppasswords
2. Create app password for "Mail"
3. Copy the 16-character password
4. Add to `server/.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   EMAIL_FROM_NAME=FeroCrafts HRMS
   ```

### Option 2: Mailtrap (Best for Testing - 3 minutes)
Catches all emails without actually sending them.

**Steps:**
1. Go to https://mailtrap.io and sign up
2. Get credentials from Inboxes → Integrations → Nodemailer
3. Add to `server/.env`:
   ```env
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_SECURE=false
   SMTP_USER=your-mailtrap-username
   SMTP_PASS=your-mailtrap-password
   EMAIL_FROM_NAME=FeroCrafts HRMS
   ```

### Option 3: SendGrid (Best for Production - 5 minutes)
**Steps:**
1. Sign up at https://sendgrid.com
2. Verify sender email
3. Create API Key
4. Add to `server/.env`:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   EMAIL_FROM_NAME=FeroCrafts HRMS
   ```

## Test It!

1. **Restart server:**
   ```bash
   cd server
   npm start
   ```

2. **Look for:** `✅ Email service is ready`

3. **Test profile email change:**
   - Login to app
   - Go to Profile
   - Click "Change" next to email
   - Enter new email
   - Check email inbox (or Mailtrap, or console in dev)

## That's it! 🎉

Your email service is now configured and ready to send OTPs.

---

**Need help?** See `EMAIL_SETUP_GUIDE.md` for detailed instructions.

