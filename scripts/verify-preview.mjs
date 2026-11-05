/**
 * This checks the running Codespaces server, not merely GitHub's repository.
 * Use: npm run preview:verify while npm run dev is active on port 3000.
 */
const base = new URL(process.env.PLENARIO_PREVIEW_URL ?? 'http://127.0.0.1:3000');
if (!['127.0.0.1', 'localhost', '::1'].includes(base.hostname)) {
  throw new Error('Este diagnóstico só verifica servidores locais.');
}

const checks = [
  {
    path: '/plenario-v3-integridade.txt',
    marker: 'PLENARIO_LAYOUT_V3_2026-11-05',
  },
  { path: '/projetos', marker: 'legislative-record__summary' },
  { path: '/glossario', marker: 'editorial-definition' },
  { path: '/cargos', marker: 'office-grid--five' },
];

let failures = 0;
for (const { path, marker } of checks) {
  try {
    const response = await fetch(new URL(path, base), {
      signal: AbortSignal.timeout(10_000),
      redirect: 'manual',
      cache: 'no-store',
    });
    const body = await response.text();
    const ok = response.status === 200 && body.includes(marker);
    console.log(`${ok ? 'OK' : 'FALHOU'} ${path}: HTTP ${response.status}; marcador ${marker}`);
    if (!ok) failures++;
  } catch (error) {
    failures++;
    console.error(`FALHOU ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
if (failures) {
  console.error(
    'O servidor ativo não corresponde à versão esperada. Verifique a branch, o git pull e o processo da porta 3000.',
  );
  process.exitCode = 1;
} else {
  console.log('A versão v3 respondeu corretamente nas rotas e no marcador de implantação.');
}
