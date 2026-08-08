# Equb System - Component & Phase Map

## Visual Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ETHIOPIAN EQUB SYSTEM                             │
│                      12-PHASE FLOW                                   │
└─────────────────────────────────────────────────────────────────────┘

                         PHASE 1: CREATE EQUB
                         ├─ Component: CreateEqubForm
                         ├─ API: POST /create
                         ├─ Input: Equb details
                         └─ Output: Equb ID

                              ↓

                        PHASE 2: INVITE MEMBERS
                        ├─ Component: InviteMembersForm
                        ├─ API: POST /invite-members
                        ├─ Input: Phone numbers
                        └─ Output: Invitations sent

                    ↙─────────────────────────────────────────↘
            MEMBER ACCEPTS                                MEMBER DECLINES
            (Accept Invitation)                          (Decline Invitation)
            └─ API: POST /accept-invitation              └─ API: POST /decline-invitation

                              ↓ (All members accepted)

                    PHASE 3: BEFORE EACH ROUND
                    └─ Automatic: Send reminders

                              ↓

            ┌─────────────────────────────────────────────────┐
            │           EACH ROUND CYCLE (1-N)               │
            ├─────────────────────────────────────────────────┤
            │                                                 │
            │  PHASE 4: CONTRIBUTION COLLECTION              │
            │  ├─ Component: ContributionTracker             │
            │  ├─ API: POST /contribute                      │
            │  ├─ Member Action: Record payment              │
            │  └─ Real-time: Show collection progress        │
            │                                                 │
            │              ↓                                  │
            │                                                 │
            │  PHASE 5: VERIFY CONTRIBUTIONS                 │
            │  ├─ API: GET /contributions/status             │
            │  ├─ Manager Action: Close collection           │
            │  ├─ Requirement: 100% members paid             │
            │  └─ API: PATCH /close-collection               │
            │                                                 │
            │              ↓                                  │
            │                                                 │
            │  PHASE 6: PREPARE LOTTERY                      │
            │  ├─ API: GET /eligible-members                 │
            │  ├─ System: Build eligible list                │
            │  ├─ Rule: Exclude previous winners             │
            │  └─ Result: N-1 eligible (or 1 for last)       │
            │                                                 │
            │              ↓                                  │
            │                                                 │
            │  PHASE 7: SELECT WINNER                        │
            │  ├─ API: POST /draw-lottery                    │
            │  ├─ System: Random selection                   │
            │  ├─ Timing: BEFORE animation starts            │
            │  └─ Result: Winner ID (hidden from UI)         │
            │                                                 │
            │              ↓                                  │
            │                                                 │
            │  PHASE 8: SPIN WHEEL (No Animation)            │
            │  ├─ Component: LotteryWheel                     │
            │  ├─ API: GET /lottery/{roundNumber}            │
            │  ├─ Display: All eligible members in circle    │
            │  └─ Result: Winner revealed (pre-selected)     │
            │                                                 │
            │              ↓                                  │
            │                                                 │
            │  PHASE 9: RECORD WINNER                        │
            │  ├─ Component: PayoutConfirmation              │
            │  ├─ API: POST /announce-winner                 │
            │  ├─ Action: Mark hasReceivedPayout = true      │
            │  └─ Result: Remove from future draws           │
            │                                                 │
            │              ↓                                  │
            │                                                 │
            │  PHASE 10: PAYOUT                              │
            │  ├─ Component: PayoutConfirmation              │
            │  ├─ Manager: Confirms payment to winner        │
            │  ├─ API: POST /confirm-payout                  │
            │  └─ Result: Payout recorded in history         │
            │                                                 │
            └─────────────────────────────────────────────────┘
                              ↓

                    PHASE 11: START NEXT ROUND
                    ├─ Check: Any members without payout?
                    ├─ If YES: currentRound++, repeat cycle
                    └─ If NO: Go to Phase 12

                              ↓

                    PHASE 12: CONTINUE UNTIL COMPLETION
                    ├─ Last Member Logic:
                    │  └─ When 1 eligible remains → AUTO-WIN
                    │     (No lottery needed)
                    ├─ Final State:
                    │  └─ All members: hasReceivedPayout = true
                    └─ Equb Status: "completed"
```

---

## Component Hierarchy

```
Frontend Application
│
├── CreateEqubForm
│   ├─ Phase: 1 (Create Equb)
│   ├─ Role: Manager
│   ├─ Input: Equb details
│   ├─ API Calls:
│   │  └─ POST /api/v1/equbs/create
│   └─ Output: Redirects to Equb page
│
├── InviteMembersForm
│   ├─ Phase: 2 (Invite Members)
│   ├─ Role: Manager
│   ├─ Input: Phone numbers
│   ├─ API Calls:
│   │  └─ POST /api/v1/equbs/{equbId}/invite-members
│   └─ Output: Invitation status
│
├── ContributionTracker
│   ├─ Phases: 4-5 (Collection & Verify)
│   ├─ Role: Manager (primary), Members (view)
│   ├─ Input: None (fetches data)
│   ├─ API Calls:
│   │  ├─ GET /api/v1/equbs/{equbId}/current-round
│   │  ├─ GET /api/v1/equbs/{equbId}/contributions/status
│   │  └─ PATCH /api/v1/equbs/{equbId}/close-collection
│   └─ Output: Progress bar, member list, close button
│
├── LotteryWheel
│   ├─ Phases: 6-8 (Lottery & Wheel)
│   ├─ Role: Manager (primary), Members (view)
│   ├─ Input: equbId, roundNumber
│   ├─ API Calls:
│   │  ├─ GET /api/v1/equbs/{equbId}/eligible-members
│   │  ├─ POST /api/v1/equbs/{equbId}/draw-lottery
│   │  └─ GET /api/v1/equbs/{equbId}/lottery/{roundNumber}
│   └─ Output: Wheel display, winner announcement
│
├── PayoutConfirmation
│   ├─ Phases: 9-10 (Winner & Payout)
│   ├─ Role: Manager
│   ├─ Input: equbId, roundNumber
│   ├─ API Calls:
│   │  ├─ POST /api/v1/equbs/{equbId}/announce-winner
│   │  ├─ POST /api/v1/equbs/{equbId}/confirm-payout
│   │  └─ GET /api/v1/equbs/{equbId}/payout-history
│   └─ Output: Confirmation, payout history
│
├── MemberEqubDashboard
│   ├─ Phases: All 12 (Member view)
│   ├─ Role: Member
│   ├─ Input: equbId
│   ├─ API Calls:
│   │  ├─ GET /api/v1/equbs/{equbId}/member-dashboard
│   │  └─ POST /api/v1/equbs/{equbId}/contribute
│   └─ Output: Dashboard with stats, contribute button
│
└── ManagerEqubDashboard
    ├─ Phases: All 12 (Manager view)
    ├─ Role: Manager
    ├─ Input: equbId
    ├─ API Calls:
    │  ├─ GET /api/v1/equbs/{equbId}/manager-dashboard
    │  └─ GET /api/v1/equbs/{equbId}/reports
    └─ Output: Tabs (Overview, Members, Reports)
```

---

## API Endpoint Map

```
Equb Management
├─ POST   /api/v1/equbs/create
├─ GET    /api/v1/equbs
├─ GET    /api/v1/equbs/{equbId}
└─ GET    /api/v1/equbs/{equbId}/payout-history

Member Invitations
├─ POST   /api/v1/equbs/{equbId}/invite-members
├─ POST   /api/v1/equbs/{equbId}/accept-invitation
└─ POST   /api/v1/equbs/{equbId}/decline-invitation

Contributions
├─ POST   /api/v1/equbs/{equbId}/contribute
├─ GET    /api/v1/equbs/{equbId}/current-round
├─ GET    /api/v1/equbs/{equbId}/contributions/status
└─ PATCH  /api/v1/equbs/{equbId}/close-collection

Lottery
├─ GET    /api/v1/equbs/{equbId}/eligible-members
├─ POST   /api/v1/equbs/{equbId}/draw-lottery
└─ GET    /api/v1/equbs/{equbId}/lottery/{roundNumber}

Winner & Payout
├─ POST   /api/v1/equbs/{equbId}/announce-winner
└─ POST   /api/v1/equbs/{equbId}/confirm-payout

Dashboards
├─ GET    /api/v1/equbs/member/my-equbs
├─ GET    /api/v1/equbs/{equbId}/member-dashboard
├─ GET    /api/v1/equbs/{equbId}/manager-dashboard
└─ GET    /api/v1/equbs/{equbId}/reports
```

---

## Data Model

```
Equb (Group)
├─ id: uuid
├─ managerId: userId
├─ name: string
├─ description: string
├─ contributionAmount: number
├─ totalMembers: number
├─ frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly'
├─ drawMethod: 'random' | 'predetermined' | 'manual'
├─ currentRound: number
├─ status: 'pending' | 'active' | 'completed' | 'cancelled'
└─ members: EqubMember[]

EqubMember
├─ userId: uuid
├─ status: 'active' | 'inactive'
├─ joinedAt: Date
├─ hasReceivedPayout: boolean
└─ contributions: number

Contribution
├─ id: uuid
├─ userId: uuid
├─ equbId: uuid
├─ roundNumber: number
├─ amount: number
├─ paymentMethod: string
├─ status: 'paid' | 'pending'
└─ paidAt: Date

Lottery
├─ id: uuid
├─ equbId: uuid
├─ roundNumber: number
├─ eligibleMembers: uuid[]
├─ winnerId: uuid
├─ prizeAmount: number
├─ status: 'drawn' | 'announced' | 'paid'
└─ drawnAt: Date

Payout
├─ id: uuid
├─ equbId: uuid
├─ roundNumber: number
├─ winnerId: uuid
├─ prizeAmount: number
├─ status: 'paid' | 'pending'
├─ paidDate: Date
└─ confirmedAt: Date
```

---

## User Flow by Role

### Manager Flow

```
Manager
  │
  ├─ Create Equb (Phase 1)
  │  └─ CreateEqubForm → API /create → Equb created
  │
  ├─ Invite Members (Phase 2)
  │  └─ InviteMembersForm → API /invite-members → Invitations sent
  │
  ├─ Monitor Collection (Phases 4-5)
  │  ├─ ContributionTracker
  │  ├─ API /current-round → Real-time progress
  │  ├─ API /contributions/status → Verify 100%
  │  └─ API /close-collection → Close round
  │
  ├─ Run Lottery (Phases 6-8)
  │  ├─ LotteryWheel
  │  ├─ API /draw-lottery → Select winner
  │  └─ API /lottery/{roundNumber} → Display wheel
  │
  ├─ Confirm Payout (Phases 9-10)
  │  ├─ PayoutConfirmation
  │  ├─ API /announce-winner → Mark member paid
  │  └─ API /confirm-payout → Complete round
  │
  ├─ View Dashboard (All phases)
  │  ├─ ManagerEqubDashboard
  │  ├─ Overview tab: Stats, progress
  │  ├─ Members tab: Individual status
  │  └─ Reports tab: Timeline, analytics
  │
  └─ Repeat for next round (Phase 11-12)
```

### Member Flow

```
Member
  │
  ├─ Accept Invitation (Phase 2)
  │  └─ API /accept-invitation → Member joins
  │
  ├─ Contribute Each Round (Phases 4)
  │  ├─ MemberEqubDashboard
  │  └─ API /contribute → Payment recorded
  │
  ├─ View Status (All phases)
  │  ├─ MemberEqubDashboard
  │  ├─ Contribution history
  │  ├─ Payout status
  │  ├─ Next collection date
  │  └─ Lottery history
  │
  ├─ When Winner (Phase 9-10)
  │  ├─ Receive notification
  │  ├─ Prize: Full pool amount
  │  ├─ Status: hasReceivedPayout = true
  │  └─ Continue contributing in remaining rounds
  │
  └─ View Payout (Phase 10)
     └─ Payout history shows date received
```

---

## State Transitions

```
Equb Status Flow
├─ "pending"
│  ├─ Condition: Created, waiting for members
│  ├─ Transitions to "active" when all members accept
│  └─ Components: CreateEqubForm, InviteMembersForm
│
├─ "active"
│  ├─ Condition: All members joined, running rounds
│  ├─ Transitions to:
│  │  ├─ "active" (next round) when: payout confirmed, members remain
│  │  └─ "completed" when: all members received payout
│  └─ Components: ContributionTracker, LotteryWheel, PayoutConfirmation
│
├─ "completed"
│  ├─ Condition: All rounds done, each member won once
│  ├─ No further transitions
│  └─ Components: ManagerEqubDashboard (reports tab)
│
└─ "cancelled"
   ├─ Condition: Equb terminated early
   └─ No further transitions
```

Member Status in Equb
```
hasReceivedPayout: false (default)
  ├─ Member eligible for lottery
  ├─ Member can win any round (if selected)
  └─ Transitions to true on /announce-winner

hasReceivedPayout: true
  ├─ Member excluded from future lotteries
  ├─ Member continues contributing
  └─ No further transitions (permanent)
```

---

## Example: 5-Member Equb End-to-End

```
SETUP PHASE
├─ 1. Manager creates Equb: "Test Equb" (5 members, 1000 ETB)
├─ 2. Manager invites: Abebe, Hana, Dawit, Selam, Kalkidan
├─ 3. All 5 members accept invitations
└─ 4. Equb status: "active"

ROUND 1
├─ All 5 contribute 1000 ETB → Pool: 5000
├─ Eligible: 5 members
├─ Draw: Winner = Selam
├─ Selam receives 5000, marked hasReceivedPayout=true
└─ Selam removed from future draws

ROUND 2
├─ All 5 contribute 1000 ETB → Pool: 5000
├─ Eligible: 4 members (exclude Selam)
├─ Draw: Winner = Hana
└─ Hana receives 5000, marked hasReceivedPayout=true

ROUND 3
├─ All 5 contribute 1000 ETB → Pool: 5000
├─ Eligible: 3 members
├─ Draw: Winner = Abebe
└─ Abebe receives 5000, marked hasReceivedPayout=true

ROUND 4
├─ All 5 contribute 1000 ETB → Pool: 5000
├─ Eligible: 2 members
├─ Draw: Winner = Dawit
└─ Dawit receives 5000, marked hasReceivedPayout=true

ROUND 5 (LAST)
├─ All 5 contribute 1000 ETB → Pool: 5000
├─ Eligible: 1 member (only Kalkidan remains)
├─ Status: AUTO-WIN (no lottery needed)
└─ Kalkidan receives 5000, marked hasReceivedPayout=true

COMPLETION
├─ All members: hasReceivedPayout = true
├─ All members: contributed 5000 total (5 rounds × 1000)
├─ All members: received 5000 (one round payout)
└─ Equb status: "completed"
```

---

## Summary

- **7 Frontend Components** - One for each major phase/feature
- **12 Backend Phases** - Complete business logic
- **28 API Endpoints** - One endpoint per major operation
- **12-Phase Flow** - From create to completion
- **2 Dashboards** - Manager and member views
- **3 Main Workflows** - Create/Invite, Contribute/Verify, Lottery/Payout

All components work together to implement the complete traditional Ethiopian Equb system where:
- Every member contributes equally every round
- One member receives payout each round (entire pool)
- Each member receives payout exactly once
- Equb continues until all members receive their payout
