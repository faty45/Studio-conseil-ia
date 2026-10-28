import type { Pack } from '../packs/schema';
import type { Etape } from './types';
import { genId } from './types';

/** Un texte source pour l'extraction : une carte ou une réponse d'atelier. */
export type TexteSource = { id: string; texte: string };

const MARQUEURS_DEFAUT = [
  "d'abord",
  'ensuite',
  'puis',
  'après',
  'enfin',
  'avant de',
  'une fois',
  'quand',
  'ensuite,',
];

const PRONOMS_ACTEUR = ['je', "j'", 'nous', 'on'];

function normaliser(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** Découpe un texte en segments candidats : lignes, puces, numéros, ponctuation forte, marqueurs de séquence. */
export function segmenter(texte: string, marqueurs: string[] = MARQUEURS_DEFAUT): string[] {
  const lignes = texte
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
    .filter(Boolean);
  const segments: string[] = [];
  const regexMarqueurs = new RegExp(
    `\\s*(?:[.;!?]|,\\s*(?=(?:${marqueurs.map(echapper).join('|')})\\b)|\\b(?:${marqueurs.map(echapper).join('|')})\\b)\\s*`,
    'gi',
  );
  for (const ligne of lignes) {
    for (const part of ligne.split(regexMarqueurs)) {
      const p = part.replace(/^[,;:\s]+|[,;:\s]+$/g, '').trim();
      if (p.split(/\s+/).length >= 2) segments.push(p);
    }
  }
  return segments;
}

function echapper(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function trouverTerme(segment: string, termes: string[]): string | undefined {
  const seg = normaliser(segment);
  let meilleur: string | undefined;
  for (const t of termes) {
    const tn = normaliser(t);
    if (tn && seg.includes(tn) && (!meilleur || t.length > meilleur.length)) meilleur = t;
  }
  return meilleur;
}

function majuscule(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Extraction d'étapes à partir des textes d'atelier, sans IA.
 * Chaque étape est marquée `origine: 'extraction'`, `statut: 'propose'` : la consultante accepte, corrige ou rejette.
 * Limite assumée : règles simples (découpage, vocabulaire du pack). Pas de compréhension du sens.
 */
export function extraireEtapes(sources: TexteSource[], pack: Pack, max = 12): Etape[] {
  const marqueurs = [...MARQUEURS_DEFAUT, ...(pack.vocabulaire.marqueursEtapes ?? [])];
  const vus = new Set<string>();
  const etapes: Etape[] = [];
  for (const src of sources) {
    for (const seg of segmenter(src.texte, marqueurs)) {
      const cle = normaliser(seg);
      if (vus.has(cle)) continue;
      vus.add(cle);
      const acteur = trouverTerme(seg, pack.vocabulaire.acteurs) ?? detecterPronom(seg);
      const outil = trouverTerme(seg, pack.vocabulaire.outils);
      etapes.push({
        id: genId(),
        texte: majuscule(seg),
        acteur: acteur ? majuscule(acteur) : undefined,
        outil: outil ? majuscule(outil) : undefined,
        origine: 'extraction',
        statut: 'propose',
        sources: [src.id],
      });
      if (etapes.length >= max) return etapes;
    }
  }
  return etapes;
}

function detecterPronom(segment: string): string | undefined {
  const mots = normaliser(segment).split(/\s+/);
  const premier = mots[0] ?? '';
  if (PRONOMS_ACTEUR.some((p) => premier === p || premier.startsWith("j'"))) return 'La personne interrogée';
  return undefined;
}
