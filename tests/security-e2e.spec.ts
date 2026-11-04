import { expect, test } from '@playwright/test';

test('rotas mutáveis exigem Origin confiável e payload JSON sem vazar erro interno', async ({
  request,
  baseURL,
}) => {
  const adminPath = '/api/admin/login';
  const badOrigin = await request.post(adminPath, {
    headers: { Origin: 'https://attacker.example', 'Content-Type': 'application/json' },
    data: '{"password":"not-real"}',
  });
  expect(badOrigin.status()).toBe(403);

  const wrongType = await request.post(adminPath, {
    headers: { Origin: baseURL!, 'Content-Type': 'text/plain' },
    data: '{"password":"not-real"}',
  });
  expect(wrongType.status()).toBe(415);

  const malformed = await request.post(adminPath, {
    headers: { Origin: baseURL!, 'Content-Type': 'application/json' },
    data: '{"password":',
  });
  expect(malformed.status()).toBe(400);
  expect((await malformed.json()).error).toBe('JSON inválido.');
  expect(malformed.headers()['cache-control']).toContain('no-store');

  const corrections = await request.post('/api/corrections', {
    headers: { Origin: baseURL!, 'Content-Type': 'text/plain' },
    data: '{}',
  });
  expect(corrections.status()).toBe(415);
  expect(corrections.headers()['cache-control']).toContain('no-store');
});

test('páginas públicas expõem headers de segurança e o login privado não vaza dados', async ({
  page,
  request,
}) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
  expect(response.headers()['x-frame-options']).toBe('DENY');
  expect(response.headers()['x-content-type-options']).toBe('nosniff');
  expect(response.headers()['content-security-policy']).toContain("object-src 'none'");

  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Entrar como editor' })).toBeVisible();
  await expect(page.getByText('Solicitações de correção', { exact: true })).toBeHidden();
});
