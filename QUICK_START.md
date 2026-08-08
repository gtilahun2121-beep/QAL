# Equb System - Quick Start Guide

## 30-Second Overview

Complete Ethiopian Equb system with 12 phases: create → invite → collect → verify → lottery → payout → completion.

- **Backend**: NestJS on port 3333 (28 API endpoints)
- **Frontend**: Next.js on port 3000 (7 components)
- **Storage**: In-memory (ready for PostgreSQL)
- **Status**: Ready to run locally

---

## Quickest Start (5 minutes)

### 1. Start Backend
```bash
cd c:\QalNet-
npm install
npm run start:dev
```
Backend runs on `http://localhost:3333`

### 2. Start Frontend
```bash
cd c:\QAL
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

### 3. Open Browser
```
http://localhost:3000
```

Done! System ready for testing.

---

## 10-Minute Test Flow

### Step 1: Create Equb
1. Login to `http://localhost:3000`
2. Click "Create Equb"
3. Fill form:
   - Name: "Test Equb"
   - Members: 5
   - Amount: 1000 ETB
   - Frequency: Monthly
4. Click "Create"

### Step 2: Invite Members
1. Copy Equb ID from success page
2. Click "Invite Members"
3. Add 5 phone numbers
4. Click "Send Invitations"

### Step 3: Accept Invitations
1. Login as each member (5 accounts)
2. Navigate to "My Equbs"
3. Find invitation for "Test Equb"
4. Click "Accept"
5. Repeat for all 5 members

### Step 4: Contribute
1. Each member goes to their Equb dashboard
2. Clicks "Contribute This Round"
3. System records 1000 ETB
4. Manager sees progress in "Contribution Tracker"

### Step 5: Close Collection
1. Manager views Contribution Tracker
2. Wait for 100% progress
3. Click "Close Collection Period"

### Step 6: Draw & Payout
1. Go to "Lottery Wheel"
2. Click "Draw Lottery"
3. See winner in wheel
4. Go to "Payout Confirmation"
5. Click "Announce Winner"
6. Set payment date
7. Click "Confirm Payout"

### Step 7: Next Round
1. Equb auto-creates Round 2
2. 4 members now eligible (previous winner excluded)
3. All 5 members contribute again
4. Repeat steps 5-6 for next 4 rounds

### Step 8: Completion
1. After Round 5 (last member)
2. System auto-selects last member (no lottery)
3. Equb status changes to "completed"
4. All members received payout once

**Time**: ~10 minutes for full cycle

---

## Files to Know

### Backend Code
```
c:\QalNet-\src\modules\equb\
  ├── equb.controller.ts    (API endpoints)
  └── equb.service.ts       (Business logic)
```

### Frontend Code
```
c:\QAL\src\app\components\equb\
  ├── CreateEqubForm.tsx          (Phase 1)
  ├── InviteMembersForm.tsx       (Phase 2)
  ├── ContributionTracker.tsx     (Phases 4-5)
  ├── LotteryWheel.tsx            (Phases 6-8)
  ├── PayoutConfirmation.tsx      (Phases 9-10)
  ├── MemberEqubDashboard.tsx     (Member view)
  └── ManagerEqubDashboard.tsx    (Manager view)
```

### Documentation
```
c:\Qal\
  ├── EQUB_IMPLEMENTATION_GUIDE.md   (Full technical docs)
  ├── EQUB_SETUP_CHECKLIST.md        (Setup & testing)
  ├── EQUB_COMPONENT_MAP.md          (Flows & architecture)
  ├── EQUB_SYSTEM_SUMMARY.md         (Overview)
  └── QUICK_START.md                 (This file)
```

---

## 12 Phases Explained

| # | Name | Action | Who | API |
|---|------|--------|-----|-----|
| 1 | Create Equb | Enter details | Manager | POST /create |
| 2 | Invite Members | Send invitations | Manager | POST /invite-members |
| 3 | Before Round | Send reminders | System | Scheduler |
| 4 | Contribute | Record payment | Member | POST /contribute |
| 5 | Verify | Check 100% paid | Manager | GET /contributions/status |
| 6 | Prepare | Build eligible list | System | GET /eligible-members |
| 7 | Select | Random draw | System | POST /draw-lottery |
| 8 | Wheel | Display members | UI | GET /lottery/{round} |
| 9 | Record | Mark winner paid | System | POST /announce-winner |
| 10 | Payout | Confirm payment | Manager | POST /confirm-payout |
| 11 | Next | Create next round | System | Service logic |
| 12 | Complete | Last member auto-wins | System | Service logic |

---

## API Endpoints (Quick Reference)

### Create & Manage
```
POST   /api/v1/equbs/create
GET    /api/v1/equbs
GET    /api/v1/equbs/{equbId}
```

### Members
```
POST   /api/v1/equbs/{equbId}/invite-members
POST   /api/v1/equbs/{equbId}/accept-invitation
```

### Contribute
```
POST   /api/v1/equbs/{equbId}/contribute
GET    /api/v1/equbs/{equbId}/current-round
PATCH  /api/v1/equbs/{equbId}/close-collection
```

### Lottery
```
GET    /api/v1/equbs/{equbId}/eligible-members
POST   /api/v1/equbs/{equbId}/draw-lottery
GET    /api/v1/equbs/{equbId}/lottery/{roundNumber}
```

### Winner
```
POST   /api/v1/equbs/{equbId}/announce-winner
POST   /api/v1/equbs/{equbId}/confirm-payout
```

### Dashboard
```
GET    /api/v1/equbs/{equbId}/member-dashboard
GET    /api/v1/equbs/{equbId}/manager-dashboard
```

---

## Troubleshooting

### Backend won't start
```bash
# Check port 3333 in use
netstat -ano | findstr :3333

# Kill process
taskkill /PID <PID> /F

# Try again
npm run start:dev
```

### Frontend won't load
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -r node_modules
npm install
npm run dev
```

### API 404 errors
1. Check backend running on port 3333
2. Check API_URL in `src/app/config/environment.ts` is `http://localhost:3333`
3. Check endpoint spelling matches controller

### Database errors
Will appear when database integration added. For now, using in-memory storage.

---

## Key Concepts

### Equal Contributions
Every member pays same amount every round.
- Example: 20 members × 1000 ETB = 20,000 ETB pool

### One Winner Per Round
Single member randomly selected from eligible pool.
- Receives entire pool (20,000 ETB)

### Each Member Wins Once
No member can win twice.
- Round 1: 20 eligible → 1 winner
- Round 2: 19 eligible (exclude winner)
- ... continue until all won

### Winner Continues Paying
Member pays in remaining rounds after winning.
- Example: Wins round 3 of 20 → still pays rounds 4-20

### Auto-Complete Last Member
When only 1 member hasn't won:
- No lottery needed
- Member automatically receives final payout
- Equb completes

---

## Example: 5-Member Equb

```
Setup: Abebe (manager), Hana, Dawit, Selam, Kalkidan

Round 1: Everyone pays 1000 → 5000 pool → Selam wins → Gets 5000
Round 2: Everyone pays 1000 → 5000 pool → Hana wins → Gets 5000  
Round 3: Everyone pays 1000 → 5000 pool → Abebe wins → Gets 5000
Round 4: Everyone pays 1000 → 5000 pool → Dawit wins → Gets 5000
Round 5: Everyone pays 1000 → 5000 pool → Kalkidan ONLY eligible → AUTO-WINS → Gets 5000

Result: All paid 5×1000=5000 total, all received 5000 exactly once
Status: COMPLETED
```

---

## Success Criteria

When you see all of these, system is working:

1. ✅ Backend running on port 3333
2. ✅ Frontend running on port 3000
3. ✅ Can create Equb
4. ✅ Can invite members
5. ✅ Members can accept
6. ✅ Members can contribute
7. ✅ Tracker shows progress
8. ✅ Can close collection
9. ✅ Can draw lottery
10. ✅ Can announce winner
11. ✅ Can confirm payout
12. ✅ Next round auto-creates
13. ✅ Equb completes after all won

---

## Common Tasks

### Create New Equb
1. Manager: Click "Create Equb"
2. Fill form (name, amount, members, frequency)
3. Click "Create"

### Join Equb
1. Member: View invitation
2. Click "Accept"
3. Appears in "My Equbs"

### Contribute
1. Member: Open Equb
2. Click "Contribute This Round"
3. Amount auto-filled
4. System records payment

### Run Lottery
1. Manager: Open "Lottery Wheel"
2. Click "Draw Lottery"
3. Winner shows in circle
4. Member notified of win

### Confirm Payout
1. Manager: Open "Payout Confirmation"
2. Announce winner
3. Set payment date
4. Click "Confirm"

### View Dashboard
- **Member**: Open Equb → See contributions, payout status
- **Manager**: Open Equb → View tabs (Overview, Members, Reports)

---

## Next Steps

### Immediate
1. Run locally (backend + frontend)
2. Create test Equb
3. Run through all 12 phases
4. Verify everything works

### Short Term
1. Enable database (uncomment line 25 in `src/main.ts`)
2. Migrate to PostgreSQL
3. Test with real database

### Medium Term
1. Deploy to cloud (Vercel + Railway + Neon)
2. Add notifications (SMS/Email)
3. Add payment gateway

### Long Term
1. Add mobile app
2. Add admin dashboard
3. Add analytics
4. Add dispute resolution

---

## Documents to Read

1. **QUICK_START.md** (you are here)
   - Fast overview
   - Get running in 5 minutes

2. **EQUB_SYSTEM_SUMMARY.md**
   - High-level overview
   - What was built

3. **EQUB_IMPLEMENTATION_GUIDE.md**
   - Full technical docs
   - All API endpoints with examples
   - Database schema

4. **EQUB_SETUP_CHECKLIST.md**
   - Step-by-step setup
   - Testing instructions
   - Troubleshooting

5. **EQUB_COMPONENT_MAP.md**
   - Visual flows
   - Component hierarchy
   - Data models

---

## Support

| Issue | Solution |
|-------|----------|
| Backend won't start | Check port 3333, see troubleshooting |
| Frontend won't load | Check `npm install`, clear cache |
| API 404 | Check backend running, verify endpoint |
| Component not found | Check file exists in `src/app/components/equb/` |
| Data not loading | Check localStorage has authToken |
| Can't create Equb | Fill all required fields, check backend logs |
| Can't invite members | Try adding valid phone numbers |
| Can't contribute | Must be member (accept invitation first) |
| Lottery won't draw | All members must have contributed 100% |

---

## Done!

You now have a complete 12-phase Ethiopian Equb system.

**Next**: Start backend, start frontend, test it out!

```bash
# Terminal 1: Backend
cd c:\QalNet- && npm install && npm run start:dev

# Terminal 2: Frontend  
cd c:\QAL && npm install && npm run dev

# Browser: http://localhost:3000
```

Enjoy!
