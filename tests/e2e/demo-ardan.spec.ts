import { test, expect } from '@playwright/test';
import { chargerDemo, ouvrirPhase } from './aides';

const ID = 'demo-ardan-veille';

test.describe('Parcours de démonstration ARDAN (fictif)', () => {
  test.beforeEach(async ({ page }) => {
    await chargerDemo(page);
  });

  test('le cockpit montre les deux clients fictifs et leurs missions', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Vos clients et vos missions' })).toBeVisible();
    await expect(page.getByText('Boulangerie du Marché (exemple fictif)').first()).toBeVisible();
    await expect(page.getByText('Automatiser la veille professionnelle')).toBeVisible();
    await expect(page.getByText('Missions en cours')).toBeVisible();
  });

  test('préparer : fiche mission, hypothèses, trame et préparation intelligente', async ({ page }) => {
    await ouvrirPhase(page, ID, 'preparer');
    await expect(page.getByLabel('Objectif de la mission')).not.toBeEmpty();
    await expect(page.getByRole('region', { name: 'Hypothèses de départ' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Trame de l’atelier' })).toContainText('question(s) retenue(s)');
    await expect(page.getByText('Problèmes fréquents dans ce métier')).toBeVisible();
    await expect(page.getByText('Patrons compatibles avec les outils déjà présents')).toBeVisible();
  });

  test('atelier : trame couverte, copilote actif, carte du processus manipulable', async ({ page }) => {
    await ouvrirPhase(page, ID, 'atelier');
    await expect(page.getByText(/12\/12 questions couvertes/)).toBeVisible();
    await expect(page.getByRole('region', { name: 'Journal de l’atelier' })).toBeVisible();
    // Le copilote propose au moins une suggestion fondée sur une règle explicite.
    await expect(page.locator('.suggestion').first()).toBeVisible();
    await expect(page.locator('.suggestion .regle').first()).toContainText('Règle :');
    // Carte du processus : six étapes acceptées, un nœud sélectionnable.
    await page.getByRole('button', { name: 'Carte du processus' }).click();
    const carte = page.getByRole('img', { name: 'Carte du processus actuel' });
    await expect(carte).toBeVisible();
    await carte.getByRole('button', { name: /Étape 1 :/ }).click();
    await expect(page.getByLabel('Ce qui est fait')).toHaveValue(/messagerie/i);
    // Bascule vers la cible : étapes nouvelles.
    await page.getByRole('button', { name: /^Cible/ }).click();
    await expect(page.getByRole('img', { name: 'Carte du processus cible' })).toBeVisible();
    await expect(page.getByText(/nouvelle\(s\)/)).toBeVisible();
  });

  test('analyser : problèmes rattachés, solutions expliquées, matrice', async ({ page }) => {
    await ouvrirPhase(page, ID, 'analyser');
    await expect(page.getByRole('region', { name: 'Problèmes formalisés' })).toContainText('Coûteux');
    await expect(page.getByRole('img', { name: 'Matrice impact et effort des solutions' })).toBeVisible();
    const solutions = page.getByRole('region', { name: 'Solutions candidates' });
    await expect(solutions.getByRole('article').first()).toBeVisible();
    await solutions.getByText('Pourquoi cette proposition, et ses limites').first().click();
    await expect(solutions.getByText(/Impact \d\/3/).first()).toBeVisible();
  });

  test('décider : retenir, écarter, plan d’action et journal des décisions', async ({ page }) => {
    await ouvrirPhase(page, ID, 'decider');
    await expect(page.getByText('Recommandations retenues')).toBeVisible();
    const avant = await page.getByRole('region', { name: 'Journal des décisions' }).locator('li').count();
    // Écarte la solution « avec un spécialiste » puis vérifie la trace.
    const specialiste = page.getByRole('region', { name: /Avec un spécialiste/ });
    await specialiste.getByRole('button', { name: 'Écarter' }).first().click();
    await expect(specialiste.getByText('Écartée')).toBeVisible();
    await expect(page.getByRole('region', { name: 'Journal des décisions' }).locator('li')).toHaveCount(avant + 1);
    await expect(page.getByRole('region', { name: 'Plan d’action' })).toContainText('Créer cinq règles de tri');
  });

  test('restituer : diagnostic structuré, cartes, validation', async ({ page }) => {
    await ouvrirPhase(page, ID, 'restituer');
    const doc = page.getByRole('article', { name: 'Diagnostic' });
    await expect(doc.getByRole('heading', { level: 1 })).toContainText('Diagnostic — ARDAN');
    await expect(doc).toContainText('Résumé');
    await expect(doc).toContainText('Recommandations retenues');
    await expect(doc).toContainText('Plan d’action');
    await expect(doc).toContainText('Limites');
    await page.getByRole('button', { name: 'Cartes aujourd’hui / cible' }).click();
    await expect(page.getByRole('img', { name: 'Carte du processus cible' })).toBeVisible();
    await page.getByRole('button', { name: 'Diagnostic' }).click();
    await page.getByLabel('Synthèse relue et validée avec le client').check();
    await expect(page.getByText(/Validé avec le client le/)).toBeVisible();
  });

  test('suivre : résultats, actions, capitalisation', async ({ page }) => {
    await ouvrirPhase(page, ID, 'suivre');
    await expect(page.getByText('Actions faites')).toBeVisible();
    await expect(page.getByRole('region', { name: 'Résultats avant / après' })).toContainText('J+30');
    await page.getByLabel(/Relevé J\+30 pour/).first().fill('40');
    await expect(page.getByRole('img', { name: /J\+30 : 40/ })).toBeVisible();
    await expect(page.getByRole('region', { name: /Capitalisation intermétiers/ })).toContainText('Patron existant');
  });
});
