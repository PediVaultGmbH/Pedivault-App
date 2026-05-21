# PediVault — Netlify Deployment Guide

## 🚀 Deploy in 3 steps

### Option A — Netlify CLI (fastest)

```bash
npm install -g netlify-cli
netlify login
netlify init          # links to your Netlify site
netlify deploy --prod  # deploys to production
```

### Option B — Drag & Drop

1. Run `npm run build` locally
2. Drag the `build/` folder to **https://app.netlify.com/drop**

### Option C — GitHub Auto-Deploy (recommended for production)

1. Push the project to a GitHub repo
2. Go to **https://app.netlify.com** → **Add new site** → **Import from Git**
3. Select your repo
4. Netlify auto-detects `netlify.toml` — no manual config needed
5. Every push to `main` auto-deploys ✓

---

## ⚙️ Environment Variables (Netlify Dashboard)

**Site settings → Environment variables → Add variable**

| Variable | Value | Required |
|---|---|---|
| `REACT_APP_API_URL` | `https://your-backend.com/api` | ✓ |
| `REACT_APP_ANTHROPIC_API_KEY` | `sk-ant-...` | Only if using AI on frontend |
| `REACT_APP_APP_NAME` | `PediVault` | Optional |
| `REACT_APP_ENV` | `production` | Optional |

> ⚠️ Any variable not prefixed with `REACT_APP_` is invisible to the browser.
> Never put `TWILIO_*` or other server secrets here — those go on your backend only.

---

## 📋 Build Settings (auto-set by netlify.toml)

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `build` |
| Node version | 18 |
| CI | false |

---

## 🌐 What's Configured

### SPA Routing
`public/_redirects` ensures all routes (e.g. `/dashboard`, `/auth`) serve `index.html`.
Refreshing any page works correctly.

### Security Headers (applied to all pages)
- `X-Frame-Options: DENY` — blocks clickjacking
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` — forces HTTPS (1 year)
- `Content-Security-Policy` — restricts script/style sources
- `Permissions-Policy` — disables camera, microphone, geolocation access

### Cache Strategy
- `/static/js/*`, `/static/css/*` → `max-age=31536000, immutable` (CRA adds content hashes)
- `/index.html` → `no-cache` (always fetch fresh for new deploys)
- `/sw.js`, `/manifest.json` → `no-cache`

---

## 🔁 Backend API on Netlify

Since this is a React SPA (not SSR), your backend must be deployed separately.

**Recommended backend platforms:**
- **Railway** — `railway up`
- **Render** — `render.yaml`
- **Heroku** — `Procfile`
- **AWS / GCP / Azure** — containerised

Set `REACT_APP_API_URL` in Netlify env vars to your backend URL.

### CORS
Your backend must allow your Netlify domain:
```js
// Express example
app.use(cors({
  origin: ['https://your-site.netlify.app', 'https://pedivault.com'],
  credentials: true,
}));
```

---

## ✅ Pre-deploy Checklist

- [ ] `npm run build` completes with no errors locally
- [ ] `REACT_APP_API_URL` set in Netlify env vars
- [ ] Backend deployed and CORS configured for Netlify domain
- [ ] Custom domain configured in Netlify → SSL auto-provisioned
- [ ] `_redirects` file in `public/` (already included ✓)
- [ ] `netlify.toml` in project root (already included ✓)
