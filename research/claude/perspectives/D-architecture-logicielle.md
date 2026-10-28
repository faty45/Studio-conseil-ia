# Perspective D — L'architecte logicielle : un noyau minimal mais strict

*Studio Conseil IA, conception stratégique (28 octobre 2026). Rien n'est codé. Ce document ne touche pas à Explozill ; il en réutilise le savoir-faire (Next.js, Supabase, PWA). Un fait sourcé renvoie à « Sources » ; le reste est marqué **hypothèse**. Les prix sont des hypothèses chiffrées, pas des devis.*

## Ma thèse en 5 lignes

1. Ni « tout-Celonis » (modèle objet-centré complet, langage de requête) ni « tout-tableur » : un **noyau de huit tables** figé au jour 1, tout le reste en configuration.
2. Le cœur n'est pas la carte de processus mais le **journal d'événements immuable** : il donne gratuitement l'historique des recommandations, l'audit, l'export client, la synchronisation hors ligne et la matière du futur process mining.
3. **Deux schémas Postgres** : `client` (isolé par row-level security, exportable, supprimable) et `commun` (patrons anonymisés, sans aucune clé vers un client). La frontière est dans la base, pas dans une promesse.
4. Les métiers (boulangerie, ARDAN, association…) sont des **fichiers de configuration** : trame, causes types, pondérations, textes. Un nouveau métier ne touche pas au schéma.
5. Avant trois mois : pas de process mining, pas de graphe, pas de BPMN, pas d'agent qui agit. Un seul chemin, deux missions réelles, un rapport qui sort.

## Désaccords explicites avec le brouillon v1

| Point du brouillon v1 | Ce que je pense | Preuve ou hypothèse |
|---|---|---|
| Idée 6 : « graphe de connaissances problème → cause → solution → outil → preuve » | Ce n'est pas un graphe, c'est une table de patrons avec des clés (code PCF, cause type, outil). Les requêtes font 1 à 3 sauts : Postgres (CTE récursives, pgvector pour la similarité) suffit, pas de Neo4j. | Retours convergents : sous ~10 000 nœuds et 3 sauts, Postgres tient ; Neo4j se justifie pour des parcours profonds (S2). Le brouillon dit lui-même que le graphe « ne vaut qu'après 20 à 30 missions ». |
| Idée 2 : journal de bord « au format OCEL 2.0 » | OCEL 2.0 est un **format d'échange**, pas un modèle de stockage. On stocke trois tables (objet, événement, lien qualifié) et on exporte en OCEL 2.0 si un prestataire le demande. | Spécification OCEL 2.0 : trois formats d'export, relations qualifiées (recherche 00, § 3.1). |
| Import CSV « dans trois mois » | Le **modèle d'événement** existe au jour 1 même si l'import arrive plus tard ; sinon le schéma sera tordu quand il arrivera. | Hypothèse : ajouter un journal après coup oblige à réécrire toutes les écritures. |
| « Maintenant » 1 : espace isolé, sans export, suppression ni audit | Une isolation sans **export complet** ni **suppression effective** est un enfermement. Les trois forment un seul contrat, livré ensemble. | RGPD (accès, portabilité, effacement) ; recherche 00 § 3.3. |
| Idée 14 : assistant d'atelier à trois mois ; invites versionnées comme simple parade | **Invites versionnées et journal des appels IA** sont du noyau : sans eux, impossible de dire pourquoi une recommandation a changé. Jour 1. | Hypothèse ; cohérent avec « un chiffre, une source » (brouillon § 7.9). |
| § 7.2 : « hors ligne pendant l'atelier » posé comme règle d'ergonomie | C'est une **décision d'architecture coûteuse**. Je la limite à la **capture** via une file locale d'événements ; pas de résolution de conflits (une seule rédactrice). | Hypothèse ; un journal append-only rend la synchronisation triviale, une base locale miroir non. |
| « Maintenant » 2 : tableau synchronisé téléphone ↔ écran partagé | Temps réel multi-appareils reporté. L'écran partagé est le portable projeté ; le téléphone photographie et dicte. | Hypothèse d'usage (consultante seule, téléphone + portable). |
| Idée 13 : « pseudonymisation + agrégation k ≥ 5 » | D'accord, mais **k compte des espaces clients distincts**, pas des lignes, et ne protège que les chiffres. Un patron est du texte : relecture humaine et zéro identifiant, k n'y fait rien. | Hypothèse (définition du k-anonymat : enregistrements, pas texte libre). |
| « Plus tard » 14 : PM4Py « ou algorithmes maison » | Rien avant trois mois, d'accord ; mais les « algorithmes maison » sont inutiles au début : successions directes et durées médianes sont **deux requêtes SQL**. | Hypothèse technique ; PM4Py en AGPL-3.0 avec offre commerciale séparée (S5). |

## 1. Fonctionnalités oubliées, vues de l'architecture

Presque tout découle du journal.

- **Versionnage des recommandations.** Jamais de modification en place : chaque changement est un événement `recommandation.modifiee` (avant, après, auteur ; si l'auteur est l'IA : invite et modèle). La version courante est une vue.
- **Journal d'audit.** Le même journal, en lecture. Table en insertion seule : le rôle applicatif a `INSERT` et `SELECT`, jamais `UPDATE`/`DELETE`, trigger qui lève une exception par sécurité, chaînage de hachage plus tard (S4).
- **Export complet par client.** Une archive par espace : JSON de toutes les tables du schéma `client` filtrées par `espace_id`, fichiers, rapport. Écrit la première semaine ; sert aussi de test d'isolation (l'export de A ne contient rien de B).
- **Suppression effective.** Suppression physique de l'espace, des fichiers et de sa ligne de provenance dans `commun`. Les patrons déjà promus restent : ils ne contiennent rien d'identifiant, c'est l'objet de la promotion (§ 4). Seul un événement `espace.supprime` sans contenu subsiste dans un journal système.
- **Invites versionnées et évaluées.** Table `invite` (nom, version, texte, modèle cible, hash) ; chaque appel la référence. Un jeu de 10 à 20 cas réels anonymisés par invite, rejoué à chaque changement d'invite ou de modèle, noté par la consultante. Sans lui, changer de fournisseur est un saut dans le vide.
- **Hors ligne.** Capture seulement (§ 5).
- **Import CSV générique.** Une seule porte : fichier → proposition de correspondance (quoi / quand / qui / quel objet) → lignes `evenement` et `objet` avec `source = 'import'`. Mails, caisse, feuille de production sont des variantes de correspondance, pas des modules (§ 3).
- **Webhooks.** Refusés avant trois mois. La recommandation « règle Gmail + résumé hebdo » est une **recette** que le client applique, pas une intégration que nous maintenons. Ils arrivent avec les agents d'exécution, après le journal et le retour arrière.
- **Rôles.** Trois : `consultante` (tout sur ses espaces), `client` (lecture de son espace, réponses, mesures avant/après, boutons fait / plus tard / pas pour moi), `prestataire` (une seule recommandation, par lien à durée limitée). Lignes de `membre`, lues par les politiques RLS via les claims du jeton (S1).

## 2. Un mini modèle objet-centré est-il réaliste pour une TPE ?

Oui, si l'on ne prend d'OCEL 2.0 que l'idée (un événement touche plusieurs objets, le lien est qualifié) et pas l'ambition (attributs évolutifs, relations objet-objet typées, perspectives). Pour une boulangerie, « fournée », « commande », « produit » sont des objets ; « cuisson », « vente » des événements ; une vente touche une commande **et** des produits. Un journal case-centrique (Case ID, Activity, Event Start chez Microsoft — recherche 02 § 2.3) forcerait à choisir entre commande et produit. Trois tables évitent ce choix.

### Schéma minimal (schéma `client`, toutes les tables portent `espace_id`)

| Table | Rôle | Champs clés |
|---|---|---|
| `espace` | Un client | `nom`, `metier` (clé du fichier de configuration), `taille` (1-9, 10-49, 50-249, 250+), `outils_existants` (JSON), `conservation_jusquau` |
| `membre` | Accès | `utilisateur_id`, `role`, `expire_le` |
| `mission` | Une intervention | `statut`, `trame_version`, `ouverte_le`, `cloturee_le` |
| `carte` | Unité de l'atelier ; réponse guidée **et** carte libre sont la même chose | `mission_id`, `type` (etape / douleur / cause / idee / reponse / mesure), `question_id` (nullable), `texte`, `qui` (rôle, pas nom), `outil`, `duree_min`, `douleur_1_5`, `code_pcf`, `cause_type`, `parent_id`, `ordre`, `photo_ref` |
| `recommandation` | Vue courante, reconstruite depuis le journal | `carte_ids[]`, `quoi`, `avec_quel_outil`, `heures`, `euros_par_mois`, `depend_de`, `score` (5 réponses + maintenant / préparer / oublier), `decision_client`, `raison`, `version` |
| `objet` | OCEL : une chose du monde | `type` (fournee / commande / mail…), `attributs` (JSON), `source` (atelier / import / journal_de_bord) |
| `evenement` | OCEL : quelque chose s'est passé | `activite`, `horodatage`, `fin` (nullable), `qui` (rôle), `source`, `fichier_import_id`, `attributs` |
| `evenement_objet` | Lien qualifié | `evenement_id`, `objet_id`, `qualificatif` (entree / sortie / support) |
| `journal` | Immuable | `seq`, `type` (carte.creee, recommandation.modifiee, export.demande, ia.appel…), `acteur`, `horodatage`, `avant`, `apres`, `id_client` (UUID généré sur le téléphone) |

Hors `espace_id` : `invite`, `appel_ia` (invite, modèle, fournisseur, jetons, coût, durée, réponse brute purgée à 30 jours — hypothèse de réglage), `prestataire`. Et le schéma `commun` (§ 4). Les trois niveaux mission → processus → étape tiennent sans table `processus` : un processus est une carte `etape` sans parent.

### Ce que je refuse de modéliser avant trois mois

Relations objet-objet typées et attributs évolutifs ; modèle BPMN stocké ; conformance, variantes, simulation (ce que vendent Celonis, Signavio, ARIS) ; benchmarks inter-clients ; agents agissant chez le client ; multi-consultante ; temps réel multi-appareils ; webhooks. Aucune des deux premières missions n'en a besoin.

## 3. ARDAN et la boulangerie dans le même modèle

Le test du schéma : deux cas très différents y entrent **sans nouvelle table**.

| | ARDAN (veille) | Boulangerie |
|---|---|---|
| `espace.metier` | `dispositif-regional` (lire, trier, rediffuser) | `boulangerie` (le matin, la vente, les commandes) |
| Objets | `mail` (domaine source, sujet haché, catégorie), `destinataire` (liste ou rôle), `diffusion` | `fournee`, `produit`, `commande`, `ticket` |
| Événements | `recu`, `lu`, `trie`, `rediffuse`, `archive` | `petrissage`, `cuisson`, `mise_en_rayon`, `vente`, `invendu` |
| Cartes | Étapes « ouvrir la boîte », « décider », « reformuler » ; douleurs « doublons », « on relit deux fois » | Étapes « peser », « cuire », « servir » ; douleurs « feuille refaite à la main », « on ne sait pas ce qui part » |
| Score | Quotidien, volume élevé, règles stables, données structurées → « faire maintenant » probable | Quotidien, 2 personnes, papier → « préparer » probable |

**Données réelles probables** (hypothèses de terrain, à vérifier à la première visite), toutes ingérées par la même porte CSV :

- **Export de mails (ARDAN).** Google Takeout (mbox) ou CSV Outlook. On n'ingère **pas** le corps : date, domaine de l'expéditeur, hachage du sujet, libellés/dossiers (c'est le « trié »). Le « rediffusé » vient des mails envoyés ou de l'archive de la lettre. Pas de nom de personne physique. Deux requêtes SQL donnent le délai médian réception → rediffusion et la part jamais rediffusée : le « chiffrer le gain » de l'idée 2 sans task mining.
- **Feuille de production.** Papier le plus souvent (hypothèse) : photo en atelier, extraction par l'IA validée ligne par ligne ; ou import CSV si tableur. Résultat : objets `fournee`, événements `petrissage` / `cuisson`.
- **Tickets de caisse.** Rapport de clôture ou CSV des ventes par article et par heure (hypothèse ; dépend de la caisse, notée dans `outils_existants`). Croisé avec les fournées : invendu par produit et par heure, la mesure avant/après de l'idée 12.
- **Journal de bord volontaire.** Trois boutons sur le téléphone → événements `source = 'journal_de_bord'`. Même table.

Ce qui ne rentre pas et qu'on ne force pas : la qualité de ce qu'ARDAN rediffuse, la fatigue du boulanger. Cela va dans les cartes `douleur` avec `douleur_1_5`, indicateur qualitatif assumé (brouillon § 5.1).

## 4. Réutilisation entre métiers

Le schéma `commun` n'a **aucune colonne `espace_id`** et aucun texte non relu. C'est la frontière.

| Table (`commun`) | Champs | Qui lit |
|---|---|---|
| `patron` | `code_pcf`, `cause_type`, `taille_bucket`, `metier_bucket`, `probleme`, `solution` (textes génériques), `outils_compatibles[]`, `heures_bucket`, `euros_bucket`, `resultat_observe`, `embedding` (pgvector), `statut` (candidat / valide / retire), `version` | Tous les espaces ; écriture consultante après validation |
| `patron_provenance` | `patron_id`, `espace_id_hache` (HMAC, secret serveur), `date` | **Service uniquement** : compte k, jamais exposée |
| `taxonomie` | PCF 8.0 d'APQC (13 catégories, identifiants hiérarchiques, 27 février 2026 — recherche 03 § 3) et nos `cause_type` | Tous |

**Pipeline de promotion**, à la clôture d'une mission :

1. La consultante choisit les recommandations avec `decision_client` et, idéalement, une mesure avant/après.
2. Une invite `promotion.v1` réécrit problème et solution sans nom, lieu, produit, montant exact ni date, et remplace les valeurs par des tranches. La sortie est un **candidat**.
3. Liste de contrôle : aucun nom propre, aucun chiffre exact, aucun outil non grand public, aucune citation. La consultante corrige et valide ; événement `patron.promu` dans le journal de l'espace, ligne dans `patron_provenance`.
4. Le patron passe `valide`, visible des autres espaces par clés PCF + cause, puis similarité pgvector.

**Seuil k.** Les textes sont protégés par la relecture, pas par k. Toute **statistique** (« les boulangeries mettent X heures ») exige **≥ 5 espaces distincts** pour la combinaison PCF × cause × métier ; sinon « pas assez de missions comparables ». Amorçage : 20 patrons écrits à la main, provenance vide.

**Où est quoi.** Données brutes et cartes : `client`, RLS, exportable, supprimable. Patrons : `commun`, sans lien vers un client sauf le HMAC réservé au service. Fichiers : stockage Supabase avec préfixe par espace et politiques identiques à la base.

## 5. Une consultante seule : conséquences architecturales

- **Deux appareils, une PWA.** Le téléphone capture (photo, dictée, cartes, boutons du client) ; le portable relit, score, génère. Pas d'application native.
- **Hors ligne = file d'événements locale.** Chaque action écrit un événement dans IndexedDB avec un `id_client` UUID ; l'écran se met à jour depuis la file. Au retour du réseau, la file est rejouée vers `journal` (idempotent). Pas de fusion : une seule rédactrice, le serveur ne modifie rien pendant l'atelier. Lectures hors ligne limitées à la mission ouverte, préchargée.
- **Latence IA.** En atelier, une reformulation doit répondre sous 5 secondes (hypothèse) : petit modèle rapide, invite courte, réponse en flux. Les appels longs (hypothèses de causes, rapport) sont des **travaux asynchrones** : ligne `appel_ia` en `en_cours`, abonnement temps réel, la consultante continue. Jamais d'appel bloquant sur le téléphone ; hors ligne, la carte est marquée « à analyser ».
- **Rapport.** Côté serveur, en tâche de fond : un **Markdown** assemblé depuis les tables, l'IA ne rédige que les liaisons, chaque chiffre porte sa source (saisi / mesuré / estimé IA / base commune). PDF depuis ce Markdown ; rien ne part sans validation (`rapport.envoye`).
- **Un seul chemin.** Mission → Atelier → Cartes → Problèmes → Recommandations → Rapport ; l'administration (métiers, invites, patrons) sur le portable seulement.

## 6. Architecture pour tenir trois mois, puis évoluer

### Modules

| Module | Contenu | Dépend de |
|---|---|---|
| **Noyau** (figé) | `espace`, `membre`, RLS, `journal`, export, suppression, authentification | — |
| **Événements** (figé) | `objet`, `evenement`, `evenement_objet`, import CSV, deux requêtes SQL (successions, durées) | Noyau |
| **Atelier** | Trame par métier, cartes, photo/voix, file hors ligne | Noyau, Événements, Configuration |
| **Diagnostic** | Causes/PCF, score à 5 questions, hypothèses à vérifier | Atelier, Configuration |
| **Recommandations** | Fiche en cinq lignes, coût/risque/dépendance, décision client, avant/après | Diagnostic, Connaissances |
| **Rapport** | Markdown → PDF, relecture, envoi | Recommandations |
| **IA** | Passerelle unique `generer(invite, contexte, espace)`, invites versionnées, journal des appels, évaluation | Noyau |
| **Connaissances communes** | Schéma `commun`, promotion, recherche | Noyau, IA |
| **Configuration** | Fichiers par métier (trame, questions, causes, pondérations, textes), annuaire de prestataires | — |

**Figé** : noyau, événements, isolation (RLS forcée sur toutes les tables de `client`, politiques par opération, colonnes de politique indexées, `(select auth.uid())` — S1), journal. **Configurable** : les fichiers métier, validés par un schéma JSON, versionnés dans Git ; chaque mission enregistre la version de trame utilisée.

### Build ou buy

- **Supabase + Next.js : oui.** Savoir-faire existant ; RLS, stockage, authentification, temps réel inclus ; pgvector est une extension. Deux règles non négociables : (1) **toute requête applicative passe par le jeton de l'utilisateur**, jamais par la clé de service, hors tâches de fond listées (export, promotion, suppression) — un ORM connecté avec un rôle privilégié **contourne la RLS** (S1) ; (2) un **test d'isolation automatique** (A tente de lire B sur chaque table) à chaque déploiement. Région : Union européenne.
- **Notion / Airtable : non pour les données client** (pas de RLS par ligne, pas d'export garanti, pas de journal immuable, deux outils pour la consultante). Acceptable pour rédiger les 20 premiers patrons et l'annuaire avant import : données non personnelles.
- **Process mining : rien.** Deux requêtes SQL. Ensuite, si une mission l'exige, PM4Py **en service séparé** au code publié (l'AGPL-3.0 impose d'offrir le code aux utilisateurs par le réseau ; licence commerciale proposée par l'éditeur — S5). Jamais importé dans l'application.
- **Fournisseurs d'IA interchangeables.** Une passerelle maison d'une centaine de lignes au-dessus du Vercel AI SDK (interface unifiée, fournisseurs Anthropic, Mistral, OpenAI-compatibles — S3) qui impose : invite versionnée, sortie structurée validée par schéma, journal de l'appel, repli sur un second fournisseur. Deux fournisseurs testés sur le jeu d'évaluation avant la première mission, dont un européen pour les clients qui l'exigent (hypothèse).

### Coûts d'exploitation (hypothèses chiffrées)

| Poste | Hypothèse | Source |
|---|---|---|
| Supabase Pro | 25 $/mois par organisation, 10 $ de calcul inclus, 8 Go de base | Guides tiers 2026 (S6), à confirmer sur supabase.com |
| Vercel Pro | ~20 $/mois | **Non vérifié dans cette session** |
| IA par mission | ~30 appels × (8 000 jetons d'entrée + 1 500 de sortie) sur un modèle de classe Sonnet (2 $ / 10 $ par million) ≈ **1 $** ; extraction et classification sur classe Haiku (0,10 $ / 0,50 $) ; cache ≈ 0,1× sur les préfixes stables | Grille Anthropic au 6 oct. 2026 (S7) ; volumes = hypothèse |
| Domaine, mails, PDF | < 15 €/mois | Hypothèse |
| **Total à 20 missions/mois** | **≈ 70 à 120 €/mois** hors temps humain | Hypothèse |

Le poste qui peut déraper est le **stockage de fichiers** (photos, exports de mails) : compression côté client, purge à la fin de la conservation.

## Risques techniques

| Risque | Gravité | Parade |
|---|---|---|
| Politique RLS oubliée sur une table = fuite entre clients | Élevée | Script qui refuse le déploiement si une table de `client` n'a pas RLS forcée ; test d'isolation A/B |
| Clé de service dans le chemin applicatif (ORM, script) | Élevée | Clé réservée aux tâches de fond listées ; revue sur toute occurrence |
| Patron « anonymisé » encore identifiant (petite ville, produit unique) | Élevée | Liste de contrôle humaine, tranches, aucune statistique sous k = 5 espaces |
| Changement de modèle d'IA qui dégrade sans qu'on le voie | Moyenne | Jeu d'évaluation rejoué à chaque changement ; journal des appels |
| File hors ligne perdue (navigateur qui purge IndexedDB) | Moyenne | Synchronisation dès qu'une connexion revient ; compteur « N événements non envoyés » visible |
| PM4Py importé « juste pour tester » | Moyenne | Interdit dans le dépôt ; service séparé ou licence |
| Dépendance Supabase | Moyenne | Tout est du Postgres standard (RLS, triggers, pgvector) : migrable |
| Transcription et extraction photo qui inventent | Moyenne | Toute extraction est un candidat validé ligne par ligne, marqué « estimé IA » jusqu'au rapport |

## Mon MVP priorisé

| # | Item | Effort |
|---|---|---|
| 1 | Noyau : `espace`, `membre`, RLS forcée, test d'isolation, export complet, suppression effective | Moyen |
| 2 | `journal` immuable + `objet`, `evenement`, `evenement_objet`, même si seul l'atelier les alimente | Moyen |
| 3 | Fichier de configuration métier (schéma JSON, trame, 12 questions, causes, pondérations) pour `boulangerie` et `dispositif-regional` | Faible |
| 4 | Atelier : cartes unifiées, photo, dictée, file hors ligne rejouée | Fort |
| 5 | Passerelle IA : invites versionnées, journal des appels, sortie structurée, deux fournisseurs, 10 cas d'évaluation par invite | Moyen |
| 6 | Diagnostic : 20 causes/PCF à la main, score à 5 questions, « 3 hypothèses à vérifier » | Faible |
| 7 | Fiche recommandation en cinq lignes, versionnée par le journal, boutons client avec raison | Faible |
| 8 | Rapport Markdown → PDF, chaque chiffre avec sa source, relecture obligatoire | Moyen |
| 9 | Import CSV générique + deux requêtes SQL ; premiers usages : mails ARDAN, ventes de la boulangerie | Moyen |
| 10 | Schéma `commun` : 20 patrons amorcés, pipeline de promotion, recherche par clés PCF (pgvector seulement si nécessaire) | Moyen |

Les items 1, 2 et 5 passent avant tout écran. Hors MVP, volontairement : temps réel multi-appareils, webhooks, BPMN, process mining, benchmarks, multilingue, agents d'exécution.

## Sources

Documents internes : `brouillon-v1-idees-risques-feuille-de-route.md` ; `recherche/00-analystes-standards-cadre-legal.md` (OCEL 2.0, XES, PM4Py, CNIL) ; `recherche/01-celonis-signavio.md` (PI Graph, modèle objet-centré, SiGNAL) ; `recherche/02-uipath-microsoft.md` (scoring Automation Hub, event log Microsoft) ; `recherche/03-aris-skan-apqc.md` (PCF 8.0, context graph Skan).

Recherches web de cette session (extraits de résultats, pages non lues en entier ; blogs et guides tiers à confirmer sur les documentations officielles) :

- **S1 — RLS multi-tenant** : [Makerkit, Supabase RLS best practices](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices) ; [DEV, Postgres RLS with Supabase multi-tenant](https://dev.to/whoffagents/postgresql-row-level-security-with-supabase-multi-tenant-data-isolation-216l) ; [DEV, Supabase RLS deep dive](https://dev.to/kanta13jp1/supabase-rls-deep-dive-multi-tenant-design-dynamic-policies-and-performance-4adk) ; [Bastion, Supabase security best practices](https://bastion.tech/blog/supabase-security-best-practices).
- **S2 — Postgres vs Neo4j** : [PostgreSQL as a graph database](https://nevrai.pages.dev/blog/postgresql-as-graph-database) ; [DEV, knowledge graph with just PostgreSQL](https://dev.to/micelclaw/4o-building-a-personal-knowledge-graph-with-just-postgresql-no-neo4j-needed-22b2) ; [PuppyGraph, Postgres vs Neo4j](https://www.puppygraph.com/learn/postgres-vs-neo4j) ; [Zilliz, pgvector vs Neo4j](https://zilliz.com/blog/pgvector-vs-neo4j-a-comprehensive-vector-database-comparison).
- **S3 — Abstraction des fournisseurs d'IA** : [Vercel AI SDK, Providers and Models](https://sdk.vercel.ai/docs/foundations/providers-and-models) ; [Strapi, OpenAI SDK vs Vercel AI SDK](https://strapi.io/blog/openai-sdk-vs-vercel-ai-sdk-comparison) ; [OpenMAIC, provider abstraction](https://instagit.com/THU-MAIC/OpenMAIC/openmaic-llm-provider-abstraction-vercel-ai-sdk.md).
- **S4 — Journal immuable Postgres** : [OneUptime, event store design](https://oneuptime.com/blog/post/2026-01-30-event-store-design/view) ; [AppMaster, tamper-evident audit trails (29 août 2025)](https://appmaster.io/blog/tamper-evident-audit-trails-postgresql) ; [eugene-khyst, postgresql-event-sourcing](https://github.com/eugene-khyst/postgresql-event-sourcing).
- **S5 — Licence PM4Py** : [GitHub pm4py (AGPL-3.0, version commerciale séparée)](https://github.com/process-intelligence-solutions/pm4py) ; [PyPI pm4py](https://pypi.org/project/pm4py). Conditions commerciales non lues.
- **S6 — Tarifs Supabase 2026 (tiers)** : [Jetadmin](https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/) ; [Makerkit](https://makerkit.dev/blog/saas/supabase-pricing) ; [Selfhost.dev](https://selfhost.dev/supabase-pricing-explained/). Vercel Pro : non vérifié.
- **S7 — Tarifs API Claude** : grille des modèles de la documentation Anthropic intégrée à l'outil (cache du 6 octobre 2026) : classe Sonnet 2 $ / 10 $ par million de jetons, classe Haiku 0,10 $ / 0,50 $, lectures de cache ≈ 0,1× ; à confirmer sur la page officielle avant tout budget.
