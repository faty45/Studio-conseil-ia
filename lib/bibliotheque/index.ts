import data from './bibliotheque.json';
import { BibliothequeSchema, type Bibliotheque, type Patron, type ProblemeUniversel, type Processus } from './schema';

/**
 * Bibliothèque intermétiers : processus, problèmes universels, patrons de solution.
 * Contenu générique, écrit à la main, sans aucune donnée client. Validé par schéma au chargement.
 * Les patrons sont versionnés ; un patron « candidat » vient d'une mission et attend confirmation par une seconde mission.
 */
export const bibliotheque: Bibliotheque = BibliothequeSchema.parse(data);

export function processus(id: string): Processus | undefined {
  return bibliotheque.processus.find((p) => p.id === id);
}

export function problemeUniversel(id: string): ProblemeUniversel | undefined {
  return bibliotheque.problemesUniversels.find((p) => p.id === id);
}

export function patron(id: string): Patron | undefined {
  return bibliotheque.patrons.find((p) => p.id === id);
}

export function patronsPourProbleme(universelId: string): Patron[] {
  return bibliotheque.patrons.filter((p) => p.problemesUniversels.includes(universelId));
}

export type { Bibliotheque, Patron, ProblemeUniversel, Processus } from './schema';
