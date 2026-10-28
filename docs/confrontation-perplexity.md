# Confrontation des deux études — Claude (quatre agents) et Perplexity Pro

Version 0.1 du 28 octobre 2026, **avant lecture du rapport Perplexity**. Les sections 1 à 3 seront remplies à réception du rapport ; les sections 4 à 6 sont des brouillons révisés à partir des consignes de Faty du 28 octobre et seront ajustés ensuite. Rien n'est codé.

## 0. Cadre fixé par Faty le 28 octobre 2026

Ambition : une plateforme de conseil IA ergonomique, utilisable immédiatement chez ARDAN et dans une boulangerie, avec une architecture évolutive permettant d'ajouter des capacités avancées dans trois mois.

Arbitrages de la synthèse Claude **non validés** à ce stade :

| Arbitrage Claude (synthèse § 5) | Position de Faty | Conséquence pour ce document |
|---|---|---|
| Phase 0 obligatoire : deux missions avec modèles et tableurs avant tout code | Non validé | Le MVP est une application interactive dès les premiers ateliers (§ 5). Les modèles papier restent un repli, pas un passage obligé. |
| Offre grands groupes retirée de la feuille de route | Non validé | Les grands groupes restent dans la vision à long terme, comme **module futur** (§ 4.6, § 6). |
| Bibliothèque de connaissances limitée (taxonomie maison de 20 causes, statistiques seulement à partir de 5 clients, patron validé après 2 clients) | Non validé comme limite définitive | Les garde-fous juridiques restent (clause de capitalisation, réécriture sans données, relecture humaine) ; les plafonds deviennent des **réglages** révisables, pas des limites de conception. |
| Report systématique des fonctionnalités innovantes (perspectives, conformance, agents, import, benchmarks) | Non validé | Aucune idée n'est supprimée ; chaque idée non retenue pour le MVP est classée **module futur** avec son prérequis (§ 4.6). |
| Nouveau : architecture d'agents **Hermes**, sans dépendance exclusive à ce moteur | Demandé | Couche d'agents portable (§ 4.4) : compétences en Markdown, outils via MCP, mémoire dans notre base ; Hermes est un moteur d'exécution parmi d'autres. |

Règle de lecture : ne pas défendre automatiquement les arbitrages des quatre agents ; confronter les deux études point par point ; séparer faits, hypothèses et recommandations.

## 1. Matrice comparative des recommandations

*À remplir à réception du rapport Perplexity.* Colonnes prévues : sujet ; recommandation de l'étude Claude (source : fiche ou perspective) ; recommandation Perplexity (source : section du rapport) ; convergence / divergence ; position retenue ; ce qu'il faut vérifier.

Sujets déjà positionnés côté Claude, pour accélérer le remplissage :

| Sujet | Étude Claude | Perplexity | Verdict |
|---|---|---|---|
| Observation des processus | Déclarative et consentie ; pas de capture d'écran (CNIL) | | |
| Modèle de données | Objets, événements, liens qualifiés inspirés d'OCEL 2.0 ; journal immuable | | |
| Taxonomie | Maison d'abord, PCF 8.0 en option | | |
| Scoring des idées | Cinq questions du High Level Assessment d'Automation Hub, poids par métier, deux niveaux | | |
| Recommandations | Fiche en 7 champs rattachée à une étape, avec les outils existants | | |
| Base inter-clients | Schéma commun sans clé client, promotion avec relecture humaine, clause contractuelle | | |
| IA | Passerelle unique, invites versionnées, journal des appels, validation humaine, deux fournisseurs | | |
| Agents | Assistant après l'atelier d'abord ; agents d'exécution sous contrôle plus tard | | |
| Hors ligne | Capture seulement, file d'événements locale | | |
| Rapport | Markdown assemblé depuis les données, un chiffre une source, PDF | | |
| Modèle économique | Risque n° 1 : personne ne paie ; vendre à des financeurs | | |
| Juridique | Contrat type, RC pro, registre, AIPD, AI Act art. 4 et 50 | | |
| Grands groupes | Module futur (position révisée) | | |
| Pile technique | Supabase + Next.js (PWA), Postgres, pgvector si besoin, pas de PM4Py dans l'application | | |
| Standards | OCEL 2.0, XES, BPMN 2.0 en export, MCP, A2A | | |

## 2. Fonctionnalités complémentaires à intégrer

*À remplir à réception du rapport Perplexity.* Chaque fonctionnalité sera classée : MVP (jour 1 à 30), module 90 jours, module 180 jours, module futur ; avec son prérequis technique et son risque.

## 3. Contradictions et points à vérifier

*À remplir à réception du rapport Perplexity.* Déjà connus côté Claude (synthèse § 9) : pages éditeurs non lues en entier ; plan gratuit Celonis aux sources contradictoires ; dates du haut risque de l'AI Act ; licence du PCF 8.0 ; conditions commerciales de PM4Py ; organisation réelle d'ARDAN et outils réels de la boulangerie.

## 4. Architecture cible modulaire et évolutive (brouillon v0, à ajuster)

### 4.1 Principes

1. **Un noyau figé** (espaces isolés, journal immuable, objets et événements, passerelle IA) et **tout le reste en modules** activables par configuration, y compris les modules « avancés » et « grands groupes ».
2. **Les métiers sont des packs** : trame d'atelier, objets types, causes, indicateurs, solutions types, pondérations, textes. Un nouveau métier n'est pas du code.
3. **Les agents sont des compétences portables** : une compétence est un fichier Markdown (quoi faire, quand, quoi éviter), les outils sont exposés via MCP, la mémoire est dans notre base. Hermes Agent peut les exécuter ; un autre moteur aussi.
4. **Rien n'est supprimé** : une capacité non livrée est un module futur avec un prérequis écrit.

### 4.2 Noyau (jour 1)

Repris de `docs/architecture.md` § 2 : `espace`, `membre`, `mission`, `carte`, `recommandation`, `objet`, `evenement`, `evenement_objet`, `journal` ; schéma `commun` pour les patrons ; `invite`, `appel_ia`, `prestataire`. Sécurité par ligne forcée, export complet, suppression effective, test d'isolation automatique.

### 4.3 Modules applicatifs

| Module | Contenu | Quand |
|---|---|---|
| Atelier interactif | Questions guidées et tableau libre unifiés, cartes avec étiquette objet, photo, dictée, file hors ligne de capture | MVP |
| Diagnostic | Causes, cinq questions pondérées, trois hypothèses à vérifier | MVP |
| Recommandations | Fiche 7 champs, outils existants, décision client, « 3 choses à faire lundi » | MVP |
| Rapport | Compte rendu du jour même, Markdown → PDF, un chiffre une source | MVP |
| Suivi | Rappels J+10, J+30, J+90 ; mesure avant / après | MVP |
| Mission et facturation | Ligne mission (temps, prix, coût IA), devis, facture | MVP |
| Import et mesure | CSV générique, correspondance de colonnes, successions et durées médianes | 90 jours |
| Connaissances communes | Promotion avec relecture, recherche par clés puis similarité ; seuils réglables | 90 jours |
| Versions et règles | Processus observé / cible / réalisé, règles vérifiables (atomes), diff dans le rapport | 90 jours |
| Perspectives | Filtres nommés objets + événements + relations (à la Celonis) | 180 jours |
| Benchmarks | Comparaisons inter-clients anonymisées, seuils réglables | 180 jours |
| Annuaire | Prestataires, lien de partage à durée limitée | 90 jours |
| Exports standards | OCEL 2.0, XES, BPMN 2.0 pour prestataires et grands comptes | 180 jours |
| Grands groupes | Connecteurs vers Celonis, Signavio, Microsoft ; SSO ; rôles multi-consultants ; audit renforcé | Module futur |

### 4.4 Couche d'agents (Hermes et au-delà)

Faits vérifiés sur **Hermes Agent** (Nous Research) : cadre d'agents open source sous licence MIT, lancé en février 2026 ; compétences décrites en fichiers Markdown compatibles agentskills.io ; mémoire par couches ; passerelle vers plusieurs canaux de messagerie ; prise en charge de MCP en client et en serveur ; fournisseurs de modèles interchangeables (sources : documentation officielle hermes-agent.nousresearch.com et articles de 2026 ; chiffres d'adoption contradictoires selon les sources, non repris).

Proposition :

| Élément | Choix | Pourquoi |
|---|---|---|
| Format des compétences | Fichiers Markdown versionnés dans le dépôt (`agents/skills/`), un par tâche : résumer l'atelier, proposer trois hypothèses, relire une fiche, préparer la rediffusion de veille, promouvoir un patron | Lisible par Hermes et par tout autre moteur ; relecture humaine possible |
| Outils | Serveur MCP maison exposant les actions autorisées (lire une mission, proposer une carte, proposer une recommandation, jamais écrire sans validation) | Indépendant du moteur ; les droits sont dans notre serveur, pas dans l'agent |
| Mémoire | Dans notre base (journal, patrons), pas dans la mémoire interne du moteur | Isolation par client, export, effacement |
| Exécution | Hermes Agent comme premier moteur ; passerelle IA maison comme second ; tout moteur qui parle MCP comme troisième | Pas de dépendance exclusive |
| Gouvernance | « Least agency » (OWASP, déc. 2025) : approbation humaine avant toute action à risque ; journal complet des propositions acceptées ou refusées ; agent = acteur dans le journal (agent mining gratuit) | Cohérent avec la synthèse et les pratiques NIST/OWASP |
| Canaux | WhatsApp ou messagerie via la passerelle Hermes pour les rappels J+10/30/90 et la saisie du client (module 90 jours) | Le client répond là où il est déjà |

### 4.5 Pile technique

Inchangée par rapport à `docs/architecture.md` § 5 : Supabase + Next.js (PWA), Postgres, extensions standard, passerelle IA multi-fournisseurs, pas de PM4Py dans l'application. Ajout : conteneur Hermes Agent séparé, qui ne voit la base qu'à travers le serveur MCP maison.

### 4.6 Registre des modules futurs (aucune idée supprimée)

| Idée | Origine | Prérequis | Horizon |
|---|---|---|---|
| Journal de bord du client sur téléphone | brouillon v1 | Canal de messagerie (Hermes) ou PWA client | 90 jours |
| Assistant d'atelier en direct | brouillon v1 | Latence < 5 s mesurée, mode suggestion seulement | 180 jours |
| Perspectives et conformance contre modèle cible | analyse A | Versions et règles livrées | 180 jours |
| Journey modelling côté client final | analyse A | Pack métier avec parcours | futur |
| Niveau 2 du scoring et coût par transaction | analyse A | Import ou relevé disponible | 90 jours |
| Benchmarks inter-clients | brouillon, A | Volume suffisant, seuils réglés | 180 jours |
| Agents d'exécution (règle de tri installée après validation, retour arrière) | brouillon | Couche d'agents et journal | 180 jours |
| Connecteurs Celonis / Signavio / Microsoft, SSO, multi-consultants | brouillon | Demande d'un grand compte, audit sécurité | futur |
| Multilingue | brouillon | Deuxième langue de travail | futur |
| Process mining avancé (variantes, simulation) | éditeurs | Volume d'événements ; service séparé si PM4Py | futur |
| Export OCEL 2.0 / XES / BPMN | standards | Tables objets-événements | 180 jours |
| Marketplace de packs métier | nouveau | 5 packs stabilisés | futur |

## 5. MVP interactif utilisable dès les premiers ateliers (brouillon v0)

Objectif : la consultante ouvre l'application sur son téléphone ou son portable au premier atelier ARDAN et à la boulangerie, sans passage obligé par des tableurs. Les modèles papier restent disponibles en repli (coupure réseau, client qui refuse l'écran).

### 5.1 Parcours unique

Mission → Atelier → Cartes → Problèmes → Recommandations → Rapport, un bouton « Plus » pour le reste.

### 5.2 Écrans du MVP

| Écran | Ce qu'il fait | Repli papier |
|---|---|---|
| Nouvelle mission | Choix du pack métier (boulangerie, dispositif régional), fiche « ce qu'il a déjà », information des participants affichée et cochée | Fiche imprimée |
| Atelier | 12 questions du pack à gauche, tableau de cartes à droite (téléphone : deux onglets) ; une réponse crée une carte ; une carte porte étape, douleur, cause ou idée, qui (rôle), outil, durée, douleur 1 à 5, étiquette objet ; photo et dictée ; fonctionne sans réseau pour la capture | Cartes papier photographiées puis saisies |
| Ce que le client a dit | Citations mot pour mot, réordonnables | Carnet |
| Problèmes et causes | Les douleurs regroupées ; trois hypothèses de cause proposées par l'IA avec la question ou la mesure pour trancher ; validation par la consultante | Post-it |
| Score | Cinq questions, poids du pack, verdict « faire maintenant / préparer / oublier », critère « changement majeur attendu » | Post-it |
| Recommandations | Fiche 7 champs ; « 3 choses à faire lundi » avec rôle et date ; boutons client fait / plus tard / pas pour moi | Fiche imprimée |
| Rapport | Compte rendu d'une page assemblé depuis les cartes, citations en tête, chaque chiffre avec sa source, relecture puis envoi tracé | Dictée dans la voiture |
| Mission | Temps passé par étape, prix, coût IA, rappels J+10/30/90 | Tableur |

### 5.3 Ce que le MVP fait avec l'IA (et seulement cela)

Transcription et résumé de l'atelier ; trois hypothèses de cause ; relecture d'une fiche recommandation ; paragraphes de liaison du rapport. Chaque appel passe par la passerelle (invite versionnée, journal, validation humaine). Les compétences correspondantes sont écrites en Markdown dès le MVP pour être exécutables par Hermes plus tard.

### 5.4 Ce que le MVP ne fait pas encore

Import de fichiers, base commune en production (les patrons sont rédigés à la main et chargés), versions formelles, agents d'exécution, multi-consultants.

### 5.5 Contenu prêt pour ARDAN et la boulangerie

Deux packs métier écrits avant le premier atelier : objets (source, article, bulletin, destinataire ; fournée, produit, commande, client), 12 questions, 10 indicateurs, 10 problèmes types, 10 solutions types avec les outils existants (filtres de messagerie, alertes, tableur partagé, WhatsApp Business, export de caisse), pondérations du score.

## 6. Feuille de route à 30, 90 et 180 jours (brouillon v0)

### Jour 0 à 30 : MVP interactif en atelier

- Noyau (espaces, sécurité par ligne, journal, objets-événements, export, suppression, test d'isolation).
- Passerelle IA (invites versionnées, journal, deux fournisseurs, jeu d'évaluation de 10 cas par invite).
- Écrans du § 5.2 ; deux packs métier ; 20 patrons rédigés à la main.
- Contrat type, RC pro, registre des traitements (prérequis juridiques, en parallèle).
- Premier atelier ARDAN et premier atelier boulangerie avec l'application ; repli papier prêt.
- Mesures : temps par étape, coût IA par mission, taux de recommandations IA modifiées.

### Jour 30 à 90 : mesurer, apprendre, brancher les agents

- Import CSV générique (export de mails ARDAN, ventes de la boulangerie) et deux calculs (successions, durées médianes).
- Base commune en production : promotion avec relecture, recherche par clés ; seuils réglables.
- Versions observée / cible et règles vérifiables ; diff dans le rapport.
- Couche d'agents : serveur MCP maison, premières compétences Markdown exécutées par Hermes Agent en mode suggestion ; rappels J+10/30/90 par messagerie.
- Annuaire de prestataires ; niveau 2 du scoring ; test du modèle économique (financeurs, réseaux).

### Jour 90 à 180 : capacités avancées

- Perspectives et conformance ; benchmarks inter-clients ; exports OCEL 2.0, XES, BPMN.
- Agents d'exécution sous contrôle (action après validation, retour arrière) sur un premier cas (règle de tri de veille).
- Assistant d'atelier en direct si la latence le permet.
- Préparation du module grands groupes : exigences de sécurité, SSO, multi-consultants, premiers connecteurs ; décision sur la base d'une demande réelle.

### Points de décision

Jour 30 : les deux ateliers ont-ils été menés dans l'application ? Jour 90 : quelqu'un paie-t-il, et la base commune produit-elle une recommandation réutilisée ? Jour 180 : une demande grand compte justifie-t-elle le module ?

## 7. Sources

- Synthèse et fiches : `docs/synthese-consolidee.md`, `research/claude/`.
- Hermes Agent : documentation officielle https://hermes-agent.nousresearch.com/docs ; fiche de synthèse https://agentic-ai.readthedocs.io/en/latest/AgentPlatforms/hermes-agent/ ; articles de 2026 (fast.io, HackerNoon, DEV) aux chiffres contradictoires, non repris.
- Gouvernance des agents : OWASP Top 10 for Agentic Applications (décembre 2025), NIST AI 100-2 (mars 2025), voir `research/claude/04`.
- Rapport Perplexity Pro : à déposer dans `research/perplexity/` avec sa date et la question posée.
