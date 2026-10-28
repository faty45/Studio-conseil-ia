# Vision produit — Studio Conseil IA

Version 0.1, 28 octobre 2026. Phase : conception stratégique. Rien n'est développé.

## 1. En une phrase

Studio Conseil IA aide une consultante à comprendre comment une petite entreprise travaille vraiment, à trouver ce qui coince, et à proposer des améliorations réalisables tout de suite avec les outils que l'entreprise a déjà, puis à apprendre de chaque mission pour la suivante, sans jamais exposer les données d'un client à un autre.

## 2. Pour qui

| Utilisateur | Situation | Ce qu'il attend |
|---|---|---|
| La consultante (utilisatrice principale) | Seule, sur le terrain, téléphone et ordinateur portable, missions courtes | Préparer, animer, conclure une mission vite et bien ; ne rien oublier ; produire un rapport crédible |
| Le dirigeant ou le responsable (client) | Artisan, TPE, association, PME ; plus tard grands groupes | Comprendre où il perd du temps ou de l'argent et quoi faire lundi matin |
| Les participants à l'atelier | Salariés, bénévoles | Être écoutés, pas surveillés |
| Le prestataire orienté | Intégrateur, développeur, agence | Un besoin clair et qualifié |

## 3. Les deux premiers cas

- **ARDAN (veille professionnelle)** : dispositif régional d'appui au développement des PME porté par des CCI. L'équipe lit, trie et rediffuse de l'information. Besoin : automatiser la collecte et le tri, garder la décision humaine sur ce qui est rediffusé.
- **Boulangerie artisanale (diagnostic)** : production du matin, invendus, commandes, caisse, planning. Pas de système d'information, des tickets de caisse, un tableur au mieux. Besoin : voir où ça coince et agir avec ce qui existe.

## 4. Ce que le produit fait

1. **Atelier hybride** : questions guidées et tableau libre, le même objet sous deux formes.
2. **Observation et cartographie** déclaratives et consenties : cartes « étape », photo d'un poste, journal de bord volontaire, import d'exports existants. Jamais d'enregistrement d'écran.
3. **Problèmes et causes** rattachés à une taxonomie commune (PCF d'APQC) et à des causes types.
4. **Solutions réutilisables** : base de patrons anonymisés « problème → cause → solution → outil → preuve ».
5. **Recommandations immédiates** avec les outils existants, en cinq lignes : quoi, avec quoi, combien de temps, combien par mois, de quoi ça dépend.
6. **Coûts, risques, dépendances** en langage courant.
7. **Orientation vers un prestataire** quand la solution dépasse les outils existants, avec critères visibles.
8. **Suivi des résultats** avant / après, et apprentissage entre missions sous validation humaine.

## 5. Ce que le produit ne fait pas

- Pas de task mining par capture d'écran ni de surveillance des salariés (cadre CNIL, voir `research/claude/00`).
- Pas de langage de requête ni de modélisation BPMN imposée au client (export seulement).
- Pas de conclusion automatique : l'IA propose des hypothèses et des questions, la consultante tranche.
- Pas de concurrence frontale avec Celonis, Signavio ou Microsoft chez les grands groupes : Studio Conseil IA est la couche atelier et recommandation, qui pourra se brancher sur ces outils plus tard.

## 6. Principes

- **Extrêmement simple** : un chemin par défaut (mission → atelier → carte → problèmes → recommandations → rapport), trois niveaux de profondeur au plus.
- **Téléphone d'abord**, hors ligne pendant l'atelier.
- **Les mots du client**, pas ceux du consultant.
- **Un chiffre, une source** : chaque nombre porte son origine.
- **Isolation stricte** : un espace par client ; la base commune ne reçoit que des patrons validés et anonymisés.
- **Adaptable par configuration** : un métier = un fichier de configuration (trame, questions, causes, scoring, textes), pas du code.

## 7. Positionnement face au marché (voir `docs/benchmark.md`)

Les plateformes du marché (Celonis, SAP Signavio, UiPath, ARIS, Microsoft, Skan) supposent un ERP, des journaux d'événements ou un agent sur les postes, et ne publient aucune offre pour les entreprises de moins de 10 salariés. Les outils accessibles aux TPE (Scribe, Tango, Guidde) documentent mais ne diagnostiquent pas. Studio Conseil IA se place entre les deux : la méthode d'une plateforme, la légèreté d'un carnet, et une base de connaissances qui grandit avec les missions.

## 8. Ce qui reste à décider

Voir `docs/decisions.md` et la synthèse des quatre analyses contradictoires (`docs/synthese-consolidee.md`).
