'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Check, GitBranch, Lightbulb, MousePointer2, Plus, Sparkles, StickyNote, Trash2, X } from 'lucide-react';
import { Coque } from '../../../components/studio/Coque';
import { useStudio, type Position } from '../../../components/studio/StudioContext';
import { Canvas, NOEUD_H, NOEUD_L, couloirsDe, positionDefaut, type Selection } from '../../../components/studio/Canvas';
import { Niveaux, Regle, Tag, heureCourte, nomCourt } from '../../../components/studio/Elements';
import { LIBELLES_STATUT_FAIT, LIBELLES_TYPE_ENTREE, genId, type Entree, type Etape, type Mission, type Probleme, type TypeEntree, type VersionProcessus } from '../../../lib/domain/types';
import { getPack, questionsPour } from '../../../lib/packs';
import { LIBELLES_SUGGESTION, suggerer } from '../../../lib/intelligence/copilote';
import { classer } from '../../../lib/intelligence/classification';
import { initialiserCible, textesDeMission } from '../../../lib/intelligence/processus';
import { obtenirFournisseur } from '../../../lib/ai/gateway';

const MISSION_ID = 'demo-ardan-veille';

function Atelier() {
  const { mission, client, majMission, canvas, majCanvas } = useStudio();
  const m = mission(MISSION_ID);
  const c = m ? client(m.clientId) : undefined;
  const [version, setVersion] = useState<VersionProcessus>('actuel');
  const [selection, setSelection] = useState<Selection>(null);
  const [outil, setOutil] = useState<'selection' | 'etape' | 'note'>('selection');
  const [voletDroit, setVoletDroit] = useState<'copilote' | 'element' | 'faits'>('copilote');
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [saisie, setSaisie] = useState({ texte: '', type: 'note' as TypeEntree, auteur: 'client' as Entree['auteur'] });
  const [ignorees, setIgnorees] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  const pack = m ? getPack(m.packId) : undefined;
  const questions = useMemo(() => (pack ? questionsPour(pack) : []), [pack]);
  const trame = useMemo(() => (m ? questions.filter((q) => m.trame.includes(q.id)) : []), [questions, m]);
  const suggestions = useMemo(() => (m && pack ? suggerer(m, pack, questions, pack.processusIds).filter((s) => !ignorees.has(s.id)) : []), [m, pack, questions, ignorees]);
  const etatCanvas = canvas(MISSION_ID);

  useEffect(() => {
    if (selection) setVoletDroit('element');
  }, [selection]);

  useEffect(() => {
    const sur = (e: KeyboardEvent) => {
      const cible = e.target as HTMLElement | null;
      if (cible && (cible.tagName === 'INPUT' || cible.tagName === 'TEXTAREA' || cible.tagName === 'SELECT')) return;
      if (e.key === 'Escape') {
        setSelection(null);
        setOutil('selection');
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selection) supprimerSelection();
      if (e.key === 'v') setOutil('selection');
      if (e.key === 'e') setOutil('etape');
      if (e.key === 'n') setOutil('note');
    };
    window.addEventListener('keydown', sur);
    return () => window.removeEventListener('keydown', sur);
  });

  if (!m || !c || !pack) {
    return (
      <Coque fil={<strong>Atelier</strong>}>
        <div className="hx-vide">
          <strong>Mission de démonstration introuvable.</strong> Réinitialise la démonstration depuis la palette (⌘K).
        </div>
      </Coque>
    );
  }

  const notifier = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };
  const maj = (fn: (x: Mission) => Mission) => majMission(m.id, fn);
  const etapeSel = selection?.kind === 'etape' ? m.etapes.find((e) => e.id === selection.id) : undefined;
  const noteSel = selection?.kind === 'note' ? etatCanvas.notes.find((n) => n.id === selection.id) : undefined;
  const couloirs = couloirsDe(m.etapes, version);

  /* ---------- Journal ---------- */
  const noter = () => {
    if (!saisie.texte.trim()) return;
    const e: Entree = { id: genId(), type: saisie.type, texte: saisie.texte.trim(), horodatage: new Date().toISOString(), auteur: saisie.auteur, questionId: questionId ?? undefined };
    maj((x) => ({ ...x, journal: [...x.journal, e] }));
    setSaisie((s) => ({ ...s, texte: '' }));
  };
  const enEtape = (e: Entree) => {
    const et: Etape = { id: genId(), texte: e.texte, acteur: etapeSel?.acteur ?? '', version, origine: 'manuel', statut: 'accepte', changement: version === 'cible' ? 'nouvelle' : undefined, sources: ['entree:' + e.id] };
    maj((x) => ({ ...x, etapes: [...x.etapes, et] }));
    setSelection({ kind: 'etape', id: et.id });
    notifier('Étape ajoutée sur le canvas.');
  };
  const enNote = (e: Entree) => {
    const base = etapeSel ? (etatCanvas.positions[etapeSel.id] ?? positionDefaut(etapeSel, m.etapes.filter((x) => x.version === version).indexOf(etapeSel), couloirs)) : { x: 200, y: 20 };
    const note = { id: genId(), texte: e.texte, type: e.type === 'citation' ? ('citation' as const) : e.auteur === 'copilote' ? ('copilote' as const) : ('note' as const), x: base.x + NOEUD_L + 20, y: base.y - 10, entreeId: e.id };
    majCanvas(m.id, (cv) => ({ ...cv, notes: [...cv.notes, note] }));
    setSelection({ kind: 'note', id: note.id });
  };
  const enProbleme = (texte: string, entreeId?: string, etapeIds: string[] = []) => {
    const cl = classer(texte, pack.processusIds, 1)[0];
    const p: Probleme = { id: genId(), texte, etapeIds, gravite: 2, frequence: 2, preuves: entreeId ? [{ id: genId(), type: 'declaration', source: 'Atelier', date: new Date().toISOString().slice(0, 10) }] : [], causes: [], universelId: cl && cl.score >= 2 ? cl.universel.id : undefined, universelStatut: cl && cl.score >= 2 ? 'propose' : undefined, entreeId };
    maj((x) => ({ ...x, problemes: [...x.problemes, p] }));
    notifier(cl && cl.score >= 2 ? `Problème créé, rattaché par règles à « ${cl.universel.label} » (à confirmer).` : 'Problème créé.');
  };
  const enFait = (e: Entree) => {
    if (m.faits.some((f) => f.entreeId === e.id)) return;
    maj((x) => ({ ...x, faits: [...x.faits, { id: genId(), texte: e.texte, statut: e.auteur === 'client' ? 'declare' : 'observe', source: e.auteur === 'client' ? 'Déclaration en atelier' : 'Observation en atelier', entreeId: e.id }] }));
  };

  /* ---------- Canvas ---------- */
  const deplacer = (kind: 'etape' | 'note', id: string, pos: Position, couloir?: string) => {
    if (kind === 'etape') {
      majCanvas(m.id, (cv) => ({ ...cv, positions: { ...cv.positions, [id]: pos } }));
      if (couloir && couloir !== 'Non attribué') maj((x) => ({ ...x, etapes: x.etapes.map((e) => (e.id === id && e.acteur !== couloir ? { ...e, acteur: couloir, changement: e.version === 'cible' && e.changement === 'inchangee' ? 'modifiee' : e.changement } : e)) }));
    } else majCanvas(m.id, (cv) => ({ ...cv, notes: cv.notes.map((n) => (n.id === id ? { ...n, x: pos.x, y: pos.y } : n)) }));
  };
  const creer = (kind: 'etape' | 'note', pos: Position, couloir: string) => {
    if (kind === 'etape') {
      const et: Etape = { id: genId(), texte: 'Nouvelle étape', acteur: couloir === 'Non attribué' ? '' : couloir, version, origine: 'manuel', statut: 'accepte', changement: version === 'cible' ? 'nouvelle' : undefined, sources: [] };
      maj((x) => ({ ...x, etapes: [...x.etapes, et] }));
      majCanvas(m.id, (cv) => ({ ...cv, positions: { ...cv.positions, [et.id]: pos } }));
      setSelection({ kind: 'etape', id: et.id });
    } else {
      const n = { id: genId(), texte: 'Nouvelle note', type: 'note' as const, x: pos.x, y: pos.y };
      majCanvas(m.id, (cv) => ({ ...cv, notes: [...cv.notes, n] }));
      setSelection({ kind: 'note', id: n.id });
    }
    setOutil('selection');
  };
  const majEtape = (id: string, fn: (e: Etape) => Etape) => maj((x) => ({ ...x, etapes: x.etapes.map((e) => (e.id === id ? fn(e) : e)) }));
  const supprimerSelection = () => {
    if (!selection) return;
    if (selection.kind === 'etape') {
      maj((x) => ({ ...x, etapes: x.etapes.filter((e) => e.id !== selection.id), problemes: x.problemes.map((p) => ({ ...p, etapeIds: p.etapeIds.filter((i) => i !== selection.id) })) }));
    } else majCanvas(m.id, (cv) => ({ ...cv, notes: cv.notes.filter((n) => n.id !== selection.id) }));
    setSelection(null);
  };
  const extraire = async () => {
    const dejaLa = new Set(m.etapes.map((e) => e.texte.toLowerCase()));
    const nouvelles = (await obtenirFournisseur().extraireEtapes(textesDeMission(m), pack)).filter((e) => !dejaLa.has(e.texte.toLowerCase()));
    if (!nouvelles.length) return notifier('Aucune nouvelle étape à extraire des notes.');
    maj((x) => ({ ...x, etapes: [...x.etapes, ...nouvelles] }));
    notifier(`${nouvelles.length} étape(s) proposée(s) par règles : en pointillé cuivre, à accepter ou rejeter.`);
  };
  const proposees = m.etapes.filter((e) => e.version === version && e.statut === 'propose');
  const aCible = m.etapes.some((e) => e.version === 'cible');

  const appliquer = (s: (typeof suggestions)[number]) => {
    if (s.type === 'signal' && s.cible) {
      const source = s.cible.kind === 'entree' ? m.journal.find((e) => e.id === s.cible!.id)?.texte : m.reponses[s.cible.id]?.texte;
      enProbleme((source ?? s.titre).split(/[.!?\n]/)[0].trim() || s.titre, s.cible.kind === 'entree' ? s.cible.id : undefined, etapeSel ? [etapeSel.id] : []);
    } else if (s.type === 'manque' && s.cible) setQuestionId(s.cible.id);
    else {
      const e: Entree = { id: genId(), type: 'question', texte: s.type === 'contradiction' ? `Contre-exemple demandé : ${s.titre.replace(/ : demander un contre-exemple$/, '')}` : s.detail, horodatage: new Date().toISOString(), auteur: 'copilote' };
      maj((x) => ({ ...x, journal: [...x.journal, e] }));
    }
    setIgnorees((prev) => new Set(prev).add(s.id));
  };

  return (
    <Coque
      serre
      fil={
        <>
          <Link href="/studio">Cockpit</Link>
          <span className="sep">/</span>
          <Link href={`/studio/client/${c.id}`}>{nomCourt(c.nom)}</Link>
          <span className="sep">/</span>
          <strong>{m.titre}</strong>
          <Tag ton="accent" point>
            Atelier
          </Tag>
        </>
      }
      actions={
        <>
          <div className="hx-segments" role="group" aria-label="Version du processus">
            <button type="button" aria-pressed={version === 'actuel'} onClick={() => setVersion('actuel')}>
              Aujourd’hui
            </button>
            <button type="button" aria-pressed={version === 'cible'} onClick={() => setVersion('cible')}>
              Cible {aCible ? `· ${m.etapes.filter((e) => e.version === 'cible' && e.statut === 'accepte').length}` : ''}
            </button>
          </div>
          <Link href="/studio/analyse" className="hx-btn primaire hx-cache-mobile">
            Passer à l’analyse
          </Link>
        </>
      }
    >
      <div className={`hx-atelier${voletDroit ? ' hx-droit-ouvert' : ''}`}>
        {/* ---------- Conversation ---------- */}
        <section className="hx-volet-gauche" aria-label="Conversation">
          <div className="hx-volet-titre">
            <span className="hx-h3">Conversation</span>
            <span className="hx-mini">
              {m.journal.length} entrées · {trame.filter((q) => m.reponses[q.id]?.texte).length}/{trame.length} questions
            </span>
          </div>
          <div className="hx-trame" aria-label="Trame">
            {trame.map((q, i) => (
              <button key={q.id} type="button" className={m.reponses[q.id]?.texte ? 'fait' : ''} aria-pressed={questionId === q.id} onClick={() => setQuestionId(questionId === q.id ? null : q.id)} title={q.texte}>
                Q{i + 1}
              </button>
            ))}
          </div>
          {questionId && (
            <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--hx-bord)', background: 'var(--hx-surface-2)' }}>
              <div className="hx-ligne espace">
                <span className="hx-sur">Question {trame.findIndex((q) => q.id === questionId) + 1}</span>
                <button type="button" className="hx-btn fantome icone" aria-label="Fermer la question" onClick={() => setQuestionId(null)}>
                  <X size={14} />
                </button>
              </div>
              <div style={{ fontSize: 13, margin: '4px 0 6px' }}>{questions.find((q) => q.id === questionId)?.texte}</div>
              <textarea aria-label="Réponse" rows={3} value={m.reponses[questionId]?.texte ?? ''} onChange={(e) => maj((x) => ({ ...x, reponses: { ...x.reponses, [questionId]: { texte: e.target.value, statut: x.reponses[questionId]?.statut ?? 'declare' } } }))} style={{ width: '100%', font: 'inherit', fontSize: 13, border: '1px solid var(--hx-bord)', borderRadius: 8, padding: 8 }} />
            </div>
          )}
          <div className="hx-journal" aria-live="polite">
            {m.journal.map((e) => (
              <article key={e.id} className={`hx-entree ${e.type} ${e.auteur}`}>
                <div className="hx-heure">
                  {heureCourte(e.horodatage)}
                  <b>{e.auteur === 'client' ? 'Client' : e.auteur === 'copilote' ? 'Copilote' : 'Moi'}</b>
                </div>
                <div>
                  <div className="hx-texte">{e.type === 'citation' ? `« ${e.texte} »` : e.texte}</div>
                  <div className="hx-ligne" style={{ gap: 4, marginTop: 3 }}>
                    <span className="hx-mini">{LIBELLES_TYPE_ENTREE[e.type]}</span>
                    {m.problemes.some((p) => p.entreeId === e.id) && <Tag ton="rouge">Problème</Tag>}
                    {m.faits.some((f) => f.entreeId === e.id) && <Tag ton="bleu">Fait</Tag>}
                    {etatCanvas.notes.some((n) => n.entreeId === e.id) && <Tag ton="ambre">Sur le canvas</Tag>}
                  </div>
                  <div className="hx-actions">
                    <button type="button" className="hx-btn fantome" onClick={() => enNote(e)} title="Épingler sur le canvas">
                      <StickyNote size={12} /> Canvas
                    </button>
                    {e.auteur !== 'copilote' && (
                      <button type="button" className="hx-btn fantome" onClick={() => enEtape(e)}>
                        → Étape
                      </button>
                    )}
                    {!m.problemes.some((p) => p.entreeId === e.id) && (
                      <button type="button" className="hx-btn fantome" onClick={() => enProbleme(e.texte, e.id, etapeSel ? [etapeSel.id] : [])}>
                        → Problème
                      </button>
                    )}
                    {!m.faits.some((f) => f.entreeId === e.id) && e.auteur !== 'copilote' && (
                      <button type="button" className="hx-btn fantome" onClick={() => enFait(e)}>
                        → Fait
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="hx-saisie">
            <textarea
              value={saisie.texte}
              onChange={(e) => setSaisie({ ...saisie, texte: e.target.value })}
              onKeyDown={(e) => (e.ctrlKey || e.metaKey) && e.key === 'Enter' && noter()}
              placeholder={questionId ? 'Réponse ou remarque sur la question sélectionnée…' : 'Ce que dit le client, ce que tu observes… (Ctrl + Entrée)'}
              aria-label="Nouvelle entrée"
            />
            <div className="hx-ligne espace" style={{ marginTop: 6 }}>
              <div className="hx-segments">
                <button type="button" aria-pressed={saisie.auteur === 'client'} onClick={() => setSaisie({ ...saisie, auteur: 'client', type: saisie.type === 'note' ? 'citation' : saisie.type })}>
                  Client
                </button>
                <button type="button" aria-pressed={saisie.auteur === 'consultante'} onClick={() => setSaisie({ ...saisie, auteur: 'consultante', type: saisie.type === 'citation' ? 'note' : saisie.type })}>
                  Moi
                </button>
              </div>
              <button type="button" className="hx-btn primaire" onClick={noter} disabled={!saisie.texte.trim()}>
                <Plus size={14} /> Noter
              </button>
            </div>
          </div>
        </section>

        {/* ---------- Canvas ---------- */}
        <div style={{ position: 'relative', minWidth: 0, minHeight: 0, height: '100%' }}>
          <Canvas mission={m} version={version} etat={etatCanvas} selection={selection} onSelect={setSelection} onDeplacer={deplacer} outil={outil} onCreer={creer} onDoubleClic={() => setVoletDroit('element')} />
          <div className="hx-canvas-titre">
            <span className="hx-btn" style={{ cursor: 'default' }}>
              <GitBranch size={14} /> Processus · {version === 'actuel' ? 'aujourd’hui' : 'cible'} · {m.etapes.filter((e) => e.version === version && e.statut !== 'rejete').length} étapes
            </span>
            {proposees.length > 0 && (
              <>
                <button type="button" className="hx-btn cuivre" onClick={() => maj((x) => ({ ...x, etapes: x.etapes.map((e) => (e.version === version && e.statut === 'propose' ? { ...e, statut: 'accepte' } : e)) }))}>
                  <Check size={14} /> Accepter les {proposees.length} proposées
                </button>
                <button type="button" className="hx-btn" onClick={() => maj((x) => ({ ...x, etapes: x.etapes.filter((e) => !(e.version === version && e.statut === 'propose')) }))}>
                  Rejeter
                </button>
              </>
            )}
            {version === 'cible' && !aCible && (
              <button type="button" className="hx-btn primaire" onClick={() => maj((x) => ({ ...x, etapes: initialiserCible(x.etapes) }))}>
                Initialiser la cible depuis aujourd’hui
              </button>
            )}
          </div>
          <div className="hx-outils" role="toolbar" aria-label="Outils du canvas">
            <button type="button" className="hx-btn fantome" aria-pressed={outil === 'selection'} onClick={() => setOutil('selection')} title="Sélection (V)">
              <MousePointer2 size={14} /> <span>Sélection</span>
            </button>
            <button type="button" className="hx-btn fantome" aria-pressed={outil === 'etape'} onClick={() => setOutil('etape')} title="Ajouter une étape : cliquer sur un couloir (E)">
              <Plus size={14} /> <span>Étape</span>
            </button>
            <button type="button" className="hx-btn fantome" aria-pressed={outil === 'note'} onClick={() => setOutil('note')} title="Ajouter une note (N)">
              <StickyNote size={14} /> <span>Note</span>
            </button>
            {version === 'actuel' && (
              <button type="button" className="hx-btn cuivre" onClick={extraire} title="Découpe les notes et réponses en étapes proposées (règles)">
                <Sparkles size={14} /> <span>Extraire des notes</span>
              </button>
            )}
          </div>
          <div className="hx-canvas-legende" aria-hidden>
            <span>
              <i /> Étape
            </span>
            <span>
              <i style={{ borderColor: 'var(--hx-cuivre)', borderStyle: 'dashed', background: 'var(--hx-cuivre-clair)' }} /> Proposée par règles
            </span>
            <span>
              <i style={{ background: 'var(--hx-rouge)', borderColor: 'var(--hx-rouge)', borderRadius: '50%', width: 9 }} /> Problèmes
            </span>
            <span>
              <i style={{ background: '#fff6c7', borderColor: '#e8d98a' }} /> Note
            </span>
            {version === 'cible' && (
              <>
                <span>
                  <i style={{ background: 'var(--hx-vert-clair)', borderColor: 'var(--hx-vert)' }} /> Nouvelle
                </span>
                <span>
                  <i style={{ background: 'var(--hx-bleu-clair)', borderColor: 'var(--hx-bleu)' }} /> Modifiée
                </span>
              </>
            )}
          </div>
        </div>

        {/* ---------- Volet droit ---------- */}
        <aside className="hx-volet-droit" aria-label="Volet contextuel">
          <div className="hx-onglets" role="tablist" style={{ position: 'sticky', top: 0, background: 'var(--hx-surface)', zIndex: 2 }}>
            <button type="button" role="tab" aria-selected={voletDroit === 'copilote'} onClick={() => setVoletDroit('copilote')}>
              <Lightbulb size={13} /> Copilote <span className="hx-compte">{suggestions.length}</span>
            </button>
            <button type="button" role="tab" aria-selected={voletDroit === 'element'} onClick={() => setVoletDroit('element')}>
              Élément
            </button>
            <button type="button" role="tab" aria-selected={voletDroit === 'faits'} onClick={() => setVoletDroit('faits')}>
              Faits <span className="hx-compte">{m.faits.length}</span>
            </button>
          </div>

          {voletDroit === 'copilote' && (
            <div>
              <div style={{ padding: '10px 12px' }} className="hx-ligne espace">
                <Regle />
                <span className="hx-mini">pas une IA</span>
              </div>
              {suggestions.length === 0 && <div className="hx-vide" style={{ margin: 12 }}>Rien à signaler. Le copilote repère des formes dans ce qui est noté : signaux connus, absolus, chiffres sans source, étapes sans acteur.</div>}
              {suggestions.map((s) => (
                <article key={s.id} className="hx-suggestion">
                  <Tag ton={s.type === 'signal' ? 'cuivre' : s.type === 'contradiction' ? 'rouge' : s.type === 'a_verifier' ? 'bleu' : 'contour'}>{LIBELLES_SUGGESTION[s.type]}</Tag>
                  <div className="hx-titre">{s.titre}</div>
                  <div className="hx-detail">{s.detail.length > 170 ? s.detail.slice(0, 169) + '…' : s.detail}</div>
                  <div className="hx-regle-txt">Règle : {s.regle}</div>
                  <div className="hx-actions">
                    <button type="button" className="hx-btn cuivre" onClick={() => appliquer(s)}>
                      {s.type === 'signal' ? 'Créer le problème' : s.type === 'manque' ? 'Ouvrir la question' : 'Noter la question'}
                    </button>
                    <button type="button" className="hx-btn fantome" onClick={() => setIgnorees((prev) => new Set(prev).add(s.id))}>
                      Ignorer
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {voletDroit === 'element' && (
            <div style={{ padding: 12 }}>
              {!etapeSel && !noteSel && (
                <div className="hx-vide">
                  <strong>Aucun élément sélectionné</strong>
                  Clique une étape ou une note sur le canvas. Glisse une étape vers un autre couloir pour changer son acteur.
                </div>
              )}
              {etapeSel && (
                <>
                  <div className="hx-ligne espace" style={{ marginBottom: 8 }}>
                    <span className="hx-sur">Étape</span>
                    <span className="hx-ligne" style={{ gap: 4 }}>
                      {etapeSel.statut === 'propose' && (
                        <button type="button" className="hx-btn cuivre" onClick={() => majEtape(etapeSel.id, (e) => ({ ...e, statut: 'accepte' }))}>
                          <Check size={13} /> Accepter
                        </button>
                      )}
                      <button type="button" className="hx-btn fantome danger icone" aria-label="Supprimer l’étape" onClick={supprimerSelection}>
                        <Trash2 size={14} />
                      </button>
                    </span>
                  </div>
                  <div className="hx-props">
                    <div className="hx-prop">
                      <span>Texte</span>
                      <textarea aria-label="Texte de l’étape" rows={2} value={etapeSel.texte} onChange={(e) => majEtape(etapeSel.id, (x) => ({ ...x, texte: e.target.value, changement: x.version === 'cible' && x.changement === 'inchangee' ? 'modifiee' : x.changement }))} />
                    </div>
                    <div className="hx-prop">
                      <span>Acteur</span>
                      <input aria-label="Acteur" list="hx-acteurs" value={etapeSel.acteur} onChange={(e) => majEtape(etapeSel.id, (x) => ({ ...x, acteur: e.target.value }))} placeholder="Rôle, pas nom" />
                      <datalist id="hx-acteurs">
                        {[...new Set([...couloirs, ...pack.vocabulaire.acteurs])].map((a) => (
                          <option key={a} value={a} />
                        ))}
                      </datalist>
                    </div>
                    <div className="hx-prop">
                      <span>Outil</span>
                      <input aria-label="Outil" value={etapeSel.outil ?? ''} onChange={(e) => majEtape(etapeSel.id, (x) => ({ ...x, outil: e.target.value || undefined }))} />
                    </div>
                    <div className="hx-prop">
                      <span>Durée (min)</span>
                      <input aria-label="Durée en minutes" type="number" min={0} value={etapeSel.dureeMin ?? ''} onChange={(e) => majEtape(etapeSel.id, (x) => ({ ...x, dureeMin: e.target.value ? Number(e.target.value) : undefined }))} />
                    </div>
                    {etapeSel.version === 'cible' && (
                      <div className="hx-prop">
                        <span>Changement</span>
                        <select aria-label="Changement" value={etapeSel.changement ?? 'inchangee'} onChange={(e) => majEtape(etapeSel.id, (x) => ({ ...x, changement: e.target.value as Etape['changement'] }))}>
                          <option value="inchangee">Inchangée</option>
                          <option value="modifiee">Modifiée</option>
                          <option value="nouvelle">Nouvelle</option>
                        </select>
                      </div>
                    )}
                    <div className="hx-prop">
                      <span>Sources</span>
                      <span className="hx-valeur hx-mini">{etapeSel.sources.join(', ') || '—'}</span>
                    </div>
                  </div>
                  <div className="hx-sur" style={{ margin: '14px 0 6px' }}>
                    Problèmes à cette étape
                  </div>
                  {m.problemes
                    .filter((p) => p.etapeIds.includes(etapeSel.id))
                    .map((p) => (
                      <div key={p.id} className="hx-alerte rouge" style={{ marginBottom: 6 }}>
                        <span aria-hidden>●</span>
                        <div>
                          {p.texte}
                          <div className="hx-ligne" style={{ gap: 6, marginTop: 4 }}>
                            <Niveaux valeur={p.gravite} ton="rouge" label="Gravité" /> <Niveaux valeur={p.frequence} label="Fréquence" />
                          </div>
                        </div>
                      </div>
                    ))}
                  <button type="button" className="hx-btn" onClick={() => enProbleme(`Difficulté à l’étape « ${etapeSel.texte} »`, undefined, [etapeSel.id])}>
                    <Plus size={13} /> Signaler un problème ici
                  </button>
                </>
              )}
              {noteSel && (
                <>
                  <div className="hx-ligne espace" style={{ marginBottom: 8 }}>
                    <span className="hx-sur">Note</span>
                    <button type="button" className="hx-btn fantome danger icone" aria-label="Supprimer la note" onClick={supprimerSelection}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="hx-props">
                    <div className="hx-prop">
                      <span>Texte</span>
                      <textarea aria-label="Texte de la note" rows={4} value={noteSel.texte} onChange={(e) => majCanvas(m.id, (cv) => ({ ...cv, notes: cv.notes.map((n) => (n.id === noteSel.id ? { ...n, texte: e.target.value } : n)) }))} />
                    </div>
                    <div className="hx-prop">
                      <span>Type</span>
                      <select aria-label="Type de note" value={noteSel.type} onChange={(e) => majCanvas(m.id, (cv) => ({ ...cv, notes: cv.notes.map((n) => (n.id === noteSel.id ? { ...n, type: e.target.value as typeof n.type } : n)) }))}>
                        <option value="note">Note</option>
                        <option value="citation">Verbatim client</option>
                        <option value="copilote">Question du copilote</option>
                      </select>
                    </div>
                  </div>
                  <button type="button" className="hx-btn" style={{ marginTop: 10 }} onClick={() => enProbleme(noteSel.texte, noteSel.entreeId)}>
                    <Plus size={13} /> Formaliser en problème
                  </button>
                </>
              )}
            </div>
          )}

          {voletDroit === 'faits' && (
            <div style={{ padding: 12, display: 'grid', gap: 8 }}>
              {m.faits.map((f) => (
                <div key={f.id} style={{ fontSize: 13 }}>
                  <div className="hx-ligne" style={{ gap: 6, marginBottom: 2 }}>
                    <Tag ton={f.statut === 'verifie' ? 'vert' : f.statut === 'observe' ? 'bleu' : 'ambre'}>{LIBELLES_STATUT_FAIT[f.statut]}</Tag>
                    <span className="hx-mini">{f.source}</span>
                  </div>
                  {f.texte}
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
      {toast && (
        <div className="hx-toast" role="status">
          {toast}
        </div>
      )}
      <span style={{ display: 'none' }}>{NOEUD_H}</span>
    </Coque>
  );
}

export default function Page() {
  return <Atelier />;
}
