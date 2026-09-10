#!/usr/bin/env node
/**
 * Runs the API and the Vite dev server together, prefixing their output so you
 * can tell them apart. Avoids a concurrently dependency for two processes.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const targets = [
  { name: 'api', colour: '[36m', args: ['--prefix', 'server', 'run', 'dev'] },
  { name: 'web', colour: '[35m', args: ['--prefix', 'client', 'run', 'dev'] }
];

const children = targets.map(({ name, colour, args }) => {
  // One command string rather than argv: npm on Windows is a .cmd shim, which
  // needs a shell, and passing argv alongside shell:true is deprecated.
  const child = spawn([npm, ...args].join(' '), { cwd: root, shell: true });
  const tag = `${colour}[${name}][0m `;
  const pipe = (stream) =>
    stream.on('data', (chunk) => {
      const text = String(chunk).trimEnd();
      if (text) console.log(text.split('\n').map((line) => tag + line).join('\n'));
    });
  pipe(child.stdout);
  pipe(child.stderr);
  child.on('exit', (code) => {
    console.log(`${tag}exited with code ${code}`);
    shutdown();
  });
  return child;
});

let closing = false;
function shutdown() {
  if (closing) return;
  closing = true;
  for (const child of children) child.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
