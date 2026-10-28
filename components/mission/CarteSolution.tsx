'use client';

import type { ReactNode } from 'react';
import { Badge, tonDecision, tonPriorite } from '../ui';
import { LIBELLES_CATEGORIE, LIBELLES_DECISION, LIBELLES_EFFORT, LIBELLES_PRIORITE, type Probleme, type Solution } from '../../lib/domain/types';

/** Fiche de solution : explication de la correspondance, faisabilité, alternative sans IA. Réutilisée en analyse et en décision. */
export function CarteSolution({ s, problemes, actions, enfants, selectionnee, onSelect }: { s: Solution; problemes: Probleme[]; actions?: ReactNode; enfants?: ReactNode; selectionnee?: boolean; onSelect?: () => void }) {
  const lies = problemes.filter((p) => s.problemeIds.includes(p.id));
  return (
    <article className={`item${selectionnee ? ' selectionne' : ''}`} aria-label={s.titre} onClick={onSelect} style={onSelect ? { cursor: 'pointer' } : undefined}>
      <div className="ligne espace">
        <span className="ligne">
          <Badge ton={tonPriorite(s.priorite)}>{LIBELLES_PRIORITE[s.priorite]}</Badge>
          <Badge ton="contour">{LIBELLES_CATEGORIE[s.categorie]}</Badge>
          {s.decision !== 'a_decider' && <Badge ton={tonDecision(s.decision)}>{LIBELLES_DECISION[s.decision]}</Badge>}
          {s.necessiteIA && <Badge ton="or">Dépend d’une IA</Badge>}
          {s.faisabilite.outilDejaPresent && s.categorie !== 'outil_existant' && <Badge ton="sauge">Outil déjà présent</Badge>}
          {s.origine === 'manuel' && <Badge ton="contour">Ajoutée à la main</Badge>}
        </span>
        {actions && <span className="ligne">{actions}</span>}
      </div>
      <h3 style={{ margin: '0.4rem 0 0.2rem' }}>{s.titre}</h3>
      <p className="petit" style={{ margin: 0 }}>
        {s.detail}
      </p>
      {lies.length > 0 && (
        <p className="petit doux" style={{ margin: '0.35rem 0 0' }}>
          Répond à : {lies.map((p) => `« ${p.texte} »`).join(' ; ')}
        </p>
      )}
      <div className="ligne mini doux" style={{ marginTop: '0.4rem' }}>
        <span>Impact {s.impact}/3</span>
        <span>· Effort {LIBELLES_EFFORT[s.faisabilite.effort].toLowerCase()}</span>
        <span>· Coût mensuel {s.faisabilite.coutMensuel}</span>
        {s.outilsCompatibles.length > 0 && <span>· Avec : {s.outilsCompatibles.join(', ')}</span>}
      </div>
      <details style={{ marginTop: '0.4rem' }} onClick={(e) => e.stopPropagation()}>
        <summary className="petit" style={{ cursor: 'pointer' }}>
          Pourquoi cette proposition, et ses limites
        </summary>
        <ul className="petit" style={{ margin: '0.3rem 0 0 1rem', padding: 0 }}>
          {s.explication.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
        {s.alternativeSansIA && (
          <p className="petit" style={{ margin: '0.4rem 0 0' }}>
            <strong>Alternative sans IA :</strong> {s.alternativeSansIA}
          </p>
        )}
        {s.faisabilite.prerequis.length > 0 && (
          <p className="petit" style={{ margin: '0.3rem 0 0' }}>
            <strong>Prérequis :</strong> {s.faisabilite.prerequis.join(' ')}
          </p>
        )}
        {s.faisabilite.risques.length > 0 && (
          <p className="petit" style={{ margin: '0.3rem 0 0' }}>
            <strong>Risques :</strong> {s.faisabilite.risques.join(' ')}
          </p>
        )}
      </details>
      {enfants}
    </article>
  );
}
