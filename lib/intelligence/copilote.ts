import type { Mission } from '../domain/types';
import type { Pack, Question } from '../packs/schema';
import { classer } from './classification';
import { ABSOLUS, contientNombre, extraitAutour, termesTrouves } from './texte';

export type TypeSuggestion = 'question' | 'contradiction' | 'a_verifier' | 'signal' | 'manque';

export const LIBELLES_SUGGESTION: Record<TypeSuggestion, string> = {
  question: 'Question à poser',
  contradiction: 'Contradiction possible',
  a_verifier: 'À vérifier',
  signal: 'Cela ressemble à…',
  manque: 'Il manque',
};

export type Suggestion = {
  id: string;
  type: TypeSuggestion;
  titre: string;
  detail: string;
  /** La règle qui a produit la suggestion, en clair. */
  regle: string;
  /** Référence vers l'élément concerné (entrée, étape, problème, question). */
  cible?: { kind: 'entree' | 'etape' | 'probleme' | 'question'; id: string };
  priorite: 1 | 2 | 3;
};

/**
 * Copilote d'atelier fondé sur des règles : il relit ce qui est saisi et propose discrètement
 * des questions, des points à vérifier et des rapprochements avec la bibliothèque.
 * Il ne comprend pas le sens ; il repère des formes. Chaque suggestion dit quelle règle l'a produite.
 */
export function suggerer(mission: Mission, pack: Pack, questions: Question[], processusIds: string[] = []): Suggestion[] {
  const s: Suggestion[] = [];
  const textes = [...mission.journal.map((e) => ({ id: e.id, kind: 'entree' as const, texte: e.texte, type: e.type })), ...Object.entries(mission.reponses).map(([qid, r]) => ({ id: qid, kind: 'question' as const, texte: r.texte, type: 'reponse' as const }))];

  // 1. Signaux de problèmes universels dans les notes et réponses.
  const dejaProposes = new Set(mission.problemes.map((p) => p.universelId).filter(Boolean));
  const vus = new Set<string>();
  for (const t of textes) {
    if (!t.texte.trim()) continue;
    for (const c of classer(t.texte, processusIds, 2)) {
      if (dejaProposes.has(c.universel.id) || vus.has(c.universel.id) || c.score < 2) continue;
      vus.add(c.universel.id);
      s.push({
        id: `signal-${c.universel.id}`,
        type: 'signal',
        titre: c.universel.label,
        detail: `« ${c.extrait} » — ${c.universel.description} Question de confirmation : ${c.universel.questionDeConfirmation}`,
        regle: `Mots repérés : ${c.signaux.join(', ')}.`,
        cible: { kind: t.kind, id: t.id },
        priorite: 1,
      });
    }
  }

  // 2. Absolus : « toujours », « jamais » → demander un contre-exemple.
  for (const t of textes) {
    const abs = termesTrouves(t.texte, ABSOLUS);
    if (abs.length) {
      s.push({
        id: `absolu-${t.id}`,
        type: 'contradiction',
        titre: `« ${abs[0]} » : demander un contre-exemple`,
        detail: `« ${extraitAutour(t.texte, abs[0])} ». Les absolus cachent souvent une exception qui explique le problème.`,
        regle: 'Présence d’un mot absolu dans une déclaration.',
        cible: { kind: t.kind, id: t.id },
        priorite: 2,
      });
    }
  }

  // 3. Chiffres sans source dans les notes déclaratives.
  for (const e of mission.journal) {
    if ((e.type === 'note' || e.type === 'citation') && contientNombre(e.texte) && !mission.faits.some((f) => f.entreeId === e.id)) {
      s.push({
        id: `chiffre-${e.id}`,
        type: 'a_verifier',
        titre: 'Un chiffre sans source',
        detail: `« ${e.texte.slice(0, 120)}${e.texte.length > 120 ? '…' : ''} ». Demander d’où vient ce chiffre, ou prévoir un relevé pour le mesurer.`,
        regle: 'Nombre détecté dans une note qui n’est pas encore un fait avec source.',
        cible: { kind: 'entree', id: e.id },
        priorite: 2,
      });
    }
  }

  // 4. Étapes sans acteur ou sans outil.
  for (const et of mission.etapes.filter((x) => x.version === 'actuel' && x.statut !== 'rejete')) {
    if (!et.acteur.trim()) {
      s.push({ id: `acteur-${et.id}`, type: 'question', titre: 'Qui fait cette étape ?', detail: `Étape « ${et.texte} » sans acteur. Demander le rôle, pas le nom.`, regle: 'Étape acceptée sans acteur.', cible: { kind: 'etape', id: et.id }, priorite: 2 });
    }
  }

  // 5. Problèmes sans cause ni preuve.
  for (const p of mission.problemes) {
    if (p.causes.length === 0) {
      s.push({ id: `cause-${p.id}`, type: 'question', titre: 'Pourquoi, selon vous ?', detail: `Problème « ${p.texte} » sans cause candidate. Demander deux explications possibles et les noter comme hypothèses.`, regle: 'Problème sans cause.', cible: { kind: 'probleme', id: p.id }, priorite: 1 });
    }
    if (p.preuves.length === 0 && p.gravite >= 2) {
      s.push({ id: `preuve-${p.id}`, type: 'a_verifier', titre: 'Comment le savons-nous ?', detail: `Problème jugé ${p.gravite === 3 ? 'bloquant' : 'coûteux'} sans preuve rattachée. Une observation, un document ou un relevé le rendra défendable dans le diagnostic.`, regle: 'Problème de gravité élevée sans preuve.', cible: { kind: 'probleme', id: p.id }, priorite: 2 });
    }
  }

  // 6. Questions cœur non posées alors que la conversation avance.
  const nbEntrees = mission.journal.length;
  if (nbEntrees >= 3) {
    const prioritaires = ['q4', 'q6', 'q8'];
    for (const qid of prioritaires) {
      const q = questions.find((x) => x.id === qid);
      if (q && mission.trame.includes(qid) && !mission.reponses[qid]?.texte.trim()) {
        s.push({ id: `manque-${qid}`, type: 'manque', titre: 'Question de la trame non couverte', detail: q.texte, regle: 'La conversation avance (3 entrées ou plus) et une question structurante n’a pas de réponse.', cible: { kind: 'question', id: qid }, priorite: 3 });
      }
    }
  }

  // 7. Faits déclarés sans source.
  for (const f of mission.faits) {
    if (f.statut === 'declare' && !f.source.trim()) {
      s.push({ id: `source-${f.id}`, type: 'a_verifier', titre: 'Fait déclaré sans source', detail: `« ${f.texte} ». Qui l’affirme, et peut-on l’observer ?`, regle: 'Fait au statut « déclaré » sans source.', priorite: 3 });
    }
  }

  // Au plus deux suggestions par type, sauf les signaux et les manques : le copilote reste discret.
  const parType = new Map<TypeSuggestion, number>();
  const filtrees = s
    .sort((a, b) => a.priorite - b.priorite)
    .filter((x) => {
      if (x.type === 'signal' || x.type === 'manque') return true;
      const n = parType.get(x.type) ?? 0;
      parType.set(x.type, n + 1);
      return n < 2;
    });
  return filtrees.slice(0, 10);
}
