import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const publicRoutes = ['/', '/cargos', '/projetos', '/glossario', '/metodologia', '/comparar'];
const viewportWidths = [320, 375, 390, 768, 1024, 1440, 1920];

test('o design global não apresenta rolagem horizontal nas larguras principais', async ({
  page,
}) => {
  test.setTimeout(180000);
  for (const width of viewportWidths) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of publicRoutes) {
      await page.goto(route);
      await expect(page.locator('main')).toBeVisible();
      const { overflow, scrollWidth } = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(
        overflow,
        `overflow em ${route} com viewport ${width}px (scrollWidth ${scrollWidth})`,
      ).toBe(false);
    }
  }
});

test('proposições têm colunas alinhadas e descrições legíveis', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/projetos');
  await expect(page.getByRole('heading', { name: 'Projetos e votações' })).toBeVisible();
  await expect(page.locator('.pl-record')).toHaveCount(4);
  const rows = await page.locator('.pl-record').evaluateAll((elements) =>
    elements.map((row) => {
      const title = row.querySelector('.pl-record-title')!.getBoundingClientRect();
      const description = row.querySelector('.pl-record-description')!.getBoundingClientRect();
      return { titleX: title.x, descriptionX: description.x, descriptionRight: description.right };
    }),
  );
  expect(
    Math.max(...rows.map((r) => r.titleX)) - Math.min(...rows.map((r) => r.titleX)),
  ).toBeLessThan(1);
  expect(
    Math.max(...rows.map((r) => r.descriptionX)) - Math.min(...rows.map((r) => r.descriptionX)),
  ).toBeLessThan(1);
  expect(rows.every((r) => r.descriptionX < r.descriptionRight)).toBeTruthy();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.pl-record')).toHaveCount(4);
  const mobile = await page
    .locator('.pl-record')
    .first()
    .evaluate((row) => {
      const a = row.querySelector('.pl-record-title')!.getBoundingClientRect();
      const b = row.querySelector('.pl-record-description')!.getBoundingClientRect();
      return { sameColumn: Math.abs(a.x - b.x) < 1, belowTitle: b.top >= a.bottom - 1 };
    });
  expect(mobile.sameColumn).toBeTruthy();
  expect(mobile.belowTitle).toBeTruthy();
});

test('navegação nova preserva links e é acessível no desktop e no mobile', async ({ page }) => {
  await page.goto('/projetos');
  await expect(page.getByRole('link', { name: 'Projetos', exact: true }).first()).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.getByRole('link', { name: /PLP · Projeto de Lei Complementar/ }).click();
  await expect(page).toHaveURL(/\/glossario#plp$/);
  await expect(page.locator('#plp')).toBeVisible();

  const desktopAxe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(desktopAxe.violations).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Navegação PLENÁRIO' });
  await expect(menu.getByRole('link', { name: 'Glossário' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Projetos' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();

  const mobileAxe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(mobileAxe.violations).toEqual([]);
});

test('tipografia e identidade global são consistentes', async ({ page }) => {
  for (const route of ['/', '/cargos', '/projetos', '/glossario', '/metodologia']) {
    await page.goto(route);
    const fonts = await page.evaluate(() => {
      const heading = document.querySelector('h1')!;
      const body = document.body;
      return {
        heading: getComputedStyle(heading).fontFamily,
        body: getComputedStyle(body).fontFamily,
        border: getComputedStyle(document.documentElement).getPropertyValue('--line').trim(),
      };
    });
    expect(fonts.heading).toContain('Manrope');
    expect(fonts.body).toContain('Inter');
    expect(fonts.border).toBe('#d9d9d6');
  }
});
