'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check, Clock, Plus, Trash2, X } from 'lucide-react';
import type { PropsPhase } from './MissionShell';
import { CarteSolution } from './CarteSolution';
import { Badge, Carte, Champ, Encart, Metrique, dateCourte } from '../ui';
import { LIBELLES_DECISION, LIBELLES_PRIORITE, LIBELLES_STATUT_ACTION, genId, type Action, type DecisionSolution, type Mesure, type Priorite, type Solution, type StatutAction } from '../../lib/domain/types';

const ORDRE: Priorite[] = ['quick_win', 'a_planifier', 'a_construire', 'specialiste'];
const CONSEIL: Record<Priorite, string> = {
  quick_win: 'Réalisable avec ce qui existe, en quelques jours. À retenir en priorité.',
  a_planifier: 'Utile, demande un accord ou du temps. À inscrire au plan avec une échéance.',
  a_construire: 'Chantier ou dépendance (IA, outil). Préparer le prérequis d’abord.',
  specialiste: 'Passe par un prestataire. À envisager après les premières mesures.',
};

export function Decider({ mission, client, maj }: PropsPhase) {
  const [action, setAction] = useState({ texte: '', responsable: '', echeance: '', solutionId: '' });
  const [mesure, setMesure] = useState({ indicateur: '', unite: '', avant: '', cible: '', source: '' });
  const [decision, setDecision] = useState({ texte: '', qui: '' });
  const roles = client.partiesPrenantes.map((p) => p.role);

  const decider = (s: Solution, d: DecisionSolution) =>
    maj((m) => ({
      ...m,
      solutions: m.solutions.map((x) => (x.id === s.id ? { ...x, decision: d } : x)),
      decisions: d === 'a_decider' ? m.decisions : [...m.decisions, { id: genId(), date: new Date().toISOString(), texte: `${LIBELLES_DECISION[d]} : ${s.titre}`, qui: 'Décision en séance' }],
    }));

  const creerActionDepuis = (s: Solution) => {
    const a: Action = { id: genId(), texte: `Mettre en place : ${s.titre}`, responsable: s.responsable ?? '', echeance: s.echeance ?? '', statut: 'a_faire', solutionId: s.id };
    maj((m) => ({ ...m, actions: [...m.actions, a] }));
  };

  const retenues = mission.solutions.filter((s) => s.decision === 'retenue');
  const sansAction = retenues.filter((s) => !mission.actions.some((a) => a.solutionId === s.id));

  return (
    <>
      <div className="grille trois" style={{ marginBottom: '1rem' }}>
        <Metrique valeur={`${retenues.length}/${mission.solutions.length}`} libelle="Recommandations retenues" ton="sauge" />
        <Metrique valeur={mission.actions.length} libelle="Actions planifiées" ton="accent" />
        <Metrique valeur={mission.mesures.length} libelle="Indicateurs suivis" />
      </div>

      {mission.solutions.length === 0 && <Encart ton="alerte">Aucune solution à décider : reviens à l’analyse pour rattacher les problèmes à la bibliothèque et proposer des solutions.</Encart>}

      <div className="grille deux">
        {ORDRE.map((prio) => {
          const liste = mission.solutions.filter((s) => s.priorite === prio);
          if (liste.length === 0) return null;
          return (
            <Carte key={prio} nom={LIBELLES_PRIORITE[prio]} titre={<span className="ligne"><Badge ton={prio === 'quick_win' ? 'sauge' : prio === 'a_planifier' ? 'bleu' : prio === 'a_construire' ? 'accent' : 'or'}>{liste.length}</Badge> {LIBELLES_PRIORITE[prio]}</span>} sousTitre={CONSEIL[prio]}>
              <div className="liste">
                {liste.map((s) => (
                  <CarteSolution
                    key={s.id}
                    s={s}
                    problemes={mission.problemes}
                    actions={
                      <>
                        <button type="button" className={`bouton petit${s.decision === 'retenue' ? ' sauge' : ''}`} onClick={() => decider(s, s.decision === 'retenue' ? 'a_decider' : 'retenue')} aria-pressed={s.decision === 'retenue'} title="Retenir">
                          <Check size={14} /> Retenir
                        </button>
                        <button type="button" className={`bouton petit${s.decision === 'plus_tard' ? ' or' : ''}`} onClick={() => decider(s, s.decision === 'plus_tard' ? 'a_decider' : 'plus_tard')} aria-pressed={s.decision === 'plus_tard'} title="Plus tard">
                          <Clock size={14} />
                        </button>
                        <button type="button" className={`bouton petit${s.decision === 'ecartee' ? ' danger' : ''}`} onClick={() => decider(s, s.decision === 'ecartee' ? 'a_decider' : 'ecartee')} aria-pressed={s.decision === 'ecartee'} title="Écarter">
                          <X size={14} />
                        </button>
                      </>
                    }
                    enfants={
                      s.decision === 'retenue' ? (
                        <div className="grille trois" style={{ marginTop: '0.5rem', alignItems: 'end' }}>
                          <Champ label="Responsable (rôle)">
                            <input list={`roles-${mission.id}`} value={s.responsable ?? ''} onChange={(e) => maj((m) => ({ ...m, solutions: m.solutions.map((x) => (x.id === s.id ? { ...x, responsable: e.target.value } : x)) }))} placeholder="Qui porte" />
                          </Champ>
                          <Champ label="Échéance">
                            <input type="date" value={s.echeance ?? ''} onChange={(e) => maj((m) => ({ ...m, solutions: m.solutions.map((x) => (x.id === s.id ? { ...x, echeance: e.target.value } : x)) }))} />
                          </Champ>
                          {!mission.actions.some((a) => a.solutionId === s.id) ? (
                            <button type="button" className="bouton petit primaire" onClick={() => creerActionDepuis(s)}>
                              <Plus size={14} /> Créer l’action
                            </button>
                          ) : (
                            <span className="petit doux">Action créée ↓</span>
                          )}
                        </div>
                      ) : undefined
                    }
                  />
                ))}
              </div>
            </Carte>
          );
        })}
      </div>
      <datalist id={`roles-${mission.id}`}>
        {roles.map((r) => (
          <option key={r} value={r} />
        ))}
      </datalist>

      <div className="grille deux" style={{ marginTop: '1rem' }}>
        <Carte titre="Plan d’action" sousTitre="Un responsable, une échéance, un statut. Le client repart avec, pas avec une liste de vœux.">
          {sansAction.length > 0 && (
            <Encart ton="info">
              {sansAction.length} recommandation(s) retenue(s) sans action : {sansAction.map((s) => s.titre).join(', ')}.
            </Encart>
          )}
          <ul className="liste">
            {mission.actions.map((a, i) => (
              <li key={a.id} className="item">
                <div className="ligne espace">
                  <strong>
                    {i + 1}. {a.texte}
                  </strong>
                  <button type="button" className="bouton petit discret" aria-label="Supprimer l’action" onClick={() => maj((m) => ({ ...m, actions: m.actions.filter((x) => x.id !== a.id) }))}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grille trois" style={{ marginTop: '0.4rem' }}>
                  <input aria-label="Responsable" list={`roles-${mission.id}`} value={a.responsable} onChange={(e) => maj((m) => ({ ...m, actions: m.actions.map((x) => (x.id === a.id ? { ...x, responsable: e.target.value } : x)) }))} placeholder="Responsable" />
                  <input aria-label="Échéance" type="date" value={a.echeance} onChange={(e) => maj((m) => ({ ...m, actions: m.actions.map((x) => (x.id === a.id ? { ...x, echeance: e.target.value } : x)) }))} />
                  <select aria-label="Statut" value={a.statut} onChange={(e) => maj((m) => ({ ...m, actions: m.actions.map((x) => (x.id === a.id ? { ...x, statut: e.target.value as StatutAction } : x)) }))}>
                    {Object.entries(LIBELLES_STATUT_ACTION).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                {a.solutionId && <div className="petit doux" style={{ marginTop: '0.3rem' }}>Découle de : {mission.solutions.find((s) => s.id === a.solutionId)?.titre ?? '—'}</div>}
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!action.texte.trim()) return;
              maj((m) => ({ ...m, actions: [...m.actions, { id: genId(), texte: action.texte.trim(), responsable: action.responsable, echeance: action.echeance, statut: 'a_faire', solutionId: action.solutionId || undefined }] }));
              setAction({ texte: '', responsable: '', echeance: '', solutionId: '' });
            }}
            style={{ marginTop: '0.75rem' }}
          >
            <Champ label="Nouvelle action">
              <input value={action.texte} onChange={(e) => setAction({ ...action, texte: e.target.value })} placeholder="Ex. Tenir le cahier de relevé pendant deux semaines" />
            </Champ>
            <div className="grille trois">
              <input aria-label="Responsable" list={`roles-${mission.id}`} value={action.responsable} onChange={(e) => setAction({ ...action, responsable: e.target.value })} placeholder="Responsable" />
              <input aria-label="Échéance" type="date" value={action.echeance} onChange={(e) => setAction({ ...action, echeance: e.target.value })} />
              <select aria-label="Recommandation liée" value={action.solutionId} onChange={(e) => setAction({ ...action, solutionId: e.target.value })}>
                <option value="">Sans recommandation liée</option>
                {retenues.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.titre}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="bouton petit" style={{ marginTop: '0.5rem' }} disabled={!action.texte.trim()}>
              <Plus size={14} /> Ajouter l’action
            </button>
          </form>
        </Carte>

        <div>
          <Carte titre="Mesures avant / après" sousTitre="Un indicateur simple par recommandation retenue. La valeur « avant » vient d’un relevé, jamais d’une estimation.">
            <ul className="liste">
              {mission.mesures.map((x) => (
                <li key={x.id} className="item">
                  <div className="ligne espace">
                    <strong>
                      {x.indicateur} <span className="doux petit">({x.unite})</span>
                    </strong>
                    <button type="button" className="bouton petit discret" aria-label="Supprimer la mesure" onClick={() => maj((m) => ({ ...m, mesures: m.mesures.filter((y) => y.id !== x.id) }))}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="ligne petit" style={{ marginTop: '0.3rem' }}>
                    <label className="ligne" style={{ gap: '0.3rem' }}>
                      Avant <input type="number" aria-label="Valeur avant" value={x.avant ?? ''} onChange={(e) => maj((m) => ({ ...m, mesures: m.mesures.map((y) => (y.id === x.id ? { ...y, avant: e.target.value === '' ? undefined : Number(e.target.value) } : y)) }))} style={{ width: 90, minHeight: 32 }} />
                    </label>
                    <label className="ligne" style={{ gap: '0.3rem' }}>
                      Cible <input type="number" aria-label="Valeur cible" value={x.cible ?? ''} onChange={(e) => maj((m) => ({ ...m, mesures: m.mesures.map((y) => (y.id === x.id ? { ...y, cible: e.target.value === '' ? undefined : Number(e.target.value) } : y)) }))} style={{ width: 90, minHeight: 32 }} />
                    </label>
                    <span className="doux">Source : {x.source || 'à préciser'}</span>
                  </div>
                </li>
              ))}
            </ul>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!mesure.indicateur.trim()) return;
                const nouvelle: Mesure = { id: genId(), indicateur: mesure.indicateur.trim(), unite: mesure.unite.trim() || 'unité', avant: mesure.avant === '' ? undefined : Number(mesure.avant), cible: mesure.cible === '' ? undefined : Number(mesure.cible), source: mesure.source.trim() };
                maj((m) => ({ ...m, mesures: [...m.mesures, nouvelle] }));
                setMesure({ indicateur: '', unite: '', avant: '', cible: '', source: '' });
              }}
              style={{ marginTop: '0.75rem' }}
            >
              <div className="grille deux">
                <Champ label="Indicateur">
                  <input value={mesure.indicateur} onChange={(e) => setMesure({ ...mesure, indicateur: e.target.value })} placeholder="Ex. Temps de tri hebdomadaire" />
                </Champ>
                <Champ label="Unité">
                  <input value={mesure.unite} onChange={(e) => setMesure({ ...mesure, unite: e.target.value })} placeholder="heures, %, pièces…" />
                </Champ>
              </div>
              <div className="grille trois">
                <input type="number" aria-label="Avant" value={mesure.avant} onChange={(e) => setMesure({ ...mesure, avant: e.target.value })} placeholder="Avant" />
                <input type="number" aria-label="Cible" value={mesure.cible} onChange={(e) => setMesure({ ...mesure, cible: e.target.value })} placeholder="Cible" />
                <input aria-label="Source du relevé" value={mesure.source} onChange={(e) => setMesure({ ...mesure, source: e.target.value })} placeholder="Source du relevé" />
              </div>
              <button type="submit" className="bouton petit" style={{ marginTop: '0.5rem' }} disabled={!mesure.indicateur.trim()}>
                <Plus size={14} /> Ajouter la mesure
              </button>
            </form>
          </Carte>

          <Carte titre="Journal des décisions" sousTitre="Qui a décidé quoi, quand. Alimenté automatiquement par les boutons ci-dessus.">
            <ul className="liste">
              {[...mission.decisions].reverse().map((d) => (
                <li key={d.id} className="item ligne espace">
                  <span className="petit">
                    <span className="doux">{dateCourte(d.date)}</span> · {d.texte} <span className="doux">— {d.qui}</span>
                  </span>
                  <button type="button" className="bouton petit discret" aria-label="Supprimer la décision" onClick={() => maj((m) => ({ ...m, decisions: m.decisions.filter((x) => x.id !== d.id) }))}>
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
            <form
              className="ligne"
              onSubmit={(e) => {
                e.preventDefault();
                if (!decision.texte.trim()) return;
                maj((m) => ({ ...m, decisions: [...m.decisions, { id: genId(), date: new Date().toISOString(), texte: decision.texte.trim(), qui: decision.qui.trim() || 'Décision en séance' }] }));
                setDecision({ texte: '', qui: '' });
              }}
              style={{ marginTop: '0.5rem' }}
            >
              <input value={decision.texte} onChange={(e) => setDecision({ ...decision, texte: e.target.value })} placeholder="Décision prise…" aria-label="Décision" />
              <input list={`roles-${mission.id}`} value={decision.qui} onChange={(e) => setDecision({ ...decision, qui: e.target.value })} placeholder="Par qui" aria-label="Qui a décidé" style={{ maxWidth: 160 }} />
              <button type="submit" className="bouton petit" disabled={!decision.texte.trim()}>
                <Plus size={14} />
              </button>
            </form>
          </Carte>
        </div>
      </div>

      <div className="actions droite pas-imprime" style={{ marginTop: '1.25rem' }}>
        <Link href={`/mission/${mission.id}/restituer`} className="bouton primaire" onClick={() => maj((m) => (['preparer', 'atelier', 'analyser', 'decider'].includes(m.phase) ? { ...m, phase: 'restituer' } : m))}>
          Préparer la restitution <ArrowRight size={18} />
        </Link>
      </div>
    </>
  );
}
