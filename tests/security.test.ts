import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  adminConfigured,
  verifyPassword,
  createSession,
  readSession,
  sameOrigin,
  allowAttempt,
  rateLimitClientKey,
} from '../src/lib/security';
let directory: string;
let password: string;
before(() => {
  directory = mkdtempSync(join(tmpdir(), 'civis-security-test-'));
  password = randomBytes(32).toString('hex');
  process.env.CIVIS_DB_PATH = join(directory, 'security.db');
  delete process.env.CIVIS_SESSION_KEY;
  process.env.CIVIS_ADMIN_NAME = 'editor-ficticio-teste';
});
after(() => {
  rmSync(directory, { recursive: true, force: true });
  delete process.env.CIVIS_DB_PATH;
  delete process.env.CIVIS_ADMIN_PASSWORD;
  delete process.env.CIVIS_ADMIN_NAME;
});
test('admin é desativado sem segredo próprio; senha incorreta é rejeitada', () => {
  delete process.env.CIVIS_ADMIN_PASSWORD;
  assert.equal(adminConfigured(), false);
  assert.equal(verifyPassword('senha-padrao-nao-existe'), false);
  process.env.CIVIS_ADMIN_PASSWORD = password;
  assert.equal(adminConfigured(), true);
  assert.equal(verifyPassword('incorreta'), false);
  assert.equal(verifyPassword(password), true);
});
test('sessão assinada identifica responsável e rejeita adulteração', () => {
  const session = createSession();
  assert.equal(readSession(session)?.actor, 'editor-ficticio-teste');
  const [payload, signature] = session.split('.');
  const changed = Buffer.from(
    JSON.stringify({
      ...JSON.parse(Buffer.from(payload, 'base64url').toString()),
      actor: 'intruso',
    }),
  ).toString('base64url');
  assert.equal(readSession(`${changed}.${signature}`), null);
  assert.equal(readSession('lixo'), null);
  assert.equal(statSync(join(directory, 'session.key')).mode & 0o777, 0o600);
});
test('troca da senha invalida sessões emitidas anteriormente', () => {
  const session = createSession();
  process.env.CIVIS_ADMIN_PASSWORD = randomBytes(32).toString('hex');
  assert.equal(readSession(session), null);
  process.env.CIVIS_ADMIN_PASSWORD = password;
});
test('origem externa e ausência de Origin são bloqueadas em mutações', () => {
  assert.equal(
    sameOrigin(
      new Request('https://civis.example/api/admin/review', {
        headers: { Origin: 'https://invasor.example', Host: 'civis.example' },
      }),
    ),
    false,
  );
  assert.equal(sameOrigin(new Request('https://civis.example/api/admin/review')), false);
  assert.equal(
    sameOrigin(
      new Request('https://civis.example/api/admin/review', {
        headers: { Origin: 'https://civis.example', Host: 'civis.example' },
      }),
    ),
    true,
  );
});
test('limite de tentativas impede força bruta contínua por janela', () => {
  const key = randomBytes(12).toString('hex');
  assert.equal(allowAttempt(key, 2, 60000), true);
  assert.equal(allowAttempt(key, 2, 60000), true);
  assert.equal(allowAttempt(key, 2, 60000), false);
});
test('sessão com segmentos adicionais não é uma credencial válida', () => {
  assert.equal(readSession(`${createSession()}.extra`), null);
});

test('produção autenticada recusa Host forjado e exige origem pública fixa', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalOrigin = process.env.CIVIS_PUBLIC_ORIGIN;
  const originalPassword = process.env.CIVIS_ADMIN_PASSWORD;
  try {
    Reflect.set(process.env, 'NODE_ENV', 'production');
    process.env.CIVIS_ADMIN_PASSWORD = password;
    delete process.env.CIVIS_PUBLIC_ORIGIN;
    assert.equal(
      sameOrigin(
        new Request('https://plenario.example/api/admin/login', {
          headers: { Origin: 'https://attacker.example', Host: 'attacker.example' },
        }),
      ),
      false,
    );
    process.env.CIVIS_PUBLIC_ORIGIN = 'https://plenario.example';
    assert.equal(
      sameOrigin(
        new Request('https://localhost/api/admin/login', {
          headers: { Origin: 'https://plenario.example', Host: 'attacker.example' },
        }),
      ),
      true,
    );
    assert.equal(
      sameOrigin(
        new Request('https://localhost/api/admin/login', {
          headers: { Origin: 'https://attacker.example', Host: 'attacker.example' },
        }),
      ),
      false,
    );
    process.env.CIVIS_PUBLIC_ORIGIN = 'http://plenario.example';
    assert.equal(
      sameOrigin(
        new Request('https://localhost/api/admin/login', {
          headers: { Origin: 'http://plenario.example' },
        }),
      ),
      false,
    );
  } finally {
    if (originalEnv === undefined) Reflect.deleteProperty(process.env, 'NODE_ENV');
    else Reflect.set(process.env, 'NODE_ENV', originalEnv);
    if (originalOrigin === undefined) delete process.env.CIVIS_PUBLIC_ORIGIN;
    else process.env.CIVIS_PUBLIC_ORIGIN = originalOrigin;
    if (originalPassword === undefined) delete process.env.CIVIS_ADMIN_PASSWORD;
    else process.env.CIVIS_ADMIN_PASSWORD = originalPassword;
  }
});

test('limite por cliente ignora IP forjado sem proxy confiável explícito', () => {
  const original = process.env.CIVIS_TRUSTED_CLIENT_IP_HEADER;
  const request = new Request('https://plenario.example/api/admin/login', {
    headers: {
      'X-Forwarded-For': '10.0.0.4, 203.0.113.20',
      'CF-Connecting-IP': '203.0.113.20',
    },
  });
  try {
    delete process.env.CIVIS_TRUSTED_CLIENT_IP_HEADER;
    assert.equal(rateLimitClientKey(request), 'unknown');
    process.env.CIVIS_TRUSTED_CLIENT_IP_HEADER = 'x-forwarded-for';
    assert.equal(rateLimitClientKey(request), 'unknown');
    process.env.CIVIS_TRUSTED_CLIENT_IP_HEADER = 'cf-connecting-ip';
    assert.equal(rateLimitClientKey(request), '203.0.113.20');
  } finally {
    if (original === undefined) delete process.env.CIVIS_TRUSTED_CLIENT_IP_HEADER;
    else process.env.CIVIS_TRUSTED_CLIENT_IP_HEADER = original;
  }
});
