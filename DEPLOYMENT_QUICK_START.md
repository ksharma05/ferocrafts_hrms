# 🚀 Deploy to Vercel + Render (Free Tier)

## Quick Deployment Guide

This guide will help you deploy FeroCrafts HRMS for **FREE** using:
- **Frontend**: Vercel (free tier)
- **Backend**: Render (free tier)
- **Database**: MongoDB Atlas M0 (free tier)

**Total cost: $0/month** ✅

---

## Prerequisites

1. ✅ **GitHub account**
2. ✅ **Vercel account** (sign up at https://vercel.com)
3. ✅ **Render account** (sign up at https://render.com)
4. ✅ **MongoDB Atlas account** (you already have this)

---

## Step 1: Push to GitHub

### 1.1 Create a new GitHub repository
```bash
# Go to https://github.com/new
# Create a new repository (e.g., "ferocrafts-hrms")
# Don't initialize with README (we have code already)
```

### 1.2 Push your code
```bash
cd /home/khushal/Desktop/FeroCraftsHRMS

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - FeroCrafts HRMS"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/ferocrafts-hrms.git

# Push
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend on Render

### 2.1 Create Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ferocrafts-hrms-backend` (or your choice)
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`ferocrafts_hrms
   - **Start Command**: `node src/index.js`
   - **Instance Type**: Free

### 2.2 Add Environment Variables
Click "Advanced" → "Add Environment Variable":

```
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secure_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_min_32_chars
JWT_COOKIE_EXPIRE=7
CLIENT_URL=https://your-app-name.vercel.app
BASE_URL=https://ferocrafts-hrms-backend.onrender.com
```

**Important:**
- Generate secure secrets: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Replace `your-app-name` with your actual Vercel app name (you'll get this in Step 3)
- Use your actual MongoDB Atlas connection string

**Optional (Email):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM_NAME=FeroCrafts HRMS
```

### 2.3 Deploy
- Click **"Create Web Service"**
- Wait 5-10 minutes for deployment
- You'll get a URL like: `https://ferocrafts-hrms-backend.onrender.com`

### 2.4 Test Backend
Visit: `https://ferocrafts-hrms-backend.onrender.com/health`

Should return:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "..."
}
```

---

## Step 3: Deploy Frontend on Vercel

### 3.1 Import Project
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Add Environment Variable
Click "Environment Variables":

```
VITE_API_BASE_URL=https://ferocrafts-hrms-backend.onrender.com
```

**Replace** with your actual Render backend URL from Step 2.3.

### 3.3 Deploy
- Click **"Deploy"**
- Wait 2-3 minutes
- You'll get a URL like: `https://ferocrafts-hrms.vercel.app`

---

## Step 4: Update Backend with Frontend URL

### 4.1 Go back to Render Dashboard
1. Open your backend service
2. Go to "Environment" tab
3. Update `CLIENT_URL`:
   ```
   CLIENT_URL=https://ferocrafts-hrms.vercel.app
   ```
4. Click "Save Changes"
5. Service will auto-redeploy (1-2 minutes)

---

## Step 5: Test Your Deployment! 🎉

### 5.1 Open Your App
Visit: `https://ferocrafts-hrms.vercel.app`

### 5.2 Login
Use your existing credentials:
```
Admin: admin@ferocrafts.com / Admin@123
Manager: manager@ferocrafts.com / Manager@123
Employee: employee1@ferocrafts.com / Employee@123
```

### 5.3 Test Features
- ✅ Login
- ✅ Dashboard
- ✅ Profile page
- ✅ Check-in/out (employees)
- ✅ Employee management (admin/manager)
- ✅ Attendance approval
- ✅ Sites management
- ✅ Payouts

---

## Important Notes

### ⚠️ Free Tier Limitations

**Render Free Tier:**
- ⏰ **Sleeps after 15 minutes of inactivity**
- 🐌 **First request after sleep takes 30-60 seconds** (cold start)
- 💾 **750 hours/month** (enough for demos)
- 🗄️ **Disk files reset on each deploy** (uploads will be lost on redeploy)

**Solutions:**
- For testing: acceptable delays
- For production: upgrade to Render Starter ($7/month)
- For uploads: migrate to Cloudinary/S3 (see below)

**Vercel Free Tier:**
- ✅ 100 GB bandwidth/month
- ✅ Fast CDN
- ✅ Automatic HTTPS
- ✅ No sleep delays

**MongoDB Atlas M0:**
- ✅ 512 MB storage (enough for testing)
- ✅ No automatic sleep
- ✅ Shared cluster (slower than paid)

---

## Troubleshooting

### Backend Not Responding
- Wait 60 seconds (cold start from sleep)
- Check Render logs: Dashboard → Logs
- Verify environment variables are set

### CORS Errors
- Verify `CLIENT_URL` in Render matches your Vercel URL exactly
- Check browser console for actual error

### MongoDB Connection Failed
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist: allow `0.0.0.0/0` for Render

### Login Not Working
- Check browser Network tab for API calls
- Verify `VITE_API_BASE_URL` in Vercel is correct
- Check cookies are being set (HTTPS required)

---

## Keeping Backend Awake

### Option 1: UptimeRobot (Free)
1. Sign up at https://uptimerobot.com
2. Add monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://ferocrafts-hrms-backend.onrender.com/health`
   - **Interval**: Every 5 minutes
3. This pings your backend, preventing sleep

### Option 2: Cron-job.org (Free)
1. Go to https://cron-job.org
2. Create job to hit your `/health` endpoint every 10 minutes

---

## Migrating Uploads to Cloud Storage (Optional)

For production, uploads should use cloud storage:

### Cloudinary (Free Tier: 25 GB storage)
1. Sign up at https://cloudinary.com
2. Add to Render environment:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Update upload middleware to use Cloudinary SDK

### AWS S3 (Affordable)
- ~$0.023/GB/month
- More complex setup

---

## Monitoring Your Deployment

### Render Dashboard
- View logs in real-time
- Monitor CPU/memory usage
- Check deploy status

### Vercel Dashboard
- View deployment logs
- Check analytics
- Monitor performance

### MongoDB Atlas
- Monitor database metrics
- Check connection count
- Review query performance

---

## Updating Your Deployment

### To Deploy Changes:

```bash
# Make your changes locally
git add .
git commit -m "Your commit message"
git push origin main
```

**Automatic:**
- Vercel auto-deploys from `main` branch (~2 min)
- Render auto-deploys from `main` branch (~5 min)

**Manual:**
- Vercel: Dashboard → Redeploy
- Render: Dashboard → Manual Deploy

---

## Cost Breakdown

| Service | Free Tier | Paid Upgrade | When to Upgrade |
|---------|-----------|--------------|-----------------|
| **Vercel** | ✅ Generous | $20/month | High traffic |
| **Render** | ✅ Limited | $7/month | Production use |
| **MongoDB Atlas** | ✅ 512MB | $9/month (M2) | >100 users |

**Total Free:** $0/month (perfect for demos/testing)  
**Minimal Paid:** $7-16/month (small production)  
**Full Production:** $36+/month (scaling)

---

## Next Steps

### For Demo/Testing:
✅ You're done! Share your Vercel URL.

### For Production:
1. Upgrade Render to Starter ($7/month)
2. Set up Cloudinary for uploads
3. Configure email service (Gmail/SendGrid)
4. Add custom domain
5. Set up monitoring (Sentry, LogRocket)
6. Enable HTTPS (automatic on Vercel/Render)

---

## URLs Summary

After deployment, you'll have:

- **Frontend**: `https://ferocrafts-hrms.vercel.app`
- **Backend**: `https://ferocrafts-hrms-backend.onrender.com`
- **API Docs**: `https://ferocrafts-hrms-backend.onrender.com/api-docs`
- **Health Check**: `https://ferocrafts-hrms-backend.onrender.com/health`

---

## Support

Having issues? Check:
1. Render logs for backend errors
2. Vercel logs for frontend errors
3. Browser console for client errors
4. MongoDB Atlas logs for database issues

---

**🎉 Congratulations! Your app is now live and free!**

**Deployment Time:** ~20-30 minutes  
**Cost:** $0/month  
**Perfect for:** Demos, testing, portfolio, small teams

---

**Created:** January 20, 2026  
**Version:** 1.0  
**Last Updated:** January 20, 2026

