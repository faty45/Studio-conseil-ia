import type { CategorieSolution } from '../packs/schema';

/* ------------------------------------------------------------------ */
/* Client                                                              */
/* ------------------------------------------------------------------ */

export type TailleClient = '1-9' | '10-49' | '50-249' | '250+';

export const LIBELLES_TAILLE: Record<TailleClient, string> = {
  '1-9': '1 à 9 personnes',
  '10-49': '10 à 49 personnes',
  '50-249': '50 à 249 personnes',
  '250+': '250 personnes et plus',
};

export type PartiePrenante = { id: string; role: string; attentes: string; influence: 'faible' | 'moyenne' | 'forte' };

export type CategorieOutil = 'messagerie' | 'bureautique' | 'tableur' | 'agenda' | 'caisse' | 'messagerie_instantanee' | 'stockage' | 'metier' | 'site' | 'autre';

export const LIBELLES_CATEGORIE_OUTIL: Record<CategorieOutil, string> = {
  messagerie: 'Messagerie',
  bureautique: 'Bureautique',
  tableur: 'Tableur',
  agenda: 'Agenda',
  caisse: 'Caisse',
  messagerie_instantanee: 'Messagerie instantanée',
  stockage: 'Stockage de fichiers',
  metier: 'Logiciel métier',
  site: 'Site web',
  autre: 'Autre',
};

export type OutilClient = { id: string; nom: string; categorie: CategorieOutil; usage: string; sousExploite?: boolean };

export type DocumentClient = { id: string; titre: string; type: 'procedure' | 'export' | 'photo' | 'contrat' | 'autre'; note: string };

export type Client = {
  id: string;
  nom: string;
  secteur: string;
  taille: TailleClient;
  contexte: string;
  enjeux: string[];
  partiesPrenantes: PartiePrenante[];
  outils: OutilClient[];
  documents: DocumentClient[];
  /** Vrai pour les données de démonstration fictives. */
  fictif: boolean;
  creeLe: string;
};

/* ------------------------------------------------------------------ */
/* Mission                                                             */
/* ------------------------------------------------------------------ */

export type PhaseMission = 'preparer' | 'atelier' | 'analyser' | 'decider' | 'restituer' | 'suivre';

export const PHASES: { id: PhaseMission; label: string; description: string }[] = [
  { id: 'preparer', label: 'Préparer', description: 'Contexte, hypothèses, trame, consentement' },
  { id: 'atelier', label: 'Atelier', description: 'Conversation, faits, carte du processus' },
  { id: 'analyser', label: 'Analyser', description: 'Problèmes, causes, solutions, priorisation' },
  { id: 'decider', label: 'Décider', description: 'Quick wins, plan d’action, mesures' },
  { id: 'restituer', label: 'Restituer', description: 'Diagnostic, carte cible, synthèse validable' },
  { id: 'suivre', label: 'Suivre', description: 'Résultats, décisions, capitalisation' },
];

export type StatutHypothese = 'a_tester' | 'confirmee' | 'infirmee';

export const LIBELLES_STATUT_HYPOTHESE: Record<StatutHypothese, string> = {
  a_tester: 'À tester',
  confirmee: 'Confirmée',
  infirmee: 'Infirmée',
};

export type Hypothese = { id: string; texte: string; statut: StatutHypothese; origine: 'consultante' | 'bibliotheque' };

export type StatutReponse = 'a_verifier' | 'declare' | 'observe' | 'valide' | 'non_applicable';

export const LIBELLES_STATUT_REPONSE: Record<StatutReponse, string> = {
  a_verifier: 'À vérifier',
  declare: 'Déclaré par le client',
  observe: 'Observé',
  valide: 'Validé ensemble',
  non_applicable: 'Non applicable',
};

export type Reponse = { texte: string; statut: StatutReponse };

export type TypeEntree = 'note' | 'citation' | 'fait' | 'a_verifier' | 'question' | 'idee';

export const LIBELLES_TYPE_ENTREE: Record<TypeEntree, string> = {
  note: 'Note',
  citation: 'Verbatim',
  fait: 'Fait',
  a_verifier: 'À vérifier',
  question: 'Question posée',
  idee: 'Idée',
};

/** Une entrée du journal d'atelier : la conversation, horodatée, typée après coup. */
export type Entree = { id: string; type: TypeEntree; texte: string; horodatage: string; auteur: 'consultante' | 'client' | 'copilote'; questionId?: string };

export type StatutFait = 'declare' | 'observe' | 'verifie';

export const LIBELLES_STATUT_FAIT: Record<StatutFait, string> = {
  declare: 'Déclaré',
  observe: 'Observé',
  verifie: 'Vérifié',
};

export type Fait = { id: string; texte: string; statut: StatutFait; source: string; entreeId?: string };

export type VersionProcessus = 'actuel' | 'cible';

export type Etape = {
  id: string;
  texte: string;
  acteur: string;
  outil?: string;
  dureeMin?: number;
  version: VersionProcessus;
  origine: 'manuel' | 'extraction' | 'demo';
  statut: 'propose' | 'accepte' | 'rejete';
  /** Dans la version cible : étape nouvelle, inchangée ou supprimée par rapport à l'actuel. */
  changement?: 'nouvelle' | 'modifiee' | 'inchangee';
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

export type Niveau = 1 | 2 | 3;

export const LIBELLES_GRAVITE: Record<Niveau, string> = { 1: 'Gênant', 2: 'Coûteux', 3: 'Bloquant' };
export const LIBELLES_FREQUENCE: Record<Niveau, string> = { 1: 'Rare', 2: 'Hebdomadaire', 3: 'Quotidien' };

export type Probleme = {
  id: string;
  texte: string;
  etapeIds: string[];
  gravite: Niveau;
  frequence: Niveau;
  preuves: Preuve[];
  causes: Cause[];
  /** Identifiant d'un problème universel de la bibliothèque, proposé par règles et confirmé par la consultante. */
  universelId?: string;
  universelStatut?: 'propose' | 'confirme';
  entreeId?: string;
};

export type NiveauEffort = 'faible' | 'moyen' | 'fort';

export const LIBELLES_EFFORT: Record<NiveauEffort, string> = { faible: 'Faible', moyen: 'Moyen', fort: 'Fort' };

export type Faisabilite = {
  effort: NiveauEffort;
  coutMensuel: 'nul' | 'faible' | 'moyen' | 'eleve';
  dependances: string[];
  risques: string[];
  prerequis: string[];
  /** Vrai si la solution utilise un outil déjà présent chez le client. */
  outilDejaPresent: boolean;
};

export type Priorite = 'quick_win' | 'a_planifier' | 'a_construire' | 'specialiste';

export const LIBELLES_PRIORITE: Record<Priorite, string> = {
  quick_win: 'Quick win',
  a_planifier: 'À planifier',
  a_construire: 'À construire',
  specialiste: 'Avec un spécialiste',
};

export const LIBELLES_CATEGORIE: Record<CategorieSolution, string> = {
  simplification: 'Simplification sans IA',
  outil_existant: 'Outil déjà présent',
  automatisation: 'Automatisation',
  prestataire: 'Prestataire',
};

export type DecisionSolution = 'a_decider' | 'retenue' | 'plus_tard' | 'ecartee';

export const LIBELLES_DECISION: Record<DecisionSolution, string> = {
  a_decider: 'À décider',
  retenue: 'Retenue',
  plus_tard: 'Plus tard',
  ecartee: 'Écartée',
};

export type Solution = {
  id: string;
  titre: string;
  categorie: CategorieSolution;
  detail: string;
  problemeIds: string[];
  patronId?: string;
  /** Lignes d'explication de la correspondance (règles), lisibles par le client. */
  explication: string[];
  alternativeSansIA?: string;
  outilsCompatibles: string[];
  faisabilite: Faisabilite;
  impact: Niveau;
  priorite: Priorite;
  decision: DecisionSolution;
  responsable?: string;
  echeance?: string;
  origine: 'bibliotheque' | 'manuel' | 'demo';
  necessiteIA: boolean;
};

export type StatutAction = 'a_faire' | 'en_cours' | 'faite' | 'abandonnee';

export const LIBELLES_STATUT_ACTION: Record<StatutAction, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  faite: 'Faite',
  abandonnee: 'Abandonnée',
};

export type Action = { id: string; texte: string; responsable: string; echeance: string; statut: StatutAction; solutionId?: string };

export type Mesure = { id: string; indicateur: string; unite: string; avant?: number; cible?: number; a30?: number; a90?: number; source: string };

export type Decision = { id: string; date: string; texte: string; qui: string };

export type Mission = {
  id: string;
  clientId: string;
  titre: string;
  objectif: string;
  packId: string;
  packVersion: string;
  phase: PhaseMission;
  creeLe: string;
  misAJourLe: string;
  dateAtelier?: string;
  hypotheses: Hypothese[];
  /** Questions de la trame retenues pour cet atelier (identifiants de questions du pack ou du cœur). */
  trame: string[];
  consentementObservation: boolean;
  reponses: Record<string, Reponse>;
  journal: Entree[];
  faits: Fait[];
  etapes: Etape[];
  problemes: Probleme[];
  solutions: Solution[];
  actions: Action[];
  mesures: Mesure[];
  decisions: Decision[];
  syntheseValideeLe?: string;
  fictif: boolean;
};

/* ------------------------------------------------------------------ */
/* Fabriques                                                           */
/* ------------------------------------------------------------------ */

export function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function nouveauClient(nom: string, secteur: string, taille: TailleClient, id?: string): Client {
  return {
    id: id ?? genId(),
    nom,
    secteur,
    taille,
    contexte: '',
    enjeux: [],
    partiesPrenantes: [],
    outils: [],
    documents: [],
    fictif: false,
    creeLe: new Date().toISOString(),
  };
}

export function nouvelleMission(clientId: string, titre: string, packId: string, packVersion: string, trame: string[], id?: string): Mission {
  const now = new Date().toISOString();
  return {
    id: id ?? genId(),
    clientId,
    titre,
    objectif: '',
    packId,
    packVersion,
    phase: 'preparer',
    creeLe: now,
    misAJourLe: now,
    hypotheses: [],
    trame,
    consentementObservation: false,
    reponses: {},
    journal: [],
    faits: [],
    etapes: [],
    problemes: [],
    solutions: [],
    actions: [],
    mesures: [],
    decisions: [],
    fictif: false,
  };
}

/** Avancement d'une mission par phase, en pourcentage, calculé sur ce qui est renseigné. */
export function avancement(m: Mission): Record<PhaseMission, number> {
  const pct = (n: number, d: number) => (d === 0 ? 0 : Math.min(100, Math.round((n / d) * 100)));
  const prep = [m.objectif.trim() !== '', m.hypotheses.length > 0, m.trame.length > 0, m.consentementObservation].filter(Boolean).length;
  const repondues = m.trame.filter((q) => m.reponses[q]?.texte.trim()).length;
  const atelier = pct(repondues + (m.etapes.some((e) => e.version === 'actuel' && e.statut === 'accepte') ? m.trame.length / 2 : 0), m.trame.length * 1.5 || 1);
  const analyse = pct(m.problemes.filter((p) => p.causes.length > 0).length + m.solutions.length, Math.max(1, m.problemes.length * 2));
  const decider = pct(m.solutions.filter((s) => s.decision !== 'a_decider').length + (m.actions.length > 0 ? 1 : 0) + (m.mesures.length > 0 ? 1 : 0), Math.max(1, m.solutions.length + 2));
  const restituer = m.syntheseValideeLe ? 100 : m.etapes.some((e) => e.version === 'cible') ? 50 : 0;
  const suivre = pct(m.mesures.filter((x) => x.a30 !== undefined || x.a90 !== undefined).length + m.actions.filter((a) => a.statut === 'faite').length, Math.max(1, m.mesures.length + m.actions.length));
  return { preparer: pct(prep, 4), atelier, analyser: analyse, decider, restituer, suivre };
}
