import { expect, test, type Page } from '@playwright/test';

/** Parcours boulangerie : critères 4 (pistes sourcées, sans gain inventé), 7 (pack par configuration) et guide d'action. */

async function creerMission(page: Page, nom: string) {
  await page.goto('/');
  await page.getByRole('button', { name: /Démarrer/ }).click();
  await page.getByLabel('Nom de la mission').fill(nom);
  await page.getByLabel('Pack métier').selectOption('boulangerie');
  await page.getByRole('button', { name: 'Ouvrir l’atelier' }).click();
  await expect(page).toHaveURL(/\/mission\/[^/]+\/atelier$/);
}

async function onglet(page: Page, nom: 'Atelier' | 'Trouver' | 'Suivre') {
  await page.getByRole('navigation', { name: 'Étapes de la mission' }).getByRole('link', { name: new RegExp(nom) }).click();
}

test.describe('Boulangerie — découverte', () => {
  test('le pack boulangerie vient de la configuration et ses questions s’affichent', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Démarrer/ }).click();
    await page.getByLabel('Pack métier').selectOption('boulangerie');
    await expect(page.getByText('Identifier les difficultés réelles du fournil')).toBeVisible();
    await page.getByLabel('Nom de la mission').fill('Boulangerie du centre');
    await page.getByRole('button', { name: 'Ouvrir l’atelier' }).click();
    await expect(page).toHaveURL(/atelier$/);
    await page.getByRole('tab', { name: 'Question 9' }).click();
    await expect(page.getByText('9. Comment arrivent les demandes et les commandes ?')).toBeVisible();
  });

  test('propose deux pistes fondées sur les observations, sans chiffre inventé, puis un guide d’action', async ({ page }) => {
    await creerMission(page, 'Boulangerie');

    await onglet(page, 'Trouver');
    await page.getByRole('button', { name: 'Chercher des pistes dans les observations' }).click();
    await expect(page.getByText(/Aucune nouvelle piste/)).toBeVisible();
    await expect(page.getByRole('article', { name: /Piste :/ })).toHaveCount(0);

    await onglet(page, 'Atelier');
    await page.getByRole('tab', { name: 'Question 6' }).click();
    await page.getByLabel(/6\. Qu'est-ce qui prend du temps/).fill('Le lundi on jette beaucoup d’invendus et les commandes par téléphone sont parfois oubliées.');
    await page.getByLabel('D’où vient cette information ?').selectOption('observe');

    await onglet(page, 'Trouver');
    await page.getByRole('button', { name: 'Chercher des pistes dans les observations' }).click();
    const invendus = page.getByRole('article', { name: /Piste : Cahier des invendus/ });
    const commandes = page.getByRole('article', { name: /Piste : Un seul canal/ });
    await expect(invendus).toBeVisible();
    await expect(commandes).toBeVisible();
    await expect(invendus).toContainText('Fondé sur');
    await expect(invendus).toContainText('invendus');
    await expect(invendus).toContainText('Hypothèses');
    await expect(invendus).toContainText('Limites');
    await expect(invendus).not.toContainText(/\d+\s?(€|%)/);
    await invendus.getByLabel('Décision').selectOption('retenue');
    await commandes.getByLabel('Décision').selectOption('plus_tard');

    await onglet(page, 'Suivre');
    await page.getByLabel('Action', { exact: true }).fill('Imprimer la feuille des invendus');
    await page.getByLabel('Responsable (rôle)').fill('Vendeuse');
    await page.getByLabel('Échéance').fill('lundi');
    await page.getByRole('button', { name: 'Ajouter l’action' }).click();
    await page.getByRole('button', { name: 'Afficher le guide d’action' }).click();
    const guide = (await page.getByLabel('Aperçu du guide d’action').textContent()) ?? '';
    expect(guide).toContain('| 1 | Imprimer la feuille des invendus | Vendeuse | lundi |');
    expect(guide).toContain('Cahier des invendus');
    expect(guide).not.toContain('Un seul canal');
  });
});
