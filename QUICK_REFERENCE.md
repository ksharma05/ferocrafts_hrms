# Quick Reference Card 📋

## Profile Page
**URL:** `/profile`  
**Access:** Sidebar → Profile

**Features:**
- View all user info
- Upload profile picture
- Change email with OTP

---

## Email Setup (Choose One)

### Gmail (2 min)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```
Get app password: https://myaccount.google.com/apppasswords

### Mailtrap (3 min - Testing)
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
```
Sign up: https://mailtrap.io

### SendGrid (5 min - Production)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```
Sign up: https://sendgrid.com

---

## API Endpoints

```
GET    /api/v1/profile                    Get profile
PUT    /api/v1/profile/picture            Update picture
POST   /api/v1/profile/email/request-otp  Send OTP
POST   /api/v1/profile/email/verify-otp   Verify OTP
```

---

## Test Commands

```bash
# Start servers
cd server && npm start
cd client && npm run dev

# Check email status
npm start  # Look for: ✅ Email service is ready

# Test profile
# Login → Profile → Upload picture → Change email
```

---

## Documentation

- `EMAIL_QUICKSTART.md` - 5-min email setup
- `EMAIL_SETUP_GUIDE.md` - Complete email guide
- `PROFILE_FEATURE.md` - Complete profile guide
- `COMPLETE_FEATURE_SUMMARY.md` - Everything

---

## Status Checks

**Profile:** ✅ Working  
**Email:** ⚠️ Configure .env first  
**Mobile:** ✅ Responsive  
**Docs:** ✅ Complete

---

## Need Help?

1. See `EMAIL_QUICKSTART.md` for fastest setup
2. See `EMAIL_SETUP_GUIDE.md` for troubleshooting
3. Check server logs for errors
4. OTP in console during development

---

**Last Updated:** January 20, 2026

