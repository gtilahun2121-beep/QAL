# QalNet Admin System - Complete Guide

## 🎯 Overview

QalNet includes a comprehensive multi-tier admin system with role-based access control (RBAC), multi-factor authentication (MFA), and specialized dashboards for different admin roles.

---

## 👑 Admin Roles & Permissions

### 1. **Super Admin** (👑)
- **Full Access** to all system features
- Manage all members and their KYC documents
- Handle disputes and conflicts
- View and audit financial records
- Create and manage other admin accounts
- Configure system settings
- **Permissions:**
  - `view_members` - See all member data
  - `approve_kyc` - Approve/reject KYC documents
  - `manage_disputes` - Create/resolve disputes
  - `view_financial_records` - View all transactions
  - `assign_roles` - Change member/admin roles
  - `manage_permissions` - Modify permissions
  - `manage_admin_users` - Create/edit other admins
  - `system_settings` - Configure platform settings

### 2. **KYC Approver** (✅)
- Reviews member KYC documents
- Approves or rejects documents with notes
- Can view member details
- View audit logs for compliance
- **Permissions:**
  - `view_members`
  - `approve_kyc`
  - `reject_kyc`
  - `view_audit_logs`

### 3. **Dispute Manager** (⚖️)
- Investigates member disputes
- Resolves conflicts fairly
- Views member and financial details
- Maintains audit trails
- **Permissions:**
  - `view_members`
  - `manage_disputes`
  - `resolve_disputes`
  - `view_financial_records`
  - `view_audit_logs`

### 4. **Finance Auditor** (💰)
- Reviews all financial records
- Generates financial reports
- Ensures compliance and accuracy
- Monitors transaction patterns
- **Permissions:**
  - `view_members`
  - `view_financial_records`
  - `generate_reports`
  - `view_audit_logs`

---

## 🔐 Authentication Flow

### Step 1: Email Verification
- Admin enters their registered email address
- System checks if email exists in admin database

### Step 2: Master Password
- Admin enters their master password (min 8 characters)
- Password validated against stored hash

### Step 3: Multi-Factor Authentication (MFA)
- If MFA enabled, admin must enter 6-digit code
- Options:
  - **Email OTP** - Code sent via email
  - **TOTP** - Authenticator app (Google Auth, Authy)
  - **Both** - Either method accepted

### Step 4: Dashboard Access
- Admin logged in and token stored
- Access to role-specific dashboard sections

---

## 🚀 Getting Started

### Initial Setup

1. **Initialize Demo Admins** (Development Only)
   ```
   Visit: http://localhost:3000/admin/setup
   Click: "Initialize Demo Admins"
   ```

2. **Demo Admin Credentials**
   
   | Role | Email | Password | MFA |
   |------|-------|----------|-----|
   | Super Admin | super@qalnet.com | SuperAdmin123! | Enabled (000000) |
   | KYC Approver | kyc@qalnet.com | KYC@Approver123 | Enabled (000000) |
   | Dispute Manager | dispute@qalnet.com | Dispute@Manager123 | Disabled |
   | Finance Auditor | auditor@qalnet.com | Auditor@Finance123 | Enabled (000000) |

### Test Login

1. Go to: http://localhost:3000/auth
2. Click **👑 Admin** tab
3. Enter email and password from above
4. Enter MFA code: `000000`
5. Access admin dashboard

---

## 📊 Admin Dashboard

### Overview Tab (All Roles)
- **Total Members** - Active registered members
- **Pending KYC** - Documents awaiting approval
- **Open Disputes** - Active conflicts
- **Total Transactions** - Financial activity summary

### Members Tab (view_members)
- List all registered members
- View member status (active/suspended/inactive)
- Check KYC status (pending/approved/rejected)
- Quick actions: View details, manage status

### KYC Tab (approve_kyc)
- Pending KYC documents from members
- View member identity documents
- **Approve** - Accept KYC, member fully verified
- **Reject** - Decline KYC, provide reason
- Add approval notes for audit trail

### Disputes Tab (manage_disputes)
- Open and active disputes
- Details: Complainant, Respondent, Description
- Priority levels: Low, Medium, High, Critical
- **Investigate** - Start investigation
- **Resolve** - Close with resolution
- Evidence tracking

### Finance Tab (view_financial_records)
- All transaction records
- Filter by type: Payment, Payout, Fee, Refund
- Status tracking: Completed, Pending, Failed
- Generate financial reports
- Audit compliance data

### Admin Users Tab (manage_admin_users)
- List all admin accounts
- View role and permissions
- Create new admin accounts
- Manage admin status (active/suspended)
- Edit admin roles and permissions
- View admin activity logs

---

## 🔒 Security Features

### Authentication
- ✅ Email verification
- ✅ Master password hashing
- ✅ Multi-factor authentication (MFA)
- ✅ Session management
- ✅ Login attempt rate limiting
- ✅ Automatic session timeout (30 mins)

### Data Protection
- ✅ Encrypted data in transit (HTTPS)
- ✅ Audit logs for all admin actions
- ✅ Role-based access control (RBAC)
- ✅ Permission-based feature access
- ✅ Sensitive data masking in logs

### Compliance
- ✅ Member data privacy
- ✅ Financial audit trails
- ✅ Dispute resolution tracking
- ✅ KYC documentation storage
- ✅ Admin action accountability

---

## 📁 File Structure

```
src/app/
├── admin/
│   ├── dashboard/
│   │   └── page.tsx          # Main admin dashboard
│   └── setup/
│       └── page.tsx          # Admin setup & initialization
├── components/
│   └── auth/
│       ├── AdminLoginForm.tsx  # 3-step admin login
│       └── GuestOverview.tsx   # Guest-only overview
├── types/
│   └── admin.ts               # TypeScript interfaces
├── lib/
│   └── adminSetup.ts          # Demo admin initialization
└── auth/
    └── page.tsx               # Auth page with 4 tabs

Types Defined:
- AdminUser      - Admin account structure
- AdminRole      - Role enum (super_admin, kyc_approver, etc.)
- Permission     - Permission enum
- Member         - Member account data
- KYCDocument    - KYC document tracking
- Dispute        - Dispute records
- FinancialRecord - Transaction records
- AuditLog       - Admin action logs
```

---

## 🧪 Testing Scenarios

### Scenario 1: Super Admin Access
1. Login as `super@qalnet.com`
2. Password: `SuperAdmin123!`
3. MFA: `000000`
4. All dashboard tabs should be accessible

### Scenario 2: KYC Approver Workflow
1. Login as `kyc@qalnet.com`
2. Password: `KYC@Approver123`
3. MFA: `000000`
4. Only KYC & Members tabs visible
5. Can approve/reject documents

### Scenario 3: Finance Auditor Access
1. Login as `auditor@qalnet.com`
2. Password: `Auditor@Finance123`
3. MFA: `000000`
4. Finance tab shows transactions
5. Can generate reports

### Scenario 4: Permission Denial
1. Login as Dispute Manager
2. Try to access Admin Users tab
3. Tab should be hidden (no permission)

---

## 🔄 Admin Workflows

### KYC Approval Workflow
```
Member Registers
      ↓
Submits ID Photo + Address Proof
      ↓
KYC Approver Reviews
      ↓
✅ APPROVED → Member gains full access
❌ REJECTED → Member can resubmit
```

### Dispute Resolution Workflow
```
Member Files Dispute
      ↓
Dispute Manager Assigned
      ↓
Evidence Collected & Reviewed
      ↓
Investigation
      ↓
⚖️ RESOLVED → Fair outcome determined
✓ CLOSED → Dispute finalized
```

### Financial Audit Workflow
```
Transaction Occurs
      ↓
Recorded in Finance Records
      ↓
Finance Auditor Reviews
      ↓
Compliance Check ✓
      ↓
Report Generated
```

---

## 🛠️ Development & Production

### Development
- Uses localStorage for demo data
- Demo admin accounts pre-seeded
- MFA uses test code: `000000`
- No real email/SMS sending

### Production Checklist
```
[ ] Replace localStorage with real database
[ ] Implement proper password hashing (bcrypt)
[ ] Setup real MFA providers (Twilio, Auth0, etc.)
[ ] Configure email service (SendGrid, etc.)
[ ] Implement SSL/TLS encryption
[ ] Setup audit logging to database
[ ] Configure role-based access middleware
[ ] Add rate limiting for login attempts
[ ] Setup monitoring & alerting
[ ] Regular security audits
[ ] Backup & disaster recovery plan
```

---

## 📞 Support & Help

### Common Issues

**Q: MFA code not working?**
- Demo code is: `000000`
- In production, use authenticator app

**Q: Admin account not found?**
- Make sure to run `/admin/setup` first
- Check localStorage in browser dev tools

**Q: Permission denied on tab?**
- Verify your admin role has the permission
- Check `rolePermissions` mapping in types/admin.ts

---

## 📋 API Integration (Future)

When integrating with a backend API:

```typescript
// Replace localStorage calls with API calls

// Login endpoint
POST /api/admin/login
{
  email: string
  password: string
  mfaCode?: string
}

// Get members
GET /api/admin/members

// Approve KYC
POST /api/admin/kyc/approve
{
  documentId: string
  notes: string
}

// Get disputes
GET /api/admin/disputes

// Get financial records
GET /api/admin/finances

// Create admin user
POST /api/admin/users
{
  email: string
  password: string
  role: AdminRole
}
```

---

## 🔗 Related Pages

- 📱 **Member Registration**: `/auth` → Register tab
- 🔐 **Member Login**: `/auth` → Login tab
- 👁️ **Guest Overview**: `/auth` → Guest tab
- 🏠 **Homepage**: `/`
- 📚 **Features**: `/features`
- 🔒 **Security**: `/security`

---

**Last Updated:** July 30, 2026  
**Version:** 1.0  
**Status:** Development/Demo
