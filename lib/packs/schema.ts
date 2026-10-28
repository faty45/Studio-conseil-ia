import { z } from 'zod';

export const CATEGORIES_SOLUTION = ['simplification', 'outil_existant', 'automatisation', 'prestataire'] as const;
export type CategorieSolution = (typeof CATEGORIES_SOLUTION)[number];

export const QuestionSchema = z.object({
  id: z.string().min(1),
  texte: z.string().min(1),
  aide: z.string().optional(),
});

export const RecetteSchema = z.object({
  id: z.string().min(1),
  titre: z.string().min(1),
  categorie: z.enum(CATEGORIES_SOLUTION),
  detail: z.string().min(1),
  motsCles: z.array(z.string().min(1)).min(1),
  hypotheses: z.array(z.string()).default([]),
  limites: z.array(z.string()).default([]),
  prerequis: z.array(z.string()).default([]),
});

export const PackSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  label: z.string().min(1),
  description: z.string().min(1),
  questions: z.array(QuestionSchema).default([]),
  vocabulaire: z
    .object({
      acteurs: z.array(z.string()).default([]),
      outils: z.array(z.string()).default([]),
      marqueursEtapes: z.array(z.string()).default([]),
    })
    .default({ acteurs: [], outils: [], marqueursEtapes: [] }),
  recettes: z.array(RecetteSchema).default([]),
  /** Familles de processus de la bibliothèque concernées par ce métier. */
  processusIds: z.array(z.string()).default([]),
  /** Hypothèses de départ fréquentes pour ce métier, proposées en préparation. */
  hypothesesTypiques: z.array(z.string()).default([]),
  /** Parties prenantes habituelles (rôles). */
  rolesTypiques: z.array(z.string()).default([]),
});

export const CoreSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  questions: z.array(QuestionSchema).min(1),
});

export type Question = z.infer<typeof QuestionSchema>;
export type Recette = z.infer<typeof RecetteSchema>;
export type Pack = z.infer<typeof PackSchema>;
export type Core = z.infer<typeof CoreSchema>;
