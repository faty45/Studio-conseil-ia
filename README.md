# Studio Conseil IA

Plateforme multi-clients d'accompagnement à l'amélioration des processus (artisans, TPE, PME, grands groupes). Projet indépendant d'Explozill.

**État (28 octobre 2026)** : MVP v1 « atelier terrain » en cours de recette (PR #3). Stockage local dans le navigateur, sans compte ni serveur : ne pas y saisir de données réelles de client. Aucune base Supabase, aucun déploiement en production.

## Lancer l'application

```bash
npm ci
npm run dev            # http://localhost:3000
npm test               # types + tests unitaires (vitest)
npm run test:e2e       # parcours ARDAN et boulangerie (Playwright, mobile et portable)
npm run build
```

Structure : `app/` (accueil Démarrer / Trouver / Suivre, mission par onglet), `components/` (atelier, problèmes et pistes, suivi), `lib/packs/` (packs métier en JSON validés par schéma : ajouter un métier = ajouter un fichier), `lib/domain/` (modèle, extraction d'étapes sans IA, pistes sourcées, synthèse, dépôt), `lib/ai/` (passerelle IA indépendante du fournisseur ; seul le mode « règles » est actif), `tests/`.

## Où lire

1. `docs/vision-produit.md` : pour qui, quoi, principes.
2. `docs/synthese-consolidee.md` : synthèse des recherches, désaccords entre les quatre analyses, risques, recommandations, MVP priorisé.
3. `docs/benchmark.md` : benchmark des éditeurs (Celonis, SAP Signavio, UiPath, ARIS, Skan, Microsoft, APQC, startups).
4. `docs/cahier-des-charges.md` : fonctionnalités et MVP.
5. `docs/architecture.md` : modèle de données et modules proposés.
6. `docs/decisions.md` : journal des décisions.
7. `research/claude/` : recherches détaillées et quatre analyses contradictoires.

## Règles

Voir `CLAUDE.md`.
