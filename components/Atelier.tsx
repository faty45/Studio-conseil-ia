'use client';

import { useMemo, useState } from 'react';
import type { Pack } from '../lib/packs/schema';
import { questionsPour } from '../lib/packs';
import {
  LIBELLES_STATUT_REPONSE,
  LIBELLES_TYPE_CARTE,
  genId,
  type Carte,
  type Etape,
  type Mission,
  type StatutReponse,
  type TypeCarte,
} from '../lib/domain/types';
import { textesDeMission } from '../lib/domain/suggestions';
import { obtenirFournisseur } from '../lib/ai/gateway';

type Props = { mission: Mission; pack: Pack; maj: (fn: (m: Mission) => Mission) => void };

export function Atelier({ mission, pack, maj }: Props) {
  const questions = useMemo(() => questionsPour(pack), [pack]);
  const [courante, setCourante] = useState(0);
  const [typeCarte, setTypeCarte] = useState<TypeCarte>('observation');
  const [texteCarte, setTexteCarte] = useState('');
  const [nouvelleEtape, setNouvelleEtape] = useState('');
  const [extraction, setExtraction] = useState<'repos' | 'en_cours' | 'vide' | 'fait'>('repos');

  const q = questions[courante];
  const reponse = mission.reponses[q.id] ?? { texte: '', statut: 'a_verifier' as StatutReponse };
  const nbRepondues = questions.filter((x) => mission.reponses[x.id]?.texte.trim()).length;

  const setReponse = (patch: Partial<{ texte: string; statut: StatutReponse }>) =>
    maj((m) => ({ ...m, reponses: { ...m.reponses, [q.id]: { ...(m.reponses[q.id] ?? { texte: '', statut: 'a_verifier' }), ...patch } } }));

  const ajouterCarte = () => {
    const texte = texteCarte.trim();
    if (!texte) return;
    const carte: Carte = { id: genId(), type: typeCarte, texte, creeLe: new Date().toISOString() };
    maj((m) => ({ ...m, cartes: [...m.cartes, carte] }));
    setTexteCarte('');
  };

  const majEtape = (id: string, patch: Partial<Etape>) =>
    maj((m) => ({ ...m, etapes: m.etapes.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));

  const deplacer = (index: number, sens: -1 | 1) =>
    maj((m) => {
      const a = [...m.etapes];
      const j = index + sens;
      if (j < 0 || j >= a.length) return m;
      [a[index], a[j]] = [a[j], a[index]];
      return { ...m, etapes: a };
    });

  const ajouterEtape = () => {
    const texte = nouvelleEtape.trim();
    if (!texte) return;
    const e: Etape = { id: genId(), texte, origine: 'manuel', statut: 'accepte', sources: [] };
    maj((m) => ({ ...m, etapes: [...m.etapes, e] }));
    setNouvelleEtape('');
  };

  const proposerEtapes = async () => {
    setExtraction('en_cours');
    const sources = textesDeMission(mission);
    const proposees = await obtenirFournisseur('regles').extraireEtapes(sources, pack);
    const dejaLa = new Set(mission.etapes.map((e) => e.texte.toLowerCase()));
    const nouvelles = proposees.filter((e) => !dejaLa.has(e.texte.toLowerCase()));
    if (nouvelles.length) maj((m) => ({ ...m, etapes: [...m.etapes, ...nouvelles] }));
    setExtraction(nouvelles.length ? 'fait' : 'vide');
  };

  return (
    <div className="grille-2">
      <div>
        <section className="panneau" aria-labelledby="titre-questions">
          <div className="ligne espace">
            <h2 id="titre-questions">Questions guidées</h2>
            <span className="badge" aria-live="polite">
              {nbRepondues} / {questions.length} répondues
            </span>
          </div>
          <div className="puces" role="tablist" aria-label="Choisir une question">
            {questions.map((x, i) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                className={`puce${mission.reponses[x.id]?.texte.trim() ? ' repondue' : ''}`}
                aria-current={i === courante ? 'true' : undefined}
                aria-selected={i === courante}
                aria-label={`Question ${i + 1}${mission.reponses[x.id]?.texte.trim() ? ', répondue' : ''}`}
                onClick={() => setCourante(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="champ">
            <label htmlFor="reponse">
              {courante + 1}. {q.texte}
            </label>
            {q.aide && <p className="aide">{q.aide}</p>}
            <textarea
              id="reponse"
              value={reponse.texte}
              placeholder="Écouter, noter avec les mots du client…"
              onChange={(e) => setReponse({ texte: e.target.value })}
            />
          </div>
          <div className="champ">
            <label htmlFor="statut-reponse">D’où vient cette information ?</label>
            <select id="statut-reponse" value={reponse.statut} onChange={(e) => setReponse({ statut: e.target.value as StatutReponse })}>
              {Object.entries(LIBELLES_STATUT_REPONSE).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="actions">
            <button type="button" disabled={courante === 0} onClick={() => setCourante((n) => n - 1)}>
              Précédente
            </button>
            <button type="button" disabled={courante === questions.length - 1} onClick={() => setCourante((n) => n + 1)}>
              Suivante
            </button>
          </div>
        </section>

        <section className="panneau" aria-labelledby="titre-tableau">
          <h2 id="titre-tableau">Tableau libre</h2>
          <p className="aide">Une carte par remarque. « Ce que le client a dit » se note mot pour mot.</p>
          <div className="champ">
            <label htmlFor="type-carte">Type de carte</label>
            <select id="type-carte" value={typeCarte} onChange={(e) => setTypeCarte(e.target.value as TypeCarte)}>
              {Object.entries(LIBELLES_TYPE_CARTE).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="champ">
            <label htmlFor="texte-carte">Nouvelle carte</label>
            <textarea id="texte-carte" value={texteCarte} onChange={(e) => setTexteCarte(e.target.value)} placeholder="Une remarque, un irritant, une idée…" />
          </div>
          <button type="button" onClick={ajouterCarte}>
            Ajouter la carte
          </button>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }} aria-label="Cartes du tableau libre">
            {mission.cartes.map((c) => (
              <li key={c.id} className="item ligne espace">
                <div style={{ flex: '1 1 200px' }}>
                  <span className="badge">{LIBELLES_TYPE_CARTE[c.type]}</span>
                  <span>{c.texte}</span>
                </div>
                <button
                  type="button"
                  className="icone"
                  aria-label={`Supprimer la carte : ${c.texte.slice(0, 30)}`}
                  onClick={() => maj((m) => ({ ...m, cartes: m.cartes.filter((x) => x.id !== c.id) }))}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="panneau" aria-labelledby="titre-carte">
        <h2 id="titre-carte">Carte du processus</h2>
        <p className="aide">
          Les étapes proposées viennent des réponses et des cartes, par découpage simple, sans IA externe. Chaque proposition est à accepter,
          corriger ou rejeter.
        </p>
        <div className="actions">
          <button type="button" className="primaire" onClick={proposerEtapes} disabled={extraction === 'en_cours'}>
            Proposer des étapes à partir des notes
          </button>
        </div>
        <p className="petit doux" aria-live="polite">
          {extraction === 'vide' && 'Aucune nouvelle étape trouvée : ajoute des réponses ou des cartes, ou saisis les étapes à la main.'}
          {extraction === 'fait' && 'Étapes proposées : accepte, corrige ou rejette chacune.'}
        </p>
        <div className="ligne" style={{ marginBottom: '1rem' }}>
          <input
            aria-label="Nouvelle étape manuelle"
            value={nouvelleEtape}
            placeholder="Ajouter une étape à la main"
            onChange={(e) => setNouvelleEtape(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                ajouterEtape();
              }
            }}
          />
          <button type="button" onClick={ajouterEtape}>
            Ajouter
          </button>
        </div>
        <ol style={{ listStyle: 'none', padding: 0 }} aria-label="Étapes du processus">
          {mission.etapes.map((e, i) => (
            <li key={e.id} className={`item${e.statut === 'propose' ? ' propose' : ''}`} data-statut={e.statut}>
              <div className="ligne espace">
                <span>
                  <span className="badge">{i + 1}</span>
                  {e.statut === 'propose' && <span className="badge accent">Proposée</span>}
                  {e.statut === 'rejete' && <span className="badge danger">Rejetée</span>}
                  {e.statut === 'accepte' && e.origine === 'extraction' && <span className="badge ok">Acceptée</span>}
                </span>
                <span className="ligne">
                  <button type="button" className="icone" aria-label={`Monter l’étape ${i + 1}`} disabled={i === 0} onClick={() => deplacer(i, -1)}>
                    ↑
                  </button>
                  <button
                    type="button"
                    className="icone"
                    aria-label={`Descendre l’étape ${i + 1}`}
                    disabled={i === mission.etapes.length - 1}
                    onClick={() => deplacer(i, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="icone"
                    aria-label={`Supprimer l’étape ${i + 1}`}
                    onClick={() => maj((m) => ({ ...m, etapes: m.etapes.filter((x) => x.id !== e.id) }))}
                  >
                    ×
                  </button>
                </span>
              </div>
              <div className="champ" style={{ marginTop: '0.5rem' }}>
                <label htmlFor={`etape-${e.id}`} className="visuellement-cache">
                  Texte de l’étape {i + 1}
                </label>
                <input id={`etape-${e.id}`} value={e.texte} onChange={(ev) => majEtape(e.id, { texte: ev.target.value })} />
              </div>
              <div className="ligne">
                <input aria-label={`Qui fait l’étape ${i + 1}`} placeholder="Qui (rôle)" value={e.acteur ?? ''} onChange={(ev) => majEtape(e.id, { acteur: ev.target.value })} />
                <input aria-label={`Outil de l’étape ${i + 1}`} placeholder="Avec quel outil" value={e.outil ?? ''} onChange={(ev) => majEtape(e.id, { outil: ev.target.value })} />
              </div>
              {e.statut === 'propose' && (
                <div className="actions">
                  <button type="button" className="primaire" onClick={() => majEtape(e.id, { statut: 'accepte' })}>
                    Accepter
                  </button>
                  <button type="button" onClick={() => majEtape(e.id, { statut: 'rejete' })}>
                    Rejeter
                  </button>
                </div>
              )}
            </li>
          ))}
        </ol>
        {mission.etapes.some((e) => e.statut === 'rejete') && (
          <button type="button" className="discret" onClick={() => maj((m) => ({ ...m, etapes: m.etapes.filter((e) => e.statut !== 'rejete') }))}>
            Retirer les étapes rejetées
          </button>
        )}
        <p className="petit doux">
          {mission.etapes.filter((e) => e.statut === 'accepte').length} étape(s) acceptée(s) · à valider avec l’équipe.
        </p>
      </section>
    </div>
  );
}
