import type { Pack } from '../packs/schema';
import type { Etape } from '../domain/types';
import { extraireEtapes, type TexteSource } from '../domain/extraction';

/**
 * Passerelle IA indépendante du fournisseur.
 *
 * Principes (voir docs/confrontation-perplexity.md § 4.5) :
 * - un seul point d'entrée pour toute aide à l'analyse ;
 * - chaque fournisseur est un adaptateur qui respecte la même interface ;
 * - la sortie est toujours une proposition (`statut: 'propose'`) que la consultante accepte ou rejette ;
 * - l'application fonctionne entièrement sans fournisseur externe (`regles`).
 *
 * Adaptateurs prévus et non livrés dans ce lot : `anthropic` (API Messages), `hermes` (Hermes Agent via MCP).
 * Ils ne sont activés que par configuration et n'agissent jamais sur les systèmes du client.
 */
export interface FournisseurIA {
  readonly nom: string;
  /** Vrai si l'adaptateur peut être utilisé dans l'environnement courant. */
  disponible(): boolean;
  extraireEtapes(sources: TexteSource[], pack: Pack): Promise<Etape[]>;
}

export class FournisseurRegles implements FournisseurIA {
  readonly nom = 'regles';
  disponible() {
    return true;
  }
  async extraireEtapes(sources: TexteSource[], pack: Pack) {
    return extraireEtapes(sources, pack);
  }
}

/** Adaptateur réservé : le lot « carte assistée par IA » l'implémentera derrière une route serveur. */
export class FournisseurNonConfigure implements FournisseurIA {
  constructor(readonly nom: string) {}
  disponible() {
    return false;
  }
  async extraireEtapes(): Promise<Etape[]> {
    throw new Error(`Le fournisseur « ${this.nom} » n'est pas configuré dans ce lot.`);
  }
}

const registre: Record<string, FournisseurIA> = {
  regles: new FournisseurRegles(),
  anthropic: new FournisseurNonConfigure('anthropic'),
  hermes: new FournisseurNonConfigure('hermes'),
};

export function fournisseurs(): FournisseurIA[] {
  return Object.values(registre);
}

/** Retourne le fournisseur demandé s'il est disponible, sinon les règles locales. */
export function obtenirFournisseur(nom?: string): FournisseurIA {
  const f = nom ? registre[nom] : undefined;
  return f && f.disponible() ? f : registre.regles;
}
