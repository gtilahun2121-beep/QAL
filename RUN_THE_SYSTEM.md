# Ethiopian Equb System - Complete Run Guide

## System Overview

**Full Stack Application**:
- Frontend: Next.js (React) on Port 3000
- Backend: NestJS (Node) on Port 3333
- Database: PostgreSQL (optional, currently using in-memory storage)

---

## Step 1: Start the Backend (NestJS)

### Terminal 1 - Backend
```bash
cd c:\QalNet-
npm install
npm run start:dev
```

**Expected Output**:
```
[Nest] 12345  - 08/03/2026, 2:30:45 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 08/03/2026, 2:30:46 PM     LOG [InstanceLoader] EqubModule dependencies initialized +10ms
Listening on port 3333
```

**What's Running**:
- ✅ Backend API server
- ✅ 28 REST endpoints ready
- ✅ JWT authentication enabled
- ✅ In-memory storage initialized

### Backend Endpoints Available:

```
Base URL: http://localhost:3333/api/v1

CREATE EQUB
  POST   /equbs/create

INVITATIONS
  POST   /equbs/{equbId}/invite-members
  POST   /equbs/{equbId}/accept-invitation
  POST   /equbs/{equbId}/decline-invitation

CONTRIBUTIONS
  POST   /equbs/{equbId}/contribute
  GET    /equbs/{equbId}/current-round
  GET    /equbs/{equbId}/contributions/status
  PATCH  /equbs/{equbId}/close-collection

LOTTERY
  GET    /equbs/{equbId}/eligible-members
  POST   /equbs/{equbId}/draw-lottery
  GET    /equbs/{equbId}/lottery/{roundNumber}

PAYOUT
  POST   /equbs/{equbId}/announce-winner
  POST   /equbs/{equbId}/confirm-payout
  GET    /equbs/{equbId}/payout-history

DASHBOARDS
  GET    /equbs/member/my-equbs
  GET    /equbs/{equbId}/member-dashboard
  GET    /equbs/{equbId}/manager-dashboard
  GET    /equbs/{equbId}/reports

DETAILS
  GET    /equbs/{equbId}
  GET    /equbs
```

---

## Step 2: Start the Frontend (Next.js)

### Terminal 2 - Frontend
```bash
cd c:\Qal\QAL
npm install
npm run dev
```

**Expected Output**:
```
> qalnet-web@0.1.0 dev
> next dev

  ▲ Next.js 16.2.12
  - Local: http://localhost:3000
  - Environments: .env.local

✓ Ready in 3.2s
```

**What's Running**:
- ✅ Frontend development server
- ✅ Next.js with Turbopack
- ✅ Hot reload enabled
- ✅ TypeScript enabled

---

## Step 3: Open in Browser

### Main Application URL
```
http://localhost:3000
```

### Available Routes (After Login)

**Equb Routes**:
```
http://localhost:3000/create-equb              Phase 1 - Create Equb
http://localhost:3000/my-equbs                 View your Equbs
http://localhost:3000/equb/{equbId}            View specific Equb
http://localhost:3000/dashboard                Member dashboard
```

---

## Complete Startup Commands

### Quick Start (Copy & Paste)

**Terminal 1 - Backend**:
```bash
cd c:\QalNet- && npm install && npm run start:dev
```

**Terminal 2 - Frontend**:
```bash
cd c:\Qal\QAL && npm install && npm run dev
```

**Browser**:
```
Open: http://localhost:3000
```

---

## Testing the 12-Phase Flow

### Phase 1: Create Equb
1. Navigate to: `http://localhost:3000/create-equb`
2. Fill in form:
   - Name: "Test Equb"
   - Amount: 1000
   - Members: 5
   - Frequency: Monthly
   - Start Date: Tomorrow
   - Draw Method: Random
3. Click "Create Equb"

### Phase 2: Invite Members
1. Copy Equb ID from success message
2. Add 5 phone numbers (e.g., +251912345678)
3. Click "Send Invitations"

### Phase 3: Accept Invitations
1. Login as each member
2. Go to "My Equbs"
3. Accept invitation for each member

### Phase 4-5: Contribute & Verify
1. Each member clicks "Contribute This Round"
2. System records 1000 ETB per member
3. Manager views "Contribution Tracker"
4. Sees progress bar reach 100%
5. Clicks "Close Collection Period"

### Phase 6-8: Lottery
1. Go to "Lottery Wheel"
2. Click "Draw Lottery"
3. See winner displayed in wheel

### Phase 9-10: Payout
1. Go to "Payout Confirmation"
2. Click "Announce Winner"
3. Select payment date
4. Click "Confirm Payout"

### Phase 11-12: Next Rounds
1. System auto-creates Round 2
2. 4 members now eligible (previous winner excluded)
3. Repeat lottery process
4. Continue until all members receive payout
5. Last member auto-wins (no lottery)

---

## API Testing with cURL

### Test Create Equb
```bash
curl -X POST http://localhost:3333/api/v1/equbs/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Equb",
    "description": "Test",
    "contributionAmount": 1000,
    "numberOfMembers": 5,
    "frequency": "monthly",
    "startDate": "2026-08-15",
    "collectionTime": "18:00",
    "drawMethod": "random"
  }'
```

### Test Get Current Round
```bash
curl http://localhost:3333/api/v1/equbs/{equbId}/current-round \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Record Contribution
```bash
curl -X POST http://localhost:3333/api/v1/equbs/{equbId}/contribute \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "paymentMethod": "bank-transfer"
  }'
```

---

## Troubleshooting

### Backend Won't Start

**Error: Port 3333 already in use**
```bash
# Find process using port 3333
netstat -ano | findstr :3333

# Kill process (replace PID)
taskkill /PID 12345 /F

# Try again
npm run start:dev
```

**Error: Cannot find module**
```bash
cd c:\QalNet-
rm -r node_modules
npm install
npm run start:dev
```

### Frontend Won't Load

**Error: Port 3000 already in use**
```bash
# Find and kill
netstat -ano | findstr :3000
taskkill /PID 12345 /F

# Try again
npm run dev
```

**Error: Cannot compile**
```bash
cd c:\Qal\QAL
npm cache clean --force
rm -r node_modules .next
npm install
npm run dev
```

### API Connection Error

**Frontend can't reach backend**:
1. Check backend running: `http://localhost:3333`
2. Check frontend config: `src/app/config/environment.ts`
3. Should have: `API_URL = 'http://localhost:3333'`
4. Check CORS in backend

### Database Connection

Currently using **in-memory storage** (no database needed).

To enable PostgreSQL:
1. Edit `c:\QalNet-\src\main.ts`
2. Uncomment line 25: `await initDatabase();`
3. Set DATABASE_URL in `.env`
4. Database will initialize automatically

---

## Project Structure

```
c:\QalNet-                          Backend (NestJS)
├── src/
│   ├── main.ts                    Entry point
│   └── modules/
│       └── equb/
│           ├── equb.controller.ts  28 API endpoints
│           ├── equb.service.ts     12 phase logic
│           └── equb.module.ts      Module definition
├── database/
│   └── schema.sql                 PostgreSQL schema
└── package.json                   Dependencies

c:\Qal\QAL                          Frontend (Next.js)
├── src/
│   ├── app/
│   │   ├── page.tsx               Home page
│   │   ├── layout.tsx             Root layout
│   │   ├── globals.css            Global styles (transparent design)
│   │   ├── create-equb/           Create Equb page
│   │   ├── dashboard/             Dashboard page
│   │   ├── components/
│   │   │   └── equb/
│   │   │       ├── CreateEqubForm.tsx
│   │   │       ├── InviteMembersForm.tsx
│   │   │       ├── ContributionTracker.tsx
│   │   │       ├── LotteryWheel.tsx
│   │   │       ├── PayoutConfirmation.tsx
│   │   │       ├── MemberEqubDashboard.tsx
│   │   │       ├── ManagerEqubDashboard.tsx
│   │   │       └── EqubFormInput.tsx
│   │   └── config/
│   │       └── environment.ts     API config
│   └── package.json               Dependencies
```

---

## Key Files

### Backend - equb.controller.ts
**Location**: `c:\QalNet-\src\modules\equb\equb.controller.ts`
- 28 REST endpoints
- All 12 phases mapped
- JWT authentication
- Request/response handling

### Backend - equb.service.ts
**Location**: `c:\QalNet-\src\modules\equb\equb.service.ts`
- 12 phase methods
- Core business logic
- In-memory storage
- Transaction handling

### Frontend - Components
**Location**: `c:\Qal\QAL\src\app\components\equb\`
- 7 main components
- Transparent glass design
- Real-time data fetching
- Error handling

### Styling
**Location**: `c:\Qal\QAL\src\app\globals.css`
- Glassmorphic components
- Transparent background
- Ethiopian colors
- Responsive design

---

## Environment Variables

### Backend - `.env`
```
DATABASE_URL=postgresql://user:password@localhost:5432/equb_db
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=3333
```

### Frontend - `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

---

## Performance Tips

1. **Hardware**: 
   - 4GB RAM minimum
   - SSD recommended
   - Dual-core processor

2. **Network**:
   - Stable internet for cloud deployment
   - Localhost for development

3. **Browser**:
   - Chrome/Edge 90+
   - Firefox 88+
   - Safari 14+

---

## Next Steps

### After Running Successfully

1. **Database Setup** (Optional)
   - Install PostgreSQL
   - Create database
   - Uncomment initialization in `src/main.ts`

2. **Cloud Deployment** (When Ready)
   - Backend → Railway or AWS
   - Frontend → Vercel
   - Database → Neon or AWS RDS

3. **Additional Features**
   - SMS/Email notifications
   - Payment gateway integration
   - Mobile app
   - Admin dashboard

---

## Support Commands

```bash
# View backend logs
cd c:\QalNet- && npm run start:dev

# View frontend logs
cd c:\Qal\QAL && npm run dev

# Build frontend
cd c:\Qal\QAL && npm run build

# Check TypeScript
cd c:\Qal\QAL && npx tsc --noEmit

# Clear cache
npm cache clean --force
```

---

## Quick Reference

| Component | Port | URL | Command |
|-----------|------|-----|---------|
| Backend | 3333 | http://localhost:3333 | `npm run start:dev` |
| Frontend | 3000 | http://localhost:3000 | `npm run dev` |
| Database | 5432 | (optional) | Configure in .env |

---

## Success Indicators

✅ Backend running: See "Listening on port 3333"
✅ Frontend running: See "Ready in X.Xs" at `http://localhost:3000`
✅ Both connected: Create Equb form loads without errors
✅ API working: Equb created successfully
✅ Full cycle: All 12 phases complete

**Status**: Ready to test! 🚀

---

## Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| Port in use | Kill process with `taskkill` |
| Module not found | Run `npm install` again |
| Type error | Run `npm run build` to check |
| API 404 error | Verify backend running on 3333 |
| Components not showing | Clear browser cache, restart frontend |
| Cannot login | Check auth context in AuthContext.tsx |

---

## Support Files

See these for more details:
- `EQUB_IMPLEMENTATION_GUIDE.md` - Full technical docs
- `EQUB_SETUP_CHECKLIST.md` - Step-by-step setup
- `EQUB_COMPONENT_MAP.md` - Component architecture
- `EQUB_TRANSPARENT_DESIGN.md` - Design details

---

**Ready to Run!** Follow the Quick Start section above and you're good to go. 🎉
