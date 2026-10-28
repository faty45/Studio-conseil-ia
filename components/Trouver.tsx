'use client';

import { useState } from 'react';
import type { Pack } from '../lib/packs/schema';
import { CATEGORIES_SOLUTION, type CategorieSolution } from '../lib/packs/schema';
import {
  LIBELLES_CATEGORIE,
  LIBELLES_DECISION,
  LIBELLES_STATUT_CAUSE,
  LIBELLES_TYPE_PREUVE,
  genId,
  type DecisionSolution,
  type Mission,
  type Probleme,
  type Solution,
  type StatutCause,
  type TypePreuve,
} from '../lib/domain/types';
import { suggererSolutions } from '../lib/domain/suggestions';

type Props = { mission: Mission; pack: Pack; maj: (fn: (m: Mission) => Mission) => void };

export function Trouver({ mission, pack, maj }: Props) {
  const [nouveauProbleme, setNouveauProbleme] = useState('');
  const [recherche, setRecherche] = useState<'repos' | 'vide' | 'fait'>('repos');
  const [manuel, setManuel] = useState({ titre: '', categorie: 'simplification' as CategorieSolution, detail: '' });

  const cartesProbleme = mission.cartes.filter((c) => c.type === 'probleme' && !mission.problemes.some((p) => p.sourceId === c.id));

  const ajouterProbleme = (texte: string, sourceId?: string) => {
    const t = texte.trim();
    if (!t) return;
    const p: Probleme = { id: genId(), texte: t, preuves: [], causes: [], sourceId };
    maj((m) => ({ ...m, problemes: [...m.problemes, p] }));
  };

  const majProbleme = (id: string, fn: (p: Probleme) => Probleme) =>
    maj((m) => ({ ...m, problemes: m.problemes.map((p) => (p.id === id ? fn(p) : p)) }));

  const chercherPistes = () => {
    const nouvelles = suggererSolutions(mission, pack);
    if (nouvelles.length) maj((m) => ({ ...m, solutions: [...m.solutions, ...nouvelles] }));
    setRecherche(nouvelles.length ? 'fait' : 'vide');
  };

  const majSolution = (id: string, patch: Partial<Solution>) =>
    maj((m) => ({ ...m, solutions: m.solutions.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));

  const ajouterManuelle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manuel.titre.trim()) return;
    const s: Solution = {
      id: genId(),
      titre: manuel.titre.trim(),
      categorie: manuel.categorie,
      detail: manuel.detail.trim(),
      hypotheses: [],
      limites: [],
      prerequis: [],
      sources: [],
      extraits: [],
      decision: 'a_decider',
      origine: 'manuel',
    };
    maj((m) => ({ ...m, solutions: [...m.solutions, s] }));
    setManuel({ titre: '', categorie: 'simplification', detail: '' });
  };

  return (
    <div className="grille-2">
      <section className="panneau" aria-labelledby="titre-problemes">
        <h2 id="titre-problemes">Problèmes, preuves et causes</h2>
        <p className="aide">Un problème se formule avec les mots du client. Une cause reste une hypothèse tant qu’une preuve ne la valide pas.</p>
        {cartesProbleme.length > 0 && (
          <div className="note">
            {cartesProbleme.length} carte(s) « Problème » du tableau libre ne sont pas encore reprises ici.{' '}
            <button type="button" className="discret" onClick={() => cartesProbleme.forEach((c) => ajouterProbleme(c.texte, c.id))}>
              Les reprendre
            </button>
          </div>
        )}
        <div className="ligne" style={{ marginBottom: '1rem' }}>
          <input
            aria-label="Nouveau problème"
            placeholder="Formuler un problème"
            value={nouveauProbleme}
            onChange={(e) => setNouveauProbleme(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                ajouterProbleme(nouveauProbleme);
                setNouveauProbleme('');
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              ajouterProbleme(nouveauProbleme);
              setNouveauProbleme('');
            }}
          >
            Ajouter
          </button>
        </div>
        {mission.problemes.length === 0 && <p className="doux">Aucun problème formalisé.</p>}
        {mission.problemes.map((p) => (
          <ProblemeItem key={p.id} probleme={p} mission={mission} majProbleme={majProbleme} supprimer={() => maj((m) => ({ ...m, problemes: m.problemes.filter((x) => x.id !== p.id) }))} />
        ))}
      </section>

      <section className="panneau" aria-labelledby="titre-pistes">
        <h2 id="titre-pistes">Pistes de solution</h2>
        <p className="aide">
          Chaque piste proposée est fondée sur une observation de l’atelier et indique ses hypothèses et ses limites. Aucun gain chiffré n’est
          avancé tant qu’il n’est pas mesuré.
        </p>
        <div className="actions">
          <button type="button" className="primaire" onClick={chercherPistes}>
            Chercher des pistes dans les observations
          </button>
        </div>
        <p className="petit doux" aria-live="polite">
          {recherche === 'vide' && 'Aucune nouvelle piste : les observations ne contiennent pas encore de mots connus du pack. Ajoute une piste à la main si besoin.'}
          {recherche === 'fait' && 'Pistes ajoutées : décide pour chacune.'}
        </p>
        {mission.solutions.map((s) => (
          <article key={s.id} className="item" aria-label={`Piste : ${s.titre}`}>
            <div className="ligne espace">
              <span>
                <span className="badge">{LIBELLES_CATEGORIE[s.categorie]}</span>
                {s.origine === 'suggestion' ? <span className="badge accent">Proposée</span> : <span className="badge">Manuelle</span>}
              </span>
              <button type="button" className="icone" aria-label={`Supprimer la piste ${s.titre}`} onClick={() => maj((m) => ({ ...m, solutions: m.solutions.filter((x) => x.id !== s.id) }))}>
                ×
              </button>
            </div>
            <h3 style={{ marginTop: '0.5rem' }}>{s.titre}</h3>
            <p>{s.detail}</p>
            {s.extraits.length > 0 && (
              <p className="petit">
                <strong>Fondé sur :</strong> {s.extraits.map((x) => `« ${x} »`).join(' ; ')}
              </p>
            )}
            {s.hypotheses.length > 0 && (
              <p className="petit">
                <strong>Hypothèses :</strong> {s.hypotheses.join(' ')}
              </p>
            )}
            {s.limites.length > 0 && (
              <p className="petit">
                <strong>Limites :</strong> {s.limites.join(' ')}
              </p>
            )}
            <div className="champ">
              <label htmlFor={`decision-${s.id}`}>Décision</label>
              <select id={`decision-${s.id}`} value={s.decision} onChange={(e) => majSolution(s.id, { decision: e.target.value as DecisionSolution })}>
                {Object.entries(LIBELLES_DECISION).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}

        <form onSubmit={ajouterManuelle} className="item" aria-labelledby="titre-manuelle">
          <h3 id="titre-manuelle">Ajouter une piste à la main</h3>
          <div className="champ">
            <label htmlFor="titre-piste">Titre</label>
            <input id="titre-piste" value={manuel.titre} onChange={(e) => setManuel({ ...manuel, titre: e.target.value })} />
          </div>
          <div className="champ">
            <label htmlFor="categorie-piste">Catégorie</label>
            <select id="categorie-piste" value={manuel.categorie} onChange={(e) => setManuel({ ...manuel, categorie: e.target.value as CategorieSolution })}>
              {CATEGORIES_SOLUTION.map((c) => (
                <option key={c} value={c}>
                  {LIBELLES_CATEGORIE[c]}
                </option>
              ))}
            </select>
          </div>
          <div className="champ">
            <label htmlFor="detail-piste">Détail</label>
            <textarea id="detail-piste" value={manuel.detail} onChange={(e) => setManuel({ ...manuel, detail: e.target.value })} />
          </div>
          <button type="submit">Ajouter la piste</button>
        </form>
      </section>
    </div>
  );
}

function ProblemeItem({
  probleme,
  mission,
  majProbleme,
  supprimer,
}: {
  probleme: Probleme;
  mission: Mission;
  majProbleme: (id: string, fn: (p: Probleme) => Probleme) => void;
  supprimer: () => void;
}) {
  const [preuve, setPreuve] = useState<{ type: TypePreuve; source: string; date: string }>({ type: 'declaration', source: '', date: '' });
  const [cause, setCause] = useState('');
  const etapes = mission.etapes.filter((e) => e.statut === 'accepte');

  return (
    <article className="item" aria-label={`Problème : ${probleme.texte}`}>
      <div className="ligne espace">
        <strong>{probleme.texte}</strong>
        <button type="button" className="icone" aria-label={`Supprimer le problème ${probleme.texte.slice(0, 30)}`} onClick={supprimer}>
          ×
        </button>
      </div>
      {etapes.length > 0 && (
        <div className="champ" style={{ marginTop: '0.5rem' }}>
          <label htmlFor={`etape-${probleme.id}`}>Étape concernée</label>
          <select id={`etape-${probleme.id}`} value={probleme.etapeId ?? ''} onChange={(e) => majProbleme(probleme.id, (p) => ({ ...p, etapeId: e.target.value || undefined }))}>
            <option value="">— non rattaché —</option>
            {etapes.map((e, i) => (
              <option key={e.id} value={e.id}>
                {i + 1}. {e.texte}
              </option>
            ))}
          </select>
        </div>
      )}

      <h4 style={{ margin: '0.5rem 0 0.25rem' }}>Preuves</h4>
      {probleme.preuves.length === 0 && <p className="petit doux">Aucune preuve : facultatif pendant la collecte, à compléter avant la validation finale.</p>}
      <ul style={{ paddingLeft: '1.2rem', margin: '0 0 0.5rem' }}>
        {probleme.preuves.map((pr) => (
          <li key={pr.id} className="petit">
            <span className="badge">{LIBELLES_TYPE_PREUVE[pr.type]}</span>
            {pr.source}
            {pr.date && ` (${pr.date})`}
          </li>
        ))}
      </ul>
      <div className="ligne">
        <select aria-label="Type de preuve" value={preuve.type} onChange={(e) => setPreuve({ ...preuve, type: e.target.value as TypePreuve })}>
          {Object.entries(LIBELLES_TYPE_PREUVE).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <input aria-label="Source de la preuve" placeholder="Source (document, personne, relevé)" value={preuve.source} onChange={(e) => setPreuve({ ...preuve, source: e.target.value })} />
        <input aria-label="Date de la preuve" placeholder="Date" value={preuve.date} onChange={(e) => setPreuve({ ...preuve, date: e.target.value })} />
        <button
          type="button"
          onClick={() => {
            if (!preuve.source.trim()) return;
            majProbleme(probleme.id, (p) => ({ ...p, preuves: [...p.preuves, { id: genId(), ...preuve, source: preuve.source.trim() }] }));
            setPreuve({ type: 'declaration', source: '', date: '' });
          }}
        >
          Ajouter la preuve
        </button>
      </div>

      <h4 style={{ margin: '0.75rem 0 0.25rem' }}>Causes</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 0.5rem' }}>
        {probleme.causes.map((c) => (
          <li key={c.id} className="ligne" style={{ marginBottom: '0.4rem' }}>
            <span style={{ flex: '1 1 160px' }}>{c.texte}</span>
            <select
              aria-label={`Statut de la cause ${c.texte.slice(0, 30)}`}
              value={c.statut}
              onChange={(e) => majProbleme(probleme.id, (p) => ({ ...p, causes: p.causes.map((x) => (x.id === c.id ? { ...x, statut: e.target.value as StatutCause } : x)) }))}
            >
              {Object.entries(LIBELLES_STATUT_CAUSE).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      <div className="ligne">
        <input aria-label="Nouvelle cause" placeholder="Cause possible (enregistrée comme hypothèse)" value={cause} onChange={(e) => setCause(e.target.value)} />
        <button
          type="button"
          onClick={() => {
            if (!cause.trim()) return;
            majProbleme(probleme.id, (p) => ({ ...p, causes: [...p.causes, { id: genId(), texte: cause.trim(), statut: 'hypothese' }] }));
            setCause('');
          }}
        >
          Ajouter la cause
        </button>
      </div>
    </article>
  );
}
