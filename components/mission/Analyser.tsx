'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Plus, Sparkles, Trash2, X } from 'lucide-react';
import type { PropsPhase } from './MissionShell';
import { Matrice } from './Matrice';
import { CarteSolution } from './CarteSolution';
import { Badge, Carte, Champ, Encart, SelecteurNiveau } from '../ui';
import {
  LIBELLES_CATEGORIE,
  LIBELLES_FREQUENCE,
  LIBELLES_GRAVITE,
  LIBELLES_STATUT_CAUSE,
  LIBELLES_TYPE_PREUVE,
  genId,
  type Cause,
  type NiveauEffort,
  type Probleme,
  type Solution,
  type StatutCause,
  type TypePreuve,
} from '../../lib/domain/types';
import type { CategorieSolution } from '../../lib/packs/schema';
import { classer } from '../../lib/intelligence/classification';
import { proposerSolutions } from '../../lib/intelligence/correspondances';
import { prioriser } from '../../lib/intelligence/priorisation';
import { iaConfiguree } from '../../lib/ai/gateway';
import { bibliotheque, problemeUniversel } from '../../lib/bibliotheque';

export function Analyser({ mission, client, pack, maj }: PropsPhase) {
  const [problemeId, setProblemeId] = useState<string | null>(mission.problemes[0]?.id ?? null);
  const [solutionId, setSolutionId] = useState<string | null>(null);
  const [nouveau, setNouveau] = useState('');
  const [cause, setCause] = useState('');
  const [preuve, setPreuve] = useState({ type: 'declaration' as TypePreuve, source: '' });
  const [manuelle, setManuelle] = useState({ titre: '', detail: '', categorie: 'simplification' as CategorieSolution, effort: 'faible' as NiveauEffort, alternativeSansIA: '' });
  const [afficherManuelle, setAfficherManuelle] = useState(false);

  const probleme = mission.problemes.find((p) => p.id === problemeId);
  const refFiche = useRef<HTMLDivElement>(null);
  const selectionner = (id: string) => {
    setProblemeId(id);
    if (typeof window !== 'undefined' && window.innerWidth < 1100) setTimeout(() => refFiche.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };
  const etapesActuelles = mission.etapes.filter((e) => e.version === 'actuel' && e.statut === 'accepte');
  const classifications = useMemo(() => (probleme ? classer(probleme.texte, pack.processusIds, 3) : []), [probleme, pack]);
  const nouvellesSolutions = useMemo(() => proposerSolutions(mission, client, pack, iaConfiguree()), [mission, client, pack]);
  const tries = useMemo(() => [...mission.problemes].sort((a, b) => b.gravite * b.frequence - a.gravite * a.frequence), [mission.problemes]);

  const majProbleme = (id: string, fn: (p: Probleme) => Probleme) => maj((m) => ({ ...m, problemes: m.problemes.map((p) => (p.id === id ? fn(p) : p)) }));
  const majSolution = (id: string, fn: (s: Solution) => Solution) => maj((m) => ({ ...m, solutions: m.solutions.map((s) => (s.id === id ? fn(s) : s)) }));

  const ajouterProbleme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveau.trim()) return;
    const c = classer(nouveau, pack.processusIds, 1)[0];
    const p: Probleme = { id: genId(), texte: nouveau.trim(), etapeIds: [], gravite: 2, frequence: 2, preuves: [], causes: [], universelId: c && c.score >= 2 ? c.universel.id : undefined, universelStatut: c && c.score >= 2 ? 'propose' : undefined };
    maj((m) => ({ ...m, problemes: [...m.problemes, p] }));
    setNouveau('');
    setProblemeId(p.id);
  };

  const ajouterSolutionManuelle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manuelle.titre.trim() || !probleme) return;
    const faisabilite = { effort: manuelle.effort, coutMensuel: 'nul' as const, dependances: [], risques: [], prerequis: [], outilDejaPresent: manuelle.categorie === 'outil_existant' };
    const prio = prioriser({ categorie: manuelle.categorie, faisabilite, gravites: [probleme.gravite], frequences: [probleme.frequence], necessiteIA: false, iaConfiguree: false });
    const s: Solution = {
      id: genId(),
      titre: manuelle.titre.trim(),
      categorie: manuelle.categorie,
      detail: manuelle.detail.trim(),
      problemeIds: [probleme.id],
      explication: ['Proposée par la consultante en atelier.', ...prio.explication],
      alternativeSansIA: manuelle.alternativeSansIA.trim() || undefined,
      outilsCompatibles: [],
      faisabilite,
      impact: prio.impact,
      priorite: prio.priorite,
      decision: 'a_decider',
      origine: 'manuel',
      necessiteIA: false,
    };
    maj((m) => ({ ...m, solutions: [...m.solutions, s] }));
    setManuelle({ titre: '', detail: '', categorie: 'simplification', effort: 'faible', alternativeSansIA: '' });
    setAfficherManuelle(false);
  };

  /* Recalcule la priorité d'une solution quand les problèmes changent (gravité, fréquence, rattachements). */
  const recalculer = () =>
    maj((m) => ({
      ...m,
      solutions: m.solutions.map((s) => {
        const lies = m.problemes.filter((p) => s.problemeIds.includes(p.id));
        const prio = prioriser({ categorie: s.categorie, faisabilite: s.faisabilite, gravites: lies.map((p) => p.gravite), frequences: lies.map((p) => p.frequence), necessiteIA: s.necessiteIA, iaConfiguree: iaConfiguree() });
        const explication = [...s.explication.filter((x) => !/^(Impact|Effort|Quick win|À planifier|À construire|Classée)/.test(x)), ...prio.explication];
        return { ...s, impact: prio.impact, priorite: prio.priorite, explication };
      }),
    }));

  return (
    <>
      <div className="grille analyse">
        {/* ---------- Problèmes ---------- */}
        <div>
          <Carte titre="Problèmes formalisés" sousTitre="Triés par gravité × fréquence. Chaque problème a des preuves, des causes candidates et un rattachement intermétiers.">
            <ul className="liste">
              {tries.map((p) => (
                <li key={p.id}>
                  <button type="button" className={`item${problemeId === p.id ? ' selectionne' : ''}`} style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => selectionner(p.id)} aria-pressed={problemeId === p.id}>
                    <div className="ligne espace">
                      <strong>{p.texte}</strong>
                      <span className="ligne mini">
                        <Badge ton={p.gravite === 3 ? 'rouge' : p.gravite === 2 ? 'or' : 'contour'}>{LIBELLES_GRAVITE[p.gravite]}</Badge>
                        <Badge ton="contour">{LIBELLES_FREQUENCE[p.frequence]}</Badge>
                      </span>
                    </div>
                    <div className="ligne mini doux" style={{ marginTop: '0.3rem' }}>
                      {p.universelId && <span>{p.universelStatut === 'confirme' ? '✓' : '?'} {problemeUniversel(p.universelId)?.label}</span>}
                      <span>· {p.preuves.length} preuve(s)</span>
                      <span>· {p.causes.length} cause(s)</span>
                      <span>· {mission.solutions.filter((s) => s.problemeIds.includes(p.id)).length} solution(s)</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <form className="ligne" onSubmit={ajouterProbleme} style={{ marginTop: '0.75rem' }}>
              <input value={nouveau} onChange={(e) => setNouveau(e.target.value)} placeholder="Nouveau problème, dans les mots du client…" aria-label="Nouveau problème" />
              <button type="submit" className="bouton petit" disabled={!nouveau.trim()}>
                <Plus size={14} /> Ajouter
              </button>
            </form>
          </Carte>

          <div ref={refFiche} />
          {probleme && (
            <Carte
              titre="Fiche du problème"
              actions={
                <button type="button" className="bouton petit danger" onClick={() => { maj((m) => ({ ...m, problemes: m.problemes.filter((p) => p.id !== probleme.id), solutions: m.solutions.map((s) => ({ ...s, problemeIds: s.problemeIds.filter((x) => x !== probleme.id) })) })); setProblemeId(null); }}>
                  <Trash2 size={14} /> Supprimer
                </button>
              }
            >
              <Champ label="Énoncé">
                <textarea rows={2} value={probleme.texte} onChange={(e) => majProbleme(probleme.id, (p) => ({ ...p, texte: e.target.value }))} />
              </Champ>
              <div className="grille deux">
                <div className="champ">
                  <span>Gravité : {LIBELLES_GRAVITE[probleme.gravite]}</span>
                  <SelecteurNiveau valeur={probleme.gravite} libelles={LIBELLES_GRAVITE} label="Gravité" onChange={(n) => { majProbleme(probleme.id, (p) => ({ ...p, gravite: n })); setTimeout(recalculer, 0); }} />
                </div>
                <div className="champ">
                  <span>Fréquence : {LIBELLES_FREQUENCE[probleme.frequence]}</span>
                  <SelecteurNiveau valeur={probleme.frequence} libelles={LIBELLES_FREQUENCE} label="Fréquence" onChange={(n) => { majProbleme(probleme.id, (p) => ({ ...p, frequence: n })); setTimeout(recalculer, 0); }} />
                </div>
              </div>

              <h3>Rattachement intermétiers</h3>
              {probleme.universelId && probleme.universelStatut === 'confirme' && (
                <Encart ton="ok">
                  <span className="ligne espace">
                    <span>
                      <strong>{problemeUniversel(probleme.universelId)?.label}</strong> — confirmé. {problemeUniversel(probleme.universelId)?.coutTypique}
                    </span>
                    <button type="button" className="bouton petit discret" onClick={() => majProbleme(probleme.id, (p) => ({ ...p, universelId: undefined, universelStatut: undefined }))}>
                      Retirer
                    </button>
                  </span>
                </Encart>
              )}
              {(!probleme.universelId || probleme.universelStatut !== 'confirme') && (
                <>
                  {classifications.length === 0 && <p className="petit doux">Aucun signal reconnu par règles dans cet énoncé. Choisis un problème universel ci-dessous si tu le reconnais.</p>}
                  {classifications.map((c) => (
                    <div key={c.universel.id} className={`item${probleme.universelId === c.universel.id ? ' propose' : ''}`} style={{ marginBottom: '0.4rem' }}>
                      <div className="ligne espace">
                        <strong>{c.universel.label}</strong>
                        <span className="ligne">
                          <Badge ton="contour">Score {c.score}</Badge>
                          <button type="button" className="bouton petit sauge" onClick={() => majProbleme(probleme.id, (p) => ({ ...p, universelId: c.universel.id, universelStatut: 'confirme' }))}>
                            <Check size={14} /> Confirmer
                          </button>
                        </span>
                      </div>
                      <ul className="petit doux" style={{ margin: '0.3rem 0 0 1rem', padding: 0 }}>
                        {c.explication.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Champ label="Ou choisir directement">
                    <select value="" onChange={(e) => e.target.value && majProbleme(probleme.id, (p) => ({ ...p, universelId: e.target.value, universelStatut: 'confirme' }))}>
                      <option value="">Problème universel…</option>
                      {bibliotheque.problemesUniversels.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </Champ>
                </>
              )}

              <h3>Étapes concernées</h3>
              {etapesActuelles.length === 0 && <p className="petit doux">Aucune étape acceptée dans la carte du processus.</p>}
              <div className="ligne">
                {etapesActuelles.map((e, i) => (
                  <label key={e.id} className="petit ligne" style={{ gap: '0.3rem', border: '1px solid var(--bord)', borderRadius: 999, padding: '0.2rem 0.6rem' }}>
                    <input type="checkbox" checked={probleme.etapeIds.includes(e.id)} onChange={(ev) => majProbleme(probleme.id, (p) => ({ ...p, etapeIds: ev.target.checked ? [...p.etapeIds, e.id] : p.etapeIds.filter((x) => x !== e.id) }))} />
                    {i + 1}. {e.texte.length > 40 ? e.texte.slice(0, 39) + '…' : e.texte}
                  </label>
                ))}
              </div>

              <h3>Preuves</h3>
              <ul className="liste">
                {probleme.preuves.map((pr) => (
                  <li key={pr.id} className="item ligne espace">
                    <span className="petit">
                      <Badge ton="contour">{LIBELLES_TYPE_PREUVE[pr.type]}</Badge> {pr.source} <span className="doux">{pr.date}</span>
                    </span>
                    <button type="button" className="bouton petit discret" aria-label="Retirer la preuve" onClick={() => majProbleme(probleme.id, (p) => ({ ...p, preuves: p.preuves.filter((x) => x.id !== pr.id) }))}>
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
              <form
                className="ligne"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!preuve.source.trim()) return;
                  majProbleme(probleme.id, (p) => ({ ...p, preuves: [...p.preuves, { id: genId(), type: preuve.type, source: preuve.source.trim(), date: new Date().toISOString().slice(0, 10) }] }));
                  setPreuve({ type: 'declaration', source: '' });
                }}
              >
                <select aria-label="Type de preuve" value={preuve.type} onChange={(e) => setPreuve({ ...preuve, type: e.target.value as TypePreuve })} style={{ width: 'auto' }}>
                  {Object.entries(LIBELLES_TYPE_PREUVE).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
                <input value={preuve.source} onChange={(e) => setPreuve({ ...preuve, source: e.target.value })} placeholder="Ex. Export de caisse des 4 dernières semaines" aria-label="Source de la preuve" />
                <button type="submit" className="bouton petit" disabled={!preuve.source.trim()}>
                  <Plus size={14} />
                </button>
              </form>

              <h3>Causes candidates</h3>
              <ul className="liste">
                {probleme.causes.map((c) => (
                  <li key={c.id} className="item ligne espace">
                    <span className="petit">{c.texte}</span>
                    <span className="ligne">
                      <select aria-label="Statut de la cause" value={c.statut} onChange={(e) => majProbleme(probleme.id, (p) => ({ ...p, causes: p.causes.map((x) => (x.id === c.id ? { ...x, statut: e.target.value as StatutCause } : x)) }))} style={{ width: 'auto', minHeight: 32 }}>
                        {Object.entries(LIBELLES_STATUT_CAUSE).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                      <button type="button" className="bouton petit discret" aria-label="Retirer la cause" onClick={() => majProbleme(probleme.id, (p) => ({ ...p, causes: p.causes.filter((x) => x.id !== c.id) }))}>
                        <Trash2 size={14} />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              <form
                className="ligne"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!cause.trim()) return;
                  const c: Cause = { id: genId(), texte: cause.trim(), statut: 'hypothese' };
                  majProbleme(probleme.id, (p) => ({ ...p, causes: [...p.causes, c] }));
                  setCause('');
                }}
              >
                <input value={cause} onChange={(e) => setCause(e.target.value)} placeholder="Pourquoi, selon le client ? Noter comme hypothèse." aria-label="Nouvelle cause" />
                <button type="submit" className="bouton petit" disabled={!cause.trim()}>
                  <Plus size={14} />
                </button>
              </form>
            </Carte>
          )}
        </div>

        {/* ---------- Solutions ---------- */}
        <div>
          <Carte titre="Matrice impact × effort" sousTitre="Position calculée par règles à partir des problèmes rattachés et de la faisabilité. Clique un point.">
            {mission.solutions.length === 0 ? <p className="doux petit">Aucune solution pour l’instant.</p> : <Matrice solutions={mission.solutions} selection={solutionId} onSelect={setSolutionId} />}
          </Carte>

          <Carte
            titre="Solutions candidates"
            sousTitre="Patrons de la bibliothèque rapprochés des problèmes confirmés, avec compatibilité outils, alternative sans IA et priorisation expliquée."
            actions={
              <div className="ligne">
                <button type="button" className="bouton petit accent" onClick={() => maj((m) => ({ ...m, solutions: [...m.solutions, ...nouvellesSolutions] }))} disabled={nouvellesSolutions.length === 0} title={nouvellesSolutions.length === 0 ? 'Confirme d’abord le rattachement intermétiers d’un problème' : ''}>
                  <Sparkles size={14} /> Proposer {nouvellesSolutions.length > 0 ? `${nouvellesSolutions.length} solution(s)` : ''}
                </button>
                <button type="button" className="bouton petit" onClick={() => setAfficherManuelle((v) => !v)} disabled={!probleme}>
                  <Plus size={14} /> À la main
                </button>
              </div>
            }
          >
            {mission.solutions.length === 0 && nouvellesSolutions.length === 0 && <Encart ton="info">Les solutions viennent du rattachement intermétiers : confirme le problème universel d’au moins un problème, puis clique « Proposer ».</Encart>}
            {afficherManuelle && probleme && (
              <form onSubmit={ajouterSolutionManuelle} className="item" style={{ marginBottom: '0.75rem' }}>
                <strong>Solution pour « {probleme.texte} »</strong>
                <Champ label="Titre">
                  <input value={manuelle.titre} onChange={(e) => setManuelle({ ...manuelle, titre: e.target.value })} />
                </Champ>
                <Champ label="En quoi elle consiste">
                  <textarea rows={2} value={manuelle.detail} onChange={(e) => setManuelle({ ...manuelle, detail: e.target.value })} />
                </Champ>
                <div className="grille deux">
                  <Champ label="Catégorie">
                    <select value={manuelle.categorie} onChange={(e) => setManuelle({ ...manuelle, categorie: e.target.value as CategorieSolution })}>
                      {Object.entries(LIBELLES_CATEGORIE).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </Champ>
                  <Champ label="Effort">
                    <select value={manuelle.effort} onChange={(e) => setManuelle({ ...manuelle, effort: e.target.value as NiveauEffort })}>
                      <option value="faible">Faible</option>
                      <option value="moyen">Moyen</option>
                      <option value="fort">Fort</option>
                    </select>
                  </Champ>
                </div>
                <div className="actions droite">
                  <button type="button" className="bouton petit" onClick={() => setAfficherManuelle(false)}>
                    <X size={14} /> Annuler
                  </button>
                  <button type="submit" className="bouton petit primaire" disabled={!manuelle.titre.trim()}>
                    <Check size={14} /> Ajouter
                  </button>
                </div>
              </form>
            )}
            <div className="liste">
              {mission.solutions
                .filter((s) => !probleme || s.problemeIds.includes(probleme.id) || mission.solutions.every((x) => !x.problemeIds.includes(probleme.id)))
                .map((s) => (
                  <CarteSolution
                    key={s.id}
                    s={s}
                    problemes={mission.problemes}
                    selectionnee={solutionId === s.id}
                    onSelect={() => setSolutionId(s.id)}
                    actions={
                      <button type="button" className="bouton petit discret" aria-label={`Retirer la solution ${s.titre}`} onClick={(e) => { e.stopPropagation(); maj((m) => ({ ...m, solutions: m.solutions.filter((x) => x.id !== s.id) })); }}>
                        <Trash2 size={14} />
                      </button>
                    }
                    enfants={
                      probleme && !s.problemeIds.includes(probleme.id) ? (
                        <button type="button" className="bouton petit" style={{ marginTop: '0.4rem' }} onClick={(e) => { e.stopPropagation(); majSolution(s.id, (x) => ({ ...x, problemeIds: [...x.problemeIds, probleme.id] })); setTimeout(recalculer, 0); }}>
                          <Plus size={14} /> Rattacher au problème sélectionné
                        </button>
                      ) : undefined
                    }
                  />
                ))}
            </div>
            {probleme && mission.solutions.length > 0 && mission.solutions.some((x) => x.problemeIds.includes(probleme.id)) && <p className="petit doux" style={{ marginTop: '0.5rem' }}>Affichage filtré sur le problème sélectionné.</p>}
          </Carte>
        </div>
      </div>

      <div className="actions droite pas-imprime" style={{ marginTop: '1.25rem' }}>
        <Link href={`/mission/${mission.id}/decider`} className="bouton primaire" onClick={() => maj((m) => (['preparer', 'atelier', 'analyser'].includes(m.phase) ? { ...m, phase: 'decider' } : m))}>
          Passer à la décision <ArrowRight size={18} />
        </Link>
      </div>
    </>
  );
}
