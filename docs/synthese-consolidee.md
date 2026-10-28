# Synthèse consolidée — Studio Conseil IA (28 octobre 2026)

Ce document rassemble les recherches de la première vague (quatre fiches de faits sur les éditeurs, `research/claude/00` à `04`), le brouillon v1 (`research/claude/05`) et les quatre analyses contradictoires de la deuxième vague (`research/claude/perspectives/A` à `D`). Il sépare les faits, les hypothèses et les recommandations, expose les désaccords, puis tranche.

## 1. En dix lignes

1. **Fait** : aucun acteur du marché (Celonis, SAP Signavio, UiPath, ARIS, Skan, Microsoft, startups) ne publie d'offre ni de prix pour les entreprises de moins de 10 salariés ; tous supposent un ERP, des journaux d'événements ou un agent sur les postes.
2. **Fait** : la catégorie a été renommée « Process Intelligence » par Gartner le 5 mai 2026, et tous les éditeurs pivotent vers l'alimentation d'agents IA.
3. **Fait** : en France, le task mining par capture d'écran est juridiquement risqué (CNIL : pas de surveillance permanente ; sanction du 19 décembre 2024). Studio Conseil IA s'en passe.
4. **Consensus des quatre analyses** : isolation stricte par client, validation humaine tracée de tout ce que produit l'IA, « un chiffre, une source », métiers décrits par configuration, deux premières missions comme banc d'essai.
5. **Désaccord principal** : coder tout de suite un noyau de données (analyses A et D) ou jouer dix missions à la main avant la première ligne de code (analyses B et C).
6. **Arbitrage** : une **phase 0 sans code** sur les deux premières missions, mais avec des modèles de documents et des tableurs dont les colonnes **sont déjà** le schéma de données de l'analyse D. Rien n'est jeté au passage au code.
7. **Désaccord secondaire** : taxonomie PCF d'APQC (A) ou taxonomie maison courte (B, C). **Arbitrage** : taxonomie maison de 20 causes et 30 recettes ; le code PCF reste un champ optionnel rempli après la mission.
8. **Point que personne n'avait vu dans le brouillon** : le contrat de mission (clause de capitalisation méthodologique, mentions de responsabilité, export et effacement) et l'assurance RC pro passent avant tout le reste.
9. **Risque n° 1** : personne ne paie. Les diagnostics TPE existent déjà gratuitement (CMA, CCI, France Num). La piste : vendre à des financeurs et des réseaux, pas un abonnement à l'artisan.
10. **MVP priorisé** en trois phases (§ 7), avec un point de décision après les deux premières missions.

## 2. Ce que disent les recherches (faits)

| Thème | Fait vérifié | Source |
|---|---|---|
| Marché | Gartner MQ Process Mining 2025 (15 avril 2025, 16 éditeurs) puis MQ **Process Intelligence** 2026 (5 mai 2026, 13 éditeurs) ; Leaders 2026 annoncés : Celonis, SAP Signavio, ARIS, Pegasystems | `research/claude/00` § 3.4, `04` § E |
| Marché | Forrester Wave Process Intelligence Q3 2025 : Leaders Celonis, ARIS, iGrafx ; Everest 2025 : 23 éditeurs, marché 1,5 à 1,6 Md$ (chiffre cité par la presse) | idem |
| Méthodes | Celonis : modèle objet-centré, perspectives, core processes, conformance, AgentC, Orchestration Engine (GA 4 nov. 2025), Context Model (12 mai 2026) | `01` |
| Méthodes | SAP Signavio : BPMN/DMN, Process Insights (90+ flux, 200+ indicateurs), Journey Modeler, Process Atoms, Process Consulting Agent (GA juin 2026) | `01` |
| Méthodes | UiPath Automation Hub : évaluation à deux niveaux, scores Automation Potential et Ease of Implementation (seuils 65/35), analyse coût-bénéfice, pipeline d'idées, Process Repository BPMN (2026) | `02` |
| Méthodes | Microsoft : journal minimal Case ID / Activity / Event Start ; Premium 15 $/utilisateur/mois ; add-on 5 000 $/tenant/mois | `02` |
| Méthodes | ARIS : entité autonome depuis janvier 2025, Process Mining Basic gratuit (≤ 1 Go), AI Companion facturé en crédits | `03` |
| Méthodes | Skan : capture sur chaque poste, « Context Graph of Work », série C 63 M$ (12 août 2026) | `03` |
| Référentiel | APQC PCF 8.0 publié le 27 février 2026 ; 13 catégories, 5 niveaux ; licence du fichier 8.0 non relue | `03` |
| Standards | OCEL 2.0 (16 oct. 2023, formats SQLite/XML/JSON) ; XES IEEE 1849-2023 ; PM4Py en AGPL-3.0 ; BPMN 2.0.2, DMN 1.5 | `00`, `04` |
| Agents | MCP donné à la Linux Foundation (9 déc. 2025) ; A2A (23 juin 2025) ; OWASP Top 10 Agentic (déc. 2025) : « least agency », approbation humaine avant action à risque | `04` § C |
| Cadre légal | CNIL : surveillance permanente interdite, registre, AIPD, information et consultation du CSE ; AI Act art. 4 applicable depuis le 2 février 2025, art. 50 au 2 août 2026 (dates du haut risque à confirmer au JOUE) | `00` § 3.3, `perspectives/C` |
| TPE | Aucune startup trouvée se présentant comme « consultant IA pour artisans » ; les outils accessibles aux TPE (Scribe, Tango, Guidde) documentent mais ne diagnostiquent pas ; diagnostics numériques gratuits via CMA/CCI | `04` § A, `perspectives/C` |

Limite générale : les pages web n'ont pas pu être lues en entier depuis cette session ; les faits viennent d'extraits et de communiqués recoupés. Aucun produit n'a été testé.

## 3. Les quatre analyses en une phrase chacune

| Analyse | Posture | Thèse |
|---|---|---|
| **A — Méthodes des grands éditeurs** | Ingénieure process | Le brouillon confond simplicité d'interface et simplicité de modèle ; sans modèle objet, référentiel versionné et évaluation pondérée dès le jour 1, la plateforme restera un carnet et devra migrer ses missions |
| **B — Consultante de terrain** | Praticienne TPE | On vend une mission, pas un écran ; méthode et livrables papier d'abord, code seulement ce qui a été fait trois fois à la main ; l'outil doit aussi parler devis, facture et temps passé |
| **C — Avocat du diable** | Stratège et juriste | Le besoin est une méthode outillée, pas une plateforme ; la base inter-clients est le point le plus fragile juridiquement ; le marché TPE ne paie pas ; verrouiller contrat, responsabilité, export, effacement avant tout |
| **D — Architecte logicielle** | SaaS multi-locataire | Un noyau de huit tables figé (espace, journal immuable, objets, événements), deux schémas Postgres (client isolé, commun anonymisé), métiers en configuration, pas de process mining ni de graphe avant trois mois |

## 4. Accords entre les quatre analyses

- Pas de task mining par capture ; observation consentie et déclarative.
- Un espace par client, isolé ; export complet et suppression effective font partie de l'isolation (D, C).
- Tout ce que produit l'IA est proposé, tracé (consigne versionnée, modèle, date) et validé par la consultante avant d'apparaître dans un livrable (A, B, C, D).
- « Un chiffre, une source », et les estimations étiquetées comme hypothèses.
- La fiche de recommandation courte, avec deux champs de plus que le brouillon : « ce que je suppose » et « comment vérifier » (C), et le rattachement à une étape précise (A).
- Les métiers (boulangerie, dispositif régional) sont des configurations ou des packs, pas du code.
- Les cinq questions du High Level Assessment d'Automation Hub sont la seule mécanique d'éditeur reprise telle quelle par tout le monde (B la veut sur un post-it, A et D avec des poids en configuration).
- Les deux premières missions (ARDAN, boulangerie) sont le banc d'essai ; rien ne se généralise avant.
- Le « graphe de connaissances » est une table de patrons, pas un graphe (C, D ; A le concède au niveau de l'outillage).
- L'offre « grands groupes » sort de la feuille de route (C ; A et D ne la défendent pas).

## 5. Désaccords et arbitrages

| # | Sujet | Positions | Arbitrage proposé | Pourquoi |
|---|---|---|---|---|
| 1 | **Quand coder** | A et D : le schéma au jour 1, sinon migration. B : après trois répétitions à la main. C : après dix missions | **Phase 0 sans code sur les missions 1 et 2**, mais les modèles et tableurs reprennent exactement les entités et colonnes du schéma D. Décision go/no-go après la mission 2 (§ 7). | B et C ont raison sur le temps : une consultante seule qui fait coder ne fait pas de missions. A et D ont raison sur la structure : on ne jette rien si les colonnes sont les bonnes dès le papier. |
| 2 | **Taxonomie** | A : code PCF au niveau activité sur chaque carte. B et C : trop générique, taxonomie maison de 20 causes et 30 recettes | **Taxonomie maison** comme clé principale ; **code PCF optionnel** (niveaux 1-2), rempli par la consultante après la mission, jamais en atelier. Licence du PCF 8.0 à relire avant usage commercial. | La réutilisation se fait sur le couple (cause, étape), pas sur un code ; le PCF reste utile comme check-list de couverture et comme pont futur vers les grands outils. |
| 3 | **Modèle objet-centré** | A et D : objets et événements dès le début. B : une feuille de relevé suffit | Les deux : la **feuille de relevé a trois colonnes « quel objet, quelle étape, quelle heure »** (B cite elle-même les trois colonnes de Microsoft) ; quand on code, ce sont les tables `objet`, `evenement`, `evenement_objet` de D. Pas de perspectives ni d'atomes avant le mois 4. | L'idée objet ne coûte qu'une colonne ; l'ambition OCEL complète coûte des semaines. |
| 4 | **Référentiel versionné, modèle cible, conformance** (A) | A : indispensable. D : reporté. B, C : prématuré | Version légère : la recommandation désigne une étape, et « les 3 choses à faire lundi » est la version cible. Versions formelles (observée, cible, réalisée) et règles vérifiables (« tout article est trié sous 48 h ») en phase 2. | A a raison que le suivi à 3 mois exige de savoir ce qu'on compare ; la version légère le permet sans table supplémentaire. |
| 5 | **Journal de bord du client à 1 clic** | B : le client ne saisira rien. D : trivial techniquement. C : données nominatives sur le temps de travail | **Relevé papier de trois jours** rempli avec la consultante, par rôle et non par personne ; version téléphone seulement si un client la demande. | Le risque d'adhésion (B) et le risque RGPD / AI Act (C) l'emportent sur la facilité technique. |
| 6 | **Base inter-clients** | A : extraction anonymisée k ≥ 5 à chaque clôture. C : pas de base sans clause contractuelle, règle d'écriture sans données, seuil de deux clients. D : schéma `commun` sans clé client, pipeline de promotion avec liste de contrôle humaine, k compte des espaces distincts | **Tout C et tout D** : clause de capitalisation dans chaque contrat ; patrons écrits sans données dès la rédaction ; relecture humaine ; une recette entre dans la base après deux clients ; aucune statistique sous cinq espaces. En phase 0 : le tableur « patrons » n'a pas de colonne « client ». | La base est la seule valeur cumulative du projet et son point juridique le plus fragile : elle mérite ces trois verrous. |
| 7 | **Hors ligne** | Brouillon : règle d'ergonomie. D : décision coûteuse, limitée à la capture. B : un carnet | Phase 0 : carnet et appareil photo. Phase 1 : capture seule avec file d'événements locale (D). Pas de lecture hors ligne. | |
| 8 | **Assistant IA pendant l'atelier** | Brouillon : agent de relance en direct. B : jamais pendant l'atelier. D : appels asynchrones | **L'IA intervient après** : transcription, compte rendu d'une page avant de quitter les lieux, trois hypothèses de cause. C'est la première brique codée. | La relation prime ; c'est aussi là que l'IA fait gagner le plus de temps (hypothèse B : une heure par mission). |
| 9 | **Scoring des idées** | A : deux niveaux, poids, seuils, coût par transaction. B : cinq questions à l'oral, trois couleurs. C : l'idée, pas l'algorithme | Niveau 1 = les cinq questions, poids en configuration, verdict « faire maintenant / préparer / oublier », critère disqualifiant « changement majeur attendu ». Niveau 2 (volume annuel, temps unitaire, coûts ponctuels et récurrents) seulement quand un relevé existe. | |
| 10 | **Modèle économique** | Brouillon : pack 2 heures à prix fixe. C : l'artisan ne paie pas, vendre à un financeur. B : chronométrer et facturer | **Question ouverte pour Faty** (§ 8). Hypothèse de travail : mission 1 (ARDAN) facturée à une structure ; mission 2 (boulangerie) sert à tester le consentement à payer, éventuellement via un réseau (CMA, collectif, franchise). | Aucune preuve de marché dans un sens ou l'autre. |
| 11 | **Annuaire de prestataires** | Brouillon : commission possible si affichée. C : pas de commission avant que la confiance soit établie | Annuaire sans commission en phase 1 et 2 ; si commission un jour : contractuelle, visible sur chaque fiche, classement indépendant de la rémunération. | |
| 12 | **Outil de départ** | B et C : Notion ou tableur. D : pas Notion pour les données client (pas d'isolation par ligne, pas de journal) | Phase 0 : un dossier par client dans un stockage de fichiers avec historique (Drive ou équivalent), **jamais deux clients dans un même document** ; tableur « patrons » séparé et sans nom de client. Dès la phase 1, les données client passent en base avec sécurité par ligne. | D a raison sur la cible ; B et C ont raison sur le coût d'entrée. La règle « jamais deux clients dans un document » rend la transition propre. |
| 13 | **Fonctionnalités « consultante »** (devis, facture, temps passé, rappels) | B : sans ça, elle n'ouvrira pas l'outil. Les autres : silence | Adoptées en phase 0 (modèles) ; en phase 1, une ligne « mission » avec temps passé, prix, coût IA. Le projet mesure dès la première mission ce qu'une mission coûte. | |

## 6. Risques consolidés (classés)

| # | Risque | Gravité | Origine | Parade retenue |
|---|---|---|---|---|
| 1 | Personne ne paie un diagnostic TPE (offres gratuites CMA/CCI, aides qui financent l'investissement et non le conseil) | Élevée | C | Vendre une prestation à un financeur ou un réseau ; tester le consentement à payer en mission 2 ; ne pas construire avant d'avoir une réponse |
| 2 | La base inter-clients viole une clause de confidentialité ou le secret des affaires | Élevée | C, D | Clause de capitalisation dans le contrat type ; règle d'écriture sans données ; relecture ; seuil de deux clients |
| 3 | Fuite entre clients dans une plateforme multi-locataire | Élevée | D, brouillon | Sécurité par ligne forcée sur toutes les tables client, test d'isolation à chaque déploiement, clé de service réservée aux tâches de fond |
| 4 | L'IA invente un chiffre ou une cause dans un livrable, et la consultante en répond | Élevée | B, C, D | Mode « hypothèses à vérifier », champ « comment vérifier », chiffres uniquement issus de relevés ou de citations, relecture obligatoire, journal des appels IA, RC pro souscrite |
| 5 | La construction mange le temps de mission | Élevée | B, C | Phase 0 sans code ; go/no-go après deux missions ; coder uniquement les étapes qui coûtent plus d'une heure |
| 6 | Données de salariés (noms, temps, « Marie refait deux fois ») traitées sans cadre ; requalification AI Act si l'outil sert à évaluer le travail | Élevée | C | Rôles et non noms, finalité écrite excluant l'évaluation individuelle, information des participants, registre pré-rempli, AIPD si relevé d'activité ; avis juridique à prévoir |
| 7 | Les éditeurs ferment la fenêtre (plan gratuit Celonis, ARIS Basic gratuit, Power Automate Premium, Process Consulting Agent SAP) | Moyenne | C | Investir dans la méthode, la relation terrain et la base de patrons, pas dans l'algorithme |
| 8 | Dépendance et dérive de coût des fournisseurs d'IA | Moyenne | C, D | Passerelle unique, invites versionnées, jeu d'évaluation rejoué à chaque changement, deux fournisseurs dont un européen, coût IA mesuré par mission (hypothèse D : environ 1 $ par mission) |
| 9 | Base de patrons vide pendant des mois | Moyenne | A, B, C, D | 20 patrons écrits à la main avant la première mission ; deux packs métier rédigés avant les missions |
| 10 | Le client ne saisit rien (journal, avant/après) | Moyenne | B | Relevé papier avec la consultante ; appel téléphonique à J+10, J+30, J+90 au lieu d'un formulaire |
| 11 | Licence du PCF 8.0 et licence AGPL de PM4Py | Moyenne | A, D | Relire la licence PCF avant toute offre payante ; PM4Py interdit dans l'application (service séparé ou licence commerciale, ou deux requêtes SQL) |
| 12 | Sur-modélisation en atelier | Moyenne | A, B | Les objets et étapes viennent du pack métier ; l'atelier n'en crée qu'exceptionnellement ; pas de tag en atelier |
| 13 | Conflit d'intérêts de l'annuaire | Moyenne | C | Pas de commission tant que la confiance n'est pas établie |
| 14 | Perte de la file hors ligne, photos qui grossissent | Faible | D | Indicateur « N événements non envoyés », compression côté client, purge à la fin de la conservation |

## 7. MVP priorisé

### Phase 0 — « Deux missions à la main, structurées » (semaines 1 à 6, zéro code)

| # | Item | Origine | Effort |
|---|---|---|---|
| 0.1 | Contrat type de mission : clause de capitalisation méthodologique, « recommandations validées par l'humaine, estimations indicatives », droits d'export et d'effacement, information des participants ; registre des traitements pré-rempli | C | Faible (un juriste, une demi-journée) |
| 0.2 | RC pro souscrite, couverture de l'erreur de conseil assisté par IA vérifiée | C | Faible |
| 0.3 | Trame d'atelier à 12 questions + tableau libre ; les 5 questions du High Level Assessment sur un post-it ; critère « changement majeur attendu » | B, A | Faible |
| 0.4 | Modèles : fiche « ce qu'il a déjà », feuille de relevé 3 jours (objet / étape / heure, par rôle), fiche recommandation en 7 champs, « les 3 choses à faire lundi », compte rendu d'une page, devis, facture | B, C, A, D | Faible |
| 0.5 | Tableur « missions » (une ligne par mission : temps passé, prix, coût IA, patrons, décisions) et tableur « patrons » sans colonne client ; un dossier par client, jamais deux clients dans un document ; colonnes = schéma D | B, D | Faible |
| 0.6 | Consignes IA versionnées (fichiers datés) pour trois tâches : transcrire et résumer l'atelier, proposer trois hypothèses de cause, relire une fiche recommandation ; données minimisées avant envoi ; journal des appels (date, consigne, modèle, texte, modifications) | C, D | Faible |
| 0.7 | Taxonomie maison amorcée : 20 causes, 30 recettes ; deux packs métier (veille, boulangerie) avec objets, 10 indicateurs, 10 problèmes types, 10 solutions types | C, A | Moyen |
| 0.8 | Jouer ARDAN et la boulangerie de bout en bout ; chronométrer chaque étape ; mesurer le coût IA ; appels J+10 et J+30 | B, C | Moyen (c'est le vrai travail) |

**Point de décision après la mission 2** (go/no-go du code) : quelqu'un a payé ou s'est engagé à payer ; au moins trois étapes ont coûté plus d'une heure de recopie ou de mise en forme ; les colonnes du tableur « missions » sont stables.

### Phase 1 — « Premier code, noyau strict » (mois 2 à 4)

| # | Item | Origine | Effort |
|---|---|---|---|
| 1.1 | Noyau : `espace`, `membre`, sécurité par ligne forcée, test d'isolation automatique, export complet, suppression effective | D | Moyen |
| 1.2 | Journal immuable + trois tables d'événements (`objet`, `evenement`, `evenement_objet`), alimentées d'abord par les cartes d'atelier et les relevés | D, A | Moyen |
| 1.3 | Fichiers de configuration métier validés par schéma (trame, 12 questions, causes, pondérations, textes) pour `boulangerie` et `dispositif-regional` | D, A, B | Faible |
| 1.4 | Passerelle IA : invites versionnées, journal des appels, sortie structurée, deux fournisseurs, jeu d'évaluation de 10 cas par invite | D, C | Moyen |
| 1.5 | Première brique visible : transcription de l'atelier et compte rendu d'une page, citations en tête, relecture obligatoire, envoi tracé | B, D | Moyen |
| 1.6 | Fiche recommandation (7 champs) versionnée par le journal, rattachée à une étape, boutons client « fait / plus tard / pas pour moi » avec raison ; score à 5 questions pondéré | A, C, D | Faible |
| 1.7 | Rapport Markdown → PDF, chaque chiffre avec sa source ; ligne « mission » avec temps, prix, coût IA ; rappels J+10, J+30, J+90 | D, B | Moyen |
| 1.8 | Atelier sur téléphone (cartes unifiées, photo, dictée, file hors ligne de capture) **seulement si** la phase 0 a montré que la double saisie carnet → écran coûte plus d'une heure par mission | D, B | Fort |

### Phase 2 — « Mesurer et apprendre » (mois 4 à 9)

| # | Item | Origine |
|---|---|---|
| 2.1 | Import CSV générique (correspondance quoi / quand / qui / objet) ; premiers usages : export de mails ARDAN, ventes de la boulangerie ; deux requêtes SQL (successions directes, durées médianes) | D |
| 2.2 | Schéma `commun` : patrons, pipeline de promotion avec liste de contrôle, recherche par clés ; statistiques seulement à partir de cinq espaces distincts | D, C |
| 2.3 | Versions observée / cible par processus, règles vérifiables (« atomes ») sur les relevés, diff dans le rapport | A |
| 2.4 | Annuaire de prestataires sans commission, lien de partage d'une recommandation à durée limitée | brouillon, C, D |
| 2.5 | Niveau 2 du scoring (volume annuel, temps unitaire, coûts ponctuels et récurrents) quand un relevé existe | A |

### Plus tard (après 9 mois, uniquement sur demande d'une mission)

Perspectives et conformance à la Celonis, benchmarks inter-clients, export OCEL 2.0 et BPMN pour un prestataire, agents d'exécution sous contrôle (règle de tri installée après validation, avec retour arrière), multilingue, temps réel multi-appareils. Retirés de la feuille de route : offre grands groupes, connecteurs vers Celonis / Signavio / Microsoft, PM4Py dans l'application.

## 8. Décisions à prendre par Faty

1. **Modèle économique** : à qui vend-on la première mission ARDAN (la structure, la CCI, la région) et que teste-t-on avec la boulangerie (prix fixe, réseau, gratuité contre témoignage) ?
2. **Périmètre juridique** : budget pour un contrat type et un avis sur l'AI Act (finalité, données de salariés) avant la mission 1.
3. **Go/no-go du code** après la mission 2, sur les trois critères du § 7.
4. **Fournisseurs d'IA** : lesquels tester (au moins un européen) et politique de rétention des données envoyées.
5. **Taxonomie** : confirmer « maison d'abord, PCF en option » et relire la licence du PCF 8.0.
6. **Dépôt et outils de phase 0** : où vivent les dossiers clients (stockage avec historique) et le tableur « patrons ».

## 9. Ce qui reste non vérifié

- Pages officielles non lues (celonis.com, signavio.com, docs.uipath.com, aris.com, skan.ai, apqc.org, cnil.fr) : faits tirés d'extraits de recherche.
- Dates du haut risque de l'AI Act (Digital Omnibus), décision CNIL de juillet 2026 citée par un cabinet, tarifs Too Good To Go, règle en vigueur sur la certification des caisses : à confirmer avant tout conseil au client.
- Plan gratuit Celonis : sources contradictoires sur sa disponibilité actuelle.
- Licence du PCF 8.0 ; conditions commerciales de PM4Py.
- Organisation réelle d'ARDAN et outils réels de la boulangerie : à relever en mission.
