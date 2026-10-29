'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Check, Plus, Sparkles, X } from 'lucide-react';
import { Coque } from '../../../components/studio/Coque';
import { useStudio } from '../../../components/studio/StudioContext';
import { Niveaux, Regle, TON_DECISION, TON_PRIORITE, Tag, nomCourt } from '../../../components/studio/Elements';
import { LIBELLES_CATEGORIE, LIBELLES_DECISION, LIBELLES_EFFORT, LIBELLES_FREQUENCE, LIBELLES_GRAVITE, LIBELLES_PRIORITE, LIBELLES_STATUT_CAUSE, LIBELLES_TYPE_PREUVE, genId, type DecisionSolution, type Mission, type Probleme, type Solution, type StatutCause } from '../../../lib/domain/types';
import { getPack } from '../../../lib/packs';
import { bibliotheque, problemeUniversel } from '../../../lib/bibliotheque';
import { classer } from '../../../lib/intelligence/classification';
import { proposerSolutions } from '../../../lib/intelligence/correspondances';
import { prioriser } from '../../../lib/intelligence/priorisation';
import { iaConfiguree } from '../../../lib/ai/gateway';

const MISSION_ID = 'demo-boulangerie-decouverte';
const COULEURS: Record<Solution['priorite'], string> = { quick_win: 'var(--hx-vert)', a_planifier: 'var(--hx-bleu)', a_construire: 'var(--hx-cuivre)', specialiste: 'var(--hx-ambre)' };
const EFFORT: Record<Solution['faisabilite']['effort'], number> = { faible: 1, moyen: 2, fort: 3 };

function Opportunites({ solutions, selection, survol, onSurvol, onSelect }: { solutions: Solution[]; selection: string | null; survol: string | null; onSurvol: (id: string | null) => void; onSelect: (id: string) => void }) {
  const W = 640;
  const H = 360;
  const m = { g: 34, d: 14, h: 26, b: 32 };
  const lx = W - m.g - m.d;
  const ly = H - m.h - m.b;
  const x = (e: number) => m.g + ((e - 0.5) / 3) * lx;
  const y = (i: number) => m.h + ly - ((i - 0.5) / 3) * ly;
  const cellules = new Map<string, Solution[]>();
  for (const s of [...solutions].sort((a, b) => Number(b.decision === 'retenue') - Number(a.decision === 'retenue'))) {
    const k = `${s.impact}-${EFFORT[s.faisabilite.effort]}`;
    cellules.set(k, [...(cellules.get(k) ?? []), s]);
  }
  return (
    <svg className="hx-opportunites" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Carte des opportunités : impact selon effort">
      <rect x={m.g} y={m.h} width={lx / 2} height={ly / 2} fill="var(--hx-vert-clair)" opacity={0.6} rx={8} />
      <rect x={m.g} y={m.h} width={lx} height={ly} fill="none" stroke="var(--hx-bord)" rx={8} />
      <line x1={m.g} x2={m.g + lx} y1={m.h + ly / 2} y2={m.h + ly / 2} stroke="var(--hx-bord-fort)" strokeDasharray="3 5" />
      <line x1={m.g + lx / 2} x2={m.g + lx / 2} y1={m.h} y2={m.h + ly} stroke="var(--hx-bord-fort)" strokeDasharray="3 5" />
      <text className="quadrant" x={m.g + 10} y={m.h + 16} fill="var(--hx-vert)">
        Quick wins
      </text>
      <text className="quadrant" x={m.g + lx - 10} y={m.h + 16} textAnchor="end">
        À construire
      </text>
      <text className="quadrant" x={m.g + 10} y={m.h + ly - 8}>
        Faible priorité
      </text>
      <text className="quadrant" x={m.g + lx - 10} y={m.h + ly - 8} textAnchor="end">
        À planifier
      </text>
      <text x={m.g + lx / 2} y={H - 6} textAnchor="middle">
        Effort → faible … fort
      </text>
      <text x={11} y={m.h + ly / 2} textAnchor="middle" transform={`rotate(-90 11 ${m.h + ly / 2})`}>
        Impact → faible … fort
      </text>
      {[...cellules.entries()].flatMap(([k, liste]) => {
        const [impact, effort] = k.split('-').map(Number);
        const cx = x(effort);
        const y0 = y(impact) - ((liste.length - 1) * 24) / 2 + (impact === 3 ? 12 : impact === 1 ? -12 : 0);
        return liste.map((s, n) => {
          const cy = y0 + n * 24;
          const actif = selection === s.id || survol === s.id;
          const eteint = (survol || selection) && !actif && survol !== null;
          return (
            <g key={s.id} className={`hx-point${s.decision === 'ecartee' ? ' ecartee' : ''}${eteint ? ' eteint' : ''}`} transform={`translate(${cx} ${cy})`} onMouseEnter={() => onSurvol(s.id)} onMouseLeave={() => onSurvol(null)} onClick={() => onSelect(s.id)} role="button" tabIndex={0} aria-label={`${s.titre} : ${LIBELLES_PRIORITE[s.priorite]}`} onKeyDown={(e) => e.key === 'Enter' && onSelect(s.id)}>
              <circle className="coeur" r={actif ? 8.5 : 6} fill={COULEURS[s.priorite]} />
              {s.decision === 'retenue' && <circle r={actif ? 12.5 : 10} fill="none" stroke={COULEURS[s.priorite]} strokeWidth={1.2} opacity={0.6} />}
              <text x={15} y={4} fontWeight={actif || s.decision === 'retenue' ? 600 : 400}>
                {s.titre.length > 30 ? s.titre.slice(0, 29) + '…' : s.titre}
              </text>
            </g>
          );
        });
      })}
    </svg>
  );
}

function Analyse() {
  const { mission, client, majMission } = useStudio();
  const m = mission(MISSION_ID);
  const c = m ? client(m.clientId) : undefined;
  const pack = m ? getPack(m.packId) : undefined;
  const [volet, setVolet] = useState<{ kind: 'probleme' | 'solution'; id: string } | null>(null);
  const [survol, setSurvol] = useState<string | null>(null);
  const [nouveau, setNouveau] = useState('');
  const [cause, setCause] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const problemes = useMemo(() => (m ? [...m.problemes].sort((a, b) => b.gravite * b.frequence - a.gravite * a.frequence) : []), [m]);
  const nouvelles = useMemo(() => (m && c && pack ? proposerSolutions(m, c, pack, iaConfiguree()) : []), [m, c, pack]);

  if (!m || !c || !pack) {
    return (
      <Coque fil={<strong>Analyse</strong>}>
        <div className="hx-vide">Mission de démonstration introuvable. Réinitialise la démonstration depuis la palette (⌘K).</div>
      </Coque>
    );
  }

  const notifier = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };
  const maj = (fn: (x: Mission) => Mission) => majMission(m.id, fn);
  const majProbleme = (id: string, fn: (p: Probleme) => Probleme) => maj((x) => ({ ...x, problemes: x.problemes.map((p) => (p.id === id ? fn(p) : p)) }));
  const recalculer = () =>
    maj((x) => ({
      ...x,
      solutions: x.solutions.map((s) => {
        const lies = x.problemes.filter((p) => s.problemeIds.includes(p.id));
        const prio = prioriser({ categorie: s.categorie, faisabilite: s.faisabilite, gravites: lies.map((p) => p.gravite), frequences: lies.map((p) => p.frequence), necessiteIA: s.necessiteIA, iaConfiguree: iaConfiguree() });
        return { ...s, impact: prio.impact, priorite: prio.priorite, explication: [...s.explication.filter((e) => !/^(Impact|Effort|Quick win|À planifier|À construire|Classée)/.test(e)), ...prio.explication] };
      }),
    }));
  const decider = (s: Solution, d: DecisionSolution) =>
    maj((x) => ({
      ...x,
      solutions: x.solutions.map((y) => (y.id === s.id ? { ...y, decision: d } : y)),
      decisions: d === 'a_decider' ? x.decisions : [...x.decisions, { id: genId(), date: new Date().toISOString().slice(0, 10), texte: `${LIBELLES_DECISION[d]} : ${s.titre}`, qui: 'Décision en séance' }],
    }));

  const probSel = volet?.kind === 'probleme' ? m.problemes.find((p) => p.id === volet.id) : undefined;
  const solSel = volet?.kind === 'solution' ? m.solutions.find((s) => s.id === volet.id) : undefined;
  const solSurvol = m.solutions.find((s) => s.id === survol);
  const eclaires = new Set<string>([...(solSurvol?.problemeIds ?? []), ...(solSel?.problemeIds ?? [])]);
  const classification = probSel ? classer(probSel.texte, pack.processusIds, 3) : [];
  const retenues = m.solutions.filter((s) => s.decision === 'retenue');

  return (
    <Coque
      fil={
        <>
          <Link href="/studio">Cockpit</Link>
          <span className="sep">/</span>
          <Link href={`/studio/client/${c.id}`}>{nomCourt(c.nom)}</Link>
          <span className="sep">/</span>
          <strong>{m.titre}</strong>
          <Tag ton="accent" point>
            Analyser
          </Tag>
        </>
      }
      actions={
        <>
          <button type="button" className="hx-btn cuivre" disabled={nouvelles.length === 0} title={nouvelles.length === 0 ? 'Confirme d’abord le rattachement d’un problème' : ''} onClick={() => { maj((x) => ({ ...x, solutions: [...x.solutions, ...nouvelles] })); notifier(`${nouvelles.length} solution(s) proposée(s) par règles, à décider.`); }}>
            <Sparkles size={14} /> Proposer {nouvelles.length > 0 ? `${nouvelles.length} solution(s)` : 'des solutions'}
          </button>
          <Link href="/studio" className="hx-btn primaire hx-cache-mobile">
            Passer à la décision
          </Link>
        </>
      }
    >
      <div className="hx-chiffres" style={{ marginBottom: 16 }}>
        <div>
          <div className="hx-sur">Problèmes</div>
          <div className="hx-chiffre">{m.problemes.length}</div>
          <div className="hx-tendance" style={{ color: 'var(--hx-rouge)' }}>
            {m.problemes.filter((p) => p.gravite === 3).length} bloquants
          </div>
        </div>
        <div>
          <div className="hx-sur">Rattachés à la bibliothèque</div>
          <div className="hx-chiffre">{m.problemes.filter((p) => p.universelStatut === 'confirme').length}</div>
          <div className="hx-tendance">sur {m.problemes.length}, confirmés par la consultante</div>
        </div>
        <div>
          <div className="hx-sur">Solutions candidates</div>
          <div className="hx-chiffre">{m.solutions.length}</div>
          <div className="hx-tendance" style={{ color: 'var(--hx-vert)' }}>
            {retenues.length} retenues · {m.solutions.filter((s) => s.priorite === 'quick_win').length} quick wins
          </div>
        </div>
        <div>
          <div className="hx-sur">Dépendance IA</div>
          <div className="hx-chiffre">{retenues.filter((s) => s.necessiteIA).length}</div>
          <div className="hx-tendance">parmi les retenues · mode dégradé assumé</div>
        </div>
      </div>

      <div className="hx-grille analyse">
        <section className="hx-bloc">
          <div className="hx-tete">
            <div>
              <span className="hx-h3">Problèmes</span>
              <span className="hx-mini"> · triés gravité × fréquence · propriétés modifiables en ligne</span>
            </div>
            <form
              className="hx-ligne"
              style={{ flexWrap: 'nowrap' }}
              onSubmit={(e) => {
                e.preventDefault();
                if (!nouveau.trim()) return;
                const cl = classer(nouveau, pack.processusIds, 1)[0];
                const p: Probleme = { id: genId(), texte: nouveau.trim(), etapeIds: [], gravite: 2, frequence: 2, preuves: [], causes: [], universelId: cl && cl.score >= 2 ? cl.universel.id : undefined, universelStatut: cl && cl.score >= 2 ? 'propose' : undefined };
                maj((x) => ({ ...x, problemes: [...x.problemes, p] }));
                setNouveau('');
                setVolet({ kind: 'probleme', id: p.id });
              }}
            >
              <input value={nouveau} onChange={(e) => setNouveau(e.target.value)} placeholder="Nouveau problème…" aria-label="Nouveau problème" style={{ font: 'inherit', fontSize: 12.5, border: '1px solid var(--hx-bord)', borderRadius: 8, padding: '5px 8px', height: 30, width: 200 }} />
              <button type="submit" className="hx-btn icone" aria-label="Ajouter le problème" disabled={!nouveau.trim()}>
                <Plus size={14} />
              </button>
            </form>
          </div>
          <div className="hx-corps serre">
            <table className="hx-table defilant" aria-label="Problèmes">
              <thead>
                <tr>
                  <th style={{ width: 28 }}>#</th>
                  <th>Problème</th>
                  <th>Gravité</th>
                  <th>Fréquence</th>
                  <th>Rattachement</th>
                  <th className="num">Preuves</th>
                  <th className="num">Causes</th>
                  <th className="num">Solutions</th>
                </tr>
              </thead>
              <tbody>
                {problemes.map((p, i) => (
                  <tr key={p.id} className={`hx-rangee${eclaires.has(p.id) ? ' hx-eclaire' : ''}`} aria-selected={probSel?.id === p.id} onClick={() => setVolet({ kind: 'probleme', id: p.id })} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setVolet({ kind: 'probleme', id: p.id })}>
                    <td className="hx-mini">{i + 1}</td>
                    <td>
                      <div className="hx-titre-cellule">{p.texte}</div>
                      <div className="hx-ligne" style={{ gap: 4, marginTop: 3 }}>
                        <Tag ton={p.gravite === 3 ? 'rouge' : p.gravite === 2 ? 'ambre' : 'contour'}>{LIBELLES_GRAVITE[p.gravite]}</Tag>
                        <Tag>{LIBELLES_FREQUENCE[p.frequence]}</Tag>
                      </div>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Niveaux valeur={p.gravite} ton="rouge" label="Gravité" onChange={(n) => { majProbleme(p.id, (x) => ({ ...x, gravite: n })); recalculer(); }} />
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Niveaux valeur={p.frequence} label="Fréquence" onChange={(n) => { majProbleme(p.id, (x) => ({ ...x, frequence: n })); recalculer(); }} />
                    </td>
                    <td>
                      {p.universelId ? (
                        <Tag ton={p.universelStatut === 'confirme' ? 'cuivre' : 'contour'}>
                          {p.universelStatut === 'confirme' ? <Check size={11} /> : '?'} {problemeUniversel(p.universelId)?.label}
                        </Tag>
                      ) : (
                        <span className="hx-mini">—</span>
                      )}
                    </td>
                    <td className="num" style={p.preuves.length === 0 && p.gravite >= 2 ? { color: 'var(--hx-rouge)' } : undefined}>
                      {p.preuves.length}
                    </td>
                    <td className="num">{p.causes.length}</td>
                    <td className="num">{m.solutions.filter((s) => s.problemeIds.includes(p.id)).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
          <div className="hx-bloc">
            <div className="hx-tete">
              <span className="hx-h3">Carte des opportunités</span>
              <Regle>Priorisation par règles</Regle>
            </div>
            <div className="hx-corps" style={{ paddingTop: 8 }}>
              <Opportunites solutions={m.solutions} selection={solSel?.id ?? null} survol={survol} onSurvol={setSurvol} onSelect={(id) => setVolet({ kind: 'solution', id })} />
              <div className="hx-mini" style={{ marginTop: 4 }}>
                Survoler un point éclaire les problèmes qu’il résout. Les retenues sont cerclées.
              </div>
            </div>
          </div>
          <div className="hx-bloc">
            <div className="hx-tete">
              <span className="hx-h3">Solutions</span>
              <span className="hx-mini">
                {retenues.length}/{m.solutions.length} retenues
              </span>
            </div>
            <div className="hx-corps serre">
              <div className="hx-liste" aria-label="Solutions">
                {m.solutions.map((s) => (
                  <div key={s.id} className={`hx-rang${solSel?.id === s.id ? ' hx-actif' : ''}`} role="button" tabIndex={0} onMouseEnter={() => setSurvol(s.id)} onMouseLeave={() => setSurvol(null)} onClick={() => setVolet({ kind: 'solution', id: s.id })} onKeyDown={(e) => e.key === 'Enter' && setVolet({ kind: 'solution', id: s.id })}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: COULEURS[s.priorite], display: 'inline-block' }} aria-hidden />
                    <span>
                      <span className="hx-titre" style={{ display: 'block' }}>
                        {s.titre}
                      </span>
                      <span className="hx-mini">
                        {LIBELLES_PRIORITE[s.priorite]} · {LIBELLES_CATEGORIE[s.categorie]} · répond à {s.problemeIds.map((id) => `P${problemes.findIndex((p) => p.id === id) + 1}`).join(', ')}
                      </span>
                    </span>
                    <Tag ton={TON_DECISION[s.decision]}>{LIBELLES_DECISION[s.decision]}</Tag>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {probSel && (
        <aside className="hx-volet" aria-label="Fiche du problème">
          <div className="hx-volet-tete">
            <Tag ton={probSel.gravite === 3 ? 'rouge' : probSel.gravite === 2 ? 'ambre' : 'contour'}>{LIBELLES_GRAVITE[probSel.gravite]}</Tag>
            <strong style={{ flex: 1, fontSize: 13 }}>Problème</strong>
            <button type="button" className="hx-btn fantome icone" aria-label="Fermer" onClick={() => setVolet(null)}>
              <X size={16} />
            </button>
          </div>
          <div className="hx-volet-corps">
            <textarea aria-label="Énoncé du problème" value={probSel.texte} onChange={(e) => majProbleme(probSel.id, (p) => ({ ...p, texte: e.target.value }))} rows={2} style={{ width: '100%', font: 'inherit', fontSize: 14, fontWeight: 600, border: '1px solid transparent', borderRadius: 8, padding: 6, resize: 'vertical' }} />
            <div className="hx-props" style={{ marginTop: 8 }}>
              <div className="hx-prop">
                <span>Gravité</span>
                <span className="hx-valeur">
                  <Niveaux valeur={probSel.gravite} ton="rouge" label="Gravité" onChange={(n) => { majProbleme(probSel.id, (p) => ({ ...p, gravite: n })); recalculer(); }} /> <span className="hx-mini">{LIBELLES_GRAVITE[probSel.gravite]}</span>
                </span>
              </div>
              <div className="hx-prop">
                <span>Fréquence</span>
                <span className="hx-valeur">
                  <Niveaux valeur={probSel.frequence} label="Fréquence" onChange={(n) => { majProbleme(probSel.id, (p) => ({ ...p, frequence: n })); recalculer(); }} /> <span className="hx-mini">{LIBELLES_FREQUENCE[probSel.frequence]}</span>
                </span>
              </div>
              <div className="hx-prop">
                <span>Étapes</span>
                <span className="hx-valeur">
                  {probSel.etapeIds.length ? probSel.etapeIds.map((id) => <Tag key={id}>{m.etapes.find((e) => e.id === id)?.texte.slice(0, 28) ?? id}</Tag>) : <span className="hx-mini">non rattaché</span>}
                </span>
              </div>
            </div>

            <div className="hx-ligne espace" style={{ margin: '16px 0 6px' }}>
              <span className="hx-sur">Rattachement intermétiers</span>
              <Regle />
            </div>
            {probSel.universelStatut === 'confirme' && probSel.universelId ? (
              <div className="hx-alerte cuivre">
                <Check size={14} />
                <div>
                  <strong>{problemeUniversel(probSel.universelId)?.label}</strong> — confirmé. <span className="hx-mini">{problemeUniversel(probSel.universelId)?.coutTypique}</span>
                  <div>
                    <button type="button" className="hx-btn fantome" style={{ marginTop: 4 }} onClick={() => majProbleme(probSel.id, (p) => ({ ...p, universelId: undefined, universelStatut: undefined }))}>
                      Retirer
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 6 }}>
                {classification.length === 0 && <div className="hx-mini">Aucun signal reconnu par règles dans cet énoncé.</div>}
                {classification.map((cl) => (
                  <div key={cl.universel.id} className="hx-alerte">
                    <span aria-hidden>◇</span>
                    <div>
                      <div className="hx-ligne espace">
                        <strong>{cl.universel.label}</strong>
                        <button type="button" className="hx-btn cuivre" onClick={() => majProbleme(probSel.id, (p) => ({ ...p, universelId: cl.universel.id, universelStatut: 'confirme' }))}>
                          <Check size={13} /> Confirmer
                        </button>
                      </div>
                      <ul className="hx-mini" style={{ marginTop: 4, display: 'grid', gap: 2 }}>
                        {cl.explication.map((e, i) => (
                          <li key={i}>· {e}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
                <select aria-label="Choisir un problème universel" value="" onChange={(e) => e.target.value && majProbleme(probSel.id, (p) => ({ ...p, universelId: e.target.value, universelStatut: 'confirme' }))} style={{ font: 'inherit', fontSize: 12.5, border: '1px solid var(--hx-bord)', borderRadius: 8, padding: 6 }}>
                  <option value="">Ou choisir directement…</option>
                  {bibliotheque.problemesUniversels.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="hx-sur" style={{ margin: '16px 0 6px' }}>
              Preuves
            </div>
            <div style={{ display: 'grid', gap: 4 }}>
              {probSel.preuves.map((pr) => (
                <div key={pr.id} className="hx-ligne" style={{ fontSize: 12.5 }}>
                  <Tag>{LIBELLES_TYPE_PREUVE[pr.type]}</Tag> {pr.source} <span className="hx-mini">{pr.date}</span>
                </div>
              ))}
              {probSel.preuves.length === 0 && probSel.gravite >= 2 && (
                <div className="hx-alerte rouge">
                  <span aria-hidden>●</span>
                  <div>Problème coûteux ou bloquant sans preuve : à documenter avant la restitution.</div>
                </div>
              )}
              <button type="button" className="hx-btn" onClick={() => majProbleme(probSel.id, (p) => ({ ...p, preuves: [...p.preuves, { id: genId(), type: 'observation', source: 'Observation en atelier (à préciser)', date: new Date().toISOString().slice(0, 10) }] }))}>
                <Plus size={13} /> Ajouter une observation
              </button>
            </div>

            <div className="hx-sur" style={{ margin: '16px 0 6px' }}>
              Causes candidates
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {probSel.causes.map((k) => (
                <div key={k.id} className="hx-ligne espace" style={{ fontSize: 12.5 }}>
                  <span>{k.texte}</span>
                  <select aria-label="Statut de la cause" value={k.statut} onChange={(e) => majProbleme(probSel.id, (p) => ({ ...p, causes: p.causes.map((y) => (y.id === k.id ? { ...y, statut: e.target.value as StatutCause } : y)) }))} style={{ font: 'inherit', fontSize: 12, border: '1px solid var(--hx-bord)', borderRadius: 6, padding: '2px 4px' }}>
                    {Object.entries(LIBELLES_STATUT_CAUSE).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <form
                className="hx-ligne"
                style={{ flexWrap: 'nowrap' }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!cause.trim()) return;
                  majProbleme(probSel.id, (p) => ({ ...p, causes: [...p.causes, { id: genId(), texte: cause.trim(), statut: 'hypothese' }] }));
                  setCause('');
                }}
              >
                <input value={cause} onChange={(e) => setCause(e.target.value)} placeholder="Pourquoi, selon le client ?" aria-label="Nouvelle cause" style={{ flex: 1, font: 'inherit', fontSize: 12.5, border: '1px solid var(--hx-bord)', borderRadius: 8, padding: '5px 8px' }} />
                <button type="submit" className="hx-btn icone" aria-label="Ajouter la cause" disabled={!cause.trim()}>
                  <Plus size={14} />
                </button>
              </form>
            </div>

            <div className="hx-sur" style={{ margin: '16px 0 6px' }}>
              Solutions qui y répondent
            </div>
            <div className="hx-liste">
              {m.solutions
                .filter((s) => s.problemeIds.includes(probSel.id))
                .map((s) => (
                  <div key={s.id} className="hx-rang" role="button" tabIndex={0} onClick={() => setVolet({ kind: 'solution', id: s.id })} onKeyDown={(e) => e.key === 'Enter' && setVolet({ kind: 'solution', id: s.id })}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: COULEURS[s.priorite], display: 'inline-block' }} />
                    <span className="hx-titre">{s.titre}</span>
                    <Tag ton={TON_DECISION[s.decision]}>{LIBELLES_DECISION[s.decision]}</Tag>
                  </div>
                ))}
            </div>
          </div>
          <div className="hx-volet-pied">
            <button type="button" className="hx-btn danger" onClick={() => { maj((x) => ({ ...x, problemes: x.problemes.filter((p) => p.id !== probSel.id), solutions: x.solutions.map((s) => ({ ...s, problemeIds: s.problemeIds.filter((i) => i !== probSel.id) })) })); setVolet(null); }}>
              Supprimer
            </button>
          </div>
        </aside>
      )}

      {solSel && (
        <aside className="hx-volet" aria-label="Fiche de la solution">
          <div className="hx-volet-tete">
            <Tag ton={TON_PRIORITE[solSel.priorite]}>{LIBELLES_PRIORITE[solSel.priorite]}</Tag>
            <strong style={{ flex: 1, fontSize: 13 }}>Solution</strong>
            <button type="button" className="hx-btn fantome icone" aria-label="Fermer" onClick={() => setVolet(null)}>
              <X size={16} />
            </button>
          </div>
          <div className="hx-volet-corps">
            <h2 className="hx-h2" style={{ marginBottom: 6 }}>
              {solSel.titre}
            </h2>
            <div className="hx-ligne" style={{ marginBottom: 8 }}>
              <Tag>{LIBELLES_CATEGORIE[solSel.categorie]}</Tag>
              {solSel.necessiteIA && <Tag ton="ambre">Dépend d’une IA</Tag>}
              {solSel.faisabilite.outilDejaPresent && <Tag ton="vert">Outil déjà présent</Tag>}
              {solSel.origine === 'manuel' ? <Tag ton="contour">Ajoutée à la main</Tag> : <Regle>Rapprochée par règles</Regle>}
            </div>
            <p style={{ fontSize: 13 }}>{solSel.detail}</p>

            <div className="hx-sur" style={{ margin: '16px 0 6px' }}>
              Pourquoi cette proposition
            </div>
            <ul style={{ display: 'grid', gap: 4, fontSize: 12.5 }}>
              {solSel.explication.map((e, i) => (
                <li key={i} style={{ paddingLeft: 12, textIndent: -12 }}>
                  · {e}
                </li>
              ))}
            </ul>

            <div className="hx-sur" style={{ margin: '16px 0 6px' }}>
              Faisabilité
            </div>
            <div className="hx-props">
              <div className="hx-prop">
                <span>Effort</span>
                <span className="hx-valeur">
                  <Niveaux valeur={EFFORT[solSel.faisabilite.effort] as 1 | 2 | 3} ton="bleu" label="Effort" /> <span className="hx-mini">{LIBELLES_EFFORT[solSel.faisabilite.effort]}</span>
                </span>
              </div>
              <div className="hx-prop">
                <span>Impact</span>
                <span className="hx-valeur">
                  <Niveaux valeur={solSel.impact} ton="vert" label="Impact" /> <span className="hx-mini">{solSel.impact}/3</span>
                </span>
              </div>
              <div className="hx-prop">
                <span>Coût mensuel</span>
                <span className="hx-valeur">{solSel.faisabilite.coutMensuel}</span>
              </div>
              <div className="hx-prop">
                <span>Avec l’existant</span>
                <span className="hx-valeur">{solSel.outilsCompatibles.length ? solSel.outilsCompatibles.join(', ') : 'Sans outil particulier'}</span>
              </div>
              <div className="hx-prop">
                <span>Répond à</span>
                <span className="hx-valeur">
                  {solSel.problemeIds.map((id) => (
                    <Tag key={id} ton="rouge">
                      P{problemes.findIndex((p) => p.id === id) + 1}
                    </Tag>
                  ))}
                </span>
              </div>
            </div>
            {solSel.alternativeSansIA && (
              <p style={{ fontSize: 12.5, marginTop: 10 }}>
                <strong>Alternative sans IA :</strong> {solSel.alternativeSansIA}
              </p>
            )}
            {solSel.faisabilite.prerequis.length > 0 && (
              <p style={{ fontSize: 12.5, marginTop: 6 }}>
                <strong>Prérequis :</strong> {solSel.faisabilite.prerequis.join(' ')}
              </p>
            )}
            {solSel.faisabilite.risques.length > 0 && (
              <p style={{ fontSize: 12.5, marginTop: 6 }}>
                <strong>Risques :</strong> {solSel.faisabilite.risques.join(' ')}
              </p>
            )}
          </div>
          <div className="hx-volet-pied">
            <div className="hx-segments" role="group" aria-label="Décision">
              {(['retenue', 'plus_tard', 'ecartee'] as DecisionSolution[]).map((d) => (
                <button key={d} type="button" aria-pressed={solSel.decision === d} onClick={() => decider(solSel, solSel.decision === d ? 'a_decider' : d)}>
                  {LIBELLES_DECISION[d]}
                </button>
              ))}
            </div>
            <button type="button" className="hx-btn fantome danger" onClick={() => { maj((x) => ({ ...x, solutions: x.solutions.filter((s) => s.id !== solSel.id) })); setVolet(null); }}>
              Retirer
            </button>
          </div>
        </aside>
      )}

      {toast && (
        <div className="hx-toast" role="status">
          {toast}
        </div>
      )}
    </Coque>
  );
}

export default function Page() {
  return <Analyse />;
}
