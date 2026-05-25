# PediVault 🌸

> Secure, blockchain-verified child health records for European families.

**Live App:** https://pedi-vault.netlify.app
**Backend API:** https://pedivault-app-production.up.railway.app
**GitHub:** https://github.com/PediVaultGmbH/Pedivault-App

---

## Overview

PediVault is a production-ready full-stack health records platform for parents to digitally manage their children's medical history. Built with GDPR compliance, blockchain immutability, AI assistance, and real-time SMS notifications at its core.

Parents can track vaccinations, growth milestones, medications, appointments, and medical records — all secured with JWT authentication, two-factor authentication, stored on IPFS, audited on the Polygon blockchain, and shareable as a PDF health summary with their doctor.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React CRA, custom CSS design system |
| Backend | Node.js, Express.js |
| Database | PostgreSQL via Prisma ORM v5.22 |
| Authentication | JWT + Refresh Tokens, TOTP 2FA, Twilio SMS OTP |
| Email | Resend API |
| SMS | Twilio |
| Blockchain | Solidity, Hardhat, Polygon Amoy Testnet |
| Decentralized Storage | Pinata IPFS |
| AI Assistant | Google Gemini 2.5 Flash |
| Payments | Stripe (monthly + annual plans) |
| Scheduled Jobs | cron-job.org |
| Frontend Hosting | Netlify |
| Backend Hosting | Railway |

---

## Features

### 🔐 Authentication & Security
- Email + password registration with SMS OTP verification
- Real TOTP 2FA (Google Authenticator / Authy)
- 2FA enforced on login — dedicated verification screen
- Password reset via email (Resend API)
- JWT access tokens (15min) + refresh tokens (1d / 30d)
- Remember Me toggle (1 day or 30 days)
- Session management with device detection
- Revoke all other sessions
- Change password + account deletion

### 👶 Children Management
- Add multiple children with full profile
- Date of birth, gender, blood type, allergies, conditions
- Per-child health dashboard
- Onboarding screen for first-time users
- Remove child with confirmation

### 💉 Vaccinations
- Full STIKO 2026 German immunisation schedule
- Track administered doses with dates, doctor, batch number
- Overdue / Due Soon / Upcoming status per dose
- Issue on-chain vaccine certificates (Polygon Amoy)
- Certificate tx hash stored and verifiable on Polygonscan
- Low POL wallet warning banner

### 📈 Growth Tracking
- Height, weight, head circumference logs
- SVG growth chart with WHO percentile bands (3rd, 50th, 97th)
- Trend indicators between measurements
- BMI calculation with status
- Measurement history table

### 📋 Medical Records
- Upload documents and reports
- IPFS storage via Pinata
- Blockchain verification per record

### 💊 Medications
- Track active and past medications
- Dosage, frequency, prescriber, start/end dates
- Mark as completed

### 📅 Appointments
- Schedule and track doctor visits
- Type, doctor, clinic, date, time, notes
- Cancel appointments

### 🖨️ Share with Doctor
- Generate a branded health summary PDF
- Includes child info, latest measurements, vaccine history, active medications
- Print or Save as PDF via browser

### 🔔 Notifications
- SMS notifications via Twilio
- Notification preferences saved per user (DB persisted)
- Test SMS button in account settings
- Daily appointment reminders (cron at 8am UTC)
- Daily medication reminders (cron at 8am UTC)
- Weekly health summary every Sunday at 9am UTC
- Respects user notification preferences

### 🔗 Blockchain Audit Trail
- Every action logged to Polygon Amoy
- Audit log viewable in Profile → Audit Trail tab
- 4 smart contracts: Records, Vaccine, Audit, Access

### 🤖 AI Health Assistant
- Powered by Google Gemini 2.5 Flash
- Context-aware with child's health data
- Answers parenting and health questions

### 💳 Billing
- Stripe integration (monthly €4.99 / annual €44.99)
- Real subscription status from Stripe
- Cancel subscription (access until period end)
- Webhook handling for subscription lifecycle

### 👤 Account Management
- Edit profile (name, phone)
- Change password (invalidates all sessions)
- Enable/disable TOTP 2FA with QR code
- Notification preferences
- Active sessions with device icons
- Delete account (permanent, with confirmation)

---

## Smart Contracts (Polygon Amoy Testnet)

| Contract | Address |
|---|---|
| Records | 0xfE9FB08bB9f0591cB2D5646FB8f464E9AA81F92C |
| Vaccine | 0xB9A1FceE143AbeFF003787bd5A68139CA5df6c5E |
| Audit | 0x837fcEFAeF5c948386F1cd687B28ceE2a4161e9b |
| Access | 0xA25a8881E8C9F5419Bb12E4b96dE0231Bc36707E |

> ⚠️ Testnet only. Wallet requires POL tokens for gas. Get from https://faucet.polygon.technology

---

## Scheduled Jobs (cron-job.org)

| Job | Schedule | Endpoint |
|---|---|---|
| Appointment Reminders | Daily 8:00 AM UTC | POST /api/cron/reminders |
| Medication Reminders | Daily 8:00 AM UTC | POST /api/cron/reminders |
| Weekly Summary | Sundays 9:00 AM UTC | POST /api/cron/weekly-summary |

Protected with `x-cron-secret` header.

---

## Project Structure

```
pedivault Final/                    # React frontend
├── public/
└── src/
    ├── api/                        # API call functions
    ├── components/
    │   ├── auth/                   # Auth flow
    │   │   ├── screens/            # SignIn, CreateAccount, OTP, Forgot, ResetPassword
    │   │   ├── panels/             # Desktop side panels
    │   │   └── ui/                 # Brand, Background, MobileHeader
    │   └── dashboard/
    │       ├── modals/             # All modal components + HealthSummaryModal
    │       └── modules/            # All dashboard feature modules
    ├── styles/
    │   ├── auth.css                # Auth UI design system
    │   └── dashboard.css           # Dashboard design system
    └── utils/

pedivault-backend/                  # Node.js backend
├── src/
│   ├── controllers/                # Request handlers
│   ├── middleware/                 # Auth, error handling
│   ├── routes/                     # Express routes
│   │   ├── auth.routes.js          # Auth + 2FA + notifications
│   │   ├── cron.routes.js          # Scheduled reminder jobs
│   │   └── notifications.routes.js # Test SMS endpoint
│   └── services/
│       ├── blockchain.service.js   # Polygon interactions
│       ├── blockchain.routes.js    # Blockchain API + balance check
│       ├── ipfs.service.js         # Pinata IPFS
│       ├── ai.service.js           # Gemini AI
│       ├── sms.service.js          # Twilio SMS notifications
│       └── email.service.js        # Resend password reset email
├── prisma/
│   └── schema.prisma
└── app.js
```

## Environment Variables

### Railway (Backend)

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN=30d
FRONTEND_URL=https://pedi-vault.netlify.app
RESEND_API_KEY=
EMAIL_FROM=PediVault <onboarding@resend.dev>
STRIPE_SECRET_KEY=
STRIPE_PRICE_MONTHLY=
STRIPE_PRICE_ANNUAL=
BLOCKCHAIN_PRIVATE_KEY=
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
RECORDS_CONTRACT=
VACCINE_CONTRACT=
AUDIT_CONTRACT=
ACCESS_CONTRACT=
PINATA_API_KEY=
PINATA_SECRET_KEY=
GEMINI_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
CRON_SECRET=
```

### Netlify (Frontend)

```env
REACT_APP_API_URL=https://pedivault-app-production.up.railway.app/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=
REACT_APP_AUDIT_CONTRACT=
REACT_APP_VACCINE_CONTRACT=
```

---

## Development

```bash
# Frontend
cd "pedivault Final"
npm install
npm start
# Runs on http://localhost:3000

# Backend
cd pedivault-backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
# Runs on http://localhost:8080
```

---

## Testing Cron Jobs Manually

```bash
# Appointment + medication reminders
curl -X POST https://pedivault-app-production.up.railway.app/api/cron/reminders \
  -H "x-cron-secret: your_cron_secret"

# Weekly health summary
curl -X POST https://pedivault-app-production.up.railway.app/api/cron/weekly-summary \
  -H "x-cron-secret: your_cron_secret"
```

---

## Known Limitations

- Blockchain wallet requires POL tokens for gas fees. Certificate issuance fails silently if balance is low — a warning banner appears in the Vaccines tab.
- Resend free tier sends only to the account's registered email. Verify `pedivault.de` domain for production sending.
- Twilio trial account can only send to verified phone numbers.
- Polygon Amoy is a testnet — switch to Polygon mainnet for production.

---

## Compliance & Security

- All health data encrypted per **GDPR (EU) 2016/679**
- Blockchain audit trail ensures tamper-proof record history
- JWT tokens with short expiry + refresh token rotation
- TOTP two-factor authentication
- SMS OTP for registration verification
- Session invalidation on password change
- Email enumeration protection on forgot password
