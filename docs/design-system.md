# Système de design — direction « Le dossier de mission » (proposition, 28 octobre 2026)

Réponse à la revue produit de la PR #5 (« direction visuelle à reprendre »). Statut : **proposition à valider par Faty**. Rien n'est appliqué aux écrans de l'application ; le prototype vit sous `/direction` (branche `design/direction-visuelle`), avec sa feuille de style propre `app/direction/direction.css` (préfixe `.dv`).

## 1. Intention

Un logiciel de conseil haut de gamme doit ressembler à un **dossier bien relié**, pas à un tableau de bord : hiérarchie éditoriale, filets plutôt que cadres, une seule couleur pour ce que l'outil propose, des visualisations qui répondent chacune à une question du métier.

Cinq principes : papier et filets plutôt que cartes ; typographie éditoriale ; cuivre réservé à l'intelligence ; trois zones (rail, canevas, panneau) ; visualisations qui tranchent. Détail et comparaison avec les logiciels B2B contemporains : page `/direction`.

## 2. Tokens

| Famille | Token | Valeur | Usage |
|---|---|---|---|
| Couleur | `--dv-encre` | `#13203a` | Rail, texte fort, action principale |
| | `--dv-papier` / `--dv-papier-2` | `#f7f5f0` / `#efebe2` | Canevas / panneau et fonds secondaires |
| | `--dv-surface` | `#ffffff` | Blocs manipulables |
| | `--dv-filet` / `--dv-filet-fort` | `#e6e1d6` / `#cfc7b6` | Séparations, bordures |
| | `--dv-texte` / `-2` / `-3` | `#1a1f2b` / `#4b5363` / `#7a8294` | Texte principal, secondaire, tertiaire |
| | `--dv-cuivre` (+ `-fonce`, `-clair`) | `#b5672a` | **Réservé** à ce que l'outil propose par règles |
| | `--dv-sauge` | `#2f7a5b` | Validé, quick win, cible atteinte |
| | `--dv-garance` | `#b2423e` | Douleur, bloquant, retard |
| | `--dv-cobalt` | `#2f5fa8` | Cible, modifié, observé, à planifier |
| | `--dv-ocre` | `#b8891f` | À vérifier, attention, fictif |
| Typo | `--dv-serif` | Fraunces Variable | Affiche, titres, grands chiffres (axe optique réglé par taille) |
| | `--dv-sans` | Inter Variable | Interface, données (chiffres tabulaires) |
| | échelle | 11 · 12,5 · 14 · 15 · 17 · 20 · 26 · 34 · 48 px | Sept rôles : sur-titre, mini, petit, corps, citation, section, titre, affiche |
| Espace | `--dv-e-1…12` | 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 px | Base 4 |
| Forme | `--dv-r-1/2/3` | 6 · 10 · 16 px | Boutons / champs / blocs |
| Ombre | `--dv-ombre-1/2` | légère / portée | Blocs / éléments flottants |
| Mouvement | `--dv-duree`, `--dv-courbe` | 160 ms, ease-out | Survols ; neutralisé par `prefers-reduced-motion` |
| Gabarit | `--dv-rail`, `--dv-panneau` | 236 px, 344 px | Rail d'encre, panneau contextuel |

Contrastes texte / fond vérifiés ≥ 4,5:1 pour tous les textes ; les couleurs de sens ne portent jamais seules l'information (pastille + libellé).

## 3. Composants

| Composant | Classe | Règle |
|---|---|---|
| Coquille | `.dv-coque`, `.dv-rail`, `.dv-canevas`, `.dv-panneau` | Trois zones ; le panneau passe sous le canevas en dessous de 1280 px, le rail disparaît au profit d'une barre basse en dessous de 860 px |
| En-tête de page | `.dv-entete` | Fil (sur-titres), affiche, méta en ligne, actions à droite ; stepper des phases sous le titre dans une mission |
| Boutons | `.dv-btn` (`primaire`, `cuivre`, `fantome`, `petit`, `icone`) | 40 px minimum (32 en petit) ; le cuivre signale une action « proposer par règles » |
| Pastilles | `.dv-pastille` (tons) | Point de couleur + libellé ; `contour` pour les comptes ; `encre` pour la phase |
| Signature | `.dv-propose` | Losange cuivre + « proposé par règles » : obligatoire sur toute sortie des règles |
| Chiffres clés | `.dv-chiffres` | Bande à filets, chiffre sérif, tendance en dessous |
| Tableau | `.dv-table` | En-têtes en capitales espacées, filets fins, survol discret, `defilant` sur mobile |
| Liste éditoriale | `.dv-liste` | Numéro sérif, titre, détail, marqueurs ; remplace les piles de cartes |
| Stepper | `.dv-stepper` | Six segments, courant en cuivre, libellés masqués en compact et sur mobile |
| Niveaux | `.dv-niveau` | Trois segments pour gravité / fréquence / effort / impact |
| Journal | `.dv-journal` | Transcript horodaté ; verbatims en sérif italique ; actions de conversion au survol |
| Trame | `.dv-trame` | Fil de puces défilant ; couverte en sauge, courante en encre |
| Carte de processus | `.dv-carte` | Couloirs alternés, nœuds arrondis, pastille garance de problèmes, cuivre pointillé pour les propositions, sauge / cobalt pour la cible |
| Carte des opportunités | `.dv-opportunites` | Impact × effort, quadrant quick wins teinté, retenues cerclées |
| Trajectoire | `.dv-trajectoire` | Piste avant (encre) et cible (sauge), valeurs en sérif |
| Agenda | `.dv-agenda` | Jour en sérif, actions par échéance, retard en garance |
| États | `.dv-vide`, `.dv-squelette`, `.dv-alerte` | Vide avec geste proposé ; squelette animé ; alerte à bord coloré (garance, ocre, cuivre) |

## 4. Responsive, clavier, lisibilité

- Points de rupture : 1280 (panneau sous le canevas), 1024 (atelier en une colonne), 860 (rail masqué, barre basse 48 px, chiffres sur deux colonnes, tableaux défilants).
- Focus visible cobalt sur tous les éléments interactifs ; cibles ≥ 40 px (32 px pour les actions secondaires en ligne).
- Texte courant 15 px, rien sous 11 px ; chiffres tabulaires ; `prefers-reduced-motion` respecté.
- Les captures desktop et mobile sont dans `docs/captures/direction-*.png` ; relues avant de présenter.

## 5. Ce qui changerait dans l'application si la direction est validée

1. Remplacer `app/globals.css` par le système `.dv` (sans préfixe) et retirer les classes `.carte`, `.badge`, `.bouton`, `.metrique` au profit de `.dv-bloc`, `.dv-pastille`, `.dv-btn`, `.dv-chiffres`.
2. Appliquer la coquille à trois zones à toutes les phases : le panneau contextuel porte le copilote (atelier), la solution sélectionnée (analyser, décider), la validation (restituer), la capitalisation (suivre).
3. Convertir les piles de cartes en tableaux et listes éditoriales (cockpit, solutions, actions, mesures).
4. Marquer toute sortie des règles avec la signature cuivre.
5. Conserver les tests de parcours existants (sélecteurs par rôle et libellé, pas par classe).

Estimation : deux lots, cockpit + atelier puis analyser → suivre, chacun avec captures et tests.

## 6. Hors de cette proposition

Aucune illustration, aucune animation décorative, aucune bibliothèque de composants externe, aucune nouvelle police (Fraunces et Inter sont déjà embarquées). Le travail UX indépendant (`design/manus/`) peut confronter ces choix ; les tokens sont faits pour être ajustés sans réécrire les écrans.
