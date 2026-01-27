# Vercel Deployment - Fix 404 Error

## Issue
Getting 404 error: `Code: NOT_FOUND`

## Root Cause
Vercel is likely trying to build from the **root directory** instead of the **`client`** directory.

## ✅ Solution (2 minutes)

### Go to Vercel Dashboard

1. **Open**: https://vercel.com/dashboard
2. **Click** on your project: `ferocraftshrmsclient1`
3. **Go to Settings** (top menu)
4. **General** (left sidebar)
5. **Scroll to "Root Directory"**
6. **Click "Edit"**
7. **Enter**: `client` ⬅️ **THIS IS THE FIX!**
8. **Save**
9. **Go to Deployments** tab
10. **Click "Redeploy"** on the latest deployment

That's it! ✅

---

## What This Does

Tells Vercel to:
- Build from the `client` folder (not root)
- Look for `package.json` in `client`
- Run `vite build` in the client directory
- Output `dist` folder from client

---

## Alternative: Redeploy from Scratch

If editing root directory doesn't work:

### 1. Delete Current Project
- Settings → General → **Delete Project**

### 2. Create New Project
- Dashboard → **"Add New..."** → **"Project"**
- Select your GitHub repo
- **‼️ IMPORTANT**: Click **"Edit"** next to Root Directory
- Set **Root Directory**: `client`
- Framework: Vite (auto-detected)
- Click **"Deploy"**

---

## Verify Settings

After deployment, verify in Vercel:

| Setting | Value |
|---------|-------|
| **Root Directory** | `client` |
| **Framework** | Vite |
| **Build Command** | `vite build` or `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

---

## Check Build Logs

1. **Vercel Dashboard** → Your Project
2. **Deployments** tab
3. **Click** on latest deployment
4. **Check "Building"** section

**Look for:**
- ✅ `Building...`
- ✅ `Build Completed`
- ❌ Any red error messages

---

## Common Issues

### Issue: "No `package.json` found"
**Fix:** Root Directory must be set to `client`

### Issue: "Build failed"
**Fix:** Check build logs for specific errors

### Issue: "Still 404 after redeploy"
**Fix:** 
- Clear browser cache (Ctrl+Shift+R)
- Try incognito window
- Wait 1-2 minutes for CDN to update

---

## Environment Variables

Don't forget to add in Vercel:

```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

**Where to add:**
- Vercel Dashboard → Your Project
- **Settings** → **Environment Variables**
- Click **"Add"**
- Name: `VITE_API_BASE_URL`
- Value: Your Render backend URL
- Environment: Production
- **Save** and **Redeploy**

---

## Quick Checklist

Before redeploying:
- [ ] Root Directory = `client`
- [ ] Framework = Vite
- [ ] Build command = `vite build` or `npm run build`
- [ ] Output directory = `dist`
- [ ] Environment variable `VITE_API_BASE_URL` added
- [ ] GitHub repo pushed successfully

After deploying:
- [ ] Check build logs (should see "Build Completed")
- [ ] Visit your Vercel URL
- [ ] Should see Login page (not 404)

---

## Expected Result

After fixing Root Directory and redeploying:

✅ Visit: `https://ferocraftshrmsclient1.vercel.app`  
✅ See: **Login page** with FeroCrafts HRMS branding  
✅ No more 404 error!

---

## Still Having Issues?

Check:
1. **Build logs** in Vercel deployment details
2. **Console errors** in browser (F12)
3. **Network tab** for failed requests

Share the build logs and I can help debug further!

---

**TL;DR: Set Root Directory to `client` in Vercel settings and redeploy!**
