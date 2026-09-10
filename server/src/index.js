import 'dotenv/config';
import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import { validateBrief } from './validate.js';
import { saveLead, listLeads, getLead } from './store.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const ADMIN_KEY = process.env.ADMIN_KEY ?? '';
const ORIGINS = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(express.json({ limit: '128kb' }));
app.use(
  cors({
    origin(origin, done) {
      // Allow same-origin / curl (no Origin header) and the configured list.
      if (!origin || ORIGINS.includes('*') || ORIGINS.includes(origin)) return done(null, true);
      return done(new Error('Origin not allowed by CORS'));
    }
  })
);

// Fixed-window in-memory rate limit: enough to blunt casual form spam.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map();

function rateLimit(req, res, next) {
  const key = req.ip;
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }
  entry.count += 1;
  if (entry.count > MAX_PER_WINDOW) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    res.set('Retry-After', String(retryAfter));
    return res.status(429).json({ ok: false, error: 'Too many submissions. Try again later.' });
  }
  return next();
}

// Drop expired buckets so the map cannot grow without bound.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of hits) if (now > entry.resetAt) hits.delete(key);
}, WINDOW_MS).unref();

function requireAdmin(req, res, next) {
  if (!ADMIN_KEY) return res.status(503).json({ ok: false, error: 'ADMIN_KEY is not configured.' });
  const supplied = req.get('x-admin-key') ?? '';
  const a = Buffer.from(supplied);
  const b = Buffer.from(ADMIN_KEY);
  const match = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!match) return res.status(401).json({ ok: false, error: 'Unauthorized.' });
  return next();
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'neuralwebworks-api', time: new Date().toISOString() });
});

app.post('/api/brief', rateLimit, (req, res) => {
  const result = validateBrief(req.body);

  if (result.spam) {
    // Pretend it worked so bots do not learn what tripped them up.
    return res.status(202).json({ ok: true, reference: 'DF-000000' });
  }
  if (!result.ok) {
    return res.status(400).json({ ok: false, errors: result.errors });
  }

  const id = crypto.randomUUID();
  const lead = {
    id,
    reference: `DF-${id.slice(0, 6).toUpperCase()}`,
    receivedAt: new Date().toISOString(),
    ...result.data,
    meta: {
      ip: req.ip,
      userAgent: req.get('user-agent') ?? '',
      referer: req.get('referer') ?? ''
    }
  };

  saveLead(lead);
  console.log(`[brief] ${lead.reference} ${lead.email} — ${lead.projectType}`);

  return res.status(201).json({
    ok: true,
    reference: lead.reference,
    message: 'Brief received. We reply within one business day.'
  });
});

app.get('/api/leads', requireAdmin, (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  res.json({ ok: true, ...listLeads({ limit, offset }) });
});

app.get('/api/leads/:id', requireAdmin, (req, res) => {
  const lead = getLead(req.params.id);
  if (!lead) return res.status(404).json({ ok: false, error: 'Not found.' });
  res.json({ ok: true, lead });
});

app.use((req, res) => res.status(404).json({ ok: false, error: `No route for ${req.method} ${req.path}` }));

app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);
  const status = /CORS/.test(err.message) ? 403 : 500;
  res.status(status).json({ ok: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`Neural Web Works API listening on http://localhost:${PORT}`);
  console.log(`Allowed origins: ${ORIGINS.join(', ')}`);
});
