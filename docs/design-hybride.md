# Direction hybride « Studio » — Attio × Linear × Miro (prototype interactif, 29 octobre 2026)

Réponse à l'arbitrage produit posté sur la PR #6 : direction UX hybride inspirée d'Attio (cockpit relationnel, fiches), de Linear (qualité d'interaction, navigation, densité) et de Miro (canvas d'atelier manipulable), **sans copie visuelle** et en un langage graphique unifié. Le prototype vit sous `/studio` (branche `design/hybride-attio-linear-miro`), avec sa feuille de style scopée `app/studio/studio.css` (préfixe `.hx`). L'application existante n'est pas modifiée ; la direction « dossier de mission » (`/direction`, PR #6) reste une référence comparative.

## 1. Ce que chaque inspiration apporte, et comment c'est traduit

| Inspiration | Principe retenu | Traduction dans Studio |
|---|---|---|
| Attio | Les objets sont reliés : un client a des missions, qui ont des problèmes, des solutions, des décisions ; la fiche d'un objet montre ses propriétés et son fil d'activité | Fiche client `/studio/client/[id]` : colonne de propriétés modifiables en ligne, onglets Aperçu (fil d'activité fusionné), Missions, Problèmes, Solutions, Décisions, Documents ; volet « Mission » dans le cockpit ; tables à propriétés (phase, avancement, prochaine action, échéance, compteurs) |
| Linear | Densité maîtrisée, texte 13–13,5 px, navigation latérale claire avec compteurs, palette de commandes, raccourcis, volets latéraux qui s'ouvrent sans quitter la liste, états discrets | Navigation `.hx-nav` avec compteurs par client et par phase ; palette ⌘K / Ctrl+K (navigation, clients, missions, actions) ; raccourcis G C / G A / G N ; volets `.hx-volet` ; segments ; indicateur « Enregistré localement » |
| Miro | Un espace libre où l'on déplace, annote, relie ; le plan se déplace et se zoome ; les éléments se créent au clic | Canvas d'atelier `/studio/atelier` : couloirs par acteur, étapes et notes déplaçables, liens suivant l'ordre horizontal, déplacement du plan, zoom (Ctrl + molette, boutons), outils Étape / Note, épinglage d'une entrée de conversation en note, inspecteur de l'élément |

Fil conducteur conservé des PR #5 et #6 : la distinction explicite **humain / suggestion** (signature cuivre « proposé par règles » sur tout ce que l'outil produit), la hiérarchie claire, les visualisations utiles (canvas, carte des opportunités, stepper de phases).

## 2. Langage graphique

- **Neutres chauds clairs** : fond `#fbfbfa`, surfaces blanches, filets `#e7e5e0`, texte `#18181b` / `#52525b` / `#8a8a93`.
- **Accent d'interaction** (sélection, liens, phase courante) : `#3752c9`. **Cuivre** `#b5672a` réservé aux suggestions produites par règles. Couleurs de sens : vert (retenu, quick win), rouge (bloquant, douleur, retard), ambre (à vérifier, fictif, plus tard), bleu (observé, cible), violet (secondaire).
- **Typographie** : Inter partout, 13,5 px de base, titres 15 / 20 px à interlettrage serré, chiffres tabulaires. Fraunces n'est utilisée que pour le titre d'une solution ouverte en volet, en clin d'œil éditorial.
- **Formes** : rayons 6 / 8 / 12 px, ombres très légères, mouvement 140 ms, `prefers-reduced-motion` respecté.
- **Composants** : `.hx-btn` (primaire, cuivre, fantôme, danger, icône, pressé), `.hx-segments`, `.hx-tag`, `.hx-regle`, `.hx-prop` (propriété Attio), `.hx-niveau` (1–3 cliquable), `.hx-table` (en-têtes collants, survol, sélection, surbrillance croisée), `.hx-liste`, `.hx-bloc`, `.hx-stepper`, `.hx-fil-activite`, `.hx-onglets`, `.hx-volet`, `.hx-palette`, canvas (`.hx-canvas`, `.hx-couloir`, `.hx-noeud`, `.hx-note`, `.hx-lien`, `.hx-douleur`), `.hx-opportunites`, états (`.hx-vide`, `.hx-alerte`, `.hx-toast`, `.hx-sauvegarde`).

## 3. Les trois écrans maîtres

1. **Cockpit** (`/studio`) : chiffres clés, table des missions regroupée par phase (ou à plat), table des clients avec relations (missions, problèmes, outils sous-exploités), agenda « Cette semaine », signaux relus par règles, volet Mission au clic, palette ⌘K.
2. **Atelier** (`/studio/atelier`, ARDAN) : conversation à gauche (trame en puces, journal horodaté, saisie Client / Moi), canvas au centre, volet droit à onglets Copilote / Élément / Faits.
3. **Analyse** (`/studio/analyse`, boulangerie) : table des problèmes avec gravité et fréquence modifiables en ligne et rattachement intermétiers, carte des opportunités avec surbrillance croisée, liste des solutions, volets Problème et Solution (pourquoi, faisabilité, alternative sans IA, décision).

## 4. Fonctionnel vs simulé

| Fonction | État |
|---|---|
| Déplacement des étapes et notes, changement d'acteur par glisser dans un autre couloir, déplacement et zoom du plan, création au clic | **Fonctionnel** (positions conservées dans le navigateur) |
| Conversation : noter, convertir en étape / problème / fait, épingler sur le canvas, répondre à une question de la trame | **Fonctionnel** |
| Copilote : suggestions, création d'un problème avec rattachement proposé, question notée | **Fonctionnel, par règles** (`lib/intelligence`), jamais une IA |
| Extraction d'étapes depuis les notes | **Fonctionnel, par règles** ; étapes « proposées » à accepter |
| Gravité / fréquence en ligne, rattachement confirmé, preuves, causes, décision sur une solution, recalcul de la priorisation | **Fonctionnel** |
| Propositions de solutions depuis la bibliothèque | **Fonctionnel, par règles** |
| Propriétés du client (secteur, taille, contexte, outils sous-exploités) | **Fonctionnel** |
| Persistance | **Locale au navigateur** (clé dédiée) ; indicateur d'enregistrement et état d'erreur réels |
| Palette ⌘K, raccourcis clavier, volets, onglets | **Fonctionnel** |
| « Nouvelle mission », dépôt de documents, changement d'espace, bibliothèque | **Simulé** (toast ou désactivé) : disponibles dans l'application, non repris ici |
| Comptes, collaboration en temps réel, synchronisation serveur, IA externe | **Non inclus** ; prérequis Supabase et fournisseur IA documentés dans `docs/criteres-acceptation.md` |

## 5. Accessibilité, responsive, performance

- Clavier : palette, onglets, lignes de tables et éléments du canvas focusables ; Échap, Suppr, V / E / N dans l'atelier ; focus visible accent.
- Contrastes texte / fond ≥ 4,5:1 ; l'information de couleur est toujours doublée d'un libellé.
- Points de rupture : 1280 (volet droit de l'atelier repliable, cockpit et analyse en une colonne), 1024 (atelier empilé : canvas puis conversation puis volet), 860 (navigation basse, tables défilantes, volets plein écran).
- Pages statiques (`○`) sauf la fiche client ; aucune dépendance ajoutée ; bundle de la page atelier ≈ 9 ko.

## 6. Si la direction est validée

1. Remplacer la coquille de l'application par `.hx-coque` et porter les six phases : Préparer (fiche + propriétés), Atelier (canvas), Analyser (tables + volets), Décider (tableau de décisions, plan d'action), Restituer (document), Suivre (trajectoires).
2. Brancher le canvas sur le `Depot` de l'application (positions par mission) et conserver les tests de parcours existants.
3. Mobile de terrain : mode « capture rapide » dans l'atelier (saisie, photo, étape) et canvas en lecture.
