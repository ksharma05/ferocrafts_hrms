# Vercel Not Deploying Latest Code - FIX

## Problem
Vercel is deploying "Initial commit" instead of latest code with the axios fix.

## Solution

### Option 1: Reconnect Vercel to GitHub (Recommended)

1. **Delete Current Vercel Project**
   - Go to: https://vercel.com/dashboard
   - Click: **ferocrafts-hrms-client**
   - Settings → General → Scroll to bottom
   - Click: **"Delete Project"**
   - Confirm deletion

2. **Import Fresh from GitHub**
   - Go to: https://vercel.com/dashboard
   - Click: **"Add New..." → "Project"**
   - Click: **"Import Git Repository"**
   - Find: **ksharma05/ferocrafts_hrms**
   - Click: **"Import"**

3. **⚠️ CRITICAL: Configure BEFORE Deploying**
   
   **Root Directory:**
   - Click **"Edit"** next to Root Directory
   - Enter: **`client`**
   
   **Environment Variables:**
   - Click **"Environment Variables"**
   - Add:
     ```
     Name:  VITE_API_BASE_URL
     Value: https://ferocrafts-hrms-backend.onrender.com
     ```
   - Environment: **Production** ✅

4. **Deploy**
   - Click: **"Deploy"**
   - Wait 2-3 minutes

---

### Option 2: Force Vercel to Use Latest Commit

If you don't want to recreate:

1. **Verify Git Connection**
   - Vercel Dashboard → Your Project
   - Settings → Git
   - **Production Branch**: Should be `main`
   - **Git Repository**: Should be `ksharma05/ferocrafts_hrms`

2. **Trigger New Deployment from Git**
   - Make a small change to force GitHub to notify Vercel
   - Or manually trigger from Vercel:
     - Deployments → Click **"..."** → Redeploy
     - Select: **Use latest commit from Git**

3. **Check Build Logs**
   - After deployment starts
   - Click on the deployment
   - Check "Building" logs
   - Look for: "Cloning completed" with commit hash `bf00312`

---

### Option 3: Manual Trigger via Empty Commit

If Vercel still won't pick up changes:

```bash
cd /home/khushal/Desktop/FeroCraftsHRMS
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin main
```

This will trigger Vercel to deploy the latest code.

---

## Verify Deployment Has Latest Code

After deployment completes:

1. **Check Vercel Deployment Details**
   - Go to: Deployments tab
   - Click on latest deployment
   - Look for: **Source** section
   - Should show commit: `bf00312 - fix: use full api url for token refresh`

2. **Test the App**
   - Open: https://ferocrafts-hrms-client.vercel.app
   - Login: `admin@ferocrafts.com` / `Admin@123`
   - Navigate to Employees
   - Open Console (F12)
   - Should see NO 405 errors on refresh endpoint

---

## What to Look For

**✅ CORRECT:**
- Deployment source shows: `bf00312` or later
- Console shows: Requests to `https://ferocrafts-hrms-backend.onrender.com/api/v1/auth/refresh`
- No 405 errors

**❌ WRONG:**
- Deployment source shows: "Initial commit" or `cfcda8c`
- Console shows: Requests to `https://ferocrafts-hrms-client.vercel.app/api/v1/auth/refresh`
- 405 Method Not Allowed errors

---

## GitHub Repository Info

Your code is correctly pushed:

```
Repository: https://github.com/ksharma05/ferocrafts_hrms.git
Latest Commit: bf00312 (fix: use full api url for token refresh in production)
Branch: main
```

Vercel MUST be configured to deploy from:
- Repository: `ksharma05/ferocrafts_hrms`
- Branch: `main`
- Latest commit: `bf00312` or newer

---

## Quick Diagnostic

**In Vercel Dashboard → Deployments:**

1. Click on your latest deployment
2. Look for the "Source" section
3. **What commit hash does it show?**
   - If it shows `cfcda8c` (Initial commit) → ❌ WRONG
   - If it shows `bf00312` or later → ✅ CORRECT

**If it's showing the wrong commit:**
- Delete the project and reimport (Option 1)
- OR make an empty commit to trigger new deployment (Option 3)

---

**TL;DR:** Delete Vercel project, reimport from GitHub, configure Root Directory=`client` and add environment variable BEFORE deploying!
