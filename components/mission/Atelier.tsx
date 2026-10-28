'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, GitBranch, Lightbulb, Plus, Sparkles, Trash2, X } from 'lucide-react';
import type { PropsPhase } from './MissionShell';
import { CarteProcessus } from './CarteProcessus';
import { Badge, Carte, Champ, Encart, heureCourte } from '../ui';
import {
  LIBELLES_STATUT_FAIT,
  LIBELLES_STATUT_REPONSE,
  LIBELLES_TYPE_ENTREE,
  genId,
  type Entree,
  type Etape,
  type Fait,
  type Probleme,
  type StatutFait,
  type StatutReponse,
  type TypeEntree,
  type VersionProcessus,
} from '../../lib/domain/types';
import { questionsPour } from '../../lib/packs';
import { LIBELLES_SUGGESTION, suggerer, type Suggestion } from '../../lib/intelligence/copilote';
import { couloirs, diffProcessus, initialiserCible, textesDeMission } from '../../lib/intelligence/processus';
import { classer } from '../../lib/intelligence/classification';
import { obtenirFournisseur } from '../../lib/ai/gateway';

const TON_SUGGESTION: Record<Suggestion['type'], 'or' | 'rouge' | 'bleu' | 'accent' | 'contour'> = { signal: 'or', contradiction: 'rouge', a_verifier: 'bleu', question: 'accent', manque: 'contour' };

export function Atelier({ mission, client, pack, maj }: PropsPhase) {
  const questions = useMemo(() => questionsPour(pack), [pack]);
  const trame = useMemo(() => questions.filter((q) => mission.trame.includes(q.id)), [questions, mission.trame]);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [etapeId, setEtapeId] = useState<string | null>(null);
  const [version, setVersion] = useState<VersionProcessus>('actuel');
  const [ignorees, setIgnorees] = useState<Set<string>>(new Set());
  const [saisie, setSaisie] = useState({ texte: '', type: 'note' as TypeEntree, auteur: 'client' as Entree['auteur'] });
  const [nouvelleEtape, setNouvelleEtape] = useState('');
  const [onglet, setOnglet] = useState<'journal' | 'processus'>('journal');

  const question = trame.find((q) => q.id === questionId);
  const reponse = question ? mission.reponses[question.id] : undefined;
  const repondues = trame.filter((q) => mission.reponses[q.id]?.texte.trim()).length;
  const suggestions = useMemo(() => suggerer(mission, pack, questions, pack.processusIds).filter((s) => !ignorees.has(s.id)), [mission, pack, questions, ignorees]);
  const etape = mission.etapes.find((e) => e.id === etapeId);
  const proposees = mission.etapes.filter((e) => e.version === version && e.statut === 'propose');
  const visibles = mission.etapes.filter((e) => e.version === version && e.statut !== 'rejete');
  const aCible = mission.etapes.some((e) => e.version === 'cible');
  const diff = useMemo(() => diffProcessus(mission.etapes), [mission.etapes]);
  const cible = mission.etapes.filter((e) => e.version === 'cible' && e.statut === 'accepte');
  const resumeCible = `${cible.length} étape(s) : ${cible.filter((e) => e.changement === 'nouvelle').length} nouvelle(s), ${cible.filter((e) => e.changement === 'modifiee').length} modifiée(s), ${cible.filter((e) => !e.changement || e.changement === 'inchangee').length} inchangée(s)`;
  const acteursConnus = useMemo(() => [...new Set([...couloirs(mission.etapes, version).filter((a) => a !== 'Non attribué'), ...pack.vocabulaire.acteurs.map((a) => a.charAt(0).toUpperCase() + a.slice(1))])], [mission.etapes, version, pack]);

  /* ---------- Journal ---------- */
  const noter = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!saisie.texte.trim()) return;
    const entree: Entree = { id: genId(), type: saisie.type, texte: saisie.texte.trim(), horodatage: new Date().toISOString(), auteur: saisie.auteur, questionId: questionId ?? undefined };
    maj((m) => ({ ...m, journal: [...m.journal, entree] }));
    setSaisie((s) => ({ ...s, texte: '' }));
  };

  const changerType = (id: string, type: TypeEntree) => maj((m) => ({ ...m, journal: m.journal.map((x) => (x.id === id ? { ...x, type } : x)) }));

  const enFait = (e: Entree) => {
    if (mission.faits.some((f) => f.entreeId === e.id)) return;
    const fait: Fait = { id: genId(), texte: e.texte, statut: e.auteur === 'client' ? 'declare' : 'observe', source: e.auteur === 'client' ? 'Déclaration en atelier' : 'Observation en atelier', entreeId: e.id };
    maj((m) => ({ ...m, faits: [...m.faits, fait], journal: m.journal.map((x) => (x.id === e.id && x.type === 'note' ? { ...x, type: 'fait' } : x)) }));
  };

  const enProbleme = (texte: string, entreeId?: string, etapeIds: string[] = []) => {
    const c = classer(texte, pack.processusIds, 1)[0];
    const p: Probleme = {
      id: genId(),
      texte,
      etapeIds,
      gravite: 2,
      frequence: 2,
      preuves: entreeId ? [{ id: genId(), type: 'declaration', source: 'Atelier', date: new Date().toISOString().slice(0, 10) }] : [],
      causes: [],
      universelId: c && c.score >= 2 ? c.universel.id : undefined,
      universelStatut: c && c.score >= 2 ? 'propose' : undefined,
      entreeId,
    };
    maj((m) => ({ ...m, problemes: [...m.problemes, p] }));
  };

  const enEtape = (e: Entree) => {
    const et: Etape = { id: genId(), texte: e.texte, acteur: '', version: 'actuel', origine: 'manuel', statut: 'accepte', sources: ['entree:' + e.id] };
    maj((m) => ({ ...m, etapes: [...m.etapes, et] }));
    setVersion('actuel');
    setEtapeId(et.id);
    setOnglet('processus');
  };

  const enReponse = (e: Entree) => {
    if (!question) return;
    maj((m) => {
      const r = m.reponses[question.id];
      return { ...m, reponses: { ...m.reponses, [question.id]: { texte: r?.texte ? `${r.texte}\n${e.texte}` : e.texte, statut: r?.statut ?? (e.auteur === 'client' ? 'declare' : 'observe') } } };
    });
  };

  /* ---------- Processus ---------- */
  const majEtape = (id: string, fn: (e: Etape) => Etape) => maj((m) => ({ ...m, etapes: m.etapes.map((x) => (x.id === id ? fn(x) : x)) }));
  const deplacer = (id: string, sens: -1 | 1) =>
    maj((m) => {
      const ids = m.etapes.filter((e) => e.version === version).map((e) => e.id);
      const i = ids.indexOf(id);
      const j = i + sens;
      if (i < 0 || j < 0 || j >= ids.length) return m;
      const autres = m.etapes.filter((e) => e.version !== version);
      const memes = m.etapes.filter((e) => e.version === version);
      [memes[i], memes[j]] = [memes[j], memes[i]];
      return { ...m, etapes: [...autres, ...memes] };
    });
  const ajouterEtape = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouvelleEtape.trim()) return;
    const et: Etape = { id: genId(), texte: nouvelleEtape.trim(), acteur: etape?.acteur ?? '', version, origine: 'manuel', statut: 'accepte', changement: version === 'cible' ? 'nouvelle' : undefined, sources: [] };
    maj((m) => ({ ...m, etapes: [...m.etapes, et] }));
    setNouvelleEtape('');
    setEtapeId(et.id);
  };
  const extraire = async () => {
    const sources = textesDeMission(mission);
    const dejaLa = new Set(mission.etapes.map((e) => e.texte.toLowerCase()));
    const nouvelles = (await obtenirFournisseur().extraireEtapes(sources, pack)).filter((e) => !dejaLa.has(e.texte.toLowerCase()));
    maj((m) => ({ ...m, etapes: [...m.etapes, ...nouvelles] }));
    setVersion('actuel');
  };
  const supprimerEtape = (id: string) => {
    maj((m) => ({ ...m, etapes: m.etapes.filter((e) => e.id !== id), problemes: m.problemes.map((p) => ({ ...p, etapeIds: p.etapeIds.filter((x) => x !== id) })) }));
    setEtapeId(null);
  };

  /* ---------- Copilote ---------- */
  const appliquer = (s: Suggestion) => {
    if (s.type === 'signal' && s.cible) {
      const source = s.cible.kind === 'entree' ? mission.journal.find((e) => e.id === s.cible!.id)?.texte : mission.reponses[s.cible.id]?.texte;
      const texte = (source ?? s.titre).split(/[.!?\n]/)[0].trim() || s.titre;
      enProbleme(texte, s.cible.kind === 'entree' ? s.cible.id : undefined);
    } else if (s.type === 'manque' && s.cible) {
      setQuestionId(s.cible.id);
    } else if (s.type === 'a_verifier' && s.cible?.kind === 'entree') {
      const e = mission.journal.find((x) => x.id === s.cible!.id);
      if (e) {
        const fait: Fait = { id: genId(), texte: e.texte, statut: 'declare', source: '', entreeId: e.id };
        maj((m) => ({ ...m, faits: [...m.faits, fait], journal: m.journal.map((x) => (x.id === e.id ? { ...x, type: 'a_verifier' } : x)) }));
      }
    } else {
      const entree: Entree = { id: genId(), type: 'question', texte: s.type === 'contradiction' ? `Contre-exemple demandé : ${s.titre.replace(/ : demander un contre-exemple$/, '')}` : s.detail, horodatage: new Date().toISOString(), auteur: 'copilote' };
      maj((m) => ({ ...m, journal: [...m.journal, entree] }));
    }
    setIgnorees((prev) => new Set(prev).add(s.id));
  };

  return (
    <>
      <div className="ligne espace pas-imprime" style={{ marginBottom: '0.75rem' }}>
        <div className="ligne petit doux">
          <Badge ton="contour">
            {repondues}/{trame.length} questions couvertes
          </Badge>
          <Badge ton="contour">{mission.journal.length} entrées</Badge>
          <Badge ton="contour">{mission.faits.length} faits</Badge>
          <Badge ton="contour">{mission.etapes.filter((e) => e.version === 'actuel' && e.statut === 'accepte').length} étapes</Badge>
          <Badge ton={mission.problemes.length ? 'rouge' : 'contour'}>{mission.problemes.length} problèmes</Badge>
        </div>
        <div className="ligne">
          <button type="button" className={`bouton petit${onglet === 'processus' ? ' primaire' : ''}`} onClick={() => setOnglet(onglet === 'processus' ? 'journal' : 'processus')} aria-pressed={onglet === 'processus'}>
            <GitBranch size={14} /> {onglet === 'processus' ? 'Masquer la carte du processus' : 'Carte du processus'}
          </button>
        </div>
      </div>

      {onglet === 'processus' && (
        <Carte
          titre="Carte du processus"
          sousTitre="Acteurs en lignes, étapes dans l’ordre. Clique une étape pour la modifier, la déplacer ou y rattacher un problème."
          actions={
            <div className="ligne">
              <button type="button" className={`bouton petit${version === 'actuel' ? ' primaire' : ''}`} onClick={() => setVersion('actuel')} aria-pressed={version === 'actuel'}>
                Aujourd’hui
              </button>
              <button type="button" className={`bouton petit${version === 'cible' ? ' primaire' : ''}`} onClick={() => setVersion('cible')} aria-pressed={version === 'cible'}>
                Cible {aCible && <Badge ton="sauge">{diff.ajoutees.length > 0 ? `+${diff.ajoutees.length}` : '='}</Badge>}
              </button>
            </div>
          }
        >
          <CarteProcessus etapes={mission.etapes} version={version} problemes={mission.problemes} selection={etapeId} onSelect={(id) => setEtapeId(etapeId === id ? null : id)} />

          <div className="ligne pas-imprime" style={{ marginTop: '0.75rem' }}>
            {version === 'actuel' && (
              <button type="button" className="bouton petit" onClick={extraire} disabled={textesDeMission(mission).length === 0} title="Découpe les notes et réponses en étapes proposées (règles, sans IA)">
                <Sparkles size={14} /> Extraire des étapes des notes
              </button>
            )}
            {version === 'cible' && !aCible && (
              <button type="button" className="bouton petit accent" onClick={() => maj((m) => ({ ...m, etapes: initialiserCible(m.etapes) }))} disabled={!mission.etapes.some((e) => e.version === 'actuel' && e.statut === 'accepte')}>
                <GitBranch size={14} /> Initialiser la cible depuis l’actuel
              </button>
            )}
            {proposees.length > 0 && (
              <>
                <button type="button" className="bouton petit sauge" onClick={() => maj((m) => ({ ...m, etapes: m.etapes.map((e) => (e.version === version && e.statut === 'propose' ? { ...e, statut: 'accepte' } : e)) }))}>
                  <Check size={14} /> Accepter les {proposees.length} proposées
                </button>
                <button type="button" className="bouton petit" onClick={() => maj((m) => ({ ...m, etapes: m.etapes.filter((e) => !(e.version === version && e.statut === 'propose')) }))}>
                  <X size={14} /> Rejeter les proposées
                </button>
              </>
            )}
          </div>

          <form className="ligne" onSubmit={ajouterEtape} style={{ marginTop: '0.75rem' }}>
            <input value={nouvelleEtape} onChange={(e) => setNouvelleEtape(e.target.value)} placeholder={version === 'cible' ? 'Nouvelle étape de la cible…' : 'Nouvelle étape : qui fait quoi…'} aria-label="Nouvelle étape" />
            <button type="submit" className="bouton petit" disabled={!nouvelleEtape.trim()}>
              <Plus size={14} /> Ajouter
            </button>
          </form>

          {version === 'cible' && aCible && (
            <Encart ton="info">
              Cible : {resumeCible}. Par rapport au texte des étapes actuelles : {diff.ajoutees.length} ajoutée(s), {diff.retirees.length} retirée(s), {diff.conservees.length} reprise(s) telle(s) quelle(s).
            </Encart>
          )}

          {etape && (
            <div className="item selectionne" style={{ marginTop: '0.75rem' }}>
              <div className="ligne espace">
                <strong>
                  Étape {visibles.findIndex((e) => e.id === etape.id) + 1} {etape.statut === 'propose' && <Badge ton="or">Proposée par règles</Badge>}
                  {etape.version === 'cible' && etape.changement && <Badge ton={etape.changement === 'nouvelle' ? 'sauge' : etape.changement === 'modifiee' ? 'bleu' : 'contour'}>{etape.changement}</Badge>}
                </strong>
                <span className="ligne">
                  <button type="button" className="bouton petit" onClick={() => deplacer(etape.id, -1)} aria-label="Déplacer vers la gauche">
                    <ArrowLeft size={14} />
                  </button>
                  <button type="button" className="bouton petit" onClick={() => deplacer(etape.id, 1)} aria-label="Déplacer vers la droite">
                    <ArrowRight size={14} />
                  </button>
                  {etape.statut === 'propose' && (
                    <button type="button" className="bouton petit sauge" onClick={() => majEtape(etape.id, (e) => ({ ...e, statut: 'accepte' }))}>
                      <Check size={14} /> Accepter
                    </button>
                  )}
                  <button type="button" className="bouton petit danger" onClick={() => supprimerEtape(etape.id)}>
                    <Trash2 size={14} /> Supprimer
                  </button>
                </span>
              </div>
              <div className="grille deux" style={{ marginTop: '0.5rem' }}>
                <Champ label="Ce qui est fait">
                  <input value={etape.texte} onChange={(e) => majEtape(etape.id, (x) => ({ ...x, texte: e.target.value, changement: x.version === 'cible' && x.changement === 'inchangee' ? 'modifiee' : x.changement }))} />
                </Champ>
                <Champ label="Qui (rôle)">
                  <input list={`acteurs-${mission.id}`} value={etape.acteur} onChange={(e) => majEtape(etape.id, (x) => ({ ...x, acteur: e.target.value }))} placeholder="Ex. Chargée de veille" />
                  <datalist id={`acteurs-${mission.id}`}>
                    {acteursConnus.map((a) => (
                      <option key={a} value={a} />
                    ))}
                  </datalist>
                </Champ>
                <Champ label="Avec quel outil">
                  <input value={etape.outil ?? ''} onChange={(e) => majEtape(etape.id, (x) => ({ ...x, outil: e.target.value || undefined }))} placeholder="Ex. Messagerie" />
                </Champ>
                <Champ label="Durée estimée (min)">
                  <input type="number" min={0} value={etape.dureeMin ?? ''} onChange={(e) => majEtape(etape.id, (x) => ({ ...x, dureeMin: e.target.value ? Number(e.target.value) : undefined }))} />
                </Champ>
              </div>
              {etape.version === 'cible' && (
                <Champ label="Changement par rapport à aujourd’hui">
                  <select value={etape.changement ?? 'inchangee'} onChange={(e) => majEtape(etape.id, (x) => ({ ...x, changement: e.target.value as Etape['changement'] }))}>
                    <option value="inchangee">Inchangée</option>
                    <option value="modifiee">Modifiée</option>
                    <option value="nouvelle">Nouvelle</option>
                  </select>
                </Champ>
              )}
              {etape.version === 'actuel' && (
                <div className="ligne" style={{ marginTop: '0.5rem' }}>
                  <span className="petit doux">{mission.problemes.filter((p) => p.etapeIds.includes(etape.id)).length} problème(s) ici.</span>
                  <button type="button" className="bouton petit" onClick={() => enProbleme(`Difficulté à l’étape « ${etape.texte} »`, undefined, [etape.id])}>
                    <Plus size={14} /> Signaler un problème à cette étape
                  </button>
                </div>
              )}
              {etape.sources.length > 0 && <div className="petit doux" style={{ marginTop: '0.4rem' }}>Source : {etape.sources.join(', ')}</div>}
            </div>
          )}
        </Carte>
      )}

      <div className="grille atelier">
        {/* ---------- Trame ---------- */}
        <Carte titre="Trame" sousTitre="Un fil, pas un questionnaire. Clique une question pour y rattacher ce qui se dit." className="volet-trame">
          <ul className="liste">
            {trame.map((q, i) => {
              const r = mission.reponses[q.id];
              const faite = !!r?.texte.trim();
              return (
                <li key={q.id}>
                  <button type="button" className={`item${questionId === q.id ? ' selectionne' : ''}`} style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => setQuestionId(questionId === q.id ? null : q.id)} aria-pressed={questionId === q.id}>
                    <div className="ligne espace">
                      <span className="petit doux">Q{i + 1}</span>
                      {faite ? <Badge ton={r!.statut === 'valide' ? 'sauge' : r!.statut === 'observe' ? 'bleu' : 'contour'}>{LIBELLES_STATUT_REPONSE[r!.statut]}</Badge> : <Badge ton="contour">À poser</Badge>}
                    </div>
                    <div className="petit" style={{ marginTop: '0.2rem' }}>
                      {q.texte}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Carte>

        {/* ---------- Centre ---------- */}
        <div className="volet-centre">
          {question && (
            <Carte titre={`Réponse — ${question.texte}`} sousTitre={question.aide} actions={<button type="button" className="bouton petit discret" onClick={() => setQuestionId(null)} aria-label="Fermer la question"><X size={16} /></button>}>
              <Champ label="Ce qui a été dit ou observé">
                <textarea rows={4} value={reponse?.texte ?? ''} onChange={(e) => maj((m) => ({ ...m, reponses: { ...m.reponses, [question.id]: { texte: e.target.value, statut: m.reponses[question.id]?.statut ?? 'declare' } } }))} placeholder="Note librement. Tu pourras en extraire des faits et des étapes." />
              </Champ>
              <div className="ligne espace">
                <Champ label="Statut">
                  <select value={reponse?.statut ?? 'declare'} onChange={(e) => maj((m) => ({ ...m, reponses: { ...m.reponses, [question.id]: { texte: m.reponses[question.id]?.texte ?? '', statut: e.target.value as StatutReponse } } }))}>
                    {Object.entries(LIBELLES_STATUT_REPONSE).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Champ>
                <div className="ligne">
                  <button type="button" className="bouton petit" onClick={() => setQuestionId(trame[Math.max(0, trame.findIndex((q) => q.id === question.id) - 1)]?.id ?? null)}>
                    <ChevronLeft size={14} /> Précédente
                  </button>
                  <button type="button" className="bouton petit" onClick={() => setQuestionId(trame[Math.min(trame.length - 1, trame.findIndex((q) => q.id === question.id) + 1)]?.id ?? null)}>
                    Suivante <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </Carte>
          )}

          {(
            <Carte titre="Journal de l’atelier" sousTitre="Tout ce qui se dit, horodaté. Chaque entrée peut devenir un fait, une étape ou un problème.">
              <div className="journal" aria-live="polite">
                {mission.journal.length === 0 && <p className="doux petit">Rien encore. Note la première phrase du client : le copilote commence à travailler dès trois entrées.</p>}
                {mission.journal.map((e) => (
                  <article key={e.id} className={`entree ${e.auteur} ${e.type === 'citation' ? 'citation' : ''}`} aria-label={`${LIBELLES_TYPE_ENTREE[e.type]} ${heureCourte(e.horodatage)}`}>
                    <div className="heure">
                      {heureCourte(e.horodatage)}
                      <br />
                      <span className="petit">{e.auteur === 'client' ? 'Client' : e.auteur === 'copilote' ? 'Copilote' : 'Moi'}</span>
                    </div>
                    <div>
                      <div className="ligne espace">
                        <select aria-label="Type de l’entrée" value={e.type} onChange={(ev) => changerType(e.id, ev.target.value as TypeEntree)} className="petit" style={{ minHeight: 30, padding: '0.1rem 0.4rem', width: 'auto' }}>
                          {Object.entries(LIBELLES_TYPE_ENTREE).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v}
                            </option>
                          ))}
                        </select>
                        <span className="ligne mini">
                          {e.questionId && <Badge ton="contour">Q{trame.findIndex((q) => q.id === e.questionId) + 1}</Badge>}
                          {!mission.faits.some((f) => f.entreeId === e.id) && e.auteur !== 'copilote' && (
                            <button type="button" className="bouton petit" onClick={() => enFait(e)} title="Enregistrer comme fait">
                              → Fait
                            </button>
                          )}
                          {e.auteur !== 'copilote' && (
                            <button type="button" className="bouton petit" onClick={() => enEtape(e)} title="Ajouter comme étape du processus">
                              → Étape
                            </button>
                          )}
                          {!mission.problemes.some((p) => p.entreeId === e.id) && (
                            <button type="button" className="bouton petit" onClick={() => enProbleme(e.texte, e.id, etape && etape.version === 'actuel' ? [etape.id] : [])} title="Formaliser comme problème">
                              → Problème
                            </button>
                          )}
                          {question && e.auteur !== 'copilote' && (
                            <button type="button" className="bouton petit" onClick={() => enReponse(e)} title="Ajouter à la réponse de la question sélectionnée">
                              → Réponse
                            </button>
                          )}
                          <button type="button" className="bouton petit discret" aria-label="Supprimer l’entrée" onClick={() => maj((m) => ({ ...m, journal: m.journal.filter((x) => x.id !== e.id) }))}>
                            <Trash2 size={14} />
                          </button>
                        </span>
                      </div>
                      <p className="texte">{e.type === 'citation' ? `« ${e.texte} »` : e.texte}</p>
                    </div>
                  </article>
                ))}
              </div>
              <form onSubmit={noter} style={{ marginTop: '0.75rem' }}>
                <textarea
                  rows={3}
                  value={saisie.texte}
                  onChange={(e) => setSaisie({ ...saisie, texte: e.target.value })}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') noter();
                  }}
                  placeholder={question ? `Réponse ou remarque sur « ${question.texte.slice(0, 60)}… »` : 'Ce que dit le client, ce que tu observes… (Ctrl+Entrée pour noter)'}
                  aria-label="Nouvelle entrée du journal"
                />
                <div className="ligne espace" style={{ marginTop: '0.5rem' }}>
                  <div className="ligne">
                    <select aria-label="Qui parle" value={saisie.auteur} onChange={(e) => setSaisie({ ...saisie, auteur: e.target.value as Entree['auteur'] })}>
                      <option value="client">Le client dit</option>
                      <option value="consultante">J’observe / je note</option>
                    </select>
                    <select aria-label="Type" value={saisie.type} onChange={(e) => setSaisie({ ...saisie, type: e.target.value as TypeEntree })}>
                      {Object.entries(LIBELLES_TYPE_ENTREE).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="bouton primaire" disabled={!saisie.texte.trim()}>
                    <Plus size={16} /> Noter
                  </button>
                </div>
              </form>
            </Carte>
          )}

        </div>

        {/* ---------- Copilote et faits ---------- */}
        <div className="volet-copilote">
          <Carte
            titre={
              <span className="ligne">
                <Lightbulb size={18} /> Copilote
              </span>
            }
            nom="Copilote"
            sousTitre="Relit ce qui est saisi et propose. Fondé sur des règles explicites : chaque suggestion dit pourquoi."
          >
            {suggestions.length === 0 && <p className="doux petit">Rien à signaler pour l’instant. Continue à noter : signaux de problèmes connus, absolus, chiffres sans source, étapes sans acteur.</p>}
            {suggestions.map((s) => (
              <article key={s.id} className="suggestion" aria-label={s.titre}>
                <div className="ligne espace">
                  <Badge ton={TON_SUGGESTION[s.type]}>{LIBELLES_SUGGESTION[s.type]}</Badge>
                  <button type="button" className="bouton petit discret" aria-label="Ignorer la suggestion" onClick={() => setIgnorees((prev) => new Set(prev).add(s.id))}>
                    <X size={14} />
                  </button>
                </div>
                <strong style={{ display: 'block', marginTop: '0.3rem' }}>{s.titre}</strong>
                <p className="petit" style={{ margin: '0.25rem 0' }}>
                  {s.detail}
                </p>
                <div className="regle">Règle : {s.regle}</div>
                <button type="button" className="bouton petit" style={{ marginTop: '0.4rem' }} onClick={() => appliquer(s)}>
                  {s.type === 'signal' ? 'Créer le problème' : s.type === 'manque' ? 'Ouvrir la question' : s.type === 'a_verifier' && s.cible?.kind === 'entree' ? 'Mettre à vérifier' : 'Noter la question'}
                </button>
              </article>
            ))}
          </Carte>

          <Carte titre="Faits et points à vérifier" sousTitre="Déclaré, observé ou vérifié : la différence fera la force du diagnostic.">
            {mission.faits.length === 0 && <p className="doux petit">Aucun fait. Transforme une entrée du journal avec « → Fait ».</p>}
            <ul className="liste">
              {mission.faits.map((f) => (
                <li key={f.id} className="item">
                  <div className="petit">{f.texte}</div>
                  <div className="ligne" style={{ marginTop: '0.35rem' }}>
                    <select aria-label="Statut du fait" value={f.statut} onChange={(e) => maj((m) => ({ ...m, faits: m.faits.map((x) => (x.id === f.id ? { ...x, statut: e.target.value as StatutFait } : x)) }))} style={{ width: 'auto', minHeight: 32 }}>
                      {Object.entries(LIBELLES_STATUT_FAIT).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <input aria-label="Source du fait" value={f.source} onChange={(e) => maj((m) => ({ ...m, faits: m.faits.map((x) => (x.id === f.id ? { ...x, source: e.target.value } : x)) }))} placeholder="Source" style={{ minHeight: 32, flex: 1 }} />
                    <button type="button" className="bouton petit discret" aria-label="Supprimer le fait" onClick={() => maj((m) => ({ ...m, faits: m.faits.filter((x) => x.id !== f.id) }))}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Carte>

          <Encart ton="info">
            {client.fictif ? 'Données fictives. ' : ''}Observation déclarative : rien n’est capté sur les postes, les rôles remplacent les noms.
          </Encart>
        </div>
      </div>

      <div className="actions droite pas-imprime" style={{ marginTop: '1.25rem' }}>
        <Link href={`/mission/${mission.id}/analyser`} className="bouton primaire" onClick={() => maj((m) => (m.phase === 'preparer' || m.phase === 'atelier' ? { ...m, phase: 'analyser' } : m))}>
          Passer à l’analyse <ArrowRight size={18} />
        </Link>
      </div>
    </>
  );
}
