# QalNet End-to-End Test Flow

## ✅ STATUS: READY TO TEST

Both servers running:
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:3333

---

## 📋 Complete User Journey

### Phase 1: Initial Landing Page
**URL:** http://localhost:3000

Expected: 
- Header with QalNet logo and Register button
- Hero section with "Welcome to QalNet"
- Features section showing benefits
- CTA buttons to Register

---

### Phase 2: Click Register Button

When you click any "Register" or "Sign Up" button:

**Modal Opens:** RegisterChoiceModal
```
┌─────────────────────────────────────────┐
│  QalNet                              ← ✕ │
│  Ethiopia's Digital Equb              │
├─────────────────────────────────────────┤
│                                         │
│   Welcome to QalNet                    │
│   Are you a new member or returning?   │
│                                         │
│  ┌───────────────────┬───────────────┐ │
│  │ ✍️ Create New     │ 🔐 I Already  │ │
│  │ Account          │ Have Account   │ │
│  │                  │                │ │
│  │ Join QalNet and  │ Sign in with   │ │
│  │ start saving...  │ phone + PIN    │ │
│  │                  │                │ │
│  │ Get Started →    │ Sign In →      │ │
│  └───────────────────┴───────────────┘ │
│                                         │
│  Trusted by thousands of Ethiopians   │
│  🔒 Secure  ✅ Verified  ⚡ Instant  │
│                                         │
│              ← Back                     │
└─────────────────────────────────────────┘
```

---

### Phase 3a: Path 1 - NEW USER (Sign Up)

**User Clicks:** "✍️ Create New Account"

**Step 1: Personal Information**
```
Form:
- 👤 First Name: [John         ]
- 👤 Last Name:  [Doe          ]

Button: Next →
```

**Step 2: Contact Information**
```
Form:
- 📱 Phone Number: [+2519 87654321]
- 📧 Email: [john@gmail.com]

Buttons: ← Back | Next →
```

**Step 3: Identity Verification (Fayda)**
```
Form:
- 🆔 Fayda Number: [1234567890123456]
  (16 digits only)

Button: [Verify with Fayda]
  ⏳ Verifying... (2 seconds)
  ✓ Identity Verified

Info Box: ✓ Your Fayda ID has been verified

Buttons: ← Back | Next →
```

**Step 4: OTP Verification**
```
Info: We sent a 5-digit OTP to your phone number

Form:
- 🔐 Enter OTP: [12345]
  (5 digits)

Security Features:
✅ 🔒 End-to-end encryption
✅ ✅ Fayda identity verified
✅ 📱 OTP verification
✅ 🛡️ Your data is protected

Buttons: ← Back | 🎉 Verify & Create Account
```

**On Submit:** 
- API Call: `POST /api/v1/auth/signup`
- Loading: "⏳ Verifying..."
- Success: "✓ Registration complete!"
- **Redirect:** `/dashboard`

---

### Phase 3b: Path 2 - EXISTING USER (Sign In)

**User Clicks:** "🔐 I Already Have an Account"

**Sign In Form:**
```
Form:
- 📱 Phone Number: [+2519_______ ]
  (Auto-filled +2519, just type 8 digits)

- 🔐 4-Digit PIN: [••••]
  (Password masked)

Button: Sign In

Info: Don't have an account? Click the "Sign Up" tab
```

**On Submit:**
- API Call: `POST /api/v1/auth/signin`
- Loading: "⏳ Processing..."
- Success: "✓ Signed in successfully!"
- **Redirect:** `/dashboard`

---

### Phase 4: Dashboard Page ✅

**URL:** http://localhost:3000/dashboard

Expected Page:
```
┌────────────────────────────────────────────┐
│ QalNet  [Home] [Features] [Docs] [Lang]    │
├────────────────────────────────────────────┤
│                                            │
│  Welcome, [User's Name]!                  │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Wallet Balance: ETB 12,500           │ │
│  │ Active Equbs: 3                      │ │
│  │ Next Payment: 5 days                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Your Equbs:                              │
│  ┌──────────────────────────────────────┐ │
│  │ 1. Gold Equb                         │ │
│  │    Members: 12 | Position: 3         │ │
│  │    Next Payout: 3 months | ✅ Active│ │
│  ├──────────────────────────────────────┤ │
│  │ 2. Community Fund                    │ │
│  │    Members: 8 | Position: 5          │ │
│  │    Next Payout: 4 months | ✅ Active│ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Notifications:                           │
│  📅 Payment Due Tomorrow - 1 day          │
│  👥 New Member Joined - 2 hours          │
│  💰 You Received Your Payout - 1 week    │
│                                            │
│  [Sign Out]                               │
└────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│ User at http://localhost:3000                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Click Register                                    │
│      ↓                                              │
│  RegisterChoiceModal Opens                         │
│      ↓                                              │
│  ┌─────────────────┬──────────────────┐            │
│  │                 │                  │            │
│  ↓                 ↓                  │            │
│  Sign Up        Sign In              │            │
│  │               │                   │            │
│  ↓               ↓                   │            │
│  4-Step Form    Phone + PIN         │            │
│  │               │                   │            │
│  ↓               ↓                   ↓            │
│  POST /auth/signup  POST /auth/signin            │
│       ↓               ↓                           │
│  ┌────────────────────────────────────────┐      │
│  │    Backend (http://localhost:3333)     │      │
│  │                                        │      │
│  │  1. Validate input                     │      │
│  │  2. Check database                     │      │
│  │  3. Generate JWT token                 │      │
│  │  4. Return user + token                │      │
│  └────────────────────────────────────────┘      │
│       ↓               ↓                           │
│  Store Token    Store Token                      │
│  localStorage   localStorage                     │
│       ↓               ↓                           │
│  Redirect /dashboard Redirect /dashboard        │
│       ↓               ↓                           │
│  Dashboard Loads ← ← ←                           │
│       ↓                                           │
│  Display User Info                               │
│  Show Equbs                                      │
│  Show Balance                                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔍 What Gets Stored

After successful auth, localStorage contains:

```javascript
// 1. Auth Token (JWT)
localStorage.authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// 2. User Data
localStorage.qalnet_user = JSON.stringify({
  id: "user_123",
  firstName: "Abebe",
  lastName: "Tekle",
  email: "abebe@gmail.com",
  phoneNumber: "+251987654321",
  profession: "Tech & Digital Freelancers",
  role: "member",
  createdAt: "2026-08-03T10:30:00Z"
})

// 3. Refresh Token
localStorage.refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📱 Test Scenarios

### Scenario 1: Successful Sign Up (Happy Path)
```
✅ Step 1: Fill personal info → Next
✅ Step 2: Fill contact info → Next
✅ Step 3: Verify Fayda → Next
✅ Step 4: Enter OTP → Submit
✅ Response: Success message
✅ Redirect: /dashboard
✅ Dashboard: Shows user info
```

### Scenario 2: Successful Sign In (Happy Path)
```
✅ Phone: +251987654321
✅ PIN: 1234
✅ Response: Success message
✅ Redirect: /dashboard
✅ Dashboard: Shows user info
```

### Scenario 3: Validation Errors
```
❌ Empty first name → "First name required"
❌ Short phone → "Phone must be +2519 followed by 8 digits"
❌ Invalid email → "Email must end with @gmail.com"
❌ Wrong Fayda format → "Fayda must be exactly 16 digits"
❌ Short OTP → "OTP must be 5 digits"
```

### Scenario 4: Back Navigation
```
✅ Fill Step 1 → Click Next
✅ Fill Step 2 → Click Back
✅ Back to Step 1 (data preserved)
✅ Back again → Return to Choice
✅ Choose Sign In instead
```

### Scenario 5: Close Modal
```
✅ At choice screen, click ✕
✅ Confirmation: "Are you sure?"
✅ Click Confirm
✅ Modal closes
✅ Back to home page
```

---

## 🌐 Network Requests (DevTools)

When you test, check DevTools Network tab for:

### Sign Up Flow:
```
1. POST http://localhost:3333/api/v1/auth/signup
   Headers:
   - Content-Type: application/json
   
   Body:
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@gmail.com",
     "phoneNumber": "+251987654321",
     "password": "12345",
     "fayda": "1234567890123456"
   }
   
   Response: 200 OK
   {
     "accessToken": "...",
     "refreshToken": "...",
     "user": { ... }
   }
```

### Sign In Flow:
```
1. POST http://localhost:3333/api/v1/auth/signin
   Headers:
   - Content-Type: application/json
   
   Body:
   {
     "phoneNumber": "+251987654321",
     "pin": "1234"
   }
   
   Response: 200 OK
   {
     "accessToken": "...",
     "refreshToken": "...",
     "user": { ... }
   }
```

---

## ⚙️ Debug Checklist

- [ ] Frontend loads at http://localhost:3000
- [ ] Register button appears
- [ ] Choice modal opens
- [ ] Can navigate between Sign Up/Sign In
- [ ] Back buttons work
- [ ] Form validation works
- [ ] API calls appear in Network tab
- [ ] Tokens stored in localStorage
- [ ] Redirect to dashboard happens
- [ ] Dashboard loads with user data
- [ ] Sign Out button works

---

## 🚀 Quick Test Command

```bash
# Check both servers
curl http://localhost:3000
curl http://localhost:3333

# View logs
# Terminal 1: Frontend
# Terminal 2: Backend
```

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Home page loads
2. ✅ Register button works
3. ✅ Choice modal appears
4. ✅ Form validates input
5. ✅ API calls go to backend (Network tab)
6. ✅ Success message appears
7. ✅ **Redirect to /dashboard happens**
8. ✅ Dashboard shows user info
9. ✅ localStorage has tokens

---

**TEST NOW:** http://localhost:3000

**Status:** ✅ Ready
**Frontend:** ✅ Running
**Backend:** ✅ Running
**Dashboard:** ✅ Connected
