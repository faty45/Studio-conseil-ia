import type { Pack, Recette } from '../packs/schema';
import type { Mission, Solution } from './types';
import { genId } from './types';
import type { TexteSource } from './extraction';

function normaliser(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Textes exploitables d'une mission : réponses et cartes, avec leur identifiant. */
export function textesDeMission(mission: Mission): TexteSource[] {
  const sources: TexteSource[] = [];
  for (const [qid, r] of Object.entries(mission.reponses)) {
    if (r.texte.trim() && r.statut !== 'non_applicable') sources.push({ id: 'reponse:' + qid, texte: r.texte });
  }
  for (const c of mission.cartes) sources.push({ id: 'carte:' + c.id, texte: c.texte });
  return sources;
}

export type Correspondance = { recette: Recette; sources: string[]; extraits: string[]; score: number };

/**
 * Cherche, dans les observations d'une mission, les mots-clés des recettes du pack.
 * Une recette n'est proposée que si au moins une observation la justifie : aucune piste sans source.
 */
export function correspondances(mission: Mission, pack: Pack): Correspondance[] {
  const sources = textesDeMission(mission);
  const resultats: Correspondance[] = [];
  for (const recette of pack.recettes) {
    const ids = new Set<string>();
    const extraits: string[] = [];
    let score = 0;
    for (const src of sources) {
      const texteN = normaliser(src.texte);
      for (const mot of recette.motsCles) {
        if (texteN.includes(normaliser(mot))) {
          score += 1;
          if (!ids.has(src.id)) {
            ids.add(src.id);
            extraits.push(extrait(src.texte, mot));
          }
        }
      }
    }
    if (score > 0) resultats.push({ recette, sources: [...ids], extraits, score });
  }
  return resultats.sort((a, b) => b.score - a.score);
}

function extrait(texte: string, mot: string): string {
  const idx = normaliser(texte).indexOf(normaliser(mot));
  if (idx < 0) return texte.slice(0, 120);
  const debut = Math.max(0, idx - 50);
  const fin = Math.min(texte.length, idx + mot.length + 60);
  return (debut > 0 ? '…' : '') + texte.slice(debut, fin).trim() + (fin < texte.length ? '…' : '');
}

/** Transforme les correspondances en solutions « suggestion », sans écraser celles déjà présentes. */
export function suggererSolutions(mission: Mission, pack: Pack): Solution[] {
  const existantes = new Set(mission.solutions.map((s) => s.recetteId).filter(Boolean));
  return correspondances(mission, pack)
    .filter((c) => !existantes.has(c.recette.id))
    .map((c) => ({
      id: genId(),
      titre: c.recette.titre,
      categorie: c.recette.categorie,
      detail: c.recette.detail,
      hypotheses: c.recette.hypotheses,
      limites: c.recette.limites,
      prerequis: c.recette.prerequis,
      sources: c.sources,
      extraits: c.extraits,
      decision: 'a_decider',
      origine: 'suggestion',
      recetteId: c.recette.id,
    }));
}
