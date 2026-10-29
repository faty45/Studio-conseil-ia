import { test, expect } from '@playwright/test';

test.describe('Prototype hybride « Studio » (/studio)', () => {
  test('le cockpit liste les missions par phase, ouvre un volet et la palette ⌘K navigue', async ({ page }) => {
    await page.goto('/studio');
    await expect(page.getByRole('table', { name: 'Missions' })).toBeVisible();
    await expect(page.getByText('Automatiser la veille professionnelle').first()).toBeVisible();
    await page.getByText('Automatiser la veille professionnelle').first().click();
    await expect(page.getByRole('complementary', { name: /Mission Automatiser/ })).toBeVisible();
    await page.getByRole('button', { name: 'Fermer' }).click();
    await page.getByRole('button', { name: 'Clients' }).click();
    await expect(page.getByRole('table', { name: 'Clients' })).toBeVisible();
    await page.keyboard.press('Control+k');
    await page.getByRole('textbox', { name: 'Rechercher une commande' }).fill('boulangerie');
    await page.getByRole('option', { name: /Boulangerie du Marché/ }).first().click();
    await expect(page).toHaveURL(/\/studio\/client\/demo-boulangerie$/);
    await expect(page.getByRole('heading', { name: 'Boulangerie du Marché' })).toBeVisible();
  });

  test('la fiche client modifie une propriété et la conserve au rechargement', async ({ page }) => {
    await page.goto('/studio/client/demo-ardan');
    await expect(page.getByRole('heading', { name: 'ARDAN' })).toBeVisible();
    await page.getByLabel('Secteur').fill('Appui aux PME (modifié)');
    await page.getByRole('tab', { name: /Problèmes/ }).click();
    await expect(page.getByText('Les deux chargées lisent les mêmes newsletters sans le savoir')).toBeVisible();
    await page.waitForTimeout(500);
    await page.reload();
    await expect(page.getByLabel('Secteur')).toHaveValue('Appui aux PME (modifié)');
  });

  test('l’atelier : canvas, note depuis la conversation, étape déplacée vers un autre couloir, copilote', async ({ page }) => {
    await page.goto('/studio/atelier');
    const canvas = page.getByRole('application', { name: /Canvas du processus/ });
    await expect(canvas).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Étape 1 :/ })).toBeVisible();
    // Épingler un verbatim sur le canvas.
    const entree = page.getByRole('article').filter({ hasText: 'Le lundi matin' }).first();
    await entree.hover();
    await entree.getByRole('button', { name: /Canvas/ }).click();
    await expect(canvas.getByRole('button', { name: /Note : Le lundi matin/ })).toBeVisible();
    // Sélectionner une étape ouvre l'inspecteur.
    await canvas.getByRole('button', { name: /Étape 1 :/ }).click();
    await expect(page.getByLabel('Texte de l’étape')).toHaveValue(/messagerie/i);
    // Déplacer l'étape 1 dans le couloir du dessous : l'acteur change.
    const noeud = canvas.getByRole('button', { name: /Étape 1 :/ });
    const b = (await noeud.boundingBox())!;
    await page.mouse.move(b.x + 40, b.y + 20);
    await page.mouse.down();
    await page.mouse.move(b.x + 45, b.y + 80, { steps: 6 });
    await page.mouse.move(b.x + 45, b.y + 130, { steps: 6 });
    await page.mouse.up();
    await expect(page.getByLabel('Acteur')).toHaveValue('Chargée de veille B');
    // Copilote fondé sur des règles.
    await page.getByRole('tab', { name: /Copilote/ }).click();
    await expect(page.getByText('Proposé par règles').first()).toBeVisible();
    await expect(page.locator('.hx-suggestion').first()).toBeVisible();
  });

  test('l’analyse : propriété modifiée en ligne, survol croisé, décision prise dans le volet', async ({ page }) => {
    await page.goto('/studio/analyse');
    const table = page.getByRole('table', { name: 'Problèmes' });
    await expect(table).toBeVisible();
    await expect(page.getByRole('img', { name: /Carte des opportunités/ })).toBeVisible();
    // Monter la fréquence du dernier problème à 3 (propriété en ligne).
    await table.getByRole('button', { name: 'Fréquence : 3 sur 3' }).last().click();
    await expect(table.getByRole('group', { name: /Fréquence 3 sur 3/ }).last()).toBeVisible();
    // Survoler une solution éclaire ses problèmes.
    await page.locator('.hx-liste .hx-rang').filter({ hasText: 'Message automatique' }).hover();
    await expect(table.locator('tr.hx-eclaire')).toHaveCount(1);
    // Ouvrir la solution et l'écarter.
    await page.locator('.hx-liste .hx-rang').filter({ hasText: 'Lire ce que la caisse sait déjà' }).click();
    const volet = page.getByRole('complementary', { name: 'Fiche de la solution' });
    await expect(volet).toContainText('Pourquoi cette proposition');
    await volet.getByRole('button', { name: 'Écartée' }).click();
    await expect(volet.getByRole('button', { name: 'Écartée' })).toHaveAttribute('aria-pressed', 'true');
  });
});
