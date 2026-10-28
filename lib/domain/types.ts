import type { CategorieSolution } from '../packs/schema';

/** Statut d'une réponse d'atelier : d'où vient l'information. */
export type StatutReponse = 'a_verifier' | 'declare' | 'observe' | 'valide' | 'non_applicable';

export const LIBELLES_STATUT_REPONSE: Record<StatutReponse, string> = {
  a_verifier: 'À vérifier',
  declare: 'Déclaré par le client',
  observe: 'Observé',
  valide: 'Validé ensemble',
  non_applicable: 'Non applicable',
};

export type Reponse = { texte: string; statut: StatutReponse };

export type TypeCarte = 'observation' | 'probleme' | 'idee' | 'citation';

export const LIBELLES_TYPE_CARTE: Record<TypeCarte, string> = {
  observation: 'Observation',
  probleme: 'Problème',
  idee: 'Idée',
  citation: 'Ce que le client a dit',
};

export type Carte = { id: string; type: TypeCarte; texte: string; creeLe: string };

export type OrigineEtape = 'manuel' | 'extraction';
export type StatutEtape = 'propose' | 'accepte' | 'rejete';

export type Etape = {
  id: string;
  texte: string;
  acteur?: string;
  outil?: string;
  origine: OrigineEtape;
  statut: StatutEtape;
  /** Identifiants des cartes ou réponses dont l'étape a été extraite. */
  sources: string[];
};

export type TypePreuve = 'declaration' | 'document' | 'observation' | 'trace';

export const LIBELLES_TYPE_PREUVE: Record<TypePreuve, string> = {
  declaration: 'Déclaration',
  document: 'Document',
  observation: 'Observation',
  trace: 'Trace',
};

export type Preuve = { id: string; type: TypePreuve; source: string; date: string };

export type StatutCause = 'hypothese' | 'validee' | 'invalidee';

export const LIBELLES_STATUT_CAUSE: Record<StatutCause, string> = {
  hypothese: 'Hypothèse',
  validee: 'Validée',
  invalidee: 'Invalidée',
};

export type Cause = { id: string; texte: string; statut: StatutCause };

export type Probleme = {
  id: string;
  texte: string;
  etapeId?: string;
  preuves: Preuve[];
  causes: Cause[];
  /** Identifiant de la carte d'origine, le cas échéant. */
  sourceId?: string;
};

export type DecisionSolution = 'a_decider' | 'retenue' | 'plus_tard' | 'ecartee';

export const LIBELLES_DECISION: Record<DecisionSolution, string> = {
  a_decider: 'À décider',
  retenue: 'Retenue',
  plus_tard: 'Plus tard',
  ecartee: 'Écartée',
};

export const LIBELLES_CATEGORIE: Record<CategorieSolution, string> = {
  simplification: 'Simplification sans IA',
  outil_existant: 'Outil déjà présent',
  automatisation: 'Automatisation',
  prestataire: 'Prestataire',
};

export type Solution = {
  id: string;
  titre: string;
  categorie: CategorieSolution;
  detail: string;
  hypotheses: string[];
  limites: string[];
  prerequis: string[];
  /** Identifiants des cartes ou réponses qui justifient la piste. */
  sources: string[];
  /** Extraits des observations qui ont déclenché la piste. */
  extraits: string[];
  decision: DecisionSolution;
  origine: 'suggestion' | 'manuel';
  recetteId?: string;
};

export type Action = { id: string; texte: string; responsable: string; echeance: string };

export type Mission = {
  id: string;
  nom: string;
  packId: string;
  packVersion: string;
  creeLe: string;
  misAJourLe: string;
  reponses: Record<string, Reponse>;
  cartes: Carte[];
  etapes: Etape[];
  problemes: Probleme[];
  solutions: Solution[];
  actions: Action[];
  notesSuivi: string;
};

export function nouvelleMission(nom: string, packId: string, packVersion: string, id?: string): Mission {
  const now = new Date().toISOString();
  return {
    id: id ?? genId(),
    nom,
    packId,
    packVersion,
    creeLe: now,
    misAJourLe: now,
    reponses: {},
    cartes: [],
    etapes: [],
    problemes: [],
    solutions: [],
    actions: [],
    notesSuivi: '',
  };
}

export function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
