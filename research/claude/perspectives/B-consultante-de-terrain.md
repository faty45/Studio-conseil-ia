# Perspective B — La consultante de terrain

*Studio Conseil IA, phase de conception. Rédigé le 28 octobre 2026 après lecture du brouillon v1 et des trois fiches de recherche. Six recherches web ciblées ; aucun outil testé par moi. Tout ce qui n'est pas sourcé est marqué « hypothèse ».*

## Ma thèse en 5 lignes

Le brouillon v1 décrit un logiciel avant d'avoir décrit une mission. Or une consultante seule vend une mission, pas un écran. Dans un fournil à 5 h ou dans un bureau associatif de trois personnes, ce qui marche est ce que le client tient dans la main : une feuille, un tableur, un fil WhatsApp, un compte rendu reçu avant que je sois remontée dans ma voiture. Il faut écrire la méthode et ses livrables, les jouer à la main sur ARDAN et la boulangerie, puis coder uniquement ce qui a été fait trois fois de la même façon. Le graphe de connaissances, l'OCEL 2.0 et le PCF ne sont pas faux ; ils sont prématurés et mangeront les six premières semaines.

## Désaccords explicites avec le brouillon v1

| Point du brouillon | Ce que je pense | Preuve ou hypothèse |
|---|---|---|
| Feuille de route « maintenant » : sept chantiers logiciels (espace isolé, atelier synchronisé, catalogue PCF…) en six semaines | C'est l'inverse d'« extrêmement simple ». Les deux premières missions se font sans une ligne de code. | Hypothèse, cohérente avec le § 5.2 du brouillon (« dette technique de l'extrêmement simple ») |
| Idée 5 : chaque douleur taguée PCF | Le PCF 8.0 a 13 catégories et 5 niveaux. Une boulangère ne dira jamais « 4.x Livrer des produits ». Le tag coûte du temps et ne vaut rien avant 20 missions. | Fait : fiche 03 (APQC, 27 février 2026) ; le brouillon (§ 5.1) dit lui-même « après 20 à 30 missions » |
| Idée 2 : journal de bord à 1 clic en OCEL 2.0 | Un client n'appuiera pas sur « j'ai commencé / j'ai fini » pendant une semaine. Une feuille de relevé papier pendant trois jours, remplie avec moi, suffit. | Hypothèse de terrain ; aucune source sur l'adhésion à un journal volontaire |
| Idée 14 : agent IA d'atelier qui propose des relances en direct | Pendant l'atelier, je regarde le client, pas mon téléphone. L'IA sert après : transcription, compte rendu. | Hypothèse |
| Idée 6 : graphe problème → cause → solution → outil → preuve | Ce qui se réutilise, c'est une trame d'atelier et dix patrons. Un tableur « patrons » suffit un an. | Hypothèse ; voir point 4 |
| § 7.2 : mode hors ligne avec synchronisation | Hors ligne, ça s'appelle un carnet et l'appareil photo. La synchro, c'est moi à 14 h. | Hypothèse ; le hors-ligne PWA est un vrai chantier pour un bénéfice gratuit autrement |
| Rien sur le devis, la facture, le temps passé, la relance | L'utilisatrice, c'est la consultante. Si l'outil ne l'aide pas à vendre et facturer, elle ne l'ouvrira pas. | Constat de lecture |

## 1. Fonctionnalités oubliées, vues du terrain

- **La fiche « ce que le client a dit », mot pour mot.** Quatre à six phrases notées telles quelles (« le lundi je jette un tiers des baguettes »). Elles ouvrent le compte rendu et titrent les recommandations. Un client se reconnaît dans ses mots, jamais dans « double saisie ».
- **La photo du poste annotée** au doigt, trois flèches. Elle remplace la carte de processus pour la plupart des TPE (hypothèse). L'application Photos suffit.
- **« Les 3 choses à faire lundi »**, datées, avec un prénom. Pas dix, trois.
- **Le compte rendu envoyé avant de quitter les lieux.** Une page, dictée dans la voiture, envoyée par WhatsApp ou mail dans l'heure. Sinon il arrive dans quinze jours.
- **Le rappel téléphonique à J+10**, cinq minutes, au lieu du formulaire « 10 secondes » de l'idée 12. Le client ne saisira rien ; il répondra à quelqu'un qu'il connaît.
- **Le mode « sans réseau »** : carnet, feuille de relevé pré-imprimée, photos. Rien d'exigé en direct.
- **Le temps de la consultante** chronométré (préparation, atelier, rédaction, relance) pour savoir ce que coûte vraiment une mission et fixer un prix.
- **Le devis et la facture** : modèle « diagnostic 2 heures » à prix fixe, suivi des paiements dans un tableur. Si la plateforme ne parle pas d'argent, un deuxième outil gagnera.
- **La fiche « ce qu'il a déjà »** (Microsoft 365, Google Workspace, caisse, WhatsApp Business, Canva), remplie en cinq minutes, avec une case « ce que je ne veux pas voir écrit ». C'est la condition de l'idée 8, et elle tient sur une demi-page.

## 2. Grands éditeurs : réutilisable ou théâtre

**Réutilisable, en version papier.**

- **Les cinq questions du High Level Assessment d'Automation Hub** (fiche 02, § 1.2), échelle 1 à 5 : la tâche est-elle régie par des règles ou créative ; l'entrée est-elle papier ou numérique ; structurée ou non ; les règles vont-elles changer ; existe-t-il une documentation. Dix minutes à l'oral, un post-it. Je les garde telles quelles ; les « 9 questions » récentes et les pondérations non publiées, je les ignore.
- **Le disqualifiant « changement majeur attendu »** qui met l'idée en attente (version 2021.10, à confirmer). Sur le terrain : « quelque chose change dans six mois, déménagement, nouveau logiciel, départ ? » Ça évite d'automatiser un poste qui va disparaître.
- **La séparation potentiel / facilité**, trois paliers (facile, moyen, difficile). Traduite en « ça rapporte / c'est faisable avec ce que vous avez », deux cases, trois couleurs.
- **Le coût récurrent par an** du Cost Benefit Analysis : les TPE oublient toujours l'abonnement mensuel. La ligne « combien par mois » du brouillon est juste.
- **Les 13 catégories de niveau 1 du PCF** comme check-list de couverture pour la consultante. Rien de plus.
- **Les trois colonnes de Microsoft, Case ID / Activity / Event Start** (fiche 02, § 2.3) : une feuille papier « quelle commande / quelle étape / quelle heure » est déjà un journal d'événements. Ce fait justifie de ne rien acheter.

**Théâtre, dans une TPE.**

- **Le task mining par enregistrement d'écran** (Skan : agent sur chaque poste ; UiPath et Microsoft : recorder). Dans une entreprise de trois personnes, c'est socialement impossible et juridiquement risqué : sanction CNIL de 40 000 € le 19 décembre 2024 pour des captures d'écran (fiche 00, § 3.3, source secondaire). Quarante-cinq minutes d'observation consentie font mieux.
- **Le pipeline d'idées en sept phases et six rôles** d'Automation Hub. En TPE il y a un rôle : le patron. Trois colonnes de tableur : « on fait », « plus tard », « non ».
- **BPMN, EPC, simulation** (UiPath, ARIS) : pas d'export avant qu'un prestataire l'ait demandé par écrit. **Les benchmarks APQC** (enquête jusqu'à 5 000 $ pour un non-membre, grille 2017) : hors sujet. **Le ROI en ETP** : 0,1 ETP ne veut rien dire dans une boulangerie ; « une heure par jour pour la patronne », si.

## 3. Solutions immédiatement exploitables

### ARDAN : veille semi-automatisée avec ce qui est déjà là

Hypothèse : l'équipe est sous Microsoft 365 ou Google Workspace (à vérifier en mission).

| Étape | Outil existant | Qui, combien de temps |
|---|---|---|
| Collecte | Google Alerts (gratuit, nombre d'alertes non plafonné) : 15 à 25 requêtes (dispositifs régionaux, aides, appels à projets, secteurs des PME suivies), livrées une fois par jour ; flux RSS (région, Bpifrance, CCI, presse économique locale) dans Feedly gratuit (100 sources et 3 flux selon des sources tierces, à vérifier) | Le « pilote veille », réglage initial 2 heures |
| Tri | Filtre Gmail ou Outlook : « expéditeur Google Alerts → dossier Veille, sauter la boîte de réception » ; étiquettes par thème | Le pilote, 20 minutes par jour : garde 5 à 10 éléments, supprime le reste |
| Résumé | Tableur partagé « Veille » (date, source, lien, deux lignes, pour qui, à diffuser le…). Sous Microsoft 365, Copilot Chat est inclus sans surcoût (sources tierces 2026 ; le module Copilot complet est payant, autour de 18 € HT par utilisateur et par mois selon ces sources, non confirmé chez Microsoft) : il propose les deux lignes, un humain relit | Le pilote, puis un relecteur |
| Rediffusion | L'outil d'envoi déjà utilisé (lettre d'information, mail groupé) ou une liste de diffusion WhatsApp Business (application gratuite) ; format fixe « quoi, pour qui, avant quand, lien » | Le relecteur, une heure le vendredi |

Aucun outil de veille payant avant trois mois de pratique ; aucun résumé ne part sans relecture.

**Temps gagné (hypothèse, à mesurer)** : si deux personnes passent chacune une heure par jour à lire et transférer, soit environ 10 heures par semaine, le dispositif ramène le travail à environ 3 heures. Gain plausible de 6 à 7 heures par semaine, mesuré par un relevé papier de trois jours avant et après.

### Boulangerie artisanale : cinq améliorations

Durées et coûts : hypothèses à confirmer sur place.

1. **Le cahier des invendus.** Feuille pré-imprimée (produit, fabriqué, vendu, jeté) remplie en 5 minutes à la fermeture pendant deux semaines, photographiée, recopiée par moi dans un tableur gratuit. Puis on ajuste la fournée du lundi et du mercredi. Coût zéro. Gain (hypothèse) : 20 à 30 % d'invendus en moins sur les deux ou trois produits les plus jetés.
2. **Vendre les invendus.** Too Good To Go : commission d'environ 25 % par panier, minimum d'environ 1,09 €, abonnement annuel d'environ 39 € d'après des sources tierces 2026 (aucune grille officielle trouvée, à vérifier sur l'espace commerçant). La loi Garot n'oblige au don que les commerces de plus de 400 m² ; les propositions d'abaisser à 100 ou 200 m² n'ont pas été adoptées d'après ce que j'ai trouvé (à confirmer sur Légifrance). Pas d'obligation pour un artisan ; un don à une association locale reste simple. 10 minutes par jour.
3. **Les commandes sur WhatsApp Business.** Application gratuite : catalogue des produits sur commande, message d'absence automatique avec l'heure limite, réponses rapides. Les commandes sont recopiées sur un bloc daté près du four. 2 heures de mise en place, coût zéro.
4. **Lire ce que la caisse sait déjà.** Export des ventes par produit et par heure sur un mois, lu dans un tableur : heures creuses, produits qui ne tournent pas. Une heure, coût zéro. Vérifier aussi la conformité NF525 : les sources se contredisent (loi de finances 2026 rétablissant l'attestation éditeur, ou certification obligatoire au 1er septembre 2026), à trancher auprès de la DGFiP. Les caisses certifiées pour boulangerie tournent autour de 60 à 90 € HT par mois selon des comparatifs 2026.
5. **Le planning sur une feuille A3** au fournil, doublé d'un calendrier partagé gratuit sur le téléphone de la patronne pour les commandes spéciales et les congés. 30 minutes par semaine.

## 4. Réutilisation entre métiers

**Ce qui se réutilise vraiment** : la trame d'atelier (mêmes 12 questions, même ordre ; un document, pas une base) ; une dizaine de patrons de problèmes au plus (l'information qui arrive au mauvais endroit, produire sans savoir ce qu'on vend, la commande prise de tête, la chose que seule une personne sait faire, le double enregistrement, l'attente d'une réponse), chacun avec un nom en français courant, deux questions pour le reconnaître et un relevé de trois jours pour le chiffrer ; la grille des cinq questions ; la fiche de recommandation ; le format de compte rendu ; deux ou trois recettes par outil courant (filtre de boîte mail, message d'absence WhatsApp, feuille de relevé).

**Ce qui ne se réutilise jamais** : les solutions finies (le cahier des invendus ne sert à rien chez ARDAN, le filtre de boîte mail ne sert à rien au fournil ; ce qui circule, c'est le patron et la recette de mesure) ; les chiffres (6 heures gagnées chez ARDAN ne prédisent rien pour une association ; les benchmarks k ≥ 5 du brouillon ne vaudront rien avant deux ans, hypothèse) ; les mots (chaque métier a les siens, la trame est traduite à la main avant chaque mission, en dix minutes).

## 5. Une mission type, heure par heure

**La veille, 30 minutes, portable.** Relire le devis, imprimer la trame et deux feuilles de relevé. L'outil : un dossier client avec les modèles déjà copiés. Il ne demande ni de « créer un espace », ni de choisir un métier, ni de taguer.

**8 h 30, arrivée.** Café, carnet fermé. Une question : « qu'est-ce qui vous empêche de dormir ? » Je note mot pour mot. L'outil ne fait rien.

**9 h – 10 h 30, atelier.** Trame des 12 questions, cartes papier sur la table (une étape, une carte ; un point rouge où ça coince). Téléphone en dictaphone si le client accepte. L'outil ne me demande pas de saisir pendant que je parle.

**10 h 30 – 11 h 15, visite des postes.** Trois photos par poste, annotées. Feuille de relevé expliquée au salarié et laissée trois jours. L'outil : l'appareil photo.

**11 h 15 – 12 h, tri à chaud.** Les cinq questions sur les trois idées sorties de l'atelier ; on garde « les 3 choses à faire lundi ». Fiche de recommandation remplie à la main, lue à voix haute.

**12 h – 12 h 30, au café d'en face.** Compte rendu d'une page dicté, relu, envoyé avant de reprendre la voiture. C'est le seul moment où l'IA doit être forte : transcription de l'enregistrement, mise en forme à partir du modèle, citations en tête, sans rien inventer. Je relis tout.

**14 h – 15 h, bureau.** Photos et feuilles rangées dans le dossier client ; une ligne ajoutée au tableur « missions » (date, métier, patrons, recommandations, temps passé, prix) ; facture générée depuis le modèle. Une ligne, pas un écran de vingt champs.

**J+3** : relevés reçus en photo par WhatsApp, chiffrés, renvoyés en deux lignes. **J+10, J+30, J+90** : appel de cinq minutes (« vous avez fait les trois choses ? qu'est-ce qui a coincé ? »), réponse notée dans la ligne. Rappels créés dans mon agenda quand j'ajoute la ligne.

**Ce que l'outil ne doit surtout pas demander** : une connexion pendant l'atelier ; un choix de taxonomie ; une saisie double (carnet puis écran) ; un mot de passe ou un formulaire au client ; une validation « IA » à chaque suggestion ; un chiffre que je n'ai pas mesuré.

## 6. Architecture : documents et tableur d'abord, code ensuite

On démarre avec un dossier de modèles (trame, feuille de relevé, fiche « ce qu'il a déjà », fiche recommandation, compte rendu, devis, facture) et deux tableurs : « missions » (une ligne par mission, nominatif, dans le dossier du client) et « patrons » (jamais un nom de client ni un chiffre brut : patron, métier, recette, outil, résultat qualitatif). La règle : on code une chose quand elle a été faite trois fois à la main de la même façon et que la consultante dit « j'en ai marre de la recopier ».

Pourquoi ça évolue à trois mois sans rien jeter :

- Les colonnes du tableur « missions » sont le futur modèle de données. Après trois missions, on sait quelles colonnes ont servi ; les vides disparaissent. On code un schéma déjà utilisé, pas imaginé.
- Les modèles de documents sont les futurs écrans. Un modèle rempli trois fois sans changer ses rubriques devient un formulaire ; un modèle modifié à chaque mission reste un document.
- Le tableur « patrons » est le futur catalogue et déjà l'apprentissage entre missions. Il n'a jamais contenu de données client : sa migration ne pose aucune question de confidentialité.
- Le dossier par client est le futur espace isolé. La séparation existe dès le premier jour par le rangement, pas par la sécurité par ligne ; quand on codera, la règle sera déjà claire.
- L'IA entre par un seul point : transcription et mise en forme du compte rendu. C'est ce qui fait gagner le plus (hypothèse : une heure par mission) et le premier morceau à coder, parce qu'on l'aura fait trois fois à la main dès la deuxième mission.

À trois mois : un modèle de données validé par l'usage, trois ou quatre écrans justifiés, un catalogue de patrons réel. Rien n'est jeté : tout est transcrit.

## Risques que je vois

- **Le logiciel vampirise la méthode** : six semaines de développement et toujours pas de trame d'atelier au point. C'est le risque principal du brouillon.
- **Le client ne saisit rien** : toute fonction qui suppose une saisie côté client (journal à 1 clic, avant/après en 10 secondes) restera vide. Prévoir le téléphone et la photo.
- **L'IA invente un chiffre dans un compte rendu.** Parade : seuls les chiffres des relevés et des citations ; relecture obligatoire ; aucun envoi automatique.
- **Confidentialité par négligence** : un nom de boulangerie écrit un jour dans « patrons ». Parade : la colonne « client » n'existe pas dans ce fichier.
- **La consultante devient prestataire informatique** : installer un filtre Outlook, oui ; administrer le Microsoft 365 d'ARDAN, non. Limite écrite dans le devis.
- **Conseiller une caisse ou une application anti-gaspillage sans vérifier la règle du moment** (sources NF525 contradictoires, tarifs Too Good To Go non publics) : « à vérifier » dans la fiche tant que ce n'est pas confirmé.

## Mon MVP priorisé

| # | Item | Effort |
|---|---|---|
| 1 | Trame d'atelier à 12 questions, imprimable, avec les cinq questions d'Automation Hub sur un post-it | Faible |
| 2 | Modèles : feuille de relevé 3 jours, fiche « ce qu'il a déjà », fiche recommandation 5 lignes, « les 3 choses à faire lundi » | Faible |
| 3 | Modèle de compte rendu d'une page et procédure « envoyé avant de partir » | Faible |
| 4 | Modèles de devis et de facture « diagnostic 2 heures » ; chronométrage de la mission | Faible |
| 5 | Tableur « missions » et tableur « patrons » (sans nom de client), un dossier par client | Faible |
| 6 | Jouer ARDAN et la boulangerie entièrement à la main avec les items 1 à 5 ; noter ce qui a été fait trois fois | Moyen |
| 7 | Première brique codée : transcription de l'atelier et mise en forme du compte rendu, citations en tête, relecture obligatoire | Moyen |
| 8 | Dix patrons de problèmes rédigés, avec questions de reconnaissance et recette de mesure | Moyen |
| 9 | Rappels J+10, J+30, J+90 dans l'agenda à partir de la ligne « mission » | Faible |
| 10 | Après 5 missions seulement : formulaire « mission » qui remplace la ligne de tableur, dossier client isolé en base | Fort |

## Sources

Internes : `brouillon-v1-idees-risques-feuille-de-route.md` ; `recherche/00-analystes-standards-cadre-legal.md` (CNIL, 19 décembre 2024) ; `recherche/02-uipath-microsoft.md` (High Level Assessment, Case ID / Activity / Event Start) ; `recherche/03-aris-skan-apqc.md` (PCF 8.0, Skan, benchmarks APQC).

Web, 28 octobre 2026 (extraits de résultats, pages non ouvertes, à vérifier avant usage client) :

- Loi Garot, seuil 400 m² : [Grant Thornton, 21 avril 2022](https://www.grantthornton.fr/globalassets/1.-member-firms/france/pdf/insight/2022/2022-04-21_grant-thornton-loi-garot-anti-gaspi.pdf) ; [LSA / Perifem](https://www.lsa-conso.fr/le-decryptage-reglementaire-perifem-lsa-comprendre-l-impact-des-lois-anti-gaspillage,456585).
- Too Good To Go, tarifs non officiels : [Combak, 2026](https://www.combak.co/blog/toogoodtogo-avis) ; [page officielle boulangerie, sans tarif](https://www.toogoodtogo.com/fr/b2b/chiffre-affaires-boulangerie).
- Google Alerts, Feedly gratuit : [Leptidigital, 2026](https://www.leptidigital.fr/productivite/outils-de-veille-informationnelle-gratuits-26202/) ; [La Fabrique du Net](https://www.lafabriquedunet.fr/logiciels/marketing-digital/veille-informationnelle/veille-gratuite).
- Copilot Chat inclus, Microsoft 365 Copilot payant : [Nordflux, licences 2026](https://nordflux.de/fr/ressources/copilot-lizenzen-2026-ueberblick) ; [Nordflux, hausse juillet 2026](https://nordflux.de/fr/ressources/microsoft-365-hausse-de-prix-2026).
- Caisse NF525 (sources contradictoires) : [Independant.io](https://independant.io/norme-nf525/) ; [Tunder](https://tunder.co/en/blog/letat-reporte-officiellement-la-certification-obligatoire-des-logiciels-de-caisse-au-1er-septembre-2026) ; [Tool Advisor, caisses boulangerie 2026](https://tool-advisor.fr/logiciel-de-caisse/comparatif/logiciel-de-caisse-boulangerie/).
- WhatsApp Business : [Meta, petites entreprises](https://whatsappbusiness.com/fr/resources/resource-library/small-business-use-whatsapp-business-app/) ; [Blog du Modérateur](https://www.blogdumoderateur.com/comment-utiliser-whatsapp-business-guide-complet).
