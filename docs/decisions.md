# Journal des décisions — Studio Conseil IA

Une entrée par décision. Format : date, décision, contexte, options écartées, statut (proposée / validée par Faty / revue).

## 2026-10-28 — Studio Conseil IA est un dépôt distinct d'Explozill

- **Décision** : le projet vit dans son propre dépôt GitHub privé `studio-conseil-ia`. Rien n'est développé dans le dépôt Explozill.
- **Contexte** : les premières recherches avaient été rangées dans un dossier non suivi du dépôt Explozill ; Faty a demandé une séparation stricte.
- **Options écartées** : sous-dossier dans Explozill ; branche dédiée dans Explozill.
- **Statut** : validée par Faty (instruction du 28 octobre 2026).

## 2026-10-28 — Pas de développement, de migration ni de déploiement sans validation

- **Décision** : phase de conception seulement ; aucune base Supabase, aucun projet Vercel, aucun code applicatif avant validation explicite.
- **Statut** : validée par Faty.

## 2026-10-28 — Observation déclarative et consentie, pas de task mining par capture

- **Décision** : la cartographie repose sur l'atelier, les photos de poste, un journal de bord volontaire et l'import d'exports existants. Aucun enregistrement d'écran ni de frappes.
- **Contexte** : cadre CNIL (pas de surveillance permanente ; sanction du 19 décembre 2024 pour captures d'écran régulières) ; entreprises de très petite taille où la surveillance est socialement intenable. Voir `research/claude/00`.
- **Options écartées** : task mining type Skan, Mimica, UiPath, Microsoft.
- **Statut** : proposée.

## 2026-10-28 — Les faits, les hypothèses et les recommandations sont toujours séparés

- **Décision** : tout document distingue ce qui est vérifié (daté, sourcé), ce qui est supposé, et ce qui est recommandé.
- **Statut** : proposée.

## 2026-10-28 — Taxonomie commune : PCF d'APQC comme clé d'indexation

- **Décision** : les problèmes, causes et solutions sont rattachés à un identifiant du Process Classification Framework 8.0 (27 février 2026) pour rendre les patrons comparables entre métiers.
- **Contexte** : taxonomie publique à cinq niveaux ; conditions de licence du fichier 8.0 à relire avant usage commercial.
- **Options écartées** : taxonomie maison dès le départ (à reconsidérer si le PCF s'avère trop générique pour les artisans, point contesté par les analyses B et C).
- **Statut** : proposée, à confirmer après les deux premières missions.

## Décisions en attente (voir `docs/synthese-consolidee.md`)

- Modèle de données : cartes simples ou mini modèle objets-événements inspiré d'OCEL 2.0.
- Outil de départ : application maison ou modèles de documents et tableur partagé pour les premières missions.
- Modèle économique et tarification des diagnostics TPE.
- Politique de réutilisation entre missions : seuils d'anonymisation, validation humaine.

## 2026-10-28 — Phase 0 sans code, puis go/no-go après la mission 2

- **Décision proposée** : les deux premières missions (ARDAN, boulangerie) se jouent avec des modèles de documents et deux tableurs dont les colonnes reprennent le schéma de données cible ; le code ne commence qu'après un point de décision (quelqu'un a payé, trois étapes coûtent plus d'une heure, colonnes stables).
- **Contexte** : désaccord entre les analyses A et D (coder le noyau au jour 1) et B et C (dix missions à la main) ; voir `docs/synthese-consolidee.md` § 5.
- **Statut** : proposée, à valider par Faty.

## 2026-10-28 — Contrat type et RC pro avant la première mission

- **Décision proposée** : clause de capitalisation méthodologique, mention de validation humaine, droits d'export et d'effacement, information des participants ; assurance RC pro vérifiée pour l'erreur de conseil assisté par IA.
- **Contexte** : analyse C ; la base inter-clients n'est pas tenable sans ce socle contractuel.
- **Statut** : proposée, à valider par Faty (budget juriste à prévoir).

## 2026-10-28 — Lancement du développement (MVP v1, PR #3)

- **Décision de Faty** : développer une première version fonctionnelle, testée, consultable en prévisualisation Vercel, sans déploiement en production ; travail uniquement dans ce dépôt.
- **Choix d'implémentation** : Next.js 15 (App Router), stockage local du navigateur derrière l'interface `MissionStore` (implémentation Supabase prévue au lot 2), packs métier en JSON validés par zod, extraction d'étapes par règles locales derrière une passerelle IA indépendante du fournisseur (adaptateurs `anthropic` et `hermes` réservés, non actifs), synthèse séparant constats / hypothèses / recommandations, tests unitaires (vitest) et de parcours (Playwright), CI GitHub Actions.
- **Options écartées pour ce lot** : Supabase Auth + RLS (lot 2, sur validation), génération de carte par IA externe (lot 3), agents autonomes (hors MVP).
- **Statut** : en recette sur la PR #3.

## 2026-10-28 — Refonte : cockpit de mission et copilote de conseil (issue #4)

- **Décision de Faty** : ne pas se limiter au MVP v1 (jugé trop minimal) ; développer un véritable outil de conseil, sur une branche dédiée, avec prévisualisation Vercel, en respectant les garde-fous de l'issue #4 (pas de données réelles sans auth et isolation, pas de secrets, pas d'actions autonomes, pas de fusion automatique, travail existant conservé dans Git).
- **Choix de conception** :
  - six phases par mission (Préparer, Atelier, Analyser, Décider, Restituer, Suivre) et un cockpit clients / missions ;
  - une **bibliothèque intermétiers** versionnée (processus, problèmes universels avec signaux et question de confirmation, patrons de solution avec prérequis, risques, limites, adaptations par taille, alternative sans IA) ;
  - une **intelligence fondée sur des règles explicites** (classification, correspondances, priorisation, copilote, extraction) : chaque résultat affiche sa règle, est marqué « proposé » et confirmé par la consultante. Rien n'est présenté comme une IA ; la passerelle IA reste réservée et non configurée ;
  - une **carte de processus en couloirs** (SVG, sans dépendance) éditable, avec version actuelle et cible, pastilles de problèmes par étape ;
  - un **diagnostic généré depuis les données** (jamais de phrase inventée), exportable en Markdown et imprimable ;
  - deux parcours fictifs complets (ARDAN, boulangerie) chargés à la demande, roles plutôt que noms ;
  - stockage local derrière l'interface `Depot`, Supabase et IA payante déclarés comme prérequis (voir `docs/criteres-acceptation.md` § 3).
- **Options écartées** : bibliothèque de composants externe (le système visuel maison suffit et reste léger) ; moteur de rendu Markdown externe (rendu minimal maison, pas de dépendance ajoutée sans accord) ; Supabase dans ce lot (règle du dépôt) ; appel à une IA externe (clé et accord client absents).
- **Critères d'acceptation** : `docs/criteres-acceptation.md`.
- **Statut** : en recette sur la branche `refonte/cockpit-conseil` ; la PR #3 reste la base technique conservée, non fusionnée.
