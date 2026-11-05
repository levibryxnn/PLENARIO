/*
 * Run only against an isolated staging server with test data.
 * Default target is localhost. Remote targets require explicit opt-in.
 *
 * PLENARIO_LOAD_URL=http://127.0.0.1:3100 \
 * PLENARIO_LOAD_USERS=300 PLENARIO_LOAD_SECONDS=30 npm run test:load
 */
import { performance } from 'node:perf_hooks';

const url = new URL(process.env.PLENARIO_LOAD_URL ?? 'http://127.0.0.1:3100');
const local = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);

if (!local && process.env.PLENARIO_ALLOW_REMOTE_LOAD !== 'CONFIRMO') {
  throw new Error(
    'Teste remoto bloqueado. Exige ambiente de staging autorizado e PLENARIO_ALLOW_REMOTE_LOAD=CONFIRMO.',
  );
}

if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
  throw new Error('URL de destino inválida.');
}

const users = Number(process.env.PLENARIO_LOAD_USERS ?? 300);
const seconds = Number(process.env.PLENARIO_LOAD_SECONDS ?? 30);

if (!Number.isInteger(users) || users < 1 || users > 300) {
  throw new Error('PLENARIO_LOAD_USERS precisa estar entre 1 e 300.');
}
if (!Number.isInteger(seconds) || seconds < 5 || seconds > 120) {
  throw new Error('PLENARIO_LOAD_SECONDS precisa estar entre 5 e 120.');
}

const paths = ['/', '/cargos', '/projetos', '/glossario', '/api/health', '/comparar'];
const latencies = [];
const perPath = Object.fromEntries(paths.map((path) => [path, { ok: 0, failed: 0 }]));
let successes = 0;
let failures = 0;
let timeouts = 0;
const started = performance.now();
const until = started + seconds * 1000;

async function worker(index) {
  let iteration = 0;
  while (performance.now() < until) {
    const path = paths[(index + iteration++) % paths.length];
    const start = performance.now();
    try {
      const response = await fetch(new URL(path, url), {
        method: 'GET',
        redirect: 'error',
        signal: AbortSignal.timeout(12_000),
        headers: { 'Cache-Control': 'no-cache' },
      });
      const body = await response.arrayBuffer();
      void body;
      const elapsed = performance.now() - start;
      latencies.push(elapsed);

      if (response.ok) {
        successes++;
        perPath[path].ok++;
      } else {
        failures++;
        perPath[path].failed++;
      }
    } catch (error) {
      failures++;
      perPath[path].failed++;
      if (error?.name === 'TimeoutError' || error?.name === 'AbortError') timeouts++;
    }
  }
}

await Promise.all(Array.from({ length: users }, (_, index) => worker(index)));

latencies.sort((a, b) => a - b);
const percentile = (fraction) =>
  latencies.length
    ? Number(latencies[Math.min(latencies.length - 1, Math.ceil(fraction * latencies.length) - 1)].toFixed(1))
    : null;
const elapsedSeconds = (performance.now() - started) / 1000;
const total = successes + failures;
const summary = {
  scenario: 'Até 300 clientes virtuais executando GETs públicos em paralelo',
  target: url.origin,
  users,
  seconds: Number(elapsedSeconds.toFixed(2)),
  requests: total,
  successes,
  failures,
  timeouts,
  errorRatePercent: total ? Number(((failures / total) * 100).toFixed(2)) : 100,
  requestsPerSecond: Number((total / elapsedSeconds).toFixed(2)),
  p50ms: percentile(0.5),
  p95ms: percentile(0.95),
  p99ms: percentile(0.99),
  perPath,
};
console.log(JSON.stringify(summary, null, 2));
if (failures > 0 || !total) process.exitCode = 1;
