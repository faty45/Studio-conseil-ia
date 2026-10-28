import type { Pack, Question } from '../packs/schema';
import {
  LIBELLES_CATEGORIE,
  LIBELLES_DECISION,
  LIBELLES_STATUT_CAUSE,
  LIBELLES_STATUT_REPONSE,
  LIBELLES_TYPE_PREUVE,
  type Mission,
} from './types';

function dateFr(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Synthèse d'atelier en Markdown.
 * Trois registres séparés, comme exigé : constats (observé ou validé), hypothèses (déclaré, à vérifier, causes hypothèse),
 * recommandations (solutions retenues, avec hypothèses et limites). Aucun chiffre n'est inventé : seuls les textes saisis apparaissent.
 */
export function genererSynthese(mission: Mission, pack: Pack, questions: Question[]): string {
  const l: string[] = [];
  l.push(`# Synthèse d'atelier — ${mission.nom}`);
  l.push('');
  l.push(`Pack : ${pack.label} (version ${mission.packVersion}) · Créée le ${dateFr(mission.creeLe)} · Mise à jour le ${dateFr(mission.misAJourLe)}`);
  l.push('');
  l.push('> Document de travail produit par Studio Conseil IA. Les constats sont ce qui a été observé ou validé ensemble ; les hypothèses restent à vérifier ; les recommandations ont été retenues par la consultante et le client. Aucune estimation chiffrée n\'est fournie tant qu\'elle n\'a pas été mesurée.');
  l.push('');

  const citations = mission.cartes.filter((c) => c.type === 'citation');
  if (citations.length) {
    l.push('## Ce que le client a dit');
    l.push('');
    for (const c of citations) l.push(`> « ${c.texte} »`);
    l.push('');
  }

  l.push('## 1. Constats (observé ou validé ensemble)');
  l.push('');
  let nConstats = 0;
  for (const q of questions) {
    const r = mission.reponses[q.id];
    if (r && r.texte.trim() && (r.statut === 'observe' || r.statut === 'valide')) {
      l.push(`- **${q.texte}** ${r.texte.trim()} _(${LIBELLES_STATUT_REPONSE[r.statut]})_`);
      nConstats++;
    }
  }
  for (const c of mission.cartes.filter((c) => c.type === 'observation')) {
    l.push(`- ${c.texte} _(observation en atelier)_`);
    nConstats++;
  }
  if (!nConstats) l.push('_Aucun constat observé ou validé pour le moment._');
  l.push('');

  l.push('## 2. Hypothèses (déclaré, à vérifier)');
  l.push('');
  let nHyp = 0;
  for (const q of questions) {
    const r = mission.reponses[q.id];
    if (r && r.texte.trim() && (r.statut === 'declare' || r.statut === 'a_verifier')) {
      l.push(`- **${q.texte}** ${r.texte.trim()} _(${LIBELLES_STATUT_REPONSE[r.statut]})_`);
      nHyp++;
    }
  }
  for (const p of mission.problemes) {
    for (const cause of p.causes) {
      if (cause.statut === 'hypothese') {
        l.push(`- Cause possible de « ${p.texte} » : ${cause.texte} _(hypothèse)_`);
        nHyp++;
      }
    }
  }
  if (!nHyp) l.push('_Aucune hypothèse en attente._');
  l.push('');

  const etapes = mission.etapes.filter((e) => e.statut === 'accepte');
  l.push('## 3. Carte du processus (étapes acceptées)');
  l.push('');
  if (etapes.length) {
    etapes.forEach((e, i) => {
      const details = [e.acteur ? `qui : ${e.acteur}` : '', e.outil ? `outil : ${e.outil}` : ''].filter(Boolean).join(', ');
      l.push(`${i + 1}. ${e.texte}${details ? ` _(${details})_` : ''}`);
    });
  } else l.push('_Carte en cours de construction._');
  l.push('');

  l.push('## 4. Problèmes, preuves et causes');
  l.push('');
  if (mission.problemes.length) {
    for (const p of mission.problemes) {
      l.push(`### ${p.texte}`);
      if (p.preuves.length) {
        l.push('Preuves :');
        for (const pr of p.preuves) l.push(`- ${LIBELLES_TYPE_PREUVE[pr.type]} : ${pr.source}${pr.date ? ` (${pr.date})` : ''}`);
      } else l.push('_Aucune preuve rattachée : à compléter avant validation finale._');
      if (p.causes.length) {
        l.push('Causes :');
        for (const c of p.causes) l.push(`- ${c.texte} _(${LIBELLES_STATUT_CAUSE[c.statut]})_`);
      }
      l.push('');
    }
  } else {
    l.push('_Aucun problème formalisé._');
    l.push('');
  }

  l.push('## 5. Recommandations (retenues)');
  l.push('');
  const retenues = mission.solutions.filter((s) => s.decision === 'retenue');
  if (retenues.length) {
    for (const s of retenues) {
      l.push(`### ${s.titre} — ${LIBELLES_CATEGORIE[s.categorie]}`);
      l.push(s.detail);
      if (s.extraits.length) l.push(`Fondé sur : ${s.extraits.map((e) => `« ${e} »`).join(' ; ')}`);
      if (s.hypotheses.length) l.push(`Hypothèses : ${s.hypotheses.join(' ')}`);
      if (s.limites.length) l.push(`Limites : ${s.limites.join(' ')}`);
      if (s.prerequis.length) l.push(`Prérequis : ${s.prerequis.join(' ')}`);
      l.push('');
    }
  } else {
    l.push('_Aucune recommandation retenue pour le moment._');
    l.push('');
  }

  const autres = mission.solutions.filter((s) => s.decision !== 'retenue' && s.decision !== 'ecartee');
  if (autres.length) {
    l.push('## 6. Pistes non tranchées');
    l.push('');
    for (const s of autres) l.push(`- ${s.titre} _(${LIBELLES_DECISION[s.decision]})_`);
    l.push('');
  }

  l.push('---');
  l.push('Relu et validé par la consultante avant transmission : ☐');
  l.push('');
  return l.join('\n');
}

/** Guide d'action : les prochaines actions décidées, prêtes à être affichées au client. */
export function genererGuideAction(mission: Mission): string {
  const l: string[] = [];
  l.push(`# Guide d'action — ${mission.nom}`);
  l.push('');
  if (mission.actions.length) {
    l.push('## Les prochaines actions');
    l.push('');
    l.push('| # | Action | Qui | Pour quand |');
    l.push('|---|---|---|---|');
    mission.actions.forEach((a, i) => l.push(`| ${i + 1} | ${a.texte} | ${a.responsable || '—'} | ${a.echeance || '—'} |`));
    l.push('');
  } else {
    l.push('_Aucune action décidée pour le moment._');
    l.push('');
  }
  const retenues = mission.solutions.filter((s) => s.decision === 'retenue');
  if (retenues.length) {
    l.push('## Comment faire');
    l.push('');
    for (const s of retenues) {
      l.push(`### ${s.titre}`);
      l.push(s.detail);
      if (s.limites.length) l.push(`À garder en tête : ${s.limites.join(' ')}`);
      l.push('');
    }
  }
  if (mission.notesSuivi.trim()) {
    l.push('## Points de suivi');
    l.push('');
    l.push(mission.notesSuivi.trim());
    l.push('');
  }
  l.push('---');
  l.push('Ce guide est un document de travail : chaque action est à confirmer avec la personne responsable.');
  l.push('');
  return l.join('\n');
}
