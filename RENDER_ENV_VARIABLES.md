# Render Environment Variables - Quick Reference

## 🔧 Required Environment Variables for Render

Copy these to your Render backend service:

### 1. Database
```
MONGO_URI=mongodb+srv://khushalvgotu_db_user:wxvSbM1cVF74Jddt@ferocraftshrms.exrhdbh.mongodb.net/
```

### 2. JWT Secrets
```
JWT_SECRET=ferocrafts_jwt_secret
JWT_REFRESH_SECRET=ferocrafts_jwt_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
```

### 3. **IMPORTANT: Frontend URL**
```
CLIENT_URL=https://ferocraftshrmsclient1.vercel.app
```
⚠️ **This MUST match your actual Vercel URL!**

### 4. Server Config
```
NODE_ENV=production
PORT=5000
BASE_URL=https://ferocrafts-hrms-backend.onrender.com
```

### 5. Email Config (Optional - Gmail)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=khushal.vgotu@gmail.com
SMTP_PASS=YOUR_GMAIL_APP_PASSWORD
EMAIL_FROM_NAME=FeroCrafts HRMS
```

---

## 📝 How to Add These in Render

1. **Go to**: https://dashboard.render.com/
2. **Select**: Your backend service (ferocrafts-hrms-backend)
3. **Click**: "Environment" (left sidebar)
4. **For each variable above**:
   - Click "Add Environment Variable"
   - Enter Name and Value
   - Click "Save Changes"

---

## 🚨 Common Issues

### CORS Error
**Problem:** Frontend can't connect to backend

**Solution:** Make sure `CLIENT_URL` in Render matches your Vercel URL exactly:
```
CLIENT_URL=https://ferocraftshrmsclient1.vercel.app
```
(No trailing slash!)

### Email Not Working
**Problem:** OTP emails not sending

**Solution 1 (For Testing):**
- Change `NODE_ENV=development` in Render
- OTP will log to console instead

**Solution 2 (For Production):**
- Use Gmail App Password (not regular password)
- Generate at: https://myaccount.google.com/apppasswords

### Database Connection Error
**Problem:** Can't connect to MongoDB

**Solution:**
- Check MongoDB Atlas whitelist: Add `0.0.0.0/0` to allow all IPs
- Verify `MONGO_URI` is correct with username/password

---

## ✅ After Updating Environment Variables

1. **Render auto-redeploys** when you save env variables
2. **Wait 2-3 minutes** for deployment
3. **Check logs**: Click "Logs" in Render dashboard
4. **Test**: Visit your Vercel app and try logging in

---

## 🔄 Support Multiple Frontend URLs (Optional)

If you have multiple frontend deployments (e.g., staging + production):

**Add this variable:**
```
ALLOWED_ORIGINS=https://ferocraftshrmsclient1.vercel.app,https://staging.vercel.app
```

This works alongside `CLIENT_URL` to allow multiple origins.

---

## 📋 Quick Checklist

Before your app works end-to-end:

**Backend (Render):**
- [ ] `CLIENT_URL` = Your actual Vercel URL
- [ ] `NODE_ENV` = `production`
- [ ] `MONGO_URI` = Your MongoDB Atlas connection string
- [ ] All JWT secrets added
- [ ] Deployment successful (check logs)

**Frontend (Vercel):**
- [ ] `VITE_API_BASE_URL` = `https://ferocrafts-hrms-backend.onrender.com`
- [ ] Root Directory = `client`
- [ ] Deployment successful

**Test:**
- [ ] Visit Vercel URL → See login page ✅
- [ ] Try logging in → No CORS error ✅
- [ ] Check browser console → No red errors ✅

---

## 🆘 Still Having Issues?

**Check Render Logs:**
1. Render Dashboard → Your Service
2. Click "Logs" tab
3. Look for errors in red

**Check Browser Console:**
1. Open your Vercel app
2. Press F12 → Console tab
3. Look for CORS or network errors

**Common Error Messages:**
- `CORS policy` → Update `CLIENT_URL` in Render
- `Network Error` → Check backend is running (Render logs)
- `401 Unauthorized` → Clear cookies, try again
- `500 Internal Server Error` → Check Render logs for backend errors

---

**Next Step:** Update `CLIENT_URL` in Render to `https://ferocraftshrmsclient1.vercel.app` and wait for redeploy!
