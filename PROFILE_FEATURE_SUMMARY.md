# Profile Feature - Quick Start Guide

## What Was Added

A complete **User Profile** page where users can:
1. ✅ View their complete profile information
2. ✅ Update profile picture
3. ✅ Change email with OTP verification

## Access the Profile Page

**URL:** `/profile`

**Navigation:** Sidebar → Profile (above Logout button)

## Features

### 1. Profile Information Display
- **Basic Info:** Name, Email, Phone, DOB, Aadhaar, Role
- **Site Assignment:** Current site details and wage rates
- **Banking Details:** Account number, IFSC, UPI ID

### 2. Profile Picture Upload
- Click camera icon on profile picture
- Select image (JPEG, PNG, WEBP, max 5MB)
- Preview before upload
- Upload and see changes immediately

### 3. Email Change (Secure)
- Click "Change" button next to email
- Enter new email → Sends OTP
- Enter 6-digit OTP → Verifies and updates
- OTP expires in 10 minutes

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/profile` | Get profile data |
| PUT | `/api/v1/profile/picture` | Update profile picture |
| POST | `/api/v1/profile/email/request-otp` | Request email change OTP |
| POST | `/api/v1/profile/email/verify-otp` | Verify OTP and update email |

## Testing

### 1. View Profile
1. Login to the app
2. Click "Profile" in sidebar
3. Verify all information displays correctly

### 2. Upload Profile Picture
1. Go to Profile page
2. Click camera icon
3. Select an image file
4. Click "Upload"
5. Wait for success message
6. Refresh page to verify persistence

### 3. Change Email
1. Go to Profile page
2. Click "Change" next to email
3. Enter new email (e.g., `newemail@example.com`)
4. Click "Send OTP"
5. **In Development:** Check browser console for OTP
6. Enter the 6-digit OTP
7. Click "Verify OTP"
8. Success! Email updated

## Important Notes

### Development Mode
- OTP is displayed in browser console and toast notification
- This is for testing purposes only

### Production Mode
- **TODO:** Integrate email service (Nodemailer, SendGrid, etc.)
- OTP will be sent to the user's email address
- Remove OTP from API response

## File Structure

### Backend Files
```
server/src/
├── controllers/profile.js        # Profile logic
├── routes/profile.js            # Profile routes
├── validators/profile.validator.js  # Validation rules
└── models/User.js               # Updated with profile fields
```

### Frontend Files
```
client/src/
├── features/profile/
│   ├── profileService.js        # API calls
│   └── profileSlice.js         # Redux state
└── pages/Profile.jsx           # Profile UI
```

## Mobile Responsive ✅
- Fully responsive design
- Works on all screen sizes
- Touch-friendly buttons
- Mobile-optimized layout

## Security Features
- ✅ JWT authentication required
- ✅ File type validation
- ✅ File size limits
- ✅ OTP expiration
- ✅ Email uniqueness check
- ✅ Secure OTP storage

## Default Test Credentials

You can test with existing users:
```
Employee: employee1@ferocrafts.com / Employee@123
Manager:  manager@ferocrafts.com / Manager@123
Admin:    admin@ferocrafts.com / Admin@123
```

## Quick Test Commands

```bash
# 1. Start the servers (in separate terminals)
cd server && npm start
cd client && npm run dev

# 2. Open browser
http://localhost:5173

# 3. Login and navigate to /profile
```

## Common Issues

**Profile picture not showing?**
- Check if `server/uploads/profile-pictures/` exists
- Server automatically creates it on startup

**OTP not working?**
- Check browser console for OTP in development
- Verify OTP is 6 digits
- Check if OTP expired (10 min limit)

**Can't change email?**
- Ensure new email is not already in use
- Check network tab for errors
- Verify you're logged in

## Next Steps for Production

1. **Email Service Integration:**
   ```javascript
   // Add to server/.env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

2. **Update profile controller** to send real emails

3. **Test email delivery** in staging environment

4. **Remove OTP from API response** in production

## Summary

✅ **Complete Profile Feature Implemented**
- Profile viewing
- Picture upload  
- Email change with OTP
- Mobile responsive
- Secure and validated

**Ready to use in development!**
**Need email service for production.**

---

For detailed documentation, see: `PROFILE_FEATURE.md`

