## 4. Quinze idées concrètes pour Studio Conseil IA

Chaque idée est une **recommandation**. Quand elle s'appuie sur un fait du benchmark, le fait est cité ; quand elle repose sur une intuition, c'est marqué « hypothèse ».

| # | Idée | D'où ça vient | Effort | Valeur pour ARDAN / boulangerie |
|---|---|---|---|---|
| 1 | **Atelier « photo + voix »** : le consultant photographie le poste (four, caisse, boîte mail) et dicte 30 secondes ; l'IA propose les étapes, le client corrige en glissant les cartes | Le task mining (Skan, Mimica) observe l'écran ; un artisan n'a pas d'écran à observer. On remplace la capture par une observation consentie et déclarative (§ 3.3) | Faible | Boulangerie : cartographie du matin en 20 minutes. ARDAN : capture de la chaîne « lire, trier, rediffuser » |
| 2 | **Journal de bord volontaire à 1 clic** : pendant une semaine, le client appuie sur « j'ai commencé / j'ai fini » sur son téléphone pour 3 tâches choisies ; on obtient un mini journal d'événements au format OCEL 2.0 | OCEL 2.0 (16 oct. 2023) ; task mining sans surveillance | Moyen | Mesure réelle des temps sans logiciel métier, base pour chiffrer le gain |
| 3 | **Import « bricolé » d'exports existants** : CSV de caisse, export Gmail / Outlook, agenda, tableur de commandes ; détection automatique colonnes « quoi / quand / qui / pour quel objet » | Tous les éditeurs ont des connecteurs ERP ; les TPE n'ont pas d'ERP. Le gisement est le CSV | Moyen | ARDAN : export de la boîte mail de veille ; boulangerie : ticket de caisse journalier |
| 4 | **Carte des processus en cartes simples, pas en BPMN** : une étape = une carte (qui, quoi, outil, durée, douleur), vue « frise » et vue « où ça coince » ; export BPMN 2.0 seulement pour un prestataire | BPMN est le standard des grands outils (Signavio, ARIS, Camunda) mais illisible pour un artisan | Faible | Lisible sur téléphone, en atelier |
| 5 | **Catalogue de problèmes et de causes rattachés au PCF d'APQC** : chaque douleur est taguée avec un code PCF (ex. « 4.x Livrer des produits ») et une cause type (information manquante, double saisie, attente, rebut) | APQC PCF (§ 2.7) : taxonomie transversale et gratuite | Faible | Rend comparables une boulangerie et une association |
| 6 | **Graphe de connaissances « problème → cause → solution → outil → preuve »** anonymisé, alimenté après chaque mission | Celonis Process Intelligence Graph, SAP Knowledge Graph (§ 2) : la valeur est dans le graphe, pas dans l'analyse ponctuelle | Moyen | Permet « la solution de la boulangerie X marche pour la poissonnerie Y » sans divulguer X |
| 7 | **Score d'opportunité à 5 questions**, inspiré d'Automation Hub (fréquence, volume, nombre de personnes, stabilité des règles, données structurées) avec un résultat en trois mots : « faire maintenant / préparer / oublier » | UiPath Automation Hub (§ 2.3) : scoring automation potential / ease of implementation | Faible | Tri immédiat des 10 idées sorties d'un atelier |
| 8 | **Recommandations « avec ce que vous avez déjà »** : la plateforme connaît les outils du client (Google Workspace, Microsoft 365, caisse, WhatsApp, Canva) et ne propose que des solutions compatibles, avec la recette pas à pas | Angle mort des grands éditeurs : ils poussent leur propre plateforme | Moyen | ARDAN : règle de filtrage Gmail + résumé IA hebdo ; boulangerie : feuille de production dans un tableur partagé |
| 9 | **Estimation « coût, risque, dépendance » en langage courant** : chaque recommandation affiche « ça prend X heures, ça coûte Y € par mois, ça dépend de Z (abonnement, personne clé, fournisseur) » | Les grands outils chiffrent en ROI ; une TPE raisonne en heures et en euros par mois | Faible | Décision immédiate par le dirigeant |
| 10 | **Mode « enquête » avec hypothèses à vérifier** : l'IA ne conclut pas ; elle propose 3 hypothèses de cause et la question à poser ou la mesure à faire pour trancher | Responsible process mining (Handbook 2022) ; éviter la fausse certitude de l'IA | Faible | Crédibilité auprès du client, apprentissage du consultant |
| 11 | **Annuaire de prestataires avec critères d'orientation** : quand une solution dépasse les outils existants (site web, ERP, automatisation avancée), fiche prestataire locale, budget indicatif, question à leur poser | Demande explicite du cahier des charges | Faible | Monétisation possible (apport d'affaires), sans conflit d'intérêts si affiché |
| 12 | **Suivi des résultats par « avant / après » à 3 chiffres** : un indicateur choisi en atelier, mesuré avant, à 1 mois et à 3 mois, saisi par le client en 10 secondes | Continuous monitoring des plateformes (Celonis, Signavio) ramené à l'essentiel | Faible | Preuve de valeur, matière pour le graphe de connaissances |
| 13 | **Apprentissage entre missions par « patrons » anonymisés** : à la clôture, le consultant valide ce qui part dans la base commune (patron de problème, solution, résultat), jamais les données brutes ; pseudonymisation + agrégation k ≥ 5 avant toute statistique | Exigence de confidentialité du cahier des charges ; AIPD (§ 3.3) | Moyen | Base de connaissances qui grossit sans risque juridique |
| 14 | **Agent IA « assistant d'atelier » sous contrôle humain** : pendant l'atelier, un agent propose des questions de relance, repère les contradictions, remplit la carte ; tout passe par validation du consultant ; journal de ses actions | Agentic automation (UiPath, Celonis AgentC, Copilot Studio) ; gouvernance human-in-the-loop (§ 2.9) | Moyen | Le consultant garde la relation, l'agent fait le secrétariat |
| 15 | **Pack « première mission en 2 heures »** : trame d'atelier, 12 questions guidées, tableau libre, rapport d'une page généré ; vendu à prix fixe aux artisans | Les grands outils demandent des semaines de mise en place (§ 2) ; l'offre d'entrée est vide pour les TPE | Faible | Produit d'appel, volume, données pour le graphe |

**Hypothèse de marché** (non vérifiée) : les éditeurs cités n'ont pas d'offre pour les entreprises de moins de 10 salariés. Aucun prix public « TPE » n'a été trouvé pendant cette recherche. Si c'est confirmé, le positionnement « diagnostic léger, outils existants, prestataires locaux » est libre.

## 5. Angles morts et risques

### 5.1 Angles morts du marché (faits + hypothèses)

| Angle mort | Fait vérifié | Hypothèse / conséquence |
|---|---|---|
| **Les plateformes supposent des journaux d'événements** issus d'un ERP ou d'un CRM | Tous les outils de process mining (§ 2) ingèrent des event logs avec identifiant de cas, activité, horodatage ; Microsoft et UiPath ajoutent le task mining par enregistrement d'écran | Une boulangerie n'a ni ERP ni poste de travail à enregistrer. Il faut une observation « humaine augmentée » (idées 1 à 3) |
| **Le task mining est une surveillance** | CNIL : pas de surveillance permanente ; sanction du 19 décembre 2024 (§ 3.3) | Dans une entreprise de 3 personnes, l'enregistrement d'écran est socialement et juridiquement intenable. Avantage concurrentiel si Studio Conseil IA s'en passe |
| **Le ROI est calculé en heures de grands volumes** | Automation Hub mesure les heures économisées ; Celonis vend du « value » sur des millions de transactions | En TPE, la valeur est souvent : moins d'erreurs, moins de stress, un dirigeant qui récupère son dimanche. Il faut des indicateurs qualitatifs assumés |
| **Les outils sont faits pour des analystes** | Langages de requête (PQL chez Celonis, SiGNAL chez Signavio), modélisation BPMN | Le consultant Studio Conseil IA doit pouvoir travailler sans analyste data |
| **Le « réutilisable entre métiers » n'existe pas vraiment** | APQC propose une taxonomie ; les éditeurs proposent des « value packs » par secteur (Forrester, 2025) | Le graphe inter-métiers anonymisé (idée 6) est un vrai différenciant, mais il ne vaut qu'après 20 à 30 missions |

### 5.2 Risques pour Studio Conseil IA

| Risque | Gravité | Parade |
|---|---|---|
| **Fuite ou mélange de données entre clients** (plateforme multi-clients) | Élevée | Un espace par client isolé dès la première ligne de code (row-level security), journal d'accès, aucun entraînement de modèle sur données brutes |
| **IA qui invente des faits ou des chiffres** dans un diagnostic | Élevée | Mode « hypothèses à vérifier » (idée 10) ; chaque chiffre a une source ou un auteur ; relecture consultant obligatoire avant envoi |
| **Dépendance à un fournisseur d'IA** (prix, disponibilité, changement de modèle) | Moyenne | Interface d'appel abstraite, deux fournisseurs testés, invites versionnées |
| **Licence AGPL de PM4Py** si on l'intègre dans un SaaS | Moyenne | Service séparé et publié, ou licence commerciale Fraunhofer, ou réécriture des quelques algorithmes utiles |
| **Conflit d'intérêts dans l'orientation vers des prestataires** | Moyenne | Afficher toute rémunération ; au moins deux prestataires proposés ; critères visibles |
| **Sur-promesse « automatisation »** : l'artisan attend un robot, il reçoit un tableur | Moyenne | Vocabulaire honnête : « simplifier » avant « automatiser » ; pack 2 heures (idée 15) qui montre vite un résultat |
| **Base de connaissances pauvre au début** (problème de l'œuf et de la poule) | Moyenne | Amorcer le graphe avec le PCF d'APQC et des patrons génériques écrits à la main ; publier les 20 premiers sans attendre |
| **RGPD : données de salariés dans les ateliers** (noms, horaires, plaintes) | Élevée | Minimisation : rôles plutôt que noms ; information des participants ; durée de conservation ; AIPD si observation de l'activité |
| **Dette technique de l'« extrêmement simple »** : la simplicité se perd à chaque fonction ajoutée | Moyenne | Budget de complexité : chaque nouvel écran doit en retirer un ou être caché derrière un mode avancé |
| **Mesure des résultats non faite** par le client après la mission | Moyenne | Rappel à 1 et 3 mois, saisie en 10 secondes (idée 12), sinon on n'apprend rien entre missions |

## 6. Feuille de route : maintenant, dans trois mois, plus tard

### Maintenant (0 à 6 semaines) : « une mission de bout en bout, à la main si besoin »

1. **Espace client isolé** (un client = un espace, un consultant = plusieurs espaces) avec sécurité par ligne.
2. **Atelier hybride** : les 12 questions guidées + un tableau libre de cartes (étape, douleur, idée), synchronisé entre le téléphone du consultant et un écran partagé.
3. **Carte du processus en cartes** (idée 4) avec marquage « où ça coince ».
4. **Catalogue problèmes / causes** codé PCF (idée 5), rempli à la main pour les deux premiers cas.
5. **Score à 5 questions** (idée 7) et **fiche recommandation** (quoi, avec quel outil existant, X heures, Y € par mois, dépendances) (idées 8 et 9).
6. **Rapport d'une page** exporté en PDF et en Markdown.
7. Les deux premières missions (ARDAN, boulangerie) jouées entièrement dans l'outil, même si des étapes restent manuelles.

### Dans trois mois : « on mesure, on apprend »

8. **Import CSV / export mail** avec détection des colonnes (idée 3) et calcul des temps entre étapes.
9. **Journal de bord volontaire** (idée 2) sur téléphone.
10. **Suivi avant / après** (idée 12) avec rappels automatiques.
11. **Graphe de connaissances anonymisé** v1 (idée 6) : patrons validés à la clôture (idée 13).
12. **Annuaire de prestataires** (idée 11).
13. **Assistant d'atelier** (idée 14) en mode suggestion seulement, avec journal des propositions acceptées ou refusées.

### Plus tard (6 à 18 mois) : « ce que font les grands, à notre échelle »

14. Découverte automatique de processus à partir des journaux volontaires et des exports (variantes, goulots), en s'appuyant sur OCEL 2.0 ; PM4Py en service isolé ou algorithmes maison.
15. Comparaison entre clients d'un même métier (benchmarks anonymisés, seuil k ≥ 5).
16. Export BPMN 2.0 pour les prestataires et les grands groupes ; import de modèles existants.
17. Agents d'exécution sous contrôle (par exemple une règle de tri de mails installée après validation), avec journal et retour arrière.
18. Offre « grands groupes » : connecteurs vers les plateformes existantes (Celonis, Signavio, Microsoft) plutôt que les concurrencer ; Studio Conseil IA devient la couche « atelier + recommandation » au-dessus.

## 7. Recommandations pour une application extrêmement simple, ergonomique et adaptable

Ces recommandations sont des **choix de conception**, pas des faits.

1. **Un seul chemin par défaut** : « Nouvelle mission → Atelier → Carte → Problèmes → Recommandations → Rapport ». Tout le reste est caché derrière « Plus ».
2. **Téléphone d'abord** : le consultant est debout dans un fournil ou une salle de réunion. Boutons d'au moins 48 px, texte 16 px, fonctionne hors ligne pendant l'atelier et synchronise après.
3. **Le tableau libre et les questions guidées sont le même objet** : une réponse à une question crée une carte ; une carte peut être rangée sous une question. Pas deux outils à apprendre.
4. **Des mots du client, pas du consultant** : « ce qui coince », « ce qui prend du temps », « ce qu'on refait deux fois ». Les termes techniques (process mining, BPMN, PCF) n'apparaissent que dans les exports.
5. **Trois niveaux de profondeur, jamais plus** : mission → processus → étape. Si un client en demande plus, on crée une autre mission.
6. **Toute recommandation tient en cinq lignes** : quoi, avec quel outil que vous avez déjà, combien de temps, combien par mois, de quoi ça dépend. Un bouton « je le fais », un bouton « plus tard », un bouton « pas pour moi » (et la raison nourrit l'apprentissage).
7. **Adaptable par configuration, pas par code** : la trame d'atelier, les questions, les causes types et le scoring sont des fichiers de configuration par métier (boulangerie, association, cabinet, industrie) ; un nouveau métier = un nouveau fichier.
8. **L'IA propose, l'humain dispose** : toute suggestion de l'IA est marquée comme telle, modifiable, et doit être validée avant d'apparaître dans un rapport.
9. **Un chiffre, une source** : chaque nombre affiché porte son origine (saisi par le client, mesuré par le journal, estimé par l'IA, moyenne de la base anonymisée).
10. **Multilingue dès le départ** si Studio Conseil IA vise plusieurs pays : textes d'écran dans des fichiers séparés par langue, comme dans Explozill.
11. **Accessibilité** : contraste 4,5:1, navigation clavier, respect de la réduction des animations. C'est aussi ce qui rend l'outil utilisable sur une tablette au soleil.
12. **Zéro installation chez le client** : application web progressive, lien par mail, pas d'agent sur les postes (cohérent avec § 3.3).
13. **Mesurer la simplicité** : temps pour créer une première recommandation (objectif : moins de 30 minutes en première mission), nombre d'écrans visités, taux de rapports envoyés sans modification manuelle.
