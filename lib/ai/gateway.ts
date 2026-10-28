import type { Pack } from '../packs/schema';
import type { Etape } from '../domain/types';
import { extraireEtapes, type TexteSource } from '../intelligence/processus';

/**
 * Passerelle IA indépendante du fournisseur.
 *
 * - Un seul point d'entrée pour toute aide à l'analyse ; la sortie est toujours une proposition
 *   (`statut: 'propose'`) que la consultante accepte ou rejette.
 * - L'application fonctionne entièrement sans fournisseur externe : le mode `regles` est actif par défaut.
 * - Adaptateurs réservés, non livrés : `anthropic` (API Messages, derrière une route serveur), `hermes`
 *   (Hermes Agent via un serveur MCP maison exposant seulement des outils de proposition).
 *   Ils ne s'activent que par configuration et n'agissent jamais sur les systèmes du client.
 */
export interface FournisseurIA {
  readonly nom: string;
  readonly libelle: string;
  disponible(): boolean;
  extraireEtapes(sources: TexteSource[], pack: Pack): Promise<Etape[]>;
}

export class FournisseurRegles implements FournisseurIA {
  readonly nom = 'regles';
  readonly libelle = 'Règles locales (découpage et vocabulaire)';
  disponible() {
    return true;
  }
  async extraireEtapes(sources: TexteSource[], pack: Pack) {
    return extraireEtapes(sources, pack);
  }
}

export class FournisseurNonConfigure implements FournisseurIA {
  constructor(
    readonly nom: string,
    readonly libelle: string,
  ) {}
  disponible() {
    return false;
  }
  async extraireEtapes(): Promise<Etape[]> {
    throw new Error(`Le fournisseur « ${this.libelle} » n'est pas configuré dans ce lot.`);
  }
}

const registre: Record<string, FournisseurIA> = {
  regles: new FournisseurRegles(),
  anthropic: new FournisseurNonConfigure('anthropic', 'Assistant IA (API Messages)'),
  hermes: new FournisseurNonConfigure('hermes', 'Hermes Agent (via MCP)'),
};

export function fournisseurs(): FournisseurIA[] {
  return Object.values(registre);
}

export function obtenirFournisseur(nom?: string): FournisseurIA {
  const f = nom ? registre[nom] : undefined;
  return f && f.disponible() ? f : registre.regles;
}

/** Vrai si un fournisseur d'IA externe est disponible. Faux dans ce lot : mode dégradé assumé. */
export function iaConfiguree(): boolean {
  return fournisseurs().some((f) => f.nom !== 'regles' && f.disponible());
}
