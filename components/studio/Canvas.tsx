'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Etape, Mission, Probleme, VersionProcessus } from '../../lib/domain/types';
import type { EtatCanvas, Note, Position } from './StudioContext';

export const NOEUD_L = 190;
export const NOEUD_H = 72;
export const COULOIR_H = 130;
export const MARGE_G = 170;
export const PAS_X = 230;
export const NOTE_L = 170;
export const NOTE_H = 86;

export type Selection = { kind: 'etape' | 'note'; id: string } | null;

function lignes(texte: string, max = 27): string[] {
  const mots = texte.split(/\s+/);
  const out: string[] = [];
  let cur = '';
  for (const m of mots) {
    if ((cur + ' ' + m).trim().length > max && cur) {
      out.push(cur);
      cur = m;
      if (out.length === 3) break;
    } else cur = (cur + ' ' + m).trim();
  }
  if (out.length < 3 && cur) out.push(cur);
  return out;
}

/** Couloirs (acteurs) d'une version, ordre d'apparition ; « Non attribué » en dernier. */
export function couloirsDe(etapes: Etape[], version: VersionProcessus): string[] {
  const acteurs: string[] = [];
  for (const e of etapes.filter((x) => x.version === version && x.statut !== 'rejete')) {
    const a = e.acteur.trim() || 'Non attribué';
    if (!acteurs.includes(a)) acteurs.push(a);
  }
  return acteurs;
}

/** Position par défaut d'une étape : couloir de son acteur, colonne de son rang. */
export function positionDefaut(e: Etape, index: number, couloirs: string[]): Position {
  const ligne = Math.max(0, couloirs.indexOf(e.acteur.trim() || 'Non attribué'));
  return { x: MARGE_G + index * PAS_X, y: ligne * COULOIR_H + (COULOIR_H - NOEUD_H) / 2 };
}

type Props = {
  mission: Mission;
  version: VersionProcessus;
  etat: EtatCanvas;
  selection: Selection;
  onSelect: (s: Selection) => void;
  onDeplacer: (kind: 'etape' | 'note', id: string, pos: Position, couloir?: string) => void;
  onDoubleClic?: (kind: 'etape' | 'note', id: string) => void;
  outil: 'selection' | 'etape' | 'note';
  onCreer?: (kind: 'etape' | 'note', pos: Position, couloir: string) => void;
};

/**
 * Canvas d'atelier : couloirs par acteur, étapes et notes déplaçables, liens entre étapes consécutives,
 * déplacement du plan (glisser le fond), zoom (molette avec Ctrl, boutons). Fonctionnel : positions et
 * changements d'acteur sont enregistrés ; les liens suivent l'ordre horizontal des étapes.
 */
export function Canvas({ mission, version, etat, selection, onSelect, onDeplacer, onDoubleClic, outil, onCreer }: Props) {
  const conteneur = useRef<HTMLDivElement>(null);
  const [vue, setVue] = useState({ x: 24, y: 24, k: 1 });
  const [glisse, setGlisse] = useState<null | { kind: 'plan' | 'etape' | 'note'; id?: string; depart: { x: number; y: number }; origine: { x: number; y: number }; bouge: boolean }>(null);
  const [positionsTemp, setPositionsTemp] = useState<Record<string, Position>>({});

  const etapes = useMemo(() => mission.etapes.filter((e) => e.version === version && e.statut !== 'rejete'), [mission.etapes, version]);
  const couloirs = useMemo(() => {
    const base = couloirsDe(mission.etapes, version);
    return base.length ? base : ['Non attribué'];
  }, [mission.etapes, version]);

  const positionDe = useCallback(
    (e: Etape, i: number): Position => positionsTemp[e.id] ?? etat.positions[e.id] ?? positionDefaut(e, i, couloirs),
    [positionsTemp, etat.positions, couloirs],
  );

  // Étapes triées par abscisse : les liens suivent l'ordre visuel.
  const etapesTriees = useMemo(() => etapes.map((e, i) => ({ e, p: positionDe(e, i) })).sort((a, b) => a.p.x - b.p.x), [etapes, positionDe]);
  const largeur = Math.max(1200, MARGE_G + (etapesTriees.length + 1) * PAS_X);
  const hauteur = couloirs.length * COULOIR_H + 40;

  const versPlan = (clientX: number, clientY: number) => {
    const r = conteneur.current!.getBoundingClientRect();
    return { x: (clientX - r.left - vue.x) / vue.k, y: (clientY - r.top - vue.y) / vue.k };
  };

  const surPointerDown = (ev: React.PointerEvent, kind: 'plan' | 'etape' | 'note', id?: string, origine?: Position) => {
    if (ev.button !== 0) return;
    (ev.currentTarget as Element).setPointerCapture?.(ev.pointerId);
    if (kind === 'plan') {
      if (outil !== 'selection' && onCreer) {
        const p = versPlan(ev.clientX, ev.clientY);
        const ligne = Math.min(couloirs.length - 1, Math.max(0, Math.floor(p.y / COULOIR_H)));
        onCreer(outil, { x: p.x - NOEUD_L / 2, y: ligne * COULOIR_H + (COULOIR_H - NOEUD_H) / 2 }, couloirs[ligne]);
        return;
      }
      setGlisse({ kind, depart: { x: ev.clientX, y: ev.clientY }, origine: { x: vue.x, y: vue.y }, bouge: false });
      return;
    }
    ev.stopPropagation();
    onSelect({ kind, id: id! });
    setGlisse({ kind, id, depart: { x: ev.clientX, y: ev.clientY }, origine: origine!, bouge: false });
  };

  const surPointerMove = (ev: React.PointerEvent) => {
    if (!glisse) return;
    const dx = ev.clientX - glisse.depart.x;
    const dy = ev.clientY - glisse.depart.y;
    if (!glisse.bouge && Math.hypot(dx, dy) < 3) return;
    if (glisse.kind === 'plan') {
      setVue((v) => ({ ...v, x: glisse.origine.x + dx, y: glisse.origine.y + dy }));
    } else {
      setPositionsTemp((p) => ({ ...p, [glisse.id!]: { x: glisse.origine.x + dx / vue.k, y: glisse.origine.y + dy / vue.k } }));
    }
    if (!glisse.bouge) setGlisse({ ...glisse, bouge: true });
  };

  const surPointerUp = () => {
    if (!glisse) return;
    if (glisse.kind !== 'plan' && glisse.bouge && glisse.id) {
      const p = positionsTemp[glisse.id];
      if (p) {
        if (glisse.kind === 'etape') {
          const ligne = Math.min(couloirs.length - 1, Math.max(0, Math.round((p.y + NOEUD_H / 2 - COULOIR_H / 2) / COULOIR_H)));
          const y = ligne * COULOIR_H + (COULOIR_H - NOEUD_H) / 2;
          onDeplacer('etape', glisse.id, { x: Math.max(MARGE_G - 40, p.x), y }, couloirs[ligne]);
        } else onDeplacer('note', glisse.id, p);
      }
      setPositionsTemp((t) => {
        const c = { ...t };
        delete c[glisse.id!];
        return c;
      });
    } else if (glisse.kind === 'plan' && !glisse.bouge) {
      onSelect(null);
    }
    setGlisse(null);
  };

  const zoomer = (facteur: number, centre?: { x: number; y: number }) => {
    setVue((v) => {
      const k = Math.min(2.5, Math.max(0.35, v.k * facteur));
      if (!centre || !conteneur.current) return { ...v, k };
      const r = conteneur.current.getBoundingClientRect();
      const cx = centre.x - r.left;
      const cy = centre.y - r.top;
      return { k, x: cx - ((cx - v.x) * k) / v.k, y: cy - ((cy - v.y) * k) / v.k };
    });
  };

  const ajuster = useCallback(() => {
    if (!conteneur.current) return;
    const r = conteneur.current.getBoundingClientRect();
    // On privilégie la lisibilité : on ajuste sur la hauteur, et on ne descend pas sous 65 % même si la largeur dépasse (le plan se déplace à la main).
    const k = Math.min(1.05, Math.max(0.8, Math.min((r.width - 40) / largeur, (r.height - 60) / hauteur)));
    setVue({ k, x: 20, y: 44 });
  }, [largeur, hauteur]);

  useEffect(() => {
    ajuster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  useEffect(() => {
    const el = conteneur.current;
    if (!el) return;
    const surRoue = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        zoomer(e.deltaY < 0 ? 1.1 : 0.9, { x: e.clientX, y: e.clientY });
      } else {
        e.preventDefault();
        setVue((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
      }
    };
    el.addEventListener('wheel', surRoue, { passive: false });
    return () => el.removeEventListener('wheel', surRoue);
  }, []);

  const problemesDe = (id: string) => mission.problemes.filter((p) => p.etapeIds.includes(id));

  return (
    <div ref={conteneur} className={`hx-canvas${glisse?.kind === 'plan' && glisse.bouge ? ' hx-glisse' : ''}`} onPointerDown={(e) => surPointerDown(e, 'plan')} onPointerMove={surPointerMove} onPointerUp={surPointerUp} onPointerCancel={surPointerUp} role="application" aria-label={`Canvas du processus ${version}`} style={outil !== 'selection' ? { cursor: 'crosshair' } : undefined}>
      <svg>
        <defs>
          <marker id="hx-fleche" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--hx-texte-3)" />
          </marker>
        </defs>
        <g transform={`translate(${vue.x} ${vue.y}) scale(${vue.k})`}>
          {couloirs.map((c, i) => (
            <g key={c} className="hx-couloir">
              <rect x={0} y={i * COULOIR_H} width={largeur} height={COULOIR_H - 6} rx={10} />
              {lignes(c, 22).map((l, j) => (
                <text key={j} x={16} y={i * COULOIR_H + 26 + j * 14}>
                  {l}
                </text>
              ))}
              <text x={16} y={i * COULOIR_H + COULOIR_H - 18} style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>
                {etapes.filter((e) => (e.acteur.trim() || 'Non attribué') === c).length} étape(s)
              </text>
            </g>
          ))}
          {etapesTriees.slice(0, -1).map(({ e, p }, i) => {
            const q = etapesTriees[i + 1].p;
            const x1 = p.x + NOEUD_L;
            const y1 = p.y + NOEUD_H / 2;
            const x2 = q.x;
            const y2 = q.y + NOEUD_H / 2;
            const mx = (x1 + x2) / 2;
            return <path key={`l-${e.id}`} className="hx-lien" d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`} />;
          })}
          {etat.notes.map((n) => {
            const p = positionsTemp[n.id] ?? { x: n.x, y: n.y };
            const sel = selection?.kind === 'note' && selection.id === n.id;
            return (
              <g key={n.id} className={`hx-note ${n.type}${sel ? ' selection' : ''}`} transform={`translate(${p.x} ${p.y})`} onPointerDown={(ev) => surPointerDown(ev, 'note', n.id, p)} onDoubleClick={() => onDoubleClic?.('note', n.id)} role="button" tabIndex={0} aria-label={`Note : ${n.texte}`} onKeyDown={(ev) => ev.key === 'Enter' && onSelect({ kind: 'note', id: n.id })} style={{ cursor: 'grab' }}>
                <rect width={NOTE_L} height={NOTE_H} rx={6} />
                {lignes(n.texte, 26)
                  .slice(0, 4)
                  .map((l, j) => (
                    <text key={j} x={10} y={20 + j * 15}>
                      {l}
                    </text>
                  ))}
                <text x={10} y={NOTE_H - 8} style={{ fontSize: 9.5, fill: 'var(--hx-texte-3)' }}>
                  {n.type === 'citation' ? 'Verbatim client' : n.type === 'copilote' ? 'Question du copilote' : 'Note'}
                </text>
              </g>
            );
          })}
          {etapesTriees.map(({ e, p }, i) => {
            const nb = problemesDe(e.id).length;
            const sel = selection?.kind === 'etape' && selection.id === e.id;
            const cls = ['hx-noeud', sel ? 'selection' : '', e.statut === 'propose' ? 'propose' : '', e.version === 'cible' && e.changement === 'nouvelle' ? 'nouvelle' : '', e.version === 'cible' && e.changement === 'modifiee' ? 'modifiee' : '', glisse?.id === e.id && glisse.bouge ? 'hx-glisse' : ''].filter(Boolean).join(' ');
            const t = lignes(e.texte);
            return (
              <g key={e.id} className={cls} transform={`translate(${p.x} ${p.y})`} onPointerDown={(ev) => surPointerDown(ev, 'etape', e.id, p)} onDoubleClick={() => onDoubleClic?.('etape', e.id)} role="button" tabIndex={0} aria-label={`Étape ${i + 1} : ${e.texte}`} onKeyDown={(ev) => ev.key === 'Enter' && onSelect({ kind: 'etape', id: e.id })}>
                <rect className="fond" width={NOEUD_L} height={NOEUD_H} rx={10} />
                <text className="index" x={NOEUD_L - 10} y={15} textAnchor="end">
                  {i + 1}
                </text>
                {t.slice(0, 2).map((l, j) => (
                  <text key={j} x={12} y={t.length > 1 ? 26 + j * 15 : 34} fontWeight={j === 0 ? 600 : 400}>
                    {l}
                  </text>
                ))}
                <text className="sous" x={12} y={NOEUD_H - 10}>
                  {[e.outil, e.dureeMin ? `${e.dureeMin} min` : null].filter(Boolean).join(' · ') || 'outil non précisé'}
                </text>
                {nb > 0 && (
                  <g className="hx-douleur" transform={`translate(${NOEUD_L - 4} 4)`}>
                    <circle r={10} />
                    <text textAnchor="middle" y={3.5}>
                      {nb}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <div className="hx-outils-zoom">
        <button type="button" className="hx-btn icone" aria-label="Zoom avant" onClick={() => zoomer(1.2)}>
          +
        </button>
        <button type="button" className="hx-btn icone" aria-label="Zoom arrière" onClick={() => zoomer(1 / 1.2)}>
          −
        </button>
        <button type="button" className="hx-btn icone" aria-label="Ajuster à la fenêtre" title="Ajuster" onClick={ajuster} style={{ fontSize: 10 }}>
          {Math.round(vue.k * 100)}%
        </button>
      </div>
    </div>
  );
}

export type { Note, Probleme };
