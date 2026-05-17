# OM Packaging — Deployment Guide

Backend → **Render** (Node web service). Frontend → built locally / deployed to
your existing static host (Vercel, Netlify, or Render Static Site).

---

## 1. Backend on Render

### 1a. One-time setup
1. Push the repo to GitHub.
2. Render dashboard → **New +** → **Blueprint** → connect the repo.
3. Render auto-detects `server/render.yaml` and prompts you for the secret
   values listed below (anything marked `sync: false`).
4. Click **Apply**. First deploy takes ~3–5 min.

> If you'd rather skip the blueprint, use **New + → Web Service** with these
> settings — they match `render.yaml`:
> - **Root Directory:** `server`
> - **Build Command:** `npm ci`
> - **Start Command:** `node server.js`
> - **Health Check Path:** `/api/health`

### 1b. Environment variables to set in Render
Copy values from `server/.env` (which already has working credentials):

| Key | Where to get it |
| --- | --- |
| `MONGO_URI` | MongoDB Atlas connection string (already working locally) |
| `JWT_SECRET` | Generate fresh: `openssl rand -hex 32` |
| `JWT_REFRESH_SECRET` | Generate fresh: `openssl rand -hex 32` |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Cloudinary dashboard |
| `SMTP_USER` / `SMTP_PASS` | Gmail address + 16-char app password |
| `INQUIRY_EMAIL`, `INQUIRY_CC`, `AUTOREPLY_FROM` | Inquiry routing addresses |
| `TWILIO_*`, `WHATSAPP_NUMBER` | Twilio console (optional) |

`NODE_ENV`, `SITE_URL`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`,
`SMTP_HOST`, `SMTP_PORT` are pre-set in `render.yaml`.

**Do NOT set `PORT`** — Render injects it; the app already reads `process.env.PORT`
(see `server.js:113`).

### 1c. Seed the production admin
After first successful deploy, open the Render **Shell** tab on the service and
run:

```bash
node scripts/seedAdmin.js
```

That creates `admin@ompack.in / ChangeMe@123`. **Change the password
immediately via the admin UI after first login.**

### 1d. Smoke-test the deployed backend
Render will assign a URL like `https://ompack-api.onrender.com`. Verify:

```bash
# health
curl https://<your-render-url>/api/health
# expect: {"success":true,"db":"connected",...}

# login → JWT
curl -X POST https://<your-render-url>/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ompack.in","password":"ChangeMe@123"}'
# expect: {"success":true,"accessToken":"eyJ...","refreshToken":"eyJ...",...}

# CORS preflight from the production frontend origin
curl -i -X OPTIONS https://<your-render-url>/api/categories \
  -H "Origin: https://ompack.rhobel.com" \
  -H "Access-Control-Request-Method: GET"
# expect: HTTP/1.1 204 + Access-Control-Allow-Origin: https://ompack.rhobel.com
```

---

## 2. Frontend rebuild after backend goes live

Once you have the real Render URL (e.g. `https://ompack-api.onrender.com`):

```bash
cd client
# Edit .env.production:
#   VITE_API_URL=https://ompack-api.onrender.com/api
npm ci
npm run build
```

Output lands in `client/dist/`. Upload that directory to your static host,
or — if using Vercel/Netlify — set `VITE_API_URL` as an env var there and let
their build run.

---

## 3. Post-deploy checklist
- [ ] `/api/health` returns 200 with `db: connected`
- [ ] Admin login from `https://ompack.rhobel.com` succeeds (no CORS errors in
      browser devtools)
- [ ] Image upload from admin panel succeeds (Cloudinary write path)
- [ ] Inquiry form on the public site sends an email
- [ ] `https://<render-url>/sitemap.xml` and `/robots.txt` resolve
- [ ] Admin password changed from default

---

## 4. Known Render free-tier gotchas
- **Cold starts:** free-tier services sleep after ~15 min idle. First request
  after sleep takes 30–50 s. Mitigate with a paid plan, or with a cron pinger
  hitting `/api/health` every 10 min.
- **Disk is ephemeral:** uploads must go to Cloudinary (already wired) — never
  the local filesystem.
- **Region:** `singapore` chosen in `render.yaml` for India latency; change the
  `region:` field to `oregon`/`frankfurt`/etc. if your audience is elsewhere.
