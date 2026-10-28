# Perspective A — « Les méthodes des grands éditeurs, à l'échelle d'une consultante »

*Rôle tenu : ingénieure process venue de Celonis / SAP Signavio. Lecture critique du brouillon v1 et des fiches `recherche/00` à `03`, complétée par six recherches ciblées le 28 octobre 2026. Ce qui n'est pas sourcé est marqué « hypothèse ».*

## Ma thèse en 5 lignes

1. Le brouillon v1 confond **simplicité d'interface** et **simplicité de modèle** : il propose un carnet de cartes sans colonne vertébrale, alors que la valeur des grands éditeurs tient dans trois choses invisibles : un modèle objet, un référentiel versionné, un cadre d'évaluation stable.
2. Ces trois choses ne coûtent rien à l'écran ; elles coûtent le premier jour, dans le schéma. Le brouillon les repousse à « 6–18 mois », moment où il faudra migrer toutes les missions passées.
3. Celonis, Signavio, UiPath et APQC ont déjà résolu « comment rendre comparables deux processus différents » (perspectives, PCF, assessment pondéré). On copie la méthode, pas le logiciel.
4. Un diagnostic non confronté à un **modèle cible** et à un **responsable de processus** reste une opinion : c'est la différence entre une consultante et un outil de conseil.
5. Le vrai MVP n'est pas « une mission de bout en bout à la main », c'est « une mission dont chaque donnée est déjà au bon endroit pour la dixième ».

## Désaccords explicites avec le brouillon v1

| Point du brouillon | Ce que je pense | Preuve ou hypothèse |
|---|---|---|
| Idée 4 : cartes simples, pas de BPMN | Le problème n'est pas la notation, c'est l'absence de **modèle cible**. Sans référence, pas de conformance, donc pas de « où ça dévie ». Les cartes restent l'interface, mais chaque carte doit être une activité d'une version du processus. | Fait : Celonis compare « a reference process model with the actual process flows » (`recherche/01` §1.2) ; ARIS fait la conformance sur EPC importés (`recherche/03`). |
| Idée 2 : journal « commencé / fini » « au format OCEL 2.0 » | On ne produit pas de l'OCEL avec deux boutons sans avoir défini les **types d'objets** avant. Le brouillon met l'OCEL dans l'export, pas dans le modèle de l'atelier. | Fait : OCEL 2.0 exige types d'objets et relations objet-objet qualifiées (`recherche/00` §3.1). Hypothèse : un journal sans objets donne un log « cas = journée » inexploitable. |
| Idée 7 : score à 5 questions, trois mots | Automation Hub a deux niveaux, des poids, des seuils publiés et un critère disqualifiant. Sans poids ni seuil, impossible d'expliquer un classement au client. | Fait : High Level puis Detailed Assessment ; Ease of Implementation 65–100 / 35–65 / 0–35 % ; « Major change expected » → On Hold (`recherche/02` §1.2). |
| Idée 9 : « X heures, Y €/mois, Z dépendances » | D'accord sur le langage, pas sur la structure : coûts ponctuels par phase, récurrents, volume annuel, coût par transaction. Sinon les chiffres de deux missions ne s'additionnent jamais. | Fait : Cost Benefit Analysis d'Automation Hub (`recherche/02` §1.1). |
| Idée 6 : graphe « problème → cause → solution → outil → preuve » | Sans **objets métier** ni PCF au niveau activité, le graphe n'a que des mots ; il ne fera jamais le pont boulangerie → poissonnerie. | Fait : le PI Graph est d'abord un modèle objet ; les core processes livrent objets, événements, relations, perspectives (recherches n° 1 et 6). |
| § 7.5 : « trois niveaux, jamais plus » | Il manque le niveau « objet » (sur quoi l'étape agit) et le niveau « activité PCF » (ce que l'étape est, dans un vocabulaire partagé). | Fait : PCF = 5 niveaux, identifiants hiérarchiques et PCF ID lisible par machine (`recherche/03` §3). |
| Découverte automatique et benchmarks « plus tard » | Sans modèle objet au jour 1, ces fonctions imposeront une migration. | Hypothèse, cohérente avec le mode « object-centric » distinct du « case-centric » chez Celonis (`recherche/01` §1.1). |
| Angle mort 5.1 : « le réutilisable entre métiers n'existe pas vraiment » | Faux : il existe sous trois formes (PCF, core processes / value accelerators, benchmarks). Le brouillon cherchait une fonction, pas une méthode. | Faits : `recherche/01` §2.2, `recherche/03` §3, recherche n° 6. |

## 1. Ce que le brouillon n'a pas vu

**Modèle objet-centré et perspectives.** *Fait* : Celonis définit une perspective comme « a set of object types, event types, and relationships representing a particular business process » ; chaque processus livré a la sienne ; un journal d'événements se construit dans une perspective autour d'un objet pilote (docs « perspectives », glossaire OCPM). Signavio a annoncé en mai 2026 des « Process Networks », vue objet-centrée (commandes, livraisons, factures), statut bêta/GA flou selon les sources. Microsoft : object-centric GA mai/juin 2026 (`recherche/02`). *Version consultante* : trois à six types d'objets nommés avant l'atelier, venant du pack métier ; chaque carte est un événement rattaché à un ou plusieurs objets ; une perspective est un filtre enregistré (« suivre l'article de la source au destinataire »). *Pourquoi le brouillon a tort* : son idée 1 (« photo + voix → étapes ») donne une séquence linéaire, un seul cas. La veille d'ARDAN n'est pas linéaire : un article nourrit plusieurs bulletins, un bulletin reprend plusieurs articles. Le modèle « cas » casse à la première question : « combien d'articles lus finissent quelque part ? ».

**Conformance contre un modèle cible.** *Fait* : Conformance Checker de Celonis avec analyse des causes de déviation ; ARIS contre EPC importés ; les « Process Atoms » de Signavio sont des contraintes non divisibles exécutées comme requêtes, classant les cas en conformes ou non (SAP Community ; CX Today). *Version consultante* : la version « à faire » du même jeu de cartes, enregistrée comme v2 ; chaque règle (« tout article est trié sous 48 h ») devient un atome vérifiable à la main ou sur un export : « 14 cas sur 20 respectent la règle ». *Tort du brouillon* : aucune notion de version cible, donc une recommandation détachée du processus, impossible à situer ni à vérifier au mois 3.

**Référentiel versionné.** *Fait* : ARIS distingue définition d'objet et occurrence (`recherche/03`) ; UiPath a sorti un Process Repository avec versioning et commentaires (GA 29 mai 2026, `recherche/02`). *Version consultante* : versions immuables (observée, cible, réalisée), diff entre versions. *Tort* : sans versions, le « avant / après à 3 chiffres » (idée 12) compare deux nombres sans savoir si c'est le même processus.

**Évaluation à deux niveaux et cost-benefit.** *Fait* : High Level Assessment (règles, type et qualité d'entrée, stabilité, documentation, échelle 1–5), Detailed Assessment (Automation Potential %, Ease of Implementation %, seuils 65/35, mise On Hold si changement majeur), bénéfice = potentiel × temps as-is annuel, coûts ponctuels et récurrents, coût par transaction (`recherche/02`). La liste exacte des six facteurs d'Ease of Implementation varie selon les versions de la doc : non confirmée. *Version consultante* : niveau 1 en atelier (5 questions, poids du pack, trois mots), niveau 2 après (volume annuel, temps unitaire, personnes, taux d'erreur, coûts). *Tort* : le brouillon garde le niveau 1 seul, donc jamais de chiffre comparable entre missions.

**Journey modelling côté client final.** *Fait* : Journey Modeler de Signavio, parcours en tableau liés aux processus, systèmes, émotions, métriques, complexité en « T-shirt size » (`recherche/01` §2.1). *Version consultante* : dix lignes vécues par le client du client (lecteur du bulletin ; cliente du samedi 11 h), une émotion, un lien vers l'étape interne. *Tort* : le brouillon ne regarde que l'intérieur de l'entreprise.

**Gouvernance : responsable de processus.** *Fait (secondaire)* : les supports ABPMP posent qu'une gouvernance exige « clear ownership and accountability assigned for each process » ; revue systématique dans BPM Journal (2019). Texte du CBOK non lu : hypothèse sur la formulation. *Version consultante* : deux champs obligatoires par processus, « qui en répond ? » et « qui le fait ? » ; la recommandation est acceptée par le responsable nommé. *Tort* : l'idée 6 prévoit « je le fais / plus tard / pas pour moi » sans dire qui clique ; dans une PME de 15 personnes, c'est le cœur du blocage.

**Value accelerators et core processes.** *Fait* : cinq core processes Celonis (AP, AR, Order Management, Procurement, Inventory) avec objets, événements, relations, perspectives prédéfinis ; value accelerators Signavio (mai 2026) ; Process Insights « 90+ process flows, 200+ PPI, 160+ correction recommendations » (`recherche/01`). *Version consultante* : un pack métier = objets, trame d'atelier, 10 indicateurs, 10 problèmes types, 10 solutions types, poids. Le brouillon (§ 7.7) a un pack de questions, pas un pack de valeur.

**Agent mining.** *Fait* : Gartner, « AI Agent Mining Transforms Autonomous Operations » (8 mai 2026) ; Signavio applique le mining aux agents ; Celonis partenaire de Microsoft Agent 365 avec « Agent Mining » (`recherche/01`). *Version consultante* : l'assistant d'atelier (idée 14) et la règle de tri (idée 17) écrivent dans le même journal d'événements, avec un objet « agent ». Le brouillon prévoit « un journal de ses actions » à part : il faut que ce soit le même.

## 2. Méthodes à reprendre telles quelles, méthodes à écarter

**À reprendre, nommément.**

- **Perspectives** (Celonis) : filtre nommé sur objets + événements + relations.
- **Core process / starter kit** (Celonis) et **value accelerator** (Signavio) : un pack a toujours objets, événements, indicateurs, recommandations types.
- **High Level + Detailed Assessment** et **Cost Benefit Analysis** (Automation Hub), seuils 65/35 et critère disqualifiant inclus ; poids adaptés par métier.
- **Pipeline d'idées** (Automation Hub) : Idée → Évaluation → Qualification → Mise en œuvre → En service, plus Rejetée / En attente. Le cycle, pas les rôles.
- **Process Atoms** (Signavio) : une règle = une contrainte exécutable, taux de conformité par règle.
- **Conformance contre référence** (Celonis, ARIS) sous forme de diff entre versions.
- **Journey Modeler** (Signavio) en tableau, émotions et T-shirt size.
- **PCF 8.0** (APQC) comme index : chaque activité porte un identifiant PCF ; les indicateurs reprennent quand possible une « key measure » de la collection PCF (24 mars 2026).
- **« Un chiffre, une source »** (brouillon § 7.9), étendu à « une source *et* un objet ».

**À ne pas reprendre.** Les langages de requête (PQL, SiGNAL) et BPMN/EPC à l'écran ; le task mining par enregistrement d'écran (le brouillon a raison : cadre CNIL, `recherche/00` §3.3) ; les rôles de Centre d'excellence (Program Manager, Idea Approver, Technical Reviewer) ; les connecteurs ERP et le Data Core ; les benchmarks payants APQC (jusqu'à 5 000 $ par enquête, grille 2017) ; la licence objet-centrée séparée de Celonis : chez nous l'objet est le défaut.

## 3. ARDAN et la boulangerie, vus par ma méthode

**ARDAN — veille** (hypothèse sur l'organisation : une équipe lit, trie, rediffuse).

- Objets : `source`, `article`, `bulletin`, `destinataire`, `thème`.
- Événements : reçu, lu, écarté, retenu, résumé, placé dans un bulletin, envoyé, retour reçu.
- Perspectives : vie d'un article (source → bulletin) ; vie d'un bulletin (articles → destinataires) ; vie d'une source (taux de rétention).
- Indicateurs (logique « Days to Completion » de Process Insights) : délai réception → envoi ; rétention par source (retenus / reçus) ; articles par bulletin ; temps de lecture par article retenu ; articles lus par deux personnes ; sources sans article retenu depuis 90 jours.
- Atomes : « tout article retenu est envoyé sous 7 jours » ; « toute source a un thème » ; « aucun article envoyé deux fois au même destinataire ».
- Solutions immédiates : désabonner les sources à rétention nulle (deux semaines de journal suffisent) ; règle de tri par thème dans la messagerie existante ; résumé assisté relu avant envoi ; un bulletin par thème. Niveau 2 : articles par an × temps unitaire = heures as-is ; potentiel sur le tri à mesurer (hypothèse : 40–60 %).

**Boulangerie artisanale.**

- Objets : `fournée`, `produit`, `commande`, `client`, `matière première`, `poste` (pétrin, four, caisse).
- Événements : pétri, façonné, enfourné, défourné, en vitrine, vendu, invendu, commande prise, livrée, matière reçue.
- Perspectives : vie d'une fournée ; vie d'une commande pro ; journée d'un poste.
- Indicateurs : invendus par produit et jour de semaine ; rupture avant 11 h par produit ; délai commande → livraison ; temps de four par fournée vs capacité ; commandes prises hors outil.
- Atomes : « toute commande pro est écrite au même endroit » ; « pas de rupture avant 10 h le samedi ».
- Solutions : feuille de production par jour de semaine dans un tableur partagé ; un seul canal de commande ; quantités ajustées sur 3 semaines d'invendus saisis en 10 secondes par soir.

Dans les deux cas, le journal volontaire (idée 2) devient utile parce qu'il a des objets : « fournée 3 enfournée », pas « j'ai commencé ».

## 4. Réutilisation entre métiers

**Comment font les éditeurs (faits).** (a) Une **taxonomie** : PCF 8.0, 13 catégories, 5 niveaux, identifiants hiérarchiques, versions sectorielles. (b) Des **contenus préconstruits** par processus : core processes Celonis, contenu « SAP-Defined » et value accelerators Signavio, templates Case Management de Maestro. (c) Des **benchmarks** : Open Standards Benchmarking d'APQC, validés par un analyste, publiés en aveugle ; benchmark « Days to Completion » de Process Insights.

**Ce qu'il faut copier.**

1. Chaque activité porte un **identifiant PCF au niveau activité**. « Trier des articles » (ARDAN) et « trier les commandes pro » (boulangerie) partagent un code, même si les objets diffèrent.
2. Chaque problème est typé par **cause générique** (information manquante, double saisie, attente, rebut, canal multiple) *et* par **objet touché** ; la réutilisation se fait sur le couple (cause, PCF), jamais sur le texte.
3. Un **pack métier** = objets + perspectives + indicateurs + atomes + solutions types + poids, écrit à la main *avant* les missions. C'est l'inverse du brouillon (§ 5.2), qui amorce trop maigre.
4. Benchmarks maison en aveugle avec k ≥ 5 : je garde ce point du brouillon tel quel.

**Ce qu'il ne faut pas copier :** la granularité complète du PCF (« plus de 1 000 éléments », chiffre tiers non vérifié) ; on expose 40 à 60 codes par pack, le reste reste en base.

## 5. Ergonomie pour une consultante seule

**Où je suis d'accord.** Téléphone d'abord, hors ligne en atelier, un seul chemin, mots du client, zéro installation, « un chiffre, une source ». Les grands outils ont une courbe d'apprentissage reconnue (« steep learning curve », G2 / PeerSpot, `recherche/01`).

**Où la simplicité cache de l'amateurisme.**

- « Trois niveaux, jamais plus » : c'est refuser de modéliser. Le niveau objet n'ajoute aucun écran, il ajoute une étiquette sur la carte.
- « Résultat en trois mots » : d'accord pour l'affichage ; mais sans poids explicites, la consultante ne peut pas répondre à « pourquoi celle-là avant celle-ci ? ». Un dirigeant pose cette question.
- « Cinq lignes par recommandation » : oui, plus une sixième cachée : sur quelle version et quel objet elle porte, sinon le suivi à 3 mois ne vaut rien.
- « Un écran ajouté, un écran retiré » : règle de design, pas de données. La complexité à budgéter est celle du schéma, et il faut la dépenser au jour 1.
- Le brouillon mesure « moins de 30 minutes pour une première recommandation ». Je mesure « au bout de cinq missions, part des recommandations proposées par la base plutôt qu'écrites à la main ». Hypothèse : c'est le seul indicateur qui distingue une plateforme d'un carnet.

Ce que j'ajoute à l'interface, et rien d'autre : une étiquette objet sur chaque carte, une liste « perspective », un bouton « geler cette version », un champ « responsable ».

## 6. Architecture pour tenir trois mois sans reconstruire

Ce qu'un modèle objet et un référentiel imposent dès le premier jour :

1. **Quatre tables cœur**, isolées par client (sécurité par ligne, comme le brouillon) : `objet` (type, attributs datés), `evenement` (activité, horodatage, auteur, provenance), `relation_objet_evenement` (qualifiée) et `relation_objet_objet` (qualifiée). C'est la structure d'OCEL 2.0 sans en porter le nom ; export OCEL / XES (IEEE 1849-2023) gratuit ensuite.
2. **Référentiel versionné** : `processus`, `version_processus` immuables ; une carte d'atelier est une `activite` d'une version ; une recommandation référence une version et une activité.
3. **Index partagé** : `pcf_element` (Excel PCF 8.0 du 27 février 2026, licence à relire), `cause_type`, `solution_type` ; les objets clients y pointent, jamais l'inverse.
4. **Pack métier en fichier de configuration** versionné ; une mission enregistre la version du pack utilisée.
5. **Évaluation comme données** : questions, poids, seuils dans le pack ; réponses stockées avec la version du questionnaire (comme la « mass update » d'Automation Hub).
6. **Provenance obligatoire** sur chaque donnée : atelier, journal, export, estimation IA, moyenne anonymisée.
7. **Agents dans le même journal** : propositions avec `auteur = agent`, acceptées ou refusées par un événement humain. L'agent mining vient gratuitement.
8. **Clôture = extraction** vers une base « patrons » (PCF, cause, solution, ordre de grandeur, secteur) avec compteur k.

Peut attendre : découverte de variantes, import CSV, benchmarks, BPMN ; tout se branche sur les tables 1 et 2 sans migration.

## Risques que je vois

- **Sur-modélisation en atelier** : vingt minutes à typer des objets au lieu d'écouter. Parade : les objets viennent du pack, l'atelier n'en crée qu'exceptionnellement.
- **Faux sentiment de rigueur** : des pourcentages sur des volumes déclarés à la louche. Parade : provenance et incertitude affichées ; niveau 2 optionnel tant qu'il n'y a pas de journal.
- **Licence PCF** : conditions du PCF 8.0 non lues ; certaines versions sectorielles portent des conditions IBM (`recherche/03`). À vérifier avant toute offre payante.
- **Dérive vers l'outil d'éditeur** : copier aussi rôles, notations et connecteurs, c'est reconstruire Signavio à deux ; garde-fou : la liste « à ne pas reprendre ».
- **Base vide les six premiers mois** : comme le brouillon ; ma parade est d'écrire les deux packs avant la première mission.
- **Données salariés** dans les journaux : la structure objet rend facile « personne → poste » ; à faire par défaut.

## Mon MVP priorisé

| # | Item | Effort |
|---|---|---|
| 1 | Schéma objet / événement / relations qualifiées, isolé par client, provenance obligatoire | Moyen |
| 2 | Référentiel versionné (v observée, v cible) ; carte d'atelier = activité d'une version | Moyen |
| 3 | Deux packs métier écrits à la main (veille, boulangerie) : objets, perspectives, 10 indicateurs, 10 atomes, 10 solutions, poids | Moyen |
| 4 | Atelier hybride sur téléphone : questions guidées + cartes avec étiquette objet, hors ligne | Fort |
| 5 | Évaluation niveau 1 (5 questions, poids du pack, trois mots) + champ « responsable » | Faible |
| 6 | Évaluation niveau 2 et cost-benefit structuré (volume, temps unitaire, ponctuel, récurrent, coût par transaction) | Faible |
| 7 | Fiche recommandation cinq lignes rattachée à une version et une activité ; pipeline Idée → Évaluée → Retenue → En cours → En service / Rejetée | Faible |
| 8 | Journal volontaire sur objets alimentant la table événements ; conformité par atome calculée dessus | Moyen |
| 9 | Rapport d'une page : diff v observée → v cible, trois indicateurs du pack | Faible |
| 10 | Clôture : extraction anonymisée (PCF, cause, solution, ordre de grandeur) vers la base patrons, k ≥ 5 | Moyen |

Les items 1 à 3 sont invisibles pour le client ; ce sont ceux que je refuse de reporter.

## Sources

**Fiches internes (lues en entier)** : `brouillon-v1-idees-risques-feuille-de-route.md` ; `recherche/00-analystes-standards-cadre-legal.md` ; `recherche/01-celonis-signavio.md` ; `recherche/02-uipath-microsoft.md` ; `recherche/03-aris-skan-apqc.md`.

**Recherches web du 28 octobre 2026 (extraits de résultats, pages non ouvertes)** :

- Celonis, perspectives et glossaire OCPM : https://docs.celonis.com/en/perspectives.html ; https://docs.celonis.com/en/object-centric-process-mining-glossary.html ; https://docs.celonis.com/en/creating-custom-perspectives-and-event-logs.html
- Celonis, core processes et starter kits : https://docs.celonis.com/en/enabling-and-configuring-core-processes.html ; https://docs.celonis.com/en/order-management-starter-kit---object-centric ; https://docs.celonis.com/en/procurement-starter-kit---object-centric.html
- UiPath Automation Hub, algorithme du Detailed Assessment : https://docs.uipath.com/automation-hub/automation-cloud/latest/user-guide/information-about-the-detailed-assessment-algorithm ; https://docs.uipath.com/automation-hub/automation-suite/2021.10/user-guide/information-about-the-detailed-assessment-algorithm
- SAP Signavio, release mai 2026 (Process Networks, Process Atoms) : https://www.signavio.com/post/may-2026-product-release-update ; https://community.sap.com/t5/technology-blog-posts-by-sap/the-role-of-process-atoms-in-modern-business-process-management/ba-p/13578285 ; https://www.cxtoday.com/customer-engagement-journey-orchestration/sap-signavio-process-mining/
- Gouvernance et process owner (secondaires) : https://www.emerald.com/bpmj/article/25/6/1377/258488/Process-owners-in-business-process-management-a ; https://slidetodoc.com/certified-business-process-professional-cbpp-study-session-part-2/
- Gartner, AI Agent Mining (abstract, 8 mai 2026) : https://www.gartner.com/en/documents/7827217 ; https://www.gartner.com/en/documents/7082498

Non vérifié malgré la recherche : liste exacte des six facteurs d'Ease of Implementation ; texte du CBOK sur le process owner ; conditions de licence du PCF 8.0 ; statut GA réel des Process Networks.
