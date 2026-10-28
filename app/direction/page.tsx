import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Coque } from '../../components/direction/Coque';
import { Niveaux, Pastille, Propose, Stepper } from '../../components/direction/Elements';

const TEINTES: { nom: string; usage: string; v: string }[] = [
  { nom: 'Encre', usage: 'Rail, texte fort, action principale', v: '#13203a' },
  { nom: 'Papier', usage: 'Fond du canevas', v: '#f7f5f0' },
  { nom: 'Papier 2', usage: 'Panneau contextuel, fonds secondaires', v: '#efebe2' },
  { nom: 'Filet', usage: 'Séparations, bordures', v: '#e6e1d6' },
  { nom: 'Graphite 2', usage: 'Texte secondaire', v: '#4b5363' },
  { nom: 'Cuivre', usage: 'Ce que l’outil propose (règles)', v: '#b5672a' },
  { nom: 'Sauge', usage: 'Validé, quick win, cible atteinte', v: '#2f7a5b' },
  { nom: 'Garance', usage: 'Douleur, bloquant, retard', v: '#b2423e' },
  { nom: 'Cobalt', usage: 'Cible, modifié, à planifier', v: '#2f5fa8' },
  { nom: 'Ocre', usage: 'À vérifier, attention, fictif', v: '#b8891f' },
];

const AV = { preparer: 100, atelier: 100, analyser: 60, decider: 0, restituer: 0, suivre: 0 } as const;

export default function Direction() {
  return (
    <Coque page="direction">
      <header className="dv-entete">
        <div style={{ maxWidth: 820 }}>
          <div className="fil">
            <span className="t-sur">Proposition</span>
            <span className="t-sur" style={{ opacity: 0.5 }}>
              ·
            </span>
            <span className="t-sur">28 octobre 2026</span>
          </div>
          <h1 className="t-affiche grand">Le dossier de mission.</h1>
          <p className="t-corps" style={{ marginTop: 14, fontSize: 'var(--dv-t-17)', color: 'var(--dv-texte-2)', maxWidth: 680 }}>
            Une direction visuelle pour un logiciel de conseil haut de gamme : la retenue d’un dossier bien relié plutôt qu’un tableau de bord. Du papier, de l’encre, une seule couleur pour ce que
            l’outil propose, et des visualisations qui servent la décision.
          </p>
          <div className="dv-ligne" style={{ marginTop: 22 }}>
            <Link href="/direction/cockpit" className="dv-btn primaire">
              Cockpit <ArrowRight size={16} />
            </Link>
            <Link href="/direction/atelier" className="dv-btn primaire">
              Atelier et carte du processus <ArrowRight size={16} />
            </Link>
            <Link href="/direction/analyse" className="dv-btn primaire">
              Analyse et solutions <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      <section className="dv-section">
        <div className="tete">
          <div>
            <h2 className="t-section">Cinq principes</h2>
            <p>Ce qui distingue cette direction, et ce qu’elle refuse.</p>
          </div>
        </div>
        <ol className="dv-liste">
          {[
            ['Du papier et des filets, pas des cartes partout', 'Les contenus s’organisent par hiérarchie typographique, filets et espace. Les cadres sont réservés aux objets qu’on manipule : une solution, une étape, une fiche. Fini l’effet « grille de widgets ».'],
            ['Une typographie éditoriale', 'Fraunces (sérif à axes optiques) pour les titres et les grands chiffres, Inter pour l’interface et les données, chiffres tabulaires partout. Sept tailles, pas plus. Une hiérarchie qu’on lit comme un rapport de cabinet.'],
            ['Le cuivre est réservé à l’intelligence', 'Tout ce que l’outil propose par règles (rattachements, suggestions, étapes extraites, priorisation) porte la même signature : un losange cuivre et la mention « proposé par règles ». On voit d’un coup d’œil ce qui vient de l’humain et ce qui vient de la machine.'],
            ['Trois zones, une attention', 'Un rail d’encre pour s’orienter et garder le dossier sous les yeux, un canevas de travail large, un panneau contextuel pour le copilote et les détails. La densité est maîtrisée : on ne scrolle pas pour chercher, on scrolle pour lire.'],
            ['Des visualisations qui tranchent', 'La carte de processus en couloirs est la pièce maîtresse de l’atelier ; la carte des opportunités (impact selon effort) structure l’analyse ; les trajectoires avant → cible racontent le suivi. Chacune répond à une question du métier, aucune n’est décorative.'],
          ].map(([t, d], i) => (
            <li key={t}>
              <span className="ordre">{i + 1}</span>
              <div>
                <div className="titre">{t}</div>
                <div className="detail">{d}</div>
              </div>
              <span />
            </li>
          ))}
        </ol>
      </section>

      <section className="dv-section">
        <div className="tete">
          <div>
            <h2 className="t-section">Comparaison avec les logiciels B2B contemporains</h2>
            <p>Principes observés dans les outils professionnels de référence (gestion de produit, CRM nouvelle génération, outils de travail collaboratif). Observations générales, sans copier aucune création.</p>
          </div>
        </div>
        <table className="dv-table defilant">
          <thead>
            <tr>
              <th>Ce que font les meilleurs outils B2B</th>
              <th>Ce que fait la proposition</th>
              <th>Ce que faisait la version actuelle</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Rail de navigation sobre et dense, contexte de l’objet ouvert toujours visible', 'Rail d’encre avec le dossier de mission et ses six phases, état d’avancement par pastille', 'Barre latérale similaire, mais sans dossier ni état lisible d’un coup d’œil'],
              ['Listes et tableaux à filets fins plutôt que cartes empilées ; survol discret', 'Portefeuille, solutions et problèmes en tableaux et listes éditoriales numérotées', 'Cartes blanches partout, hiérarchie plate, effet formulaire'],
              ['Une couleur d’accent, le reste en neutres ; couleurs de sens stables', 'Cuivre réservé à l’intelligence, quatre couleurs de sens, neutres chauds', 'Mêmes teintes de base, mais utilisées sans règle d’usage'],
              ['Chiffres clés en grande taille, libellés en capitales espacées', 'Bande de chiffres à filets, sérif optique, tendance sous chaque chiffre', 'Métriques en boîtes, grandes sur mobile, peu de tendance'],
              ['Panneau latéral de détail qui s’ouvre sans quitter la liste', 'Panneau contextuel permanent : copilote, faits, solution sélectionnée', 'Détails empilés sous les listes, longs défilements'],
              ['Visualisations intégrées au flux de travail, pas en « dashboard »', 'Carte de processus en pièce maîtresse, carte des opportunités, trajectoires', 'Mêmes visualisations, mais à l’étroit dans des cartes'],
              ['États vides, de chargement et d’erreur dessinés', 'Vide en pointillé avec un geste proposé, squelettes, alertes à bord coloré', 'États vides sommaires'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td className="t-petit">{a}</td>
                <td>{b}</td>
                <td className="t-petit">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="dv-section">
        <div className="tete">
          <div>
            <h2 className="t-section">Couleurs</h2>
            <p>Neutres chauds, une couleur d’intelligence, quatre couleurs de sens. Tous les contrastes texte / fond sont d’au moins 4,5:1.</p>
          </div>
        </div>
        <div className="dv-nuancier">
          {TEINTES.map((t) => (
            <div key={t.nom} className="teinte">
              <i style={{ background: t.v }} />
              <span>
                <b>{t.nom}</b>
                {t.usage}
                <br />
                <code style={{ fontSize: 'var(--dv-t-11)' }}>{t.v}</code>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="dv-section">
        <div className="tete">
          <div>
            <h2 className="t-section">Typographie</h2>
            <p>Fraunces Variable pour l’affiche et les chiffres (axe optique réglé par taille), Inter Variable pour le reste. Échelle fixe.</p>
          </div>
        </div>
        <div className="dv-echelle">
          <div>
            <span className="t-mini">Affiche · 48 / 34</span>
            <span className="t-affiche">Deux missions en cours.</span>
          </div>
          <div>
            <span className="t-mini">Titre · 26</span>
            <span className="t-titre">Carte des opportunités</span>
          </div>
          <div>
            <span className="t-mini">Section · 20</span>
            <span className="t-section">Problèmes, du plus lourd au plus léger</span>
          </div>
          <div>
            <span className="t-mini">Corps · 15</span>
            <span className="t-corps">Les deux chargées de veille lisent les mêmes newsletters institutionnelles ; aucune répartition écrite des sources.</span>
          </div>
          <div>
            <span className="t-mini">Petit · 12,5</span>
            <span className="t-petit">Source : boîtes mail montrées en atelier, 27 octobre 2026.</span>
          </div>
          <div>
            <span className="t-mini">Sur-titre · 11</span>
            <span className="t-sur">Rattachement intermétiers</span>
          </div>
          <div>
            <span className="t-mini">Citation</span>
            <span className="t-citation">« Le lundi matin, je ne fais que trier ma boîte mail. »</span>
          </div>
          <div>
            <span className="t-mini">Chiffre</span>
            <span className="t-chiffre">75 → 30</span>
          </div>
        </div>
      </section>

      <section className="dv-section">
        <div className="tete">
          <div>
            <h2 className="t-section">Composants</h2>
            <p>Un langage court : boutons, pastilles, signature « proposé par règles », niveaux, stepper, états.</p>
          </div>
        </div>
        <div className="dv-grille deux">
          <div className="dv-bloc">
            <div className="tete">
              <div className="t-sur">Boutons</div>
            </div>
            <div className="corps dv-ligne">
              <span className="dv-btn primaire">Action principale</span>
              <span className="dv-btn">Secondaire</span>
              <span className="dv-btn cuivre">Proposer (règles)</span>
              <span className="dv-btn fantome">Discret</span>
              <span className="dv-btn petit">Petit</span>
              <button type="button" className="dv-btn" disabled>
                Désactivé
              </button>
            </div>
          </div>
          <div className="dv-bloc">
            <div className="tete">
              <div className="t-sur">Pastilles et signature</div>
            </div>
            <div className="corps dv-ligne">
              <Pastille ton="sauge">Retenue</Pastille>
              <Pastille ton="garance">Bloquant</Pastille>
              <Pastille ton="cobalt">Observé</Pastille>
              <Pastille ton="ocre">À vérifier</Pastille>
              <Pastille ton="cuivre">Signal</Pastille>
              <Pastille ton="encre" point={false}>
                Analyser
              </Pastille>
              <Pastille ton="contour" point={false}>
                3 patrons
              </Pastille>
              <Propose />
            </div>
          </div>
          <div className="dv-bloc">
            <div className="tete">
              <div className="t-sur">Niveaux et stepper</div>
            </div>
            <div className="corps" style={{ display: 'grid', gap: 14 }}>
              <div className="dv-ligne" style={{ fontSize: 'var(--dv-t-14)' }}>
                Gravité <Niveaux valeur={3} ton="garance" label="Gravité" /> Fréquence <Niveaux valeur={2} label="Fréquence" /> Effort <Niveaux valeur={1} ton="cobalt" label="Effort" />
              </div>
              <Stepper avancement={AV} courante="analyser" />
            </div>
          </div>
          <div className="dv-bloc">
            <div className="tete">
              <div className="t-sur">États</div>
            </div>
            <div className="corps" style={{ display: 'grid', gap: 12 }}>
              <div className="dv-vide" style={{ padding: 20 }}>
                <div className="t-section">Aucune étape pour l’instant</div>
                <div className="t-petit">Note la première phrase du client, ou extrais les étapes des notes.</div>
                <span className="dv-btn petit cuivre" style={{ marginTop: 10 }}>
                  Extraire des notes
                </span>
              </div>
              <div style={{ display: 'grid', gap: 8 }} aria-label="Chargement">
                <div className="dv-squelette" style={{ width: '70%' }} />
                <div className="dv-squelette" style={{ width: '90%' }} />
                <div className="dv-squelette" style={{ width: '50%' }} />
              </div>
              <div className="dv-alerte garance">
                <span aria-hidden>●</span>
                <div>
                  <strong>Enregistrement impossible</strong>
                  <div className="t-petit">Le navigateur refuse l’écriture locale. Tes notes restent à l’écran : exporte-les avant de fermer.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dv-section">
        <div className="tete">
          <div>
            <h2 className="t-section">Comment juger cette proposition</h2>
            <p>Trois écrans de référence, les autres hériteront du même système une fois la direction validée.</p>
          </div>
        </div>
        <ol className="dv-liste">
          {[
            ['Cockpit', 'Lire en dix secondes où en sont les missions, ce qui vient cette semaine, ce qui coince. Le portefeuille est un tableau, les signaux sont relus par règles.', '/direction/cockpit'],
            ['Atelier', 'Tenir la conversation, la carte du processus et le copilote sur un même écran sans se perdre. La carte est la pièce maîtresse ; le copilote reste discret, à droite.', '/direction/atelier'],
            ['Analyse', 'Comprendre pourquoi une solution est proposée et ce qu’elle demande, en croisant problèmes, carte des opportunités et tableau comparatif.', '/direction/analyse'],
          ].map(([t, d, href], i) => (
            <li key={t}>
              <span className="ordre">{i + 1}</span>
              <div>
                <div className="titre">{t}</div>
                <div className="detail">{d}</div>
              </div>
              <Link href={href} className="dv-btn petit">
                Voir <ArrowRight size={14} />
              </Link>
            </li>
          ))}
        </ol>
        <div className="dv-alerte" style={{ marginTop: 20 }}>
          <span aria-hidden>●</span>
          <div>
            <strong>Ce que cette proposition ne verrouille pas.</strong>
            <div className="t-petit">
              Les écrans sont des maquettes codées, statiques, sur données fictives. Un travail UX indépendant peut les confronter : le dossier <code>design/manus/</code> reste ouvert. Rien n’est appliqué à l’application tant que la direction n’est pas validée.
            </div>
          </div>
        </div>
      </section>
    </Coque>
  );
}
