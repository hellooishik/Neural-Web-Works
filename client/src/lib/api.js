// Requests go to /api/* on the same origin; Vite proxies that to the Node
// server in development, and a reverse proxy does the same in production.
const BASE = import.meta.env.VITE_API_BASE ?? '';

export async function submitBrief(payload) {
  const response = await fetch(`${BASE}/api/brief`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    throw new Error('The server sent a response we could not read.');
  }

  if (!response.ok) {
    const error = new Error(body?.error ?? 'We could not submit your brief.');
    error.fieldErrors = body?.errors ?? null;
    error.status = response.status;
    throw error;
  }

  return body;
}
