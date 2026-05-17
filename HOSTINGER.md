# OM Packaging — Hostinger Deployment

Frontend deploys to `public_html/ompack/`. Backend stays on Render
(`https://ompack-api.onrender.com/api`).

---

## 1. Pick your URL pattern (THIS DECIDES THE BUILD)

Hostinger maps `public_html/ompack/` to one of two URL shapes:

| Setup | URL path | Build command | `.htaccess` `RewriteBase` |
| --- | --- | --- | --- |
| **A. Subdomain** (e.g. `ompack.rhobel.com` → `public_html/ompack/`) | `/` | `npm run build` | `/`  (current file) |
| **B. Subfolder of main domain** (`yourdomain.com/ompack/`) | `/ompack/` | `VITE_BASE=/ompack/ npm run build` | `/ompack/` |

**The project is configured for Setup A by default** — all references
(`canonical`, `VITE_SITE_URL`, CORS origin on Render) point at the
subdomain. Use Setup B only if you're hosting on the main domain.

For Setup B you must also edit `dist/.htaccess` after the build:
- Change `RewriteBase /` → `RewriteBase /ompack/`
- Change `RewriteRule ^ index.html [L]` → `RewriteRule ^ /ompack/index.html [L]`
- Change `ErrorDocument 404 /index.html` → `ErrorDocument 404 /ompack/index.html`

---

## 2. Build

```bash
cd client
# Setup A (subdomain — default)
npm ci
npm run build

# OR Setup B (subfolder)
VITE_BASE=/ompack/ npm run build
```

Output → `client/dist/` (~2.6 MB, includes `.br` and `.gz` siblings of
every JS/CSS file for pre-compressed serving).

---

## 3. Upload to Hostinger

Two clean options:

**Option A — hPanel File Manager:**
1. Zip `client/dist/` contents (the *contents*, not the `dist` folder itself).
2. hPanel → File Manager → `public_html/ompack/` → Upload → Extract.
3. Confirm `.htaccess` is present (hidden files toggle on).

**Option B — FTP / SFTP:**
```bash
# Example with rsync over SFTP
rsync -avz --delete client/dist/ \
  user@your-hostinger-host:/home/user/public_html/ompack/
```
Make sure `.htaccess` actually transfers (some clients hide dotfiles).

---

## 4. Post-deploy verification

| Check | How |
| --- | --- |
| Root page loads | Visit `https://ompack.rhobel.com/` |
| Deep link refresh works | Visit `https://ompack.rhobel.com/products` directly, refresh |
| 404 fallback | Visit a fake path → renders the SPA NotFound page |
| API reachable | Open DevTools → Network → look for `https://ompack-api.onrender.com/api/...` calls returning 200 |
| Pre-compressed serving | DevTools → Network → JS responses have `Content-Encoding: br` |
| Cache headers | Hashed assets show `Cache-Control: public, max-age=31536000, immutable` |
| CORS | Submit the inquiry form → backend accepts (no CORS error in console) |
| Admin login | `https://ompack.rhobel.com/admin/login` → admin dashboard loads |

If you see CORS errors, the Render service needs to allow-list the
production origin. `https://ompack.rhobel.com` is already in
`server.js:42`; for any other origin, add it via the Render env var
`CORS_EXTRA_ORIGINS` (comma-separated) — no redeploy needed.

---

## 5. What's in this build

- **Bundle splitting** — react / router / motion / swiper / forms / icons /
  axios in dedicated chunks (see `vite.config.js:36-52`)
- **Console + debugger stripped** — `esbuild.drop: ['console','debugger']`
  in `vite.config.js:29`
- **Brotli + gzip pre-compression** — every JS/CSS has `.br` and `.gz`
  siblings, served by `.htaccess` rewrite rules based on
  `Accept-Encoding`
- **Cache-Control: immutable** for `assets/*` (1 year), `no-cache` for
  `index.html` — deploys take effect immediately, repeat visitors hit
  cache for assets
- **Security headers** — `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy` set in `.htaccess:118-124`
- **Forced HTTPS** — `.htaccess:10-15`
- **SPA fallback** — `index.html` served for any non-file path
  (`.htaccess:17-39`)
- **Code splitting via `React.lazy`** — every non-Home route loads on
  demand (`App.jsx:18-41`)
- **ScrollToTop** on every route change
  (`components/common/ScrollToTop.jsx`)

---

## 6. Environment variables in the build

Verified baked into `dist/assets/index-*.js`:

| Var | Value |
| --- | --- |
| `VITE_API_URL` | `https://ompack-api.onrender.com/api` |
| `VITE_SITE_URL` | `https://ompack.rhobel.com` |
| `VITE_GA_ID` | `G-XXXXXXXXXX` *(replace before launch)* |

Edit `client/.env.production` and rebuild if any of these change. Note
that this file is gitignored — keep a personal copy.

---

## 7. Final checklist

- [ ] Confirmed URL pattern (Setup A subdomain vs Setup B subfolder)
- [ ] If Setup B: edited `dist/.htaccess` `RewriteBase` + `ErrorDocument`
- [ ] Replaced `VITE_GA_ID` placeholder with real GA4 ID before build
- [ ] Render service is live (`/api/health` returns 200)
- [ ] Uploaded `dist/` contents to `public_html/ompack/` *including*
      `.htaccess`
- [ ] Verified root, deep-link refresh, API calls, CORS, admin login
- [ ] Submitted Hostinger SSL certificate request (if not auto-issued)
- [ ] Submitted `sitemap.xml` to Google Search Console
