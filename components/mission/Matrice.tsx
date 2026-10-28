'use client';

import type { Solution } from '../../lib/domain/types';
import { LIBELLES_PRIORITE } from '../../lib/domain/types';

const COULEURS: Record<Solution['priorite'], string> = { quick_win: 'var(--sauge)', a_planifier: 'var(--bleu)', a_construire: 'var(--accent)', specialiste: 'var(--or)' };
const EFFORT: Record<Solution['faisabilite']['effort'], number> = { faible: 1, moyen: 2, fort: 3 };

/** Matrice impact × effort en SVG. Chaque solution est un point ; la couleur suit la priorité calculée par règles. */
export function Matrice({ solutions, selection, onSelect }: { solutions: Solution[]; selection?: string | null; onSelect?: (id: string) => void }) {
  const L = 520;
  const H = 300;
  const m = { g: 44, d: 16, h: 16, b: 36 };
  const lx = L - m.g - m.d;
  const ly = H - m.h - m.b;
  const x = (effort: number) => m.g + ((effort - 0.5) / 3) * lx;
  const y = (impact: number) => m.h + ly - ((impact - 0.5) / 3) * ly;
  // Décale verticalement les points qui partagent la même case impact × effort.
  const cle = (s: Solution) => `${s.impact}-${s.faisabilite.effort}-${s.necessiteIA}-${s.faisabilite.outilDejaPresent}`;
  const totaux = new Map<string, number>();
  for (const s of solutions) totaux.set(cle(s), (totaux.get(cle(s)) ?? 0) + 1);
  const vus = new Map<string, number>();
  return (
    <svg className="matrice" viewBox={`0 0 ${L} ${H}`} role="img" aria-label="Matrice impact et effort des solutions">
      <rect className="quadrant" x={m.g} y={m.h} width={lx / 2} height={ly / 2} fill="var(--sauge-clair)" />
      <text x={m.g + 8} y={m.h + 16} fontWeight={600} fill="var(--sauge)">
        Quick wins
      </text>
      <text x={m.g + lx / 2 + 8} y={m.h + 16} fontWeight={600}>
        À construire
      </text>
      <text x={m.g + 8} y={m.h + ly - 8}>
        Faible priorité
      </text>
      <text x={m.g + lx / 2 + 8} y={m.h + ly - 8}>
        À planifier
      </text>
      <line x1={m.g} x2={m.g + lx} y1={m.h + ly / 2} y2={m.h + ly / 2} stroke="var(--bord)" strokeDasharray="4 4" />
      <line x1={m.g + lx / 2} x2={m.g + lx / 2} y1={m.h} y2={m.h + ly} stroke="var(--bord)" strokeDasharray="4 4" />
      <rect className="quadrant" x={m.g} y={m.h} width={lx} height={ly} />
      <text x={m.g + lx / 2} y={H - 8} textAnchor="middle">
        Effort → faible à fort
      </text>
      <text x={14} y={m.h + ly / 2} textAnchor="middle" transform={`rotate(-90 14 ${m.h + ly / 2})`}>
        Impact → faible à fort
      </text>
      {solutions.map((s) => {
        const e = EFFORT[s.faisabilite.effort] + (s.necessiteIA ? 0.6 : 0) - (s.faisabilite.outilDejaPresent ? 0.3 : 0);
        const k = cle(s);
        const n = vus.get(k) ?? 0;
        vus.set(k, n + 1);
        const total = totaux.get(k) ?? 1;
        const cx = x(Math.min(3.3, Math.max(0.7, e)));
        const cy = y(s.impact) + n * 20 - ((total - 1) * 20) / 2;
        return (
          <g key={s.id} className="point" transform={`translate(${cx} ${cy})`} onClick={() => onSelect?.(s.id)} role={onSelect ? 'button' : undefined} tabIndex={onSelect ? 0 : undefined} aria-label={`${s.titre} : ${LIBELLES_PRIORITE[s.priorite]}`} onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && onSelect?.(s.id)}>
            <circle r={selection === s.id ? 11 : 8} fill={COULEURS[s.priorite]} opacity={s.decision === 'ecartee' ? 0.35 : 1} />
            <text x={12} y={4}>
              {s.titre.length > 28 ? s.titre.slice(0, 27) + '…' : s.titre}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
