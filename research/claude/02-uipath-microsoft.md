# Faits vérifiés — UiPath Automation Hub & Microsoft Process Mining (état au 28 octobre 2026)

## Conditions de collecte (à lire d'abord)

- **Aucune page n'a pu être ouverte directement** : dans cette session, `docs.uipath.com`, `learn.microsoft.com` et `www.uipath.com` ne sont pas résolus (proxy réseau : 403 / DNS). Toutes les informations ci-dessous proviennent des **extraits de pages officielles renvoyés par le moteur de recherche** (WebSearch), recoupés quand plusieurs versions existaient. Je n'ai testé aucun des deux produits.
- Le **quota de recherches web a été atteint** avant de couvrir : les détails 2025 d'UiPath Task Mining (assisté / non assisté), les prérequis officiels du task mining Microsoft (licence, recorder), les annonces Ignite 2024, le tableau exact des quotas d'idées par palier de licence Automation Hub. Ces points sont marqués « non trouvé ».
- Quand une date vient d'un extrait de page docs (« Last updated », date de release note), elle est indiquée ; sinon « non datée ».

---

# 1. UiPath Automation Hub (et écosystème)

## 1.1 Positionnement et fonctionnalités — Vérifié

- **Rôle** : portail de gestion du programme d'automatisation (collecte d'idées, évaluation, pipeline d'implémentation, suivi des bénéfices, magasin d'automatisations). Docs : `docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/...` (pages « latest », plusieurs affichent « Last updated May 6, 2026 »).
- **Collecte d'idées** : soumission par les employés (« employee-driven idea »), par le CoE, par import, ou automatiquement depuis **Task Mining** et **Process Mining**. L'idée exportée depuis Task Mining porte la mention « Idea source : Task Mining » et un lien « Show in Task Mining » ; les exports suivants s'ajoutent en documentation de l'idée d'origine. Prérequis : Automation Hub activé sur le **même tenant** que Task Mining, permission « Submit an employee-driven idea ». (Source : docs Task Mining « Automation Hub integration », copies indexées nov. 2025 et mai 2026 ; l'ancienne page « Sending automation ideas to UiPath Automation Hub » est marquée DEPRECATED.)
- **Évaluation à deux niveaux** : *High Level Assessment* (rapide, à la soumission) puis *Detailed Assessment* (par le Process Owner). Les deux sont **personnalisables** (ajout/suppression/réordonnancement des questions, type, **poids** de chaque question ; assessments différents par catégorie ; « mass update » pour migrer les idées vers une version d'assessment). Un « Citizen Developer Assessment » et un **« Agentic AI assessment »** existent aussi (page `user-guide/agentic-ai-assessment`, non datée dans l'extrait).
- **Pipeline (phases/statuts par défaut)** : Idea (Awaiting review) → Assessment → Qualification (Awaiting Review / On Hold / Approved / Rejected, décidé par le Program Manager) → Implementation (sous-phases Analysis, Solution Design, Development, Testing ; statuts Not Started / In Progress) → (Technical Review pour les automatisations citizen developer) → **Live**. Statuts annexes : Cancelled, On Hold, Delayed, Completed, Archived. Le flux est personnalisable (« Customizing the idea flow » ; « chaque statut doit appartenir à une phase »). (Docs « Automation Phase and Status », « Automation idea review phases ».)
- **Estimation des bénéfices / coûts (Cost Benefit Analysis)** : coûts d'implémentation ponctuels (par phase) + coûts récurrents (licences, infra, maintenance, support, hébergement) saisis par le Program Manager pour la durée de vie de l'automatisation ; « Running cost per year » = somme des coûts récurrents ; « running cost per transaction » = coût annuel / volume annuel. Formules de bénéfice : voir 1.2. (Docs « Performing the idea cost benefit analysis », « Analyzing the average automation cost ».)
- **Automation Store** : catalogue interne ; le bouton **Get** pousse le package dans le *personal workspace* Orchestrator de l'utilisateur et crée le process visible dans **UiPath Assistant** (« instant consumption ») ; sinon bouton **Request**. La version courante se connecte **uniquement à Cloud Orchestrator**. (Docs « Enabling the Store », « Getting and requesting automations », « Setting up for Orchestrator and Assistant ».)
- **Rôles par défaut (non modifiables) + rôles personnalisés** : System Admin, Program Manager (voit/édite les idées, décide de l'implémentation, assigne les équipes), Idea Approver, Process Owner, Citizen Developer Self User / Power User, Technical Reviewer ; « Business Analyst » et « RPA Developer » apparaissent comme rôles de collaborateurs ajoutés sur une idée. (Docs « Roles description and matrix », « Understanding the citizen developer framework ».)
- **Process Repository (nouveau 2026)** : 30 mars 2026 « Controlled GA », entrées liées à des solutions Studio Web, diagramme **BPMN en lecture seule** ; 16 avril 2026 upload de fichiers BPMN rendus en diagramme interactif + interrupteur admin ; 28–29 mai 2026 éditeur BPMN intégré, versioning, commentaires (release notes Maestro mai 2026, GA 29 mai 2026) ; 4 août 2026 panneau « Step Details » (fichiers, liens, applications, risques, contrôles, rôles). (Release notes Automation Hub mars / avril / août 2026.)
- **Autres release notes datées** : 18 mars 2025 (améliorations : e-mail à l'utilisateur qui a déclenché une action du flux d'idées) ; 2 juin 2026 région Corée du Sud ; Automation Suite 2.2510.1 (19 déc. 2025, correctifs sécurité), 2024.10.5 et 2023.10.11 (24 sept. 2025).
- **Disponibilité** : Automation Cloud, Automation Cloud Public Sector, et **Automation Suite** (on-prem/privé) — versions 2021.10 → 2.2510 documentées.

## 1.2 Méthodes de scoring — Vérifié (docs « Information about the detailed assessment algorithm », « Input for High Level Assessment »)

- **High Level Assessment** (clés API, échelle 1–5, toutes obligatoires) : `rules` « How rule-based is your task? » (Very creative=1 → Very rule-based=5) ; `input_type` (très papier=1 → très digital=5) ; `input_quality` (très non structuré=1 → très structuré=5) ; `stability` (changement majeur attendu=1 → aucun changement=5) ; `documentation` (aucune=1, fichiers d'entrée=2, flowcharts=3, SOP=4, instructions détaillées=5). Le nombre total de questions varie selon les sources officielles : « 5 questions à 6 réponses » (page ancienne) vs **« 9 questions »** (FAQ 2024.10 / cloud). Le score global renvoyé immédiatement est décrit comme un « automation score » avec sous-scores readiness/suitability ; **les pondérations en % ne sont pas publiées** dans les extraits.
- **Detailed Assessment** — deux scores :
  - **Automation Potential (%)** : part du processus qu'un robot peut exécuter.
  - **Ease of Implementation (%)** : six facteurs (dont *process stability* et *application stability* → « environment stability » ; les autres facteurs n'apparaissent pas intégralement dans les extraits). Seuils : **Easy 65–100 %, Medium 35–65 %, Difficult 0–35 %**. Disqualifiant : si « Major change expected » est coché pour la stabilité du process ou des applications, l'idée passe automatiquement **On Hold** (version 2021.10 ; à confirmer pour la version courante).
  - Versions 2024.10+ ajoutent un « primary driver » : Cost / Quality / Productivity.
- **Formules de bénéfice** : *Estimated Benefit per Company (hours)* = Automation Potential % × « Total Time Needed to Perform the Work – As-Is (h/an) » ; même logique en devise (× coût employé) et en **FTE**.
- **Champs du Detailed Assessment** (extraits) : fréquence du process, volume d'activité, nombre d'employés / utilisateurs, stabilité de l'environnement et changements attendus sur 6 mois, temps moyen, coût complet moyen par employé, taux d'erreur, revue/audit. Tous obligatoires **sauf** « Average Employee Full Cost », « Error Rate » et les questions Review/Audit. Les volumes peuvent être déclarés « pour l'entreprise » ou « par employé ».
- **Task mining UiPath (méthode)** : enregistrement d'écran côté poste ; **masquage PII côté serveur** (détection via Azure Cognitive Services : noms, IP, identifiants nationaux…), captures d'origine non conservées ; options (mars 2024, Assisted Task Mining) de masquage des données identifiantes dans captures et titres d'étapes et de remplacement des noms/avatars ; dialogue de consentement au démarrage ; curation possible avant envoi au cloud ; **traitement des données de santé et de cartes bancaires expressément interdit**. (Docs Task Mining « Protection of personal data », release notes mars 2024.)

## 1.3 Modèle de données et API — Vérifié

- Objets : *Automation idea* (profil avec About, Documentation, Cost Benefit Analysis, collaborateurs), *Assessment* versionné, *Automation* (Store), *Process* (Process Repository, BPMN), *Cost setup* (coûts ponctuels/récurrents), *Categories*, *Applications*.
- **Open API** (Swagger + Postman) : base `https://cloud.uipath.com/{org}/{tenant}/automationhub_/api/v1/openapi`, authentification par app key + token générés dans l'UI. Endpoints cités : `GET /automations`, `GET /automations/collaborators`, `GET /idea-schema` puis `POST /idea-from-schema` (flux recommandé quand les assessments sont personnalisés) ; `POST /automationidea` (legacy, uniquement sans personnalisation). Intégration **Power BI** documentée (tutoriel vidéo). Un endpoint « cost benefit » n'est pas nommé dans les extraits (**non confirmé**).

## 1.4 Ergonomie — Vérifié / Incertain

- Cibles : employés contributeurs (formulaire d'idée sans code), Process Owners, Program Manager / CoE, citizen developers. No-code pour la soumission et l'évaluation ; personnalisation par admin.
- Temps de mise en place / courbe d'apprentissage : **aucune donnée officielle trouvée**.
- Autopilot *dans* Automation Hub : **non trouvé** dans les release notes 2024–2026 (Autopilot existe pour Process Mining, SQL, Studio, Test, « Autopilot for everyone »).

## 1.5 Limites — Vérifié / Incertain

- Store lié uniquement à **Cloud Orchestrator** ; licence et personal workspace requis.
- Pas d'édition **Community** ; pas d'essai libre en Flex (essais uniquement en Unified Pricing) ; passage à Standard/Enterprise via un commercial.
- Outil conçu pour un **programme d'automatisation d'entreprise** (rôles CoE, pipeline multi-phases) — inadaptation TPE/artisans : **déduction, pas une affirmation officielle**.
- Dépendance plateforme UiPath (tenant Automation Cloud ou Automation Suite).

## 1.6 Innovations 2024–2026 (écosystème) — Vérifié

- **Autopilot for everyone** : GA **21 octobre 2024** (release notes Autopilot 2024.10.7 ; blog release 2024.10). Note 2024.10.16 (29 avril 2026) : modèle par défaut secteur public US passé de Claude Sonnet 4.5 à GPT-4o.
- **Agent Builder** : preview déc. 2024 ; **Maestro** annoncé 16 avril 2025 (BPMN 2.0), lancement « first enterprise-grade platform for agentic automation » **30 avril 2025** (communiqué), Maestro GA (release notes avril 2025) ; **UiPath Agents GA 14 mai 2025** ; « Platform for Agentic Automation » commercialisée **12 juin 2025** (presse japonaise ; date du communiqué anglais non confirmée).
- **FUSION 2025 (30 sept. 2025)** : Maestro Case Management (templates claims/loans/disputes/investigations), Maestro Process Apps, UiPath Agents low-code/conversationnel/pro-code, canvas visuel Agent Builder, partenariat Snowflake ; release **2025.10** : Agent Builder + ScreenPlay + API Workflows unifiés dans Studio.
- **Process Mining 2025** : connexion données PM ↔ données d'automatisation (fév. 2025) ; simulation de process en preview (juil. 2025) ; **Autopilot for Process Mining** et Autopilot for SQL (oct. 2025) ; Autopilot for Business logic, extracteur SQL Server (nov. 2025) ; Process Insights preview (déc. 2025).
- **Communications Mining** : issue du rachat de **Re:infer (1er août 2022)** ; nouveautés 2024–2026 non vérifiées.
- **2026** : Maestro Flow (orchestration developer-first pour coding agents), AgentExchange Salesforce (16 avril 2026) ; **FUSION 2026 (22–25 sept. 2026, Las Vegas)** : Maestro scindé en **Maestro Orchestrate** et **Maestro Automate**, **Cartographer** (« Map of Work », GA 23 sept. 2026), **UiPath for Coding Agents** GA (release notes coding-agents sept. 2026), Delegate, Decision Ledger (roadmap), Automation Suite sur Linux. Aucun prix publié pour Delegate/Coding Agents/Cartographer (recap presse).

## 1.7 Prix — Vérifié : **non publié**

- Docs « Licensing » : Automation Hub inclus en **Unified Pricing** (Basic Trial, Basic, Standard Trial, Standard, Enterprise — lignes « Ideas », « Customized Idea Assessment and Flow », « API Connections », quotas non lisibles dans l'extrait) et en **Flex** (paliers Standard et Advanced, ou SKU autonome « UiPath – Flex – Automation Hub »). Unified Pricing = une seule unité de consommation (Platform Unit) ; Flex = compteurs séparés (Robot Units, AI Units, Agent Units…).
- Chiffres tiers (≈ 420 $/mois « Automation Developer », 4 312 $/an licence Flex, WaTech 2024) : **non officiels, non retenus**.

---

# 2. Microsoft Power Automate Process Mining (héritage Minit)

## 2.1 Positionnement et fonctionnalités — Vérifié

- **Historique** : Process Advisor (task mining) dans Power Automate ; rachat de **Minit annoncé le 31 mars 2022** ; preview Minit-based nov. 2022 ; **GA Power Automate Process Mining 1er août 2023** (annonce Inspire, blog Microsoft). Documentation : `learn.microsoft.com/power-automate/process-advisor-overview` et pages `process-mining-*`.
- **Deux capacités** : *process mining* (event logs de systèmes) et *task mining* (enregistrements d'actions utilisateur sur le poste, via le recorder Power Automate desktop : créer un process → ajouter un enregistrement → Record ; les enregistrements sont analysés dans Process Advisor et produisent une carte de process et des candidats à l'automatisation). Les enregistrements peuvent être édités pour **supprimer des PII** (étapes sensibles, données saisies).
- **Analyse** (app desktop Process Mining + portail web) : carte de process, **Variant DNA** (toutes les variantes, écarts de flux/fréquence/temps), **rework detection**, **root cause analysis** (pourquoi certains cas durent plus ou bouclent), KPI et comparaison de processus, rapports personnalisables, **Power BI** (customisation des rapports : licence Power BI Premium requise). « Custom metrics » cité par Microsoft dans la note Copilot (« filters, custom metrics, categorization variables ») mais pas de page Learn dédiée trouvée.
- **Copilot in Process Mining** : preview annoncée **août 2023** (limitée, US) pour la découverte / l'auto-mapping des attributs d'event log ; « quick insights and recommendations » GA **avril 2024** (plan 2024 wave 1) ; **analyse conversationnelle** (créer des vues, forer par chat) — Message Center MC1061019 (23 avril 2025) : GA **23 mai 2025** ; le plan 2025 wave 1 indique GA **1er sept. 2025** (divergence officielle non résolue) ; support cross-geo annoncé (blog).
- **Sources de données** : Text/CSV, **Dataverse**, SQL Server, Azure Data Lake Gen2 / OneLake (fichiers déjà au format event log), connecteurs **Power Query** (SAP, Salesforce…) avec transformation Power Query optionnelle, templates. **Dataflows non supportés** comme source. Dataverse doit être provisionné dans l'environnement.
- **Action** : connecteur « Process Mining » pour flux (release plan 2025 : « Turn insights into actions with process mining connector for flows », preview juin 2025) ; **export du modèle sémantique vers Fabric** (2025 ; export object-centric vers Fabric preview 31 mai 2026) ; **Insights (preview)** dans la process map de l'Automation Center (plan 2025 wave 2, MC1185821 ; Premium + capacité PM requis).
- **Sécurité** : accès régi par la sécurité d'environnement et les **rôles Dataverse** ; Conditional Access doit couvrir Power Apps **et** Power Automate ; données de diagnostic optionnelles désactivées par défaut.

## 2.2 Méthodes — Vérifié

- Process mining par **event log** ; pas de « score d'opportunité » publié (contrairement à Automation Hub). Task mining : enregistrement d'écran via le recorder desktop, regroupement des actions en carte de process ; pas de formule publiée.

## 2.3 Modèle de données — Vérifié (avec divergence)

- Champs minimaux à mapper : **Case ID** (présent sur tous les événements), **Activity Name**, **Event Start** (timestamp). Les pages produit mentionnent aussi *End Timestamp* tout en précisant « Event logs have only one timestamp » ; les modules de formation retiennent Case ID / Activity / Event Start. Attributs supplémentaires au niveau **event** et **case** mappables. Les données sont ingérées « as is » (toutes les valeurs stockées).
- **Object-centric process mining** : ingestion d'event logs object-centric depuis Azure Data Lake / OneLake, attributs objet et événement ; roadmap : preview **nov. 2025** (14 nov. 2025 selon presse), GA **mai/juin 2026** (MC1268680 : 1er mai 2026 ; roadmap : juin 2026) ; **Process Intelligence Experience** preview 30 juin 2026 ; **Process Intelligence Studio** (KPI personnalisés, Fabric natif) preview sept. 2026 / GA oct. 2026 (release plan 2026 wave 1 indique août/sept. 2026).
- **API / agents** : connecteur Process Mining (actions, triggers, « Throttling Limits » non lisibles) ; **Process Mining MCP server (preview)** exposant les analyses aux agents ; tutoriel « Process Analyst » agent dans **Copilot Studio** (documentation prerelease ; prérequis : connexion PM, rôle contributor/viewer, Environment Maker, licence PM active ; connecteur « Premium »). Dates de publication des pages Learn **non trouvées**.

## 2.4 Ergonomie — Vérifié

- Cibles : analystes métier / CoE / admins Power Platform ; Microsoft dit explicitement que sans Copilot « il faut des connaissances techniques et produit » (filtres, métriques, variables) et que Copilot vise les non-techniciens (ex. analystes financiers). Mise en place : dans le tenant M365/Power Platform existant ; temps de déploiement : **non publié**.

## 2.5 Limites — Vérifié

- **Capacité** : essai **100 MB par process** ; chaque licence **Premium = +50 MB** dans un pool tenant plafonné à **100 GB** ; au-delà, **add-on Process Mining** (licence tenant, requiert Premium ; ajoute capacité PM, base et fichiers Dataverse). Pas de limite officielle en nombre d'événements trouvée.
- **Dépendances** : Dataverse provisionné, environnement Power Platform, Microsoft 365/Entra ; Power BI Premium pour personnaliser les rapports ; Copilot GA d'abord US puis autres régions.
- **Privacy task mining** : enregistrements d'écran stockés dans Dataverse, édition manuelle des PII ; **pas de page Learn dédiée** trouvée sur la rétention / l'anonymisation automatique.
- **TPE/artisans** : tarification tenant (add-on 5 000 $/mois) et prérequis Power Platform rendent l'offre orientée entreprises — **déduction**.

## 2.6 Innovations 2024–2026 — Vérifié / Incertain

- 2024 : Copilot insights GA (avril 2024).
- 2025 : Copilot conversationnel (mai/sept. 2025), connecteur PM pour flux (juin 2025), export Fabric, Insights dans la process map (wave 2), **agent flows** Copilot Studio GA **mars 2025** (blog Copilot Studio mars 2025 ; Build 2025 a ajouté MCP dans agent flows, connecteurs Graph, approvals), object-centric preview nov. 2025.
- Ignite 2025 : agent evaluations, hosted browsers, Entra Agent IDs (recap tiers ; **pas de source primaire PM**). Ignite 2024 : **non recherché (quota)**.
- 2026 wave 1 (avril–sept. 2026) : object-centric GA, Process Intelligence Studio/Experience, **MCP server**, agents Copilot Studio, connecteur Power Platform.

## 2.7 Prix — Vérifié (page pricing Microsoft + blog GA 2023)

- **Power Automate Premium : 15 $/utilisateur/mois** (inclut process mining, 50 MB de capacité PM par utilisateur).
- **Process Mining add-on : 5 000 $/tenant/mois pour 100 GB** de stockage PM (+ capacité Dataverse ; chiffres Dataverse exacts non confirmés — un tiers cite 2 GB base / 1 TB fichiers).
- Process (par bot) : 150 $/bot/mois (page pricing).

---

# 3. Sources (URL complètes)

**UiPath — docs produit**
- https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/information-about-the-detailed-assessment-algorithm (latest, « Last updated » visible mai 2026)
- https://docs.uipath.com/automation-hub/automation-suite/2024.10/user-guide/information-about-the-detailed-assessment-algorithm (2024.10)
- https://docs.uipath.com/automation-hub/automation-suite/2023.4/api-guide/input-for-high-level-assessment (2023.4)
- https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/faq-share-idea
- https://docs.uipath.com/automation-hub/docs/completing-the-detailed-assessment
- https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/automation-phase-status
- https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/automation-idea-review-phases
- https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/customizing-the-idea-flow
- https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/performing-the-idea-cost-benefit-analysis
- https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/enabling-the-store
- https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/getting-and-requesting-automations
- https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/roles-description-and-matrix
- https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/licensing
- https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/agentic-ai-assessment
- https://docs.uipath.com/automation-hub/automation-cloud/latest/api-guide/introduction-to-automation-hub-api-1
- https://docs.uipath.com/automation-hub/reference
- https://docs.uipath.com/task-mining/automation-cloud/latest/user-guide/automation-hub-integration
- https://docs.uipath.com/task-mining/automation-cloud/latest/release-notes/march-2024 (mars 2024)
- https://docs.uipath.com/task-mining/automation-suite/2023.10/user-guide/protection-of-personal-data-and-privacy-of-the-users
- https://docs.uipath.com/automation-hub/automation-cloud/latest/release-notes/march-2025 (18 mars 2025)
- https://docs.uipath.com/automation-hub/automation-cloud/latest/release-notes/march-2026 (30 mars 2026)
- https://docs.uipath.com/automation-hub/automation-cloud/latest/release-notes/april-2026 (16 avril 2026)
- https://docs.uipath.com/automation-hub/automation-cloud/latest/release-notes/june-2026 (2 juin 2026)
- https://docs.uipath.com/automation-hub/automation-cloud/latest/release-notes/august-2026 (4 août 2026)
- https://docs.uipath.com/maestro/automation-cloud/latest/release-notes/may-2026 (28–29 mai 2026)
- https://docs.uipath.com/automation-hub/automation-suite/2.2510/release-notes/2-2510-1 (19 déc. 2025)
- https://docs.uipath.com/autopilot/other/latest/release-notes/2024-10-7 (21 oct. 2024)
- https://docs.uipath.com/agents/automation-cloud/latest/release-notes/may-2025 (14 mai 2025)
- https://docs.uipath.com/maestro/automation-cloud/latest/release-notes/april-2025
- https://docs.uipath.com/process-mining/automation-cloud/latest/release-notes/2025 (index 2025 ; pages february / august / october / november-2025)
- https://docs.uipath.com/coding-agents/standalone/latest/release-notes/september-2026
- https://docs.uipath.com/overview/other/latest/overview/commercial-licensing-plans

**UiPath — communiqués / blog**
- https://www.uipath.com/newsroom/uipath-acquires-reinfer (1er août 2022)
- https://www.uipath.com/blog/product-and-updates/2024-november-release-overview (2024.10)
- https://www.businesswire.com/news/home/20250430530663/en (30 avril 2025)
- https://www.uipath.com/newsroom/uipath-accelerates-ai-transformation-with-agentic-automation-and-orchestration (30 sept. 2025)
- https://www.uipath.com/blog/product-and-updates/fusion-2025-agentic-ai-biggest-product-announcements (sept./oct. 2025)
- https://www.businesswire.com/news/home/20260416022472/en (16 avril 2026)
- https://www.uipath.com/newsroom/uipath-launches-maestro-flow (2026, jour non lu)
- https://www.uipath.com/blog/product-and-updates/biggest-product-announcements-fusion-2026 (sept. 2026)
- https://www.uipath.com/pricing (prix non publiés)

**Microsoft — docs / plans / annonces**
- https://learn.microsoft.com/en-us/power-automate/process-advisor-overview
- https://learn.microsoft.com/en-us/power-automate/task-mining-overview
- https://learn.microsoft.com/en-us/power-automate/process-advisor-processes
- https://learn.microsoft.com/en-us/power-automate/process-mining-processes-and-data
- https://learn.microsoft.com/en-us/power-automate/process-advisor-security
- https://learn.microsoft.com/en-us/power-automate/process-mining-copilot-in-process-analytics
- https://learn.microsoft.com/en-us/power-automate/process-mining-mcp-create-cps-agent (prerelease)
- https://learn.microsoft.com/en-us/power-automate/process-mining-mcp-server-reference (preview)
- https://learn.microsoft.com/en-us/connectors/processmining
- https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types
- https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/add-ons
- https://learn.microsoft.com/en-us/power-platform/release-plan/2025wave1/power-automate/planned-features
- https://learn.microsoft.com/en-us/power-platform/release-plan/2025wave2/power-automate/enable-process-mining-integration-process-map
- https://learn.microsoft.com/en-us/power-platform/release-plan/2026wave1/power-automate/ (avril–sept. 2026)
- https://learn.microsoft.com/en-us/power-platform/release-plan/2026wave1/power-automate/copilot-power-automate
- https://learn.microsoft.com/en-us/training/modules/transform-load-event-log/load-event-log-data
- https://learn.microsoft.com/en-us/training/modules/process-mining-desktop-app/introduction
- https://powerautomate.microsoft.com/de-de/blog/microsoft-announces-preview-of-new-copilot-capabilities-in-power-automate-process-mining/ (août 2023)
- https://www.microsoft.com/en-us/power-platform/blog/?p=10143 (GA 1er août 2023 + tarifs)
- https://www.microsoft.com/en-us/power-platform/products/power-automate/pricing
- https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/whats-new-in-copilot-studio-march-2025 (agent flows GA)
- Message Center (miroirs officiels) : https://mc.merill.net/message/MC1061019 (23 avril 2025), https://mc.merill.net/message/MC1268680 (object-centric), https://mc.merill.net/message/MC1310402 (export Fabric), https://mc.merill.net/message/MC1391882, https://mc.merill.net/message/RM576765

**Presse datée (secondaire)**
- https://redmondmag.com/articles/2022/03/31/microsoft-buys-process-mining-company-minit.aspx (31 mars 2022)
- https://www.licensingschool.co.uk/licensing-blog/2023/08/03/power-automate-process-mining-is-generally-available/ (3 août 2023)
- https://siliconangle.com/2025/09/30/uipath-expands-agentic-platform-orchestration-development-governance-tools/ (30 sept. 2025)
- https://it.impress.co.jp/articles/-/27988 (12 juin 2025, Japon)
- https://www.accelirate.com/?p=83747 (1er oct. 2026, FUSION 2026)
- https://www.beri.net/article/uipath-fusion-2026-recap-delegate-coding-agents-ga-vs-roadmap-licensing (FUSION 2026, prix non publiés)

**Points à confirmer en follow-up (non couverts faute de quota)** : quotas d'idées par palier Automation Hub ; liste intégrale des 9 questions du High Level Assessment et des 6 facteurs d'Ease of Implementation ; prérequis licence / recorder du task mining Microsoft ; Ignite 2024 ; nouveautés 2024–2026 de Communications Mining et Task Mining UiPath.
