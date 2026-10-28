import { ArrowRight, Plus, Sparkles } from 'lucide-react';
import { Coque } from '../../../components/direction/Coque';
import { Niveaux, Pastille, Propose, Stepper } from '../../../components/direction/Elements';
import { Opportunites } from '../../../components/direction/Opportunites';
import { CLIENT_BOULANGERIE, MISSION_BOULANGERIE } from '../../../lib/domain/demo';
import { LIBELLES_CATEGORIE, LIBELLES_DECISION, LIBELLES_EFFORT, LIBELLES_FREQUENCE, LIBELLES_GRAVITE, LIBELLES_PRIORITE, LIBELLES_STATUT_CAUSE, LIBELLES_TYPE_PREUVE, avancement } from '../../../lib/domain/types';
import { problemeUniversel } from '../../../lib/bibliotheque';
import { classer } from '../../../lib/intelligence/classification';
import { getPack } from '../../../lib/packs';

const TON_PRIO = { quick_win: 'sauge', a_planifier: 'cobalt', a_construire: 'cuivre', specialiste: 'ocre' } as const;

export default function AnalyseDirection() {
  const m = MISSION_BOULANGERIE;
  const c = CLIENT_BOULANGERIE;
  const pack = getPack(m.packId);
  const av = avancement(m);
  const problemes = [...m.problemes].sort((a, b) => b.gravite * b.frequence - a.gravite * a.frequence);
  const selectionP = m.problemes.find((p) => p.id === 'p1')!;
  const selectionS = m.solutions.find((s) => s.id === 's-boul-1')!;
  const classification = classer(selectionP.texte, pack.processusIds, 2);
  const retenues = m.solutions.filter((s) => s.decision === 'retenue');

  const panneau = (
    <>
      <section>
        <div className="dv-ligne espace" style={{ marginBottom: 6 }}>
          <div className="t-sur">Solution sélectionnée</div>
          <Pastille ton={TON_PRIO[selectionS.priorite]} point={false}>
            {LIBELLES_PRIORITE[selectionS.priorite]}
          </Pastille>
        </div>
        <h2 className="t-section" style={{ marginBottom: 6 }}>
          {selectionS.titre}
        </h2>
        <p className="t-petit">{selectionS.detail}</p>
        <div className="t-sur cuivre" style={{ margin: '18px 0 8px' }}>
          Pourquoi cette proposition
        </div>
        <Propose />
        <ul style={{ display: 'grid', gap: 6, marginTop: 8, fontSize: 'var(--dv-t-14)' }}>
          {selectionS.explication.map((x, i) => (
            <li key={i} style={{ paddingLeft: 12, textIndent: -12 }}>
              · {x}
            </li>
          ))}
        </ul>
        <div className="t-sur" style={{ margin: '18px 0 8px' }}>
          Faisabilité
        </div>
        <div className="dv-faisabilite">
          <div>
            <span>Effort</span>
            <Niveaux valeur={selectionS.faisabilite.effort === 'faible' ? 1 : selectionS.faisabilite.effort === 'moyen' ? 2 : 3} ton="cobalt" label="Effort" />
            <span>{LIBELLES_EFFORT[selectionS.faisabilite.effort]}</span>
          </div>
          <div>
            <span>Impact</span>
            <Niveaux valeur={selectionS.impact} ton="sauge" label="Impact" />
            <span>{selectionS.impact}/3</span>
          </div>
          <div>
            <span>Coût mensuel</span>
            <span />
            <span>{selectionS.faisabilite.coutMensuel}</span>
          </div>
          <div>
            <span>Outils</span>
            <span />
            <span>{selectionS.outilsCompatibles.length ? selectionS.outilsCompatibles.join(', ') : 'Papier et crayon'}</span>
          </div>
        </div>
        {selectionS.faisabilite.prerequis.length > 0 && (
          <p className="t-petit" style={{ marginTop: 12 }}>
            <strong>Prérequis :</strong> {selectionS.faisabilite.prerequis.join(' ')}
          </p>
        )}
        {selectionS.faisabilite.risques.length > 0 && (
          <p className="t-petit" style={{ marginTop: 6 }}>
            <strong>Risques :</strong> {selectionS.faisabilite.risques.join(' ')}
          </p>
        )}
        <div className="dv-ligne" style={{ marginTop: 16 }}>
          <span className="dv-btn petit primaire">Retenue</span>
          <span className="dv-btn petit">Plus tard</span>
          <span className="dv-btn petit fantome">Écarter</span>
        </div>
      </section>
    </>
  );

  return (
    <Coque page="analyse" panneau={panneau} mission={{ client: c.nom.replace(' (exemple fictif)', ''), titre: m.titre, phase: 'analyser', avancement: av }}>
      <header className="dv-entete">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="fil">
            <span className="t-sur">Analyser</span>
            <span className="t-sur" style={{ opacity: 0.5 }}>
              ·
            </span>
            <span className="t-sur">{c.nom.replace(' (exemple fictif)', '')}</span>
            <Pastille ton="ocre" point={false}>
              Fictif
            </Pastille>
          </div>
          <h1 className="t-affiche">{m.titre}</h1>
          <div className="meta">
            <span>5 problèmes formalisés, 2 bloquants</span>
            <span>8 solutions candidates, 3 retenues</span>
            <span>Aucune dépendance à une IA dans les retenues</span>
          </div>
          <div style={{ marginTop: 20, maxWidth: 720 }}>
            <Stepper avancement={av} courante="analyser" />
          </div>
        </div>
        <div className="dv-actions">
          <span className="dv-btn cuivre">
            <Sparkles size={16} /> Proposer des solutions
          </span>
          <span className="dv-btn primaire">
            Passer à la décision <ArrowRight size={16} />
          </span>
        </div>
      </header>

      <section className="dv-section">
          <div className="tete">
            <div>
              <h2 className="t-section">Carte des opportunités</h2>
              <p>Impact selon effort, calculé par règles à partir des problèmes rattachés et de la faisabilité. Les retenues sont cerclées.</p>
            </div>
          </div>
          <div className="dv-bloc">
            <div className="corps" style={{ paddingTop: 20, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 200px', gap: 24, alignItems: 'center' }}>
              <Opportunites solutions={m.solutions} selection={selectionS.id} />
              <div className="dv-legende" style={{ marginTop: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>
                  <i style={{ background: 'var(--dv-sauge)', borderColor: 'var(--dv-sauge)', borderRadius: '50%', width: 10, height: 10 }} /> Quick win
                </span>
                <span>
                  <i style={{ background: 'var(--dv-cobalt)', borderColor: 'var(--dv-cobalt)', borderRadius: '50%', width: 10, height: 10 }} /> À planifier
                </span>
                <span>
                  <i style={{ background: 'var(--dv-cuivre)', borderColor: 'var(--dv-cuivre)', borderRadius: '50%', width: 10, height: 10 }} /> À construire
                </span>
                <span>
                  <i style={{ background: 'var(--dv-ocre)', borderColor: 'var(--dv-ocre)', borderRadius: '50%', width: 10, height: 10 }} /> Avec un spécialiste
                </span>
              </div>
            </div>
          </div>

      </section>

      <div className="dv-grille analyse">
        <section className="dv-section" aria-label="Problèmes">
          <div className="tete">
            <div>
              <h2 className="t-section">Problèmes, du plus lourd au plus léger</h2>
              <p>Gravité × fréquence. Chaque problème porte ses preuves, ses causes et son rattachement intermétiers.</p>
            </div>
            <span className="dv-btn petit">
              <Plus size={14} /> Ajouter
            </span>
          </div>
          <ol className="dv-liste">
            {problemes.map((p, i) => (
              <li key={p.id} className={`deux${p.id === selectionP.id ? ' selection' : ''}`}>
                <span className="ordre">{i + 1}</span>
                <div>
                  <div className="titre">
                    <span>{p.texte}</span>
                    <Pastille ton={p.gravite === 3 ? 'garance' : p.gravite === 2 ? 'ocre' : 'contour'} point={false}>
                      {LIBELLES_GRAVITE[p.gravite]} · {LIBELLES_FREQUENCE[p.frequence].toLowerCase()}
                    </Pastille>
                  </div>
                  <div className="detail">
                    {p.universelId && (
                      <>
                        <span style={{ color: 'var(--dv-cuivre-fonce)', fontWeight: 600 }}>{problemeUniversel(p.universelId)?.label}</span>
                        {' · '}
                      </>
                    )}
                    {p.preuves.length} preuve{p.preuves.length > 1 ? 's' : ''} · {p.causes.length} cause{p.causes.length > 1 ? 's' : ''} · {m.solutions.filter((s) => s.problemeIds.includes(p.id)).length} solution(s)
                  </div>
                  <div className="marqueurs">
                    <span className="t-mini">Gravité</span>
                    <Niveaux valeur={p.gravite} ton="garance" label="Gravité" />
                    <span className="t-mini" style={{ marginLeft: 8 }}>
                      Fréquence
                    </span>
                    <Niveaux valeur={p.frequence} label="Fréquence" />
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="dv-bloc" style={{ marginTop: 24 }}>
            <div className="tete">
              <div>
                <div className="t-sur">Problème 1 · fiche</div>
                <h3 className="t-section" style={{ marginTop: 4 }}>
                  {selectionP.texte}
                </h3>
              </div>
            </div>
            <div className="corps">
              <div className="dv-grille deux">
                <div>
                  <div className="dv-ligne espace" style={{ marginBottom: 8 }}>
                    <span className="t-sur cuivre">Rattachement intermétiers</span>
                    <Propose />
                  </div>
                  <div className="dv-alerte cuivre" style={{ display: 'block' }}>
                    <strong>{classification[0]?.universel.label}</strong> <Pastille ton="sauge" point={false}>Confirmé</Pastille>
                    <ul className="t-petit" style={{ marginTop: 6, display: 'grid', gap: 3 }}>
                      {classification[0]?.explication.map((x, i) => (
                        <li key={i}>· {x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <div className="t-sur" style={{ marginBottom: 8 }}>
                    Preuves
                  </div>
                  <ul style={{ display: 'grid', gap: 6, fontSize: 'var(--dv-t-14)' }}>
                    {selectionP.preuves.map((pr) => (
                      <li key={pr.id} className="dv-ligne">
                        <Pastille ton="contour" point={false}>
                          {LIBELLES_TYPE_PREUVE[pr.type]}
                        </Pastille>
                        {pr.source} <span className="t-mini">{pr.date}</span>
                      </li>
                    ))}
                    <li className="t-petit" style={{ color: 'var(--dv-ocre)' }}>
                      + à demander : relevé de deux semaines (fabriqué, vendu, jeté)
                    </li>
                  </ul>
                  <div className="t-sur" style={{ margin: '14px 0 8px' }}>
                    Causes candidates
                  </div>
                  <ul style={{ display: 'grid', gap: 6, fontSize: 'var(--dv-t-14)' }}>
                    {selectionP.causes.map((k) => (
                      <li key={k.id} className="dv-ligne espace">
                        <span>{k.texte}</span>
                        <Pastille ton={k.statut === 'validee' ? 'sauge' : k.statut === 'invalidee' ? 'garance' : 'ocre'} point={false}>
                          {LIBELLES_STATUT_CAUSE[k.statut]}
                        </Pastille>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dv-section" aria-label="Solutions">
          <div className="tete">
            <div>
              <h2 className="t-section">Solutions candidates</h2>
              <p>
                {m.solutions.length} propositions, {retenues.length} retenues. Comparées sur une ligne : ce qu’elles résolvent, ce qu’elles demandent.
              </p>
            </div>
          </div>
          <table className="dv-table defilant">
            <thead>
              <tr>
                <th>Solution</th>
                <th>Répond à</th>
                <th>Effort</th>
                <th>Avec l’existant</th>
                <th>Décision</th>
              </tr>
            </thead>
            <tbody>
              {m.solutions.map((s) => (
                <tr key={s.id} style={s.id === selectionS.id ? { background: 'var(--dv-surface)' } : undefined}>
                  <td>
                    <div className="dv-ligne" style={{ marginBottom: 4 }}>
                      <Pastille ton={TON_PRIO[s.priorite]} point={false}>
                        {LIBELLES_PRIORITE[s.priorite]}
                      </Pastille>
                      {s.necessiteIA && (
                        <Pastille ton="ocre" point={false}>
                          Dépend d’une IA
                        </Pastille>
                      )}
                    </div>
                    <div style={{ fontWeight: 600 }}>{s.titre}</div>
                    <div className="t-mini">{LIBELLES_CATEGORIE[s.categorie]}</div>
                  </td>
                  <td className="t-petit">{s.problemeIds.map((id) => `P${problemes.findIndex((p) => p.id === id) + 1}`).join(', ')}</td>
                  <td>
                    <Niveaux valeur={s.faisabilite.effort === 'faible' ? 1 : s.faisabilite.effort === 'moyen' ? 2 : 3} ton="cobalt" label="Effort" />
                    <div className="t-mini">coût {s.faisabilite.coutMensuel}</div>
                  </td>
                  <td className="t-petit">{s.outilsCompatibles.length ? s.outilsCompatibles.join(', ') : s.faisabilite.outilDejaPresent ? 'Oui' : 'Sans outil'}</td>
                  <td>
                    <Pastille ton={s.decision === 'retenue' ? 'sauge' : s.decision === 'ecartee' ? 'garance' : s.decision === 'plus_tard' ? 'ocre' : 'contour'} point={false}>
                      {LIBELLES_DECISION[s.decision]}
                    </Pastille>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </Coque>
  );
}
