# Critères d'acceptation — cockpit de mission et copilote de conseil (refonte, octobre 2026)

Réponse au mandat de l'issue #4. Ces critères servent à juger la version en prévisualisation, puis les versions suivantes. Ils portent sur des **tâches métier**, pas sur des écrans.

## 1. Tâches métier à réussir (sur les deux missions fictives)

| # | Tâche | Critère | Comment vérifier |
|---|---|---|---|
| T1 | Préparer une mission en moins de 20 minutes | Objectif, contexte, parties prenantes (rôles), outils, hypothèses et trame renseignés ; consentement coché ; au moins deux pistes de la « préparation intelligente » lues | Phase Préparer, avancement 100 % |
| T2 | Animer un atelier de 90 minutes et en sortir avec une compréhension partagée | Toutes les questions de la trame couvertes ; au moins cinq faits distingués (déclaré / observé / vérifié) ; carte du processus actuel acceptée avec acteurs et outils ; problèmes rattachés à des étapes | Phase Atelier, badges de l'en-tête ; carte sans étape « Non attribué » |
| T3 | Produire deux ou trois recommandations argumentées | Chaque recommandation retenue a : problème(s) rattaché(s), explication de la correspondance, faisabilité (effort, coût, prérequis, risques), compatibilité avec un outil déjà présent ou mention explicite de ce qu'il faudrait, alternative sans IA si elle dépend d'une IA | Phase Analyser, « Pourquoi cette proposition, et ses limites » |
| T4 | Décider de la prochaine action avant de partir | Au moins une action avec responsable (rôle) et échéance ; une mesure avec valeur « avant » issue d'un relevé ; décisions tracées | Phase Décider, journal des décisions |
| T5 | Restituer un diagnostic lisible par un dirigeant non technicien | Document généré sans mention « à compléter » dans Résumé, Constats, Recommandations et Plan d'action ; carte actuelle et cible lisibles ; export Markdown et impression PDF | Phase Restituer, encart « il manque » absent |
| T6 | Suivre et capitaliser | Relevés J+30 / J+90 saisis ; au moins une solution retenue reliée à un patron de la bibliothèque ; un patron candidat exportable après la liste de contrôle de confidentialité | Phase Suivre |

## 2. Qualité des diagnostics (grille de relecture)

Un diagnostic est acceptable si un relecteur extérieur peut répondre « oui » à chaque question :

1. **Traçabilité** : chaque constat dit s'il est déclaré, observé ou vérifié, et par quelle source.
2. **Pas de chiffre inventé** : tout nombre du document vient d'un relevé saisi (mesure ou fait) ; l'outil n'estime rien.
3. **Causes avant solutions** : chaque problème coûteux ou bloquant a au moins une cause candidate et une preuve.
4. **Explicabilité** : chaque recommandation dit pourquoi elle est proposée, en phrases simples, et ce qui la limite.
5. **Priorité défendable** : les quick wins sont réalisables avec ce qui existe ; ce qui dépend d'une IA non configurée est classé « à construire » avec une alternative sans IA.
6. **Décision et suite** : plan d'action avec responsable et échéance, mesures avant / après, prochaine action nommée.
7. **Confidentialité** : rôles plutôt que noms ; aucune donnée réelle dans un prototype sans authentification.

## 3. Ce qui est simulé, fondé sur des règles, ou réservé

| Fonction | État | Détail |
|---|---|---|
| Classification d'un problème parmi les problèmes universels | **Règles** | Signaux lexicaux de la bibliothèque, bonus si la famille de processus correspond au métier. Toujours « proposé », confirmé par la consultante. |
| Correspondances problème → patron de solution | **Règles** | Score explicable : +3 par problème universel commun, +2 si une catégorie d'outil requise est présente chez le client, +1 processus cohérent, +1 métier déjà vu. |
| Priorisation impact × effort | **Règles** | Impact = max(gravité, fréquence) des problèmes rattachés ; effort = effort du patron ajusté par le coût et par la présence de l'outil ; dépendance à une IA non configurée alourdit l'effort. |
| Copilote d'atelier | **Règles** | Repère des formes (signaux, absolus, chiffres sans source, étapes sans acteur, problèmes sans cause ni preuve, questions non couvertes). Il ne comprend pas le sens ; chaque suggestion affiche sa règle. |
| Extraction d'étapes depuis les notes | **Règles** | Découpage par ponctuation et marqueurs de séquence, vocabulaire du pack pour les acteurs et les outils. Résultat toujours « proposé ». |
| Carte cible | **Manuel** | Initialisée par copie de l'actuel, puis modifiée par la consultante ; différences calculées par comparaison de texte. |
| Diagnostic | **Généré depuis les données** | Aucune phrase inventée : le document assemble ce qui a été saisi, avec des mentions « à compléter ». |
| Assistant IA (résumé, reformulation, extraction sémantique) | **Réservé, non configuré** | Passerelle `lib/ai/gateway.ts` : fournisseurs `anthropic` et `hermes` déclarés, indisponibles. Prérequis : clé fournie par Faty côté serveur, route serveur, journalisation, accord client. Mode dégradé assumé partout. |
| Stockage multi-clients isolé | **Réservé** | Stockage local du navigateur derrière l'interface `Depot`. Prérequis : lot Supabase (`docs/lot-securite-supabase.md`) validé par Faty, authentification, sécurité par ligne, tests d'isolation. |
| Capitalisation intermétiers | **Semi-manuel** | Export d'un patron candidat au schéma de la bibliothèque après liste de contrôle ; intégration par mise à jour versionnée du fichier, jamais automatique. |

Aucun de ces mécanismes n'est présenté dans l'interface comme une « IA » : les encarts disent « règles explicites ».

## 4. Hors périmètre de cette version

- Données réelles de client (interdites tant que l'authentification, l'isolation et la politique de confidentialité ne sont pas en place).
- Actions sur les outils du client (envoi de messages, modification de fichiers, connexion à une caisse).
- Agents autonomes ; Hermes n'intervient qu'en proposition, et seulement une fois configuré.
- Comptes utilisateurs, partage entre consultantes, collaboration en temps réel.
