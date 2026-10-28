'use client';

import { useMemo } from 'react';
import type { Etape, Probleme, VersionProcessus } from '../../lib/domain/types';
import { couloirs } from '../../lib/intelligence/processus';

const LARGEUR_NOEUD = 168;
const HAUTEUR_NOEUD = 64;
const PAS_X = 206;
const PAS_Y = 96;
const MARGE_GAUCHE = 150;
const MARGE_HAUT = 18;

/** Coupe un libellé en deux lignes au plus, sans couper les mots. */
function deuxLignes(texte: string, max = 24): string[] {
  const mots = texte.split(/\s+/);
  const lignes: string[] = [];
  let courante = '';
  for (const mot of mots) {
    if ((courante + ' ' + mot).trim().length > max && courante) {
      lignes.push(courante);
      courante = mot;
      if (lignes.length === 2) break;
    } else courante = (courante + ' ' + mot).trim();
  }
  if (lignes.length < 2 && courante) lignes.push(courante);
  if (lignes.length === 2 && mots.join(' ').length > lignes.join(' ').length) lignes[1] = lignes[1].slice(0, max - 1) + '…';
  return lignes;
}

export type PropsCarte = {
  etapes: Etape[];
  version: VersionProcessus;
  problemes?: Probleme[];
  selection?: string | null;
  onSelect?: (id: string) => void;
  /** Titre lu par les lecteurs d'écran. */
  titre?: string;
  compact?: boolean;
};

/**
 * Carte de processus en couloirs (acteurs en lignes, étapes dans l'ordre en colonnes).
 * SVG pur : pas de dépendance, impression et export possibles. Les étapes proposées sont en pointillé,
 * les étapes cibles nouvelles ou modifiées sont colorées, les problèmes rattachés apparaissent en pastille rouge.
 */
export function CarteProcessus({ etapes, version, problemes = [], selection, onSelect, titre, compact }: PropsCarte) {
  const visibles = useMemo(() => etapes.filter((e) => e.version === version && e.statut !== 'rejete'), [etapes, version]);
  const lignes = useMemo(() => couloirs(etapes, version), [etapes, version]);

  if (visibles.length === 0) {
    return (
      <div className="carte-processus" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
        <p className="doux" style={{ margin: 0 }}>
          {version === 'actuel' ? 'Aucune étape pour l’instant : ajoute une étape ou extrais-les des notes.' : 'La version cible n’existe pas encore : initialise-la depuis le processus actuel.'}
        </p>
      </div>
    );
  }

  const largeur = MARGE_GAUCHE + visibles.length * PAS_X + 20;
  const hauteur = MARGE_HAUT + lignes.length * PAS_Y + 10;
  const position = (e: Etape, i: number) => {
    const ligne = lignes.indexOf(e.acteur.trim() || 'Non attribué');
    return { x: MARGE_GAUCHE + i * PAS_X, y: MARGE_HAUT + ligne * PAS_Y + 14 };
  };

  return (
    <div className={`carte-processus${compact ? ' compacte' : ''}`}>
      <svg width={compact ? undefined : largeur} height={compact ? undefined : hauteur} viewBox={`0 0 ${largeur} ${hauteur}`} preserveAspectRatio="xMinYMin meet" role="img" aria-label={titre ?? `Carte du processus ${version}`}>
        <defs>
          <marker id="fleche" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--encre-3)" />
          </marker>
        </defs>
        {lignes.map((nom, i) => (
          <g key={nom}>
            <line x1={0} x2={largeur} y1={MARGE_HAUT + i * PAS_Y} y2={MARGE_HAUT + i * PAS_Y} stroke="var(--bord)" />
            <text className="couloir-nom" x={12} y={MARGE_HAUT + i * PAS_Y + PAS_Y / 2 + 4}>
              {deuxLignes(nom, 18)[0]}
            </text>
            {deuxLignes(nom, 18)[1] && (
              <text className="couloir-nom" x={12} y={MARGE_HAUT + i * PAS_Y + PAS_Y / 2 + 18}>
                {deuxLignes(nom, 18)[1]}
              </text>
            )}
          </g>
        ))}
        {visibles.slice(0, -1).map((e, i) => {
          const a = position(e, i);
          const b = position(visibles[i + 1], i + 1);
          const x1 = a.x + LARGEUR_NOEUD;
          const y1 = a.y + HAUTEUR_NOEUD / 2;
          const x2 = b.x;
          const y2 = b.y + HAUTEUR_NOEUD / 2;
          const mx = (x1 + x2) / 2;
          return <path key={`f-${e.id}`} className="fleche" d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`} />;
        })}
        {visibles.map((e, i) => {
          const p = position(e, i);
          const nb = problemes.filter((pb) => pb.etapeIds.includes(e.id)).length;
          const classes = ['noeud', e.id === selection ? 'selectionne' : '', e.statut === 'propose' ? 'propose' : '', e.version === 'cible' && e.changement === 'nouvelle' ? 'nouvelle' : '', e.version === 'cible' && e.changement === 'modifiee' ? 'modifiee' : '']
            .filter(Boolean)
            .join(' ');
          const lignesTexte = deuxLignes(e.texte);
          return (
            <g key={e.id} className={classes} transform={`translate(${p.x} ${p.y})`} onClick={() => onSelect?.(e.id)} role={onSelect ? 'button' : undefined} tabIndex={onSelect ? 0 : undefined} aria-label={`Étape ${i + 1} : ${e.texte}`} onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && onSelect?.(e.id)}>
              <rect width={LARGEUR_NOEUD} height={HAUTEUR_NOEUD} rx={10} />
              <text x={12} y={HAUTEUR_NOEUD / 2 - (lignesTexte.length > 1 ? 4 : -4)} fontWeight={600}>
                {lignesTexte[0]}
              </text>
              {lignesTexte[1] && (
                <text x={12} y={HAUTEUR_NOEUD / 2 + 12}>
                  {lignesTexte[1]}
                </text>
              )}
              {e.outil && (
                <text x={12} y={HAUTEUR_NOEUD - 8} fontSize={10} fill="var(--texte-doux)">
                  {e.outil}
                  {e.dureeMin ? ` · ${e.dureeMin} min` : ''}
                </text>
              )}
              <text x={LARGEUR_NOEUD - 10} y={14} fontSize={10} textAnchor="end" fill="var(--texte-doux)">
                {i + 1}
              </text>
              {nb > 0 && (
                <g className="douleur" transform={`translate(${LARGEUR_NOEUD - 2} 2)`}>
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
