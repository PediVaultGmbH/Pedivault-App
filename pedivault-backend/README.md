# PediVault Backend API

Node.js + Express + PostgreSQL + Prisma

---

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Environment
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, etc.

# 3. Database
npx prisma migrate dev --name init
npm run db:seed   # optional test data

# 4. Run
npm run dev       # dev (nodemon)
npm start         # production
```

Server starts at **http://localhost:5000**

---

## 📋 API Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account, send OTP |
| POST | `/api/auth/otp/send` | Send OTP to phone |
| POST | `/api/auth/otp/verify` | Verify OTP → returns JWT |
| POST | `/api/auth/otp/resend` | Resend OTP |
| POST | `/api/auth/signin` | Email + password → JWT |
| POST | `/api/auth/refresh` | Rotate refresh token |
| POST | `/api/auth/signout` | Invalidate session |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Set new password |
| GET  | `/api/auth/me` | Get current user 🔒 |

### Children 🔒
| Method | Path |
|---|---|
| GET    | `/api/children` |
| POST   | `/api/children` |
| GET    | `/api/children/:childId` |
| PUT    | `/api/children/:childId` |
| DELETE | `/api/children/:childId` |

### Per-Child Resources 🔒
All prefixed with `/api/children/:childId/`

| Resource | GET | POST | PUT | DELETE |
|---|---|---|---|---|
| `vaccines` | ✓ | ✓ | `/:id` | `/:id` |
| `growth` | ✓ | ✓ | — | `/:id` |
| `records` | ✓ | `POST /upload` | — | `/:id` |
| `appointments` | ✓ | ✓ | `/:id` | `/:id` |
| `medications` | ✓ | ✓ | `/:id` | `/:id` |

### AI 🔒
| Method | Path | Body |
|---|---|---|
| POST | `/api/ai/chat` | `{ messages, systemPrompt? }` |

---

## 🗃️ Database Schema

```
User → Child[] → VaccineRecord[]
                → GrowthEntry[]
                → MedicalRecord[]
                → Appointment[]
                → Medication[]
User → OTP[]
User → Session[]
```

---

## 🔐 Auth Flow

```
Register → OTP sent to phone
         → POST /otp/verify → { token, refreshToken }
         → Store token in localStorage
         → Every request: Authorization: Bearer <token>
         → Token expires (15min) → POST /refresh with refreshToken
         → 401 → redirect to login
```

---

## 🛠️ Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Min 32 chars, random |
| `REFRESH_TOKEN_SECRET` | Min 32 chars, random |
| `TWILIO_*` | SMS OTP (console.log fallback in dev) |
| `SMTP_*` | Password reset emails (console.log fallback in dev) |
| `ANTHROPIC_API_KEY` | AI assistant |
| `FRONTEND_URL` | For CORS + email links |

---

## 📦 Deploy (Railway / Render)

```bash
# Set env vars in dashboard, then:
npm install
npx prisma generate
npx prisma migrate deploy
npm start
```
