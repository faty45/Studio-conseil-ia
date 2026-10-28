# CLAUDE.md — Studio Conseil IA

Guide pour Claude Code sur ce dépôt. Lis-le avant toute modification.

## Le projet

Studio Conseil IA est une plateforme multi-clients d'accompagnement à l'amélioration des processus pour artisans, TPE, PME et, plus tard, grands groupes : ateliers hybrides, cartographie déclarative, problèmes et causes, recommandations réalisables avec les outils existants, orientation vers des prestataires, suivi des résultats et apprentissage entre missions sans divulguer les données des clients.

**Projet indépendant d'Explozill.** Aucun code, donnée, secret ou configuration d'Explozill ne doit être copié ici, et rien d'ici ne va dans le dépôt Explozill.

Fondatrice : **Faty**. Parle-lui en français, en la tutoyant, avec des phrases simples. Elle valide depuis son téléphone.

## État

Phase de conception stratégique (octobre 2026). **Aucun développement, aucune migration Supabase, aucun déploiement Vercel sans validation explicite de Faty.** Les premiers cas d'usage sont ARDAN (veille professionnelle) et une boulangerie artisanale.

## Organisation du dépôt

| Dossier ou fichier | Rôle |
|---|---|
| `docs/vision-produit.md` | Pour qui, quoi, ce qu'on ne fait pas, principes |
| `docs/benchmark.md` | Benchmark des éditeurs, sources datées |
| `docs/cahier-des-charges.md` | Fonctionnalités, MVP priorisé, hors périmètre |
| `docs/architecture.md` | Modèle de données, modules, choix techniques |
| `docs/decisions.md` | Journal des décisions (une entrée datée par décision) |
| `docs/synthese-consolidee.md` | Synthèse des recherches et des analyses contradictoires |
| `docs/confrontation-perplexity.md` | Confrontation avec le benchmark Perplexity Pro : matrice, compléments, architecture, MVP interactif, feuille de route |
| `research/claude/` | Recherches et analyses produites avec Claude |
| `research/perplexity/`, `research/kimi/` | Recherches produites avec d'autres outils |
| `design/manus/` | Maquettes et explorations de design |

## Règles

- **Séparer les faits, les hypothèses et les recommandations** dans tout document. Chaque fait est daté et sourcé ; ne jamais prétendre avoir testé un produit.
- **Confidentialité** : aucune donnée réelle de client dans le dépôt (pas de noms, pas d'exports, pas de captures). Les exemples sont fictifs et marqués comme tels.
- **Pas de secrets** dans le code, la documentation, les commits ou le chat.
- **Pas de surveillance des salariés** : l'observation des processus reste déclarative et consentie (cadre CNIL).
- **Décisions** : toute décision de conception se note dans `docs/decisions.md` avec la date, le contexte, les options écartées.
- **Git** : travailler sur une branche, ouvrir une pull request ; c'est Faty qui fusionne. Jamais de push direct sur `main`.
- Commits et pull requests en français, sans identifiant de modèle.
