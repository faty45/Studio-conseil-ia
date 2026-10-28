import type { Faisabilite, Niveau, Priorite } from '../domain/types';
import type { CategorieSolution } from '../packs/schema';

export type Priorisation = {
  priorite: Priorite;
  /** Score d'impact 1 à 3 et score d'effort 1 à 3, pour la matrice. */
  impact: Niveau;
  effort: Niveau;
  explication: string[];
};

const EFFORT_NUM: Record<Faisabilite['effort'], Niveau> = { faible: 1, moyen: 2, fort: 3 };
const COUT_NUM: Record<Faisabilite['coutMensuel'], number> = { nul: 0, faible: 0.5, moyen: 1, eleve: 1.5 };

/**
 * Priorisation expliquée. Règles simples et lisibles :
 * - impact = max(gravité, fréquence) des problèmes adressés, +1 si plusieurs problèmes ;
 * - effort = effort du patron, allégé si l'outil est déjà présent, alourdi par le coût mensuel ;
 * - quick win si effort faible et coût nul ou faible ; spécialiste si la solution passe par un prestataire ;
 *   à construire si l'effort est fort ou si la solution dépend d'une IA non configurée ; sinon à planifier.
 */
export function prioriser(args: {
  categorie: CategorieSolution;
  faisabilite: Faisabilite;
  gravites: Niveau[];
  frequences: Niveau[];
  necessiteIA: boolean;
  iaConfiguree: boolean;
}): Priorisation {
  const { categorie, faisabilite, gravites, frequences, necessiteIA, iaConfiguree } = args;
  const explication: string[] = [];

  const base = Math.max(1, ...gravites, ...frequences) as Niveau;
  let impact: Niveau = base;
  if (gravites.length > 1 && impact < 3) impact = (impact + 1) as Niveau;
  explication.push(
    gravites.length
      ? `Impact ${impact}/3 : ${gravites.length} problème(s) adressé(s), gravité maximale ${Math.max(...gravites)}, fréquence maximale ${Math.max(...frequences)}.`
      : 'Impact 1/3 : aucun problème rattaché, à relier pour mieux évaluer.',
  );

  let effortNum = EFFORT_NUM[faisabilite.effort] + COUT_NUM[faisabilite.coutMensuel];
  if (faisabilite.outilDejaPresent) {
    effortNum -= 0.5;
    explication.push('Effort allégé : l’outil nécessaire est déjà présent chez le client.');
  }
  if (necessiteIA && !iaConfiguree) {
    effortNum += 1;
    explication.push('Effort alourdi : dépend d’un assistant IA non configuré (mode dégradé : voir l’alternative sans IA).');
  }
  const effort = (effortNum <= 1.5 ? 1 : effortNum <= 2.5 ? 2 : 3) as Niveau;
  explication.push(`Effort ${effort}/3 : ${faisabilite.effort}, coût mensuel ${faisabilite.coutMensuel}${faisabilite.dependances.length ? `, ${faisabilite.dependances.length} dépendance(s)` : ''}.`);

  let priorite: Priorite;
  if (categorie === 'prestataire') {
    priorite = 'specialiste';
    explication.push('Classée « avec un spécialiste » : la solution passe par un prestataire ; à envisager après les mesures.');
  } else if (necessiteIA && !iaConfiguree) {
    priorite = 'a_construire';
    explication.push('À construire : dépend d’un assistant IA à configurer ; en attendant, l’alternative sans IA s’applique.');
  } else if (effort === 1 && impact >= 2) {
    priorite = 'quick_win';
    explication.push('Quick win : effort faible pour un impact réel ; réalisable avec ce qui existe.');
  } else if (effort === 3) {
    priorite = 'a_construire';
    explication.push('À construire : demande un chantier ou une dépendance à mettre en place.');
  } else {
    priorite = 'a_planifier';
    explication.push('À planifier : utile, mais demande du temps ou un accord à obtenir.');
  }

  return { priorite, impact, effort, explication };
}
