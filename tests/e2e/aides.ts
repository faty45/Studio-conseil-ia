import { expect, type Page } from '@playwright/test';

/** Charge les deux missions fictives depuis le cockpit. */
export async function chargerDemo(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Charger la démonstration' }).first().click();
  await expect(page.getByText('ARDAN (exemple fictif)').first()).toBeVisible();
}

export async function ouvrirPhase(page: Page, missionId: string, phase: string) {
  await page.goto(`/mission/${missionId}/${phase}`);
  await expect(page.getByRole('navigation', { name: 'Phases de la mission' }).first()).toBeVisible();
}
