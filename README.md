# Neural Web Works

`neuralwebworks.com` — note the project folder is still named `dropforge/` from
the old placeholder name; rename it when convenient.

Single-page marketing site for a software studio, plus the Node service that
collects client project briefs.

- **Frontend** — pure React 18 on Vite. No UI kit, no animation library; the
  scroll reveals, the timeline, the marquee and the water simulation are all
  hand-written with IntersectionObserver, CSS and one canvas.
- **Backend** — Express. Validates each brief, rate-limits by IP, drops bot
  submissions via a honeypot, and appends to `server/data/leads.json` and
  `server/data/leads.csv`.

## Run it

```bash
cd dropforge
npm run install:all
cp server/.env.example server/.env   # then set ADMIN_KEY
npm run dev
```

- Site: http://localhost:5173
- API: http://localhost:4000

Vite proxies `/api/*` to the API, so the frontend calls one relative path in
both development and production.

To run the halves separately: `npm run dev:server` and `npm run dev:client`.

## Reading the leads

```bash
curl -H "x-admin-key: YOUR_KEY" http://localhost:4000/api/leads
```

| Method | Route             | Auth        | Purpose                          |
| ------ | ----------------- | ----------- | -------------------------------- |
| GET    | `/api/health`     | none        | Liveness check                   |
| POST   | `/api/brief`      | none        | Submit a project brief           |
| GET    | `/api/leads`      | `x-admin-key` | List briefs, newest first      |
| GET    | `/api/leads/:id`  | `x-admin-key` | One brief                      |

`server/data/leads.csv` opens directly in Excel or Google Sheets.

## Deploying

1. `npm run build` produces `client/dist`.
2. Serve `client/dist` from any static host (Vercel, Netlify, Nginx, S3).
3. Run `npm start` in `server/` behind a process manager.
4. Point `/api/*` at the Node service and set `CORS_ORIGIN` to the site's real
   origin.

The lead store is flat files, which is right for the first few hundred briefs
and trivial to back up. Swap `server/src/store.js` for Postgres when volume or
reporting justifies it; nothing else has to change.

## Structure

```
dropforge/
├── client/
│   └── src/
│       ├── components/     Hero, PowerPlant, WaterCanvas, BriefForm, …
│       ├── data/           All copy and the technology lists, in one place
│       ├── hooks/          Scroll reveal, scroll progress, active section
│       ├── lib/api.js      The single fetch wrapper
│       └── styles/         global.css (tokens) + sections.css (components)
├── server/
│   └── src/                index.js (routes), validate.js, store.js
└── scripts/dev.js          Runs both halves with prefixed output
```

### Where to edit content

Everything a non-developer would want to change lives in two files:

- `client/src/data/content.js` — studio name, services, process, case studies,
  pricing, FAQ, footer.
- `client/src/data/stacks.js` — the technology lists. These same arrays render
  the stack explorer **and** the checkboxes in the brief form, so adding a
  technology in one place adds it to both.

## Notes on the build

- The hero water effect is one canvas: falling drops that strike the water line
  and throw ripples and splashes, plus condensation beads that swell, release
  and streak down the glass. The loop stops when the hero leaves the viewport or
  the tab is hidden, and never starts under `prefers-reduced-motion`.
- The brief form saves a draft to `localStorage` on every keystroke and clears
  it on a successful submit.
- The whole site respects `prefers-reduced-motion`, is keyboard navigable, and
  ships a skip link, focus rings and live regions on the changing counts.
