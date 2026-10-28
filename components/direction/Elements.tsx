import type { ReactNode } from 'react';
import { PHASES, type Mesure, type Niveau, type PhaseMission } from '../../lib/domain/types';

export function Stepper({ avancement, courante, compact }: { avancement: Record<PhaseMission, number>; courante: PhaseMission; compact?: boolean }) {
  return (
    <div className={`dv-stepper${compact ? ' compact' : ''}`} role="list" aria-label="Avancement par phase">
      {PHASES.map((p) => (
        <div key={p.id} role="listitem" className={p.id === courante ? 'courante' : ''} title={`${p.label} : ${avancement[p.id]} %`}>
          <div className="jauge">
            <span style={{ width: `${avancement[p.id]}%` }} />
          </div>
          <div className="libelle">{p.label}</div>
        </div>
      ))}
    </div>
  );
}

export function Niveaux({ valeur, ton = '', label }: { valeur: Niveau; ton?: '' | 'garance' | 'cobalt' | 'sauge'; label: string }) {
  return (
    <span className={`dv-niveau ${ton}`} role="img" aria-label={`${label} ${valeur} sur 3`}>
      {[1, 2, 3].map((n) => (
        <i key={n} className={n <= valeur ? 'on' : ''} />
      ))}
    </span>
  );
}

export function Pastille({ children, ton = '', point = true }: { children: ReactNode; ton?: '' | 'sauge' | 'garance' | 'cobalt' | 'ocre' | 'cuivre' | 'encre' | 'contour'; point?: boolean }) {
  return <span className={`dv-pastille ${ton}${point ? '' : ' sans-point'}`}>{children}</span>;
}

export function Propose({ children = 'Proposé par règles' }: { children?: ReactNode }) {
  return <span className="dv-propose">{children}</span>;
}

/** Trajectoire d'une mesure : avant → cible, avec relevés éventuels. Échelle commune par mesure. */
export function Trajectoire({ m }: { m: Mesure }) {
  const vals = [m.avant, m.cible, m.a30, m.a90].filter((v): v is number => v !== undefined);
  const max = Math.max(1, ...vals);
  const pct = (v?: number) => (v === undefined ? 0 : Math.round((v / max) * 100));
  return (
    <div className="dv-trajectoire">
      <div>
        <div className="dv-ligne espace">
          <span style={{ fontWeight: 600, fontSize: 'var(--dv-t-14)' }}>{m.indicateur}</span>
          <span className="t-mini">{m.unite}</span>
        </div>
        <div className="piste" aria-hidden>
          {m.avant !== undefined && <span className="avant" style={{ left: 0, width: `${pct(m.avant)}%`, opacity: 0.35 }} />}
          {m.cible !== undefined && <span className="cible" style={{ left: 0, width: `${pct(m.cible)}%` }} />}
        </div>
        <div className="t-mini" style={{ marginTop: 4 }}>
          Source : {m.source}
        </div>
      </div>
      <div className="valeurs" aria-label={`Avant ${m.avant ?? 'non relevé'}, cible ${m.cible ?? 'non définie'}`}>
        {m.avant ?? '—'}
        <span className="tres-doux"> → </span>
        <span style={{ color: 'var(--dv-sauge)' }}>{m.cible ?? '—'}</span>
        <small>{m.a30 !== undefined ? `J+30 : ${m.a30}` : 'J+30 à relever'}</small>
      </div>
    </div>
  );
}

export function Chiffre({ valeur, libelle, tendance, ton }: { valeur: ReactNode; libelle: string; tendance?: ReactNode; ton?: 'sauge' | 'garance' }) {
  return (
    <div>
      <div className="t-sur">{libelle}</div>
      <div className="t-chiffre">{valeur}</div>
      {tendance && <div className={`tendance ${ton ?? ''}`}>{tendance}</div>}
    </div>
  );
}
