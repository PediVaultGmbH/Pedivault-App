# PediVault 🌸

> Secure, blockchain-verified child health records for European families.

**Live App:** https://pedi-vault.netlify.app
**Backend API:** https://pedivault-app-production.up.railway.app
**GitHub:** https://github.com/PediVaultGmbH/Pedivault-App

---

## Overview

PediVault is a full-stack health records platform that allows parents to digitally manage their children's medical history. Built with GDPR compliance, blockchain immutability, and AI assistance at its core.

Parents can track vaccinations, growth milestones, medications, appointments, and medical records — all secured with end-to-end encryption, stored optionally on IPFS, and audited on the Polygon blockchain.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React CRA, custom CSS design system |
| Backend | Node.js, Express.js |
| Database | PostgreSQL via Prisma ORM v5.22 |
| Authentication | JWT + Refresh Tokens, Twilio SMS OTP |
| Blockchain | Solidity, Hardhat, Polygon Amoy Testnet |
| Decentralized Storage | Pinata IPFS (@pinata/sdk) |
| AI Assistant | Google Gemini 2.5 Flash (@google/genai) |
| Payments | Stripe (monthly + annual plans) |
| Frontend Hosting | Netlify |
| Backend Hosting | Railway |

---

## Features

### 🔐 Authentication
- Email + password registration
- Real SMS OTP verification via Twilio
- JWT access tokens (15min) + refresh tokens (30 days)
- Session management with device tracking
- Password change and account deletion

### 👶 Children Management
- Add multiple children with full profile
- Date of birth, gender, photo
- Per-child health dashboard

### 💉 Vaccinations
- STIKO vaccine schedule (German standard)
- Track administered doses with dates
- Issue on-chain vaccine certificates (Polygon Amoy)
- Certificate tx hash stored and verifiable

### 📈 Growth Tracking
- Height, weight, head circumference logs
- WHO growth chart visualization
- Historical trend tracking

### 📋 Medical Records
- Upload documents and reports
- IPFS storage via Pinata
- Blockchain verification hash per record
- IPFS badge display in UI

### 💊 Medications
- Track active and past medications
- Dosage, frequency, start/end dates

### 📅 Appointments
- Schedule and track doctor visits
- Notes and follow-up tracking

### 🔗 Blockchain Audit Trail
- Every action logged to Polygon Amoy
- Audit log viewable in Profile → Audit Trail tab
- 4 smart contracts: Records, Vaccine, Audit, Access

### 🤖 AI Health Assistant
- Powered by Google Gemini 2.5 Flash
- Answers parenting and health questions
- Context-aware responses

### 💳 Payments
- Stripe integration
- Monthly and annual subscription plans
- Webhook handling for subscription lifecycle

### 🌍 Internationalisation
- Custom country picker with 90+ countries
- Phone number country code selection
- Searchable dropdown

---

## Smart Contracts (Polygon Amoy Testnet)

| Contract | Address |
|---|---|
| Records | ****** |
| Vaccine | ******  |
| Audit | ******  |
| Access | ******  |

> ⚠️ Testnet only. Wallet requires POL tokens for gas. Get from https://faucet.polygon.technology

---

## Project Structure
pedivault Final/                    # React frontend
├── public/
└── src/
├── api/                        # API call functions
├── components/
│   ├── auth/                   # Auth flow
│   │   ├── screens/            # SignIn, CreateAccount, OTP, Forgot
│   │   ├── panels/             # Desktop side panels
│   │   └── ui/                 # Brand, Background, MobileHeader
│   └── dashboard/
│       └── modules/            # All dashboard feature modules
├── styles/
│   └── auth.css                # Full auth UI design system
└── utils/
└── passwordStrength.js
pedivault-backend/                  # Node.js backend
├── src/
│   ├── controllers/                # Request handlers
│   ├── middleware/                 # Auth, error handling
│   ├── routes/                     # Express routes
│   └── services/
│       ├── blockchain.service.js   # Polygon interactions
│       ├── ipfs.service.js         # Pinata IPFS
│       ├── ai.service.js           # Gemini AI
│       └── twilio.service.js       # SMS OTP
├── prisma/
│   └── schema.prisma
└── app.js

---

## Database Schema

Key models: `User`, `Child`, `Vaccine`, `GrowthRecord`, `Medication`, `Appointment`, `MedicalRecord`, `Session`, `AuditLog`

Run migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

---

## Environment Variables

### Railway (Backend)

```env
DATABASE_URL= *****
JWT_SECRET= ******
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET= ******
REFRESH_TOKEN_EXPIRES_IN=30d
FRONTEND_URL=https://pedi-vault.netlify.app
STRIPE_SECRET_KEY= ******
STRIPE_PRICE_MONTHLY= ******
STRIPE_PRICE_ANNUAL= ******
BLOCKCHAIN_PRIVATE_KEY= ******
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
RECORDS_CONTRACT= ******
VACCINE_CONTRACT= ******
AUDIT_CONTRACT= ******
ACCESS_CONTRACT= ******
PINATA_API_KEY= ******
PINATA_SECRET_KEY= ******
GEMINI_API_KEY= ******
TWILIO_ACCOUNT_SID= ******
TWILIO_AUTH_TOKEN= ******
TWILIO_PHONE_NUMBER= ******
```

### Netlify (Frontend)

```env
REACT_APP_API_URL=https://pedivault-app-production.up.railway.app/api
REACT_APP_STRIPE_PUBLISHABLE_KEY= ******
REACT_APP_AUDIT_CONTRACT= ******
REACT_APP_VACCINE_CONTRACT= ******
GEMINI_API_KEY= ******
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
# Runs on http://localhost:5000
```

---

## Known Limitations

- Blockchain wallet requires POL tokens for gas fees. `addRecord`, `logAction`, and `issueCertificate` will fail silently if wallet balance is low.
- IPFS upload works independently of blockchain — records are stored on IPFS even if blockchain tx fails.
- Gemini AI uses `gemini-2.5-flash` model via `@google/genai` SDK.

---

## Compliance & Security

- All health data encrypted per **GDPR (EU) 2016/679**
- Blockchain audit trail ensures tamper-proof record history
- JWT tokens with short expiry + refresh token rotation
- SMS OTP for registration verification
- Session invalidation on password change
