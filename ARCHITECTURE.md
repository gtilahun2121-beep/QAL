# QalNet Frontend Architecture Documentation

## Overview

This document describes the updated QalNet frontend architecture, fully aligned with the enterprise system specification. The frontend is built with Next.js, React, and TypeScript, following modern best practices for security, accessibility, and performance.

## Project Structure

```
src/
├── app/
│   ├── components/           # React UI Components
│   │   ├── layout/          # Layout components (Navigation, Drawers)
│   │   ├── equb/            # Equb pool components
│   │   ├── payment/         # Payment flow components
│   │   ├── notifications/   # Notification components
│   │   └── index.ts         # Component exports
│   ├── config/              # Configuration & Constants
│   │   ├── environment.ts   # Environment configuration & feature flags
│   │   └── constants.ts     # Application constants
│   ├── services/            # Business Logic & API Integration
│   │   ├── api.ts           # API service layer with typed contracts
│   │   ├── auth.ts          # Authentication, JWT, RBAC, Security
│   │   └── notifications.ts # Notification & Messaging services
│   ├── data.ts              # Type definitions & mock data
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
```

## Data Models & Types

All data models are defined in `src/app/data.ts` and match the backend Postgres schema:

### Core User Types
- `User` - User profile and authentication
- `AuthToken` - JWT token information
- `AuthCredentials` - Login credentials

### Financial Types
- `Wallet` - User wallet with ETB balance
- `CreditScore` - Trust score and tier (300-850 range)
- `Payment` - Payment records with fee tracking
- `Payout` - Payout distribution records
- `PayoutBatch` - Batched micro-transfers for NBE limits

### Equb Pool Types
- `EqubGroup` - Pool configuration and status
- `Membership` - User membership in pools
- `SocialProposal` - Community proposals
- `SocialVote` - Democratic voting on proposals

### Compliance & Support Types
- `ReconciliationTicket` - Support tickets
- `CrbBlacklist` - Credit Reference Bureau blacklist
- `Notification` - Multi-channel notifications
- `UssdSession` - USSD feature phone sessions

## Services Layer

### API Service (`services/api.ts`)

Complete typed API integration with the backend:

```typescript
// Authentication
authService.login()
authService.verifyOtp()
authService.getCurrentUser()
authService.refreshToken()

// Wallet Management
walletService.getWallet()
walletService.linkBankAccount()
walletService.getTransactionHistory()

// Equb Pools
equbService.getActiveEqubs()
equbService.getDiscoverEqubs()
equbService.createEqub()
equbService.joinEqub()

// Payments
paymentService.initiatePayment()
paymentService.confirmPayment()
paymentService.setupAutoDebit()

// Payouts & Lottery
payoutService.getPayouts()
payoutService.placeBid()
payoutService.tradeWinningSlot()

// Support & Reconciliation
supportService.createTicket()
supportService.reconcilePayment()

// Social & Governance
socialService.getProposals()
socialService.createProposal()
socialService.voteOnProposal()
```

### Authentication Service (`services/auth.ts`)

Comprehensive security implementation:

#### JWT Token Management
- `JwtService.decode()` - Client-side JWT decoding
- `JwtService.isExpired()` - Token expiry validation
- `JwtService.getExpiresIn()` - Time until expiry

#### Auth State Management
- `AuthManager` - Singleton for authentication state
- Session restoration from localStorage
- Token refresh handling

#### Role-Based Access Control (RBAC)
- `RBAC.canPerform()` - Check user permissions
- `RBAC.getPermissions()` - Get role permissions
- Roles: participant, host, admin, system_auditor

#### Security Utilities
- `EncryptionService` - Base64 encoding, device token generation
- `RateLimiter` - Brute force prevention (5 attempts / 5 minutes for login)
- `SessionValidator` - Phone/email/password validation

### Notification Service (`services/notifications.ts`)

Multi-channel notification system:

#### Notification Types
- **Operational Alerts**: Payment deadlines, auto-debit triggers, receipts
- **Social & Trust Alerts**: Guarantor requests, trust score updates
- **System & Policy Alerts**: ToS updates, maintenance notices

#### Delivery Channels
- Telegram Bot (primary)
- SMS Gateway (fallback)
- Push Notifications
- In-App Toasts

#### Components
- `NotificationManager` - Server-Sent Events (SSE) stream management
- `ToastManager` - In-app toast notifications
- `TelegramBotService` - Telegram integration
- `SmsService` - SMS delivery coordination
- `UssdService` - USSD feature phone support

## Configuration & Feature Flags

### Environment Configuration (`config/environment.ts`)

Supports three environments with different feature sets:

```typescript
// Development - All features enabled
EnvironmentFactory.getConfig() // Returns development config

// Staging - Beta features enabled
NODE_ENV=staging // Returns staging config

// Production - Conservative feature set
NODE_ENV=production // Returns production config
```

**Feature Flags:**
- `enableAutoDebit` - Automatic payment collection
- `enableAuctionBidding` - Bidding mechanism
- `enableSecondaryMarket` - Win selling (slot trading)
- `enableSnbl` - Save Now Buy Later redemptions
- `enableSocialProposals` - Community governance
- `enableMultiSig` - Multi-signature approvals for high-value payouts
- `enableTelegramIntegration` - Telegram bot integration
- `enableUssdAccess` - Feature phone access
- `enableOfflineMode` - Local caching and sync
- `enableA11y` - Accessibility features
- `enableBiometricAuth` - Biometric authentication
- `enableRtlLayout` - Right-to-left layout for Amharic/Tigrinya

### Application Constants (`config/constants.ts`)

Centralized constants organized by category:

```typescript
// Financial
FINANCIAL.PLATFORM_SERVICE_FEE_PERCENT = 0.1%
FINANCIAL.PLATFORM_ADMIN_FEE_PERCENT = 0.08%
FINANCIAL.PLATFORM_HOST_COMMISSION_PERCENT = 0.02%
FINANCIAL.NBE_DAILY_LIMIT = 75,000 ETB
FINANCIAL.MULTI_SIG_THRESHOLD = 1,000,000 ETB

// Time
TIME.GRACE_PERIOD_SHORT = 12 hours
TIME.GRACE_PERIOD_LONG = 24 hours
TIME.NOTIFICATION_BEFORE_DEADLINE_24H
TIME.NOTIFICATION_BEFORE_DEADLINE_6H
TIME.NOTIFICATION_BEFORE_AUTO_DEBIT_30M

// Penalties
PENALTIES.BASE_PENALTY_PERCENT = 1%
PENALTIES.TIME_DAMPING_FACTOR = 12

// UI
UI.COLORS - Brand colors (emerald green primary)
UI.SPACING - Consistent spacing scale
UI.TYPOGRAPHY - Font sizes

// Localization
LOCALIZATION.SUPPORTED_LANGUAGES = en, am, om, ti
LOCALIZATION.RTL_LANGUAGES = am, ti
LOCALIZATION.TEXT_EXPANSION_FACTOR - Handle text overflow in different languages

// Validation
VALIDATION.PHONE_NUMBER_REGEX
VALIDATION.PASSWORD_MIN_LENGTH = 8
VALIDATION.EQUB_NAME_MIN/MAX_LENGTH
```

## React Components

### Layout Components

#### `BottomNavigation`
Primary navigation for mobile devices:
- My Equbs (Active pools)
- Discover (Browse pools)
- Calendar (Payment deadlines)
- Wallet (Balance & history)
- More (Settings & support)

```typescript
<BottomNavigation
  activeTab="my_equbs"
  onTabChange={(tab) => setActiveTab(tab)}
  language="en"
  notificationCount={3}
/>
```

#### `ProfileDrawer`
Slide-out user profile drawer with sections:
- Account Details & Trust Badges
- Wallet Balance & Linked Accounts
- Credit Score & Payment History
- Support & Documentation
- Logout

```typescript
<ProfileDrawer
  isOpen={isDrawerOpen}
  onClose={() => setDrawerOpen(false)}
  user={currentUser}
  wallet={userWallet}
  creditScore={creditData}
  language="en"
  onLogout={handleLogout}
  onViewHistory={handleViewHistory}
  onRequestSupport={handleSupport}
/>
```

### Equb Components

#### `EqubCard`
Displays equb pool information with progress and actions:
- Host reputation with star ratings
- Pool details (contribution, cycle, members)
- Progress bar for membership capacity
- Unpaid rounds warning
- Next deadline
- Payout mechanism (Auction/Lottery)
- Auto-debit status
- Action buttons (Pay, Bid, View Details)

```typescript
<EqubCard
  equb={poolData}
  language="en"
  onViewDetails={handleViewDetails}
  onPayNow={handlePayment}
  onPlaceBid={handleBid}
  variant="active" // or "discover", "compact"
/>
```

### Payment Components

#### `PaymentFlow`
Multi-step payment modal:
1. Method Selection (Wallet, Telebirr, CBE)
2. Gateway Redirect (External payment processing)
3. Confirmation (Success state)
4. Error Handling (Retry flow)

```typescript
<PaymentFlow
  equbId="pool-123"
  roundNumber={8}
  amount={5000}
  onSuccess={handlePaymentSuccess}
  onCancel={handleCancel}
  language="en"
/>
```

### Notification Components

#### `ToastContainer`
Displays toast notifications from ToastManager:
- Success (Green)
- Error (Red)
- Warning (Yellow)
- Info (Blue)

```typescript
<ToastContainer toastManager={toastManagerInstance} />

// Usage:
toastManager.success("Payment confirmed!");
toastManager.error("Failed to join pool", "Try again");
```

## API Contracts

All API endpoints follow REST conventions with typed responses:

### Authentication Endpoints
```
POST /auth/register
POST /auth/login
POST /auth/verify-otp
POST /auth/request-otp
GET  /auth/me
POST /auth/refresh
POST /auth/logout
```

### Equb Pool Endpoints
```
GET  /equbs/active
GET  /equbs/discover
GET  /equbs/:equbId
POST /equbs
POST /equbs/:equbId/join
POST /equbs/:equbId/leave
GET  /equbs/:equbId/members
GET  /equbs/participation-ledger
```

### Payment Endpoints
```
POST /payments/initiate
POST /payments/confirm
POST /payments/setup-auto-debit
GET  /payments
GET  /payments/:paymentId
POST /payments/webhook
```

### Notification Endpoints
```
GET  /notifications
POST /notifications/:notificationId/read
POST /notifications/read-all
DELETE /notifications/:notificationId
GET  /notifications/stream (Server-Sent Events)
```

## Security Implementation

### Authentication Flow
1. User enters phone number
2. OTP sent via SMS
3. Verify OTP → Receive JWT token
4. JWT stored in localStorage
5. Token included in all API requests
6. Token refresh before expiry (5-minute buffer)

### Rate Limiting
- Login: 5 attempts per 5 minutes
- OTP: 3 attempts per 10 minutes
- API: 100 requests per minute (enforced by Kong gateway)

### Data Protection
- Sensitive data encrypted server-side with pgcrypto
- Client-side state managed through secure AuthManager
- No secrets in localStorage
- HTTPS-only API communication

### Role-Based Access Control
```typescript
// Example permission check
if (RBAC.canPerform(userRole, 'create_equb')) {
  // Show create button
}

// Get all permissions for a role
const hostPermissions = RBAC.getPermissions('host');
```

## Internationalization (i18n)

Supported languages:
- English (en)
- Amharic (am) - RTL, 35% text expansion
- Afaan Oromoo (om) - 20% text expansion
- Tigrinya (ti) - RTL, 30% text expansion

### Translation System
```typescript
// data.ts contains all translations
translations.my_equbs['en'] = "My Equbs"
translations.my_equbs['am'] = "የእኔ እቁቦች"

// Usage in components
<span>{translations.pay_now[language]}</span>
```

### RTL Layout Support
```typescript
// Dynamically applied based on language
if (LOCALIZATION.RTL_LANGUAGES.includes(language)) {
  // Apply RTL styles
}
```

## Offline & Low-Bandwidth Support

### Offline Mode
- Local SQLite/WatermelonDB caching
- Queue transactions for sync when online
- Show cached data while offline

### USSD Integration
- Feature phone dial-in (*808#)
- Text-based menu navigation
- SMS fallback for confirmations
- Sync with main database

### Low-Bandwidth Optimization
- SVG canvas for lottery animations (small file size)
- Lazy-loaded images
- Compressed API responses
- Server-Sent Events for real-time updates

## Accessibility (WCAG 2.1 AA)

### Compliance
- Semantic HTML elements
- Proper ARIA labels and roles
- Keyboard navigation support
- 4.5:1 minimum color contrast
- Touch targets minimum 48px
- Focus indicators (2px outline)

### Font Scaling
- Relative units (rem, em) instead of pixels
- Support up to 200% zoom
- Text re-flows properly

### Motion
- Respects `prefers-reduced-motion` setting
- Reduces animations for users with motion sensitivity

## Performance Optimization

### Metrics
- Static pages: <1.5 seconds load time
- API transactions: <500ms
- Canvas animations: <100ms on mobile

### Techniques
- Code splitting with dynamic imports
- Image optimization with Next.js Image component
- Lazy loading for below-the-fold content
- Request deduplication
- Response caching with SWR

## Error Handling

### Error Codes
```typescript
ERR_AUTH_001 - Invalid credentials
ERR_AUTH_004 - Session expired
ERR_PAY_001 - Insufficient balance
ERR_PAY_003 - Payment timeout
ERR_PAY_004 - Double payment detected
ERR_EQUB_001 - Equb not found
ERR_EQUB_002 - Equb is full
```

### User-Friendly Messages
All errors translated and displayed with actionable guidance

## Development Workflow

### Setting Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_CHAPA_API_KEY=test_key
NEXT_PUBLIC_TELEBIRR_API_KEY=test_key
NEXT_PUBLIC_FAYDA_CLIENT_ID=test_id
```

### Running Development Server
```bash
npm run dev
# or
yarn dev
```

### Building for Production
```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Testing

### Unit Tests
- Component tests with React Testing Library
- Service tests with Jest
- Type checking with TypeScript

### Integration Tests
- API integration with mock server
- Authentication flow
- Payment processing flow

### E2E Tests
- User journey tests with Playwright/Cypress
- Critical path validation

## Deployment

### CI/CD Pipeline
1. Feature branch → Pull Request
2. Automated tests run
3. Type checking with TypeScript
4. ESLint validation
5. Build verification
6. Merge to main → Production deployment

### Environments
- **Development**: Auto-deployed from dev branch
- **Staging**: Auto-deployed from staging branch
- **Production**: Manual approval for main branch

## Next Steps & Roadmap

### Phase 1 (Current)
- ✅ Type definitions and data models
- ✅ API service layer
- ✅ Authentication & security
- ✅ Basic UI components
- ⬜ Page-level components and layout

### Phase 2
- Equb discovery and creation flows
- Payment and bidding interface
- Social proposals and voting UI
- User profile customization

### Phase 3
- Telegram bot integration UI
- USSD menu builder
- Advanced analytics dashboard
- Host control panel

### Phase 4
- Offline mode with local caching
- Biometric authentication
- Advanced search and filtering
- In-kind SNBL redemption catalog

## References

- [QalNet Enterprise System Architecture Specification](./ARCHITECTURE_SPEC.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
