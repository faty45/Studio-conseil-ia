## 3. Standards et bonnes pratiques à réutiliser (faits vérifiés)

Ces briques sont publiques, documentées et stables. Elles évitent de réinventer un modèle de données ou une méthode.

### 3.1 Process mining et task mining

| Brique | Ce que c'est | Pourquoi c'est utile à Studio Conseil IA | Source (date) |
|---|---|---|---|
| **Process Mining Manifesto** (IEEE Task Force on Process Mining, 2011) | Principes directeurs et défis du process mining, traduit en 16 langues | Donne le vocabulaire et les garde-fous (qualité des logs, concept drift, représentativité) | [Task Force IEEE](https://icpmconference.org/2020/ieee-task-force-on-process-mining/) (page ICPM 2020) |
| **Process Mining Handbook** (van der Aalst, Carmona, Springer LNBIP 448) | Manuel de référence en accès libre (CC BY 4.0) : découverte, conformance, responsible process mining | Formation de l'équipe et des consultants, base pédagogique gratuite | [Springer](https://link.springer.com/book/978-3-031-08848-3) (27 juin 2022) |
| **XES, IEEE 1849** | Format standard d'échange de journaux d'événements ; version 2016 remplacée par **IEEE 1849-2023** (9 septembre 2023) | Format d'export si un client veut reprendre ses données dans un autre outil | [xes-standard.org](https://www.xes-standard.org/certification/downloads) |
| **OCEL 2.0** (Object-Centric Event Log) | Spécification du 16 octobre 2023 (arXiv mars 2024) ; trois formats (SQLite, XML, JSON) ; relations objet-objet qualifiées, attributs qui évoluent | Modèle de données « objets + événements » plus naturel qu'un simple « cas » : une commande, un client, un livreur, une fournée | [arXiv 2403.01975](https://arxiv.org/abs/2403.01975) ; [ocel-standard.org](https://www.ocel-standard.org/) |
| **PM4Py** | Bibliothèque Python open source de process mining (Fraunhofer FIT / Process Intelligence Solutions). Dernière version publiée 2.7.22.3 (18 mai 2026). Licence déclarée **AGPL-3.0** sur GitHub et PyPI ; des pages plus anciennes disent GPL ; licence commerciale séparée pour usage fermé | Permet de prototyper découverte de processus, variantes, conformance sans tout recoder. **Attention à l'AGPL** pour un SaaS : prévoir licence commerciale ou isolation en service séparé | [GitHub](https://github.com/process-intelligence-solutions/pm4py) ; [PyPI](https://pypi.org/project/pm4py) ; [licence Fraunhofer](https://pm4py.fit.fraunhofer.de/solution-licensing) |
| **BPMN 2.0, DMN, CMMN** (OMG) | Notations standard pour les processus, les décisions et la gestion de cas | Export vers les outils des prestataires ; mais trop lourd pour un artisan en atelier (voir § 7) | [OMG BPMN](https://www.omg.org/spec/BPMN/2.0/) |

### 3.2 Cadres de référence « métier »

| Brique | Fait vérifié | Usage pour la plateforme |
|---|---|---|
| **APQC Process Classification Framework (PCF)** | Voir § 2.7 : taxonomie hiérarchique des processus, versions sectorielles, benchmarks | Épine dorsale du « graphe de connaissances » inter-métiers : chaque problème ou solution est rattaché à un identifiant PCF, ce qui rend les solutions réutilisables entre une boulangerie et une association |

### 3.3 Cadre légal du task mining en France (fait vérifié, sources secondaires)

Le task mining enregistre clics, frappes, captures d'écran. En France :

- La CNIL considère qu'un employeur **ne peut pas placer ses salariés sous surveillance permanente** hors cas exceptionnels ; le **partage d'écran permanent** et les **keyloggers** sont cités comme pratiques invasives.
- Les traitements de surveillance doivent figurer au **registre des traitements** ; les traitements à risque élevé exigent une **analyse d'impact (AIPD)**.
- Les salariés doivent être **informés individuellement** et le **CSE consulté** avant l'installation d'un dispositif de contrôle.
- Le **19 décembre 2024**, la CNIL a sanctionné une entreprise immobilière (40 000 €) pour surveillance disproportionnée, dont des captures d'écran régulières.

Sources : [Éditions Tissot](https://www.editions-tissot.fr/actualite/droit-du-travail/surveillance-des-salaries-la-cnil-sanctionne-lourdement-les-manquements-au-rgpd), [Actu-Juridique](https://www.actu-juridique.fr/social/travail/la-surveillance-des-salaries-en-teletravail-que-peut-faire-lemployeur), [CNIL – thématique travail](https://www.cnil.fr/fr/thematique/travail). Les pages cnil.fr n'ont pas pu être ouvertes depuis cette session (domaine non autorisé) : les règles ci-dessus viennent de sources juridiques secondaires qui citent la CNIL, à confirmer sur cnil.fr avant toute mise en œuvre.

**Conséquence** : pour Studio Conseil IA, l'observation des processus doit rester **déclarative et consentie** (atelier, photo d'un poste, journal de bord volontaire, export d'un logiciel), jamais un enregistrement silencieux de l'écran.

### 3.4 Ce que disent les analystes (2025-2026)

| Fait | Source (date) |
|---|---|
| Gartner a publié le **Magic Quadrant for Process Mining Platforms** le 15 avril 2025 (16 éditeurs). Leaders cités dans les communiqués : Celonis, SAP Signavio, UiPath, ARIS, Apromore, IBM, Pegasystems, MEHRWERK ; Microsoft en Challenger ; QPR en Visionnaire | [Celonis](https://www.celonis.com/news/press/celonis-recognized-as-a-leader-for-third-consecutive-year-in-2025-gartner-magic-quadrant-for-process-mining-platforms) (22 avril 2025), [ARIS](https://aris.com/?p=2731) |
| En 2026, Gartner a **renommé la catégorie « Process Intelligence Platforms »** (Magic Quadrant du 5 mai 2026, 13 éditeurs). Leaders annoncés : Celonis, SAP Signavio, ARIS, Pegasystems ; QPR Visionnaire | [SAP News](https://news.sap.com/2026/05/sap-signavio-gartner-magic-quadrant-process-intelligence-platforms/) (mai 2026), [Celonis / BusinessWire](https://www.businesswire.com/news/home/20260510078040/en/) (10 mai 2026), [ARIS](https://aris.com/newsroom/aris-leader-in-gartner-magic-quadrant-for-process-intelligence/) (8 mai 2026), [Pega](https://www.pega.com/gartner-process-intelligence-2026), [QPR](https://www.qpr.com/news/qpr-software-recognized-visionary-fourth-consecutive-year-2026-gartner-magic-quadrant-process-intelligence-platforms) |
| Gartner (abstract du 12 mai 2026) décrit les plateformes de process intelligence comme « le système sensoriel et le plan de gouvernance » des opérations autonomes ; un autre abstract (8 mai 2026) parle d'« AI agent mining » | [Gartner](https://www.gartner.com/en/documents/7843781) |
| **Forrester Wave Process Intelligence Software, Q3 2025** : 15 éditeurs, 25 critères ; Leaders annoncés : Celonis, ARIS, iGrafx | [iGrafx / BusinessWire](https://www.businesswire.com/news/home/20250813644942/en/) (13 août 2025) |
| **Everest Group PEAK Matrix Process Mining 2025** : 23 éditeurs ; Celonis Leader pour la 6e année ; Apromore Leader et Star Performer ; mindzie Major Contender et Star Performer | [Celonis / BusinessWire](https://www.businesswire.com/news/home/20250626438110/en/) (26 juin 2025), [Apromore](https://www.businesswire.com/news/home/20250624881438/en/) (24 juin 2025) |
| Gartner **Market Guide for Task Mining Tools** : 29 avril 2025 ; nouvelle édition 2026 citée par Mimica (21 mai 2026) | [Gartner](https://www.gartner.com/en/documents/6403875), [Mimica](https://mimica.ai/articles/mimica-featured-2026-gartner-market-guide-task-mining-tools) |
| Deloitte **Global Process Mining Survey 2025** : plus de 120 répondants, trois groupes (déploiement à l'échelle, solution isolée, preuve de concept) ; message clé : aligner le process mining sur les objectifs métier | [Deloitte](https://www.deloitte.com/de/de/services/consulting-financial/research/global-process-mining-survey.html) |

**Hypothèse** (non vérifiée, cohérente avec les sources) : tous ces rapports évaluent des outils pour grandes entreprises. Aucun ne note l'adéquation aux TPE ou aux artisans ; la recherche académique sur le process mining en PME reste mince (thèse Twente 2023 : « research is limited » ; revue *Systems*, avril 2025 : contraintes de ressources, compétences, qualité des données).

