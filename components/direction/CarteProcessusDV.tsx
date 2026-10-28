import type { Etape, Probleme, VersionProcessus } from '../../lib/domain/types';
import { couloirs } from '../../lib/intelligence/processus';

const L = 184;
const H = 70;
const PAS_X = 222;
const PAS_Y = 104;
const MARGE_G = 168;
const MARGE_H = 16;

function lignes(texte: string, max = 26): string[] {
  const mots = texte.split(/\s+/);
  const out: string[] = [];
  let cur = '';
  for (const m of mots) {
    if ((cur + ' ' + m).trim().length > max && cur) {
      out.push(cur);
      cur = m;
      if (out.length === 2) break;
    } else cur = (cur + ' ' + m).trim();
  }
  if (out.length < 2 && cur) out.push(cur);
  if (out.length === 2 && mots.join(' ').length > out.join(' ').length) out[1] = out[1].slice(0, max - 1) + '…';
  return out;
}

/** Carte de processus en couloirs, version « direction visuelle » : fond alterné par couloir, nœuds adoucis, pastilles de douleur, durée. */
export function CarteProcessusDV({ etapes, version, problemes = [], selection, titre, compact }: { etapes: Etape[]; version: VersionProcessus; problemes?: Probleme[]; selection?: string; titre?: string; compact?: boolean }) {
  const visibles = etapes.filter((e) => e.version === version && e.statut !== 'rejete');
  const acteurs = couloirs(etapes, version);
  const largeur = MARGE_G + visibles.length * PAS_X + 16;
  const hauteur = MARGE_H + acteurs.length * PAS_Y + 8;
  const pos = (e: Etape, i: number) => ({ x: MARGE_G + i * PAS_X, y: MARGE_H + acteurs.indexOf(e.acteur.trim() || 'Non attribué') * PAS_Y + 17 });
  return (
    <div className="dv-carte">
      <svg width={compact ? undefined : largeur} height={compact ? undefined : hauteur} viewBox={`0 0 ${largeur} ${hauteur}`} preserveAspectRatio="xMinYMin meet" role="img" aria-label={titre ?? `Carte du processus ${version}`} style={compact ? { width: '100%', height: 'auto' } : undefined}>
        <defs>
          <marker id="dv-fleche" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--dv-encre-3)" />
          </marker>
        </defs>
        {acteurs.map((a, i) => (
          <g key={a}>
            <rect className={`couloir-fond${i % 2 ? ' alt' : ''}`} x={0} y={MARGE_H + i * PAS_Y} width={largeur} height={PAS_Y} />
            <line x1={0} x2={largeur} y1={MARGE_H + i * PAS_Y} y2={MARGE_H + i * PAS_Y} stroke="var(--dv-filet)" />
            {lignes(a, 20).map((l, j) => (
              <text key={j} className="couloir-nom" x={16} y={MARGE_H + i * PAS_Y + PAS_Y / 2 + (j === 0 ? -2 : 13)}>
                {l}
              </text>
            ))}
          </g>
        ))}
        {visibles.slice(0, -1).map((e, i) => {
          const a = pos(e, i);
          const b = pos(visibles[i + 1], i + 1);
          const x1 = a.x + L;
          const y1 = a.y + H / 2;
          const x2 = b.x;
          const y2 = b.y + H / 2;
          const mx = (x1 + x2) / 2;
          return <path key={e.id} className="fleche" d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`} />;
        })}
        {visibles.map((e, i) => {
          const p = pos(e, i);
          const nb = problemes.filter((pb) => pb.etapeIds.includes(e.id)).length;
          const cls = ['noeud', e.statut === 'propose' ? 'propose' : '', e.version === 'cible' && e.changement === 'nouvelle' ? 'nouvelle' : '', e.version === 'cible' && e.changement === 'modifiee' ? 'modifiee' : '', e.id === selection ? 'selection' : ''].filter(Boolean).join(' ');
          const t = lignes(e.texte);
          return (
            <g key={e.id} className={cls} transform={`translate(${p.x} ${p.y})`} aria-label={`Étape ${i + 1} : ${e.texte}`}>
              <rect width={L} height={H} rx={12} />
              <text className="index" x={L - 12} y={16} textAnchor="end">
                {i + 1}
              </text>
              <text x={14} y={t.length > 1 ? 27 : 36} fontWeight={600}>
                {t[0]}
              </text>
              {t[1] && (
                <text x={14} y={43}>
                  {t[1]}
                </text>
              )}
              <text className="sous" x={14} y={H - 11}>
                {[e.outil, e.dureeMin ? `${e.dureeMin} min` : ''].filter(Boolean).join(' · ')}
              </text>
              {nb > 0 && (
                <g className="douleur" transform={`translate(${L - 4} 4)`}>
                  <circle r={10} />
                  <text textAnchor="middle" y={3.5}>
                    {nb}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
