# QalNet - Quick Start Guide

## 🚀 Start Both Servers

### Terminal 1 - Frontend (Port 3000)
```bash
cd c:\Qal\QAL
npm run dev
```
Open: **http://localhost:3000**

### Terminal 2 - Backend (Port 3333)
```bash
cd c:\Qal\QalNet-
npm run start:dev
```
Available at: **http://localhost:3333**

---

## 📱 Test the App

### 1. Registration Flow (New User)
- Click **Register** button
- Choose **"Create New Account"**
- Fill in 4 steps:
  1. First Name, Last Name
  2. Phone (+2519XXXXXXXX), Email (@gmail.com)
  3. Fayda Number (16 digits, verify)
  4. OTP (5 digits)
- Click **Sign Up**
- ✅ Redirect to dashboard

### 2. Sign In Flow (Existing User)
- Click **Register** button
- Choose **"I Already Have an Account"**
- Enter Phone (auto-prefilled +2519)
- Enter 4-digit PIN
- Click **Sign In**
- ✅ Redirect to dashboard

### 3. Test Back Navigation
- In any auth screen, click **← Back** to return to choice
- Or click **✕** to close modal

---

## 🔧 Configuration

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
NEXT_PUBLIC_API_VERSION=v1
```

### Backend (.env)
```
PORT=3333
NODE_ENV=development
```

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `src/app/services/api.ts` | API client for backend calls |
| `src/app/context/AuthContext.tsx` | Auth state + API integration |
| `src/app/components/modals/RegisterChoiceModal.tsx` | Choice screen (Sign Up/Sign In) |
| `src/app/components/modals/ChoiceFlow.tsx` | Flow orchestrator |
| `src/app/components/modals/AuthModalTabs/SignUpTab.tsx` | 4-step registration form |
| `src/app/components/modals/AuthModalTabs/SignInTab.tsx` | Phone + PIN sign in |

---

## 🔍 Debug

### View API Calls
1. Open DevTools (F12)
2. Go to "Network" tab
3. Test registration/login
4. Look for requests to `http://localhost:3333/api/v1/...`

### Check LocalStorage
1. Open DevTools (F12)
2. Go to "Application" → "Local Storage"
3. Check:
   - `authToken` - JWT from backend
   - `qalnet_user` - User info
   - `refreshToken` - Refresh token

### Check Console Errors
- Open DevTools → "Console" tab
- Look for any API errors or exceptions

---

## ✅ Build & Test

```bash
# Build frontend
cd c:\Qal\QAL
npm run build

# Run tests (if configured)
npm run test

# Lint code
npm run lint
```

---

## 🛑 Stop Servers

Press **Ctrl + C** in each terminal

---

## 📊 Architecture

```
Frontend (Next.js)         Backend (NestJS)
    ↓                          ↓
http://localhost:3000      http://localhost:3333
         ↓                      ↓
   React Components         Express Server
         ↓                      ↓
    API Service             Auth Routes
         ↓                      ↓
    Fetch/API              Database
```

---

## 🎯 User Flows

### Sign Up
```
Register Button
    ↓
RegisterChoiceModal
    ↓
"Create New Account"
    ↓
SignUpTab (4 steps)
    ↓
POST /api/v1/auth/signup
    ↓
Dashboard
```

### Sign In
```
Register Button
    ↓
RegisterChoiceModal
    ↓
"I Already Have Account"
    ↓
SignInTab (Phone + PIN)
    ↓
POST /api/v1/auth/signin
    ↓
Dashboard
```

---

## 🔐 Security

- JWT tokens stored in localStorage
- Authorization header sent with all API requests
- CORS enabled for localhost
- Input validation on both frontend & backend
- Password/PIN sent as plain-text (use HTTPS in production)

---

## 📝 API Response Format

### Success (200 OK)
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "user_123",
    "firstName": "Abebe",
    "lastName": "Tekle",
    "email": "abebe@example.com",
    "phoneNumber": "+251987654321",
    "role": "member"
  }
}
```

### Error (400/401/500)
```json
{
  "statusCode": 400,
  "message": "Invalid phone number",
  "error": "Bad Request"
}
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | Kill process: `taskkill /PID [pid] /F` |
| Port 3333 in use | Check backend, use different port |
| API not responding | Verify backend is running |
| Build fails | Clear `node_modules` and `.next`, reinstall |
| CORS errors | Check ALLOWED_ORIGINS in backend .env |
| Auth failing | Check token storage in localStorage |

---

**Last Updated**: 2026-08-03
**Status**: ✅ Ready to Test
