# QaINet — Professional Dashboard Design Specification

**Document:** `DESIGN_SPEC.md`  
**Purpose:** Source-of-truth UI/UX specification for redesigning the QaINet dashboard and account interfaces.

---

## 1. Objective

Redesign QaINet — Ethiopia's Digital Equb — into a professional, modern fintech-style web application.

The redesign must improve:

- Information hierarchy
- Visual consistency
- Responsiveness
- User adaptability
- Navigation
- Account/profile experience
- Equb visibility
- Payment visibility
- Accessibility
- Interaction states

### Critical constraint

**Do not replace or break existing business logic.**

Before implementation:

1. Inspect the existing codebase.
2. Understand the current architecture.
3. Identify reusable components.
4. Identify existing authentication, database, API, Equb, payment, and transaction models.
5. Produce an implementation report.
6. Wait for approval before making structural/destructive changes.

Do not modify the database schema unless explicitly approved.

Do not remove working functionality merely to match the visual design.

---

# 2. Design philosophy

The interface should answer these questions immediately:

1. Who am I?
2. What is my financial position?
3. How much have I saved?
4. Which Equbs am I participating in?
5. When is my next payment?
6. Do I have anything requiring attention?
7. What happened recently?
8. What can I do next?

The dashboard should prioritize information according to the user's current state.

The goal is not simply to make the existing page prettier. The goal is to create a clear, professional, user-adaptive financial dashboard.

---

# 3. Visual direction

Use a modern fintech aesthetic.

### Characteristics

- Clean
- Spacious
- Professional
- Light theme by default
- White cards on a very light neutral background
- Teal as primary brand color
- Purple as secondary accent
- Orange for warnings/upcoming payments
- Green for successful/positive states
- Red only for errors/destructive actions
- Rounded cards
- Subtle borders/shadows
- Strong typography hierarchy
- Consistent icons
- Consistent spacing
- Responsive layout
- Accessible contrast

Avoid:

- Excessive bright colors
- Randomly colored buttons
- Excessive gradients
- Large empty areas
- Unnecessary decoration
- Emoji as the primary icon system
- Inconsistent card sizes
- Inconsistent spacing

---

# 4. Design tokens

Use the project's existing design system if one exists. If it does not, establish reusable tokens rather than hard-coding values throughout components.

## Spacing

Recommended scale:

- 4px
- 8px
- 12px
- 16px
- 24px
- 32px
- 40px
- 48px

## Radius

- Small controls: 8–10px
- Cards: 12–16px
- Inputs: 8–10px
- Pills/status badges: 999px
- Avatars: 50%

## Typography

Prefer an existing project font. If none exists, use a modern UI font such as Inter.

Recommended hierarchy:

- Page title: 28–32px, bold
- Section title: 18–20px, semibold
- Card value: 24–28px, bold
- Body: 14–16px
- Caption: 12–13px

---

# 5. Color semantics

Colors must communicate meaning consistently.

## Primary — Teal

Use for:

- QaINet branding
- Primary buttons
- Active navigation
- Important links
- Primary interactive elements

## Secondary — Purple

Use for:

- Secondary visual elements
- Secondary Equb categories
- Supporting data visualization

## Warning — Orange

Use for:

- Upcoming payments
- Deadlines
- Warnings

## Success — Green

Use for:

- Successful transactions
- Positive financial changes
- Completed operations
- Active states where appropriate

## Danger — Red

Use only for:

- Errors
- Failed payments
- Destructive actions
- Sign out where appropriate

---

# 6. Application shell

Desktop structure:

```text
┌─────────────────────────────────────────────────────────────┐
│                         TOP HEADER                          │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│   SIDEBAR    │              MAIN CONTENT                    │
│              │                                              │
│              │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Desktop

- Persistent left sidebar
- Top header
- Main content area
- Supporting widgets arranged within the content grid
- Avoid excessive unused whitespace

### Tablet

- Collapse or compact the sidebar
- Use a two-column layout where practical
- KPI cards can become 2 × 2

### Mobile

- Hamburger navigation
- Vertically stacked content
- No horizontal scrolling
- Profile menu adapted for mobile
- Optional bottom navigation for the most important actions

---

# 7. Sidebar

The sidebar should contain:

```text
QaINet
Ethiopia's Digital Equb

Dashboard
My Equbs
Payments
Transactions
Members
Notifications
Reports

----------------

Help Center
Settings

----------------

Need Help?
Our support team is ready to help you.

[ Contact Support ]
```

The active navigation item should have:

- Light teal background
- Teal icon
- Teal text
- Rounded container

Inactive navigation should remain neutral.

Use a consistent icon library if the project already has one.

---

# 8. Top header

The top header should contain:

```text
☰
Dashboard
My Equbs
Payments
Transactions
Members
Reports
```

Right side:

```text
[ Search... ]
[ Notifications ]
[ EN ▼ ]
[ Profile Photo ] Dagm ▼
```

Search should be designed to eventually support:

- Equbs
- Transactions
- Payments
- Members

---

# 9. Profile avatar dropdown

Clicking the user's avatar/profile area should open a floating account menu.

Example:

```text
┌────────────────────────────────────┐
│ [Profile Photo]                    │
│                                    │
│ Dagm                               │
│ dagm@example.com                   │
│                                    │
│ ● Active     Member                │
├────────────────────────────────────┤
│ My Profile                         │
│ Account Settings                   │
│ Security & Privacy                 │
│ Notifications                      │
│ Language                       >   │
├────────────────────────────────────┤
│ Help & Support                     │
├────────────────────────────────────┤
│ Sign Out                            │
└────────────────────────────────────┘
```

### Behavior

- White surface
- Rounded corners
- Subtle shadow
- Correct z-index
- Align to avatar
- Close when clicking outside
- Close with Escape
- Keyboard accessible
- Hover state
- Focus state
- Sign Out visually separated

Do not place complex account configuration inside the dropdown. Use dedicated settings pages.

---

# 10. Dashboard welcome section

Display:

```text
Welcome back, Dagm

Here's what's happening with your Equbs today.

                         [ + Join Equb ▼ ]
```

The primary action should use the QaINet primary color.

---

# 11. Financial summary cards

Create four KPI cards.

### Total Balance

```text
Total Balance

ETB 12,500

↑ 8.4%
from last month
```

### Total Saved

```text
Total Saved

ETB 24,500

↑ 12.6%
from last month
```

### Active Equbs

```text
Active Equbs

3

View all your Equbs →
```

### Next Payment

```text
Next Payment

ETB 1,100

Due Aug 15, 2026
```

Each card should have:

- Icon
- Label
- Main value
- Supporting information
- Optional trend/status
- Consistent height
- Consistent padding
- Subtle border or shadow

Do not use four unrelated colors merely for decoration.

---

# 12. Important alerts

Create an actionable alert area.

Example:

```text
Important Alerts

┌────────────────────────────────────┐
│ Payment Due Soon                   │
│                                    │
│ WDR Telebirr Equb payment of       │
│ ETB 1,100 is due on Aug 15.        │
│                                    │
│ Make Payment →                     │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ 2 Pending Payments                 │
│                                    │
│ You have 2 payments pending        │
│ confirmation.                      │
│                                    │
│ View Payments →                    │
└────────────────────────────────────┘
```

Use:

- Subtle red/pink treatment for urgent issues
- Subtle orange treatment for warnings
- Clear action links/buttons

Alerts should only appear when relevant.

---

# 13. My Equbs

This is a primary dashboard section.

Header:

```text
My Equbs                                      View all →
```

Example Equb card:

```text
┌─────────────────────────────────────────────┐
│ [Icon] WDR Telebirr Equb          ● Active │
│        12 Members                          │
│                                             │
│ Contribution            Next Payment        │
│ ETB 1,100              Aug 15, 2026         │
│                                             │
│ Progress                                    │
│ ████████████████████░░░       80%           │
│                                             │
│ [ View Equb ]    [ Make Payment ]           │
└─────────────────────────────────────────────┘
```

Additional examples:

```text
Family Equb
8 Members
ETB 500 contribution
Next payment: Aug 20
Progress: 60%
```

```text
Friends Saving
6 Members
ETB 800 contribution
Next payment: Aug 25
Progress: 40%
```

Equb cards should display, when data exists:

- Equb name
- Status
- Member count
- Contribution amount
- Next payment
- Progress
- Current round
- User position
- Primary action
- Payment action

---

# 14. Equb status

Use semantic status badges:

```text
● Active
● Pending
● Completed
● Suspended
```

Do not rely on color alone; include text.

---

# 15. Quick Actions

Create a compact action section:

```text
Quick Actions

[ Join Equb ]
[ Create Equb ]
[ Make Payment ]
[ Invite Members ]
```

Use:

- Consistent iconography
- Subtle icon backgrounds
- Consistent button dimensions
- Clear hover/focus states

Avoid four large saturated buttons.

---

# 16. Recent Activity

Create:

```text
Recent Activity                         View all →
```

Example:

```text
↓ Deposit Completed
  Telebirr Deposit
  Aug 9, 2026 · 10:45 AM

                         + ETB 10,000
```

```text
↑ Contribution Paid
  WDR Telebirr Equb
  Aug 9, 2026 · 9:30 AM

                         - ETB 1,100
```

```text
Member Joined
Abebe Kebede joined Family Equb
Aug 8, 2026 · 6:15 PM
```

Activity should communicate:

- Event type
- Description
- Date/time
- Amount if applicable
- Status if applicable

Positive and negative amounts must be distinguishable.

---

# 17. Upcoming Payments

Create:

```text
Upcoming Payments                         View calendar →
```

Example:

```text
WDR Telebirr Equb

ETB 1,100
Aug 15, 2026

6 days left
```

```text
Family Equb

ETB 500
Aug 20, 2026

11 days left
```

```text
Friends Saving

ETB 800
Aug 25, 2026

16 days left
```

Use warning/accent treatment for approaching deadlines.

---

# 18. Promotional/help card

Use a secondary card where appropriate:

```text
Save Better
Together

Join or create an Equb and
achieve your financial goals faster.

[ Learn More → ]
```

This must remain secondary to account and payment information.

---

# 19. My Profile page

Selecting My Profile opens a dedicated profile page.

Structure:

```text
Profile

┌──────────────────────┐
│   [Profile Photo]    │
│                      │
│ [ Change Photo ]     │
│                      │
│ ● Active   Member    │
│                      │
│ Member since ...     │
└──────────────────────┘

Personal Information

Full Name
Dagm                         [Edit]

Phone Number
+251 ...                    [Edit]

Email
dagm@example.com            [Edit]

Date of Birth
...                         [Edit]

Address
...                         [Edit]

                         [ Edit Profile ]
```

Use existing user data rather than hard-coded values.

---

# 20. Profile photo

Change-photo interaction should support, where the current stack allows:

- Upload
- Preview
- Crop
- Replace
- Remove
- Save
- Cancel

Example:

```text
Change Profile Photo

[ Current Photo Preview ]

[ Upload Photo ]

Supported:
JPG, PNG, WEBP

Maximum:
5 MB

[ Cancel ] [ Save ]
```

Respect existing upload/storage architecture.

Do not introduce a new storage system without investigation and approval.

---

# 21. Account Settings

Create a settings area with categories:

```text
Account Settings

Personal Information
Notifications
Language & Region
Appearance
Privacy

Security
  Change Password
  Two-Factor Authentication
  Active Sessions

Connected Accounts
```

Right-side content should depend on the selected setting.

Examples:

```text
Personal Information
Update your name, email, phone and profile photo.
```

```text
Notifications
Choose how and when you want to be notified.
```

```text
Language & Region
Select language and regional preferences.
```

```text
Appearance
Choose your preferred theme and display options.
```

```text
Privacy
Manage privacy settings and data preferences.
```

```text
Security
Password, two-factor authentication and active sessions.
```

---

# 22. Adaptive user states

The dashboard must adapt to the user's state.

## New user

Show:

```text
Welcome to QaINet

You haven't joined an Equb yet.

[ Join Your First Equb ]
[ Create an Equb ]
```

Do not show empty "recent activity" sections as the primary experience.

## Active Equb member

Prioritize:

- Active Equbs
- Next payment
- Contribution
- Upcoming deadlines
- Recent activity

## Equb administrator

Prioritize:

- Members
- Collected amount
- Pending payments
- Upcoming draw
- Manage Equb

## User with overdue payment

Prioritize:

```text
Payment Overdue

ETB 1,100

[ Pay Now ]
```

The dashboard should prioritize actions requiring attention.

---

# 23. Responsive layout

## Desktop

Recommended conceptual layout:

```text
Sidebar
    +
Main content

Main:
Welcome
KPI cards
My Equbs
Recent Activity
Quick Actions

Supporting:
Alerts
Upcoming Payments
```

Use CSS Grid/Flexbox or the project's established layout system.

## Tablet

- Compact sidebar
- KPI cards 2 × 2
- Equb cards may become one or two columns
- Supporting widgets can stack

## Mobile

Order content roughly as:

```text
Header
Welcome
Financial Summary
Important Alerts
My Equbs
Upcoming Payments
Recent Activity
Quick Actions
```

No horizontal overflow.

Cards should stack naturally.

---

# 24. Interaction states

Interactive components should support where appropriate:

```text
Default
Hover
Focus
Active
Disabled
Loading
Success
Error
```

Forms need:

- Validation
- Loading state
- Success feedback
- Error feedback

Payments need:

- Review/confirmation
- Processing
- Success
- Failure
- Retry where appropriate

Do not fake payment success.

Use existing backend/API state.

---

# 25. Accessibility

The implementation should follow accessible UI practices:

- Semantic HTML
- Keyboard navigation
- Visible focus indicators
- Appropriate ARIA labels where necessary
- Sufficient color contrast
- Do not communicate state by color alone
- Form labels
- Error messages associated with inputs
- Dialog focus management
- Escape-to-close for dropdowns/dialogs where appropriate

---

# 26. Component architecture

Do not create one enormous dashboard component.

Prefer reusable components such as:

```text
AppShell
├── Sidebar
├── TopHeader
│   ├── Search
│   ├── NotificationMenu
│   └── ProfileMenu
│
Dashboard
├── DashboardHeader
├── FinancialSummary
│   └── SummaryCard
├── ImportantAlerts
│   └── AlertCard
├── MyEqubs
│   └── EqubCard
├── QuickActions
├── RecentActivity
│   └── ActivityItem
├── UpcomingPayments
│   └── PaymentItem
└── HelpCard

Profile
├── ProfileHeader
├── ProfilePhoto
├── PersonalInformation
└── ProfileForm

Settings
├── SettingsNavigation
├── AccountSettings
├── NotificationSettings
├── LanguageSettings
├── AppearanceSettings
├── PrivacySettings
└── SecuritySettings
```

Use the project's actual framework/component conventions after inspection.

Do not blindly create these exact filenames if the existing architecture uses a different convention.

---

# 27. Data-driven implementation

Do not hard-code dashboard data into UI components.

Prefer data structures such as:

```ts
type EqubSummary = {
  id: string
  name: string
  status: 'active' | 'pending' | 'completed' | 'suspended'
  memberCount: number
  contributionAmount: number
  nextPaymentDate?: string
  progress?: number
}
```

Use the actual project's existing types/models when available.

Similarly, activity and payment lists should come from existing application data.

---

# 28. Empty states

Every data-driven section needs a useful empty state.

Example:

```text
No active Equbs yet

Join your first Equb to start saving together.

[ Browse Equbs ]
```

For activity:

```text
No recent activity

Your recent transactions and Equb events will appear here.
```

Empty states should be intentional, not just blank containers.

---

# 29. Loading states

Use skeleton loaders or the project's existing loading system.

Avoid layout jumping.

Example:

```text
┌────────────────────────┐
│ █████████              │
│                        │
│ ██████████████         │
│                        │
│ ██████                 │
└────────────────────────┘
```

Do not display fake financial values while loading.

---

# 30. Error states

Example:

```text
Unable to load your Equbs

Something went wrong while retrieving your Equb information.

[ Try Again ]
```

Errors should be actionable and understandable.

---

# 31. Implementation process

Before modifying code, investigate:

1. Project structure
2. Framework and version
3. Routing
4. Existing dashboard
5. Existing component architecture
6. Existing CSS/design system
7. Existing authentication
8. Existing user/session state
9. Database models
10. Equb models
11. Payment models
12. Transaction models
13. API/server actions
14. Existing responsive implementation
15. Existing tests
16. Existing reusable UI components

Then produce an implementation report containing:

```text
CURRENT STATE
PROBLEM
ROOT CAUSE
PROPOSED SOLUTION
AFFECTED FILES
NEW FILES
REUSABLE FILES
DATABASE IMPACT
API/BACKEND IMPACT
MCP/TOOL REQUIREMENTS
RISKS
VERIFICATION PLAN
IMPLEMENTATION STEPS
```

**Do not modify files or execute destructive commands before approval.**

---

# 32. Verification

After implementation, verify:

### Visual

- Desktop layout
- Tablet layout
- Mobile layout
- Spacing
- Typography
- Colors
- Cards
- Navigation
- Dropdowns
- Profile page
- Settings page

### Functional

- Navigation works
- Profile dropdown works
- Sign out works
- Search works if already supported
- Equb links work
- Payment links work
- Notifications work
- Profile editing works if already supported
- Settings work
- Existing authentication remains functional

### Data

- Real user data is preserved
- Real Equb data is preserved
- Real transaction data is preserved
- No fake financial information is introduced
- No database data is deleted

### Responsive

Test at:

- 1440px+
- 1280px
- 1024px
- 768px
- 480px
- 375px

---

# 33. Final implementation principle

Treat this document as the **textual equivalent of the visual design reference**.

The target is a:

> **Professional, responsive, user-adaptive QaINet financial/Equb dashboard.**

Preserve existing functionality and business logic.

Improve:

- Structure
- Visual hierarchy
- UX
- Responsiveness
- Accessibility
- Component organization
- Account/profile experience

Do not make unnecessary architectural changes.

**Investigate first. Report first. Get approval. Then implement.**
