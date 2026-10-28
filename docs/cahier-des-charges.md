# Cahier des charges — Studio Conseil IA

Version 0.1, 28 octobre 2026. Phase de conception ; ce document sera revu après les deux premières missions. Les priorités et le MVP viennent de `docs/synthese-consolidee.md` (§ 7).

## 1. Objet

Permettre à une consultante seule d'accompagner des artisans, TPE, PME et associations dans l'amélioration de leurs processus, de la première rencontre au suivi des résultats, et de capitaliser entre missions sans divulguer les données d'un client.

## 2. Utilisateurs et contextes

- **Consultante** : téléphone et ordinateur portable ; souvent sans réseau fiable pendant l'atelier ; une mission type tient en une demi-journée sur place (voir le déroulé heure par heure dans `research/claude/perspectives/B-consultante-de-terrain.md`, § 5).
- **Client** : dirigeant d'une entreprise de 1 à 50 personnes au départ ; pas de compte ni de mot de passe exigé ; reçoit un compte rendu d'une page le jour même.
- **Participants** : salariés ou bénévoles, informés en début d'atelier ; jamais nommés dans les données (rôles).
- **Prestataire** : reçoit une recommandation qualifiée par lien à durée limitée.

## 3. Exigences fonctionnelles

### 3.1 Avant la mission
- F1. Contrat type avec clause de capitalisation méthodologique, mention de validation humaine, droits d'export et d'effacement, information des participants.
- F2. Fiche « ce qu'il a déjà » (outils, abonnements, caisse, messagerie) avec une case « ce que je ne veux pas voir écrit ».
- F3. Pack métier chargé selon le type d'entreprise : trame d'atelier à 12 questions, objets et étapes types, causes types, indicateurs, solutions types, pondérations.

### 3.2 Atelier
- F4. Questions guidées et tableau libre sont le même objet : une réponse crée une carte ; une carte peut être rangée sous une question.
- F5. Une carte = une étape, une douleur, une cause, une idée, une réponse ou une mesure ; chaque carte porte qui (rôle), quoi, outil, durée, niveau de douleur ; étiquette d'objet (fournée, commande, mail) venant du pack.
- F6. Photo de poste annotée ; dictée de l'atelier avec accord du client.
- F7. Fonctionne sans réseau pour la capture (phase 0 : carnet et appareil photo ; phase 1 : file locale).
- F8. Fiche « ce que le client a dit », mot pour mot.

### 3.3 Observation et mesure
- F9. Feuille de relevé de trois jours : quel objet, quelle étape, quelle heure, par rôle ; remplie avec la consultante.
- F10. Import d'exports existants (CSV de caisse, export de messagerie, tableur) avec correspondance quoi / quand / qui / objet ; minimisation (pas de corps de mails, pas de noms).
- F11. Deux calculs de base : successions d'étapes et durées médianes entre étapes.
- F12. Aucun enregistrement d'écran, de frappes ni de surveillance.

### 3.4 Diagnostic
- F13. Les cinq questions du niveau 1 (règles, type d'entrée, structuration, stabilité, documentation) avec poids par métier, verdict « faire maintenant / préparer / oublier », critère disqualifiant « changement majeur attendu ».
- F14. Trois hypothèses de cause proposées par l'IA, chacune avec la question à poser ou la mesure à faire pour trancher ; jamais de conclusion automatique.
- F15. Niveau 2 (volume annuel, temps unitaire, coûts ponctuels et récurrents) seulement quand un relevé existe.

### 3.5 Recommandations
- F16. Fiche en sept champs : quoi ; avec quel outil que vous avez déjà ; combien de temps ; combien par mois ; de quoi ça dépend ; ce que je suppose ; comment vérifier. Rattachée à une étape.
- F17. « Les 3 choses à faire lundi », datées, avec un rôle responsable.
- F18. Décision du client : fait / plus tard / pas pour moi, avec la raison.
- F19. Orientation vers un prestataire : au moins deux propositions, critères visibles, aucune commission en phases 0 à 2.

### 3.6 Livrables et suivi
- F20. Compte rendu d'une page généré depuis les données (citations en tête, chiffres avec leur source), relu et envoyé avant de quitter les lieux.
- F21. Rappels J+10, J+30, J+90 ; mesure avant / après sur un indicateur choisi en atelier, saisie par la consultante après un appel.
- F22. Ligne « mission » : temps passé par étape, prix, coût IA, patrons mobilisés, décisions.
- F23. Devis et facture à partir de modèles.

### 3.7 Apprentissage entre missions
- F24. Tableur puis table « patrons » sans aucune colonne client ; patron = cause, étape type, problème générique, solution générique, outils compatibles, tranches d'heures et d'euros, résultat observé.
- F25. Pipeline de promotion à la clôture : sélection, réécriture sans données, liste de contrôle humaine, statut « validé » après deux clients distincts, statistiques seulement à partir de cinq espaces.
- F26. Taxonomie maison (20 causes, 30 recettes) ; code PCF d'APQC optionnel, hors atelier.

### 3.8 IA
- F27. Toute production de l'IA est marquée comme telle, modifiable, et validée avant d'apparaître dans un livrable.
- F28. Consignes versionnées ; journal de chaque appel (date, consigne, modèle, fournisseur, coût, texte produit, modifications humaines).
- F29. Données minimisées avant envoi (rôles, pas de noms ; pas de chiffres financiers si inutiles) ; politique de rétention du fournisseur vérifiée ; au moins un fournisseur européen testé.

## 4. Exigences non fonctionnelles

- N1. **Isolation** : un espace par client ; export complet et suppression effective livrés avec l'isolation ; test d'isolation automatique dès la phase 1.
- N2. **Journal immuable** de toutes les actions sur un espace.
- N3. **Simplicité** : un chemin par défaut (mission → atelier → cartes → problèmes → recommandations → rapport), trois niveaux de profondeur, tout le reste derrière « Plus ».
- N4. **Téléphone d'abord** : boutons d'au moins 48 px, texte d'au moins 16 px, contraste 4,5:1, respect de la réduction des animations.
- N5. **Latence** : réponse IA de moins de 5 secondes en atelier sinon asynchrone ; jamais d'appel IA bloquant sur le téléphone.
- N6. **Configuration, pas code** : un nouveau métier = un fichier.
- N7. **Mesure de la simplicité** : temps jusqu'à la première recommandation ; taux de recommandations IA modifiées par la consultante (s'il tombe à zéro, elle ne relit plus) ; part des recommandations issues de la base plutôt qu'écrites à la main après cinq missions.
- N8. **Conformité** : registre des traitements pré-rempli par type de mission ; AIPD si relevé d'activité ; finalité écrite excluant l'évaluation individuelle des salariés.

## 5. Hors périmètre (décidé)

Task mining par capture ; langage de requête ; BPMN à l'écran (export seulement, sur demande d'un prestataire) ; offre grands groupes et connecteurs vers Celonis / Signavio / Microsoft ; PM4Py dans l'application ; agents qui agissent dans les outils du client avant les phases ultérieures ; commission sur l'annuaire ; multilingue avant d'avoir une deuxième langue de travail.

## 6. MVP priorisé

Voir `docs/synthese-consolidee.md` § 7 : phase 0 (semaines 1 à 6, sans code), point de décision après la mission 2, phase 1 (mois 2 à 4, noyau strict et première brique visible : transcription et compte rendu), phase 2 (mois 4 à 9, import, base commune, versions et règles).

## 7. Critères de réussite de la phase 0

- Les deux missions jouées de bout en bout avec les modèles ; compte rendu envoyé le jour même.
- Temps réel par étape mesuré ; coût IA par mission mesuré.
- Au moins une recommandation appliquée par chaque client à J+30.
- Un financeur ou un client a payé ou s'est engagé.
- Les colonnes du tableur « missions » n'ont plus bougé entre la mission 1 et la mission 2.
