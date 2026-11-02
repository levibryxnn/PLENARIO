import { performance } from 'node:perf_hooks';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const flags = Object.fromEntries(
  process.argv.slice(2).filter((arg) => arg.startsWith('--')).map((arg) => {
    const [key, ...value] = arg.slice(2).split('=');
    return [key, value.join('=')];
  }),
);

const base = new URL(flags.base || 'http://127.0.0.1:3102');
const allowedHosts = new Set(['localhost', '127.0.0.1', '[::1]']);
if (!allowedHosts.has(base.hostname) || base.protocol !== 'http:') {
  console.error('Teste permitido somente em servidor HTTP local (não em produção).');
  process.exit(2);
}

const users = Number(flags.users || 300);
if (!Number.isInteger(users) || users < 1 || users > 300) {
  console.error('Informe um número de usuários entre 1 e 300.');
  process.exit(2);
}

const reportFile = flags.report || 'test-results/load-300.json';
const endpoints = ['/', '/api/politicians?pageSize=8', '/cargos'];
const results = [];

async function waitForServer() {
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(new URL('/api/health', base), {
        signal: AbortSignal.timeout(2000),
      });
      if (response.ok) return;
    } catch {
      // A aplicação de teste pode ainda estar inicializando.
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error('Servidor de teste não respondeu dentro de 45 segundos.');
}

const percentile = (values, p) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return Math.round(sorted[Math.ceil((sorted.length - 1) * p)]);
};

async function virtualVisitor(id) {
  // Cada visitante abre três recursos em sequência, como em uma navegação básica.
  for (const endpoint of endpoints) {
    const started = performance.now();
    try {
      const response = await fetch(new URL(endpoint, base), {
        signal: AbortSignal.timeout(45000),
        headers: { 'user-agent': `PlenarioLocalLoadTest/1.0 visitor-${id}` },
      });
      const body = await response.arrayBuffer();
      results.push({
        endpoint,
        status: response.status,
        ok: response.ok,
        ms: performance.now() - started,
        bytes: body.byteLength,
      });
    } catch (error) {
      results.push({
        endpoint,
        status: 0,
        ok: false,
        ms: performance.now() - started,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

await waitForServer();
const started = performance.now();
await Promise.all(Array.from({ length: users }, (_, i) => virtualVisitor(i + 1)));
const durationSeconds = (performance.now() - started) / 1000;
const failed = results.filter((x) => !x.ok);
const measured = results.map((x) => x.ms);
const report = {
  scenario: 'local synthetic HTTP concurrency, not a production capacity guarantee',
  users,
  requests: results.length,
  successes: results.length - failed.length,
  failures: failed.length,
  errorRate: +(failed.length / results.length).toFixed(4),
  durationSeconds: +durationSeconds.toFixed(2),
  requestsPerSecond: +(results.length / durationSeconds).toFixed(2),
  p50Ms: percentile(measured, 0.5),
  p95Ms: percentile(measured, 0.95),
  p99Ms: percentile(measured, 0.99),
  slowestMs: Math.round(Math.max(...measured)),
  byEndpoint: Object.fromEntries(
    endpoints.map((path) => {
      const values = results.filter((x) => x.endpoint === path);
      return [
        path,
        {
          requests: values.length,
          failures: values.filter((x) => !x.ok).length,
          p95Ms: percentile(
            values.map((x) => x.ms),
            0.95,
          ),
        },
      ];
    }),
  ),
  sampleFailures: failed.slice(0, 5),
};

mkdirSync(dirname(reportFile), { recursive: true });
writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (failed.length > 0) process.exitCode = 1;
