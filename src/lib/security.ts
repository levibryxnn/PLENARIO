import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync, chmodSync } from 'node:fs';
import { isIP } from 'node:net';
import path from 'node:path';
export const SESSION_COOKIE = 'civis_session';
export function adminConfigured() {
  return (process.env.CIVIS_ADMIN_PASSWORD?.length ?? 0) >= 16;
}
const attempts = new Map<string, { count: number; until: number }>();
export function allowAttempt(key: string, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
  if (attempts.size > 5000) return false;
  const entry = attempts.get(key) ?? { count: 0, until: now + windowMs };
  entry.count++;
  attempts.set(key, entry);
  return entry.count <= limit;
}
export function verifyPassword(value: string) {
  if (!adminConfigured() || value.length > 256) return false;
  const salt = 'civis-admin-v1';
  return timingSafeEqual(
    scryptSync(value, salt, 32),
    scryptSync(process.env.CIVIS_ADMIN_PASSWORD!, salt, 32),
  );
}
function sessionKey() {
  if (process.env.CIVIS_SESSION_KEY && process.env.CIVIS_SESSION_KEY.length >= 32)
    return process.env.CIVIS_SESSION_KEY;
  const dir = path.dirname(
    path.resolve(/* turbopackIgnore: true */ process.env.CIVIS_DB_PATH ?? 'var/civis.db'),
  );
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'session.key');
  if (!existsSync(file)) {
    try {
      writeFileSync(file, randomBytes(48).toString('hex'), { mode: 0o600, flag: 'wx' });
    } catch (e) {
      if (!existsSync(file)) throw e;
    }
  }
  chmodSync(file, 0o600);
  return readFileSync(file, 'utf8').trim();
}
function sign(value: string) {
  return createHmac('sha256', sessionKey())
    .update(process.env.CIVIS_ADMIN_PASSWORD ?? '')
    .update('\0')
    .update(value)
    .digest('base64url');
}
export function createSession() {
  const payload = Buffer.from(
    JSON.stringify({
      actor: process.env.CIVIS_ADMIN_NAME ?? 'editor-local',
      exp: Date.now() + 8 * 60 * 60 * 1000,
      nonce: randomBytes(16).toString('hex'),
    }),
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}
export function readSession(token: string | undefined): { actor: string } | null {
  if (!token || !adminConfigured() || token.length > 2048) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payload, mac] = parts;
    const expected = Buffer.from(sign(payload));
    const got = Buffer.from(mac ?? '');
    if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (typeof data.actor !== 'string' || !Number.isFinite(data.exp) || data.exp < Date.now())
      return null;
    return { actor: data.actor };
  } catch {
    return null;
  }
}
/**
 * Trust only a header replaced by a reverse proxy under our control.
 * Never use X-Forwarded-For directly: clients can forge it on exposed servers.
 */
export function rateLimitClientKey(request: Request): string {
  const header = process.env.CIVIS_TRUSTED_CLIENT_IP_HEADER;
  if (header !== 'cf-connecting-ip' && header !== 'x-real-ip') return 'unknown';
  const candidate = request.headers.get(header)?.trim() ?? '';
  return isIP(candidate) ? candidate : 'unknown';
}

/**
 * In production with the editorial login enabled, require a pinned public
 * origin. Request Host and forwarded headers are not trusted for CSRF checks.
 */
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const received = new URL(origin);
    if (received.origin !== origin) return false;
    const configured = process.env.CIVIS_PUBLIC_ORIGIN;
    if (configured) {
      const expected = new URL(configured);
      const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(expected.hostname);
      if (
        (expected.protocol !== 'https:' && !(loopback && expected.protocol === 'http:')) ||
        expected.username ||
        expected.password ||
        expected.pathname !== '/' ||
        expected.search ||
        expected.hash
      )
        return false;
      return received.origin === expected.origin;
    }
    if (process.env.NODE_ENV === 'production' && adminConfigured()) return false;
    const expected = new URL(request.url);
    // Local development/test compatibility. Never trust Host for production CSRF checks.
    if (process.env.NODE_ENV !== 'production' && request.headers.get('host'))
      expected.host = request.headers.get('host')!;
    return received.origin === expected.origin;
  } catch {
    return false;
  }
}
export async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Corpo JSON obrigatório.');
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new Error('Pedido muito grande.');
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
