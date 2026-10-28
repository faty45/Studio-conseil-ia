import { z } from 'zod';
import { CATEGORIES_SOLUTION } from '../packs/schema';

/** Grandes familles de processus, communes à tous les métiers (inspirées des catégories de haut niveau des référentiels publics). */
export const ProcessusSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  exemples: z.array(z.string()).default([]),
});

/** Un problème universel : la même difficulté sous des mots différents selon les métiers. */
export const ProblemeUniverselSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  processusIds: z.array(z.string()).default([]),
  /** Mots et expressions qui le signalent dans la bouche des clients. */
  signaux: z.array(z.string()).min(1),
  /** Question qui permet de le confirmer en atelier. */
  questionDeConfirmation: z.string().min(1),
  /** Ce qu'il coûte typiquement (qualitatif, jamais chiffré). */
  coutTypique: z.string().min(1),
});

export const PatronSchema = z.object({
  id: z.string().min(1),
  titre: z.string().min(1),
  categorie: z.enum(CATEGORIES_SOLUTION),
  resume: z.string().min(1),
  detail: z.string().min(1),
  problemesUniversels: z.array(z.string()).min(1),
  processusIds: z.array(z.string()).default([]),
  /** Catégories d'outils génériques sur lesquelles le patron s'appuie. */
  outilsRequis: z.array(z.string()).default([]),
  alternativeSansIA: z.string().optional(),
  necessiteIA: z.boolean().default(false),
  effort: z.enum(['faible', 'moyen', 'fort']),
  coutMensuel: z.enum(['nul', 'faible', 'moyen', 'eleve']),
  prerequis: z.array(z.string()).default([]),
  risques: z.array(z.string()).default([]),
  limites: z.array(z.string()).default([]),
  /** Comment le patron s'adapte selon la taille. */
  adaptations: z.record(z.string(), z.string()).default({}),
  /** Exemples d'application par métier (fictifs ou génériques, sans client nommé). */
  exemples: z.array(z.object({ metier: z.string(), texte: z.string() })).default([]),
  /** Métiers où le patron a été vu fonctionner (générique, sans données client). */
  metiers: z.array(z.string()).default([]),
  statut: z.enum(['eprouve', 'candidat']).default('eprouve'),
  version: z.string().default('1.0.0'),
});

export const BibliothequeSchema = z.object({
  version: z.string(),
  processus: z.array(ProcessusSchema).min(1),
  problemesUniversels: z.array(ProblemeUniverselSchema).min(1),
  patrons: z.array(PatronSchema).min(1),
});

export type Processus = z.infer<typeof ProcessusSchema>;
export type ProblemeUniversel = z.infer<typeof ProblemeUniverselSchema>;
export type Patron = z.infer<typeof PatronSchema>;
export type Bibliotheque = z.infer<typeof BibliothequeSchema>;
