# Perspective C — L'avocat du diable

*Rédigé le 28 octobre 2026 à partir du brouillon v1, des quatre fiches de recherche et de six recherches web (extraits seulement, aucune page lue en entier). Rien n'est inventé ; ce qui n'est pas sourcé est marqué « hypothèse ».*

## Ma thèse en 5 lignes

1. Le brouillon v1 décrit une **plateforme** alors que le besoin réel, pour une consultante seule, est une **méthode outillée** : un bon canevas, un assistant IA généraliste et un espace de notes font 80 % du travail dès demain, sans une ligne de code.
2. Le seul avantage défendable (« apprendre entre missions, entre métiers ») n'existe pas avant 20 à 30 missions, et il est **juridiquement le point le plus fragile** du projet (RGPD, secret des affaires, clauses de confidentialité, AI Act).
3. Le marché visé ne paie pas : les diagnostics TPE sont **gratuits** via CMA/CCI (France Relance, valeur 600 €, pris en charge par l'État) ; une boulangerie ne sortira pas 500 € pour un « rapport d'une page ».
4. Les grands éditeurs descendent déjà en gamme (plan gratuit Celonis, ARIS Process Mining Basic gratuit, process mining inclus dans Power Automate Premium à 15 $/utilisateur/mois) ; prétendre servir les grands groupes **et** l'artisan avec un même produit n'est crédible ni d'un côté ni de l'autre.
5. Ce qu'il faut verrouiller dès le jour 1 n'est pas technique mais contractuel et documentaire : qui est responsable du conseil, ce qui sort de la mission, ce que le client peut récupérer et faire effacer. Le reste peut attendre.

## Désaccords explicites avec le brouillon v1

| Point du brouillon v1 | Ce que je pense | Preuve ou hypothèse |
|---|---|---|
| Idée 6 et 13 : graphe de connaissances anonymisé « problème → cause → solution → outil → preuve », alimenté après chaque mission | Avant 30 missions, c'est un tableur de 30 lignes. Le mot « graphe » vient de Celonis (PI Graph) et de Skan (Context Graph), qui ingèrent des millions d'événements. Le brouillon l'admet (§ 5.1 : « ne vaut qu'après 20 à 30 missions ») puis le met quand même au cœur de l'architecture | Fait : § 5.1 du brouillon ; fiche 01 (PI Graph), fiche 03 (Skan). Hypothèse : à 2 missions par mois, 30 missions = 15 mois minimum |
| Idée 13 : « pseudonymisation + agrégation k ≥ 5 » suffit à partager entre clients « sans risque juridique » | Faux deux fois. Une donnée pseudonymisée reste personnelle et soumise au RGPD ; une décision CNIL de juillet 2026 (5 M€, citée par un cabinet d'avocats, non vérifiée en source primaire) a sanctionné une fausse anonymisation. Et le RGPD ne couvre que les personnes : le secret des affaires d'une boulangerie (marges, fournisseurs) relève du contrat et de la loi 2018-670, pas de k ≥ 5 | Fait : CNIL/sources juridiques sur pseudonymisation ; article Stephenson Harwood (juillet 2026). Loi 2018-670 (transposition de la directive 2016/943) : fait connu, non recherché dans cette session |
| Idée 5 : catalogue codé PCF d'APQC pour rendre « comparables une boulangerie et une association » | Le PCF 8.0 (27 février 2026) : 13 catégories, 5 niveaux, conçu pour le benchmarking de grandes organisations. Coder « le four tombe en panne le lundi » en « 4.x Livrer des produits » ne produit aucune réutilisation, juste un sentiment de rigueur. Les benchmarks utiles sont derrière l'adhésion (jusqu'à 5 000 $ par enquête pour un non-membre, grille 2017) | Fait : fiche 03 § 3. Hypothèse : pour une TPE, une taxonomie « maison » de 20 causes types vaut mieux qu'un référentiel de plus de 1 000 processus (chiffre tiers, non vérifié) |
| Idée 15 : pack « première mission en 2 heures » vendu « à prix fixe aux artisans » | Le concurrent n'est pas Celonis, c'est le conseiller numérique de la CMA, gratuit. L'artisan a déjà reçu un diagnostic financé par l'État ; il ne paiera pas le second | Fait : diagnostics CMA/CCI gratuits (France Relance, valeur 600 € ; EvalNumPME gratuit, CPME). Hypothèse : le consentement à payer d'une boulangerie pour un diagnostic sec est proche de zéro ; il faut vendre un résultat, pas un rapport |
| Feuille de route « plus tard » : offre grands groupes, connecteurs Celonis/Signavio/Microsoft, export BPMN | Une consultante seule ne sera jamais référencée par un grand groupe à côté de SAP Signavio (Process Consulting Agent GA juin 2026) ou de Celonis. Même « au-dessus », il faudrait accès API, sécurité auditée, RC pro à la hauteur. À retirer pour ne pas polluer les choix d'architecture | Fait : fiche 01 (Signavio, Celonis). Hypothèse : aucun grand groupe n'achète un outil d'atelier à une structure sans certification |
| § 5.2 : « Dépendance à un fournisseur d'IA : gravité moyenne » | Gravité élevée : chaque résumé et chaque recommandation passe par un appel payant à un modèle dont le prix et le comportement changent sans préavis (UiPath a basculé son modèle par défaut secteur public US de Claude vers GPT-4o, note du 29 avril 2026 ; ARIS facture l'IA en crédits séparés) | Fait : fiches 02 et 03. Hypothèse : à ce stade, la consultante n'a aucun pouvoir de négociation |
| § 7.1 : « Un seul chemin : Mission → Atelier → Carte → Problèmes → Recommandations → Rapport » | Codifier un parcours avant de l'avoir joué 10 fois à la main, c'est figer des erreurs. Explozill a appris la même chose : on teste avec les joueurs avant d'ajouter des écrans | Hypothèse (méthode) ; à rapprocher de `docs/AUDIT-UX-REGLES-V2.md` côté Explozill |
| Idée 11 : annuaire de prestataires « monétisation possible (apport d'affaires), sans conflit d'intérêts si affiché » | Afficher ne suffit pas. Un conseil rémunéré par celui qu'il recommande est un apporteur d'affaires, et le client le sait. Si commission il y a : contractuelle, visible sur chaque fiche, et l'IA ne classe jamais un prestataire payant devant un gratuit | Hypothèse juridique (pas de recherche faite sur le courtage/apport d'affaires) ; principe de bon sens contractuel |

## Les six points imposés

### 1. Fonctionnalités oubliées (et pourquoi ce sont elles qui comptent)

Le brouillon a 15 idées produit et aucune idée « papier ». Il manque :

- **Mentions de responsabilité et validation humaine tracée** : chaque recommandation porte « proposée par l'IA le [date], validée par [consultante] le [date] » ; le rapport dit que les estimations (X heures, Y €/mois) sont des hypothèses. Sinon, le jour où un boulanger prend un abonnement à 80 €/mois sur une « recommandation » qui ne marche pas, c'est la consultante qui répond. La RC pro n'est pas obligatoire pour le conseil non réglementé (100 à 400 €/an, chiffres de courtiers) et couvre l'erreur de conseil « sous conditions » ; une recommandation non relue est le genre de condition qu'un assureur contestera (hypothèse).
- **Journal des recommandations IA** : UiPath trace la source de chaque idée (« Idea source : Task Mining », fiche 02). Il faut l'équivalent pour chaque texte généré : consigne versionnée, modèle, date, ce que l'humaine a changé. C'est aussi la réponse à l'article 4 de l'AI Act (maîtrise de l'IA, applicable depuis le 2 février 2025, sans seuil d'effectif) et à la transparence de l'article 50 (2 août 2026 selon la plupart des sources ; marquage technique reporté au 2 décembre 2026 selon une source ; à vérifier au JOUE).
- **Export complet des données client** et **effacement sur demande** : le brouillon prévoit un « rapport PDF/Markdown », pas l'export de tout l'espace (cartes, réponses, photos, journal). Une CCI exigera ces clauses ; le RGPD les impose pour les données de personnes.
- **Information des participants à l'atelier** : en risque (§ 5.2) mais pas en fonctionnalité. Noter « Marie refait deux fois la saisie » est un traitement de données d'un salarié : écran d'information en début d'atelier, registre des traitements pré-rempli par mission.
- **Point AI Act que personne n'a regardé** : l'annexe III classe à haut risque les systèmes d'IA utilisés dans l'emploi et la gestion des travailleurs (évaluation des performances, répartition des tâches). Un diagnostic fondé sur des photos de postes et un « journal de bord » par salarié peut y glisser (hypothèse d'interprétation, à faire valider par un juriste ; obligations reportées à décembre 2027 ou août 2028 selon les sources secondaires sur le Digital Omnibus, mais le projet vivra plus longtemps).

### 2. Méthodes des grands éditeurs : lesquelles sont des pièges

- **Le graphe sémantique / digital twin** (Celonis PI Graph et Context Model du 12 mai 2026 ; Skan Context Graph) : piège n° 1. Sens uniquement avec des millions d'événements horodatés. Pour nous, c'est une table.
- **OCEL 2.0 et XES** : cibles d'export un jour, pas un modèle de données interne aujourd'hui.
- **PM4Py** : AGPL-3.0, contaminant pour un SaaS ; licence commerciale Fraunhofer sinon. Risque disproportionné pour quelques diagrammes de variantes.
- **Le scoring d'Automation Hub** : le principe (5 questions, verdict en trois mots) est bon ; la mécanique (Automation Potential %, Ease of Implementation 65/35, coût par transaction) est faite pour un CoE et des licences robots. Prendre l'idée, pas l'algorithme.
- **Le task mining** (Skan, UiPath, Microsoft, ARIS) : piège absolu en TPE, le brouillon a raison de l'écarter (CNIL, sanction du 19 décembre 2024). Mais le « journal de bord à 1 clic » (idée 2) en est une version douce : données nominatives sur le temps de travail, mêmes précautions.
- **Les crédits IA** (ARIS AI Companion : « text to process model : 50 crédits ») : une leçon, pas un piège. Les éditeurs ont déplacé le coût de l'IA sur le client ; nous ferons pareil ou nous le subirons.

### 3. Solutions immédiates ARDAN / boulangerie : ce qui n'a pas besoin de la plateforme

Tout, pour les deux premières missions.

- **ARDAN (veille professionnelle)** : ARDAN est un dispositif régional qui cofinance un « stagiaire développeur » en PME (coût entreprise 6 500 € nets en Alsace, 2 500 € TTC pour Ardan Tremplin à Aix-Marseille ; Centre : moins de 100 salariés, pages de 2022). Sa veille, ce sont des mails, des newsletters, des sites institutionnels. Trois briques existantes suffisent : règles de tri dans la messagerie, résumé hebdomadaire par un assistant IA généraliste, tableau partagé des sources. La valeur de la consultante : choisir les sources et écrire la consigne du résumé. Zéro plateforme.
- **Boulangerie** : cartographie du matin en 20 minutes avec des post-it (idée 1), feuille de production dans un tableur partagé, un indicateur avant/après (invendus du soir, par exemple). La plateforme n'apporte rien que la photo du mur de post-it n'apporte déjà.

Ce que la plateforme apporterait, c'est la **capitalisation pour la consultante**, pas la valeur pour le client. Le client achète l'heure de la consultante, pas la plateforme. Le premier « produit » est donc un canevas, pas un logiciel.

### 4. Réutilisation entre métiers : conditions pour que ce soit vrai

Je prends position : la réutilisation est **vraie au niveau des causes, fausse au niveau des solutions chiffrées**. « Double saisie », « information qui n'arrive pas à la bonne personne », « attente d'une validation » se retrouvent partout (c'est ce que vend APQC). Mais « règle Gmail + résumé IA » ne sert à rien à un fournil sans ordinateur.

Conditions pour que ça marche :

1. Une taxonomie **courte** (20 causes, 30 recettes), écrite par la consultante, pas héritée du PCF.
2. Chaque recette est décrite **sans données client** dès sa rédaction (règle d'écriture, pas d'anonymisation a posteriori : on ne peut pas anonymiser ce qu'on n'a pas écrit).
3. Un **droit contractuel** explicite : la clause de mission autorise la consultante à conserver « les enseignements méthodologiques généraux, sans donnée identifiante ni information confidentielle ». Sans cette clause, la base commune viole les clauses de confidentialité classiques des missions (hypothèse fondée sur la pratique ; non recherché).
4. Un seuil : une recette n'entre dans la base « réutilisable » qu'après avoir marché **deux fois** chez deux clients différents. Avant, c'est une anecdote.
5. Pas de statistiques inter-clients avant un volume que je ne vois pas atteint avant 2028 (hypothèse).

À ces conditions, la base vaut quelque chose, pour la consultante, pas comme produit vendable.

### 5. Ergonomie : ce que « simple » coûte en rigueur

Chaque simplification a un prix caché :

- « **Trois niveaux, jamais plus** » : un processus de PME (commande → production → livraison → facturation) en a facilement cinq. On créera « une autre mission », on perdra le lien, et la base n'apprendra rien.
- « **Cinq lignes par recommandation** » : sans hypothèses ni « ça dépend si votre caisse exporte en CSV », c'est invérifiable, donc une responsabilité engagée sans garde-fou. Il faut deux champs de plus : « ce que je suppose » et « comment vérifier ».
- « **Des mots du client** » : excellent en atelier, mais le rapport destiné à un financeur (CCI, région) devra parler sa langue. Deux vocabulaires à maintenir.
- « **Rapports envoyés sans modification** » comme mesure (§ 7.13) : c'est la métrique qui pousse à ne plus relire. Mesurer l'inverse : taux de recommandations IA modifiées (si zéro, elle ne relit plus).

### 6. Architecture : ce qui doit être verrouillé au jour 1, ce qui peut attendre

**Jour 1, pour des raisons juridiques (même sans code, dans le contrat et la façon de ranger les fichiers) :**

- **Isolation par client** : un dossier (plus tard une table avec sécurité par ligne) par client, jamais de document contenant des données de deux clients. Seul point du brouillon (§ 6.1) que je garde tel quel.
- **Journalisation** : qui a vu quoi, quand ; ce que l'IA a produit, avec quelle consigne ; ce que l'humaine a validé. Dans Notion, c'est déjà l'historique de page.
- **Effacement** : supprimer intégralement un client, sauvegardes comprises, et savoir ce qui est parti chez le fournisseur d'IA (politique de rétention de l'API à vérifier ; non recherché ici).
- **Aucun envoi de données brutes à un fournisseur d'IA sans accord écrit du client** et sans minimisation (rôles plutôt que noms, pas de chiffres financiers si inutiles).
- **Le registre des traitements** pré-rempli par type de mission.

**Peut attendre (après 10 missions) :** graphe, import CSV, journal de bord sur téléphone, hors ligne, annuaire, assistant d'atelier en temps réel, exports BPMN/OCEL, multilingue.

## Les 8 risques qui tuent le projet (classés)

1. **Personne ne paie.** Diagnostics TPE gratuits (CMA/CCI, France Relance), aides régionales qui financent l'investissement et non le conseil (INAC Hauts-de-France : 40 % jusqu'à 12 000 €), ARDAN qui finance un salarié et non un outil. « La boulangerie paie 500 € » n'a aucune preuve. Parade : vendre une prestation à un financeur (CCI, réseau, collectif d'artisans), jamais un abonnement à l'artisan.
2. **Le secret des affaires et les clauses de confidentialité interdisent la base commune** telle que décrite. Parade : clause de « capitalisation méthodologique » dans chaque contrat, règle d'écriture sans données, seuil de deux clients.
3. **La responsabilité du conseil retombe sur la consultante sans filet.** Parade : validation humaine tracée, mentions, RC pro souscrite avant la première mission (coût faible), estimations étiquetées « hypothèse ».
4. **La construction mange le temps de mission.** Une consultante seule qui fait coder une plateforme ne fait pas de missions ; sans missions, pas de base ; sans base, pas de plateforme. Parade : zéro code avant 10 missions jouées sur des outils existants.
5. **Les éditeurs ferment la fenêtre.** Plan gratuit Celonis (1 Go selon un post communautaire, disponibilité incohérente selon les sources), ARIS Process Mining Basic gratuit (≤ 1 Go), process mining inclus dans Power Automate Premium (15 $/utilisateur/mois), « Process Consulting Agent » SAP (GA juin 2026). Le jour où l'un d'eux sort un « diagnostic PME par conversation », la plateforme maison n'a plus de raison d'être ; la relation terrain, si. Parade : investir dans la méthode et le réseau local.
6. **Dérive des coûts et dépendance au fournisseur d'IA.** Pas de pouvoir de négociation ; changement de modèle imposé (cas UiPath, avril 2026). Parade : coût IA par mission mesuré dès la première et refacturé, consignes versionnées, deux fournisseurs testés.
7. **L'AI Act requalifie l'outil.** S'il sert à évaluer ou répartir le travail des salariés (annexe III), il devient haut risque, hors de portée d'une structure seule (hypothèse d'interprétation ; calendrier reporté). Parade : finalité écrite excluant l'évaluation individuelle ; données par rôle, jamais par personne.
8. **Le conflit d'intérêts de l'annuaire** détruit la confiance, seule chose que vend une consultante. Parade : pas de commission avant que le produit soit établi ; sinon affichée, contractuelle, classement indépendant de la rémunération.

## Ce que je ferais à la place (MVP alternatif)

Ordonné ; l'effort est celui de la consultante.

1. **Contrat type de mission** avec clause de capitalisation méthodologique, mention « recommandations validées par l'humaine, estimations indicatives », droits d'export et d'effacement, information des participants. Effort faible (un juriste, une demi-journée ; coût à budgéter).
2. **RC pro souscrite** avant la première mission, en vérifiant explicitement que l'erreur de conseil assisté par IA est couverte. Effort faible.
3. **Canevas d'atelier en 12 questions + tableau libre**, sur papier et dans un espace de notes (Notion ou équivalent), un dossier par client, historique activé. Effort faible.
4. **Fiche recommandation en 7 champs** : quoi, avec quel outil existant, heures, €/mois, dépendances, **ce que je suppose**, **comment vérifier**. Effort faible.
5. **Consignes IA versionnées** (fichiers texte datés) pour trois tâches seulement : résumer l'atelier, proposer trois hypothèses de cause, relire la fiche recommandation. Données minimisées avant envoi (rôles, pas de noms). Effort faible.
6. **Journal des recommandations IA** : un tableau par mission (date, consigne, modèle, texte produit, ce qui a été modifié). Effort faible, mais discipline forte.
7. **Jouer ARDAN et la boulangerie avec ces six briques**, mesurer le coût IA par mission et le temps réel de chaque étape. Effort moyen (c'est le vrai travail).
8. **Taxonomie maison** : 20 causes, 30 recettes, règle « deux clients avant d'entrer dans la base ». Effort moyen, après 5 missions.
9. **Seulement ensuite, décider s'il faut coder** : si, après 10 missions, trois étapes font perdre plus d'une heure chacune, coder ces trois-là (probablement fiche recommandation, rapport une page, journal IA). Effort fort ; c'est là que l'isolation par ligne et l'effacement deviennent du code.
10. **Retirer de la feuille de route** l'offre grands groupes, le graphe, l'OCEL, PM4Py et l'annuaire monétisé jusqu'à preuve d'un financeur qui paie. Effort nul, courage moyen.

## Sources

Fichiers du dossier (lus en intégralité) : `brouillon-v1-idees-risques-feuille-de-route.md` ; `recherche/00-analystes-standards-cadre-legal.md` ; `recherche/01-celonis-signavio.md` ; `recherche/02-uipath-microsoft.md` ; `recherche/03-aris-skan-apqc.md`.

Recherches web (extraits de résultats, pages non lues en entier ; six recherches) :

- AI Act, calendrier et obligations : [artificialintelligenceact.eu – calendrier](https://artificialintelligenceact.eu/fr/implementation-timeline/) ; [Hub France IA – calendrier AI Act (PDF)](https://hub-franceia.fr/wp-content/uploads/2024/07/HFIA_Calendrier_AI-Act_GT-BAIA_vdef-1.pdf) ; [francefg.fr – guide AI Act (4 juillet 2026)](https://francefg.fr/ai-act/) ; [next.ink – « Le 2 août, l'AI Act avance et recule »](https://next.ink/249636/le-2-aout-lai-act-avance-et-recule-a-la-fois/) ; [agence-scroll – obligations 2 août 2026](https://agence-scroll.com/blog/ai-act-obligations-2-aout-2026) ; [tensoria – conformité PME 2026](https://tensoria.fr/blog/ai-act-conformite-pme-guide-2026). Les dates du haut risque (Digital Omnibus) et du marquage sont à confirmer au JOUE.
- RGPD, anonymisation, IA : [CNIL – fiches IA (juillet 2025, PDF)](https://www.cnil.fr/sites/default/files/2025-07/fiches_ia_schemas_developpement_des_systemes_ia.pdf) ; [CNIL – liste de vérification IA (PDF)](https://www.cnil.fr/sites/default/files/2025-07/ia_liste_de_verification.pdf) ; [Le Monde du Droit – pseudonymisation](https://www.lemondedudroit.fr/decryptages/96281-pseudonymisation-donnees-rgpd-rien-rgpd-mais-rgpd.html) ; [Stephenson Harwood – décision CNIL 5 M€ (juillet 2026)](https://www.stephensonharwood.com/insights/anonymisation-through-the-eyes-of-the-french-data-protection-authority-lessons-from-the-cnil-s-5-million-decision-july-2026/) ; [Legiscope – RGPD et IA](https://www.legiscope.com/blog/rgpd-intelligence-artificielle.html). Secret des affaires (loi 2018-670) : non recherché, fait de connaissance générale à vérifier.
- Responsabilité et RC pro : [Assurup – conseil inapproprié (17 juillet 2025)](https://www.assurup.com/blog/articles/conseil-inapproprie) ; [Assurup – erreur de conseil (1er juillet 2025)](https://www.assurup.com/blog/articles/suis-je-couvert-par-ma-rcpro-en-cas-erreur-de-conseil) ; [independant.io – RC pro consultant](https://independant.io/rc-pro-consultant) ; [Plateya – RC pro consultant 2026](https://www.plateya.fr/blog/detail/rc-pro-pour-consultant-en-2026-obligation-prix-et-garanties) ; [Coover – prix RC pro consultant](https://www.coover.fr/?p=31854). Chiffres de courtiers, à recouper.
- Diagnostics TPE : [Bpifrance Création – aides à la numérisation](https://bpifrance-creation.fr/encyclopedie/covid-19-aides-a-numerisation-entreprises) ; [Sage – dispositifs France Num](https://www.sage.com/fr-fr/blog/tpe-pme-dispositifs-accompagnement-numerique-france-num/) ; [les-aides.fr – diagnostics numériques France Num (PDF)](https://les-aides.fr/aide/YDkf3w/dge.diagnostics-numerique-france-num.pdf) ; [sk-web – aides digitalisation 2026 (prestataire, intérêt commercial)](https://sk-web.fr/article/aides-digitalisation-entreprises-2026) ; [Écho du Mardi – diagnostic numérique gratuit CMA](https://www.echodumardi.com/actualite/chambre-des-metiers-un-diagnostic-numerique-gratuit-pour-aider-les-artisans-a-surmonter-la-crise/?print=pdf). Aucun tarif officiel 2025-2026 trouvé.
- ARDAN : [les-aides.fr – ARDAN Développement (Centre, page 2022)](https://les-aides.fr/aide/GGb9/ardan-centre/ardan-developpement.html) ; [CCI Alsace Eurométropole – fiche ARDAN (PDF, 2021)](https://www.alsace-eurometropole.cci.fr/sites/g/files/mwbcuj986/files/2021-03/Fiche_ardan_aide_recruter_collaborateur.pdf) ; [les-aides.fr – Ardan Tremplin Aix-Marseille (PDF)](https://les-aides.fr/aide/cUNf3w/cci-aix-marseille-provence.ardan-tremplin.pdf) ; [les-aides.fr – ARDAN Hauts-de-France](https://les-aides.fr/aide/Fgf9/cci-hauts-de-france/ardan-action-regionale-pour-le-developpement-d-activites-nouvelles.html). Rien trouvé pour Nord Franche-Comté.
- Plan gratuit Celonis : [community.celonis.com – limites du plan gratuit](https://community.celonis.com/celonis-free-plan-4/what-are-the-limitations-of-celonis-free-plan-in-capabilities-and-gb-size-compared-to-the-commercial-plan-how-can-one-estimate-the-gb-required-for-certain-number-of-processes-25) ; [community.celonis.com – « free plan and academic alliance no longer available »](https://community.celonis.com/celonis-free-plan-4/celonis-free-plan-and-academic-alliance-no-longer-available-4852) ; [Celonis – webinaire plan gratuit](https://www.celonis.com/events/webinars/introduction-to-celonis-free-plan) ; [toolradar – pricing Celonis (vérifié 2 octobre 2026)](https://toolradar.com/tools/celonis/pricing) ; [spotsaas – pricing Celonis (mai 2026)](https://www.spotsaas.com/product/celonis/pricing). Sources contradictoires sur la disponibilité actuelle.
