import { test, expect } from '@playwright/test';

test.describe('Prototype de direction visuelle (/direction)', () => {
  test('la page de direction présente les principes, les couleurs et les trois écrans', async ({ page }) => {
    await page.goto('/direction');
    await expect(page.getByRole('heading', { name: 'Le dossier de mission.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cinq principes' })).toBeVisible();
    await expect(page.getByText('Cuivre', { exact: true })).toBeVisible();
    await page.getByRole('link', { name: /^Cockpit/ }).first().click();
    await expect(page).toHaveURL(/\/direction\/cockpit$/);
  });

  test('le cockpit montre le portefeuille, les trajectoires et les signaux', async ({ page }) => {
    await page.goto('/direction/cockpit');
    await expect(page.getByRole('heading', { name: /Deux missions en cours/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Portefeuille' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Trajectoires' })).toBeVisible();
    await expect(page.getByText('Automatiser la veille professionnelle').first()).toBeVisible();
  });

  test('l’atelier montre la carte du processus, la conversation et le copilote', async ({ page }) => {
    await page.goto('/direction/atelier');
    await expect(page.getByRole('img', { name: /Carte du processus actuel/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Conversation' })).toBeVisible();
    await expect(page.getByText('Proposé par règles').first()).toBeVisible();
  });

  test('l’analyse montre les problèmes, la carte des opportunités et les solutions', async ({ page }) => {
    await page.goto('/direction/analyse');
    await expect(page.getByRole('img', { name: /Carte des opportunités/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Solutions candidates' })).toBeVisible();
    await expect(page.getByText('Relevé papier de deux semaines avant de décider').first()).toBeVisible();
  });
});
