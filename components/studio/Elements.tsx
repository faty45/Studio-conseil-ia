'use client';

import type { ReactNode } from 'react';
import { PHASES, type Niveau, type PhaseMission } from '../../lib/domain/types';

export function Tag({ children, ton = '', point }: { children: ReactNode; ton?: '' | 'vert' | 'rouge' | 'ambre' | 'bleu' | 'violet' | 'cuivre' | 'accent' | 'contour'; point?: boolean }) {
  return (
    <span className={`hx-tag ${ton}`}>
      {point && <span className="hx-point" />}
      {children}
    </span>
  );
}

export function Regle({ children = 'Proposé par règles' }: { children?: ReactNode }) {
  return <span className="hx-regle">{children}</span>;
}

export function Stepper({ avancement, courante }: { avancement: Record<PhaseMission, number>; courante: PhaseMission }) {
  return (
    <span className="hx-stepper" role="img" aria-label={PHASES.map((p) => `${p.label} ${avancement[p.id]} %`).join(', ')}>
      {PHASES.map((p) => (
        <i key={p.id} className={p.id === courante ? 'courante' : ''}>
          <span style={{ width: `${avancement[p.id]}%` }} />
        </i>
      ))}
    </span>
  );
}

/** Niveau 1–3 : lecture seule ou cliquable (propriété modifiable en ligne). */
export function Niveaux({ valeur, ton = '', label, onChange }: { valeur: Niveau; ton?: '' | 'rouge' | 'bleu' | 'vert'; label: string; onChange?: (n: Niveau) => void }) {
  return (
    <span className={`hx-niveau ${ton}`} role={onChange ? 'group' : 'img'} aria-label={`${label} ${valeur} sur 3`}>
      {([1, 2, 3] as Niveau[]).map((n) =>
        onChange ? (
          <button key={n} type="button" className={n <= valeur ? 'on' : ''} aria-label={`${label} : ${n} sur 3`} aria-pressed={valeur === n} onClick={() => onChange(n)} />
        ) : (
          <i key={n} className={n <= valeur ? 'on' : ''} />
        ),
      )}
    </span>
  );
}

export const TON_PRIORITE = { quick_win: 'vert', a_planifier: 'bleu', a_construire: 'cuivre', specialiste: 'ambre' } as const;
export const TON_DECISION = { retenue: 'vert', ecartee: 'rouge', plus_tard: 'ambre', a_decider: 'contour' } as const;

export function nomCourt(nom: string) {
  return nom.replace(' (exemple fictif)', '');
}

export function dateCourte(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function heureCourte(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
}
