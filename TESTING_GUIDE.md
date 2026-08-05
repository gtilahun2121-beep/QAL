# QalNet Testing Guide - Complete Walkthrough

## 🎯 Quick Test Links

| Feature | URL | Status |
|---------|-----|--------|
| Homepage | http://localhost:3000 | ✅ Live |
| Auth Page | http://localhost:3000/auth | ✅ Live |
| Admin Setup | http://localhost:3000/admin/setup | ✅ Live |
| Admin Dashboard | http://localhost:3000/admin/dashboard | ✅ Live |

---

## 📝 Test Scenario 1: Guest Overview (No Registration)

### Objective
Verify guest users can browse features without logging in or registering

### Steps
1. Navigate to: http://localhost:3000/auth
2. Click **👁️ Guest** tab
3. **Expected Results:**
   - ✅ See "Welcome to QalNet" card
   - ✅ View 4 key features (Equb Savings, Community, Secure, Fast Payouts)
   - ✅ See stats: 10K+ Members, ETB 50M Saved, 99% On-Time
   - ✅ View "How It Works" 4-step process
   - ✅ See FAQ section with common questions
   - ✅ CTA buttons: "Start Your Journey", "Sign in here"
   - ✅ Links to Features, Security, Architecture pages

### Test Verification
- [ ] Guest can view all content
- [ ] No account required
- [ ] Can navigate to feature pages
- [ ] Can switch to Register/Login tabs

---

## 👤 Test Scenario 2: Member Registration

### Objective
Complete the 4-step member registration flow with success notification

### Steps

#### Step 1: Phone Number
1. Navigate to: http://localhost:3000/auth
2. Click **📝 Register** tab
3. Enter phone: `+251911223344`
4. Click **Send OTP Code**
5. **Expected:**
   - ✅ Toast notification: "✅ OTP Sent"
   - ✅ Progress bar animation
   - ✅ Auto-dismiss after 4 seconds
   - ✅ Step changes to OTP entry

#### Step 2: OTP Verification
1. Enter OTP: `123456` (any 6 digits)
2. Click **Verify OTP**
3. **Expected:**
   - ✅ Toast: "✅ OTP Verified"
   - ✅ Step changes to Details

#### Step 3: User Details
1. Enter Full Name: `Aisha Mohammed`
2. Enter PIN: `1234`
3. Enter Fayda: `12345678`
4. Click **Complete Registration**
5. **Expected:**
   - ✅ Toast: "✅ Account Created!"
   - ✅ Personalized message with name
   - ✅ Success screen with account summary
   - ✅ Shows: Phone, Name, Fayda, Registration time

#### Step 4: Success Screen
- ✅ Confirmation message
- ✅ Account details displayed
- ✅ Options: "Go to Home" or "Go to Dashboard"

### Test Verification
- [ ] All 4 steps completed
- [ ] Toast notifications appear
- [ ] Data saved to localStorage
- [ ] Success screen displays correctly
- [ ] Can navigate away

---

## 🔐 Test Scenario 3: Member Login

### Objective
Login with registered phone number and PIN

### Steps
1. Navigate to: http://localhost:3000/auth
2. Click **🔐 Login** tab
3. Enter phone: `+251911223344` (from registration)
4. Click **Continue**
5. **Expected:**
   - ✅ Toast: "✅ Phone Found"
   - ✅ Step changes to PIN entry

#### PIN Verification
1. Enter PIN: `1234` (from registration)
2. Click **Login**
3. **Expected:**
   - ✅ Toast: "🎉 Welcome Back!"
   - ✅ Personalized greeting
   - ✅ Success screen shows account details
   - ✅ Member since date displayed

### Error Cases
- Enter wrong phone → Toast: "User Not Found"
- Enter wrong PIN → Toast: "Wrong PIN"
- Invalid phone format → Toast: "Invalid Number"

### Test Verification
- [ ] Correct phone accepted
- [ ] Correct PIN accepted
- [ ] Welcome notification appears
- [ ] Success screen displays
- [ ] Error handling works

---

## 👑 Test Scenario 4: Admin Setup

### Objective
Initialize demo admin accounts for testing

### Steps
1. Navigate to: http://localhost:3000/admin/setup
2. Click **Initialize Demo Admins**
3. **Expected:**
   - ✅ Success message: "Setup Complete!"
   - ✅ Shows all 4 admin accounts
   - ✅ Displays role information
   - ✅ Buttons appear: "Go to Admin Login", "Go to Home"

### Credentials Created
- super@qalnet.com / SuperAdmin123!
- kyc@qalnet.com / KYC@Approver123
- dispute@qalnet.com / Dispute@Manager123
- auditor@qalnet.com / Auditor@Finance123

### Test Verification
- [ ] Admin accounts initialized
- [ ] localStorage contains admin data
- [ ] Setup page shows success
- [ ] Can proceed to admin login

---

## 🔐 Test Scenario 5: Super Admin Login

### Objective
Full admin access with all permissions

### Steps
1. Navigate to: http://localhost:3000/auth
2. Click **👑 Admin** tab
3. Enter email: `super@qalnet.com`
4. Click **Continue**
5. **Expected:**
   - ✅ Toast: "Email Found"
   - ✅ Step changes to password entry

#### Password Entry
1. Enter password: `SuperAdmin123!`
2. Click **Verify Password**
3. **Expected:**
   - ✅ Toast: "Password Verified"
   - ✅ Step changes to MFA entry

#### MFA Entry
1. Enter code: `000000`
2. Click **Verify MFA**
3. **Expected:**
   - ✅ Toast: "🔓 Login Successful"
   - ✅ Success screen shows:
     - 👑 Super Admin role badge
     - Email address
     - Option to go to admin dashboard

#### Admin Dashboard
1. Click **Go to Admin Dashboard**
2. **Expected:**
   - ✅ Dashboard loads
   - ✅ Header: "👑 Admin Dashboard"
   - ✅ All 6 tabs visible:
     - 📊 Overview
     - 👥 Members
     - ✅ KYC
     - ⚖️ Disputes
     - 💰 Finance
     - ⚙️ Admin

### Overview Tab
- ✅ Shows 4 stat cards
- ✅ Displays: Members count, Pending KYC, Open Disputes, Total Transactions

### Members Tab
- ✅ Table of all members
- ✅ Shows: Name, Phone, Status, KYC Status
- ✅ Actions: View button

### KYC Tab
- ✅ Shows pending KYC documents
- ✅ Member details displayed
- ✅ Approve/Reject buttons available

### Disputes Tab
- ✅ Lists active disputes
- ✅ Shows: Complainant vs Respondent, Priority
- ✅ Actions: Investigate, Resolve buttons

### Finance Tab
- ✅ Shows total transaction amount
- ✅ Transaction table with: Member, Type, Amount, Status
- ✅ Color-coded status badges

### Admin Users Tab
- ✅ Lists admin accounts
- ✅ Shows current admin info
- ✅ "Add New Admin" button available

### Test Verification
- [ ] All login steps pass
- [ ] MFA code: 000000 accepted
- [ ] Dashboard loads completely
- [ ] All 6 tabs visible
- [ ] All sections display data
- [ ] Logout button works

---

## ✅ Test Scenario 6: KYC Approver Limited Access

### Objective
Verify role-based permissions - KYC Approver can't see Finance or Admin tabs

### Steps
1. Navigate to: http://localhost:3000/auth
2. Click **👑 Admin** tab
3. Login as: `kyc@qalnet.com` / `KYC@Approver123` / MFA: `000000`
4. Go to Admin Dashboard

### Expected Results
- ✅ Only 4 tabs visible:
  - 📊 Overview (accessible)
  - 👥 Members (accessible)
  - ✅ KYC (accessible)
  - ⚖️ Disputes (HIDDEN)
  - 💰 Finance (HIDDEN)
  - ⚙️ Admin (HIDDEN)

### Verify KYC Workflow
1. Click **✅ KYC** tab
2. **Expected:**
   - ✅ KYC documents displayed
   - ✅ Approve/Reject buttons available
   - ✅ Can add approval notes

### Test Verification
- [ ] Login succeeds
- [ ] Only authorized tabs visible
- [ ] Can access KYC section
- [ ] Cannot see Finance/Admin tabs
- [ ] Role enforcement working

---

## ⚖️ Test Scenario 7: Dispute Manager Workflow

### Objective
Verify dispute management permissions

### Steps
1. Login as: `dispute@qalnet.com` / `Dispute@Manager123`
2. **Note:** MFA disabled for this account
3. Go to Admin Dashboard

### Expected Results
- ✅ Visible tabs:
  - 📊 Overview
  - 👥 Members
  - ⚖️ Disputes (accessible)
  - 💰 Finance (accessible)
- ✅ Hidden tabs:
  - ✅ KYC
  - ⚙️ Admin

### Disputes Tab Features
- ✅ Open disputes listed
- ✅ Can see: Complainant, Respondent, Priority
- ✅ Actions: Investigate, Resolve buttons

### Test Verification
- [ ] Login without MFA works
- [ ] Correct tabs visible
- [ ] Dispute data displays
- [ ] Can perform dispute actions

---

## 💰 Test Scenario 8: Finance Auditor Reports

### Objective
Verify financial data viewing and reporting

### Steps
1. Login as: `auditor@qalnet.com` / `Auditor@Finance123` / MFA: `000000`
2. Go to Admin Dashboard
3. Click **💰 Finance** tab

### Expected Results
- ✅ Finance summary card shows total ETB amount
- ✅ Transaction table displays:
  - Member names
  - Transaction type (payment, payout, fee, refund)
  - Amount in ETB
  - Status (completed, pending, failed)
- ✅ Color-coded status badges
- ✅ Scrollable table for large datasets

### Test Verification
- [ ] Finance tab accessible
- [ ] Data displays correctly
- [ ] All transaction fields visible
- [ ] Report generation functional

---

## 🔄 Test Scenario 9: Error Handling

### Objective
Test all error messages and edge cases

### Member Registration Errors
- [ ] Invalid phone format → Error message appears
- [ ] Wrong OTP length → Error message
- [ ] Missing full name → Error message
- [ ] Invalid PIN (not 4 digits) → Error message
- [ ] Missing Fayda number → Error message

### Member Login Errors
- [ ] Unregistered phone → "User Not Found"
- [ ] Wrong PIN → "Wrong PIN"
- [ ] Invalid phone format → "Invalid Number"

### Admin Login Errors
- [ ] Invalid email → Error message
- [ ] Unregistered email → "Account Not Found"
- [ ] Wrong password → "Wrong Password"
- [ ] Wrong MFA code → "Invalid Code"

### Test Verification
- [ ] All error messages display
- [ ] Toast notifications show
- [ ] Forms don't submit with errors
- [ ] User can retry after error

---

## 🎨 Test Scenario 10: UI/UX Features

### Animations
- [ ] Form transitions smooth (fade-in/fade-out)
- [ ] Button hover effects (scale)
- [ ] Success screen celebration animation
- [ ] Toast notifications animated
- [ ] Progress bars animate smoothly

### Responsive Design
- [ ] Mobile view (< 640px):
  - [ ] Tabs stack or scroll
  - [ ] Forms fit screen
  - [ ] Buttons readable
- [ ] Tablet view (640px - 1024px):
  - [ ] Layout balanced
  - [ ] Navigation clear
- [ ] Desktop view (> 1024px):
  - [ ] Full features visible
  - [ ] Grid layouts optimized

### Accessibility
- [ ] Form labels descriptive
- [ ] Buttons have clear purpose
- [ ] Color contrast sufficient
- [ ] Focus states visible
- [ ] Error messages clear

### Test Verification
- [ ] All animations work smoothly
- [ ] Responsive on all screen sizes
- [ ] Good user experience
- [ ] Navigation intuitive

---

## 📊 Quick Test Checklist

```
GUEST OVERVIEW
[ ] Guest tab accessible
[ ] No registration required
[ ] All features viewable
[ ] Can navigate away

MEMBER REGISTRATION
[ ] 4-step flow complete
[ ] Toast notifications show
[ ] Success screen displays
[ ] Data persists

MEMBER LOGIN
[ ] Login with correct credentials
[ ] Welcome notification
[ ] Error handling for wrong info

ADMIN SETUP
[ ] Setup page accessible
[ ] Admin accounts created
[ ] Credentials valid

SUPER ADMIN
[ ] All tabs visible
[ ] Full access to features
[ ] Dashboard fully functional

ROLE-BASED ACCESS
[ ] KYC Approver sees only KYC tabs
[ ] Finance Auditor sees Finance
[ ] Dispute Manager sees Disputes
[ ] Admin Users tab restricted

SECURITY
[ ] MFA working
[ ] Logout clears session
[ ] No unauthorized access
[ ] Permissions enforced

TESTING COMPLETE ✅
```

---

## 🚀 Ready to Deploy?

Check this before production:

```
BEFORE DEPLOYMENT
[ ] Replace localStorage with database
[ ] Implement real MFA providers
[ ] Setup email service
[ ] Configure SSL/TLS
[ ] Enable CORS properly
[ ] Setup rate limiting
[ ] Configure backups
[ ] Enable monitoring
[ ] Document API endpoints
[ ] Security audit passed
```

---

**Test Environment:** Development (localhost:3000)  
**Last Updated:** July 30, 2026  
**Status:** Ready for Testing ✅
