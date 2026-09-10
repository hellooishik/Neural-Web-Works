// Small hand-rolled validator so the API stays dependency-light.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  name: 120,
  email: 200,
  company: 160,
  phone: 40,
  country: 80,
  projectType: 80,
  timeline: 80,
  budget: 80,
  engagement: 80,
  referral: 120,
  summary: 5000
};

const LIST_FIELDS = ['platforms', 'stack', 'features', 'design'];

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function cleanList(value, max = 60) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim().slice(0, 80))
    .filter(Boolean)
    .slice(0, max);
}

export function validateBrief(body) {
  const errors = {};
  const data = {};

  if (!body || typeof body !== 'object') {
    return { ok: false, errors: { body: 'Expected a JSON object.' } };
  }

  // Honeypot: real users never fill this hidden field.
  if (clean(body.website, 200)) {
    return { ok: false, errors: { website: 'Rejected.' }, spam: true };
  }

  for (const [field, max] of Object.entries(LIMITS)) {
    data[field] = clean(body[field], max);
  }
  for (const field of LIST_FIELDS) {
    data[field] = cleanList(body[field]);
  }
  data.nda = body.nda === true || body.nda === 'true';

  if (!data.name) errors.name = 'Please tell us your name.';
  if (!data.email) errors.email = 'An email address is required.';
  else if (!EMAIL.test(data.email)) errors.email = 'That email address looks invalid.';
  if (!data.projectType) errors.projectType = 'Pick what you want built.';
  if (data.summary.length < 20) {
    errors.summary = 'Give us at least a sentence or two about the project.';
  }

  return { ok: Object.keys(errors).length === 0, errors, data };
}
