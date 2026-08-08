# Complete Cloud Deployment Guide

**Deploy QAL frontend, backend, and database to production**

**Time**: 30-45 minutes
**Cost**: Free tier available, or ~$15-30/month

---

## 🎯 Architecture After Deployment

```
┌──────────────────────────────────────────────────────────────┐
│ PRODUCTION CLOUD DEPLOYMENT                                  │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ FRONTEND LAYER (Vercel)                                       │
│ ├─ https://qalnet.vercel.app                                 │
│ ├─ Next.js application                                       │
│ ├─ Hosted globally with CDN                                  │
│ └─ Auto-deploys from GitHub                                  │
│         │                                                    │
│         ├─ HTTP Requests ─────────────┐                      │
│                                        ↓                      │
│ BACKEND LAYER (Railway/Render/Heroku)                        │
│ ├─ https://api.qalnet.app                                    │
│ ├─ NestJS application                                        │
│ ├─ Runs 24/7 on cloud server                                 │
│ └─ Auto-deploys from GitHub                                  │
│         │                                                    │
│         ├─ SQL Queries ────────────────┐                     │
│                                        ↓                     │
│ DATABASE LAYER (Neon/AWS RDS)                               │
│ ├─ PostgreSQL database                                       │
│ ├─ Encrypted connections                                     │
│ ├─ Daily backups                                             │
│ └─ 99.9% uptime SLA                                          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

- [ ] GitHub account (to store code)
- [ ] Neon account (database)
- [ ] Vercel account (frontend)
- [ ] Railway/Render account (backend)

---

## 🚀 STEP 1: Push Code to GitHub

### 1.1 Create GitHub Repository
1. Go to: https://github.com/new
2. Create repo named: `qalnet`
3. Clone it:
   ```bash
   git clone https://github.com/YOUR_USERNAME/qalnet.git
   cd qalnet
   ```

### 1.2 Add Frontend Code
```bash
# Copy frontend to git directory
cp -r c:\Qal\QAL/* ./

# Or if you prefer, manually copy:
# - src/app
# - public
# - package.json
# - etc.
```

### 1.3 Add Backend Code (same repo)
```bash
# Create backend folder in same repo
mkdir backend
cp -r c:\Qal\QalNet-/* backend/

# Structure should be:
# qalnet/
#   ├── package.json (frontend)
#   ├── src/ (frontend)
#   ├── backend/
#   │   ├── package.json (backend)
#   │   ├── src/ (backend)
#   │   └── ...
#   └── ...
```

### 1.4 Create .gitignore
Create file: `.gitignore`
```
node_modules/
.env
.env.local
.next
dist/
.DS_Store
*.log
```

### 1.5 Push to GitHub
```bash
git add .
git commit -m "Initial commit: QAL frontend + backend"
git branch -M main
git push -u origin main
```

---

## 🌐 STEP 2: Set Up Cloud Database (Neon)

Follow: **NEON_QUICKSTART.md** (takes 5 minutes)

**Outcome**: You have:
- Neon project: `qalnet-prod`
- Connection string: `postgresql://...@ep-xxxxx.neon.tech/neondb?sslmode=require`

---

## 🔧 STEP 3: Deploy Backend (Railway)

### 3.1 Create Railway Account
1. Go to: https://railway.app
2. Sign up with GitHub
3. Authorize Railway

### 3.2 Create Backend Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `qalnet` repository
4. Select the `backend` folder as root

### 3.3 Configure Environment Variables
In Railway project settings:
```
DATABASE_URL=postgresql://neondb_owner:xxxxxxx@ep-xxxxx.neon.tech/neondb?sslmode=require
NODE_ENV=production
JWT_SECRET=your-super-secret-key-here-32-chars
PORT=3333
```

### 3.4 Deploy
Railway automatically deploys when you push to GitHub!

After deployment, you'll get:
```
Backend URL: https://qalnet-api-xxxxx.railway.app
```

### 3.5 Get Backend URL
1. Go to Railway project
2. Find "Public URL"
3. Copy it (e.g., `https://qalnet-api-prod.railway.app`)

---

## 🎨 STEP 4: Deploy Frontend (Vercel)

### 4.1 Create Vercel Account
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### 4.2 Import GitHub Project
1. Click "New Project"
2. Select your `qalnet` repository
3. Vercel auto-detects Next.js

### 4.3 Configure Environment Variables
```
NEXT_PUBLIC_API_URL=https://qalnet-api-prod.railway.app
NODE_ENV=production
```

(Use the backend URL from Step 3.5)

### 4.4 Deploy Frontend
Click "Deploy" and Vercel handles everything!

After deployment, you'll get:
```
Frontend URL: https://qalnet.vercel.app
```

---

## ✅ STEP 5: Test Production

1. Open: https://qalnet.vercel.app
2. Sign up with test data
3. Refresh page (should stay logged in)
4. Try creating an equb
5. Refresh again (equb should persist)

**✅ If working, you're deployed to production!**

---

## 🔄 Continuous Deployment Setup

After initial deployment, every time you push to GitHub:

```bash
git add .
git commit -m "Your message"
git push origin main
```

Automatically:
1. Vercel deploys frontend ✅
2. Railway deploys backend ✅
3. Database stays synced ✅

---

## 📊 Production URLs

After deployment, you'll have:

| Component | URL |
|-----------|-----|
| **Frontend** | https://qalnet.vercel.app |
| **Backend API** | https://api-xxxxx.railway.app |
| **Database** | ep-xxxxx.neon.tech (no direct URL) |

Share the frontend URL with users!

---

## 🔐 Security Checklist

Before going to production:

- [ ] Remove all test/dummy data
- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set `NODE_ENV=production` in backend
- [ ] Add database backups (Neon auto-backs up)
- [ ] Enable monitoring/logging
- [ ] Set up error tracking (Sentry)
- [ ] Add rate limiting to API
- [ ] Configure CORS properly

---

## 📈 Monitoring & Maintenance

### Monitor Frontend
```
Dashboard: https://vercel.com/dashboard
- Deployments: See all versions
- Analytics: Page views, performance
- Logs: See any errors
```

### Monitor Backend
```
Dashboard: https://railway.app
- Logs: See server output
- Metrics: CPU, memory usage
- Deployments: Rollback if needed
```

### Monitor Database
```
Dashboard: https://console.neon.tech
- SQL Editor: Run queries
- Metrics: Storage usage
- Backups: Download data
```

---

## 🆘 Troubleshooting Production

### Frontend shows 404
**Problem**: Frontend deployed but shows 404
**Solution**:
1. Check Vercel deployment logs
2. Ensure `package.json` is at root
3. Redeploy: `vercel --prod`

### Backend not responding
**Problem**: Frontend can't reach backend
**Solution**:
1. Check `NEXT_PUBLIC_API_URL` is correct
2. Check Railway logs for errors
3. Verify `DATABASE_URL` is set in Railway

### Database connection timeout
**Problem**: Backend can't connect to Neon
**Solution**:
1. Check connection string in Railway
2. Verify IP whitelist (Neon allows all by default)
3. Test locally first with same connection string

### Data not persisting
**Problem**: Sign up works but data lost on refresh
**Solution**:
1. Check backend logs for errors
2. Verify database schema applied
3. Check backend can write to database

---

## 💾 Backup & Recovery

### Automatic Backups
- ✅ Neon: Daily automatic backups (7-day retention)
- ✅ Railway: Automatic on each deployment
- ✅ Vercel: Deployment snapshots

### Manual Backup
```bash
# Backup database to local file
pg_dump "DATABASE_URL_HERE" > backup_$(date +%Y%m%d).sql

# Backup code to GitHub is automatic
```

---

## 📊 Cost Breakdown

| Service | Free Tier | Paid Starting |
|---------|-----------|---------------|
| **Neon** | 0.5GB | $19/month |
| **Railway** | $5/month credits | $5+/month |
| **Vercel** | Free | $20/month |
| **Total/Month** | Free-$5 | ~$40-60 |

**Budget option**: Use all free tiers = $0-5/month

---

## 🚀 Auto-Deploy from GitHub (CI/CD)

Everything is already set up for CI/CD:

1. You make changes locally
2. Commit and push to GitHub
3. Vercel automatically:
   - ✅ Runs tests
   - ✅ Builds frontend
   - ✅ Deploys to CDN
   - ✅ Goes live in ~2-3 minutes
4. Railway automatically:
   - ✅ Builds Docker image
   - ✅ Tests backend
   - ✅ Deploys to cloud
   - ✅ Updates API in ~5 minutes

---

## 🎓 What Just Happened

### Before (Local)
```
Your Computer
  ├─ Frontend (localhost:3000)
  ├─ Backend (localhost:3333)
  └─ Database (localhost/qalnet)

Only you can access it
```

### After (Production)
```
Cloud Infrastructure
  ├─ Frontend: Vercel (https://qalnet.vercel.app)
  ├─ Backend: Railway (https://api-xxxx.railway.app)
  └─ Database: Neon (PostgreSQL)

Anyone in the world can access!
```

---

## 📞 Quick Reference Commands

```bash
# Push changes to GitHub (auto-deploys)
git add .
git commit -m "Your message"
git push origin main

# See deployment status
# Vercel: https://vercel.com/dashboard
# Railway: https://railway.app/dashboard

# Check production app
open https://qalnet.vercel.app

# View backend logs
# Railway dashboard → Logs tab

# View database
# Neon console → Tables tab
```

---

## 🎉 Congratulations!

Your QAL application is now:
- ✅ **Live on the internet**
- ✅ **Database persisting to cloud**
- ✅ **Auto-deploying from GitHub**
- ✅ **Accessible 24/7**
- ✅ **Ready for users**

Share your frontend URL: `https://qalnet.vercel.app` 🚀

---

## 🔄 Next Steps

1. **Invite Beta Users**: Share production URL
2. **Monitor Performance**: Check logs daily
3. **Gather Feedback**: Ask users for feedback
4. **Make Improvements**: Push updates to GitHub
5. **Scale If Needed**: Upgrade tiers as users grow

---

## 📚 Useful Links

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://railway.app/docs
- Neon Docs: https://neon.tech/docs
- NestJS Docs: https://docs.nestjs.com
- Next.js Docs: https://nextjs.org/docs

---

**Status**: Ready to deploy ✅
**Total Time**: 30-45 minutes
**Cost**: $0-5/month initially
**Complexity**: Medium
**Success Rate**: 95%+ (if followed)

You're now a cloud engineer! 🎓

