import { bibliotheque, type Patron } from '../bibliotheque';
import type { Client, Mission, Probleme, Solution } from '../domain/types';
import { genId } from '../domain/types';
import type { Pack } from '../packs/schema';
import { prioriser } from './priorisation';

export type Correspondance = {
  patron: Patron;
  problemes: Probleme[];
  score: number;
  explication: string[];
  outilsCompatibles: string[];
  outilDejaPresent: boolean;
};

/**
 * Recherche de correspondances explicable : problèmes de la mission → patrons de la bibliothèque.
 * Règles : +3 par problème universel commun, +2 si une catégorie d'outil requise est présente chez le client,
 * +1 si le processus du pack correspond, +1 si le métier figure dans les métiers connus du patron.
 * Aucun patron n'est proposé sans au moins un problème universel confirmé ou proposé.
 */
export function correspondances(mission: Mission, client: Client, pack: Pack): Correspondance[] {
  const resultats: Correspondance[] = [];
  const categoriesOutils = new Set(client.outils.map((o) => o.categorie));
  const metier = pack.id;
  for (const p of bibliotheque.patrons) {
    const problemes = mission.problemes.filter((pb) => pb.universelId && p.problemesUniversels.includes(pb.universelId));
    if (problemes.length === 0) continue;
    const explication: string[] = [];
    let score = problemes.length * 3;
    const universels = [...new Set(problemes.map((pb) => pb.universelId!))];
    explication.push(
      `Répond à ${problemes.length} problème(s) de la mission : ${problemes.map((pb) => `« ${pb.texte} »`).join(' ; ')} (${universels.map((u) => bibliotheque.problemesUniversels.find((x) => x.id === u)?.label ?? u).join(', ')}).`,
    );
    const outilsCompatibles = client.outils.filter((o) => p.outilsRequis.includes(o.categorie)).map((o) => o.nom);
    const outilDejaPresent = p.outilsRequis.length === 0 ? false : outilsCompatibles.length > 0;
    if (outilDejaPresent) {
      score += 2;
      explication.push(`Compatible avec ce que le client a déjà : ${outilsCompatibles.join(', ')}.`);
    } else if (p.outilsRequis.length > 0) {
      explication.push(`Demande un outil de type ${p.outilsRequis.join(' ou ')} : non repéré chez le client, à vérifier.`);
    } else {
      explication.push('Ne demande aucun outil particulier.');
    }
    const processusPack = (pack as Pack & { processusIds?: string[] }).processusIds ?? [];
    if (p.processusIds.some((x) => processusPack.includes(x))) {
      score += 1;
      explication.push('Processus cohérent avec le métier de la mission.');
    }
    if (p.metiers.includes(metier)) {
      score += 1;
      explication.push(`Déjà appliqué dans des missions de type « ${metier} » (exemple générique, sans données client).`);
    }
    if (p.necessiteIA) explication.push('Dépend d’un assistant IA : une alternative sans IA est fournie.');
    if (p.statut === 'candidat') explication.push('Patron candidat : vu une seule fois, à confirmer par une seconde mission.');
    resultats.push({ patron: p, problemes, score, explication, outilsCompatibles, outilDejaPresent });
  }
  categoriesOutils.clear();
  return resultats.sort((a, b) => b.score - a.score);
}

/** Transforme une correspondance en solution de mission, priorisée et expliquée. */
export function solutionDepuisCorrespondance(c: Correspondance, client: Client, iaConfiguree = false): Solution {
  const p = c.patron;
  const faisabilite = {
    effort: p.effort,
    coutMensuel: p.coutMensuel,
    dependances: [...p.prerequis],
    risques: [...p.risques],
    prerequis: [...p.prerequis],
    outilDejaPresent: c.outilDejaPresent,
  };
  const prio = prioriser({
    categorie: p.categorie,
    faisabilite,
    gravites: c.problemes.map((pb) => pb.gravite),
    frequences: c.problemes.map((pb) => pb.frequence),
    necessiteIA: p.necessiteIA,
    iaConfiguree,
  });
  const adaptation = p.adaptations[client.taille];
  return {
    id: genId(),
    titre: p.titre,
    categorie: p.categorie,
    detail: adaptation ? `${p.detail} Pour une structure de ${client.taille} personnes : ${adaptation}` : p.detail,
    problemeIds: c.problemes.map((pb) => pb.id),
    patronId: p.id,
    explication: [...c.explication, ...prio.explication],
    alternativeSansIA: p.alternativeSansIA,
    outilsCompatibles: c.outilsCompatibles,
    faisabilite,
    impact: prio.impact,
    priorite: prio.priorite,
    decision: 'a_decider',
    origine: 'bibliotheque',
    necessiteIA: p.necessiteIA,
  };
}

/** Nouvelles solutions à proposer (celles dont le patron n'est pas déjà dans la mission). */
export function proposerSolutions(mission: Mission, client: Client, pack: Pack, iaConfiguree = false): Solution[] {
  const dejaLa = new Set(mission.solutions.map((s) => s.patronId).filter(Boolean));
  return correspondances(mission, client, pack)
    .filter((c) => !dejaLa.has(c.patron.id))
    .map((c) => solutionDepuisCorrespondance(c, client, iaConfiguree));
}
