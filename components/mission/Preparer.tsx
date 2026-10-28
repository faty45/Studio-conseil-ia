'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Plus, Sparkles, Trash2 } from 'lucide-react';
import type { PropsPhase } from './MissionShell';
import { Badge, Carte, Champ, Encart } from '../ui';
import { LIBELLES_CATEGORIE_OUTIL, LIBELLES_STATUT_HYPOTHESE, LIBELLES_TAILLE, genId, type CategorieOutil, type DocumentClient, type StatutHypothese, type TailleClient } from '../../lib/domain/types';
import { coreQuestions, questionsPour } from '../../lib/packs';
import { bibliotheque, patronsPourProbleme } from '../../lib/bibliotheque';

const TYPES_DOC: Record<DocumentClient['type'], string> = { procedure: 'Procédure', export: 'Export de données', photo: 'Photo du poste', contrat: 'Contrat', autre: 'Autre' };

export function Preparer({ mission, client, pack, maj, majClient }: PropsPhase) {
  const questions = useMemo(() => questionsPour(pack), [pack]);
  const [nouvelHypothese, setNouvelHypothese] = useState('');
  const [nouvelEnjeu, setNouvelEnjeu] = useState('');
  const [partie, setPartie] = useState({ role: '', attentes: '', influence: 'moyenne' as 'faible' | 'moyenne' | 'forte' });
  const [outil, setOutil] = useState({ nom: '', categorie: 'bureautique' as CategorieOutil, usage: '' });
  const [doc, setDoc] = useState({ titre: '', type: 'procedure' as DocumentClient['type'], note: '' });

  const hypothesesRestantes = pack.hypothesesTypiques.filter((t) => !mission.hypotheses.some((h) => h.texte === t));
  const rolesRestants = pack.rolesTypiques.filter((r) => !client.partiesPrenantes.some((p) => p.role === r));

  /* Préparation intelligente (règles) : problèmes universels fréquents dans ce métier, patrons appuyés sur les outils déjà présents. */
  const universelsMetier = useMemo(() => bibliotheque.problemesUniversels.filter((u) => u.processusIds.some((p) => pack.processusIds.includes(p))).slice(0, 6), [pack]);
  const categoriesPresentes = new Set(client.outils.map((o) => o.categorie));
  const patronsSurOutils = useMemo(
    () => bibliotheque.patrons.filter((p) => p.outilsRequis.length > 0 && p.outilsRequis.some((o) => categoriesPresentes.has(o as CategorieOutil)) && p.processusIds.some((x) => pack.processusIds.includes(x))).slice(0, 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client.outils, pack],
  );

  const toggleQuestion = (id: string) => maj((m) => ({ ...m, trame: m.trame.includes(id) ? m.trame.filter((q) => q !== id) : [...m.trame, id] }));

  return (
    <>
      <div className="grille deux">
        <Carte titre="Fiche mission" sousTitre="Ce que le client attend, en une phrase. Elle ouvre le diagnostic.">
          <Champ label="Objectif de la mission">
            <textarea rows={3} value={mission.objectif} onChange={(e) => maj((m) => ({ ...m, objectif: e.target.value }))} placeholder="Ex. Comprendre où part le temps de la cellule veille et proposer deux ou trois améliorations réalisables ce trimestre." />
          </Champ>
          <div className="grille deux">
            <Champ label="Date de l’atelier">
              <input type="date" value={mission.dateAtelier ?? ''} onChange={(e) => maj((m) => ({ ...m, dateAtelier: e.target.value || undefined }))} />
            </Champ>
            <Champ label="Trame métier" aide={pack.description}>
              <input value={`${pack.label} · v${pack.version}`} readOnly />
            </Champ>
          </div>
          <label className="ligne" style={{ alignItems: 'flex-start', gap: '0.6rem', marginTop: '0.5rem' }}>
            <input type="checkbox" checked={mission.consentementObservation} onChange={(e) => maj((m) => ({ ...m, consentementObservation: e.target.checked }))} style={{ marginTop: '0.3rem' }} />
            <span className="petit">
              <strong>Information et consentement.</strong> Les participants sont informés que l’observation est déclarative, consentie, sans capture d’écran ni enregistrement, et que les rôles remplacent les noms dans tous les
              documents produits.
            </span>
          </label>
        </Carte>

        <Carte titre="Contexte client" sousTitre="Ce qu’on sait avant d’arriver. Tout reste à vérifier en atelier.">
          <div className="grille deux">
            <Champ label="Secteur">
              <input value={client.secteur} onChange={(e) => majClient((c) => ({ ...c, secteur: e.target.value }))} />
            </Champ>
            <Champ label="Taille">
              <select value={client.taille} onChange={(e) => majClient((c) => ({ ...c, taille: e.target.value as TailleClient }))}>
                {Object.entries(LIBELLES_TAILLE).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Champ>
          </div>
          <Champ label="Contexte">
            <textarea rows={4} value={client.contexte} onChange={(e) => majClient((c) => ({ ...c, contexte: e.target.value }))} placeholder="Organisation, historique, ce qui a déjà été tenté…" />
          </Champ>
          <div className="champ">
            <span>Enjeux exprimés</span>
            <ul className="liste">
              {client.enjeux.map((e, i) => (
                <li key={i} className="item ligne espace">
                  <span>{e}</span>
                  <button type="button" className="bouton petit discret" aria-label={`Retirer l’enjeu ${e}`} onClick={() => majClient((c) => ({ ...c, enjeux: c.enjeux.filter((_, j) => j !== i) }))}>
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
            <form
              className="ligne"
              onSubmit={(e) => {
                e.preventDefault();
                if (!nouvelEnjeu.trim()) return;
                majClient((c) => ({ ...c, enjeux: [...c.enjeux, nouvelEnjeu.trim()] }));
                setNouvelEnjeu('');
              }}
            >
              <input value={nouvelEnjeu} onChange={(e) => setNouvelEnjeu(e.target.value)} placeholder="Ex. Diffuser plus vite" aria-label="Nouvel enjeu" />
              <button type="submit" className="bouton petit">
                <Plus size={14} /> Ajouter
              </button>
            </form>
          </div>
        </Carte>

        <Carte titre="Parties prenantes" sousTitre="Des rôles, pas des noms. Qui décide, qui fait, qui subit.">
          <ul className="liste">
            {client.partiesPrenantes.map((p) => (
              <li key={p.id} className="item">
                <div className="ligne espace">
                  <strong>{p.role}</strong>
                  <span className="ligne">
                    <Badge ton={p.influence === 'forte' ? 'accent' : p.influence === 'moyenne' ? 'bleu' : 'contour'}>Influence {p.influence}</Badge>
                    <button type="button" className="bouton petit discret" aria-label={`Retirer ${p.role}`} onClick={() => majClient((c) => ({ ...c, partiesPrenantes: c.partiesPrenantes.filter((x) => x.id !== p.id) }))}>
                      <Trash2 size={14} />
                    </button>
                  </span>
                </div>
                <div className="petit doux">{p.attentes || 'Attentes à préciser'}</div>
              </li>
            ))}
          </ul>
          {rolesRestants.length > 0 && (
            <div className="ligne petit" style={{ margin: '0.5rem 0' }}>
              <span className="doux">Rôles habituels :</span>
              {rolesRestants.map((r) => (
                <button key={r} type="button" className="bouton petit" onClick={() => majClient((c) => ({ ...c, partiesPrenantes: [...c.partiesPrenantes, { id: genId(), role: r, attentes: '', influence: 'moyenne' }] }))}>
                  <Plus size={14} /> {r}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!partie.role.trim()) return;
              majClient((c) => ({ ...c, partiesPrenantes: [...c.partiesPrenantes, { id: genId(), ...partie, role: partie.role.trim() }] }));
              setPartie({ role: '', attentes: '', influence: 'moyenne' });
            }}
          >
            <div className="grille trois">
              <Champ label="Rôle">
                <input value={partie.role} onChange={(e) => setPartie({ ...partie, role: e.target.value })} placeholder="Ex. Responsable du service" />
              </Champ>
              <Champ label="Attentes">
                <input value={partie.attentes} onChange={(e) => setPartie({ ...partie, attentes: e.target.value })} placeholder="Ce que cette personne attend" />
              </Champ>
              <Champ label="Influence">
                <select value={partie.influence} onChange={(e) => setPartie({ ...partie, influence: e.target.value as typeof partie.influence })}>
                  <option value="faible">Faible</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="forte">Forte</option>
                </select>
              </Champ>
            </div>
            <button type="submit" className="bouton petit">
              <Plus size={14} /> Ajouter la partie prenante
            </button>
          </form>
        </Carte>

        <Carte titre="Outils déjà en place" sousTitre="Les solutions compatibles avec l’existant seront favorisées. Coche ce qui est sous-exploité.">
          <ul className="liste">
            {client.outils.map((o) => (
              <li key={o.id} className="item">
                <div className="ligne espace">
                  <span className="ligne">
                    <strong>{o.nom}</strong>
                    <Badge ton="contour">{LIBELLES_CATEGORIE_OUTIL[o.categorie]}</Badge>
                    {o.sousExploite && <Badge ton="or">Sous-exploité</Badge>}
                  </span>
                  <span className="ligne">
                    <label className="petit ligne" style={{ gap: '0.3rem' }}>
                      <input type="checkbox" checked={!!o.sousExploite} onChange={(e) => majClient((c) => ({ ...c, outils: c.outils.map((x) => (x.id === o.id ? { ...x, sousExploite: e.target.checked } : x)) }))} /> sous-exploité
                    </label>
                    <button type="button" className="bouton petit discret" aria-label={`Retirer l’outil ${o.nom}`} onClick={() => majClient((c) => ({ ...c, outils: c.outils.filter((x) => x.id !== o.id) }))}>
                      <Trash2 size={14} />
                    </button>
                  </span>
                </div>
                <div className="petit doux">{o.usage}</div>
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!outil.nom.trim()) return;
              majClient((c) => ({ ...c, outils: [...c.outils, { id: genId(), ...outil, nom: outil.nom.trim() }] }));
              setOutil({ nom: '', categorie: 'bureautique', usage: '' });
            }}
          >
            <div className="grille trois">
              <Champ label="Outil">
                <input value={outil.nom} onChange={(e) => setOutil({ ...outil, nom: e.target.value })} placeholder="Ex. Tableur partagé" />
              </Champ>
              <Champ label="Catégorie">
                <select value={outil.categorie} onChange={(e) => setOutil({ ...outil, categorie: e.target.value as CategorieOutil })}>
                  {Object.entries(LIBELLES_CATEGORIE_OUTIL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Champ>
              <Champ label="Usage actuel">
                <input value={outil.usage} onChange={(e) => setOutil({ ...outil, usage: e.target.value })} placeholder="À quoi il sert aujourd’hui" />
              </Champ>
            </div>
            <button type="submit" className="bouton petit">
              <Plus size={14} /> Ajouter l’outil
            </button>
          </form>
        </Carte>

        <Carte titre="Hypothèses de départ" sousTitre="Ce qu’on croit avant d’avoir vu. L’atelier les confirme ou les infirme.">
          <ul className="liste">
            {mission.hypotheses.map((h) => (
              <li key={h.id} className="item ligne espace">
                <span>
                  {h.texte} {h.origine === 'bibliotheque' && <Badge ton="contour">Trame</Badge>}
                </span>
                <span className="ligne">
                  <select aria-label={`Statut de l’hypothèse ${h.texte}`} value={h.statut} onChange={(e) => maj((m) => ({ ...m, hypotheses: m.hypotheses.map((x) => (x.id === h.id ? { ...x, statut: e.target.value as StatutHypothese } : x)) }))}>
                    {Object.entries(LIBELLES_STATUT_HYPOTHESE).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="bouton petit discret" aria-label={`Retirer l’hypothèse ${h.texte}`} onClick={() => maj((m) => ({ ...m, hypotheses: m.hypotheses.filter((x) => x.id !== h.id) }))}>
                    <Trash2 size={14} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
          {hypothesesRestantes.length > 0 && (
            <div className="petit" style={{ margin: '0.5rem 0' }}>
              <span className="doux">Hypothèses fréquentes pour ce métier :</span>
              <ul className="liste">
                {hypothesesRestantes.map((t) => (
                  <li key={t} className="ligne espace">
                    <span className="petit">{t}</span>
                    <button type="button" className="bouton petit" onClick={() => maj((m) => ({ ...m, hypotheses: [...m.hypotheses, { id: genId(), texte: t, statut: 'a_tester', origine: 'bibliotheque' }] }))}>
                      <Plus size={14} /> Reprendre
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <form
            className="ligne"
            onSubmit={(e) => {
              e.preventDefault();
              if (!nouvelHypothese.trim()) return;
              maj((m) => ({ ...m, hypotheses: [...m.hypotheses, { id: genId(), texte: nouvelHypothese.trim(), statut: 'a_tester', origine: 'consultante' }] }));
              setNouvelHypothese('');
            }}
          >
            <input value={nouvelHypothese} onChange={(e) => setNouvelHypothese(e.target.value)} placeholder="Ma propre hypothèse…" aria-label="Nouvelle hypothèse" />
            <button type="submit" className="bouton petit">
              <Plus size={14} /> Ajouter
            </button>
          </form>
        </Carte>

        <Carte
          titre="Trame de l’atelier"
          sousTitre={`${mission.trame.length} question(s) retenue(s) sur ${questions.length}. Les questions cœur sont communes à tous les métiers.`}
          actions={
            <button type="button" className="bouton petit" onClick={() => maj((m) => ({ ...m, trame: m.trame.length === questions.length ? [] : questions.map((q) => q.id) }))}>
              {mission.trame.length === questions.length ? 'Tout décocher' : 'Tout cocher'}
            </button>
          }
        >
          <ul className="liste">
            {questions.map((q, i) => (
              <li key={q.id} className="item">
                <label className="ligne" style={{ alignItems: 'flex-start', gap: '0.6rem' }}>
                  <input type="checkbox" checked={mission.trame.includes(q.id)} onChange={() => toggleQuestion(q.id)} style={{ marginTop: '0.25rem' }} />
                  <span>
                    <span className="petit doux">
                      {i + 1}. {coreQuestions.questions.some((c) => c.id === q.id) ? 'Cœur' : pack.label}
                    </span>
                    <br />
                    {q.texte}
                    {q.aide && <div className="petit doux">{q.aide}</div>}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </Carte>

        <Carte titre="Documents à demander" sousTitre="Ce qui rendra les constats défendables : procédures, exports, photos de poste.">
          <ul className="liste">
            {client.documents.map((d) => (
              <li key={d.id} className="item ligne espace">
                <span>
                  <Badge ton="contour">{TYPES_DOC[d.type]}</Badge> <strong>{d.titre}</strong> <span className="petit doux">{d.note}</span>
                </span>
                <button type="button" className="bouton petit discret" aria-label={`Retirer le document ${d.titre}`} onClick={() => majClient((c) => ({ ...c, documents: c.documents.filter((x) => x.id !== d.id) }))}>
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!doc.titre.trim()) return;
              majClient((c) => ({ ...c, documents: [...c.documents, { id: genId(), ...doc, titre: doc.titre.trim() }] }));
              setDoc({ titre: '', type: 'procedure', note: '' });
            }}
          >
            <div className="grille trois">
              <Champ label="Document">
                <input value={doc.titre} onChange={(e) => setDoc({ ...doc, titre: e.target.value })} placeholder="Ex. Export de caisse, 4 semaines" />
              </Champ>
              <Champ label="Type">
                <select value={doc.type} onChange={(e) => setDoc({ ...doc, type: e.target.value as DocumentClient['type'] })}>
                  {Object.entries(TYPES_DOC).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Champ>
              <Champ label="Pourquoi">
                <input value={doc.note} onChange={(e) => setDoc({ ...doc, note: e.target.value })} placeholder="Ce qu’il permettra de vérifier" />
              </Champ>
            </div>
            <button type="submit" className="bouton petit">
              <Plus size={14} /> Ajouter le document
            </button>
          </form>
        </Carte>

        <Carte
          titre={
            <span className="ligne">
              <Sparkles size={18} /> Préparation intelligente
            </span>
          }
          nom="Préparation intelligente"
          sousTitre="Produite par règles à partir de la bibliothèque et des outils déclarés. Ce sont des pistes à vérifier, pas des conclusions."
        >
          <h3 style={{ marginTop: 0 }}>Problèmes fréquents dans ce métier</h3>
          <ul className="liste">
            {universelsMetier.map((u) => (
              <li key={u.id} className="item">
                <strong>{u.label}</strong> <span className="petit doux">— {u.coutTypique}</span>
                <div className="petit">
                  <em>À poser :</em> {u.questionDeConfirmation}
                </div>
                <div className="petit doux">{patronsPourProbleme(u.id).length} patron(s) de solution connus.</div>
              </li>
            ))}
          </ul>
          <h3>Patrons compatibles avec les outils déjà présents</h3>
          {client.outils.length === 0 && <p className="petit doux">Déclare les outils du client pour voir les patrons réalisables sans rien acheter.</p>}
          {client.outils.length > 0 && patronsSurOutils.length === 0 && <p className="petit doux">Aucun patron de la bibliothèque ne s’appuie sur ces catégories d’outils pour ce métier.</p>}
          <ul className="liste">
            {patronsSurOutils.map((p) => (
              <li key={p.id} className="item">
                <strong>{p.titre}</strong>
                <div className="petit">{p.resume}</div>
                <div className="petit doux">S’appuie sur : {p.outilsRequis.map((o) => LIBELLES_CATEGORIE_OUTIL[o as CategorieOutil] ?? o).join(', ')}.</div>
              </li>
            ))}
          </ul>
          <Encart ton="info">Règle appliquée : familles de processus du métier croisées avec les problèmes universels, puis catégories d’outils du client croisées avec les prérequis des patrons. Aucune IA externe.</Encart>
        </Carte>
      </div>

      <div className="actions droite pas-imprime" style={{ marginTop: '1.25rem' }}>
        <Link href={`/mission/${mission.id}/atelier`} className="bouton primaire" onClick={() => maj((m) => (m.phase === 'preparer' ? { ...m, phase: 'atelier' } : m))}>
          Passer à l’atelier <ArrowRight size={18} />
        </Link>
      </div>
    </>
  );
}
