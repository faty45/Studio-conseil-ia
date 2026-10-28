# Benchmark international — plateformes de process intelligence (état au 28 octobre 2026)

Document de référence pour Studio Conseil IA. Les fiches détaillées et toutes les URL se trouvent dans `research/claude/01` à `04`.

## 0. Comment lire ce document

- **Vérifié** : fait daté, tiré d'une page officielle (documentation, communiqué, release note) ou d'un cabinet d'analyse, tel que renvoyé par le moteur de recherche. Les pages n'ont pas pu être lues en entier depuis cette session (domaines bloqués) : les extraits ont été recoupés quand plusieurs sources existaient.
- **Hypothèse** : déduction raisonnable, non sourcée.
- **Recommandation** : choix proposé pour Studio Conseil IA.
- Aucun des produits cités n'a été testé. Les prix sont donnés seulement quand l'éditeur les publie.

## 1. Tableau comparatif

| Critère | Celonis | SAP Signavio | UiPath Automation Hub | ARIS (Software GmbH) | Skan AI | Microsoft Process Mining | APQC | Startups notables |
|---|---|---|---|---|---|---|---|---|
| **Nature** | Plateforme de process intelligence, socle « Process Intelligence Graph » (objet-centré) | Suite de transformation : modélisation BPMN/DMN, process mining, parcours, gouvernance | Portail de gestion d'un programme d'automatisation (idées, évaluation, pipeline, ROI, store) | Référentiel de processus (EPC/BPMN), simulation, mining, GRC, gouvernance | Task mining par vision par ordinateur, « Context Graph of Work », agents | Process mining et task mining dans Power Automate (héritage Minit) | Référentiel de processus (PCF) et benchmarks | Mimica, Soroco (task mining) ; Apromore (racheté par Salesforce) ; mindzie ; Scribe, Tango, Guidde (documentation par capture) |
| **Cible** | Grands comptes, analystes et métier | Grands comptes, surtout écosystème SAP | Centres d'excellence automatisation | Grandes organisations, GRC | Assurance, santé, finance | Entreprises déjà sous Microsoft 365 / Power Platform | Grandes organisations membres | Grands comptes (mining) ; PME et TPE (documentation par capture) |
| **Données d'entrée** | Objets, événements, relations ; extracteurs SAP, Oracle, Salesforce, ServiceNow ; task mining Windows | Journal d'événements cas-centré (SiGNAL) ; connecteurs SAP, Salesforce, Coupa, Dynamics, ServiceNow | Idées saisies par les employés, exports Task Mining / Process Mining, API | Modèles du référentiel, journaux pour le mining, task mining via ProcessMaker | Captures d'écran et événements d'interface sur chaque poste | Journal (Case ID, Activity, Event Start) ; CSV, Dataverse, SQL, Power Query ; enregistrements desktop | Taxonomie PCF, enquêtes de benchmarking | Enregistrements d'écran ; extensions navigateur |
| **Méthodes clés** | OCPM, conformance, root cause, simulation, PQL, copilotes, orchestration | BPMN/DMN, simulation, Journey Modeler, Process Insights (indicateurs préconstruits), agent de conseil | Évaluation à deux niveaux, scores « Automation Potential » et « Ease of Implementation », analyse coût-bénéfice | Modélisation, simulation, conformance, AI Companion (texte vers modèle) | Observation sans intégration, « neurosymbolic AI », agents | Carte, variantes, rework, root cause, Copilot conversationnel | Classification à 5 niveaux, benchmarks par métrique | Capture puis génération de procédures |
| **Ergonomie** | Views sans code, Studio low-code, PQL pour analystes | BPMN « sans connaissance préalable », Joule, SiGNAL pour analystes | Formulaires sans code, personnalisation par l'administrateur | Essai gratuit ; méthode exigeante (filtres, EPC) | Agent sur chaque poste, résultats agrégés | Dans le tenant existant ; Copilot pour les non-techniciens | Fichiers PDF et Excel | Très simple (extension, quelques minutes) |
| **Prix publics** | Non publiés (page « Free Plan » existe, contenu non lu) | Non publiés | Non publiés | Process Mining Basic gratuit (≤ 1 Go), Advanced « à partir de 1 200 €/mois » | Non publiés | Premium 15 $/utilisateur/mois ; add-on 5 000 $/tenant/mois | PCF gratuit ; adhésions sur devis ; enquêtes jusqu'à 5 000 $ pour non-membres | Scribe, Tango : offres gratuites ; mining : sur devis |
| **Limites pour une TPE** | ERP et volumes, licence OCPM séparée | Orientation SAP, coût jugé élevé par les utilisateurs | Conçu pour un programme d'entreprise ; store lié à Cloud Orchestrator | Complexité, crédits IA, référentiel lourd | Surveillance des postes, devis | Prérequis Power Platform, Dataverse | Générique, benchmarks réservés aux membres | Pas de diagnostic, seulement de la documentation |
| **Innovation 2024-2026** | AgentC (oct. 2024), Orchestration Engine (GA nov. 2025), Data Core, Context Model et rachat d'Ikigai Labs (mai 2026) | Joule GA (fév. 2026), Process Consulting Agent GA (juin 2026), fusion Insights/Intelligence (mai 2026), agent mining | Maestro (avril 2025), Agents GA (mai 2025), Process Repository BPMN (2026), Cartographer (sept. 2026) | Autonomie de l'entité (janv. 2025), AI Companion, ARIS Flows (oct. 2025), Task Mining by ProcessMaker (mars 2025) | ProcessGPT, série C 63 M$ (août 2026), agents | Copilot conversationnel (2025), object-centric GA (2026), serveur MCP (preview) | PCF 8.0 (27 fév. 2026) | Rachat d'Apromore par Salesforce (oct. 2025), Scribe valorisé 1,3 Md$ (nov. 2025) |

## 2. Fiches par éditeur (faits vérifiés, datés)

### 2.1 Celonis

- **Process Intelligence Graph** : couche sémantique « system-agnostic, object-centric », présentée le 14 novembre 2023 ; objets, événements, relations, « perspectives » ; licence spécifique pour l'object-centric. Source : docs.celonis.com, communiqué du 14/11/2023.
- **Studio et Views** : environnement low-code et création de vues sans code ; l'ancien module Analysis n'est plus vendu depuis le 1er août 2025.
- **PQL** : langage de requête « conçu pour les utilisateurs métier », sous-ensemble de SQL.
- **Conformance, root cause, simulation** : comparaison d'un modèle de référence aux flux réels ; analyse des déviations ; simulation à événements discrets.
- **Task Mining** : client Windows, liste d'applications autorisées, pseudonymisation et masquage.
- **AgentC** (23/10/2024) : intégrations Microsoft Copilot Studio, IBM watsonx, Amazon Bedrock, CrewAI. **Orchestration Engine** (Emporix) GA le 04/11/2025. **Data Core** GA le 04/11/2025. **Context Model** et rachat d'**Ikigai Labs** le 12/05/2026.
- **Litige avec SAP** (déposé mars 2025) sur l'accès aux données ERP : illustre la dépendance aux connecteurs.
- **Analystes** : Leader Gartner 2025 et 2026, Forrester Q3 2025, Everest 2025.
- **Prix** : non publiés.

### 2.2 SAP Signavio

- **Modules** : Process Manager (BPMN 2.0, DMN, simulation), Process Intelligence (mining, langage SiGNAL), Process Insights (plus de 90 flux, 200 indicateurs et 160 recommandations préconstruits sur ERP SAP), Journey Modeler, Process Collaboration Hub, Process Governance. Source : signavio.com, SAP Learning.
- **Fusion** Insights + Intelligence en un seul produit (release de mai 2026), avec contenu « SAP-Defined ».
- **IA** : text-to-process (mars 2025), process recommender, Joule GA (février 2026), **Process Consulting Agent** GA (juin 2026, 300 actions par mois incluses), agent mining (Sapphire 2026).
- **Connecteurs** : SAP, Salesforce, Coupa, Dynamics (novembre 2024), ServiceNow ; LeanIX en synchronisation bidirectionnelle.
- **Limites** : prix non publiés ; avis d'utilisateurs sur le coût et l'intégration hors SAP.
- **Analystes** : Leader Gartner 2025 et 2026.

### 2.3 UiPath Automation Hub

- **Collecte d'idées** : par les employés, le centre d'excellence, import, ou automatiquement depuis Task Mining et Process Mining (même tenant).
- **Évaluation à deux niveaux** : *High Level Assessment* (règles, type d'entrée, qualité des données, stabilité, documentation, échelle 1 à 5) puis *Detailed Assessment* avec deux scores : **Automation Potential (%)** et **Ease of Implementation (%)** (Easy 65-100, Medium 35-65, Difficult 0-35). Formule publiée : bénéfice estimé (heures) = potentiel d'automatisation × temps annuel « as-is ».
- **Pipeline** : Idea → Assessment → Qualification → Implementation (Analysis, Solution Design, Development, Testing) → Live ; personnalisable.
- **Coûts** : coûts ponctuels par phase, coûts récurrents, coût par transaction.
- **Process Repository** (2026) : entrées BPMN, éditeur intégré, versioning, commentaires (release notes mars à août 2026).
- **Écosystème** : Autopilot for everyone (21/10/2024), Maestro (avril 2025), Agents GA (14/05/2025), FUSION 2026 : Maestro Orchestrate / Automate, Cartographer (23/09/2026).
- **Prix** : non publiés (Unified Pricing et Flex).

### 2.4 ARIS (Software GmbH)

- **Société** : autonome depuis janvier 2025 (annonce du 07/01/2025 ; entité SAG ARIS GmbH, Sarrebruck) ; Leader Gartner 2025 et 2026, Forrester Q3 2025, premier Gartner MQ « Digital Twin of an Organization » (juillet 2026).
- **Éditions** : Basic (jusqu'à 20 utilisateurs), Advanced, Enterprise ; Process Mining Elements / Advanced / Enterprise ; **Process Mining Basic gratuit** (≤ 1 Go), Advanced à partir de 1 200 €/mois (page tarifs, date non lue).
- **Méthodes** : EPC, BPMN 2.0, ArchiMate, simulation, conformance, Risk & Compliance, ARIS Flows (GA 27/10/2025), Task Mining by ProcessMaker (13/03/2025).
- **IA** : AI Companion (annoncé 10/04/2024, ouvert à tous en SR27), licence séparée avec crédits (ex. 50 crédits pour un texte vers modèle).

### 2.5 Skan AI

- **Société** : fondée en 2018, Menlo Park ; série C de 63 M$ le 12/08/2026 (≈ 120 M$ levés).
- **Produits** : Blueprint, Intelligence, AI Agents ; « Context Graph of Work » ; ProcessGPT (askSkan, Business Process Copilot).
- **Méthode** : logiciel sur chaque poste, captures d'écran, suivi des bascules d'applications ; identifiants remplacés par des jetons ; masquage « irréversible » revendiqué.
- **Analystes** : Niche Player 2024, mention honorable Gartner 2026, « Representative Vendor » du Market Guide Task Mining 2026.
- **Prix** : non publiés.

### 2.6 Microsoft Power Automate Process Mining

- **Historique** : rachat de Minit (31/03/2022), GA le 01/08/2023.
- **Capacités** : carte, Variant DNA, rework, root cause, KPI, Power BI ; task mining par enregistrement desktop ; Copilot (insights avril 2024, conversationnel 2025) ; object-centric (preview nov. 2025, GA 2026) ; serveur MCP et agent « Process Analyst » dans Copilot Studio (preview).
- **Modèle de données** : Case ID, Activity Name, Event Start, attributs cas et événement.
- **Prix** : Premium 15 $/utilisateur/mois (50 Mo de capacité) ; add-on 5 000 $/tenant/mois pour 100 Go.

### 2.7 APQC

- **PCF 8.0** publié le 27/02/2026 (PDF et Excel) ; 13 catégories de niveau 1 ; niveaux Category → Process Group → Process → Activity → Task ; identifiants hiérarchiques (1.1.1.1) et PCF ID à 5 chiffres ; versions sectorielles (banque, biens de consommation, services publics en 8.0 ; d'autres en 7.x).
- **Licence** : « sans frais pour les organisations de tous secteurs et tailles » (document ancien) ; conditions à relire dans le téléchargement 8.0.
- **Benchmarking** : Open Standards Benchmarking, gratuit pour les membres, jusqu'à 5 000 $ par enquête pour les non-membres (grille 2017) ; adhésions organisationnelles sur devis.
- **Outil** : MosaiQ (2016), sans fonction IA trouvée.

### 2.8 Startups et outils innovants

| Acteur | Statut vérifié | Pertinence TPE |
|---|---|---|
| Mimica (task mining, Londres) | Série B 26,2 M$ (septembre 2025), export BPMN vers UiPath | Faible (grands comptes) |
| Soroco Scout (« work graph ») | Leader Everest DII 2026 ; partenariat Apromore (mai 2024) | Faible |
| Apromore | Racheté par Salesforce (accord octobre 2025) pour Agentforce | Faible |
| mindzie | Chatbot IA sur process mining ; Major Contender Everest 2025 | PME outillée |
| ProcessMaker / Workfellow | Rachat le 09/04/2024 ; « ARIS Task Mining by ProcessMaker » | Faible |
| QPR ProcessAnalyzer | Visionary Gartner 2025 et 2026 ; sur Snowflake | Faible |
| Fluxicon Disco | Outil desktop historique, licence perpétuelle | Consultant avec journal existant |
| Process Street, Tallyfy | Checklists et workflows | PME structurée |
| **Scribe** | Série C 75 M$ le 10/11/2025, valorisation 1,3 Md$, offre gratuite | **Forte** : procédure illustrée en minutes |
| **Tango, Guidde, Loom** | Extensions et vidéos de procédures (Guidde série B 50 M$, février 2026) | **Forte** pour documenter et former |
| Caddi (Seattle, 2025), Interloom (Munich, 16,5 M$ en mars 2026) | « Automation by demonstration », extraction du savoir tacite | PME et services, pas artisans |

**Constat vérifié** : aucune startup trouvée ne se présente comme « consultant IA pour artisans ou TPE ».

## 3. Orchestration, agents, graphes de connaissances

| Sujet | Faits vérifiés | Utilité pour Studio Conseil IA |
|---|---|---|
| Camunda 8 | 8.7 (08/04/2025) : orchestration agentique en BPMN ; 8.8 (oct. 2025) : Copilot ; 8.9 (avril 2026) | Moteur de workflow standard si un jour on exécute des processus ; pas pour le diagnostic |
| Pega, Appian | Pega Infinity '25 (24/09/2025), Blueprint gratuit ; Appian Process HQ 25.1 (mars 2025) | Hors cible |
| Orkes / Conductor, Temporal | Orkes série B 60 M$ (avril 2026) ; Temporal série C 146 M$ (31/03/2025) | Moteurs pour développeurs, si besoin d'exécutions durables |
| Protocoles d'agents | MCP (Anthropic, 2024) donné à la Linux Foundation le 09/12/2025 ; A2A (Google, 09/04/2025) donné le 23/06/2025 | Brancher un futur « assistant d'atelier » sur des outils, sans dépendance à un éditeur |
| Gouvernance des agents | OWASP Top 10 Agentic (déc. 2025) « least agency » ; NIST AI 100-2 (mars 2025) ; initiative NIST CAISI (17/02/2026) | Approbation humaine avant toute action à risque, journaux complets |
| Graphes de connaissances | Celonis PI Graph (2023), SAP Business Data Cloud (13/02/2025), event knowledge graphs (TU/e, Neo4j) | Imiter le concept (objets, événements, indicateurs), pas la technologie |
| Standards | OCEL 2.0 (16/10/2023), XES IEEE 1849-2023, PM4Py (AGPL-3.0), BPMN 2.0.2 / DMN 1.5 (août 2024) | Voir `research/claude/00` |

## 4. Marché et analystes (vérifié)

- Gartner, Magic Quadrant **Process Mining Platforms**, 15 avril 2025, 16 éditeurs : Leaders cités Celonis, SAP Signavio, UiPath, ARIS, Apromore, IBM, Pegasystems, MEHRWERK ; Microsoft Challenger ; QPR Visionary.
- Gartner, Magic Quadrant **Process Intelligence Platforms** (catégorie renommée), 5 mai 2026, 13 éditeurs : Leaders annoncés Celonis, SAP Signavio, ARIS, Pegasystems ; QPR Visionary ; Skan mention honorable.
- Gartner (abstract du 12 mai 2026) : les plateformes de process intelligence sont « le système sensoriel et le plan de gouvernance » des opérations autonomes.
- Forrester Wave Process Intelligence Software Q3 2025 : 15 éditeurs, Leaders Celonis, ARIS, iGrafx.
- Everest Group PEAK Matrix Process Mining 2025 : 23 éditeurs ; taille de marché 1,5 à 1,6 Md$ en 2025 (chiffre Everest cité par la presse, à confirmer), Celonis au-delà de 50 % de part.
- Deloitte Global Process Mining Survey 2025 : plus de 120 répondants ; message : aligner le process mining sur les objectifs métier.

## 5. Ce que le benchmark dit pour Studio Conseil IA

**Faits** : tous les acteurs du mining supposent des journaux d'événements issus d'un système d'information ou un agent de capture sur les postes ; aucun ne publie de prix ni d'offre pour les entreprises de moins de 10 salariés ; tous pivotent vers l'alimentation d'agents IA ; la catégorie a été renommée « process intelligence » en 2026.

**Hypothèses** : le créneau « diagnostic léger, observation consentie, recommandations avec les outils existants, prestataires locaux » est libre ; la valeur défendable est la méthode et la base de connaissances inter-missions, pas l'algorithme.

**Recommandations** : copier les concepts (modèle objets-événements simplifié, évaluation à deux niveaux, coût-bénéfice structuré, référentiel versionné, taxonomie PCF) ; refuser les mécaniques (task mining par capture, langage de requête, BPMN imposé au client) ; s'appuyer sur les standards ouverts (OCEL 2.0, BPMN en export seulement) et sur les outils gratuits de documentation (Scribe, Tango) comme compléments, pas comme concurrents.
