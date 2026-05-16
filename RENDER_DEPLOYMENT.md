# 🚀 Deploy Backend to Render.com

## Prerequisites

- GitHub repository with your code
- Render.com account (free tier available)
- Docker image ready (✅ created)

---

## Step 1: Push Code to GitHub

```bash
cd c:\Users\samee\OneDrive\Desktop\WebPage

git add .
git commit -m "Add Dockerfile for Render deployment"
git push origin main
```

---

## Step 2: Create Render Web Service

### Option A: Using Render Dashboard (Recommended for beginners)

1. Go to [render.com](https://render.com)
2. Sign in to your account
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Select the repository and branch (main)

### Option B: Using render.yaml (Infrastructure as Code)

Create a `render.yaml` file in your project root:

```yaml
services:
  - type: web
    name: secureapp-backend
    env: docker
    repo: https://github.com/YOUR_USERNAME/YOUR_REPO
    dockerfilePath: ./backend/Dockerfile
    plan: free
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: DB_HOST
        sync: false
      - key: FACE_SERVICE_URL
        sync: false
```

---

## Step 3: Configure Environment Variables

In Render Dashboard:

1. Go to your Web Service
2. Click **"Environment"** tab
3. Add all variables from your `.env` file:

```
PORT=3000
NODE_ENV=production
DB_HOST=your-aiven-host.e.aivencloud.com
DB_PORT=25223
DB_USER=your-db-user
DB_PASSWORD=PLACEHOLDER_PASSWORD
DB_NAME=your-database-name
DB_ENABLE_SSL=true
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES=50min
JWT_REFRESH_EXPIRES=30d
ENCRYPTION_KEY=your_encryption_key_here
GMAIL_USER=your-email@gmail.com
GMAIL_CLIENT_ID=PLACEHOLDER_ID
GMAIL_CLIENT_SECRET=PLACEHOLDER_SECRET
GMAIL_REDIRECT_URI=https://YOUR_RENDER_DOMAIN/api/auth/google/callback
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token-here
GMAIL_FROM=your-email@gmail.com
FACE_SERVICE_URL=your-hf-space-url
FACE_SERVICE_API_KEY=your-face-api-key
FACE_CONFIDENCE_THRESHOLD=0.6
MQTT_BROKER=your-mqtt-broker-url
MQTT_USER=your-mqtt-user
MQTT_PASSWORD=your-mqtt-password
PI_API_KEY=your-pi-api-key
CORS_ORIGIN=http://localhost:3000,https://YOUR_FRONTEND_DOMAIN
NODE_OPTIONS="--dns-result-order=ipv4first"
```

---

## Step 4: Configure Build & Deploy Settings

In Render Dashboard → **"Settings"**:

### Build & Deploy
- **Build Command**: Leave empty (Dockerfile handles it)
- **Start Command**: Leave empty (Dockerfile handles it)
- **Root Directory**: `backend`
- **Auto-Deploy**: ✅ Enabled (auto-deploy on git push)

### Health Check
- Render automatically detects the health check from Dockerfile
- Default: checks `/api/health` endpoint

---

## Step 5: Deploy

After configuring environment variables:

1. Click **"Deploy"** button
2. Watch the build logs
3. Once deployed, Render provides a URL like: `https://secureapp-backend.onrender.com`

---

## Step 6: Update Frontend Configuration

Once deployed, update frontend `.env.local`:

```env
VITE_API_URL=https://secureapp-backend.onrender.com/api
VITE_MQTT_BROKER=mqtts://bb9f7b883ac247ceb390c4c532330999.s1.eu.hivemq.cloud:8883
VITE_FACE_SERVICE_URL=https://Soapppp11-enterprise-access-control-face.hf.space
```

---

## Monitoring & Troubleshooting

### View Logs
```
Render Dashboard → Your Service → Logs
```

### Common Issues & Fixes

**Issue: Build failed - "Cannot find module"**
- Fix: Ensure `package.json` and `package-lock.json` are in `backend/`
- Check: `npm install` succeeds locally first

**Issue: Health check failing**
- Ensure `/api/health` endpoint exists in your backend
- Check database connectivity with test script locally

**Issue: Database connection timeout**
- Verify Aiven credentials in environment variables
- Check if SSL is enabled properly (DB_ENABLE_SSL=true)
- Ensure Aiven allows connections from external IPs

**Issue: 502 Bad Gateway**
- Usually means app crashed during startup
- Check Render logs for error details
- Verify all required environment variables are set

**Issue: Slow deployment**
- First deployment might be slow (building Node image)
- Subsequent deployments are faster
- Can take 5-10 minutes on free tier

---

## Production Checklist ✅

- [ ] All environment variables set correctly
- [ ] Database credentials verified
- [ ] CORS_ORIGIN updated with your domain
- [ ] GMAIL_REDIRECT_URI updated with Render domain
- [ ] GitHub repository is public (or Render has access)
- [ ] Docker image builds successfully locally
- [ ] Health check endpoint working
- [ ] Test API endpoints after deployment
- [ ] Set up auto-restart policy

---

## Useful Render Commands & Info

### Get Service URL
After deployment, your backend URL will be:
```
https://[service-name].onrender.com
```

Example:
```
https://secureapp-backend.onrender.com
```

### Manual Deploy
Click **"Manual Deploy"** → **"Deploy latest commit"** in Render Dashboard

### Scale Resources (if needed)
- Free tier: 0.5 CPU, 512 MB RAM
- Paid tier: Upgrade in **"Plan"** settings

---

## Advanced: Custom Domain

1. Go to **Settings** → **Custom Domain**
2. Add your domain (e.g., `api.yourdomain.com`)
3. Update DNS records as instructed by Render
4. Update `GMAIL_REDIRECT_URI` and `CORS_ORIGIN` accordingly

---

## Cost Estimate

**Render Free Tier:**
- ✅ 1 free web service (spins down after 15 min inactivity)
- ✅ Perfect for development/testing
- ❌ Not recommended for production (frequent restarts)

**Render Starter Plan ($7/month):**
- ✅ Always running
- ✅ Better performance
- ✅ Recommended for production

---

## Quick Reference

**Deploy Flow:**
```
Local Dev → Push to GitHub → Render Webhook → Build Docker → Deploy
```

**Health Check URL:**
```
https://secureapp-backend.onrender.com/api/health
```

**Test API:**
```bash
curl -X GET https://secureapp-backend.onrender.com/api/health

# Should return:
# {
#   "status": "ok",
#   "timestamp": "2026-05-17T10:30:00Z"
# }
```

---

**Next Steps:**
1. ✅ Dockerfile created
2. → Push to GitHub
3. → Connect to Render
4. → Set environment variables
5. → Deploy!

**Questions?** Check [Render Documentation](https://render.com/docs)

Last Updated: May 17, 2026
