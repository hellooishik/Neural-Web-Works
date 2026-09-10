import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

// Leads live outside the deploy directory in production, so redeploying the
// app cannot wipe them. DATA_DIR may be absolute or relative to server/.
const dataDir = process.env.DATA_DIR
  ? path.resolve(here, '..', process.env.DATA_DIR)
  : path.join(here, '..', 'data');
const jsonFile = path.join(dataDir, 'leads.json');
const csvFile = path.join(dataDir, 'leads.csv');

fs.mkdirSync(dataDir, { recursive: true });

function readAll() {
  if (!fs.existsSync(jsonFile)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt file: move it aside rather than losing new submissions.
    fs.renameSync(jsonFile, `${jsonFile}.broken-${Date.now()}`);
    return [];
  }
}

function writeAll(rows) {
  const tmp = `${jsonFile}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(rows, null, 2));
  fs.renameSync(tmp, jsonFile);
}

const CSV_COLUMNS = [
  'id', 'receivedAt', 'name', 'email', 'company', 'phone', 'country',
  'projectType', 'platforms', 'stack', 'features', 'design',
  'timeline', 'budget', 'engagement', 'referral', 'nda', 'summary'
];

function csvCell(value) {
  const flat = Array.isArray(value) ? value.join(' | ') : value ?? '';
  const text = String(flat).replace(/\r?\n/g, ' ');
  return `"${text.replace(/"/g, '""')}"`;
}

function appendCsv(lead) {
  const header = CSV_COLUMNS.join(',');
  const line = CSV_COLUMNS.map((key) => csvCell(lead[key])).join(',');
  if (!fs.existsSync(csvFile)) fs.writeFileSync(csvFile, `${header}\n`);
  fs.appendFileSync(csvFile, `${line}\n`);
}

export function saveLead(lead) {
  const rows = readAll();
  rows.push(lead);
  writeAll(rows);
  appendCsv(lead);
  return lead;
}

export function listLeads({ limit = 100, offset = 0 } = {}) {
  const rows = readAll().slice().reverse();
  return { total: rows.length, items: rows.slice(offset, offset + limit) };
}

export function getLead(id) {
  return readAll().find((row) => row.id === id) ?? null;
}

export const paths = { jsonFile, csvFile };
