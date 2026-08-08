# Neon Cloud Database - 5 Minute Quickstart

**Easiest cloud database setup for QAL**

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Neon Account (1 minute)
1. Go to: https://neon.tech
2. Click "Sign Up"
3. Select "Continue with GitHub"
4. Authorize Neon
5. Verify your email

✅ **You now have a Neon account**

---

### Step 2: Create Database Project (1 minute)
1. Click "Create Project"
2. Enter:
   - **Name**: `qalnet-dev`
   - **Region**: Pick closest to you (e.g., US East, EU Central)
3. Click "Create Project"
4. Wait for creation (usually instant)

✅ **You now have a PostgreSQL database**

---

### Step 3: Get Connection String (30 seconds)
1. After project created, you'll see a popup
2. Click "Connection String" tab
3. Copy the string that looks like:
   ```
   postgresql://neondb_owner:xxxxxxx@ep-xxxxx.neon.tech/neondb?sslmode=require
   ```
4. Keep this somewhere safe

✅ **You have your connection string**

---

### Step 4: Update Backend Configuration (1 minute)

Open file: `c:\Qal\QalNet-\.env`

Find this line:
```
DATABASE_URL=postgresql://localhost/qalnet
```

Replace it with your Neon connection string:
```
DATABASE_URL=postgresql://neondb_owner:xxxxxxx@ep-xxxxx.neon.tech/neondb?sslmode=require
```

Save the file.

✅ **Backend configured to use Neon**

---

### Step 5: Apply Database Schema (1 minute)

```bash
cd c:\Qal\QalNet-

# Copy your connection string into this command:
psql "postgresql://neondb_owner:xxxxxxx@ep-xxxxx.neon.tech/neondb?sslmode=require" < database/schema.sql
```

**Expected output**: No errors, schema applied successfully

✅ **Your cloud database now has all tables**

---

### Step 6: Start Backend

```bash
cd c:\Qal\QalNet-
npm run start:dev
```

**Expected output**:
```
Listening on http://0.0.0.0:3333
```

✅ **Backend connected to cloud database**

---

### Step 7: Start Frontend (in another terminal)

```bash
cd c:\Qal\QAL
npm run dev
```

**Expected output**:
```
- Local: http://localhost:3000
```

✅ **Frontend running**

---

## ✅ Test It Works

1. Open: http://localhost:3000
2. Click "Get Started"
3. Sign up with:
   - Name: Test User
   - Phone: 0912345678
   - PIN: 1234
4. Click "Sign Up"
5. **Press F5 (refresh page)**
6. **Should still be logged in!** ✅

If yes → **Your cloud database is working!**

---

## 📊 What Just Happened

```
Your Computer
    ↓
Frontend (Next.js) at http://localhost:3000
    ↓
Backend (NestJS) at http://localhost:3333
    ↓ (Over Internet)
    ↓
Neon Cloud Database
    ↓
Your data now persists in the cloud! ✅
```

---

## 🎯 Next Steps

### Option A: Keep It Simple (Development)
```
Use this forever for development:
- Local: Backend + Frontend
- Cloud: Database only (Neon)

Run commands every time you code:
cd c:\Qal\QalNet- && npm run start:dev   # Terminal 1
cd c:\Qal\QAL && npm run dev             # Terminal 2
```

### Option B: Deploy Everything (Production)
```
After testing, deploy backend too:
- Cloud: Database (Neon)
- Cloud: Backend (Railway)
- Cloud: Frontend (Vercel)

Everything runs in the cloud!
```

---

## 🔍 Monitor Your Database

Go to: https://console.neon.tech

You can:
- See all tables: `Tables` tab
- Run SQL queries: `SQL Editor`
- Check usage: `Usage` tab
- View logs: `Logs`

Try running this query:
```sql
SELECT COUNT(*) FROM users;
```

Shows how many users signed up!

---

## 🆘 Troubleshooting

### Can't connect to Neon
```
Error: "connect ECONNREFUSED"

Fix:
1. Copy connection string again (very carefully)
2. Make sure ?sslmode=require is at the end
3. Don't have typos in password
4. Try: psql "YOUR_CONNECTION_STRING" -c "SELECT 1;"
```

### Schema didn't apply
```
Error: "permission denied"

Fix:
1. Wait a moment for Neon to be ready
2. Try again: psql "..." < database/schema.sql
3. Check if tables exist: psql "..." -c "\dt"
```

### Frontend still doesn't persist after refresh
```
Problem: Data lost on refresh

Check:
1. Is backend running? npm run start:dev
2. Is DATABASE_URL updated in .env?
3. Restart backend after changing .env
4. Check browser console for errors (DevTools)
```

---

## 💡 Tips & Tricks

### See Your Data in Neon Console
1. Go to: https://console.neon.tech
2. Click "SQL Editor"
3. Run: `SELECT * FROM users;`
4. See all your users!

### Free Tier Limits
- Storage: 0.5GB (plenty for development)
- Compute: Shared (totally fine for dev)
- Projects: Unlimited
- Databases per project: Unlimited

### Never Commit Connection String
**Don't do this**:
```
❌ git add .env
❌ git commit -m "Add database"
```

**Do this instead**:
```
✅ Add .env to .gitignore
✅ Create .env.example without secrets
✅ Share .env.example on GitHub
```

---

## 🎓 What is Neon?

Neon is a **serverless PostgreSQL database** that lives in the cloud.

Instead of managing a server, you just:
1. Create a project
2. Get a connection string
3. Point your app to it
4. It just works!

No server management needed. That's the magic! ✨

---

## 📈 When to Scale

**You can use Neon's free tier for**:
- Your entire development
- Alpha/beta testing
- Up to ~1000 active users

**When to upgrade**:
- Hitting storage limits (buy more storage)
- Need more compute (upgrade plan)
- Going to production (paid tier)

---

## 🚀 One-Liner Command

Copy and run this (replace with your actual connection string):

```bash
DATABASE_URL="postgresql://neondb_owner:xxxxxxx@ep-xxxxx.neon.tech/neondb?sslmode=require" && echo "DATABASE_URL=$DATABASE_URL" > c:\Qal\QalNet-\.env && cd c:\Qal\QalNet- && psql "$DATABASE_URL" < database/schema.sql && npm run start:dev
```

---

## ✨ You're Done!

You now have:
- ✅ Cloud PostgreSQL database (Neon)
- ✅ Backend connected to cloud
- ✅ Frontend working
- ✅ Data persisting in the cloud

**Next**: Deploy backend and frontend to production when ready!

---

**Status**: ✅ Cloud database ready
**Time spent**: ~5 minutes
**Cost**: FREE (0.5GB free tier)
**Difficulty**: Easy

Enjoy your cloud database! 🎉

