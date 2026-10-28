# Rapport Perplexity Pro — synthèse structurée transmise par l'utilisatrice
Date de référence : 28 octobre 2026
Source : texte du rapport Perplexity collé dans la conversation ChatGPT.
Statut : **synthèse fidèle des conclusions et recommandations, pas transcription intégrale**. Pour les citations exactes et toutes les URL, demander le rapport original.
Aucun produit n'a été testé directement. Les affirmations éditeurs sont des déclarations à vérifier.

## Objectif Studio Conseil IA
Plateforme multi-clients de conseil opérationnel : ateliers hybrides (guidage + tableau libre), découverte des processus, problèmes et preuves, recommandations immédiatement réalisables avec les outils existants, transfert de solutions intermétiers, recours à prestataires, suivi des résultats. Premiers pilotes : ARDAN (atelier avec deux personnes chargées de la veille, processus et outils encore inconnus) et une boulangerie artisanale. L'application web doit être utilisable pour les premiers ateliers ; les capacités avancées doivent être conservées dans la vision et rendues activables par configuration.

## Benchmark des acteurs
- **Celonis** : Data Core, Context Model, Build Experience ; approche objet-centrée, contexte opérationnel, causes racines, what-if, agents et copilotes. À retenir : « données + connaissance métier = intelligence ».
- **SAP Signavio** : text-to-process, modèles BPMN éditables, agents d'analyse et mining, collaboration. À retenir : conversation → carte de processus corrigeable, sans imposer BPMN à l'artisan.
- **UiPath Automation Hub** : soumission d'idées, évaluation rapide puis détaillée, pipeline d'opportunités, composants réutilisables ; Task Mining distinct, sensible pour les données personnelles.
- **ARIS** : modélisation et gouvernance, assistant contextuel « How do I », process context pour IA ; mode expert éventuel.
- **Skan AI** : observation du travail réel et Context Graph of Work, mais forte exigence de confidentialité et acceptabilité.
- **Microsoft Power Automate Process Mining** : import d'event logs caseId / activityName / timestamp ; ne pas promettre du process mining avec de simples tickets de caisse.
- **APQC** : Process Classification Framework intersectoriel ; principe d'une taxonomie commune, mais vérifier la licence avant toute intégration commerciale.
- **Soroco** : work graph, observation opt-in et niveau équipe.
- **Scribe** : capture volontaire de tâches et guides pas-à-pas.
- **Apromore** : process intelligence et BPMN, simulation, no-code.
- **Tallyfy** : modèles de processus copiables et modifiables.
- **Windmill** : workflows/agents open source et option d'auto-hébergement.
- **Camunda** : orchestration déterministe et agents sous garde-fous, human-in-the-loop.

## Les quinze propositions du rapport Perplexity
1. Atelier « 8 questions → carte » en moins de 45 minutes (P1).
2. Capture ciblée et consentie de preuves / guides type Scribe (P1, conformité préalable).
3. Mini-référentiel francophone artisan/TPE d'environ 100 activités, propre à Studio, extensible (P1).
4. Preuves typées (déclaration/document/observation/trace), source et date ; preuve requise avant validation finale, pas pour bloquer l'entretien (P1).
5. Causes candidates avec statut hypothèse/validée/invalidée (P1).
6. Calculateur prudent de coûts, gains et hypothèses visibles, distinguant temps libéré et économies de trésorerie (P1).
7. Catalogue de patrons intermétiers, statut candidat/éprouvé, capitalisation sans données client (P1-P2).
8. Correspondance solutions ↔ outils déjà présents chez le client (P2).
9. Critères explicites d'orientation vers un prestataire, paramétrables et non scientifiques (P2).
10. Boucle de suivi à J+30/J+90 avec trois questions et indicateurs avant/après (P2).
11. Capitalisation inter-clients après généralisation, validation humaine, cadre contractuel et examen du risque de réidentification (P2).
12. Copilote d'atelier pour relances et contradictions, non intrusif, facultatif (P2-P3).
13. Import CSV case-activity-timestamp et mini-process mining quand les données le permettent (P2-P3).
14. Checklist CNIL/RGPD intégrée avant toute observation des salariés (P1).
15. Livrable client généré en un clic, PDF et guide opératoire (P1).

## Architecture proposée par Perplexity
Mission → Atelier → Processus → Étape → Problème → Preuve → Cause candidate → Solution/patron → Dépendances → Risques → Résultat mesuré → Patron générique réutilisable.
Relations explicites dans PostgreSQL/Supabase suffisent initialement ; graphe dédié seulement si besoin.
Cloisonnement strict des données clients, droits d'accès aux documents et recherches IA, fournisseurs LLM encadrés, journaux et rétention. Les patrons communs ne doivent contenir aucune donnée permettant d'identifier un client.
Agents : permissions minimales, validation humaine pour actions sensibles, journalisation, idempotence, reprise sur erreur. Prévoir une passerelle indépendante pour Hermes et autres moteurs.
Ateliers configurables et versionnés, modules avancés optionnels ; l'ergonomie expose seulement Démarrer / Trouver / Suivre.

## Risques et réserves
- Pas de « théâtre du process mining » : mesurer les actions réellement appliquées.
- Ne pas transformer l'observation des salariés en surveillance disproportionnée ; information préalable et cadre CNIL.
- Ne pas présenter pseudonymisation comme anonymisation.
- Éviter les fuites inter-clients via LLM et bases de connaissances.
- Distinguer faits vérifiés, hypothèses, recommandations ; « non trouvé » n'est pas « inexistant ».
- Risque de surconstruction pour seulement deux pilotes ; architecture évolutive, mise en œuvre progressive.
- Modèle économique TPE à tester, sans abandonner la possibilité d'adresser PME et grands groupes.

## Divergences à confronter avec Claude
Perplexity conserve les fonctions avancées dans la vision, sans nécessairement toutes les coder en V1. L'utilisatrice souhaite une **application web interactive utilisable dès les premiers ateliers**, pas une phase 0 exclusivement tableurs. Les fonctionnalités doivent être activables selon les métiers et tailles d'organisation, avec possibilité de changer dans trois mois sans refonte. Claude doit confronter les recommandations, pas écraser celles de Perplexity.
