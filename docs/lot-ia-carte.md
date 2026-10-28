# Lot 3 — Carte de processus assistée par IA, avec validation humaine

Proposition du 28 octobre 2026. **Non livré** : ce lot s'appuie sur la passerelle déjà en place (`lib/ai/gateway.ts`), dont seul le fournisseur `regles` (découpage local, sans IA externe) est actif dans le MVP v1.

## 1. Ce que fait déjà le MVP v1

- Bouton « Proposer des étapes à partir des notes » : découpage des réponses et des cartes en segments, détection de l'acteur et de l'outil par le vocabulaire du pack.
- Chaque étape proposée porte `origine: 'extraction'` et `statut: 'propose'` ; la consultante accepte, corrige ou rejette ; rien n'entre dans la synthèse sans acceptation.
- Mode manuel complet sans IA (critère 3 de l'issue #2).

## 2. Ce que le lot ajoute

| Élément | Détail |
|---|---|
| Fournisseur `anthropic` | Route serveur `POST /api/ia/extraire` qui reçoit les textes **minimisés** (rôles, pas de noms ; pas de chiffres financiers), appelle l'API Messages avec une sortie structurée (JSON validé par zod : étapes, acteur, outil, confiance), et renvoie des propositions `statut: 'propose'`. La clé API reste côté serveur, en variable d'environnement, jamais dans le dépôt. |
| Fournisseur `hermes` | Adaptateur vers Hermes Agent (Nous Research) via un serveur MCP maison exposant uniquement `lire_mission` et `proposer_etapes`. Aucun outil d'écriture validée ; aucun accès aux systèmes du client. Activable par configuration, désactivé par défaut (critère 8). |
| Invites versionnées | Fichiers `agents/skills/extraire-etapes.md` (compétence en Markdown lisible par Hermes et par tout moteur) avec numéro de version ; chaque appel enregistre l'invite, le modèle, le fournisseur, le coût et la durée dans `appel_ia`. |
| Jeu d'évaluation | 10 ateliers fictifs (ARDAN, boulangerie) avec les étapes attendues ; rejoué à chaque changement d'invite ou de modèle ; score noté par la consultante (bon / à corriger / faux). |
| Interface | Sélecteur de fournisseur dans l'atelier (règles / IA), indicateur « proposé par l'IA le … », affichage de la confiance, bouton « tout rejeter ». |
| Repli | Si le fournisseur externe échoue ou dépasse 5 secondes, retour automatique aux règles locales avec message. |

## 3. Gouvernance

- L'IA propose, l'humaine dispose : aucune écriture directe dans la mission, seulement des propositions.
- Journal complet des appels ; taux de propositions modifiées suivi (s'il tombe à zéro, la consultante ne relit plus).
- Aucun agent autonome sur les systèmes du client (issue #2, architecture extensible).
- Données minimisées avant envoi ; politique de rétention du fournisseur vérifiée avant activation ; au moins un fournisseur européen testé.

## 4. Critères de recette

1. Sur les 10 ateliers du jeu d'évaluation, au moins 7 cartes proposées sont jugées « bon » ou « à corriger » par la consultante.
2. Le mode règles reste disponible et identique.
3. Aucun appel n'est émis sans clé configurée ; aucun texte brut d'atelier n'est journalisé côté serveur au-delà de 30 jours.
4. Un changement de modèle est détecté par le jeu d'évaluation avant mise en service.

## 5. Prérequis

Validation de Faty du fournisseur et du budget ; lot 2 (sécurité) livré avant toute utilisation avec des données réelles.
