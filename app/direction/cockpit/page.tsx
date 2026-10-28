import Link from 'next/link';
import { ArrowRight, Plus, Sparkles } from 'lucide-react';
import { Coque } from '../../../components/direction/Coque';
import { Chiffre, Pastille, Propose, Stepper, Trajectoire } from '../../../components/direction/Elements';
import { DEMO } from '../../../lib/domain/demo';
import { PHASES, avancement, LIBELLES_TAILLE } from '../../../lib/domain/types';
import { getPack } from '../../../lib/packs';
import { patron } from '../../../lib/bibliotheque';

const AUJOURDHUI = new Date('2026-10-28T09:00:00Z');
const JOURS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export default function CockpitDirection() {
  const missions = DEMO.missions;
  const client = (id: string) => DEMO.clients.find((c) => c.id === id)!;
  const actions = missions
    .flatMap((m) => m.actions.filter((a) => a.statut !== 'faite' && a.statut !== 'abandonnee').map((a) => ({ ...a, mission: m })))
    .sort((a, b) => a.echeance.localeCompare(b.echeance));
  const retenues = missions.flatMap((m) => m.solutions.filter((s) => s.decision === 'retenue'));
  const quickWins = retenues.filter((s) => s.priorite === 'quick_win');
  const sansPreuve = missions.flatMap((m) => m.problemes.filter((p) => p.gravite >= 2 && p.preuves.length === 0).map((p) => ({ p, m })));
  const nonMesurees = missions.flatMap((m) => m.mesures.filter((x) => x.avant === undefined).map((x) => ({ x, m })));
  const patronsUtilises = new Map<string, number>();
  for (const s of retenues) if (s.patronId) patronsUtilises.set(s.patronId, (patronsUtilises.get(s.patronId) ?? 0) + 1);

  const panneau = (
    <>
      <section>
        <div className="t-sur cuivre" style={{ marginBottom: 10 }}>
          Signaux
        </div>
        <Propose>Relus par règles</Propose>
        <ul style={{ marginTop: 12, display: 'grid', gap: 12 }}>
          {sansPreuve.map(({ p, m }) => (
            <li key={p.id} className="dv-alerte garance">
              <span aria-hidden>●</span>
              <div>
                <strong>Problème coûteux sans preuve</strong>
                <div className="t-petit">« {p.texte} » — {client(m.clientId).nom.replace(' (exemple fictif)', '')}. Une observation ou un document le rendra défendable à la restitution.</div>
              </div>
            </li>
          ))}
          {nonMesurees.map(({ x, m }) => (
            <li key={x.id} className="dv-alerte ocre">
              <span aria-hidden>●</span>
              <div>
                <strong>Mesure sans valeur « avant »</strong>
                <div className="t-petit">{x.indicateur} ({x.unite}) — {client(m.clientId).nom.replace(' (exemple fictif)', '')}. Le relevé de deux semaines commence lundi.</div>
              </div>
            </li>
          ))}
          <li className="dv-alerte">
            <span aria-hidden>●</span>
            <div>
              <strong>Restitution ARDAN à préparer</strong>
              <div className="t-petit">Six recommandations retenues, cinq actions planifiées ; la synthèse n’est pas encore validée avec le client.</div>
            </div>
          </li>
        </ul>
      </section>
      <section>
        <div className="t-sur" style={{ marginBottom: 10 }}>
          Décisions récentes
        </div>
          <ul className="dv-liste" style={{ fontSize: 'var(--dv-t-14)' }}>
            {missions
              .flatMap((m) => m.decisions.map((d) => ({ ...d, m })))
              .map((d) => (
                <li key={d.id} style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--dv-t-14)' }}>{d.texte}</div>
                    <div className="t-mini" style={{ marginTop: 2 }}>
                      {new Date(d.date).toLocaleDateString('fr-FR')} · {d.qui} · {client(d.m.clientId).nom.replace(' (exemple fictif)', '')}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
      </section>
      <section>
        <div className="t-sur" style={{ marginBottom: 10 }}>
          Capitalisation
        </div>
        <p className="t-petit" style={{ marginBottom: 10 }}>
          Patrons de la bibliothèque mobilisés sur les missions en cours. Chaque mission achevée compte comme une application.
        </p>
        <ul style={{ display: 'grid', gap: 8 }}>
          {[...patronsUtilises.entries()].slice(0, 5).map(([id, n]) => (
            <li key={id} className="dv-ligne espace" style={{ fontSize: 'var(--dv-t-14)' }}>
              <span>{patron(id)?.titre}</span>
              <Pastille ton="contour" point={false}>
                {n} mission{n > 1 ? 's' : ''}
              </Pastille>
            </li>
          ))}
        </ul>
      </section>
    </>
  );

  return (
    <Coque page="cockpit" panneau={panneau}>
      <header className="dv-entete">
        <div>
          <div className="fil">
            <span className="t-sur">Cockpit</span>
            <span className="t-sur" style={{ opacity: 0.5 }}>
              ·
            </span>
            <span className="t-sur">Semaine du 26 octobre 2026</span>
          </div>
          <h1 className="t-affiche">Deux missions en cours, cinq actions cette semaine.</h1>
          <div className="meta">
            <span>ARDAN entre en décision, la boulangerie en analyse.</span>
            <span>Prochaine restitution : ARDAN, à planifier.</span>
          </div>
        </div>
        <div className="dv-actions">
          <Link href="/direction/atelier" className="dv-btn">
            <Sparkles size={16} /> Reprendre l’atelier
          </Link>
          <span className="dv-btn primaire">
            <Plus size={16} /> Nouvelle mission
          </span>
        </div>
      </header>

      <section className="dv-section">
        <div className="dv-chiffres">
          <Chiffre libelle="Missions actives" valeur={missions.length} tendance="1 en décision · 1 en analyse" />
          <Chiffre libelle="Problèmes formalisés" valeur={missions.reduce((n, m) => n + m.problemes.length, 0)} tendance="4 bloquants ou coûteux sans preuve" ton="garance" />
          <Chiffre libelle="Recommandations retenues" valeur={retenues.length} tendance={`${quickWins.length} quick wins réalisables avec l’existant`} ton="sauge" />
          <Chiffre libelle="Actions à mener" valeur={actions.length} tendance="3 échéances cette semaine" />
        </div>
      </section>

        <section className="dv-section">
          <div className="tete">
            <div>
              <h2 className="t-section">Portefeuille</h2>
              <p>Une ligne par mission : où elle en est, ce qui vient, ce qui coince.</p>
            </div>
          </div>
          <table className="dv-table portefeuille defilant">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Mission</th>
                <th style={{ width: '20%' }}>Phases</th>
                <th>Prochaine action</th>
                <th className="num" style={{ width: 110 }}>Problèmes</th>
                <th style={{ width: 110 }} />
              </tr>
            </thead>
            <tbody>
              {missions.map((m) => {
                const c = client(m.clientId);
                const av = avancement(m);
                const prochaine = m.actions.find((a) => a.statut !== 'faite' && a.statut !== 'abandonnee');
                const phase = PHASES.find((p) => p.id === m.phase)!;
                return (
                  <tr key={m.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.nom.replace(' (exemple fictif)', '')}</div>
                      <div className="t-petit">{m.titre}</div>
                      <div className="dv-ligne" style={{ marginTop: 6 }}>
                        <Pastille ton="encre" point={false}>
                          {phase.label}
                        </Pastille>
                        <span className="t-mini">
                          {getPack(m.packId).label} · {LIBELLES_TAILLE[c.taille]}
                        </span>
                      </div>
                    </td>
                    <td>
                      <Stepper avancement={av} courante={m.phase} compact />
                      <div className="t-mini" style={{ marginTop: 6 }}>
                        {phase.label} : {av[m.phase]} %
                      </div>
                    </td>
                    <td>
                      {prochaine ? (
                        <>
                          <div style={{ fontSize: 'var(--dv-t-14)' }}>{prochaine.texte}</div>
                          <div className="t-mini">
                            {prochaine.responsable} · {new Date(prochaine.echeance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </div>
                        </>
                      ) : (
                        <span className="t-petit">Aucune action planifiée</span>
                      )}
                    </td>
                    <td className="num">
                      <span style={{ fontFamily: 'var(--dv-serif)', fontSize: 'var(--dv-t-20)' }}>{m.problemes.length}</span>
                      <div className="t-mini">{m.problemes.filter((p) => p.gravite === 3).length} bloquant(s)</div>
                    </td>
                    <td className="num">
                      <Link href={m.phase === 'analyser' ? '/direction/analyse' : '/direction/atelier'} className="dv-btn petit">
                        Ouvrir <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </section>

      <div className="dv-grille deux">
        <section className="dv-section">
          <div className="tete">
            <div>
              <h2 className="t-section">Trajectoires</h2>
              <p>Les mesures convenues, de la valeur relevée à la cible. Rien n’est estimé par l’outil.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 20 }}>
            {missions.map((m) => (
              <div key={m.id}>
                <div className="t-sur" style={{ marginBottom: 6 }}>
                  {client(m.clientId).nom.replace(' (exemple fictif)', '')}
                </div>
                {m.mesures.map((x) => (
                  <Trajectoire key={x.id} m={x} />
                ))}
              </div>
            ))}
          </div>
        </section>
        <section className="dv-section">
          <div className="tete">
            <div>
              <h2 className="t-section">Cette semaine</h2>
              <p>Les actions décidées avec les clients, par échéance.</p>
            </div>
          </div>
          <div className="dv-agenda">
            {[...new Set(actions.map((a) => a.echeance))].map((date) => {
              const d = new Date(date);
              const retard = d < AUJOURDHUI;
              return (
                <div key={date} className="jour">
                  <div className="date">
                    <b style={retard ? { color: 'var(--dv-garance)' } : undefined}>{d.getDate()}</b>
                    <span>
                      {JOURS[d.getDay()]} {MOIS[d.getMonth()]}
                    </span>
                  </div>
                  <div>
                    {actions
                      .filter((a) => a.echeance === date)
                      .map((a) => (
                        <div key={a.id} className="action">
                          {a.texte}
                          <div className="qui">
                            {a.responsable} · {client(a.mission.clientId).nom.replace(' (exemple fictif)', '')}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>

        </section>
      </div>
    </Coque>
  );
}
