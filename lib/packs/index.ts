import core from './core.json';
import ardan from './ardan.json';
import boulangerie from './boulangerie.json';
import general from './general.json';
import { CoreSchema, PackSchema, type Core, type Pack, type Question } from './schema';

/**
 * Les packs métier sont des fichiers JSON validés au chargement.
 * Ajouter un métier = ajouter un fichier JSON et l'inscrire dans PACK_SOURCES.
 * Le composant d'atelier ne connaît pas les métiers : il lit `getPack()`.
 */
const PACK_SOURCES: unknown[] = [ardan, boulangerie, general];

export const coreQuestions: Core = CoreSchema.parse(core);

export const packs: Pack[] = PACK_SOURCES.map((p) => PackSchema.parse(p));

export function getPack(id: string): Pack {
  return packs.find((p) => p.id === id) ?? packs[packs.length - 1];
}

/** Questions cœur puis questions du pack, dans l'ordre d'atelier. */
export function questionsPour(pack: Pack): Question[] {
  return [...coreQuestions.questions, ...pack.questions];
}

export { PackSchema, CoreSchema } from './schema';
export type { Pack, Question, Recette, CategorieSolution } from './schema';
