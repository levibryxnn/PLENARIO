// Official-looking URLs below are fixtures for a local proxy test; no network call is made.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { GET } from '../src/app/api/photos/[id]/route';
import { closeDatabase, savePoliticians } from '../src/lib/db';
import type { Politician } from '../src/lib/types';

let directory: string;
before(() => {
  directory = mkdtempSync(join(tmpdir(), 'plenario-photo-test-'));
  process.env.CIVIS_DB_PATH = join(directory, 'test.db');
  process.env.CIVIS_SKIP_SNAPSHOT = '1';
  const now = new Date().toISOString();
  const person: Politician = {
    id: 'camara:42',
    officialId: 42,
    name: 'Pessoa fictícia para teste de retrato',
    fullName: null,
    party: 'TESTE',
    uf: 'SP',
    role: 'Cargo fictício',
    municipality: null,
    status: 'Teste',
    legislature: 57,
    photoUrl: 'https://www.camara.leg.br/internet/deputado/bandep/42.jpg',
    referenceDate: now.slice(0, 10),
    collectedAt: now,
    coverage: 'live',
    education: null,
    timeline: [],
    proposals: [],
    legalRecords: [],
    source: {
      id: 'test-only-photo-source',
      publisher: 'Fonte fictícia de teste',
      title: 'Documento fictício de contrato',
      url: 'https://dadosabertos.camara.leg.br/api/v2/deputados/42',
      documentId: 'FICTICIO-TESTE',
      eventDate: null,
      publishedAt: null,
      collectedAt: now,
      verifiedAt: now,
      excerpt: null,
      kind: 'primary',
      verification: 'official-import',
    },
  };
  savePoliticians([person]);
});
after(() => {
  closeDatabase();
  delete process.env.CIVIS_DB_PATH;
  delete process.env.CIVIS_SKIP_SNAPSHOT;
  rmSync(directory, { recursive: true, force: true });
});

test('proxy de retratos rejeita SVG e conteúdo ativo servido no domínio da aplicação', async (t) => {
  t.mock.method(
    globalThis,
    'fetch',
    async () =>
      new Response('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>', {
        headers: { 'Content-Type': 'image/svg+xml' },
      }),
  );
  const result = await GET(new Request('https://plenario.test/api/photos/42'), {
    params: Promise.resolve({ id: '42' }),
  });
  assert.equal(result.status, 502);
  assert.match((await result.json()).error, /conteúdo inválido/);
});

test('proxy cancela retrato excessivo antes de transferir o corpo', async (t) => {
  let canceled = false;
  t.mock.method(
    globalThis,
    'fetch',
    async () =>
      new Response(
        new ReadableStream({
          cancel() {
            canceled = true;
          },
        }),
        { headers: { 'Content-Type': 'image/jpeg', 'Content-Length': '2000001' } },
      ),
  );
  const result = await GET(new Request('https://plenario.test/api/photos/42'), {
    params: Promise.resolve({ id: '42' }),
  });
  assert.equal(result.status, 502);
  assert.equal(canceled, true);
});

test('proxy preserva imagem raster permitida e cache de cliente', async (t) => {
  const bytes = new Uint8Array([255, 216, 255, 217]);
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response(bytes, { headers: { 'Content-Type': 'image/jpeg' } }),
  );
  const result = await GET(new Request('https://plenario.test/api/photos/42'), {
    params: Promise.resolve({ id: '42' }),
  });
  assert.equal(result.status, 200);
  assert.equal(result.headers.get('content-type'), 'image/jpeg');
  assert.match(result.headers.get('cache-control')!, /max-age=86400/);
  assert.deepEqual(new Uint8Array(await result.arrayBuffer()), bytes);
});
