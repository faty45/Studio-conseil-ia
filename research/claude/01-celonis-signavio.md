# Celonis vs SAP Signavio — faits vérifiés et sourcés (état au 28 octobre 2026)

## Note de méthode (à lire d'abord)

- **Aucune page n'a pu être lue en intégralité** : dans cette session, `WebFetch` échoue sur tous les domaines externes (docs.celonis.com, celonis.com, signavio.com, news.sap.com, businesswire.com, builtin.com… « ENOTFOUND » = domaines non autorisés dans les réglages réseau de la session). Tout ce qui suit vient des **extraits de résultats de recherche** (WebSearch standard + extended), qui citent les pages officielles. Les citations entre guillemets sont des extraits remontés par la recherche, pas des lectures de page complètes.
- Le **quota de recherches web de la session a été épuisé** avant les dernières vérifications (plan gratuit Celonis, éditions Signavio, Process Networks, release Signavio nov. 2025, Sapphire 2025 détaillé). Ces points sont signalés « non vérifié ».
- Je n'ai testé aucun des deux produits. Rien n'est inventé ; quand une info manque ou n'est pas datée, c'est dit.

---

# 1. CELONIS

## 1.1 Positionnement et modules (Vérifié)

- **Positionnement** : Celonis se présente comme « the global leader in Process Intelligence » (communiqué Business Wire, 12 mai 2026). Le socle est le **Process Intelligence Graph (PI Graph)**, décrit dans la doc officielle comme « the foundational semantic layer of the Celonis Platform », « a system-agnostic, object-centric digital twin of enterprise operations » (docs.celonis.com, page non datée).
- **PI Graph** : lancé à Celosphere 2023, communiqué du **14 novembre 2023** (« system-agnostic, enriched digital twin of the business », exposé via une **Process Intelligence API** ; « builds upon Celonis' Object Centric Process Mining technology »). Couches décrites dans la doc : object-centric data model (objets, événements, relations), couche événements, couche relations entre objets, couche « analytics and intelligence » (process analytics, variant exploration, root-cause, ML, GenAI). Des **« core processes »** préconstruits fournissent object types, event types, relations et « perspectives ». « To access objects and events and the object-centric data model, you'll need a Celonis license that includes object-centric process mining. »
- **Object-Centric Process Mining (OCPM)** : la doc oppose « case-centric » (chaque événement lié à un seul cas) et « object-centric » (événements liés à plusieurs objets métier à la fois, ex. commande → réceptions → facture).
- **Celonis Studio** : « low-code environment for building and sharing process-focused apps and dashboards » ; **Views** = capacité « no-code » de création d'apps (docs Studio). L'ancien module **Analysis** « can no longer be purchased as part of a Celonis Platform license » depuis le **1er août 2025** ; migration vers Studio Views recommandée (docs).
- **Action Flows** : « automation asset for acting on real-time process intelligence » (docs Studio). Les « Tasks » sont désormais recommandées à la place des « Actions » héritées pour l'automatisation déclenchée par l'utilisateur.
- **AgentC** : lancé à Celosphere 2024, communiqué du **23 octobre 2024** (Munich) : « a set of AI agent tools, integrations, and partnerships » ; intégrations Microsoft Copilot Studio, IBM watsonx Orchestrate, Amazon Bedrock Agents, CrewAI ; agents partenaires Rollio et Hypatos ; **AI Assistant Builder** pour créer assistants/copilotes dans Celonis.
- **Orchestration Engine** : acquis auprès du partenaire **Emporix** (Zug, Suisse), annoncé à Celonis:Next le **13 mai 2025** ; **disponible en général (GA)** à Celosphere 2025, communiqué du **4 novembre 2025** : « coordinate AI agents alongside people and systems, as it executes end-to-end processes », « now a core part of the Celonis platform ».
- **Process Copilot** : bêta annoncée avec le PI Graph (nov. 2023) ; **GA le 13 mai 2025**, utilisable dans Slack et Microsoft Teams.
- **Task Mining** : client desktop **Windows** (capture clics/raccourcis via API Windows, liste d'applications autorisée, extension Chrome/Edge optionnelle, pseudonymisation et redaction d'e-mails/SSN/cartes ; données chargées dans une table de Data Pool). **Task Discovery** en « limited availability ». Support Windows 11 GA avec le client 2.18.0 (docs, release notes non datées dans l'extrait).
- **Data Core** : « high-performance data infrastructure », **GA le 4 novembre 2025** ; intégration « zero-copy, bi-directional » avec data lakes (Databricks via Delta Sharing, Azure Data Lake) ; partenariat Databricks annoncé le même jour ; partenariat Microsoft Fabric (zero-copy) annoncé plus tôt en 2025.
- **Annotation Builder** (« no-code GenAI tool for recommending decisions ») : GA le 13 mai 2025. **Solution Suites** (Supply Chain, Finance, Front Office, Sustainability) : 13 mai 2025.
- **Context Model** : lancé le **12 mai 2026** (« real-time digital twin of business operations that gives AI agents the operational context they need »).
- **Process Adherence Manager** : dévoilé à Celosphere 2023 (community.celonis.com).

## 1.2 Méthodes d'analyse

Vérifié (docs officielles, pages non datées) :
- Process mining **case-centric et object-centric** (voir ci-dessus).
- **Conformance checking** : « the conformance checker lets you automatically compare a reference process model with the actual process flows discovered from the data » ; section « Perform root cause analysis » dans la doc du Conformance Checker.
- **Root cause / ML** : « Process AI default analysis » détecte les déviations du chemin le plus fréquent ; « root cause analysis leverages our process intelligence to identify the reasons for the selected deviation ».
- **Benchmarking** : guide Studio « creating benchmarking Views allows you to compare business processes and performance metrics between dimensions, over time, or when considering specific activities » (benchmark interne ; pas de preuve d'un benchmark sectoriel officiel dans mes résultats).
- **Simulation** : « Process Simulation » = simulateur à événements discrets sur le « Digital Twin », avant/après ; GA dans Studio ; nouveau nom « Scenario Simulation » avec conception des changements en langage naturel (date non remontée). Des posts communautaires signalent que la fonction n'est pas visible sur tous les comptes.
- **Task mining** : voir 1.1.

Incertain : import de modèles **BPMN 2.0** comme référence de conformance (non confirmé dans mes extraits) ; pas de « journey modelling » trouvé chez Celonis.

## 1.3 Modèle de données et connecteurs (Vérifié)

- Format : **modèle objet-centré Celonis** (object types, event types, relations, perspectives) ; l'ancien format case-id/activité/horodatage reste le mode « case-centric ».
- **OCEL 2.0** : aucun support natif confirmé par Celonis. Il existe un connecteur communautaire (GitHub « ocel20-celonis-connector », pm4py ≥ 2.7.6 + PyCelonis) listé sur ocel-standard.org comme « Celonis OCDM Connector ».
- **Connecteurs** : « Celonis Native Extractors are pre-built connectors » ; catalogue cité : Oracle EBS, Oracle Fusion Cloud (bêta, sur demande), Salesforce, ServiceNow ; **client d'extraction SAP on-premise** dédié ; « local extractor for SAP ECC and SAP S/4HANA » en limited availability.
- **Stockage** : Data Pools / Data Core ; zero-copy avec Databricks, Azure Data Lake, Microsoft Fabric ; depuis le 10 avril 2026, déploiement possible sur **Oracle Cloud Infrastructure (OCI)**.

## 1.4 Ergonomie (Vérifié)

- **PQL** (Process Query Language) : « designed for business users », « analytical backbone of the platform », « deliberately supports only a subset of SQL operators » (docs) ; l'article scientifique d'origine mentionne plus de 150 opérateurs. L'éditeur PQL des Views offre bibliothèque de référence, suggestions et messages guidés (article CEUR 2024/2025).
- **Cible** : Views no-code pour le métier, Studio low-code pour les builders, PQL pour les analystes ; Process Copilots en langage naturel (Slack/Teams).
- **Apprentissage** : Academic Alliance gratuite (accès gratuit étudiants/enseignants, « 300+ interactive courses », chiffres de 900+ à 1 000+ universités selon la page).
- **Temps de mise en œuvre annoncé** : aucun chiffre officiel trouvé. Un avis PeerSpot cite « three to four weeks » selon le processus (non officiel).

## 1.5 Limites connues

Vérifié (sources datées) :
- **Litige Celonis c. SAP** : plainte déposée en **mars 2025** (tribunal fédéral de San Francisco) alléguant que SAP restreint l'accès des clients à leurs propres données ERP après l'acquisition de Signavio ; **juin 2025** : le juge Chhabria rejette certaines allégations (« tying ») mais laisse poursuivre antitrust, concurrence déloyale et publicité mensongère ; **juin 2025** : SAP « agrees to not interfere with Celonis' data extractor » jusqu'à la fin du litige ; **juillet 2025** : plainte amendée ; SAP a redemandé le rejet, pas de décision trouvée. → illustre la **dépendance à l'accès aux données ERP**.
- Fin de commercialisation d'Analysis (1er août 2025) : migration obligatoire vers Views.
- Licence spécifique requise pour OCPM.
Incertain / avis d'utilisateurs (G2, PeerSpot, non datés précisément) : complexité, « steep learning curve », coût « very expensive », implémentation exigeante ; Task Mining Windows uniquement (macOS non confirmé). **Inadaptation TPE/artisans** : aucune source officielle ; déduction raisonnable à partir du modèle (ERP, Data Pool, licence sur volume) mais à présenter comme opinion.

## 1.6 Innovations 2024–2026 (Vérifié, datées)

- 23/10/2024 : AgentC (Microsoft Copilot Studio, IBM watsonx Orchestrate, Amazon Bedrock, CrewAI).
- 13/05/2025 (Celonis:Next) : Orchestration Engine (Emporix), PI API étendue, Process Copilots GA, Annotation Builder GA, Solution Suites.
- 04/11/2025 (Celosphere 2025, Munich) : Orchestration Engine GA, Data Core GA, PI Graph « multimodal » (plus de types de données, Task Mining renforcé), partenariat Databricks.
- 10/04/2026 : extension du partenariat Oracle (Celonis sur OCI, intégrations Oracle Fusion Cloud).
- 01/05/2026 : partenaire de lancement **Microsoft Agent 365** (private preview ; « Agent Mining » pour mesurer impact/ROI des agents).
- 05/05/2026 : **Leader du Gartner Magic Quadrant for Process Intelligence Platforms** (Celonis affirme être « furthest on Completeness of Vision and highest on Ability to Execute » — formulation vendeur).
- 12/05/2026 : **Context Model** + accord d'acquisition d'**Ikigai Labs** (planification, simulation, prévision ; MIT devient actionnaire ; Devavrat Shah Chief Scientist of Enterprise AI ; montant non divulgué).
- Celosphere 2026 : prévu **1–3 décembre 2026**, Munich (« Come for AI. Leave with RoAI ») ; rien d'annoncé à ce jour.
- Partenariats : ServiceNow et IBM datent de **2021** (pas de mise à jour 2025 trouvée). **Anthropic** : seulement comme fournisseur de modèles via Bedrock. **OpenAI** : rien trouvé.
Incertain : fonction « Relate via » (juin 2026, source allemande boursière uniquement).

## 1.7 Prix

**Non publié.** Modèle décrit par des agrégateurs comme « consumption-based, quote-based by data volume » (non officiel). Une page officielle « Free Plan » existe (celonis.com/solutions/free-plan) mais son contenu n'a pas pu être lu. Accès gratuit vérifié pour l'académique.

## 1.8 URL officielles Celonis
1. https://docs.celonis.com/en/process-intelligence-graph.html — doc, non datée
2. https://www.celonis.com/news/press/celonis-agentc-making-ai-agents-work-for-the-enterprise-with-process-intelligence — 23/10/2024
3. https://www.celonis.com/news/press/celonis-showcases-latest-process-intelligence-and-ai-innovations-at-next-2025 — 13/05/2025
4. https://www.celonis.com/news/press/celonis-unveils-platform-innovations-to-power-the-ai-driven-composable-enterprise — 04/11/2025
5. https://www.celonis.com/news/press/celonis-and-oracle-collaborate-to-power-enterprise-ai-and-accelerate-it-modernization — 10/04/2026
6. https://www.businesswire.com/news/home/20260512279732/en/ (Context Model + Ikigai Labs) — 12/05/2026

---

# 2. SAP SIGNAVIO

## 2.1 Positionnement et modules (Vérifié)

- **Positionnement** : « SAP Signavio Process Transformation Suite », pilier « Business Transformation Management » (BTM) de SAP avec **SAP LeanIX** et **WalkMe** ; décrit par SAP comme « an essential component of the integrated RISE with SAP toolchain ».
- **Modules listés sur signavio.com** : Process Manager, Process Intelligence, Process Insights, Journey Modeler, Process Collaboration Hub, Process Transformation Manager ; Process Governance figure dans la doc SAP Learning et chez les partenaires.
- **Process Manager** : modélisation **BPMN 2.0** « without previous knowledge », simulation d'impact ; **DMN** avec contrôles de complétude/cohérence, dictionnaire, simulation, « test lab » (sap.com, SAP Learning).
- **Process Intelligence** : process mining ; langage **SiGNAL**. **Mai 2026** : « Process Insights and Process Intelligence [merged] into one product named SAP Signavio Process Intelligence », contenu préconstruit avec badge « SAP-Defined » (SAP Community, mai 2026).
- **Process Insights** (approche « Plug and Gain » sur ERP SAP) : « 90 plus process flows, 200 plus process performance indicators, and 160 plus correction recommendations » (SAP Learning) ; benchmark sectoriel sur « Days to Completion » et taux d'automatisation.
- **Journey Modeler** : modélisation tabulaire des parcours, liens vers processus, systèmes IT, unités org., émotions, métriques ; score de complexité « T-shirt size » ; distinct de la « Customer Journey Map » (design-based) de Process Manager.
- **Process Collaboration Hub** : point d'accès unique de l'organisation aux contenus processus ; Joule y guide la navigation.
- **Process Governance** : workflows standardisés à partir des modèles, suivi des évaluations.
- **Joule with SAP Signavio solutions** : **GA en février 2026** (news.sap.com) ; cas informationnels, navigationnels, transactionnels (créer/supprimer des actifs par conversation ; « more than 50 skills » selon la presse japonaise, 03/03/2026 pour le Japon).
- **Process Consulting Agent** : **GA en juin 2026** ; capacités de mining (cycle time, variant exploration) GA avec la release de **septembre 2026** ; « agent-led mining » encore en bêta ; « 300 actions* per tenant workspace included every month » (SAP Community, oct. 2026).
- **Intégration SAP LeanIX** : les processus Signavio deviennent des « business context fact sheets » dans LeanIX ; synchro bidirectionnelle pour les autres éléments mappés ; nécessite un utilisateur technique avec licence API (docs LeanIX).

## 2.2 Méthodes d'analyse

Vérifié :
- Process mining case-centric via SiGNAL ; « Execution Variant analysis » (release **février 2026**) ; **AI-assisted process analyzer** avec text-to-insights / text-to-widget (bêta en mars 2025) ; **process recommender** (août 2024, nouvelle version avril 2025) ; **text-to-process** (BPMN depuis texte, mars 2025, amélioré février 2026) ; documentation IA (résumés, descriptions de tâches, février 2026).
- Simulation BPMN/DMN dans Process Manager ; journey modelling (Journey Modeler) ; benchmarking sectoriel via Process Insights.
- **Agent mining** : à Sapphire 2026, Signavio applique le mining aux agents IA pour vérifier qu'ils suivent le chemin prévu.
- Release **mai 2026** : « Process Networks » et « Process Atoms », fonctions IA visant les non-spécialistes ; « value accelerators » (inventaire, entrepôt, achats, comptabilité des immobilisations).
Incertain : nature exacte des « Process Networks »/« Process Atoms » (approche multi-objets ?) non détaillée dans mes extraits ; « conformance checking » formel contre un modèle BPMN non confirmé explicitement ; « Context Analyzer » (cité mai/juin 2026) sans détail ni licence trouvés ; task mining : rien trouvé chez Signavio.

## 2.3 Modèle de données et connecteurs

Vérifié :
- **SiGNAL** : « SQL-like, a subset of SQL with several extensions for working with nested event log data » ; moteur colonne ; « works with a single table containing nested events » ; lecture seule ; attributs de cas et d'événements, valeurs Null (SAP Learning, arXiv 2023).
- **Connexions** : trois types — « SAP Signavio connectors, SAP BTP connectors, and custom data integration » (SAP Learning) ; connecteur **ServiceNow** documenté dans le user guide ; **Salesforce, Coupa, Microsoft Dynamics** ajoutés dans la release de **novembre 2024** (connecteur Salesforce bâti sur SAP Cloud Integration) ; connecteurs SAP ECC / S/4HANA ; APIs **Ingestion** et **SIGNAL Engine OData** (répertoriées par un connecteur tiers Ballerina, non vérifié sur help.sap.com).
Incertain : connecteur **Oracle** natif (rien trouvé) ; réplication via **SAP Datasphere** (article PEX Network, non daté) ; objet-centré/OCEL (rien trouvé) ; stockage (cloud SAP, détails non lus).

## 2.4 Ergonomie (Vérifié)

- Cible : process owners et métier (BPMN « without previous knowledge », Collaboration Hub, Joule en langage naturel, Process Consulting Agent « one conversation away ») ; analystes pour SiGNAL (compétences SQL utiles).
- No-code/low-code : modélisation et Joule no-code ; SiGNAL = requêtes.
- Temps de mise en œuvre : aucun chiffre officiel SAP trouvé. Un partenaire (Westernacher) parle de bénéfices « within 24 hours » pour Process Insights — marketing, non officiel.
- Apprentissage : avis G2 / Gartner Peer Insights : « significant learning curve », « steeper than expected » ; Gartner Peer Insights : 4,5/5 (259 avis), G2 : 4,4 (47 avis) (dates non précisées).

## 2.5 Limites connues

Vérifié : prix non publié ; SAP ne publie pas de liste de prix (consultants licensing). Avis utilisateurs : coût « disproportionately high », « cost increases fast », hausse de prix après le rachat par SAP (PeerSpot), « integration challenges with non-SAP tools » (G2).
Incertain / à confirmer : éditions (une source tierce indique Process Intelligence et Process Insights réservés à « Enterprise Plus ») ; licence du Process Consulting Agent (« Process Insights and Intelligence package plus a Collaboration Hub license » — un seul extrait, non officiel) ; forte orientation SAP ERP (Process Insights conçu pour le passage à S/4HANA, bundle RISE) ; **inadaptation TPE** : pas de source, déduction à présenter comme telle.

## 2.6 Innovations 2024–2026 (Vérifié, datées)

- 08/2024 : process recommender ; 11/2024 : connecteurs Salesforce/Coupa/Dynamics ; fin 2024 : Joule en Early Adopter Care.
- 03/2025 : text-to-process, Joule, AI-assisted process analyzer (news.sap.com) ; 04/2025 : release avril ; 04/2025 : 3e année Leader MQ Process Mining.
- Sapphire 2025 : « AI-assisted transformation advisor » annoncé pour T4 2025 ; LeanIX AI Agent Hub GA T4 2025 (SAP Allemagne) — livraison non vérifiée.
- 3–5/11/2025 : SAP Transformation Excellence Summit (La Haye) : découverte/suivi d'agents (custom, Joule, tiers), **serveur MCP pour LeanIX** (news.sap.com, nov. 2025). Release novembre 2025 axée « agentic AI » (blog Signavio).
- 02/2026 : Joule GA ; Execution Variant analysis ; IA de modélisation/documentation.
- 05/05/2026 : **Leader du Gartner MQ Process Intelligence Platforms** (4e année consécutive, 16 vendeurs selon SAP Japon).
- 05/2026 (release + Sapphire 2026, Madrid) : fusion Process Insights/Intelligence, Process Networks/Atoms, value accelerators ; Process Modeler redessiné « AI-first » et intégré à « SAP Autonomous Suite » ; « Process Transformation Assistant » ; agent mining ; intégration Joule Studio ↔ Signavio/LeanIX ; LeanIX Enterprise Architecture Assistant (GA prévue juin 2026) ; AI Agent Hub (2 capacités GA sur 6, 4 prévues T3 2026).
- 06/2026 : Process Consulting Agent GA ; 09/2026 : mining dans l'agent GA ; 10/2026 : release octobre de l'agent, « AI Release Highlights Q3 2026 », SAP Connect « autonomous enterprise ».
- Partenariats : écosystème SAP (LeanIX, WalkMe, Joule). Rien trouvé avec Microsoft/ServiceNow/IBM/Anthropic/OpenAI spécifique à Signavio.

## 2.7 Prix
**Non publié.** Estimations tierces divergentes (30–150 k€/an, 150–700 k$/an, 2–3 k$/licence/an) — non officielles, à ne pas citer comme faits.

## 2.8 URL officielles SAP Signavio
1. https://www.signavio.com/products/process-intelligence — page produit, non datée
2. https://news.sap.com/2025/03/sap-signavio-launches-ai-process-modeler-text-to-process/ — 03/2025
3. https://news.sap.com/2025/11/leanix-signavio-walkme-sap-transformation-excellence-summit/ — 11/2025
4. https://news.sap.com/2026/02/process-conversation-joule-sap-signavio-solutions-generally-available/ — 02/2026
5. https://news.sap.com/2026/05/sap-signavio-gartner-magic-quadrant-process-intelligence-platforms/ — 05/2026
6. https://community.sap.com/t5/technology-blog-posts-by-sap/sap-signavio-may-2026-release-unlock-next-gen-process-intelligence-with-the/ba-p/14400741 — 05/2026
7. https://community.sap.com/t5/technology-blog-posts-by-sap/the-process-consulting-agent-is-generally-available-get-started-now/ba-p/14446484 — 06/2026

---

# Liste complète des sources utilisées

**Celonis (officielles)**
- https://docs.celonis.com/en/process-intelligence-graph.html
- https://docs.celonis.com/en/object-centric-process-mining-overview.html
- https://docs.celonis.com/en/the-object-centric-data-model.html
- https://docs.celonis.com/en/studio.html ; https://docs.celonis.com/en/pql---process-query-language.html ; https://docs.celonis.com/en/code-editor.html
- https://docs.celonis.com/en/conformance-checker.html ; https://docs.celonis.com/en/process-ai.html ; https://docs.celonis.com/en/guidelines-benchmarking.html
- https://docs.celonis.com/en/task-mining.html ; https://docs.celonis.com/en/task-discovery.html ; https://docs.celonis.com/en/using-the-task-mining-client-software.html
- https://docs.celonis.com/en/connecting-data-sources.html ; https://docs.celonis.com/en/connection-catalog.html ; https://docs.celonis.com/en/local-extractor-for-sap-ecc-and-sap-s-4hana.html
- https://www.celonis.com/fr/news/press/celonis-pioneers-the-next-generation-of-process-intelligence-with-the-introduction-of-the-process-intelligence-graph (14/11/2023)
- https://www.celonis.com/news/press/celonis-agentc-making-ai-agents-work-for-the-enterprise-with-process-intelligence (23/10/2024)
- https://www.celonis.com/news/press/celonis-showcases-latest-process-intelligence-and-ai-innovations-at-next-2025 (13/05/2025)
- https://www.celonis.com/news/article/introducing-the-celonis-ai-annotation-builder-unlocking-the-power-of-your-data-with-ai (13/05/2025)
- https://www.celonis.com/news/press/celonis-unveils-platform-innovations-to-power-the-ai-driven-composable-enterprise (04/11/2025)
- https://www.celonis.com/jp/news/press/celonis-partners-with-databricks-to-power-enterprise-ai-that-continuously-improves-business-operations (04/11/2025)
- https://community.celonis.com/product-updates/celosphere-2025-product-highlights-data-core-and-orchestration-engine-5901
- https://www.celonis.com/news/press/celonis-and-oracle-collaborate-to-power-enterprise-ai-and-accelerate-it-modernization (10/04/2026)
- https://www.celonis.com/news/article/scaling-the-agentic-enterprise-with-microsoft-agent-365-and-celonis (01/05/2026)
- https://www.businesswire.com/news/home/20260512279732/en/ (12/05/2026)
- https://www.celonis.com/news/press/legal-update-sap-agrees-to-not-interfere-with-celonis-extractor-in-antitrust-litigation (06/2025)
- https://www.celonis.com/company/our-programs/academic-alliance ; https://www.celonis.com/solutions/free-plan
- https://www.celonis.com/celosphere-live/agenda (Celosphere 2026)
- https://community.celonis.com/product-updates/new-feature-celonis-process-simulation-in-pycelonis-3628

**Celonis (presse / tiers)**
- https://siliconangle.com/2025/11/04/celonis-feeds-ai-agents-process-intelligence-data-enhance-operational-context/
- https://diginomica.com/celonis-makes-compelling-case-freeing-process-operationalize-ai-returns
- https://www.forrester.com/blogs/celonis-buys-ikigai-labs-to-provide-the-context-engine-for-enterprisewide-ai-adoption/
- https://www.techzine.eu/news/analytics/141221/celonis-launches-context-model-and-acquires-ikigai-labs/
- https://itbrief.co.uk/story/celonis-teams-with-microsoft-on-ai-agent-oversight (06/05/2026)
- https://www.processexcellencenetwork.com/process-mining/news/celonis-sues-sap-market-exploitation-egregious-conduct ; https://www.processexcellencenetwork.com/process-mining/news/us-court-dismisses-celonis-antitrust-claims-against-sap ; https://www.processexcellencenetwork.com/process-mining/news/celonis-files-updated-complaint-in-sap-antitrust-case
- https://www.gartner.com/doc/7810417 (MQ Process Intelligence Platforms, 05/05/2026)
- https://github.com/Javert899/ocel20-celonis-connector
- https://ceur-ws.org/Vol-3783/paper_332.pdf ; https://arxiv.org/pdf/2304.06811 (SIGNAL)
- https://www.g2.com/products/celonis/reviews ; https://www.peerspot.com/products/celonis-reviews

**SAP Signavio (officielles)**
- https://www.signavio.com/products/process-intelligence ; https://signavio.com/products/journey-modeler
- https://www.sap.com/uk/products/business-transformation-management/signavio-process-manager.html
- https://learning.sap.com/courses/analyzing-business-processes-with-sap-signavio-solutions/introducing-to-signal-in-sap-signavio-process-intelligence
- https://learning.sap.com/courses/analyzing-business-processes-with-sap-signavio-solutions/introduction-to-standalone-connector_ae4eed4d-1875-493f-84b1-63a9665305ad
- https://learning.sap.com/learning-journeys/run-business-processes-with-sap-signavio-solutions/learning-sap-signavio-process-insights_de1f24b8-b1a1-4eb2-8324-768ffe40a778
- https://help.sap.com/doc/f0dde081e98a431991ac4bb26906eb49/CLOUD/en-US/Feature_Scope_Description_SAP_Signavio_Process_Insights.pdf
- https://help.sap.com/doc/674a658cce484391b3b55d2262e2635d/SHIP/en-US/FeatureScopeDescriptionSAPSignavioProcessManager_EN.pdf
- https://docs-eam.leanix.net/docs/technical-signavio
- https://community.sap.com/t5/technology-blog-posts-by-sap/expanding-connectivity-in-sap-signavio-highlights-from-the-november-2024/ba-p/13932783
- https://news.sap.com/2025/03/sap-signavio-launches-ai-process-modeler-text-to-process/
- https://www.signavio.com/post/april-2025-product-release-update/ ; https://www.signavio.com/post/november-2025-product-release-update
- https://www.sap.com/events/sapphire/innovation-guide/business-transformation-management.html (Sapphire 2025)
- https://news.sap.com/2025/11/leanix-signavio-walkme-sap-transformation-excellence-summit/
- https://news.sap.com/2026/02/process-conversation-joule-sap-signavio-solutions-generally-available/
- https://www.signavio.com/post/february-2026-product-release-update/
- https://www.signavio.com/post/may-2026-product-release-update
- https://community.sap.com/t5/technology-blog-posts-by-sap/sap-signavio-may-2026-release-unlock-next-gen-process-intelligence-with-the/ba-p/14400741
- https://community.sap.com/t5/technology-blog-posts-by-sap/you-asked-for-simpler-sap-signavio-listened-here-is-what-changes/ba-p/14392563
- https://community.sap.com/t5/technology-blog-posts-by-sap/process-consulting-agent-process-insights-reasoning-and-recommendations-one/ba-p/14396080
- https://community.sap.com/t5/technology-blog-posts-by-sap/the-process-consulting-agent-is-generally-available-get-started-now/ba-p/14446484
- https://community.sap.com/t5/technology-blog-posts-by-sap/from-agent-led-process-mining-to-action-what-s-new-in-the-process/ba-p/14498943
- https://news.sap.com/2026/05/sap-signavio-gartner-magic-quadrant-process-intelligence-platforms/
- https://news.sap.com/2026/05/business-transformation-management-foundation-autonomous-enterprise/
- https://www.sap.com/topics/events/sapphire/innovation-news-guide-2026
- https://www.leanix.net/en/blog/leanix-at-sapphire
- https://news.sap.com/2026/10/ai-release-highlights-q3-2026/

**SAP Signavio (presse / tiers)**
- https://www.forrester.com/blogs/sap-sapphire-2025-what-tech-leaders-must-know
- https://thenewstack.io/sap-ai-agent-hub/
- https://www.processexcellencenetwork.com/process-mining/news/sap-signavio-reveals-new-process-intelligence-insights-features
- https://www.gartner.com/reviews/product/sap-signavio-process-transformation-suite ; https://www.g2.com/products/signavio/reviews
- https://redresscompliance.com/sap-signavio-licensing-guide-pricing-negotiation.html (estimations non officielles)

**À faire si Faty veut aller plus loin** : autoriser les domaines celonis.com, docs.celonis.com, signavio.com, news.sap.com, help.sap.com, community.sap.com et businesswire.com dans les réglages réseau de la session, puis relancer pour lire les pages en entier (plan gratuit Celonis, éditions Signavio, Process Networks, release Signavio novembre 2025).
