# Studio Conseil IA

Plateforme multi-clients d'accompagnement à l'amélioration des processus (artisans, TPE, PME, grands groupes). Projet indépendant d'Explozill.

**État (28 octobre 2026)** : refonte « cockpit de mission et copilote de conseil » en recette (branche `refonte/cockpit-conseil`, issue #4) ; le MVP v1 (PR #3) reste la base technique conservée. Stockage local dans le navigateur, sans compte ni serveur : ne pas y saisir de données réelles de client. Aucune base Supabase, aucun déploiement en production. Les rapprochements et suggestions sont produits par des règles explicites, pas par une IA externe (voir `docs/criteres-acceptation.md`).

## Lancer l'application

```bash
npm ci
npm run dev            # http://localhost:3000
npm test               # types + tests unitaires (vitest)
npm run test:e2e       # parcours ARDAN et boulangerie (Playwright, mobile et portable)
npm run build
```

Structure : `app/` (cockpit, bibliothèque, mission par phase `/mission/[id]/[phase]`), `components/mission/` (Préparer, Atelier, Analyser, Décider, Restituer, Suivre, carte de processus SVG, matrice, fiche de solution), `lib/bibliotheque/` (bibliothèque intermétiers en JSON validée par schéma : processus, problèmes universels, patrons), `lib/intelligence/` (classification, correspondances, priorisation, copilote, extraction : règles explicites, testées), `lib/packs/` (trames métier en JSON : ajouter un métier = ajouter un fichier), `lib/domain/` (modèle, dépôt, diagnostic, données de démonstration), `lib/ai/` (passerelle IA indépendante du fournisseur ; seul le mode « règles » est actif), `tests/` (vitest, Playwright mobile et portable).

Démonstration : « Charger la démonstration » sur le cockpit installe deux missions fictives complètes (ARDAN, boulangerie). Captures : `docs/captures/`.

Prototype de direction hybride (Attio × Linear × Miro) : `/studio` (cockpit relationnel, fiche client, atelier sur canvas, analyse croisée), décrit dans `docs/design-hybride.md`. Données fictives, état local du navigateur, rien n'est appliqué à l'application tant que la direction n'est pas validée.

## Où lire

1. `docs/vision-produit.md` : pour qui, quoi, principes.
2. `docs/synthese-consolidee.md` : synthèse des recherches, désaccords entre les quatre analyses, risques, recommandations, MVP priorisé.
3. `docs/benchmark.md` : benchmark des éditeurs (Celonis, SAP Signavio, UiPath, ARIS, Skan, Microsoft, APQC, startups).
4. `docs/cahier-des-charges.md` : fonctionnalités et MVP.
5. `docs/architecture.md` : modèle de données et modules proposés.
6. `docs/decisions.md` : journal des décisions.
7. `docs/criteres-acceptation.md` : tâches métier à réussir, grille de qualité des diagnostics, ce qui est simulé ou fondé sur des règles.
8. `research/claude/` : recherches détaillées et quatre analyses contradictoires.

## Règles

Voir `CLAUDE.md`.
