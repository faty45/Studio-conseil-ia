import type { Solution } from '../../lib/domain/types';
import { LIBELLES_PRIORITE } from '../../lib/domain/types';

const COULEURS: Record<Solution['priorite'], string> = { quick_win: 'var(--dv-sauge)', a_planifier: 'var(--dv-cobalt)', a_construire: 'var(--dv-cuivre)', specialiste: 'var(--dv-ocre)' };
const EFFORT: Record<Solution['faisabilite']['effort'], number> = { faible: 1, moyen: 2, fort: 3 };

/** Carte des opportunités : impact (vertical) × effort (horizontal). Les quick wins en haut à gauche. */
export function Opportunites({ solutions, selection }: { solutions: Solution[]; selection?: string }) {
  const W = 680;
  const Hh = 400;
  const m = { g: 36, d: 16, h: 28, b: 34 };
  const lx = W - m.g - m.d;
  const ly = Hh - m.h - m.b;
  const x = (e: number) => m.g + ((e - 0.5) / 3) * lx;
  const y = (i: number) => m.h + ly - ((i - 0.5) / 3) * ly;
  // Une cellule par (impact, effort) ; les points d'une cellule sont empilés, retenues d'abord.
  const cle = (s: Solution) => `${s.impact}-${EFFORT[s.faisabilite.effort]}`;
  const cellules = new Map<string, Solution[]>();
  for (const s of [...solutions].sort((a, b) => Number(b.decision === 'retenue') - Number(a.decision === 'retenue'))) cellules.set(cle(s), [...(cellules.get(cle(s)) ?? []), s]);
  const PAS = 26;
  return (
    <svg className="dv-opportunites" viewBox={`0 0 ${W} ${Hh}`} role="img" aria-label="Carte des opportunités : impact selon effort">
      <rect x={m.g} y={m.h} width={lx / 2} height={ly / 2} fill="var(--dv-sauge-clair)" opacity={0.7} rx={10} />
      <rect x={m.g} y={m.h} width={lx} height={ly} fill="none" stroke="var(--dv-filet)" rx={10} />
      <line x1={m.g} x2={m.g + lx} y1={m.h + ly / 2} y2={m.h + ly / 2} stroke="var(--dv-filet-fort)" strokeDasharray="3 5" />
      <line x1={m.g + lx / 2} x2={m.g + lx / 2} y1={m.h} y2={m.h + ly} stroke="var(--dv-filet-fort)" strokeDasharray="3 5" />
      <text className="quadrant-nom" x={m.g + 12} y={m.h + 18} fill="var(--dv-sauge)">
        Quick wins
      </text>
      <text className="quadrant-nom" x={m.g + lx - 12} y={m.h + 18} textAnchor="end">
        À construire
      </text>
      <text className="quadrant-nom" x={m.g + 12} y={m.h + ly - 10}>
        Faible priorité
      </text>
      <text className="quadrant-nom" x={m.g + lx - 12} y={m.h + ly - 10} textAnchor="end">
        À planifier
      </text>
      <text x={m.g + lx / 2} y={Hh - 8} textAnchor="middle">
        Effort → faible … fort
      </text>
      <text x={12} y={m.h + ly / 2} textAnchor="middle" transform={`rotate(-90 12 ${m.h + ly / 2})`}>
        Impact → faible … fort
      </text>
      {[...cellules.entries()].flatMap(([k, liste]) => {
        const [impact, effort] = k.split('-').map(Number);
        const cx = x(effort);
        const y0 = y(impact) - ((liste.length - 1) * PAS) / 2 + (impact === 3 ? 14 : impact === 1 ? -14 : 0);
        return liste.map((s, n) => {
          const cy = y0 + n * PAS;
          const sel = selection === s.id;
          const etiquette = s.titre.length > 30 ? s.titre.slice(0, 29) + '…' : s.titre;
          return (
            <g key={s.id} className={`point${s.decision === 'ecartee' ? ' ecartee' : ''}`} transform={`translate(${cx} ${cy})`} aria-label={`${s.titre} : ${LIBELLES_PRIORITE[s.priorite]}`}>
              <circle r={sel ? 9 : 6.5} fill={COULEURS[s.priorite]} />
              {s.decision === 'retenue' && <circle r={sel ? 13 : 10.5} fill="none" stroke={COULEURS[s.priorite]} strokeWidth={1.2} opacity={0.6} />}
              <text x={16} y={4} fontWeight={sel || s.decision === 'retenue' ? 600 : 400}>
                {etiquette}
              </text>
            </g>
          );
        });
      })}
    </svg>
  );
}
