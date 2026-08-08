# QAL Cloud Database Setup Guide

**Objective**: Connect PostgreSQL database to cloud instead of local machine
**Time**: 15-30 minutes (depending on chosen platform)
**Cost**: Most platforms have free tier for development

---

## 🌥️ Popular Cloud Database Options

| Platform | Free Tier | Setup Time | Best For |
|----------|-----------|-----------|----------|
| **Neon** | 0.5GB free | 5 min | Best for Next.js + NestJS |
| **Railway** | $5/month free credits | 5 min | Simple deployment |
| **Render** | Free tier available | 10 min | Easy for beginners |
| **AWS RDS** | 12 months free | 15 min | Enterprise scale |
| **DigitalOcean** | $4/month | 10 min | Good balance |
| **Supabase** | Free tier | 5 min | Great for teams |

---

## ✅ OPTION 1: Neon (Recommended - Easiest)

### Why Neon?
- Serverless PostgreSQL (no server to manage)
- Free tier includes 0.5GB storage
- Instant setup (5 minutes)
- Perfect for development
- Works great with NestJS

### Step 1: Create Neon Account
1. Go to: https://neon.tech
2. Sign up with GitHub (recommended)
3. Verify email

### Step 2: Create Project
1. Click "Create Project"
2. Fill in:
   - **Project Name**: `qalnet-dev`
   - **Region**: Choose closest to you
   - **Database Name**: `qalnet`
3. Click "Create Project"

### Step 3: Get Connection String
1. After project created, you'll see connection string
2. Copy the **Connection URL** that looks like:
   ```
   postgresql://user:password@ep-xxxxx.neon.tech/qalnet?sslmode=require
   ```

### Step 4: Update Backend Environment
**File**: `c:\Qal\QalNet-\.env`

Find this line:
```
DATABASE_URL=postgresql://localhost/qalnet
```

Replace with:
```
DATABASE_URL=postgresql://user:password@ep-xxxxx.neon.tech/qalnet?sslmode=require
```

### Step 5: Run Migrations
```bash
cd c:\Qal\QalNet-

# Run migrations
npm run prisma:migrate

# Or if using SQL:
psql -d "postgresql://user:password@ep-xxxxx.neon.tech/qalnet?sslmode=require" < database/schema.sql
```

### Step 6: Start Backend
```bash
npm run start:dev
```

**✅ Done!** Your backend is now using Neon cloud database

---

## ✅ OPTION 2: Railway (Very Easy)

### Why Railway?
- $5/month free credits (plenty for dev)
- Git integration (deploy from GitHub)
- One-click PostgreSQL setup
- Great UI

### Step 1: Create Railway Account
1. Go to: https://railway.app
2. Sign up with GitHub
3. Authorize Railway

### Step 2: Create New Project
1. Click "New Project"
2. Select "Database"
3. Choose "PostgreSQL"

### Step 3: Configure Database
1. Click on your PostgreSQL instance
2. Go to "Connect" tab
3. Copy connection string

### Step 4: Update Backend
**File**: `c:\Qal\QalNet-\.env`

Replace:
```
DATABASE_URL=postgresql://localhost/qalnet
```

With Railway connection string:
```
DATABASE_URL=postgresql://user:password@hostname:port/database
```

### Step 5: Deploy Backend
Option A (Quick - Local to Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

Option B (Via GitHub):
1. Push code to GitHub
2. In Railway: Connect GitHub repo
3. Add environment variables
4. Deploy automatically

---

## ✅ OPTION 3: Supabase (Best for Teams)

### Why Supabase?
- Free tier with 500MB storage
- Real-time features included
- Great admin dashboard
- PostgreSQL with extra features

### Step 1: Create Supabase Account
1. Go to: https://supabase.com
2. Sign up with GitHub
3. Create new project

### Step 2: Project Setup
1. Click "New Project"
2. Enter:
   - **Project Name**: `qalnet`
   - **Password**: Generate strong password
   - **Region**: Select closest to you
3. Wait for creation (takes 1-2 minutes)

### Step 3: Get Connection String
1. Go to "Settings" → "Database"
2. Copy "Connection String"
3. It looks like:
   ```
   postgresql://user:password@db.xxxx.supabase.co:5432/postgres
   ```

### Step 4: Update Environment
**File**: `c:\Qal\QalNet-\.env`

```
DATABASE_URL=postgresql://user:password@db.xxxx.supabase.co:5432/postgres
```

### Step 5: Run Schema
```bash
cd c:\Qal\QalNet-

# Apply your schema
psql "postgresql://user:password@db.xxxx.supabase.co:5432/postgres" < database/schema.sql
```

### Step 6: Start Backend
```bash
npm run start:dev
```

---

## ✅ OPTION 4: AWS RDS (Enterprise)

### Why AWS RDS?
- Most scalable
- 12-month free tier
- Enterprise support
- Can handle millions of users

### Step 1: Create AWS Account
1. Go to: https://aws.amazon.com
2. Sign up (free tier available)
3. Add payment method

### Step 2: Create RDS Database
1. Go to AWS Console → RDS
2. Click "Create Database"
3. Select:
   - **Engine**: PostgreSQL
   - **Version**: Latest (e.g., 15.x)
   - **Template**: Free tier

### Step 3: Configure Database
1. **DB Instance Identifier**: `qalnet-prod`
2. **Master Username**: `postgres`
3. **Master Password**: Generate strong one
4. **DB Instance Class**: `db.t3.micro` (free tier)
5. **Storage**: `20 GB` (free tier)

### Step 4: Network Settings
1. **Public Accessibility**: Yes
2. **VPC Security Group**: Create new or select existing
3. Allow inbound:
   - Port: 5432
   - From: Your IP or 0.0.0.0/0 (for development)

### Step 5: Create Database
Click "Create Database" and wait (5-10 minutes)

### Step 6: Get Connection String
1. After creation, go to RDS instance
2. Find "Endpoint"
3. Connection string format:
   ```
   postgresql://postgres:password@qalnet-prod.xxxxx.us-east-1.rds.amazonaws.com:5432/postgres
   ```

### Step 7: Update Environment
**File**: `c:\Qal\QalNet-\.env`

```
DATABASE_URL=postgresql://postgres:password@qalnet-prod.xxxxx.us-east-1.rds.amazonaws.com:5432/postgres
```

### Step 8: Apply Schema & Start
```bash
cd c:\Qal\QalNet-
psql $DATABASE_URL < database/schema.sql
npm run start:dev
```

---

## ✅ OPTION 5: DigitalOcean (Balanced)

### Why DigitalOcean?
- $4/month for PostgreSQL
- Free $100 credit for 60 days
- Simple to manage
- Good documentation

### Step 1: Create Account
1. Go to: https://digitalocean.com
2. Sign up
3. Add payment method

### Step 2: Create Database
1. Click "Databases" in sidebar
2. "Create Database Cluster"
3. Select:
   - **Engine**: PostgreSQL
   - **Version**: Latest
   - **Cluster Capacity**: Basic ($4/month is free tier eligible)

### Step 3: Configure
- **Datacenter**: Select closest region
- **Database Name**: `qalnet`
- **Cluster Name**: `qalnet-prod`

### Step 4: Get Connection String
1. After creation, click cluster
2. Go to "Connection Details"
3. Copy "Connection String"

### Step 5: Update Environment
**File**: `c:\Qal\QalNet-\.env`

```
DATABASE_URL=postgresql://doadmin:password@db-postgresql-do-xxxxx.a.db.ondigitalocean.com:25060/postgres
```

### Step 6: Connect & Deploy
```bash
cd c:\Qal\QalNet-
psql $DATABASE_URL < database/schema.sql
npm run start:dev
```

---

## 🚀 Step-by-Step: Connect Any Cloud Database

### Universal Steps (Works for all platforms)

#### Step 1: Get Connection String
```
Format: postgresql://username:password@host:port/database?sslmode=require
```

#### Step 2: Update Environment File
**File**: `c:\Qal\QalNet-\.env`

```bash
# OLD (Local)
DATABASE_URL=postgresql://localhost/qalnet

# NEW (Cloud)
DATABASE_URL=postgresql://user:pass@cloud-host.com:5432/qalnet?sslmode=require
```

#### Step 3: Test Connection (Optional)
```bash
# Install psql if needed
psql $DATABASE_URL -c "SELECT VERSION();"

# If successful, shows PostgreSQL version
```

#### Step 4: Apply Schema
```bash
cd c:\Qal\QalNet-

# Option A: Using SQL file
psql $DATABASE_URL < database/schema.sql

# Option B: Using Prisma (if available)
npm run prisma:migrate

# Option C: Using Prisma (alternative)
npx prisma db push
```

#### Step 5: Verify Schema Applied
```bash
psql $DATABASE_URL -c "\dt"

# Should show all your tables:
# - users
# - wallets
# - equb_groups
# - etc.
```

#### Step 6: Start Backend
```bash
npm run start:dev
```

#### Step 7: Test Connection
1. Try to sign up in frontend
2. Data should persist
3. Refresh page → still logged in ✅

---

## 🔐 Environment Variable Setup

### Development (.env local)
```
DATABASE_URL=postgresql://localhost/qalnet
NODE_ENV=development
```

### Production (.env production)
```
DATABASE_URL=postgresql://user:pass@cloud-host.com:5432/qalnet?sslmode=require
NODE_ENV=production
JWT_SECRET=your-secret-key
```

### Security Tips
- ✅ Never commit `.env` to Git
- ✅ Use strong passwords (16+ characters)
- ✅ Enable SSL mode in cloud connections
- ✅ Restrict IP access when possible
- ✅ Rotate credentials regularly

---

## 📊 Quick Comparison Table

| Feature | Neon | Railway | Supabase | AWS RDS | DigitalOcean |
|---------|------|---------|----------|---------|--------------|
| **Free Tier** | 0.5GB | $5 credits | 500MB | 12 months | $100 credits |
| **Setup Time** | 5 min | 5 min | 10 min | 15 min | 10 min |
| **Scalability** | Good | Very Good | Excellent | Excellent | Good |
| **Best For** | Dev | Dev | Teams | Enterprise | Mid-scale |
| **Support** | Community | Good | Excellent | Phone | Good |
| **Learning Curve** | Easy | Easy | Medium | Hard | Medium |

**Recommendation**: Use **Neon** for simplicity, **AWS RDS** for production

---

## 🎯 Recommended Setup Path

### For Development
```
Use Neon + Local Backend + Local Frontend

1. Free tier = 0.5GB storage (plenty for testing)
2. 5 minutes setup
3. Instant ready
4. Perfect for building features
```

### For Testing/Staging
```
Use Railway + Railway deployment

1. $5/month = small cost
2. One-click deploy backend
3. Auto-deploys from GitHub
4. Great for QA testing
```

### For Production
```
Use AWS RDS + Heroku/Railway/Render backend

1. Enterprise scale
2. Auto backups
3. Multi-region ready
4. Performance monitoring
```

---

## 🔄 Migration Path (Local → Cloud)

### Day 1-5: Development
```
Local PostgreSQL → Local NestJS → Local Next.js
```

### Day 6-10: Testing
```
Neon Cloud DB → Local NestJS → Local Next.js
(Test cloud database performance)
```

### Day 11+: Deployment
```
AWS RDS + Railway Backend + Vercel Frontend
(Production ready)
```

---

## ✅ Verification Checklist

After setting up cloud database:

- [ ] Created account on chosen platform
- [ ] Created PostgreSQL database/instance
- [ ] Copied connection string
- [ ] Updated `.env` file with connection string
- [ ] Tested connection with `psql`
- [ ] Applied schema to cloud database
- [ ] Started backend: `npm run start:dev`
- [ ] Started frontend: `npm run dev`
- [ ] Tested signup (data should persist)
- [ ] Refreshed page (still logged in ✅)
- [ ] Verified in cloud database console (data shows up)

---

## 🆘 Troubleshooting Cloud Connections

### Error: "Connection refused"
```
Cause: Cloud database not accessible

Fix:
1. Check if database is running
2. Check security groups/firewall rules
3. Verify IP address is whitelisted
4. Test with: psql $DATABASE_URL
```

### Error: "Authentication failed"
```
Cause: Wrong username/password

Fix:
1. Double-check connection string
2. Verify credentials in cloud console
3. Reset password if needed
4. Copy connection string again carefully
```

### Error: "SSL certificate problem"
```
Cause: SSL not enabled in connection string

Fix:
Add ?sslmode=require to connection string:
DATABASE_URL=postgresql://...?sslmode=require
```

### Error: "no such table"
```
Cause: Schema not applied to cloud database

Fix:
1. Run: psql $DATABASE_URL < database/schema.sql
2. Or: npx prisma db push
3. Verify with: psql $DATABASE_URL -c "\dt"
```

### Slow Queries
```
Cause: Database too far away / slow tier

Fix for Testing:
1. Use free tier close to your location
2. Check region selection

Fix for Production:
1. Upgrade to paid tier
2. Add read replicas
3. Implement caching (Redis)
```

---

## 📈 Scaling Path

### Stage 1: Single Cloud Database (0-1M users)
```
Use any cloud provider above
- Neon for dev
- AWS RDS for prod
```

### Stage 2: Read Replicas (1M-10M users)
```
Add read-only replicas in other regions
- Write to primary
- Read from replicas
```

### Stage 3: Distributed Database (10M+ users)
```
Consider:
- Database sharding
- Multi-region deployment
- Cache layer (Redis/Memcached)
```

---

## 🎓 What Happens With Cloud Database

### Before (Local Database)
```
Your Computer (PostgreSQL)
    ↓
Backend (NestJS)
    ↓
Frontend (Next.js)

Problem: Only works on your computer
```

### After (Cloud Database)
```
Cloud Provider (PostgreSQL)
    ↓ (Over Internet)
    ↓
Backend (NestJS) - Can be anywhere
    ↓
Frontend (Next.js) - Can be deployed to Vercel

Result: Works globally from anywhere!
```

---

## 🚀 Quick Start Command (All Platforms)

```bash
# 1. Get your cloud connection string from provider's dashboard
# Example: postgresql://user:pass@host:5432/db?sslmode=require

# 2. Update your .env file
echo "DATABASE_URL=YOUR_CONNECTION_STRING_HERE" > c:\Qal\QalNet-\.env

# 3. Test connection
psql "YOUR_CONNECTION_STRING_HERE" -c "SELECT VERSION();"

# 4. Apply schema
psql "YOUR_CONNECTION_STRING_HERE" < c:\Qal\QalNet-\database\schema.sql

# 5. Start backend
cd c:\Qal\QalNet-
npm run start:dev

# 6. Start frontend (different terminal)
cd c:\Qal\QAL
npm run dev

# 7. Test in browser
# Go to http://localhost:3000
# Sign up and refresh - should work!
```

---

## 📞 Platform-Specific Help

### Neon Support
- Docs: https://neon.tech/docs
- Dashboard: https://console.neon.tech

### Railway Support
- Docs: https://railway.app/docs
- Dashboard: https://railway.app

### Supabase Support
- Docs: https://supabase.com/docs
- Dashboard: https://app.supabase.com

### AWS RDS Support
- Docs: https://docs.aws.amazon.com/rds
- Console: https://console.aws.amazon.com/rds

### DigitalOcean Support
- Docs: https://docs.digitalocean.com/products/databases
- Control Panel: https://cloud.digitalocean.com

---

**Status**: Ready to connect to cloud ✅
**Time to Deploy**: 5-15 minutes depending on platform
**Cost**: Most have free tier
**Recommendation**: Start with **Neon** for simplicity

