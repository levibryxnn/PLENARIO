import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Projetos é expansível na mesma página e permite vários itens abertos', async ({ page }) => {
  await page.goto('/projetos');
  await expect(page).toHaveTitle('Projetos e votações · PLENÁRIO');
  await expect(page.getByRole('heading', { name: 'Projetos e votações' })).toBeVisible();

  const records = page.locator('.legislative-record');
  await expect(records).toHaveCount(4);
  const first = records.nth(0);
  const last = records.nth(3);
  await first.locator('summary').click();
  await expect(first).toHaveAttribute('open', '');
  await expect(first).toContainText('Exemplo prático:');
  await last.locator('summary').click();
  await expect(last).toHaveAttribute('open', '');
  await expect(first).toHaveAttribute('open', '');
  await first.locator('summary').click();
  await expect(first).not.toHaveAttribute('open');

  const sources = page.locator('.legislative-record__body a');
  await expect(sources).toHaveCount(4);
  for (const link of await sources.all()) {
    await expect(link).toHaveAttribute('href', /^https:\/\//);
  }

  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test('Glossário mostra as definições oficiais e permite retornar a Projetos', async ({ page }) => {
  await page.goto('/glossario');
  await expect(page).toHaveTitle('Glossário · PLENÁRIO');
  await expect(page.locator('.editorial-definition')).toHaveCount(10);
  await expect(
    page.getByRole('heading', { name: 'PLP · Projeto de Lei Complementar' }),
  ).toBeVisible();
  await expect(page.locator('.editorial-definition a')).toHaveCount(10);
  await page.getByRole('link', { name: 'Projetos e votações' }).click();
  await expect(page).toHaveURL(/\/projetos$/);
});

for (const width of [320, 390, 768, 1280]) {
  test('sem transbordamento horizontal em ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 840 });
    for (const path of ['/', '/cargos', '/projetos', '/glossario', '/comparar', '/metodologia']) {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
      const sizes = await page.evaluate(() => ({
        actual: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));
      expect(sizes.actual, 'Overflow em ' + path + ' (' + width + 'px)').toBeLessThanOrEqual(
        sizes.viewport + 1,
      );
    }
  });
}

test('menu mobile abre as novas rotas e fecha ao navegar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  const dialog = page.getByRole('dialog', { name: 'Navegação PLENÁRIO' });
  await expect(dialog.getByRole('link', { name: 'Projetos' })).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Glossário' })).toBeVisible();
  await dialog.getByRole('link', { name: 'Projetos' }).click();
  await expect(page).toHaveURL(/\/projetos$/);
  await expect(dialog).toBeHidden();
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(dialog.getByRole('link', { name: 'Projetos' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('perfil mantém seção jurídica revisada e aponta fontes externas de consulta', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explorar perfil' }).click();
  await expect(page.locator('#processos')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pesquisar no Jusbrasil' })).toHaveAttribute(
    'href',
    'https://www.jusbrasil.com.br/consulta-processual/',
  );
});
