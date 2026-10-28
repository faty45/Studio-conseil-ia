import type { Etape, Mission, Probleme, VersionProcessus } from '../domain/types';
import { genId } from '../domain/types';
import type { Pack } from '../packs/schema';
import { normaliser } from './texte';

export type TexteSource = { id: string; texte: string };

const MARQUEURS = ["d'abord", 'ensuite', 'puis', 'après', 'enfin', 'avant de', 'une fois', 'quand'];
const PRONOMS = ['je', "j'", 'nous', 'on'];

function echapper(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Découpe un texte en segments candidats : lignes, puces, numéros, ponctuation forte, marqueurs de séquence. */
export function segmenter(texte: string, marqueurs: string[] = MARQUEURS): string[] {
  const lignes = texte
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
    .filter(Boolean);
  const alternance = marqueurs.map(echapper).join('|');
  const regex = new RegExp(`\\s*(?:[.;!?]|,\\s*(?=(?:${alternance})\\b)|\\b(?:${alternance})\\b)\\s*`, 'gi');
  const segments: string[] = [];
  for (const ligne of lignes) {
    for (const part of ligne.split(regex)) {
      const p = part.replace(/^[,;:\s]+|[,;:\s]+$/g, '').trim();
      if (p.split(/\s+/).length >= 2) segments.push(p);
    }
  }
  return segments;
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
 * Extraction d'étapes sans IA : découpage et vocabulaire du pack. Chaque étape est une proposition.
 * Limite assumée : la règle découpe, elle ne comprend pas.
 */
export function extraireEtapes(sources: TexteSource[], pack: Pack, version: VersionProcessus = 'actuel', max = 14): Etape[] {
  const marqueurs = [...MARQUEURS, ...(pack.vocabulaire.marqueursEtapes ?? [])];
  const vus = new Set<string>();
  const etapes: Etape[] = [];
  for (const src of sources) {
    for (const seg of segmenter(src.texte, marqueurs)) {
      const cle = normaliser(seg);
      if (vus.has(cle)) continue;
      vus.add(cle);
      const acteur = trouverTerme(seg, pack.vocabulaire.acteurs);
      const premier = normaliser(seg).split(/\s+/)[0] ?? '';
      const pronom = PRONOMS.some((p) => premier === p || premier.startsWith("j'"));
      const outil = trouverTerme(seg, pack.vocabulaire.outils);
      etapes.push({
        id: genId(),
        texte: majuscule(seg),
        acteur: acteur ? majuscule(acteur) : pronom ? 'La personne interrogée' : '',
        outil: outil ? majuscule(outil) : undefined,
        version,
        origine: 'extraction',
        statut: 'propose',
        sources: [src.id],
      });
      if (etapes.length >= max) return etapes;
    }
  }
  return etapes;
}

/** Textes exploitables d'une mission pour l'extraction : réponses et journal. */
export function textesDeMission(mission: Mission): TexteSource[] {
  const s: TexteSource[] = [];
  for (const [qid, r] of Object.entries(mission.reponses)) if (r.texte.trim() && r.statut !== 'non_applicable') s.push({ id: 'reponse:' + qid, texte: r.texte });
  for (const e of mission.journal) if (e.type !== 'question') s.push({ id: 'entree:' + e.id, texte: e.texte });
  return s;
}

/** Couloirs (acteurs) d'une version du processus, dans l'ordre d'apparition. */
export function couloirs(etapes: Etape[], version: VersionProcessus): string[] {
  const acteurs: string[] = [];
  for (const e of etapes.filter((x) => x.version === version && x.statut !== 'rejete')) {
    const a = e.acteur.trim() || 'Non attribué';
    if (!acteurs.includes(a)) acteurs.push(a);
  }
  return acteurs;
}

export type Diff = { ajoutees: Etape[]; retirees: Etape[]; conservees: Etape[] };

/** Différence entre le processus actuel et la cible, par texte normalisé. */
export function diffProcessus(etapes: Etape[]): Diff {
  const actuel = etapes.filter((e) => e.version === 'actuel' && e.statut === 'accepte');
  const cible = etapes.filter((e) => e.version === 'cible' && e.statut === 'accepte');
  const clesActuel = new Set(actuel.map((e) => normaliser(e.texte)));
  const clesCible = new Set(cible.map((e) => normaliser(e.texte)));
  return {
    ajoutees: cible.filter((e) => !clesActuel.has(normaliser(e.texte))),
    retirees: actuel.filter((e) => !clesCible.has(normaliser(e.texte))),
    conservees: cible.filter((e) => clesActuel.has(normaliser(e.texte))),
  };
}

/** Crée la version cible à partir de l'actuel (copie), si elle n'existe pas encore. */
export function initialiserCible(etapes: Etape[]): Etape[] {
  if (etapes.some((e) => e.version === 'cible')) return etapes;
  const copies = etapes
    .filter((e) => e.version === 'actuel' && e.statut === 'accepte')
    .map((e) => ({ ...e, id: genId(), version: 'cible' as const, origine: 'manuel' as const, changement: 'inchangee' as const, sources: [e.id] }));
  return [...etapes, ...copies];
}

/** Problèmes rattachés à une étape. */
export function problemesDeLEtape(problemes: Probleme[], etapeId: string): Probleme[] {
  return problemes.filter((p) => p.etapeIds.includes(etapeId));
}
