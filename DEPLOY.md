# Deploying to Hostinger

Target layout:

| Host | Serves | Type |
| --- | --- | --- |
| `neuralwebworks.com` | `client/dist/` | static files |
| `raw.neuralwebworks.com` | `server/` | Node app (Express) |

Account facts as of 2026-09-10: **Business** plan, which includes Node.js
"Web Apps". `neuralwebworks.com` currently runs WordPress. The other sites on
the account (`foodland.fun`, `home.foodland.fun`, `civicos.neuralwebworks.com`)
are unrelated and must not be touched.

---

## 1. Back up, then clear WordPress off the root domain

**Do this part yourself — it destroys the current live site.**

Take a backup first: hPanel → the `neuralwebworks.com` website → *Tools* →
*Backups* → create and download one. The database is not recoverable
afterwards without it.

Then the least destructive route, which keeps the domain mapping and the SSL
certificate intact:

1. hPanel → `neuralwebworks.com` → *Tools* → *File Manager*
2. Open `public_html` and delete its contents — the WordPress files
   (`wp-admin`, `wp-content`, `wp-includes`, `wp-config.php`, `index.php`,
   `.htaccess`). Leave `public_html` itself in place.
3. hPanel → *Databases* → *Management* → drop the WordPress database once you
   are satisfied the backup is good.

Avoid *Actions → Delete* on the website entry. That removes the whole website
including its domain attachment and certificate, which you would then have to
set up again.

## 2. Upload the front end

The build is already made and committed. Rebuild any time with:

```bash
npm --prefix client run build
```

Upload the **contents** of `client/dist/` into `public_html` — `index.html`,
`assets/`, `favicon.svg` and the dotfile `.htaccess`. Not the `dist` folder
itself.

File Manager hides dotfiles by default, so confirm `.htaccess` arrived
(*Settings* → show hidden files). Without it, HTTPS is not forced and deep
links 404. Uploading `dist.zip` and extracting in place is faster than
uploading files one by one.

`VITE_API_BASE` is baked in at build time from `client/.env.production`, so the
uploaded bundle already calls `https://raw.neuralwebworks.com`. If the API host
ever changes, edit that file and rebuild — editing the uploaded files will not
work.

## 3. Create the API subdomain

hPanel → `neuralwebworks.com` → *Domains* → *Subdomains* → add `raw`. This
creates the DNS record and a document root for it automatically.

## 4. Deploy the backend

hPanel → *Websites* → *Web Apps* → add a Node.js app:

- **Domain**: `raw.neuralwebworks.com`
- **Entry point / startup file**: `src/index.js`
- **Node version**: 18 or newer (`server/package.json` requires it)
- **Install command**: `npm ci --omit=dev`
- **Start command**: `npm start`

Upload the `server/` directory — but not `node_modules`, and not `.env`.

Set the environment variables from [`server/.env.production.example`](server/.env.production.example):

- `CORS_ORIGIN=https://neuralwebworks.com,https://www.neuralwebworks.com`
- `ADMIN_KEY` — generate a real one, do not reuse the dev value
- `DATA_DIR` — a path outside the app directory, so redeploys keep the leads

Do not set `PORT`. The app already reads `process.env.PORT` and the platform
assigns it; hardcoding it stops the app binding.

Enable SSL for the subdomain (*Tools* → *SSL*). The front end is HTTPS, so a
plain-HTTP API would be blocked as mixed content and the form would fail.

## 5. Verify

```bash
curl https://raw.neuralwebworks.com/api/health
```

Expect `{"ok":true,"service":"neuralwebworks-api",...}`.

Then load `https://neuralwebworks.com`, submit a real brief, and check it
landed:

```bash
curl -H "x-admin-key: YOUR_ADMIN_KEY" https://raw.neuralwebworks.com/api/leads
```

Also check the browser console is clean on submit. A CORS error there means
`CORS_ORIGIN` does not exactly match the origin the browser sent — scheme
included.

---

## Known limitations of this setup

- **Leads are files, not a database.** `leads.json` and `leads.csv` are fine
  for early volume, but two app instances would interleave writes. If Hostinger
  scales the app beyond one process, move the store to MySQL.
- **The rate limit is per process and in memory.** It resets on every restart
  and does not coordinate across instances.
- **No email on submit.** A brief lands on disk and nothing tells you. Either
  poll `/api/leads` or add an SMTP notification.
- **Placeholder content is still live copy.** The phone number, office
  locations, case studies and metrics in `client/src/data/content.js` are
  invented. Replace them before sending anyone to the site.
