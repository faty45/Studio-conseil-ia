import { test, expect } from '@playwright/test';

test('la bibliothèque filtre les problèmes universels et montre les patrons avec leurs limites', async ({ page }) => {
  await page.goto('/bibliotheque');
  await expect(page.getByRole('heading', { name: 'Problèmes universels et patrons de solution' })).toBeVisible();
  await page.getByLabel('Recherche').fill('invendus');
  const problemes = page.getByRole('region', { name: 'Problèmes universels' });
  await expect(problemes.getByRole('button')).toHaveCount(1);
  await problemes.getByRole('button').first().click();
  await expect(page.getByText(/Patrons pour «/)).toBeVisible();
  const patrons = page.getByRole('region', { name: /Patrons pour/ });
  await expect(patrons.getByRole('article').first()).toBeVisible();
  await expect(patrons.getByText('Limites :').first()).toBeVisible();
});
