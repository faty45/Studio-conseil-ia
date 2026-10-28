import { bibliotheque, type ProblemeUniversel } from '../bibliotheque';
import { extraitAutour, termesTrouves } from './texte';

export type Classification = {
  universel: ProblemeUniversel;
  score: number;
  signaux: string[];
  extrait: string;
  /** Phrases d'explication lisibles par le client. */
  explication: string[];
};

/**
 * Classe un texte (problème, note, réponse) parmi les problèmes universels de la bibliothèque.
 * Règle : nombre de signaux lexicaux trouvés, bonus si le processus du pack correspond.
 * Toujours présenté comme une proposition à confirmer par la consultante.
 */
export function classer(texte: string, processusIds: string[] = [], max = 3): Classification[] {
  const resultats: Classification[] = [];
  for (const u of bibliotheque.problemesUniversels) {
    const signaux = termesTrouves(texte, u.signaux);
    if (signaux.length === 0) continue;
    const processusCommun = u.processusIds.some((p) => processusIds.includes(p));
    const score = signaux.length * 2 + (processusCommun ? 1 : 0);
    const explication = [
      `Mots repérés : ${signaux.map((s) => `« ${s} »`).join(', ')}.`,
      ...(processusCommun ? [`Processus cohérent avec le métier (${u.processusIds.filter((p) => processusIds.includes(p)).join(', ')}).`] : []),
      `À confirmer en atelier : ${u.questionDeConfirmation}`,
    ];
    resultats.push({ universel: u, score, signaux, extrait: extraitAutour(texte, signaux[0]), explication });
  }
  return resultats.sort((a, b) => b.score - a.score).slice(0, max);
}
