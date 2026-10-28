import type { Client, Mission } from './types';
import {
  LIBELLES_CATEGORIE,
  LIBELLES_DECISION,
  LIBELLES_FREQUENCE,
  LIBELLES_GRAVITE,
  LIBELLES_PRIORITE,
  LIBELLES_STATUT_CAUSE,
  LIBELLES_STATUT_FAIT,
  LIBELLES_STATUT_HYPOTHESE,
  LIBELLES_TYPE_PREUVE,
} from './types';
import type { Pack } from '../packs/schema';
import { diffProcessus } from '../intelligence/processus';
import { problemeUniversel } from '../bibliotheque';

function dateFr(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Diagnostic de mission en Markdown, structuré comme un livrable de cabinet :
 * résumé, contexte, méthode, constats, carte actuelle et cible, problèmes priorisés, recommandations argumentées,
 * quick wins, plan d'action, mesures, limites. Aucun chiffre n'est produit par l'outil : seuls les relevés saisis apparaissent.
 */
export function genererDiagnostic(mission: Mission, client: Client, pack: Pack): string {
  const l: string[] = [];
  const retenues = mission.solutions.filter((s) => s.decision === 'retenue');
  const quickWins = retenues.filter((s) => s.priorite === 'quick_win');
  const diff = diffProcessus(mission.etapes);
  const actuel = mission.etapes.filter((e) => e.version === 'actuel' && e.statut === 'accepte');
  const cible = mission.etapes.filter((e) => e.version === 'cible' && e.statut === 'accepte');
  const problemesTries = [...mission.problemes].sort((a, b) => b.gravite * b.frequence - a.gravite * a.frequence);

  l.push(`# Diagnostic — ${client.nom}`);
  l.push('');
  l.push(`**Mission :** ${mission.titre}  `);
  l.push(`**Secteur :** ${client.secteur} · **Taille :** ${client.taille} personnes · **Trame :** ${pack.label}  `);
  l.push(`**Atelier :** ${dateFr(mission.dateAtelier) || 'date à préciser'} · **Document mis à jour le :** ${dateFr(mission.misAJourLe)}`);
  if (client.fictif) l.push('', '> Données fictives de démonstration. Aucun client réel.');
  l.push('');

  l.push('## 1. Résumé');
  l.push('');
  l.push(`Objectif de la mission : ${mission.objectif || 'à préciser'}.`);
  l.push('');
  if (problemesTries.length) {
    l.push(`${problemesTries.length} problème(s) formalisé(s), dont ${problemesTries.filter((p) => p.gravite === 3).length} jugé(s) bloquant(s). ${retenues.length} recommandation(s) retenue(s), dont ${quickWins.length} quick win(s) réalisable(s) avec les outils déjà présents.`);
  } else l.push('_Aucun problème formalisé pour le moment._');
  l.push('');

  l.push('## 2. Contexte et enjeux');
  l.push('');
  if (client.contexte) l.push(client.contexte, '');
  if (client.enjeux.length) {
    l.push('Enjeux exprimés :');
    for (const e of client.enjeux) l.push(`- ${e}`);
    l.push('');
  }
  if (client.partiesPrenantes.length) {
    l.push('| Rôle | Attentes | Influence |', '|---|---|---|');
    for (const p of client.partiesPrenantes) l.push(`| ${p.role} | ${p.attentes} | ${p.influence} |`);
    l.push('');
  }
  if (client.outils.length) {
    l.push(`Outils déjà présents : ${client.outils.map((o) => o.nom).join(', ')}.`);
    l.push('');
  }

  l.push('## 3. Méthode');
  l.push('');
  l.push(`Atelier de découverte fondé sur ${mission.trame.length} questions (trame « ${pack.label} »), observation déclarative et consentie${mission.consentementObservation ? ' (information des participants faite)' : ''}, aucune capture d'écran ni surveillance. Les constats distinguent ce qui est déclaré, observé et vérifié. Les rapprochements avec la bibliothèque de patrons sont produits par règles explicites et confirmés par la consultante ; aucune estimation chiffrée n'est avancée sans relevé.`);
  l.push('');

  if (mission.hypotheses.length) {
    l.push('## 4. Hypothèses de départ et ce qu’en a fait l’atelier');
    l.push('');
    for (const h of mission.hypotheses) l.push(`- ${h.texte} — **${LIBELLES_STATUT_HYPOTHESE[h.statut]}**`);
    l.push('');
  }

  l.push('## 5. Constats');
  l.push('');
  const verifies = mission.faits.filter((f) => f.statut !== 'declare');
  const declares = mission.faits.filter((f) => f.statut === 'declare');
  if (verifies.length) {
    l.push('### Observé ou vérifié');
    for (const f of verifies) l.push(`- ${f.texte} _(${LIBELLES_STATUT_FAIT[f.statut]}${f.source ? `, source : ${f.source}` : ''})_`);
    l.push('');
  }
  if (declares.length) {
    l.push('### Déclaré, à vérifier');
    for (const f of declares) l.push(`- ${f.texte}${f.source ? ` _(${f.source})_` : ''}`);
    l.push('');
  }
  const verbatims = mission.journal.filter((e) => e.type === 'citation');
  if (verbatims.length) {
    l.push('### Ce que les participants ont dit');
    for (const v of verbatims) l.push(`> « ${v.texte} »`);
    l.push('');
  }
  if (!verifies.length && !declares.length && !verbatims.length) l.push('_Aucun constat enregistré._', '');

  l.push('## 6. Le processus aujourd’hui et demain');
  l.push('');
  if (actuel.length) {
    l.push('### Aujourd’hui');
    actuel.forEach((e, i) => l.push(`${i + 1}. ${e.texte}${e.acteur ? ` _(${e.acteur}${e.outil ? `, ${e.outil}` : ''})_` : ''}`));
    l.push('');
  }
  if (cible.length) {
    l.push('### Cible proposée');
    cible.forEach((e, i) => l.push(`${i + 1}. ${e.texte}${e.acteur ? ` _(${e.acteur}${e.outil ? `, ${e.outil}` : ''})_` : ''}${e.changement === 'nouvelle' ? ' **nouveau**' : e.changement === 'modifiee' ? ' **modifié**' : ''}`));
    l.push('');
    l.push(`Changements : ${diff.ajoutees.length} étape(s) ajoutée(s), ${diff.retirees.length} retirée(s), ${diff.conservees.length} conservée(s).`);
    l.push('');
  }
  if (!actuel.length && !cible.length) l.push('_Carte du processus en cours de construction._', '');

  l.push('## 7. Problèmes, causes et preuves');
  l.push('');
  if (problemesTries.length) {
    l.push('| Problème | Gravité | Fréquence | Problème universel | Preuves | Causes |', '|---|---|---|---|---|---|');
    for (const p of problemesTries) {
      const u = p.universelId ? problemeUniversel(p.universelId)?.label ?? p.universelId : '—';
      l.push(`| ${p.texte} | ${LIBELLES_GRAVITE[p.gravite]} | ${LIBELLES_FREQUENCE[p.frequence]} | ${u} | ${p.preuves.length ? p.preuves.map((x) => `${LIBELLES_TYPE_PREUVE[x.type]} : ${x.source}`).join(' ; ') : 'à compléter'} | ${p.causes.length ? p.causes.map((c) => `${c.texte} (${LIBELLES_STATUT_CAUSE[c.statut]})`).join(' ; ') : '—'} |`);
    }
    l.push('');
  } else l.push('_Aucun problème formalisé._', '');

  l.push('## 8. Recommandations retenues');
  l.push('');
  if (retenues.length) {
    for (const s of retenues) {
      l.push(`### ${s.titre}`);
      l.push(`${LIBELLES_CATEGORIE[s.categorie]} · ${LIBELLES_PRIORITE[s.priorite]} · effort ${s.faisabilite.effort}, coût mensuel ${s.faisabilite.coutMensuel}${s.faisabilite.outilDejaPresent ? ', outil déjà présent' : ''}`);
      l.push('');
      l.push(s.detail);
      l.push('');
      l.push('Pourquoi cette recommandation :');
      for (const x of s.explication) l.push(`- ${x}`);
      if (s.alternativeSansIA) l.push(`- Alternative sans IA : ${s.alternativeSansIA}`);
      if (s.faisabilite.prerequis.length) l.push(`- Prérequis : ${s.faisabilite.prerequis.join(' ')}`);
      if (s.faisabilite.risques.length) l.push(`- Risques : ${s.faisabilite.risques.join(' ')}`);
      l.push('');
    }
  } else l.push('_Aucune recommandation retenue pour le moment._', '');

  const autres = mission.solutions.filter((s) => s.decision !== 'retenue' && s.decision !== 'ecartee');
  if (autres.length) {
    l.push('### Pistes non tranchées');
    for (const s of autres) l.push(`- ${s.titre} _(${LIBELLES_DECISION[s.decision]}, ${LIBELLES_PRIORITE[s.priorite]})_`);
    l.push('');
  }

  l.push('## 9. Plan d’action');
  l.push('');
  if (mission.actions.length) {
    l.push('| # | Action | Responsable | Échéance | Statut |', '|---|---|---|---|---|');
    mission.actions.forEach((a, i) => l.push(`| ${i + 1} | ${a.texte} | ${a.responsable || '—'} | ${a.echeance || '—'} | ${a.statut} |`));
    l.push('');
  } else l.push('_Aucune action décidée._', '');

  l.push('## 10. Mesures avant / après');
  l.push('');
  if (mission.mesures.length) {
    l.push('| Indicateur | Avant | Cible | J+30 | J+90 | Source |', '|---|---|---|---|---|---|');
    for (const m of mission.mesures) l.push(`| ${m.indicateur} (${m.unite}) | ${m.avant ?? '—'} | ${m.cible ?? '—'} | ${m.a30 ?? '—'} | ${m.a90 ?? '—'} | ${m.source} |`);
    l.push('');
  } else l.push('_Aucune mesure définie : en choisir une avec le client avant d’agir._', '');

  l.push('## 11. Limites et conditions');
  l.push('');
  l.push('- Les rapprochements avec la bibliothèque sont fondés sur des règles lexicales et une taxonomie de problèmes universels ; ils ont été confirmés ou écartés par la consultante.');
  l.push('- Aucun gain n’est chiffré avant mesure ; les ordres de grandeur éventuels sont des hypothèses à vérifier.');
  l.push('- Aucune donnée personnelle de salarié : les rôles remplacent les noms.');
  l.push('');
  l.push('---');
  l.push(mission.syntheseValideeLe ? `Synthèse validée par la consultante le ${dateFr(mission.syntheseValideeLe)}.` : 'Synthèse non encore validée par la consultante : document de travail.');
  l.push('');
  return l.join('\n');
}
