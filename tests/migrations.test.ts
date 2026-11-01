// Fictitious records in an isolated database, never published.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  getDb,
  closeDatabase,
  savePoliticians,
  listPoliticians,
  getPolitician,
} from '../src/lib/db';
import type { Politician } from '../src/lib/types';

function fixture(prefix: 'camara' | 'senado'): Politician {
  const now = new Date().toISOString();
  return {
    id: `${prefix}:42`,
    officialId: 42,
    name: `Pessoa fictícia ${prefix}`,
    fullName: null,
    party: 'TESTE',
    uf: 'SP',
    role: 'Cargo fictício',
    municipality: null,
    status: 'Teste',
    legislature: 57,
    photoUrl: null,
    referenceDate: now.slice(0, 10),
    collectedAt: now,
    coverage: 'live',
    education: null,
    timeline: [],
    proposals: [],
    legalRecords: [],
    source: {
      id: 'test-only-source',
      publisher: 'Fonte fictícia em teste',
      title: 'Documento fictício de contrato',
      url:
        prefix === 'camara'
          ? 'https://dadosabertos.camara.leg.br/api/v2/deputados/42'
          : 'https://legis.senado.leg.br/dadosabertos/senador/lista/atual.json',
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
}

test('migração preserva registros, correções e índices; IDs iguais de Casas diferentes coexistem', () => {
  const directory = mkdtempSync(join(tmpdir(), 'plenario-migration-'));
  const path = join(directory, 'legacy.db');
  const person = fixture('camara');
  const legacy = new DatabaseSync(path);
  legacy.exec(`PRAGMA foreign_keys=ON;
    CREATE TABLE politicians (
      id TEXT PRIMARY KEY, official_id INTEGER NOT NULL UNIQUE, name TEXT NOT NULL, search_name TEXT NOT NULL,
      party TEXT NOT NULL, uf TEXT NOT NULL, role TEXT NOT NULL, status TEXT NOT NULL, coverage TEXT NOT NULL,
      collected_at TEXT NOT NULL, reference_date TEXT, data TEXT NOT NULL CHECK(json_valid(data))
    );
    CREATE INDEX custom_name_index ON politicians(name);
    CREATE TABLE corrections (
      id TEXT PRIMARY KEY, politician_id TEXT NOT NULL REFERENCES politicians(id), subject TEXT NOT NULL,
      evidence_url TEXT NOT NULL, submitted_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending'
    );`);
  legacy
    .prepare('INSERT INTO politicians VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(
      person.id,
      42,
      person.name,
      person.name,
      'TESTE',
      'SP',
      person.role,
      'Teste',
      'live',
      person.collectedAt,
      person.referenceDate,
      JSON.stringify(person),
    );
  legacy
    .prepare('INSERT INTO corrections VALUES (?,?,?,?,?,?)')
    .run(
      'ficticio-pedido',
      person.id,
      'Pedido fictício de teste',
      'https://example.test/documento',
      person.collectedAt,
      'pending',
    );
  legacy.close();
  process.env.CIVIS_DB_PATH = path;
  process.env.CIVIS_SKIP_SNAPSHOT = '1';
  try {
    const db = getDb();
    assert.equal(getPolitician(person.id)?.name, person.name);
    assert.equal(
      db.prepare('SELECT politician_id FROM corrections').get()?.politician_id,
      person.id,
    );
    assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
    assert.ok(
      db
        .prepare("SELECT name FROM sqlite_schema WHERE type='index' AND name='custom_name_index'")
        .get(),
    );
    savePoliticians([fixture('senado')]);
    assert.equal(listPoliticians().total, 2);
    assert.equal(getPolitician('senado:42')?.officialId, 42);
    closeDatabase();
    assert.equal(
      listPoliticians().total,
      2,
      'A migração deve ser idempotente após reabrir o banco.',
    );
    assert.throws(
      () =>
        getDb()
          .prepare('INSERT INTO corrections VALUES (?,?,?,?,?,?)')
          .run(
            'outro',
            'camara:999',
            'Teste',
            'https://example.test',
            person.collectedAt,
            'pending',
          ),
      /FOREIGN KEY/,
    );
  } finally {
    closeDatabase();
    delete process.env.CIVIS_DB_PATH;
    delete process.env.CIVIS_SKIP_SNAPSHOT;
    rmSync(directory, { recursive: true, force: true });
  }
});

test('banco novo protege arquivo e diretório de correções privadas', () => {
  const directory = mkdtempSync(join(tmpdir(), 'plenario-private-db-'));
  process.env.CIVIS_DB_PATH = join(directory, 'private', 'test.db');
  try {
    getDb();
    assert.equal(statSync(process.env.CIVIS_DB_PATH).mode & 0o777, 0o600);
    assert.equal(statSync(join(directory, 'private')).mode & 0o777, 0o700);
  } finally {
    closeDatabase();
    delete process.env.CIVIS_DB_PATH;
    rmSync(directory, { recursive: true, force: true });
  }
});
