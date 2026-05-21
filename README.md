# PediVault — Child Health Records

A beautifully designed React app for tracking children's health records, vaccines, growth, appointments, and medications. Built for expat families in Germany with STIKO 2026 vaccine schedules and multilingual AI assistant.

---

## 📁 Project Structure

```
pedivault/
├── .vscode/
│   ├── extensions.json      # Recommended VS Code extensions
│   ├── launch.json          # Chrome debug configuration
│   └── settings.json        # Editor & formatting settings
│
├── public/
│   ├── index.html
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service worker
│
├── src/
│   ├── api/                 ← Backend service layer (wire up to your API)
│   │   ├── client.js        # Base HTTP client (JWT, 401 handling)
│   │   ├── auth.api.js      # Sign in, register, OTP, forgot password
│   │   ├── children.api.js  # Child profiles CRUD
│   │   ├── vaccines.api.js  # Vaccine records
│   │   ├── growth.api.js    # Growth entries
│   │   ├── records.api.js   # Medical records + file upload
│   │   ├── appointments.api.js
│   │   ├── medications.api.js
│   │   └── ai.api.js        # AI assistant (proxied through your backend)
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx  ← Global JWT auth state
│   │
│   ├── hooks/
│   │   ├── useAuth.js       ← useAuth() shortcut
│   │   ├── useToast.js
│   │   ├── useFormValidation.js
│   │   ├── useLoading.js
│   │   └── useTimer.js
│   │
│   ├── components/
│   │   ├── auth/            ← Auth screens (Sign In, Register, OTP, Forgot)
│   │   └── dashboard/       ← Dashboard modules + layout + modals
│   │
│   ├── data/                ← Local seed data (replace with API calls)
│   ├── utils/               ← Pure utility functions
│   ├── styles/              ← auth.css + dashboard.css
│   ├── App.js
│   └── index.js
│
├── .env.example             ← Copy to .env.local and fill values
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── jsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### 1. Install & Run

```bash
npm install
cp .env.example .env.local   # fill in your values
npm start
```

App opens at **http://localhost:3000**. API calls proxy to **http://localhost:5000**.

### 2. Build for Production

```bash
npm run build
```

---

## 🔌 Backend Integration Guide

### Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ANTHROPIC_API_KEY=sk-ant-...
```

### Dev Proxy

`package.json` includes `"proxy": "http://localhost:5000"`.  
In development, `fetch('/api/...')` automatically forwards to your backend — no CORS issues.

### Auth Flow

1. **Wrap your app** with `<AuthProvider>` in `index.js`:
   ```jsx
   import { AuthProvider } from './contexts/AuthContext';
   root.render(<AuthProvider><App /></AuthProvider>);
   ```

2. **Use the hook** anywhere:
   ```jsx
   const { user, signIn, signOut, loading } = useAuth();
   ```

3. **Token storage**: JWT stored in `localStorage` as `pv_token`.  
   The API client auto-attaches it to every request.

4. **401 handling**: Any 401 from the backend fires a `pv:unauthorised` event  
   which `AuthContext` listens to and clears the session automatically.

### Wiring a Screen to the Real API

Example — Sign In screen (`src/components/auth/screens/SignIn.jsx`):

```js
// Replace the mock login logic with:
import { signIn } from '../../../api/auth.api';

const handleSignIn = async () => {
  try {
    const { token, user } = await signIn({ email, password });
    goTo('dashboard', user.firstName);
  } catch (err) {
    setError(err.message);
  }
};
```

### API Service Files

| File | Endpoints |
|------|-----------|
| `auth.api.js` | signIn, register, sendOTP, verifyOTP, forgotPassword, resetPassword, signOut, getMe |
| `children.api.js` | getChildren, getChild, createChild, updateChild, deleteChild |
| `vaccines.api.js` | getVaccineRecords, logVaccine, updateVaccineRecord, deleteVaccineRecord |
| `growth.api.js` | getGrowthEntries, addGrowthEntry, deleteGrowthEntry |
| `records.api.js` | getRecords, uploadRecord, uploadRecordFile, deleteRecord |
| `appointments.api.js` | getAppointments, bookAppointment, updateAppointment, cancelAppointment |
| `medications.api.js` | getMedications, addMedication, updateMedication, deleteMedication |
| `ai.api.js` | chatWithAI (proxied through your backend — never call Anthropic from frontend) |

---

## 🧑‍💻 VS Code Setup

1. Open: `code .`
2. Install recommended extensions when prompted
3. Format on save is pre-configured via Prettier

### Recommended Extensions (auto-prompted)
- **Prettier** — formatting
- **ESLint** — linting
- **ES7 React Snippets** — `rfce`, shortcuts
- **Auto Rename Tag** — renames JSX closing tags
- **Error Lens** — inline errors
- **GitLens** — git history

---

## 📌 Backend Checklist (Next Steps)

- [ ] `POST /api/auth/register` — create user, send OTP
- [ ] `POST /api/auth/otp/verify` — verify code, return JWT
- [ ] `POST /api/auth/signin` — email+password → JWT
- [ ] `POST /api/auth/forgot-password` — send reset email
- [ ] `GET  /api/auth/me` — return current user from JWT
- [ ] `GET/POST/PUT/DELETE /api/children/:id/*` — all child-scoped resources
- [ ] `POST /api/ai/chat` — proxy to Anthropic (keep API key server-side)
- [ ] File upload endpoint for medical records (S3 / local storage)
- [ ] Push notifications for vaccine reminders (optional)

---

## 🌐 PWA

The app is a Progressive Web App with offline support via `sw.js`.

---

## 🔒 Security Notes

- JWT stored in `localStorage` — consider `httpOnly` cookies for production
- Anthropic API key lives on the backend only (`ai.api.js` calls your backend, not Anthropic directly)
- All health data must be transmitted over HTTPS in production
- GDPR Article 9 applies to health data — ensure your backend has proper data processing agreements
