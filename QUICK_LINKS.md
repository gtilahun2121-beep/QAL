# Ethiopian Equb System - Quick Links & Commands

## 🚀 Start Here - Copy & Paste Commands

### Terminal 1 - Backend (Port 3333)
```bash
cd c:\QalNet- && npm install && npm run start:dev
```

### Terminal 2 - Frontend (Port 3000)
```bash
cd c:\Qal\QAL && npm install && npm run dev
```

### Browser - Open in Chrome/Firefox/Safari
```
http://localhost:3000
```

---

## 📱 Application Links

### Main Application
- **URL**: http://localhost:3000
- **Description**: Home page with authentication

### Create Equb (Phase 1)
- **URL**: http://localhost:3000/create-equb
- **Action**: Manager creates new Equb
- **Form Fields**: Name, Amount, Members, Frequency, Start Date, Draw Method

### Dashboard
- **URL**: http://localhost:3000/dashboard
- **Action**: Member views their Equbs and contributions
- **Info**: Personal equb data, contribution history, payout status

### My Equbs
- **URL**: http://localhost:3000/my-equbs
- **Action**: View all equbs user participates in
- **Features**: Filter by status, search, invite tracking

---

## 🔌 Backend API Links (Port 3333)

### Base URL
```
http://localhost:3333/api/v1
```

### Test Endpoints with Browser

**Health Check** (No Auth Required)
```
http://localhost:3333
```

**Get All Equbs** (Requires Auth Token)
```
http://localhost:3333/api/v1/equbs
```

---

## 📂 Important Files

### Backend (NestJS)
```
c:\QalNet-\src\modules\equb\equb.controller.ts      ← 28 API endpoints
c:\QalNet-\src\modules\equb\equb.service.ts         ← 12 phase logic
c:\QalNet-\src\main.ts                               ← Entry point
```

### Frontend (Next.js)
```
c:\Qal\QAL\src\app\components\equb\CreateEqubForm.tsx
c:\Qal\QAL\src\app\components\equb\InviteMembersForm.tsx
c:\Qal\QAL\src\app\components\equb\ContributionTracker.tsx
c:\Qal\QAL\src\app\components\equb\LotteryWheel.tsx
c:\Qal\QAL\src\app\components\equb\PayoutConfirmation.tsx
c:\Qal\QAL\src\app\components\equb\MemberEqubDashboard.tsx
c:\Qal\QAL\src\app\components\equb\ManagerEqubDashboard.tsx
c:\Qal\QAL\src\app\globals.css                      ← Transparent design
```

---

## 📖 Documentation Files

### Setup & Running
- **RUN_THE_SYSTEM.md** - Complete startup guide
- **QUICK_START.md** - 5-minute overview
- **QUICK_LINKS.md** - This file

### Technical Details
- **EQUB_IMPLEMENTATION_GUIDE.md** - Full API documentation (400+ lines)
- **EQUB_SETUP_CHECKLIST.md** - Step-by-step setup with testing
- **EQUB_COMPONENT_MAP.md** - Component architecture and flows

### Design
- **EQUB_TRANSPARENT_DESIGN.md** - Glassmorphic design details
- **EQUB_SYSTEM_SUMMARY.md** - High-level overview
- **IMPLEMENTATION_STATUS.md** - Current status and progress

---

## 🔧 Useful Commands

### Backend
```bash
# Start development server
cd c:\QalNet- && npm run start:dev

# Build for production
cd c:\QalNet- && npm run build

# Run tests
cd c:\QalNet- && npm run test

# Lint code
cd c:\QalNet- && npm run lint
```

### Frontend
```bash
# Start development server
cd c:\Qal\QAL && npm run dev

# Build for production
cd c:\Qal\QAL && npm run build

# Start production server
cd c:\Qal\QAL && npm run start

# Type check
cd c:\Qal\QAL && npm run type-check

# Lint code
cd c:\Qal\QAL && npm run lint
```

### Database (When Ready)
```bash
# Connect to PostgreSQL
psql -U user -d equb_db

# Run migrations
npm run migrate

# Seed test data
npm run seed
```

---

## 🐛 Troubleshooting Quick Links

### Port Already In Use
```bash
# Windows - Find what's using port 3333
netstat -ano | findstr :3333

# Kill the process (replace XXXX with PID)
taskkill /PID XXXX /F
```

### Module Not Found
```bash
# Clear and reinstall
cd c:\QalNet-
rm -r node_modules package-lock.json
npm install
npm run start:dev
```

### Clear Everything
```bash
# Frontend
cd c:\Qal\QAL
rm -r node_modules .next package-lock.json
npm install
npm run dev

# Backend
cd c:\QalNet-
rm -r node_modules package-lock.json dist
npm install
npm run start:dev
```

---

## 📊 API Endpoints Summary (28 Total)

### Create Equb (1)
```
POST /equbs/create
```

### Invitations (3)
```
POST /equbs/{equbId}/invite-members
POST /equbs/{equbId}/accept-invitation
POST /equbs/{equbId}/decline-invitation
```

### Contributions (4)
```
POST /equbs/{equbId}/contribute
GET /equbs/{equbId}/current-round
GET /equbs/{equbId}/contributions/status
PATCH /equbs/{equbId}/close-collection
```

### Lottery (3)
```
GET /equbs/{equbId}/eligible-members
POST /equbs/{equbId}/draw-lottery
GET /equbs/{equbId}/lottery/{roundNumber}
```

### Payout (3)
```
POST /equbs/{equbId}/announce-winner
POST /equbs/{equbId}/confirm-payout
GET /equbs/{equbId}/payout-history
```

### Dashboards (4)
```
GET /equbs/member/my-equbs
GET /equbs/{equbId}/member-dashboard
GET /equbs/{equbId}/manager-dashboard
GET /equbs/{equbId}/reports
```

### Details (2)
```
GET /equbs/{equbId}
GET /equbs
```

### Remaining Endpoints (8)
Additional utility endpoints for various operations

---

## 💡 Pro Tips

1. **Development Speed**
   - Use hot reload (enabled by default)
   - Keep browser console open for errors
   - Use VS Code for debugging

2. **Testing Quickly**
   - Create test Equb with 5 members
   - Use same test accounts for all roles
   - Clear browser cache if components don't update

3. **Database Later**
   - Currently uses in-memory storage
   - Data resets on backend restart
   - Upgrade to PostgreSQL when ready

4. **Deployment Ready**
   - Frontend ready for Vercel
   - Backend ready for Railway/AWS
   - Database ready for Neon/AWS RDS

---

## 📞 Quick Reference Table

| Task | Command | Port |
|------|---------|------|
| Start Backend | `npm run start:dev` | 3333 |
| Start Frontend | `npm run dev` | 3000 |
| Access App | Browser to localhost:3000 | - |
| API Testing | Use http://localhost:3333/api/v1 | 3333 |
| Build Frontend | `npm run build` | - |
| Build Backend | `npm run build` | - |
| Check Errors | See browser console or terminal | - |

---

## 🎯 Typical Workflow

1. **Open 3 Terminals**
   - Terminal 1: Backend
   - Terminal 2: Frontend
   - Terminal 3: File edits

2. **Start Services**
   ```bash
   # Terminal 1
   cd c:\QalNet- && npm run start:dev
   
   # Terminal 2
   cd c:\Qal\QAL && npm run dev
   ```

3. **Open Browser**
   ```
   http://localhost:3000
   ```

4. **Test the System**
   - Create Equb
   - Invite members
   - Run through all 12 phases

5. **Make Changes**
   - Edit files in Terminal 3
   - Hot reload applies automatically
   - Check browser for results

---

## 🌐 Cloud Deployment (Future)

When ready to deploy:

### Frontend to Vercel
```bash
npm install -g vercel
cd c:\Qal\QAL
vercel
```

### Backend to Railway
```bash
# Add railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd c:\QalNet-
railway link
railway up
```

### Database to Neon
```
https://console.neon.tech
```

---

## 📋 Checklist Before Running

- [ ] Backend directory exists: `c:\QalNet-`
- [ ] Frontend directory exists: `c:\Qal\QAL`
- [ ] Node.js installed (check: `node -v`)
- [ ] npm installed (check: `npm -v`)
- [ ] 3 terminals open
- [ ] Read this file (✓ you're here!)

---

## ✅ Success Indicators

When everything works:
- ✅ Backend logs: "Listening on port 3333"
- ✅ Frontend logs: "Ready in X.Xs" at localhost:3000
- ✅ Browser shows home page
- ✅ Can click "Create Equb"
- ✅ Form loads with glassmorphic design
- ✅ No console errors
- ✅ Both terminals running without crashes

---

## 🎉 You're Ready!

Copy the commands at the top of this file and run them. You now have a complete Ethiopian Equb system running locally!

**Questions?** Check the documentation files listed above.

**Need Help?** See the troubleshooting sections.

**Ready to Deploy?** Follow the cloud deployment section.

---

**Happy Building! 🚀**
