# Architecture cible — Studio Conseil IA

Version 0.1, 28 octobre 2026. Issue de l'analyse D (`research/claude/perspectives/D-architecture-logicielle.md`), arbitrée avec A, B et C dans `docs/synthese-consolidee.md`. **Rien n'est codé** ; ce document décrit ce qu'on construira si le go/no-go après la mission 2 est positif. Ce qui est chiffré est une hypothèse.

## 1. Principes figés

1. **Deux schémas Postgres** : `client` (isolé par sécurité par ligne, exportable, supprimable) et `commun` (patrons anonymisés, sans aucune clé vers un client).
2. **Un journal d'événements immuable** par espace client : historique des recommandations, audit, export, synchronisation hors ligne et matière du futur process mining.
3. **Les métiers sont des fichiers de configuration** (trame d'atelier, questions, causes types, pondérations du score, textes), validés par un schéma JSON, versionnés ; une mission enregistre la version utilisée.
4. **Une seule passerelle IA** : invite versionnée obligatoire, sortie structurée, journal de chaque appel, deux fournisseurs interchangeables, jeu d'évaluation rejoué à chaque changement.
5. **Trois rôles** : consultante, client (lecture de son espace, réponses, mesures, décisions), prestataire (une recommandation partagée par lien à durée limitée).
6. **Phase 0 sans code** : les mêmes entités existent déjà sous forme de modèles de documents et de colonnes de tableur, pour que la transition soit une transcription, pas une migration.

## 2. Modèle de données minimal (schéma `client`, toutes les tables portent `espace_id`)

| Table | Rôle | Champs clés |
|---|---|---|
| `espace` | Un client = un espace | `id`, `nom`, `metier` (clé du fichier de configuration), `taille` (1-9, 10-49, 50-249, 250+), `outils_existants` (JSON), `cree_le`, `conservation_jusquau` |
| `membre` | Qui accède à quoi | `espace_id`, `utilisateur_id`, `role`, `expire_le` |
| `mission` | Une intervention | `id`, `espace_id`, `statut`, `trame_version`, `ouverte_le`, `cloturee_le`, `temps_passe_min`, `prix`, `cout_ia` |
| `carte` | L'unité de l'atelier : réponse guidée et carte libre sont la même chose | `id`, `mission_id`, `type` (etape / douleur / cause / idee / reponse / mesure), `question_id`, `texte`, `qui` (rôle, jamais un nom), `outil`, `duree_min`, `douleur_1_5`, `cause_type`, `code_pcf` (optionnel), `parent_id`, `ordre`, `photo_ref` |
| `recommandation` | Vue courante reconstruite depuis le journal | `id`, `mission_id`, `carte_ids[]`, `quoi`, `avec_quel_outil`, `heures`, `euros_par_mois`, `depend_de`, `ce_que_je_suppose`, `comment_verifier`, `score` (JSON : 5 réponses, verdict), `decision_client`, `raison`, `version` |
| `objet` | Une chose du monde (fournée, commande, mail, dossier) | `id`, `espace_id`, `type`, `attributs` (JSON), `source` (atelier / import / releve) |
| `evenement` | Quelque chose s'est passé | `id`, `espace_id`, `activite`, `horodatage`, `fin`, `qui` (rôle), `source`, `fichier_import_id`, `attributs` |
| `evenement_objet` | Lien qualifié (inspiré d'OCEL 2.0) | `evenement_id`, `objet_id`, `qualificatif` (entree / sortie / support) |
| `journal` | Immuable, insertion seule | `seq`, `espace_id`, `type` (carte.creee, recommandation.modifiee, export.demande, ia.appel, rapport.envoye…), `acteur`, `horodatage`, `avant`, `apres`, `id_client` (UUID généré sur le téléphone) |

Hors `client`, sans `espace_id` : `invite` (versions des consignes IA), `appel_ia` (invite, modèle, fournisseur, jetons, coût, durée, réponse brute purgée après 30 jours), `prestataire` (annuaire).

**Refusé avant le mois 4** : relations objet-objet typées et attributs évolutifs (OCEL complet), modèle BPMN stocké, conformance, variantes, simulation, benchmarks inter-clients, agents qui agissent dans les outils du client, multi-consultante, temps réel multi-appareils, webhooks.

**Ajouté en phase 2** (analyse A) : `version_processus` (observée, cible, réalisée) et `regle` (contrainte vérifiable sur les événements, à la manière des Process Atoms de Signavio).

## 3. Schéma `commun`

| Table | Champs | Accès |
|---|---|---|
| `patron` | `cause_type`, `etape_type`, `code_pcf` (optionnel), `taille_bucket`, `metier_bucket`, `probleme`, `solution`, `outils_compatibles[]`, `heures_bucket`, `euros_bucket`, `resultat_observe`, `statut` (candidat / valide / retire), `nb_clients`, `version` | Lecture par tous les espaces ; écriture par la consultante après validation |
| `patron_provenance` | `patron_id`, `espace_id_hache` (HMAC avec secret serveur), `date` | Service uniquement ; sert à compter les espaces distincts |
| `taxonomie` | 20 causes maison, 30 recettes, PCF 8.0 chargé en option | Tous |

**Pipeline de promotion** à la clôture : sélection par la consultante → réécriture sans nom, lieu, produit, montant exact ni date (invite dédiée) → liste de contrôle humaine → statut `valide` seulement après deux clients distincts → statistiques seulement à partir de cinq espaces distincts. Le contrat de mission contient la clause de capitalisation qui autorise cette promotion.

## 4. Modules

| Module | Contenu | Statut |
|---|---|---|
| Noyau | espace, membre, RLS forcée, journal, export, suppression, authentification | Figé |
| Événements | objet, evenement, evenement_objet, import CSV avec correspondance de colonnes, deux requêtes SQL (successions directes, durées médianes) | Figé |
| Configuration | Fichiers par métier, annuaire | Configurable |
| Atelier | Trame, cartes, photo, dictée, file hors ligne de capture | Phase 1.8 conditionnelle |
| Diagnostic | Causes, score à 5 questions, trois hypothèses à vérifier | Phase 1 |
| Recommandations | Fiche 7 champs, décision client, suivi avant / après | Phase 1 |
| Rapport | Markdown assemblé depuis les tables, IA pour les liaisons seulement, PDF, relecture | Phase 1 |
| IA | Passerelle unique, invites versionnées, journal, évaluation | Phase 1 |
| Connaissances communes | Schéma commun, promotion, recherche par clés (similarité vectorielle seulement si les clés ne suffisent pas) | Phase 2 |

## 5. Choix techniques proposés

- **Supabase + Next.js (PWA)** : savoir-faire existant, sécurité par ligne, stockage, authentification, temps réel ; région Union européenne. Deux règles non négociables : toute requête applicative passe par le jeton de l'utilisateur (jamais la clé de service hors tâches de fond listées) ; un test d'isolation automatique (l'espace A tente de lire B sur chaque table) tourne à chaque déploiement.
- **Pas de Notion ni d'Airtable pour les données client** (pas d'isolation par ligne, pas de journal immuable). Acceptable en phase 0 pour rédiger les patrons et l'annuaire, qui ne contiennent aucune donnée personnelle.
- **Pas de moteur de process mining** : deux requêtes SQL d'abord ; PM4Py (AGPL-3.0) interdit dans l'application, possible plus tard en service séparé publié ou sous licence commerciale.
- **Passerelle IA** au-dessus d'un SDK multi-fournisseurs ; deux fournisseurs testés avant la première mission codée, dont un européen ; sortie structurée validée par schéma ; repli sur le second fournisseur en cas d'erreur.
- **Hors ligne** : capture seulement (cartes, réponses, photos) via une file locale d'événements rejouée à la reconnexion, idempotente par `id_client` ; pas de résolution de conflits (une seule rédactrice).
- **Rapport** : Markdown assemblé depuis les données, chaque chiffre avec sa source (saisi / relevé / estimé IA / base commune), PDF ensuite, envoi tracé par un événement.

## 6. Coûts d'exploitation (hypothèses, à confirmer sur les pages officielles)

| Poste | Hypothèse |
|---|---|
| Base et stockage (offre Pro) | ≈ 25 $/mois |
| Hébergement de l'application | ≈ 20 $/mois (non vérifié) |
| IA | ≈ 1 $ par mission (30 appels, modèle de classe intermédiaire, cache des préfixes stables) |
| Domaine, mails, PDF | < 15 €/mois |
| **Total à 20 missions par mois** | **≈ 70 à 120 €/mois** hors temps humain |

Le poste qui peut déraper est le stockage de photos et d'exports : compression côté client et purge à la fin de la conservation.

## 7. Risques techniques et parades

| Risque | Parade |
|---|---|
| Politique de sécurité oubliée sur une table | Script qui refuse le déploiement si une table du schéma `client` n'a pas la sécurité forcée ; test A/B d'isolation |
| Clé de service dans le chemin applicatif | Réservée aux tâches de fond (export, promotion, suppression) ; revue de code sur toute occurrence |
| Patron « anonymisé » qui reste identifiant | Liste de contrôle humaine, tranches au lieu de valeurs, seuil de cinq espaces pour toute statistique |
| Changement de modèle d'IA qui dégrade les résultats | Jeu d'évaluation rejoué ; journal des appels avec modèle et version |
| File hors ligne perdue | Synchronisation dès qu'une connexion revient ; indicateur « N événements non envoyés » |
| Transcription ou extraction photo qui invente | Toute extraction est un candidat validé ligne par ligne ; marquage « estimé IA » conservé jusqu'au rapport |
| Dépendance à l'hébergeur de base | Postgres standard (sécurité par ligne, triggers, extensions) : migration possible |

## 8. Correspondance phase 0 → phase 1

| Phase 0 (documents, tableurs) | Phase 1 (base) |
|---|---|
| Un dossier par client | `espace` |
| Ligne du tableur « missions » | `mission` |
| Cartes papier, réponses à la trame | `carte` |
| Feuille de relevé (objet / étape / heure, par rôle) | `objet`, `evenement`, `evenement_objet` |
| Fiche recommandation 7 champs | `recommandation` |
| Journal des appels IA (tableau par mission) | `appel_ia`, `invite` |
| Tableur « patrons » sans colonne client | `commun.patron` |
| Historique du stockage de fichiers | `journal` |
