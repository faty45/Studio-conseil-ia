import { test, expect } from '@playwright/test';

test('une nouvelle mission traverse les six phases avec le copilote et la bibliothèque', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Nouvelle mission' }).first().click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Nom du client').fill('Atelier Test (fictif)');
  await dialog.getByLabel('Secteur').fill('Artisanat');
  await dialog.getByLabel('Titre de la mission').fill('Diagnostic de test');
  await dialog.getByLabel('Trame métier').selectOption('boulangerie');
  await dialog.getByRole('button', { name: 'Créer et préparer' }).click();

  // Préparer
  await expect(page).toHaveURL(/\/preparer$/);
  await page.getByLabel('Objectif de la mission').fill('Comprendre où part le temps et proposer deux améliorations.');
  await page.getByText('Information et consentement.').click();
  await expect(page.getByRole('region', { name: 'Hypothèses de départ' }).locator('li').first()).toBeVisible();
  await page.getByRole('link', { name: 'Passer à l’atelier' }).click();

  // Atelier : une note déclenche le copilote (signal + absolu), puis un problème est créé.
  await expect(page).toHaveURL(/\/atelier$/);
  const saisie = page.getByLabel('Nouvelle entrée du journal');
  await saisie.fill('On recopie toujours les commandes WhatsApp à la main sur le cahier, c’est de la double saisie.');
  await page.getByRole('button', { name: 'Noter' }).click();
  await expect(page.getByRole('region', { name: 'Journal de l’atelier' }).getByRole('article')).toHaveCount(1);
  await expect(page.getByText('Cela ressemble à…').first()).toBeVisible();
  await expect(page.getByText('Contradiction possible').first()).toBeVisible();
  await page.getByRole('button', { name: 'Créer le problème' }).first().click();
  await expect(page.getByText('1 problèmes')).toBeVisible();
  // Une étape ajoutée à la main apparaît sur la carte.
  await page.getByRole('button', { name: 'Carte du processus' }).click();
  await page.getByLabel('Nouvelle étape').fill('Prendre la commande au téléphone');
  await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Carte du processus actuel' }).getByRole('button', { name: /Étape 1 : Prendre la commande/ })).toBeVisible();
  await page.getByLabel('Qui (rôle)').fill('Vendeuse');
  await page.getByRole('link', { name: 'Passer à l’analyse' }).click();

  // Analyser : le rattachement proposé est confirmé, des solutions sont proposées.
  await expect(page).toHaveURL(/\/analyser$/);
  const fiche = page.getByRole('region', { name: 'Fiche du problème' });
  await expect(fiche).toBeVisible();
  await fiche.getByRole('button', { name: 'Confirmer' }).first().click();
  await expect(fiche.getByText(/confirmé\./)).toBeVisible();
  const proposer = page.getByRole('button', { name: /^Proposer/ });
  await expect(proposer).toBeEnabled();
  await proposer.click();
  const solutions = page.getByRole('region', { name: 'Solutions candidates' });
  await expect(solutions.getByRole('article').first()).toBeVisible();
  await expect(solutions.getByText('Pourquoi cette proposition, et ses limites').first()).toBeVisible();
  await page.getByRole('link', { name: 'Passer à la décision' }).click();

  // Décider : retenir la première solution, créer l'action.
  await expect(page).toHaveURL(/\/decider$/);
  await page.getByRole('button', { name: 'Retenir' }).first().click();
  await page.getByRole('button', { name: 'Créer l’action' }).first().click();
  await expect(page.getByRole('region', { name: 'Plan d’action' })).toContainText('Mettre en place :');
  await page.getByRole('link', { name: 'Préparer la restitution' }).click();

  // Restituer : le diagnostic reprend la mission et la recommandation.
  await expect(page).toHaveURL(/\/restituer$/);
  const doc = page.getByRole('article', { name: 'Diagnostic' });
  await expect(doc).toContainText('Diagnostic de test');
  await expect(doc).toContainText('Recommandations retenues');
  await page.getByRole('link', { name: 'Passer au suivi' }).click();

  // Suivre : l'action est là, la solution peut être capitalisée.
  await expect(page).toHaveURL(/\/suivre$/);
  await expect(page.getByRole('region', { name: 'État des actions' })).toContainText('Mettre en place :');
  await expect(page.getByRole('region', { name: /Capitalisation intermétiers/ })).toContainText('Patron existant');

  // Retour au cockpit : la mission est listée avec sa phase.
  await page.goto('/');
  await expect(page.getByText('Diagnostic de test')).toBeVisible();
  await expect(page.getByText(/phase : Suivre/)).toBeVisible();
});
