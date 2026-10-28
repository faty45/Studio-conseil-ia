import { expect, test, type Page } from '@playwright/test';

/** Parcours ARDAN : critères d'acceptation 1, 2, 3 et 5 de l'issue #2. */

async function creerMission(page: Page, nom: string, pack: string) {
  await page.goto('/');
  await page.getByRole('button', { name: /Démarrer/ }).click();
  await page.getByLabel('Nom de la mission').fill(nom);
  await page.getByLabel('Pack métier').selectOption(pack);
  await page.getByRole('button', { name: 'Ouvrir l’atelier' }).click();
  await expect(page).toHaveURL(/\/mission\/[^/]+\/atelier$/);
}

export async function onglet(page: Page, nom: 'Atelier' | 'Trouver' | 'Suivre') {
  await page.getByRole('navigation', { name: 'Étapes de la mission' }).getByRole('link', { name: new RegExp(nom) }).click();
}

test.describe('ARDAN — atelier de veille', () => {
  test('crée la mission, enregistre des réponses, reprend après rechargement', async ({ page }) => {
    await creerMission(page, 'ARDAN — veille', 'ardan');
    await expect(page.getByText('ARDAN — Veille · version')).toBeVisible();
    await expect(page.getByLabel('Choisir une question').getByRole('tab')).toHaveCount(12);

    await page.getByLabel(/1\. Quel résultat/).fill('Gagner du temps sur le tri de la veille');
    await page.getByLabel('D’où vient cette information ?').selectOption('declare');
    await page.getByRole('tab', { name: 'Question 4' }).click();
    await page
      .getByLabel(/4\. Quelles sont les étapes/)
      .fill("D'abord la chargée de veille ouvre la messagerie, puis elle lit les newsletters, ensuite elle trie par thème dans un tableur, enfin elle envoie le bulletin aux destinataires");
    await page.getByLabel('D’où vient cette information ?').selectOption('observe');
    await page.getByRole('tab', { name: 'Question 6' }).click();
    await page.getByLabel(/6\. Qu'est-ce qui prend du temps/).fill('On relit deux fois les mêmes newsletters et on perd du temps à trier la boîte mail.');
    await page.getByLabel('D’où vient cette information ?').selectOption('observe');
    await expect(page.getByText('3 / 12 répondues')).toBeVisible();

    await page.reload();
    await expect(page.getByText('3 / 12 répondues')).toBeVisible();
    await page.getByRole('tab', { name: 'Question 6, répondue' }).click();
    await expect(page.getByLabel(/6\. Qu'est-ce qui prend du temps/)).toHaveValue(/relit deux fois/);

    await page.goto('/');
    await expect(page.getByRole('listitem').filter({ hasText: 'ARDAN — veille' })).toBeVisible();
  });

  test('propose une carte à partir des notes, puis corrige ordre et texte à la main', async ({ page }) => {
    await creerMission(page, 'ARDAN — carte', 'ardan');
    await page.getByRole('tab', { name: 'Question 4' }).click();
    await page
      .getByLabel(/4\. Quelles sont les étapes/)
      .fill("D'abord la chargée de veille ouvre la messagerie, puis elle lit les newsletters, ensuite elle trie par thème dans un tableur, enfin elle envoie le bulletin aux destinataires");
    await page.getByLabel('Type de carte').selectOption('observation');
    await page.getByLabel('Nouvelle carte').fill('La responsable relit le bulletin avant envoi');
    await page.getByRole('button', { name: 'Ajouter la carte' }).click();

    await page.getByRole('button', { name: 'Proposer des étapes à partir des notes' }).click();
    const etapes = page.getByLabel('Étapes du processus').getByRole('listitem');
    await expect(etapes).toHaveCount(5);
    await expect(etapes.first()).toHaveAttribute('data-statut', 'propose');
    await expect(page.getByLabel('Qui fait l’étape 1')).toHaveValue('Chargée de veille');
    await expect(page.getByLabel('Outil de l’étape 1')).toHaveValue('Messagerie');

    const accepter = page.getByRole('button', { name: 'Accepter' });
    while ((await accepter.count()) > 0) {
      await accepter.first().click();
    }
    await expect(page.getByText('5 étape(s) acceptée(s)')).toBeVisible();

    await page.getByLabel('Texte de l’étape 2').fill('Elle lit les newsletters et les alertes');
    await page.getByRole('button', { name: 'Monter l’étape 2' }).click();
    await expect(page.getByLabel('Texte de l’étape 1')).toHaveValue('Elle lit les newsletters et les alertes');

    await page.reload();
    await expect(page.getByLabel('Texte de l’étape 1')).toHaveValue('Elle lit les newsletters et les alertes');
  });

  test('fonctionne sans IA : marque des questions « à vérifier » et produit une synthèse par registre', async ({ page }) => {
    await creerMission(page, 'ARDAN — synthèse', 'ardan');
    await page.getByLabel(/1\. Quel résultat/).fill('Diffuser plus vite');
    await expect(page.getByLabel('D’où vient cette information ?')).toHaveValue('a_verifier');
    await page.getByRole('tab', { name: 'Question 6' }).click();
    await page.getByLabel(/6\. Qu'est-ce qui prend du temps/).fill('On relit deux fois les mêmes newsletters.');
    await page.getByLabel('D’où vient cette information ?').selectOption('valide');
    await page.getByLabel('Type de carte').selectOption('citation');
    await page.getByLabel('Nouvelle carte').fill('Le lundi je passe la matinée à trier.');
    await page.getByRole('button', { name: 'Ajouter la carte' }).click();

    await onglet(page, 'Trouver');
    await page.getByLabel('Nouveau problème').fill('Double lecture des newsletters');
    await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
    await page.getByLabel('Nouvelle cause').fill('Sources non réparties entre les deux personnes');
    await page.getByRole('button', { name: 'Ajouter la cause' }).click();
    await expect(page.getByLabel(/Statut de la cause/)).toHaveValue('hypothese');

    await page.getByRole('button', { name: 'Chercher des pistes dans les observations' }).click();
    const piste = page.getByRole('article', { name: /Piste : Éviter la double lecture/ });
    await expect(piste).toBeVisible();
    await expect(piste).toContainText('Fondé sur');
    await expect(piste).toContainText('relit deux fois');
    await piste.getByLabel('Décision').selectOption('retenue');

    await onglet(page, 'Suivre');
    await page.getByRole('button', { name: 'Afficher la synthèse' }).click();
    const synthese = page.getByLabel('Aperçu de la synthèse');
    const texte = (await synthese.textContent()) ?? '';
    const constats = texte.split('## 1. Constats')[1].split('## 2.')[0];
    const hypotheses = texte.split('## 2. Hypothèses')[1].split('## 3.')[0];
    const reco = texte.split('## 5. Recommandations')[1];
    expect(constats).toContain('relit deux fois');
    expect(hypotheses).toContain('Diffuser plus vite');
    expect(hypotheses).toContain('Sources non réparties');
    expect(reco).toContain('Éviter la double lecture');
    expect(texte).toContain('« Le lundi je passe la matinée à trier. »');

    await expect(page.getByRole('button', { name: 'Exporter la synthèse (.md)' })).toBeDisabled();
    await page.getByLabel('J’ai relu la synthèse et le guide avant export').check();
    const telechargement = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Exporter la synthèse (.md)' }).click();
    expect((await telechargement).suggestedFilename()).toBe('synthese-ardan-synthese.md');
  });
});
