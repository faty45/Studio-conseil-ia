# Confrontation des deux études — Claude (quatre agents) et Perplexity Pro

Version 1.0 du 28 octobre 2026. Sources : étude Claude (`docs/synthese-consolidee.md`, `research/claude/`), rapport Perplexity Pro (`research/perplexity/rapport-2026-10-28-synthese.md`, synthèse structurée transmise par Faty, pas transcription intégrale, sans URL). Rien n'est codé.

Convention : **Fait** = vérifié et daté dans l'une des deux études ; **Hypothèse** = non sourcé ; **Position retenue** = proposition soumise à Faty. Les arbitrages des quatre agents Claude ne sont pas défendus par principe : quand Perplexity ou Faty a raison, c'est écrit.

## 0. Cadre fixé par Faty le 28 octobre 2026

Ambition : plateforme de conseil IA ergonomique, utilisable immédiatement chez ARDAN et dans une boulangerie, architecture évolutive permettant d'ajouter des capacités avancées dans trois mois, architecture d'agents Hermes sans dépendance exclusive.

| Arbitrage Claude non validé | Ce que dit Perplexity | Position retenue |
|---|---|---|
| Phase 0 obligatoire avec tableurs avant tout code | Application web utilisable dès les premiers ateliers ; architecture évolutive, mise en œuvre progressive | **Claude retire la phase 0.** Le MVP est interactif (§ 5). Les modèles papier restent un repli en cas de coupure ou de refus de l'écran. |
| Grands groupes retirés de la vision | Tester le modèle TPE « sans abandonner la possibilité d'adresser PME et grands groupes » | **Claude retire l'exclusion.** Grands groupes = module futur avec prérequis (§ 4.7). |
| Bibliothèque limitée (20 causes, seuils fixes) | Mini-référentiel d'environ 100 activités propre à Studio, extensible ; catalogue de patrons candidat / éprouvé | **Claude révise.** Référentiel d'activités + causes + recettes, tailles de départ et non plafonds ; seuils réglables (§ 4.3). |
| Report systématique des fonctions innovantes | Fonctions avancées conservées dans la vision, activables par configuration, pas toutes codées en V1 | **Convergence avec Perplexity.** Registre des modules futurs, aucune idée supprimée (§ 4.7). |
| Nouveau : agents Hermes | « Passerelle indépendante pour Hermes et autres moteurs » ; permissions minimales, validation humaine, journalisation, idempotence, reprise sur erreur | **Convergence.** Couche d'agents portable (§ 4.5). |

## 1. Matrice comparative des recommandations

| # | Sujet | Étude Claude | Rapport Perplexity | Verdict | Position retenue |
|---|---|---|---|---|---|
| 1 | Observation des processus | Déclarative et consentie, pas de capture d'écran (CNIL, sanction 19 déc. 2024) | Capture **ciblée et consentie** de preuves et guides type Scribe (P2) ; checklist CNIL avant toute observation (P14) ; pas de surveillance disproportionnée | Convergence, Perplexity plus précis | Pas d'enregistrement continu ; capture volontaire d'une tâche à la fois (photo, guide pas à pas) après la checklist ; pas d'agent sur les postes |
| 2 | Déroulé de l'atelier | Trame de 12 questions + tableau libre ; cartes unifiées | « 8 questions → carte » en moins de 45 minutes (P1) | Divergence de taille, même esprit | **8 questions cœur** communes à tous les métiers, jusqu'à 4 questions de pack en option ; objectif : carte en 45 minutes, scoring ensuite |
| 3 | Référentiel | Taxonomie maison 20 causes / 30 recettes ; PCF 8.0 en option ; perspective A voulait le PCF au niveau activité | Mini-référentiel francophone artisan / TPE d'environ 100 **activités** propre à Studio, extensible (P3) ; PCF comme principe de taxonomie commune, licence à vérifier | Complémentaires : Perplexity classe ce que les gens **font**, Claude classe **pourquoi ça coince** | Référentiel à trois axes : ~100 activités types (Perplexity), ~20 causes types et ~30 recettes (Claude), correspondance PCF optionnelle. Tailles de départ, pas plafonds |
| 4 | Preuves | « Un chiffre, une source » ; provenance sur chaque donnée (atelier, relevé, import, IA, base) ; champ « comment vérifier » | **Preuves typées** (déclaration / document / observation / trace) avec source et date ; preuve requise avant validation finale, pas pour bloquer l'entretien (P4) | Convergence, Perplexity en fait une entité | La **preuve devient une table** reliée aux problèmes et aux causes ; la provenance Claude en est un attribut ; blocage seulement à la validation du rapport |
| 5 | Causes | Trois hypothèses proposées par l'IA, question ou mesure pour trancher | Causes candidates avec statut hypothèse / validée / invalidée (P5) | Convergence | Statut explicite sur chaque cause ; l'IA ne crée que des « hypothèse » ; seule la consultante passe en « validée » ou « invalidée », avec la preuve |
| 6 | Chiffrage | Fiche en 7 champs (heures, €/mois, dépendances, ce que je suppose, comment vérifier) ; niveau 2 d'Automation Hub quand un relevé existe | Calculateur prudent, hypothèses visibles, distinction **temps libéré / économies de trésorerie** (P6) | Convergence, Perplexity ajoute une distinction utile | Fiche en 8 champs : la ligne « gain » se dédouble en temps libéré et trésorerie ; hypothèses affichées |
| 7 | Scoring des idées | Cinq questions du High Level Assessment, poids par métier, verdict en trois mots, critère disqualifiant | Évaluation rapide puis détaillée, pipeline d'opportunités (via UiPath) | Convergence | Inchangé ; le pipeline d'opportunités (idée → évaluée → retenue → en cours → en service / rejetée) est repris |
| 8 | Patrons intermétiers | Schéma commun sans clé client ; statut candidat / validé / retiré ; validé après deux clients ; stats à partir de cinq espaces | Catalogue de patrons, statut candidat / éprouvé, capitalisation sans données client (P7) ; généralisation + validation humaine + cadre contractuel + examen du risque de réidentification (P11) | Convergence forte | Statuts alignés : candidat → éprouvé → retiré. Les seuils (2 clients, 5 espaces) deviennent des **réglages** modifiables par Faty ; la clause contractuelle et la relecture humaine restent obligatoires |
| 9 | Outils existants | Fiche « ce qu'il a déjà » ; recommandations seulement compatibles | Correspondance solutions ↔ outils présents chez le client (P8) | Convergence | Inchangé ; la correspondance devient une table (solution × outil) pour être réutilisable entre clients |
| 10 | Prestataires | Au moins deux propositions, critères visibles, pas de commission | Critères explicites d'orientation, paramétrables, « non scientifiques » (P9) | Convergence | Critères en configuration ; pas de commission tant que la confiance n'est pas établie |
| 11 | Suivi | Rappels J+10 / J+30 / J+90, mesure avant / après, appel plutôt que formulaire | Boucle J+30 / J+90 avec trois questions et indicateurs avant / après (P10) ; « mesurer les actions réellement appliquées » | Convergence | J+10 (appel court), J+30 et J+90 (trois questions + indicateur) ; l'indicateur de succès du produit = part des recommandations appliquées |
| 12 | Assistant d'atelier | Analyse B : jamais pendant l'atelier ; synthèse : l'IA intervient après (transcription, compte rendu) | Copilote d'atelier pour relances et contradictions, **non intrusif, facultatif** (P12, priorité 2-3) | Divergence modérée | Module **opt-in** à 180 jours en mode suggestion muette ; l'après-atelier reste la priorité |
| 13 | Import et mini process mining | Import CSV générique ; export de mails ARDAN et ventes de la boulangerie ; deux requêtes SQL | Import caseId / activity / timestamp quand les données le permettent (P13) ; **ne pas promettre du process mining avec de simples tickets de caisse** | Divergence utile | Perplexity a raison : les tickets de caisse donnent des **indicateurs** (ventes par heure, invendus), pas un processus. Le libellé change : « mesures » pour la caisse, « mini mining » seulement sur un vrai journal (mails horodatés avec dossiers) |
| 14 | Livrable | Compte rendu d'une page le jour même, Markdown → PDF, un chiffre une source | Livrable en un clic : PDF **et guide opératoire** (P15) | Convergence, Perplexity ajoute le guide | Deux sorties : compte rendu (diagnostic) et guide opératoire (pas à pas pour appliquer les « 3 choses à faire lundi ») |
| 15 | Conformité intégrée | Registre pré-rempli, information des participants, AIPD si relevé, finalité excluant l'évaluation individuelle | Checklist CNIL / RGPD **dans l'application** avant toute observation (P14) | Convergence, Perplexity en fait un écran | Écran « avant d'observer » obligatoire : information, finalité, durée, rôles plutôt que noms, case à cocher horodatée dans le journal |
| 16 | Modèle de données | Mission, carte, recommandation, objets / événements / liens (OCEL léger), journal immuable | Chaîne Mission → Atelier → Processus → Étape → Problème → Preuve → Cause → Solution / patron → Dépendances → Risques → Résultat → Patron générique ; relations Postgres suffisent, graphe seulement si besoin | Complémentaires : Perplexity = axe **diagnostic**, Claude = axe **mesure** et **traçabilité** | Les deux axes dans le même schéma (§ 4.2) ; dépendances et risques deviennent des lignes typées, pas des champs texte |
| 17 | Agents | Après l'atelier d'abord ; agents d'exécution sous contrôle plus tard ; OWASP « least agency » | Permissions minimales, validation humaine pour actions sensibles, journalisation, idempotence, reprise sur erreur ; passerelle indépendante pour Hermes | Convergence | § 4.5 ; ajout explicite de l'idempotence et de la reprise sur erreur dans le contrat des outils MCP |
| 18 | Base technique | Supabase + Next.js (PWA), Postgres, pas de PM4Py dans l'application | PostgreSQL / Supabase ; cloisonnement strict ; fournisseurs LLM encadrés ; rétention | Convergence | Inchangé ; Windmill (cité par Perplexity) évalué comme moteur de workflows auto-hébergé (§ 3) |
| 19 | Ergonomie | Un chemin : mission → atelier → cartes → problèmes → recommandations → rapport ; téléphone d'abord ; hors ligne pour la capture | Exposer seulement **Démarrer / Trouver / Suivre** ; ateliers configurables et versionnés | Complémentaires | Trois verbes à l'écran d'accueil (§ 5.1) ; le chemin Claude vit sous « Démarrer » ; le hors ligne de capture reste (Perplexity n'en parle pas) |
| 20 | Juridique et commercial | Contrat type (clause de capitalisation, validation humaine, export, effacement), RC pro, AI Act art. 4 et 50 | Cadre contractuel pour la capitalisation (P11) ; pseudonymisation ≠ anonymisation | Convergence partielle ; Perplexity ne parle ni de RC pro ni d'AI Act | Garder les points Claude ; Perplexity confirme le point sur la pseudonymisation |
| 21 | Modèle économique | Risque n° 1 : personne ne paie ; vendre à des financeurs | « Modèle économique TPE à tester, sans abandonner PME et grands groupes » | Convergence sur le test, divergence sur la cible | Test en mission 2 ; PME dès 90 jours ; grands groupes en module futur |
| 22 | Phasage | Phase 0 sans code (retirée) | Application dès les premiers ateliers, progressive | Perplexity et Faty l'emportent | § 5 et § 6 |
| 23 | Ce que Claude a et Perplexity n'a pas | Journal immuable, hors ligne de capture, versions observée / cible et règles vérifiables, temps et facturation de la consultante, RC pro, détail Hermes, deux fournisseurs d'IA, jeu d'évaluation des invites | — | Apport Claude | Conservés |
| 24 | Ce que Perplexity a et Claude n'a pas | — | Preuves typées, référentiel d'activités, Démarrer / Trouver / Suivre, guide opératoire, checklist CNIL en écran, temps libéré vs trésorerie, Windmill, « How do I » contextuel (ARIS), modèles de processus copiables (Tallyfy), observation opt-in niveau équipe (Soroco) | Apport Perplexity | Intégrés (§ 2) |

## 2. Fonctionnalités complémentaires à intégrer

Classement : **MVP** (jour 0 à 30), **M90**, **M180**, **Futur** (module avec prérequis). Origine entre parenthèses.

| Fonctionnalité | Origine | Classe | Prérequis / risque |
|---|---|---|---|
| Atelier « 8 questions cœur → carte en 45 minutes », questions de pack en option | Perplexity P1 + packs Claude | MVP | Réécrire les deux packs en 8 + 4 |
| Preuves typées (déclaration / document / observation / trace), source, date ; exigées à la validation du rapport | Perplexity P4 | MVP | Table `preuve` dès le schéma |
| Statut des causes hypothèse / validée / invalidée | Perplexity P5, Claude | MVP | — |
| Fiche recommandation en 8 champs avec temps libéré / trésorerie séparés | Perplexity P6, Claude | MVP | — |
| Écran « avant d'observer » (checklist CNIL / RGPD) horodaté dans le journal | Perplexity P14, Claude | MVP | Texte validé par un juriste |
| Livrable en un clic : compte rendu + guide opératoire | Perplexity P15, Claude | MVP | Modèles de documents |
| Accueil en trois verbes Démarrer / Trouver / Suivre | Perplexity | MVP | — |
| Référentiel d'environ 100 activités types francophones, extensible | Perplexity P3 | MVP (amorce de 40 à 60 activités pour les deux métiers), complété en continu | Rédaction ; éviter de taguer en atelier (analyse B) |
| Capture volontaire d'une tâche (photo, guide pas à pas type Scribe) après la checklist | Perplexity P2 | M90 | Conformité préalable ; une tâche à la fois, jamais en continu |
| Correspondance solutions × outils du client en table réutilisable | Perplexity P8, Claude | M90 | — |
| Critères d'orientation prestataire en configuration | Perplexity P9, Claude | M90 | — |
| Boucle J+30 / J+90 à trois questions par messagerie (passerelle Hermes) | Perplexity P10, Claude | M90 | Couche d'agents |
| Import caseId / activity / timestamp + deux requêtes (successions, durées) ; libellé « mesures » pour la caisse | Perplexity P13, Claude D | M90 | Un vrai journal horodaté disponible |
| Catalogue de patrons candidat / éprouvé avec promotion relue, seuils réglables | Perplexity P7 et P11, Claude | M90 | Clause contractuelle signée |
| Aide contextuelle « Comment je fais ? » dans chaque écran (inspirée d'ARIS) | Perplexity (ARIS) | M90 | Textes d'aide par écran |
| Modèles de processus copiables et modifiables par métier (inspirés de Tallyfy) | Perplexity (Tallyfy) | M90 | Packs stabilisés |
| Versions observée / cible / réalisée et règles vérifiables, diff dans le rapport | Claude A | M90 | Tables objets / événements |
| Copilote d'atelier opt-in, suggestions muettes (relances, contradictions) | Perplexity P12, brouillon Claude | M180 | Latence < 5 s ; test avec deux consultants |
| Perspectives et conformance (à la Celonis), benchmarks inter-clients | Claude A | M180 | Volume ; seuils réglés |
| Exports OCEL 2.0 / XES / BPMN pour prestataires et grands comptes | Claude | M180 | Tables objets / événements |
| Agents d'exécution sous contrôle (action après validation, retour arrière, idempotence) | Claude, Perplexity | M180 | Couche d'agents, journal |
| Simulation « et si » (à la Celonis / Apromore) | Perplexity (Celonis what-if, Apromore) | Futur | Données d'événements suffisantes |
| Text-to-process : conversation → carte corrigeable (à la Signavio), sans BPMN imposé | Perplexity (Signavio) | Futur (prototype possible à M180 sur la transcription d'atelier) | Évaluation de la qualité sur 10 ateliers |
| Observation opt-in au niveau équipe (à la Soroco) | Perplexity (Soroco) | Futur | AIPD, accord du CSE ; probablement hors TPE |
| Module grands groupes : SSO, multi-consultants, audit renforcé, connecteurs Celonis / Signavio / Microsoft | Faty, Perplexity | Futur | Demande réelle, audit sécurité |
| Marketplace de packs métier | Claude | Futur | 5 packs stabilisés |
| Multilingue | Claude | Futur | Deuxième langue de travail |

## 3. Contradictions et points à vérifier

### 3.1 Contradictions tranchées

| Point | Claude | Perplexity | Tranché |
|---|---|---|---|
| Coder avant ou après les premières missions | Après deux missions à la main | Application dès les premiers ateliers | Perplexity et Faty ; repli papier conservé |
| Grands groupes | Hors feuille de route | Possibilité conservée | Perplexity et Faty ; module futur |
| Taille du référentiel | 20 causes, seuils fixes | ~100 activités, extensible | Les deux axes, tailles de départ, seuils réglables |
| Tickets de caisse | Import → événements de vente | Pas de « process mining » avec des tickets | Perplexity : la caisse donne des mesures, pas un processus |
| Copilote pendant l'atelier | Jamais (analyse B) | Facultatif, non intrusif | Perplexity, mais à 180 jours et opt-in |
| Preuve | Attribut de provenance | Entité typée, requise à la validation | Perplexity |

### 3.2 Contradictions internes au rapport Perplexity ou avec les faits Claude

- Le rapport cite une capacité Celonis « **Build Experience** » que l'étude Claude n'a pas rencontrée (Data Core et Context Model sont vérifiés, communiqués des 4 novembre 2025 et 12 mai 2026). À vérifier avant de la citer.
- **Apromore** est présenté comme acteur indépendant (« process intelligence et BPMN, simulation, no-code ») ; l'étude Claude a trouvé l'accord de rachat par Salesforce (octobre 2025). L'avenir de l'édition autonome est incertain.
- **Soroco** « observation opt-in et niveau équipe » : déclaration éditeur, non vérifiée par les deux études.
- **Windmill** (workflows et agents open source, auto-hébergement) n'apparaît pas dans l'étude Claude. Licence et modèle commercial à vérifier (hypothèse : licence copyleft pour l'édition communautaire, édition entreprise payante) avant de l'envisager comme moteur de workflows déterministes à côté de Hermes.
- Le rapport est une **synthèse sans URL** : aucune de ses affirmations éditeur n'est datée ni sourcée. Demander le rapport original pour les citations exactes.

### 3.3 Points à vérifier avant la première mission (les deux études)

| Point | Qui vérifie | Pourquoi |
|---|---|---|
| Licence du PCF 8.0 (27 février 2026) pour un usage commercial | Juriste ou lecture du fichier APQC | Les deux études le demandent |
| Dates d'application de l'AI Act (haut risque, transparence) après le Digital Omnibus | Juriste | Analyse C ; absent de Perplexity |
| Texte de la checklist CNIL « avant d'observer » | Juriste, pages cnil.fr (non lues dans cette session) | P14 |
| Organisation réelle d'ARDAN : « deux personnes chargées de la veille, processus et outils inconnus » (Perplexity) | Faty, premier contact | Les packs ARDAN des deux études reposent sur des hypothèses |
| Outils réels de la boulangerie (caisse, tableur, messagerie) | Faty, premier contact | Idem |
| Statut actuel du plan gratuit Celonis et d'Apromore | Recherche ciblée | Sources contradictoires |
| Licence et périmètre de Windmill ; chiffres d'adoption de Hermes Agent | Recherche ciblée | Nouveaux acteurs |
| Conditions commerciales de PM4Py | Si un jour un moteur de mining est voulu | AGPL-3.0 |

## 4. Architecture cible modulaire et évolutive

### 4.1 Principes

1. **Un noyau figé** : espaces isolés, journal immuable, chaîne diagnostic (Perplexity) + axe mesure (Claude), passerelle IA. Tout le reste est un module activable par configuration selon métier et taille.
2. **Deux schémas Postgres** : `client` (isolé par sécurité par ligne, exportable, supprimable) et `commun` (référentiel, patrons, sans clé client).
3. **Métiers et ateliers en configuration versionnée** : 8 questions cœur, questions de pack, activités types, causes, recettes, poids, critères prestataires, textes d'aide. Une mission enregistre la version utilisée.
4. **Couche d'agents portable** : compétences en Markdown, outils via un serveur MCP maison, mémoire dans la base ; Hermes comme premier moteur, pas le seul.
5. **Aucune idée supprimée** : registre des modules futurs (§ 4.7).

### 4.2 Modèle de données (schéma `client`, toutes les tables portent `espace_id`)

Chaîne diagnostic (Perplexity) :

| Table | Rôle | Champs clés |
|---|---|---|
| `espace`, `membre` | Un client, ses accès (consultante / client / prestataire) | voir `docs/architecture.md` |
| `mission` | Une intervention | `statut`, `pack_version`, `temps_passe_min`, `prix`, `cout_ia` |
| `atelier` | Une séance | `date`, `participants_roles[]`, `checklist_observation_ok_le` |
| `processus` | Ce qu'on regarde | `nom`, `activite_ref` (référentiel commun, optionnel), `version` (observée / cible / réalisée, M90) |
| `etape` | Une carte d'atelier | `processus_id`, `texte`, `qui_role`, `outil`, `duree_min`, `objet_type`, `ordre`, `photo_ref`, `question_id` |
| `probleme` | Ce qui coince | `etape_id`, `texte_client` (mot pour mot), `douleur_1_5`, `cause_type_ref` |
| `preuve` | Ce qui l'atteste | `type` (declaration / document / observation / trace), `source`, `date`, `fichier_ref`, `lie_a` (problème, cause ou résultat) |
| `cause` | Pourquoi | `probleme_id`, `texte`, `statut` (hypothese / validee / invalidee), `auteur` (consultante / ia), `preuve_id` |
| `solution` | Quoi faire | `cause_ids[]`, `patron_ref` (commun, optionnel), `quoi`, `outil_client_id`, `heures`, `temps_libere_h_mois`, `tresorerie_eur_mois`, `hypotheses`, `comment_verifier`, `score` (5 réponses + verdict), `pipeline_statut`, `decision_client`, `raison` |
| `dependance` | De quoi ça dépend | `solution_id`, `type` (abonnement / personne / fournisseur / donnee / prestataire), `texte` |
| `risque` | Ce qui peut mal tourner | `solution_id`, `texte`, `gravite`, `parade` |
| `resultat` | Ce qu'on a mesuré | `solution_id`, `indicateur`, `avant`, `a_30j`, `a_90j`, `applique` (oui / partiel / non), `preuve_id` |
| `outil_client` | Ce qu'il a déjà | `nom`, `categorie`, `ne_pas_ecrire` |

Axe mesure et traçabilité (Claude) : `objet`, `evenement`, `evenement_objet` (liens qualifiés, inspirés d'OCEL 2.0), `fichier_import`, `journal` (immuable, insertion seule, `id_client` pour le hors ligne). Hors `client` : `invite`, `appel_ia`, `prestataire`.

Schéma `commun` : `activite_type` (référentiel ~100, code, libellé, métiers, PCF optionnel), `cause_type` (~20), `recette` (~30, solution générique × outil générique), `patron` (statut candidat / éprouvé / retiré, tranches, `nb_clients`), `patron_provenance` (hachage, service uniquement), `critere_prestataire`, `pack_metier` (configuration versionnée).

### 4.3 Réglages (et non limites) de la base commune

| Réglage | Valeur de départ | Qui change |
|---|---|---|
| Clients distincts avant statut « éprouvé » | 2 | Faty |
| Espaces distincts avant toute statistique | 5 | Faty |
| Relecture humaine avant publication d'un patron | obligatoire | non modifiable |
| Clause de capitalisation dans le contrat | obligatoire | non modifiable |

### 4.4 Modules

| Module | Contenu | Horizon |
|---|---|---|
| Noyau | espaces, journal, chaîne diagnostic, objets / événements, export, suppression, test d'isolation | MVP |
| Démarrer (atelier) | 8 questions cœur, cartes, photo, dictée, hors ligne de capture, écran « avant d'observer » | MVP |
| Trouver (diagnostic et solutions) | problèmes, preuves, causes avec statut, score, fiche 8 champs, « 3 choses à faire lundi », correspondance outils | MVP |
| Suivre (livrables et résultats) | compte rendu + guide opératoire, rappels, résultats J+30 / J+90, ligne mission | MVP |
| IA | passerelle unique, invites versionnées, journal des appels, deux fournisseurs, jeu d'évaluation | MVP |
| Référentiel et packs | activités, causes, recettes, packs métier, aide contextuelle | MVP (amorce) puis continu |
| Connaissances communes | promotion relue, patrons, recherche par clés puis similarité | M90 |
| Mesure | import caseId / activity / timestamp, successions, durées ; mesures de caisse | M90 |
| Versions et règles | observée / cible / réalisée, atomes, diff | M90 |
| Agents | serveur MCP maison, compétences Markdown, Hermes, rappels par messagerie | M90 |
| Capture volontaire | guides pas à pas type Scribe | M90 |
| Avancé | copilote opt-in, perspectives, conformance, benchmarks, exports standards, agents d'exécution | M180 |
| Grands groupes | SSO, multi-consultants, audit, connecteurs | Futur |

### 4.5 Couche d'agents (Hermes et au-delà)

Faits : Hermes Agent (Nous Research) est un cadre d'agents open source sous licence MIT lancé en février 2026, avec compétences en fichiers Markdown compatibles agentskills.io, mémoire par couches, passerelle multi-canaux, prise en charge de MCP en client et en serveur, fournisseurs de modèles interchangeables (documentation officielle ; chiffres d'adoption contradictoires selon les sources, non repris).

| Élément | Choix | Pourquoi |
|---|---|---|
| Compétences | Fichiers Markdown versionnés (`agents/skills/`) : résumer l'atelier, proposer des causes « hypothèse », relire une fiche, préparer la rediffusion de veille, relancer à J+30 / J+90, promouvoir un patron | Lisibles par Hermes et par tout autre moteur ; relecture humaine |
| Outils | Serveur MCP maison : lire une mission, proposer une étape / cause / solution (statut « proposé »), jamais écrire une validation ; chaque outil **idempotent** avec clé de requête, **reprise sur erreur** par rejeu du journal (Perplexity) | Les droits sont dans notre serveur ; pas de dépendance au moteur |
| Mémoire | Journal et patrons dans notre base ; pas de mémoire interne du moteur sur les données client | Isolation, export, effacement |
| Moteurs | Hermes Agent (conteneur séparé) ; passerelle IA maison ; tout moteur MCP ; Windmill envisageable pour les workflows déterministes (licence à vérifier) | Pas de dépendance exclusive |
| Gouvernance | « Least agency » ; approbation humaine avant toute action à risque ; l'agent est un acteur du journal ; propositions acceptées / refusées comptées (agent mining) | OWASP (déc. 2025), NIST (2025-2026), Perplexity |
| Canaux | Messagerie du client via la passerelle Hermes pour J+30 / J+90 et la saisie de résultats | Le client répond là où il est |

### 4.6 Pile technique

Supabase + Next.js (PWA), Postgres, extensions standard, région Union européenne ; sécurité par ligne forcée, clé de service réservée aux tâches de fond, test d'isolation à chaque déploiement ; passerelle IA multi-fournisseurs avec sortie structurée ; pas de PM4Py dans l'application ; Hermes dans un conteneur séparé qui ne voit la base qu'à travers le serveur MCP.

### 4.7 Registre des modules futurs (aucune idée supprimée)

Voir § 2 pour les classes M90 / M180 / Futur. S'y ajoutent, en Futur avec prérequis : process mining avancé (variantes, simulation « et si »), text-to-process depuis la transcription, observation opt-in niveau équipe, marketplace de packs, multilingue, module grands groupes, journey modelling côté client final (analyse A).

## 5. MVP interactif utilisable dès les premiers ateliers

### 5.1 Accueil en trois verbes

- **Démarrer** : nouvelle mission → pack → « avant d'observer » → atelier.
- **Trouver** : problèmes, preuves, causes, score, solutions, « 3 choses à faire lundi ».
- **Suivre** : livrables, rappels, résultats, ligne mission.

Le chemin complet (mission → atelier → cartes → problèmes → recommandations → rapport) reste le fil sous ces trois verbes ; tout le reste est derrière « Plus ».

### 5.2 Écrans

| Écran | Ce qu'il fait | Repli papier |
|---|---|---|
| Nouvelle mission | Pack métier (boulangerie, dispositif régional), fiche « ce qu'il a déjà », contrat et clause de capitalisation cochés | Fiche imprimée |
| Avant d'observer | Checklist CNIL / RGPD : information des participants, finalité, durée, rôles plutôt que noms ; case horodatée dans le journal | Feuille signée |
| Atelier | 8 questions cœur (onglet gauche) et tableau de cartes (onglet droit) ; une réponse crée une étape ; chaque carte porte rôle, outil, durée, étiquette objet ; photo, dictée ; capture hors ligne | Cartes papier photographiées |
| Ce que le client a dit | Citations mot pour mot, reliées aux problèmes | Carnet |
| Problèmes, preuves, causes | Douleurs regroupées ; preuve typée attachée ; causes « hypothèse » proposées par l'IA avec la question ou la mesure pour trancher ; passage en validée / invalidée par la consultante | Post-it |
| Score et solutions | Cinq questions pondérées, verdict ; fiche 8 champs (temps libéré / trésorerie séparés) ; dépendances et risques typés ; « 3 choses à faire lundi » ; boutons client | Fiche imprimée |
| Livrable | Compte rendu d'une page + guide opératoire, assemblés depuis les données, chiffres avec leur preuve, relecture puis envoi tracé | Dictée dans la voiture |
| Suivre | Rappels J+10 / J+30 / J+90, trois questions, résultat « appliqué oui / partiel / non », ligne mission (temps, prix, coût IA) | Agenda et tableur |

### 5.3 IA dans le MVP

Transcription et résumé de l'atelier ; causes « hypothèse » ; relecture d'une fiche ; paragraphes de liaison du compte rendu et du guide. Chaque appel : invite versionnée, journal, validation humaine. Les compétences correspondantes sont écrites en Markdown dès le MVP (exécutables par Hermes en M90).

### 5.4 Contenu prêt pour ARDAN et la boulangerie

Deux packs : 8 questions cœur communes ; 4 questions de pack ; objets types (source, article, bulletin, destinataire ; fournée, produit, commande, client) ; 40 à 60 activités types pour les deux métiers (amorce du référentiel de 100) ; 20 causes ; 30 recettes avec outils existants ; poids du score ; critères prestataires. Les hypothèses sur l'organisation d'ARDAN (deux personnes, outils inconnus) et de la boulangerie sont marquées et vérifiées au premier contact.

### 5.5 Hors MVP (volontairement)

Base commune en production (patrons chargés à la main), import, versions formelles, agents exécutés par Hermes, copilote en direct, multi-consultants. Tous classés en § 2 et § 4.7.

## 6. Feuille de route à 30, 90 et 180 jours

### Jour 0 à 30 : MVP interactif en atelier

- Juridique en parallèle : contrat type (clause de capitalisation, validation humaine, export, effacement), RC pro, texte de la checklist « avant d'observer », registre des traitements.
- Noyau : espaces, sécurité par ligne, journal, chaîne diagnostic avec preuves et statuts de cause, objets / événements, export, suppression, test d'isolation.
- Passerelle IA : invites versionnées, journal, deux fournisseurs (dont un européen), jeu d'évaluation de 10 cas par invite.
- Écrans du § 5.2 ; deux packs ; amorce du référentiel (40 à 60 activités, 20 causes, 30 recettes) ; 20 patrons rédigés à la main.
- Premier atelier ARDAN et premier atelier boulangerie **dans l'application**, repli papier prêt.
- Mesures : temps par étape, coût IA par mission, taux de recommandations IA modifiées, part des « 3 choses » appliquées à J+30.

### Jour 30 à 90 : mesurer, capitaliser, brancher les agents

- Base commune en production : promotion relue, statuts candidat / éprouvé, seuils réglables, recherche par clés.
- Import caseId / activity / timestamp (export de mails ARDAN) et mesures de caisse (boulangerie) avec le bon libellé ; successions et durées médianes.
- Versions observée / cible / réalisée et règles vérifiables ; diff dans le livrable.
- Couche d'agents : serveur MCP maison, compétences Markdown exécutées par Hermes en mode suggestion ; rappels J+30 / J+90 par messagerie ; idempotence et reprise testées.
- Capture volontaire d'une tâche (guide pas à pas) après la checklist ; correspondance solutions × outils en table ; critères prestataires en configuration ; aide contextuelle « Comment je fais ? ».
- Test du modèle économique (financeurs, réseaux, premières PME) ; référentiel étendu vers 100 activités.

### Jour 90 à 180 : capacités avancées, activables par configuration

- Copilote d'atelier opt-in (suggestions muettes) si la latence le permet.
- Perspectives et conformance ; benchmarks inter-clients sous seuils ; exports OCEL 2.0 / XES / BPMN.
- Agents d'exécution sous contrôle sur un premier cas (règle de tri de veille), avec retour arrière.
- Prototype text-to-process depuis la transcription d'atelier, évalué sur 10 ateliers.
- Préparation du module grands groupes (exigences SSO, audit, multi-consultants) ; décision sur demande réelle.

### Points de décision

Jour 30 : les deux ateliers ont-ils été menés dans l'application, et combien de « 3 choses » sont appliquées ? Jour 90 : quelqu'un paie-t-il, et un patron éprouvé a-t-il servi une deuxième mission ? Jour 180 : une demande PME ou grand compte justifie-t-elle les modules avancés et le module grands groupes ?

## 7. Sources

- Étude Claude : `docs/synthese-consolidee.md`, `docs/benchmark.md`, `research/claude/` (fiches 00 à 05, perspectives A à D).
- Rapport Perplexity Pro : `research/perplexity/rapport-2026-10-28-synthese.md` (synthèse sans URL ; rapport original à demander pour les citations exactes).
- Hermes Agent : https://hermes-agent.nousresearch.com/docs ; https://agentic-ai.readthedocs.io/en/latest/AgentPlatforms/hermes-agent/.
- Gouvernance des agents : OWASP Top 10 for Agentic Applications (décembre 2025), NIST AI 100-2 (mars 2025) ; voir `research/claude/04`.
