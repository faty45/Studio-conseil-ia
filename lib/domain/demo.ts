import type { Client, Mission } from './types';
import { getPack } from '../packs';
import { prioriser } from '../intelligence/priorisation';
import { patron } from '../bibliotheque';
import type { Solution, Niveau, Priorite } from './types';

/**
 * Données de démonstration : deux missions fictives, complètes, pour montrer la valeur de l'outil sans rien saisir.
 * Tout est inventé : noms, chiffres, situations. Aucun client réel. Les rôles remplacent les noms de personnes.
 */

const T0 = '2026-10-20T09:00:00.000Z';
const T1 = '2026-10-27T09:00:00.000Z';

function sol(
  id: string,
  patronId: string,
  problemeIds: string[],
  gravites: Niveau[],
  frequences: Niveau[],
  outilDejaPresent: boolean,
  outilsCompatibles: string[],
  decision: Solution['decision'],
  extra: Partial<Solution> = {},
): Solution {
  const p = patron(patronId)!;
  const faisabilite = { effort: p.effort, coutMensuel: p.coutMensuel, dependances: [...p.prerequis], risques: [...p.risques], prerequis: [...p.prerequis], outilDejaPresent };
  const prio = prioriser({ categorie: p.categorie, faisabilite, gravites, frequences, necessiteIA: p.necessiteIA, iaConfiguree: false });
  return {
    id,
    titre: p.titre,
    categorie: p.categorie,
    detail: p.detail,
    problemeIds,
    patronId,
    explication: [
      `Répond aux problèmes rattachés (${p.problemesUniversels.join(', ')}).`,
      outilDejaPresent ? `Compatible avec ce que le client a déjà : ${outilsCompatibles.join(', ')}.` : p.outilsRequis.length ? `Demande un outil de type ${p.outilsRequis.join(' ou ')}.` : 'Ne demande aucun outil particulier.',
      ...prio.explication,
    ],
    alternativeSansIA: p.alternativeSansIA,
    outilsCompatibles,
    faisabilite,
    impact: prio.impact,
    priorite: prio.priorite as Priorite,
    decision,
    origine: 'demo',
    necessiteIA: p.necessiteIA,
    ...extra,
  };
}

export const CLIENT_ARDAN: Client = {
  id: 'demo-ardan',
  nom: 'ARDAN (exemple fictif)',
  secteur: 'Dispositif régional d’appui aux PME',
  taille: '10-49',
  contexte:
    'Dispositif porté par une structure consulaire. Une cellule de deux chargées de veille suit l’actualité des aides, appels à projets et évolutions réglementaires utiles aux entreprises accompagnées, et la rediffuse chaque semaine aux conseillers et aux entreprises. Outils et sources réels à relever en atelier : les éléments ci-dessous sont fictifs.',
  enjeux: ['Libérer du temps de tri pour l’accompagnement des entreprises', 'Diffuser plus vite et de façon plus régulière', 'Ne plus dépendre d’une seule personne pour le bulletin'],
  partiesPrenantes: [
    { id: 'pp1', role: 'Chargée de veille A', attentes: 'Moins de tri, plus d’analyse', influence: 'forte' },
    { id: 'pp2', role: 'Chargée de veille B', attentes: 'Un partage clair des sources', influence: 'forte' },
    { id: 'pp3', role: 'Responsable du dispositif', attentes: 'Un bulletin fiable et régulier, sans coût nouveau', influence: 'forte' },
    { id: 'pp4', role: 'Conseillers destinataires', attentes: 'Savoir en une minute ce qui concerne leurs entreprises', influence: 'moyenne' },
  ],
  outils: [
    { id: 'o1', nom: 'Messagerie Outlook (suite Microsoft 365)', categorie: 'messagerie', usage: 'Réception des newsletters et envoi du bulletin', sousExploite: true },
    { id: 'o2', nom: 'Suite bureautique Microsoft 365', categorie: 'bureautique', usage: 'Rédaction du bulletin dans un document', sousExploite: true },
    { id: 'o3', nom: 'Tableur Excel', categorie: 'tableur', usage: 'Liste des sources, rarement ouverte' },
    { id: 'o4', nom: 'Espace partagé SharePoint', categorie: 'stockage', usage: 'Archivage des bulletins' },
  ],
  documents: [
    { id: 'd1', titre: 'Trois derniers bulletins hebdomadaires', type: 'autre', note: 'Format variable selon la rédactrice' },
    { id: 'd2', titre: 'Liste des 32 sources suivies', type: 'export', note: 'Dernière mise à jour il y a plus d’un an (déclaré)' },
  ],
  fictif: true,
  creeLe: T0,
};

export const MISSION_ARDAN: Mission = {
  id: 'demo-ardan-veille',
  clientId: 'demo-ardan',
  titre: 'Automatiser la veille professionnelle',
  objectif: 'Réduire le temps de tri quotidien et fiabiliser la diffusion hebdomadaire, avec les outils déjà en place.',
  packId: 'ardan',
  packVersion: getPack('ardan').version,
  phase: 'decider',
  creeLe: T0,
  misAJourLe: T1,
  dateAtelier: '2026-10-27',
  hypotheses: [
    { id: 'h1', texte: 'Une part des sources suivies ne produit jamais d’information diffusée.', statut: 'confirmee', origine: 'bibliotheque' },
    { id: 'h2', texte: 'Deux personnes lisent parfois les mêmes sources sans le savoir.', statut: 'confirmee', origine: 'bibliotheque' },
    { id: 'h3', texte: 'Le format du bulletin varie selon la personne qui rédige.', statut: 'confirmee', origine: 'bibliotheque' },
    { id: 'h4', texte: 'La diffusion attend une validation qui n’est pas cadrée dans le temps.', statut: 'a_tester', origine: 'bibliotheque' },
    { id: 'h5', texte: 'Les conseillers lisent le bulletin en entier.', statut: 'infirmee', origine: 'consultante' },
  ],
  trame: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'ardan-1', 'ardan-2', 'ardan-3', 'ardan-4'],
  consentementObservation: true,
  reponses: {
    q1: { texte: 'Passer moins de temps à trier et plus de temps à qualifier ce qui compte pour les entreprises ; sortir le bulletin tous les vendredis sans exception.', statut: 'valide' },
    q2: { texte: 'Les newsletters et alertes arrivent dans la boîte mail chaque matin ; le bulletin part le vendredi.', statut: 'observe' },
    q3: { texte: 'Une trentaine de newsletters, les sites de la Région et des chambres, un tableur des sources jamais ouvert, les anciens bulletins sur l’espace partagé.', statut: 'declare' },
    q4: {
      texte: "D'abord chacune ouvre sa messagerie et lit les newsletters, puis on repère ce qui concerne nos entreprises, ensuite on recopie le titre et le lien dans le document du bulletin, puis la responsable relit et demande des modifications, enfin on envoie le bulletin aux conseillers le vendredi.",
      statut: 'observe',
    },
    q5: { texte: 'Les deux chargées de veille lisent et rédigent ; la responsable relit ; l’envoi est fait par la chargée A uniquement.', statut: 'valide' },
    q6: { texte: 'On relit deux fois les mêmes newsletters sans le savoir. Le tri de la boîte mail prend la matinée du lundi. On réécrit le résumé à chaque fois. Parfois le bulletin attend la relecture jusqu’au vendredi midi.', statut: 'observe' },
    q7: { texte: 'Rien ne part sans relecture humaine ; les informations réglementaires doivent citer la source officielle.', statut: 'valide' },
    q8: { texte: 'Le temps de tri par jour et l’heure d’envoi du bulletin chaque vendredi.', statut: 'valide' },
    'ardan-1': { texte: 'Environ trente-deux sources, consultées chaque matin par les deux chargées ; personne ne sait lesquelles servent vraiment.', statut: 'declare' },
    'ardan-2': { texte: 'On va vérifier sur le site officiel avant de reprendre une information réglementaire.', statut: 'declare' },
    'ardan-3': { texte: 'Un bulletin par mail le vendredi aux conseillers, qui le transfèrent parfois aux entreprises ; format libre.', statut: 'observe' },
    'ardan-4': { texte: 'Exemple montré : un appel à projets repéré le mardi, résumé le jeudi, relu le vendredi matin, envoyé le vendredi à 14 h.', statut: 'observe' },
  },
  journal: [
    { id: 'j1', type: 'citation', texte: 'Le lundi matin, je ne fais que trier ma boîte mail.', horodatage: '2026-10-27T09:12:00.000Z', auteur: 'client' },
    { id: 'j2', type: 'note', texte: 'Les deux chargées reçoivent les mêmes newsletters institutionnelles ; aucune répartition écrite des sources.', horodatage: '2026-10-27T09:20:00.000Z', auteur: 'consultante' },
    { id: 'j3', type: 'citation', texte: 'On se rend compte au moment de rédiger qu’on a lu la même chose toutes les deux.', horodatage: '2026-10-27T09:24:00.000Z', auteur: 'client' },
    { id: 'j4', type: 'fait', texte: 'Le tableur des sources existe mais n’a pas été ouvert depuis plus d’un an (déclaré par la chargée A).', horodatage: '2026-10-27T09:31:00.000Z', auteur: 'consultante' },
    { id: 'j5', type: 'a_verifier', texte: 'Le bulletin partirait « toujours » le vendredi ; l’exemple montré est parti à 14 h, deux autres fois après 17 h selon la responsable.', horodatage: '2026-10-27T09:40:00.000Z', auteur: 'consultante' },
    { id: 'j6', type: 'note', texte: 'Résumé réécrit à chaque fois ; pas de gabarit. Les trois derniers bulletins ont trois formats différents.', horodatage: '2026-10-27T09:48:00.000Z', auteur: 'consultante' },
    { id: 'j7', type: 'question', texte: 'Quelle part des informations lues finit dans le bulletin ?', horodatage: '2026-10-27T09:52:00.000Z', auteur: 'copilote' },
    { id: 'j8', type: 'citation', texte: 'Sur tout ce qu’on lit, on garde peut-être une info sur dix.', horodatage: '2026-10-27T09:53:00.000Z', auteur: 'client' },
    { id: 'j9', type: 'idee', texte: 'Règles Outlook pour ranger les newsletters par thème ; la suite Microsoft 365 est déjà payée.', horodatage: '2026-10-27T10:05:00.000Z', auteur: 'consultante' },
    { id: 'j10', type: 'fait', texte: 'La relecture par la responsable n’a pas de délai convenu ; elle se fait « quand il y a un trou ».', horodatage: '2026-10-27T10:15:00.000Z', auteur: 'consultante' },
  ],
  faits: [
    { id: 'f1', texte: 'Les deux chargées de veille lisent les mêmes newsletters institutionnelles.', statut: 'observe', source: 'Boîtes mail montrées en atelier', entreeId: 'j2' },
    { id: 'f2', texte: 'Les trois derniers bulletins ont trois formats différents.', statut: 'verifie', source: 'Documents remis (d1)', entreeId: 'j6' },
    { id: 'f3', texte: 'Le tableur des sources n’a pas été ouvert depuis plus d’un an.', statut: 'declare', source: 'Chargée de veille A', entreeId: 'j4' },
    { id: 'f4', texte: 'L’envoi du vendredi varie entre 14 h et après 17 h selon la disponibilité de la relecture.', statut: 'declare', source: 'Responsable du dispositif', entreeId: 'j5' },
    { id: 'f5', texte: 'Environ une information lue sur dix est reprise dans le bulletin.', statut: 'declare', source: 'Estimation orale, à mesurer sur deux semaines', entreeId: 'j8' },
  ],
  etapes: [
    { id: 'e1', texte: 'Ouvrir la messagerie et lire les newsletters', acteur: 'Chargée de veille A', outil: 'Messagerie', version: 'actuel', origine: 'demo', statut: 'accepte', sources: ['reponse:q4'] },
    { id: 'e2', texte: 'Ouvrir la messagerie et lire les mêmes newsletters', acteur: 'Chargée de veille B', outil: 'Messagerie', version: 'actuel', origine: 'demo', statut: 'accepte', sources: ['j2'] },
    { id: 'e3', texte: 'Repérer ce qui concerne les entreprises accompagnées', acteur: 'Chargée de veille A', version: 'actuel', origine: 'demo', statut: 'accepte', sources: ['reponse:q4'] },
    { id: 'e4', texte: 'Recopier titre et lien dans le document du bulletin, rédiger un résumé', acteur: 'Chargée de veille A', outil: 'Document bureautique', version: 'actuel', origine: 'demo', statut: 'accepte', sources: ['reponse:q4'] },
    { id: 'e5', texte: 'Relire et demander des modifications, sans délai convenu', acteur: 'Responsable du dispositif', version: 'actuel', origine: 'demo', statut: 'accepte', sources: ['j10'] },
    { id: 'e6', texte: 'Envoyer le bulletin aux conseillers le vendredi', acteur: 'Chargée de veille A', outil: 'Messagerie', version: 'actuel', origine: 'demo', statut: 'accepte', sources: ['reponse:q4'] },
    { id: 'c1', texte: 'Les règles de la messagerie rangent les newsletters par thème dans des dossiers', acteur: 'Messagerie (règles)', outil: 'Messagerie', version: 'cible', origine: 'demo', statut: 'accepte', changement: 'nouvelle', sources: ['s-ardan-1'] },
    { id: 'c2', texte: 'Chaque chargée lit uniquement ses sources attribuées', acteur: 'Chargées de veille A et B', outil: 'Messagerie', version: 'cible', origine: 'demo', statut: 'accepte', changement: 'modifiee', sources: ['s-ardan-3'] },
    { id: 'c3', texte: 'Inscrire chaque information retenue dans le tableau partagé « reçu, retenu, diffusé »', acteur: 'Chargées de veille A et B', outil: 'Tableur partagé', version: 'cible', origine: 'demo', statut: 'accepte', changement: 'nouvelle', sources: ['s-ardan-2'] },
    { id: 'c4', texte: 'Remplir le gabarit du bulletin : quoi, pour qui, avant quand, lien', acteur: 'Chargée de veille de permanence', outil: 'Document bureautique', version: 'cible', origine: 'demo', statut: 'accepte', changement: 'modifiee', sources: ['s-ardan-4'] },
    { id: 'c5', texte: 'Relire avant jeudi soir ; passé ce délai, le bulletin part tel quel', acteur: 'Responsable du dispositif', version: 'cible', origine: 'demo', statut: 'accepte', changement: 'modifiee', sources: ['s-ardan-5'] },
    { id: 'c6', texte: 'Envoyer le bulletin le vendredi à 11 h', acteur: 'Chargée de veille de permanence', outil: 'Messagerie', version: 'cible', origine: 'demo', statut: 'accepte', changement: 'modifiee', sources: ['reponse:q4'] },
  ],
  problemes: [
    { id: 'p1', texte: 'Les deux chargées lisent les mêmes newsletters sans le savoir', etapeIds: ['e1', 'e2'], gravite: 2, frequence: 3, preuves: [{ id: 'pr1', type: 'observation', source: 'Boîtes mail comparées en atelier', date: '2026-10-27' }], causes: [{ id: 'k1', texte: 'Aucune répartition écrite des sources', statut: 'validee' }, { id: 'k2', texte: 'Les abonnements ont été faits individuellement au fil du temps', statut: 'hypothese' }], universelId: 'double-traitement', universelStatut: 'confirme', entreeId: 'j3' },
    { id: 'p2', texte: 'Le tri de la boîte mail occupe la matinée du lundi', etapeIds: ['e1', 'e2'], gravite: 2, frequence: 3, preuves: [{ id: 'pr2', type: 'declaration', source: 'Chargée de veille A', date: '2026-10-27' }], causes: [{ id: 'k3', texte: 'Tout arrive dans la même boîte, sans règle de tri', statut: 'validee' }], universelId: 'tri-manuel', universelStatut: 'confirme', entreeId: 'j1' },
    { id: 'p3', texte: 'Le résumé est réécrit à chaque fois, dans un format qui change', etapeIds: ['e4'], gravite: 1, frequence: 3, preuves: [{ id: 'pr3', type: 'document', source: 'Trois derniers bulletins (d1)', date: '2026-10-27' }], causes: [{ id: 'k4', texte: 'Pas de gabarit convenu avec les destinataires', statut: 'validee' }], universelId: 'redaction-repetitive', universelStatut: 'confirme', entreeId: 'j6' },
    { id: 'p4', texte: 'L’envoi dépend d’une relecture sans délai convenu', etapeIds: ['e5', 'e6'], gravite: 2, frequence: 2, preuves: [], causes: [{ id: 'k5', texte: 'La relecture n’a jamais été cadrée dans le temps', statut: 'hypothese' }], universelId: 'attente-validation', universelStatut: 'confirme', entreeId: 'j5' },
    { id: 'p5', texte: 'Personne ne sait quelles sources servent vraiment', etapeIds: ['e3'], gravite: 1, frequence: 2, preuves: [{ id: 'pr5', type: 'declaration', source: 'Les deux chargées', date: '2026-10-27' }], causes: [{ id: 'k6', texte: 'Aucun relevé source → information diffusée', statut: 'validee' }], universelId: 'absence-mesure', universelStatut: 'confirme', entreeId: 'j8' },
  ],
  solutions: [
    sol('s-ardan-1', 'regles-tri-messagerie', ['p2'], [2], [3], true, ['Messagerie Outlook (suite Microsoft 365)'], 'retenue', { responsable: 'Chargée de veille A', echeance: 'Semaine prochaine' }),
    sol('s-ardan-2', 'tableau-unique-partage', ['p1', 'p5'], [2, 1], [3, 2], true, ['Tableur Excel', 'Espace partagé SharePoint'], 'retenue', { responsable: 'Chargée de veille B', echeance: 'Semaine prochaine' }),
    sol('s-ardan-3', 'repartition-sources', ['p1'], [2], [3], false, [], 'retenue', { responsable: 'Responsable du dispositif', echeance: 'Réunion de lundi' }),
    sol('s-ardan-4', 'gabarit-fixe', ['p3'], [1], [3], true, ['Suite bureautique Microsoft 365'], 'retenue', { responsable: 'Chargée de veille A', echeance: 'Prochain bulletin' }),
    sol('s-ardan-5', 'delai-validation-convenu', ['p4'], [2], [2], false, [], 'retenue', { responsable: 'Responsable du dispositif', echeance: 'Réunion de lundi' }),
    sol('s-ardan-6', 'mesure-retention-sources', ['p5'], [1], [2], false, [], 'retenue', { responsable: 'Chargées de veille', echeance: 'Deux semaines de relevé' }),
    sol('s-ardan-7', 'resume-assiste-relu', ['p3'], [1], [3], true, ['Suite bureautique Microsoft 365'], 'plus_tard'),
    sol('s-ardan-8', 'outil-veille-dedie', ['p2'], [2], [3], false, [], 'plus_tard'),
  ],
  actions: [
    { id: 'a1', texte: 'Créer cinq règles de tri Outlook pour les expéditeurs les plus fréquents', responsable: 'Chargée de veille A', echeance: '2026-11-03', statut: 'a_faire', solutionId: 's-ardan-1' },
    { id: 'a2', texte: 'Répartir les 32 sources entre A et B et afficher la liste', responsable: 'Responsable du dispositif', echeance: '2026-11-03', statut: 'a_faire', solutionId: 's-ardan-3' },
    { id: 'a3', texte: 'Ouvrir le tableau partagé « reçu, retenu, diffusé » sur l’espace commun', responsable: 'Chargée de veille B', echeance: '2026-11-05', statut: 'a_faire', solutionId: 's-ardan-2' },
    { id: 'a4', texte: 'Convenir du délai de relecture : jeudi 18 h, sinon envoi tel quel', responsable: 'Responsable du dispositif', echeance: '2026-11-03', statut: 'a_faire', solutionId: 's-ardan-5' },
    { id: 'a5', texte: 'Relever trois jours le temps de tri (avant) puis trois jours après la mise en place', responsable: 'Chargées de veille', echeance: '2026-11-14', statut: 'a_faire' },
  ],
  mesures: [
    { id: 'm1', indicateur: 'Temps de tri par personne et par jour', unite: 'minutes', avant: 75, cible: 30, source: 'Relevé papier sur trois jours (fictif)' },
    { id: 'm2', indicateur: 'Heure d’envoi du bulletin le vendredi', unite: 'heure', avant: 15, cible: 11, source: 'Horodatage des envois (fictif)' },
    { id: 'm3', indicateur: 'Sources suivies', unite: 'nombre', avant: 32, cible: 20, source: 'Liste des sources après élagage' },
  ],
  decisions: [
    { id: 'dec1', date: '2026-10-27', texte: 'Pas d’achat d’outil de veille avant trois mois de pratique avec les outils existants.', qui: 'Responsable du dispositif' },
    { id: 'dec2', date: '2026-10-27', texte: 'Le résumé assisté par IA est reporté : tester d’abord le gabarit fixe.', qui: 'Responsable du dispositif et consultante' },
  ],
  fictif: true,
};

export const CLIENT_BOULANGERIE: Client = {
  id: 'demo-boulangerie',
  nom: 'Boulangerie du Marché (exemple fictif)',
  secteur: 'Boulangerie-pâtisserie artisanale',
  taille: '1-9',
  contexte:
    'Boulangerie de quartier : un boulanger (le patron), une pâtissière, une vendeuse à temps plein, une apprentie. Ouverte six jours sur sept. Commandes de particuliers et de deux restaurants voisins. Tout est fictif : situation inventée pour la démonstration.',
  enjeux: ['Jeter moins le lundi et le mercredi', 'Ne plus oublier de commandes', 'Que la vendeuse ne soit pas la seule à savoir clôturer la caisse'],
  partiesPrenantes: [
    { id: 'pp1', role: 'Patron boulanger', attentes: 'Des solutions qui ne prennent pas de temps le matin', influence: 'forte' },
    { id: 'pp2', role: 'Vendeuse', attentes: 'Arrêter de courir après les commandes prises au téléphone', influence: 'forte' },
    { id: 'pp3', role: 'Pâtissière', attentes: 'Connaître les commandes spéciales la veille', influence: 'moyenne' },
    { id: 'pp4', role: 'Apprentie', attentes: 'Des consignes écrites', influence: 'faible' },
  ],
  outils: [
    { id: 'o1', nom: 'Caisse enregistreuse avec export des ventes', categorie: 'caisse', usage: 'Encaissement ; export jamais ouvert', sousExploite: true },
    { id: 'o2', nom: 'WhatsApp Business de la boutique', categorie: 'messagerie_instantanee', usage: 'Les clients y passent des commandes', sousExploite: true },
    { id: 'o3', nom: 'Cahier à spirale près du four', categorie: 'autre', usage: 'Commandes notées à la main, pas toujours' },
    { id: 'o4', nom: 'Agenda du téléphone du patron', categorie: 'agenda', usage: 'Congés, rendez-vous fournisseurs' },
  ],
  documents: [{ id: 'd1', titre: 'Photos du cahier de commandes de la semaine', type: 'photo', note: 'Prises avec accord, sans nom de client' }],
  fictif: true,
  creeLe: T0,
};

export const MISSION_BOULANGERIE: Mission = {
  id: 'demo-boulangerie-decouverte',
  clientId: 'demo-boulangerie',
  titre: 'Diagnostic : invendus, commandes et clôture',
  objectif: 'Réduire les invendus du lundi et du mercredi, sécuriser la prise de commandes, rendre la clôture de caisse transmissible.',
  packId: 'boulangerie',
  packVersion: getPack('boulangerie').version,
  phase: 'analyser',
  creeLe: T0,
  misAJourLe: T1,
  dateAtelier: '2026-10-26',
  hypotheses: [
    { id: 'h1', texte: 'Les quantités du jour sont décidées de tête, sans regarder les ventes passées.', statut: 'confirmee', origine: 'bibliotheque' },
    { id: 'h2', texte: 'Les commandes arrivent par plusieurs canaux et certaines sont oubliées.', statut: 'confirmee', origine: 'bibliotheque' },
    { id: 'h3', texte: 'Les invendus ne sont ni comptés ni valorisés.', statut: 'confirmee', origine: 'bibliotheque' },
    { id: 'h4', texte: 'Une seule personne sait faire la clôture de caisse.', statut: 'confirmee', origine: 'bibliotheque' },
    { id: 'h5', texte: 'La caisse contient des données jamais exploitées.', statut: 'a_tester', origine: 'bibliotheque' },
  ],
  trame: ['q1', 'q2', 'q4', 'q5', 'q6', 'q8', 'boul-1', 'boul-2', 'boul-3', 'boul-4'],
  consentementObservation: true,
  reponses: {
    q1: { texte: 'Jeter moins, surtout le lundi, et arrêter d’oublier des commandes. Que la vendeuse puisse partir en congé.', statut: 'valide' },
    q2: { texte: 'Le pétrissage commence à 4 h ; les quantités sont décidées la veille au soir « selon le temps qu’il fait et le jour ».', statut: 'declare' },
    q4: {
      texte: "D'abord le boulanger décide les quantités de tête, puis il pétrit et enfourne. Ensuite la vendeuse ouvre à 6 h 30 et prend les commandes au comptoir, par téléphone et sur WhatsApp, puis elle les note sur le cahier quand elle a le temps. Enfin, le soir, elle compte la caisse et jette les invendus.",
      statut: 'observe',
    },
    q5: { texte: 'Le patron au fournil, la pâtissière pour les commandes spéciales, la vendeuse en boutique et à la caisse, l’apprentie en renfort le week-end.', statut: 'valide' },
    q6: { texte: 'Le lundi on jette un tiers des baguettes. Les commandes par téléphone sont parfois oubliées quand il y a du monde. La clôture de caisse, il n’y a que la vendeuse qui sait la faire.', statut: 'observe' },
    q8: { texte: 'Le nombre de baguettes jetées par semaine, et le nombre de commandes manquées par mois.', statut: 'valide' },
    'boul-1': { texte: 'Au comptoir, par téléphone pendant le service, et sur WhatsApp Business le soir. Les restaurants envoient un message la veille.', statut: 'observe' },
    'boul-2': { texte: 'Pas de planning écrit ; les fournisseurs livrent le mardi et le vendredi.', statut: 'declare' },
    'boul-3': { texte: 'Caisse enregistreuse avec export, WhatsApp Business, cahier à spirale, agenda du téléphone.', statut: 'observe' },
    'boul-4': { texte: 'Montré : la vendeuse recopie les commandes WhatsApp sur le cahier le soir, puis les relit au patron le lendemain à 6 h.', statut: 'observe' },
  },
  journal: [
    { id: 'j1', type: 'citation', texte: 'Le lundi, je jette un tiers des baguettes.', horodatage: '2026-10-26T14:05:00.000Z', auteur: 'client' },
    { id: 'j2', type: 'note', texte: 'Quantités décidées la veille au soir « au feeling », aucune trace écrite des ventes des semaines précédentes.', horodatage: '2026-10-26T14:12:00.000Z', auteur: 'consultante' },
    { id: 'j3', type: 'citation', texte: 'Quand il y a la queue, le téléphone sonne et je note la commande dans ma tête.', horodatage: '2026-10-26T14:20:00.000Z', auteur: 'client' },
    { id: 'j4', type: 'fait', texte: 'Deux commandes oubliées le mois dernier (une pièce montée, une commande restaurant), selon la vendeuse.', horodatage: '2026-10-26T14:24:00.000Z', auteur: 'consultante' },
    { id: 'j5', type: 'note', texte: 'Le cahier à spirale est au fournil ; les commandes WhatsApp y sont recopiées le soir seulement.', horodatage: '2026-10-26T14:30:00.000Z', auteur: 'consultante' },
    { id: 'j6', type: 'a_verifier', texte: 'La caisse « ne sait pas exporter » selon le patron ; le manuel indique un export CSV des ventes par heure.', horodatage: '2026-10-26T14:41:00.000Z', auteur: 'consultante' },
    { id: 'j7', type: 'citation', texte: 'Si la vendeuse est malade, c’est moi qui compte la caisse et je mets une heure.', horodatage: '2026-10-26T14:50:00.000Z', auteur: 'client' },
    { id: 'j8', type: 'question', texte: 'Quels produits sont le plus souvent jetés, et quels jours ?', horodatage: '2026-10-26T14:55:00.000Z', auteur: 'copilote' },
    { id: 'j9', type: 'citation', texte: 'Les baguettes le lundi, les viennoiseries le mercredi. Le samedi il en manque.', horodatage: '2026-10-26T14:56:00.000Z', auteur: 'client' },
  ],
  faits: [
    { id: 'f1', texte: 'Les commandes arrivent par trois canaux : comptoir, téléphone, WhatsApp Business.', statut: 'observe', source: 'Observation en boutique', entreeId: 'j3' },
    { id: 'f2', texte: 'Les commandes WhatsApp sont recopiées sur le cahier le soir, puis relues au patron le matin.', statut: 'observe', source: 'Cahier montré (photos d1)', entreeId: 'j5' },
    { id: 'f3', texte: 'Deux commandes oubliées le mois dernier.', statut: 'declare', source: 'Vendeuse', entreeId: 'j4' },
    { id: 'f4', texte: 'Un tiers des baguettes jeté le lundi.', statut: 'declare', source: 'Patron ; à mesurer sur deux semaines', entreeId: 'j1' },
    { id: 'f5', texte: 'La caisse permet un export CSV des ventes par heure.', statut: 'verifie', source: 'Manuel du modèle de caisse consulté', entreeId: 'j6' },
  ],
  etapes: [
    { id: 'e1', texte: 'Décider les quantités de tête la veille au soir', acteur: 'Patron boulanger', version: 'actuel', origine: 'demo', statut: 'accepte', sources: ['reponse:q4'] },
    { id: 'e2', texte: 'Pétrir et enfourner à partir de 4 h', acteur: 'Patron boulanger', outil: 'Four', version: 'actuel', origine: 'demo', statut: 'accepte', sources: ['reponse:q4'] },
    { id: 'e3', texte: 'Prendre les commandes au comptoir, au téléphone et sur WhatsApp', acteur: 'Vendeuse', outil: 'Téléphone, WhatsApp', version: 'actuel', origine: 'demo', statut: 'accepte', sources: ['reponse:q4'] },
    { id: 'e4', texte: 'Recopier les commandes sur le cahier le soir', acteur: 'Vendeuse', outil: 'Cahier', version: 'actuel', origine: 'demo', statut: 'accepte', sources: ['j5'] },
    { id: 'e5', texte: 'Relire les commandes au patron le lendemain à 6 h', acteur: 'Vendeuse', version: 'actuel', origine: 'demo', statut: 'accepte', sources: ['reponse:boul-4'] },
    { id: 'e6', texte: 'Compter la caisse et jeter les invendus', acteur: 'Vendeuse', outil: 'Caisse', version: 'actuel', origine: 'demo', statut: 'accepte', sources: ['reponse:q4'] },
  ],
  problemes: [
    { id: 'p1', texte: 'Un tiers des baguettes jeté le lundi, viennoiseries le mercredi', etapeIds: ['e1', 'e6'], gravite: 3, frequence: 2, preuves: [{ id: 'pr1', type: 'declaration', source: 'Patron', date: '2026-10-26' }], causes: [{ id: 'k1', texte: 'Quantités décidées sans regarder les ventes passées', statut: 'validee' }, { id: 'k2', texte: 'Pas de différence de quantités entre jours de semaine', statut: 'hypothese' }], universelId: 'rebut-gaspillage', universelStatut: 'confirme', entreeId: 'j1' },
    { id: 'p2', texte: 'Commandes par téléphone oubliées pendant le rush', etapeIds: ['e3', 'e4'], gravite: 3, frequence: 2, preuves: [{ id: 'pr2', type: 'declaration', source: 'Vendeuse : deux cas le mois dernier', date: '2026-10-26' }], causes: [{ id: 'k3', texte: 'Trois canaux, un seul support écrit, rempli le soir', statut: 'validee' }], universelId: 'canal-multiple', universelStatut: 'confirme', entreeId: 'j3' },
    { id: 'p3', texte: 'Les commandes WhatsApp sont recopiées à la main sur le cahier', etapeIds: ['e4'], gravite: 1, frequence: 3, preuves: [{ id: 'pr3', type: 'document', source: 'Photos du cahier (d1)', date: '2026-10-26' }], causes: [{ id: 'k4', texte: 'Le cahier est au fournil, le téléphone en boutique', statut: 'validee' }], universelId: 'double-saisie', universelStatut: 'confirme', entreeId: 'j5' },
    { id: 'p4', texte: 'Seule la vendeuse sait clôturer la caisse', etapeIds: ['e6'], gravite: 2, frequence: 1, preuves: [{ id: 'pr4', type: 'declaration', source: 'Patron', date: '2026-10-26' }], causes: [{ id: 'k5', texte: 'Procédure jamais écrite', statut: 'validee' }], universelId: 'dependance-personne', universelStatut: 'confirme', entreeId: 'j7' },
    { id: 'p5', texte: 'Les quantités sont décidées à vue, les ventes de la caisse ne sont jamais regardées', etapeIds: ['e1'], gravite: 2, frequence: 3, preuves: [{ id: 'pr5', type: 'trace', source: 'Export CSV possible, jamais utilisé (manuel)', date: '2026-10-26' }], causes: [{ id: 'k6', texte: 'Le patron pensait que la caisse ne savait pas exporter', statut: 'validee' }], universelId: 'prevision-a-vue', universelStatut: 'confirme', entreeId: 'j2' },
  ],
  solutions: [
    sol('s-boul-1', 'cahier-releve-2-semaines', ['p1', 'p5'], [3, 2], [2, 3], false, [], 'retenue', { responsable: 'Vendeuse', echeance: 'Dès lundi, deux semaines' }),
    sol('s-boul-2', 'canal-unique-commandes', ['p2', 'p3'], [3, 1], [2, 3], false, [], 'retenue', { responsable: 'Vendeuse et patron', echeance: 'Cette semaine' }),
    sol('s-boul-3', 'message-absence-horaire', ['p2'], [3], [2], true, ['WhatsApp Business de la boutique'], 'retenue', { responsable: 'Vendeuse', echeance: 'Cette semaine' }),
    sol('s-boul-4', 'lecture-export-caisse', ['p5'], [2], [3], true, ['Caisse enregistreuse avec export des ventes'], 'a_decider'),
    sol('s-boul-5', 'fiche-poste-photo', ['p4'], [2], [1], false, [], 'a_decider'),
    sol('s-boul-6', 'feuille-production-visible', ['p1', 'p5'], [3, 2], [2, 3], false, [], 'a_decider'),
    sol('s-boul-7', 'don-invendus-partenaire', ['p1'], [3], [2], false, [], 'a_decider'),
    sol('s-boul-8', 'logiciel-production-caisse', ['p1', 'p5'], [3, 2], [2, 3], true, ['Caisse enregistreuse avec export des ventes'], 'a_decider'),
  ],
  actions: [
    { id: 'a1', texte: 'Imprimer la feuille de relevé (fabriqué, vendu, jeté) et la placer près de la caisse', responsable: 'Vendeuse', echeance: '2026-11-02', statut: 'a_faire', solutionId: 's-boul-1' },
    { id: 'a2', texte: 'Déplacer le cahier des commandes en boutique et afficher la règle « toute commande s’écrit dans la minute »', responsable: 'Patron', echeance: '2026-11-02', statut: 'a_faire', solutionId: 's-boul-2' },
    { id: 'a3', texte: 'Activer le message automatique WhatsApp avec l’heure limite de commande', responsable: 'Vendeuse', echeance: '2026-10-31', statut: 'a_faire', solutionId: 's-boul-3' },
  ],
  mesures: [
    { id: 'm1', indicateur: 'Baguettes jetées', unite: 'par semaine', avant: undefined, cible: undefined, source: 'Relevé de deux semaines à venir' },
    { id: 'm2', indicateur: 'Commandes manquées', unite: 'par mois', avant: 2, cible: 0, source: 'Déclaration vendeuse (fictif)' },
  ],
  decisions: [{ id: 'dec1', date: '2026-10-26', texte: 'Aucun logiciel avant deux semaines de relevé : les chiffres feront le cahier des charges.', qui: 'Patron et consultante' }],
  fictif: true,
};

export const DEMO = {
  clients: [CLIENT_ARDAN, CLIENT_BOULANGERIE],
  missions: [MISSION_ARDAN, MISSION_BOULANGERIE],
};
