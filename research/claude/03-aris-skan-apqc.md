# Veille : ARIS, Skan AI, APQC — faits vérifiés et zones d'ombre (au 28 octobre 2026)

**Conditions de collecte (à lire d'abord).** Les informations ci-dessous viennent de résultats de recherche web (extraits et résumés de pages), pas de la lecture intégrale des pages : WebFetch a été refusé sur aris.com, ariscommunity.com, skan.ai, apqc.org et diginomica.com (domaines non autorisés dans le réseau de cette session), et le quota de recherches de la session a été atteint avant la dernière salve (releases ARIS 10.2026.x, actionnariat ARIS 2026, « Skan Scout », nombre exact d'éléments du PCF 8.0, liste complète des PCF sectoriels). Je n'ai testé aucun des trois produits. Pour aller plus loin : autoriser ces domaines, puis relancer une recherche ciblée.

---

## 1. ARIS (ex-Software AG)

### Vérifié (source + date)

**Situation de la société.**
- Juillet 2024 : Software AG cède webMethods et StreamSets (ainsi que TrendMiner) à IBM (wiki.licenseware ; PR Newswire 7 janv. 2025).
- 7 janvier 2025 : *Software GmbH* (holding du groupe Software AG, détenue par le fonds Silver Lake) annonce la clôture des ventes d'Alfabet et de Cumulocity, le départ du CEO Sanjay Brahmawar, et le lancement d'**Adabas & Natural** et d'**ARIS** comme deux *entreprises autonomes* avec chacune sa direction. Christian Lucas (Silver Lake) y déclare vouloir « investir dans ARIS et A&N » (PR Newswire, 7 janv. 2025 ; newscenter.softwareag.com).
- Avril 2025 : le communiqué ARIS sur le Magic Quadrant précise que ARIS « a commencé à devenir une entreprise autonome en janvier 2025 », que Gartner la liste désormais comme **« ARIS (Software GmbH) »** (après « Software AG » en 2023-2024), et donne l'entité juridique **SAG ARIS GmbH, Altenkesseler Straße 17, Saarbrücken** (aris.com, communiqué 28 avr. 2025).
- Site : **aris.com** (newsroom, docs.aris.com) ; le site softwareag.com ne liste plus qu'Adabas & Natural, CONNX, JOPAZ (wiki.licenseware).

**Reconnaissances analystes.**
- 28 avr. 2025 : Leader du Gartner Magic Quadrant *Process Mining Platforms* 2025 (rapport du 15 avr. 2025 ; 8 Leaders sur 16 éditeurs), 3e année consécutive (aris.com).
- Août 2025 : Leader du Forrester Wave *Process Intelligence Software*, Q3 2025 (aris.com).
- 12 mai 2026 : Leader du Gartner MQ *Process Intelligence Platforms* (rapport du 5 mai 2026) ; ARIS se présente comme « process context foundation platform for enterprise AI deployment » (Business Wire).
- 30 juillet 2026 : Leader du premier Gartner MQ *Digital Twin of an Organization Platforms* (rapport du 27 juil. 2026 ; Celonis, SAP, GBTEC aussi Leaders) (Business Wire).

**Modules et noms exacts (docs.aris.com, ariscommunity, communiqués).**
- Éditions de la suite : **ARIS Basic** (entrée de gamme, « jusqu'à 20 utilisateurs »), **ARIS Advanced** (jusqu'à 2 000 utilisateurs), **ARIS Enterprise** (toute l'entreprise, inclut l'AI Companion et l'intégration Process Mining) — forum Software AG « ARIS Editions overview », ariscommunity « ARIS editions – what's it all about » (2021), Product Feature Matrix SR27/SR28.
- **ARIS Process Mining** : éditions *Elements*, *Advanced*, *Enterprise* ; conformance check à partir de modèles EPC importés comme référence ; création automatique d'incidents dans **ARIS Risk & Compliance** quand une condition est détectée (docs SR22 ; aris.com).
- **ARIS Simulation** : analyse de KPI sur modèles EPC ou BPMN pour trouver les goulots (fiche aris.com / softwareag.com).
- **ARIS Risk & Compliance** : exigences réglementaires et risques opérationnels dans un *Internal Control System* (ICS) (Software AG).
- **ARIS Flows** (gouvernance / workflow builder « AI-enabled ») : bêta en avril 2025, GA « à partir d'aujourd'hui avec ARIS 10.0.2025.10 » (ariscommunity, 27 oct. 2025) ; disponible dans ARIS Enterprise.
- **ARIS Task Mining by ProcessMaker** : lancé le 13 mars 2025 (Saarbrücken), développé en partenariat avec ProcessMaker (aris.com newsroom ; Enterprise Times 14 mars 2025).
- **ARIS AI Companion** (c'est le nom officiel ; aucune occurrence de « ARIS Copilot » trouvée) : annoncé par Software AG le 10 avr. 2024 (Europawire) ; pilote dans **SR26** (juin 2024) ; ouvert à tous les clients dans **SR27** (oct./nov. 2024) avec brouillons de modèles par IA, recherche IA, champs calculés en langage naturel dans Process Mining ; **SR28** (30 avr. 2025) ajoute l'aide « how do I » pas à pas et la génération texte → modèle de processus réutilisant le contenu du référentiel.
- Licence IA : l'AI Companion est une **licence séparée + crédits de consommation** (ex. « Text to process model : 50 crédits », « AI-assisted search : 1 crédit ») (docs.aris.com, Cloud Enterprise Usage, avril 2025 ; page « Activate AI Companion », aris.com).
- Numérotation : depuis mai 2025, schéma **10.{année}.{mois}.{build}** ; versions 10.2026.1 à **10.2026.8 (10 août 2026)** ; SR28 supportée du 30 avr. 2025 au 30 avr. 2026 ; releases on-premise deux fois par an (avril / octobre) (docs.aris.com « Release Cycles », avril 2026 ; ariscommunity « Product Version Availability »).

**Méthodes.** EPC natif ; BPMN 2.0 via le type de modèle BPD (doc Software AG « Implementation of BPMN in ARIS ») ; guides utilisateur **ArchiMate 3.0** pour ARIS Architect/Designer (ARIS 10 SR3/SR4) ; simulation sur EPC/BPMN ; process mining avec conformance checking ; task mining via le partenariat ProcessMaker.

**Modèle de données.** Référentiel avec distinction **définition d'objet / occurrence** (API Repository : « connected objects def level / occ level », « models with occurrences of an object ») ; **filtres de méthode** (GUID obligatoire dans l'API ; ex. filtre BPMN2 qui masque les EPC) ; recherche filtrable par type d'objet (ariscommunity SR20, 2022). Je n'ai pas pu lire la description officielle de la hiérarchie bases → groupes → modèles → objets.

**Ergonomie / gratuité.** Essai gratuit 30 jours pour Basic et Advanced en cloud partagé (forum Software AG). Process Mining : palier **Basic gratuit** (stockage ≤ 1 Go), Advanced « à partir de 1 200 €/mois », Enterprise sur devis (aris.com/process-mining-pricing — date de page non obtenue).

### Incertain / à confirmer
- **Prix des éditions de modélisation** : ~100 €/utilisateur/mois (Basic) et ~200 € (Advanced) selon Software Advice, TrustRadius, Capterra 2026 ; une page softwareag-dev.cloud affiche « ARIS Basic Free » et 125 €… Rien lu directement sur aris.com → **non confirmé**.
- **Propriétaire actuel (2026)** : Silver Lake via Software GmbH au 7 janv. 2025 ; aucune recherche sur une éventuelle cession en 2026 n'a pu être faite (quota).
- Certification ArchiMate 3.1 par l'Open Group : question posée sur ariscommunity, pas de réponse trouvée.
- Contenu des releases 10.2025.10 / 10.2026.x (agents IA ?) : non recherché (quota). Un événement ariscommunity « latest ARIS AI Companion update » (inscription jusqu'au 23 juil. 2026) existe, sans détail.
- Mécanique de capture du Task Mining (agent desktop ?) : non décrite dans les sources trouvées.

### Limites (constat)
Outil d'entreprise (gouvernance, GRC, référentiel) : coût en crédits IA et licences séparées, complexité méthodologique (filtres, EPC), peu pertinent pour une TPE/artisan hors palier gratuit de Process Mining. Dépendance au cloud ARIS pour l'IA.

---

## 2. Skan AI

### Vérifié (source + date)

**Société.** Fondée en **2018** par **Avinash Misra** (CEO) et **Manish Garg** (ex-cofondateurs d'Endeavour Software, racheté par Genpact) ; siège **Menlo Park, Californie** (101 Jefferson Drive) — Cathay Innovation indique San Jose (skan.ai/company ; CB Insights ; employbl). Effectifs : estimations tierces de 100 à ~240 (mai 2026).
- Financement : Série A 14 M$ menée par Cathay Innovation (2020 ou 2021 selon les sources) ; Série B **40 M$ en mars 2022** menée par Dell Technologies Capital (HPCwire 30 mars 2022) ; **Série C 63 M$ annoncée le 12 août 2026**, co-menée par Cathay Innovation et Dell Technologies Capital, avec Citi Ventures, Bloomberg Beta, State Farm Ventures, Wipro Ventures ; total levé ≈ 120 M$ ; valorisation non divulguée (SiliconANGLE 12 août 2026 ; Dealroom ; TheNextWeb).

**Positionnement et produits.**
- « **Skan AI Trifecta** » : trois produits sur une plateforme — **Blueprint**, **Intelligence**, **AI Agents** — bâtis sur un « digital twin of operations » dérivé de l'observation (blog skan.ai « The Skan AI Trifecta »).
- **Skan Intelligence** = produit cœur (« ~99 % des clients ») ; capacités nommées : **Process Discovery** (« capture chaque clic, changement d'application et transfert »), **Automation and Technology Discovery** (blog « Skan Intelligence: See How Work Actually Gets Done »).
- « **Context Graph of Work** » / « Enterprise Work Graph » : couche de données ; nœuds = personnes, applications, tâches, décisions, politiques, résultats (blog skan.ai « The Context Graph of Work »).
- **ProcessGPT** : suite d'IA générative pour le process mining, première version avec **askSkan** (interface conversationnelle de découverte) et **Business Process Copilot** (génération de contenu, exécution de tâches humaines) ; pilotée avec des clients co-innovateurs (claims, underwriting, finance), « general release to follow » (skan.ai/in-the-news ; PR Newswire n° 301927946 ; deck « Q4 2023 ») ; fiche **Microsoft AppSource « Skan ProcessGPT »**.
- Partenariat **iGrafx** pour un « Digital Twin of an Organization » : annoncé le **29 mai 2024** (igrafx.com ; KMWorld).
- Agents : pipeline décrit par Skan — observations de travail → « neurosymbolic AI » → « operational context graphs » et « Agentic Operating Procedures » → agents « gouvernés, prêts à l'emploi » sur Skan AI Agents (blog, mai 2026). Un « Agentic Automation Manifesto » est annoncé sur le site (date non obtenue).
- Place de marché : fiche UiPath Marketplace « Skan Process Discovery & Intelligence Platform » (« utilise la vision par ordinateur pour observer comment le travail est exécuté »).

**Analystes.** Niche Player, Gartner MQ *Process Mining Platforms* 2024 (skan.ai). **Honorable Mention, Gartner MQ *Process Intelligence Platforms*, mai 2026** ; « Representative Vendor » du Gartner *Market Guide for Task Mining Tools* 2026 (communiqué skan.ai). Gartner y décrit Skan ainsi (cité par Skan) : « uses computer vision and AI to observe digital work at the desktop level… applies neurosymbolic AI to build operational context graphs ».

**Méthode de capture (sans intégration).** Logiciel installé sur les postes, prises de captures d'écran ; suivi de l'usage des applications, des bascules, du temps par processus, des séquences et chemins de décision ; identifiants des salariés remplacés par des jetons avant envoi (TheNextWeb, août 2026). Skan affirme observer « 100 % de l'activité sans intégration système » (blog DTO).

**Privacy (déclarations de l'éditeur).** « L'unité d'analyse est le processus, pas la personne » ; analyse au niveau équipe/entreprise ; masquage « irréversible » (blog « How Skan AI protects privacy by design ») ; « screen-level redaction, pseudonymization, least-privilege » au point de capture ; politiques sur les applications observées, zones d'écran masquées, durée de rétention, accès aux résultats désagrégés ; déploiement on-premise, cloud privé ou hébergé par Skan, conteneurisé ; conformité revendiquée ISO 27001, SOC 2 Type II, PCI DSS, HIPAA, GDPR, CCPA, alignement EU AI Act et DORA (blog « Privacy-First AI Process Observation » ; PDF « Unlocking Process Intelligence with Data Privacy »).

**Prix.** Non publiés : devis sur demande (fitgap).

### Incertain / à confirmer
- Date exacte du lancement de ProcessGPT (probablement fin 2023 d'après le deck Q4 2023 ; communiqué PR Newswire non daté dans les résultats).
- « Work Intelligence » apparaît comme catégorie (« Work Intelligence Platform »), pas comme module ; « Operational Insights » introuvable ; **« Skan Scout » : non recherché** (quota). Page « Skan Wing » existante, contenu non lu.
- Où s'exécute le masquage (poste ou cloud) et durée de conservation des captures brutes : non documenté dans les sources trouvées.
- Chiffres clients (ex. « > 130 M$ d'économies ») : communiqués, non vérifiés.

### Limites (constat)
Grands comptes (assurance, santé, finance). Déploiement d'un agent sur chaque poste, capital-risque et tarification sur devis : hors de portée d'une TPE. Question éthique centrale : surveillance des salariés — TheNextWeb titre « watch how office staff actually work, then build agents that copy them » (août 2026) ; un analyste tiers note les besoins de concertation (works councils) et de configuration fine du masquage (fitgap).

---

## 3. APQC

### Vérifié (source + date)

**PCF (Process Classification Framework).**
- Version actuelle : **PCF Cross-Industry 8.0**, PDF et Excel publiés le **27 février 2026** (apqc.org/pcf-pdf, /pcf-excel ; FAQ : « the latest version of the PCF is version 8.0 ») ; la précédente, 7.4, datait d'août 2024 (guide rework.com). « PCF Version 8.0 Process Definitions and Key Measures Collection » mis à jour le 24 mars 2026.
- Structure : **13 catégories de niveau 1** ; niveaux **Category → Process Group → Process → Activity → Task** ; **IDs hiérarchiques** 1.1 (groupe), 1.1.1 (processus), 1.1.1.1 (activité) ; en plus, un **PCF ID à 5 chiffres**, index lisible par machine pour la base d'éléments d'APQC ; l'ordre n'implique pas une séquence d'exécution ; les tâches varient selon les secteurs (APQC « Understanding the PCF Elements »).
- Versions sectorielles : 8.0 déjà disponible pour Consumer Electronics, Consumer Products, Banking, Utilities ; d'autres restent en 7.2.2 (Aerospace & Defense, Automotive OEM, Broadcasting, Life Sciences, Airline, P&C Insurance, Downstream Petroleum), 7.2.1 (City Government), 6.1.1 (Healthcare Provider) (apqc.org, pages sectorielles). Certaines versions « co-développées avec IBM » portent des **conditions de licence spécifiques incluses dans le téléchargement**.
- Licence : document APQC « disponible sans frais pour les organisations de tous secteurs et tailles » (document ancien) ; Terms of Service : licence « limitée, non exclusive, non transférable » pour l'amélioration interne des processus ; inscription possible pour certaines ressources ; un accord de licence spécifique prévaut s'il existe. **Texte de licence du PCF 8.0 non lu.**
- Un ancien document (2014) qualifie le PCF d'« Open Standard administré par APQC ».

**Benchmarking.**
- **Open Standards Benchmarking** : données collectées, validées par un analyste APQC (contrôles logiques et statistiques), publiées en aveugle ; rapport sous deux semaines ; comparaison par secteur, région, taille ; « milliers de mesures standardisées », la plupart reliées au PCF (apqc.org/osbc).
- Grille tarifaire (PDF marqué ©2017) : gratuit pour les membres dans leur périmètre ; membres fonctionnels jusqu'à 2 500 $ hors périmètre ; **non-membres jusqu'à 5 000 $ par enquête**.
- Exemples de métriques : coût médian par facture fournisseur **6,00 $** (5 846 organisations), 1,36 $ par ligne ; « Accounts Payable Key Benchmarks » mis à jour le **27 janv. 2026** (apqc.org).

**Adhésion.** Adhésions **organisationnelles uniquement** (pas individuelles) ; 7 types : Enterprise, Financial Management, Human Capital Management, Knowledge Management, Supply Chain Management, Professional Services, Education ; tarifs **non publiés** (« varient selon le type d'organisation et les ressources », tarif pluriannuel, devis) (apqc.org/membership).

**Outils.** **MosaiQ** : outil cloud de gestion de processus lancé en 2016, préchargé avec le PCF et 18 versions sectorielles, inclus dans l'adhésion ; MosaiQ 2.0 (frameworks en lecture seule, exports avec définitions). Aucune fonction IA trouvée.

**APQC et IA (2025-2026).** Rapports « AI in IT Practices » (30 juin 2026, réservés aux membres) basés sur la catégorie PCF 8.0 « Manage information technology » (enquête nov. 2024) ; « 2026 Process and Performance Management Priorities » (enquête fin 2025) ; table ronde de février 2026 sur le digital ; conférence **APQC CONNECT 2026** (mai 2026) centrée sur IA et process (« la plupart des pilotes IA échouent faute de processus, de responsable, de mesure »).

**PME.** Pas de document dédié ; APQC indique que le PCF « ne liste pas tous les processus d'une organisation » et « se personnalise » : un usage partiel est attendu.

### Incertain / à confirmer
- **Nombre d'éléments du PCF 8.0** : « plus de 1 000 processus » selon un résumé Scribd (tiers) — non vérifié dans le fichier APQC.
- Changements 7.4 → 8.0 : aucune note de version trouvée.
- « Benchmarks on Demand » : nom aperçu dans des pages APQC mais non documenté.
- Montants actuels des enquêtes pour non-membres (grille 2017).

### Limites (constat)
Référentiel riche mais générique (13 catégories, 5 niveaux) et conçu pour le benchmarking de grandes organisations ; les benchmarks utiles sont derrière l'adhésion ; pour une TPE, seuls le PCF gratuit et quelques fiches publiques sont exploitables.

---

## Sources (URL complètes)

**ARIS**
- https://www.prnewswire.com/news-releases/software-gmbh-announces-adabas--natural-and-aris-will-launch-as-standalone-businesses-closing-of-sales-of-alfabet-and-cumulocity-departure-of-group-ceo-sanjay-brahmawar-and-new-central-leadership-302344983.html (7 janv. 2025)
- https://newscenter.softwareag.com/en/news-stories/press-releases/2024/0107-adabas-and-natural-and-aris-launch-as-standalone.html
- https://aris.com/?p=2731 (communiqué MQ Process Mining, 28 avr. 2025, entité SAG ARIS GmbH)
- https://aris.com/?p=2732 (Forrester Wave, août 2025)
- https://www.businesswire.com/news/home/20260730946550/en/ (MQ DTO, 30 juil. 2026)
- https://aris.com/newsroom/task-mining-by-processmaker-press-release/ (13 mars 2025)
- https://ariscommunity.com/users/goretti-olivi%C3%A9/2025-04-28-new-aris-10-sr28-available-find-all-news-here (28 avr. 2025)
- https://ariscommunity.com/users/mscheid/2025-10-27-aris-flows-advancing-workflow-automation-and-governance-within-aris-platform (27 oct. 2025)
- https://news.europawire.eu/software-ag-introduces-aris-ai-companion-empowering-every-employee-in-process-optimization/eu-press-release/2024/04/10/15/06/22/133771 (10 avr. 2024)
- https://docs.aris.com/latest/yay-release-cycles/en/Release-Cycles.pdf (avril 2026)
- https://docs.aris.com/10.0.28.0/yce-enterprise-guide/en/Cloud-Enterprise-Usage.pdf (avril 2025)
- https://docs.aris.com/latest/yay-product-feature-matrix-guide/en/Product-Feature-Matrix.pdf
- https://aris.com/process-mining-pricing (date non obtenue)
- https://tech.forums.softwareag.com/t/aris-editions-overview/245028
- https://wiki.licenseware.io/wiki/software-ag-portfolio-changes-webmethods-and-aris/

**Skan AI**
- https://www.skan.ai/company
- https://www.skan.ai/in-the-news/gartner-magic-quadrant-process-intelligence-2026 (mai 2026)
- https://www.skan.ai/blogs/skan-ai-trifecta-enterprise-ai-platform
- https://www.skan.ai/blogs/context-graph-of-work-skan-ai
- https://www.skan.ai/blogs/how-skan-ai-protects-privacy-by-design
- https://www.skan.ai/blogs/privacy-first-ai-process-observation-implementation
- https://skan.ai/in-the-news/skan-launches-processgpt-first-suite-of-generative-ai-capabilities
- https://appsource.microsoft.com/en-US/product/web-apps/skaninc1701884545313.skanprocessgpt
- https://www.igrafx.com/news/skan-igrafx-partnership-digital-twin-of-an-organization-dto/ (29 mai 2024)
- https://siliconangle.com/2026/08/12/skan-ai-raises-63m-give-ai-agents-map-enterprise-work/ (12 août 2026)
- https://thenextweb.com/news/skan-ai-63m-series-c-workplace-observation-enterprise-agents (août 2026)
- https://www.hpcwire.com/aiwire/2022/03/30/skan-raises-40m-series-b-to-accelerate-adoption-of-its-process-intelligence-solution/ (30 mars 2022)

**APQC**
- https://www.apqc.org/pcf-pdf (PCF 8.0 PDF, 27 févr. 2026)
- https://www.apqc.org/pcf-excel (PCF 8.0 Excel)
- https://www.apqc.org/process-frameworks/pcf-faqs
- https://www.apqc.org/pcf-definitions-and-measures (24 mars 2026)
- https://www.apqc.org/sites/default/files/files/PCF%20Collateral/Understanding%20the%20PCF%20Elements%20%20-%20FINAL.pdf
- https://www.apqc.org/process-frameworks/industry-specific-process-frameworks
- https://www.apqc.org/osbc (Open Standards Benchmarking)
- https://www.apqc.org/sites/default/files/files/files/OSBC%20Campaigns/Fee%20Schedule%20and%20Overview.pdf (©2017)
- https://www.apqc.org/membership/membership-types/enterprise-membership
- https://www.apqc.org/membership/membership-types
- https://www.apqc.org/terms-of-service
- https://www.apqc.org/about-apqc/news-press-release/apqc-releases-cloud-based-business-management-tool-mosaiq-20 (2016)
- https://www.apqc.org/resources/blog/apqc-connect-2026-takeaways-bridging-ai-process-and-people (mai 2026)
- https://www.apqc.org/resource-library/resource-listing/accounts-payable-key-benchmarks-cross-industry (27 janv. 2026)

**Blocages à lever pour compléter** : autoriser aris.com, ariscommunity.com, docs.aris.com, skan.ai, apqc.org dans le réseau de la session (lecture des pages tarifs ARIS, de la licence PCF 8.0 et des pages produit Skan), puis relancer les 5 recherches restantes listées en tête.
