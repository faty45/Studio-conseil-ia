'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowRight, Building2, LayoutList, Plus, Rows3, X } from 'lucide-react';
import { Coque } from '../../components/studio/Coque';
import { useStudio } from '../../components/studio/StudioContext';
import { Regle, Stepper, Tag, dateCourte, nomCourt } from '../../components/studio/Elements';
import { LIBELLES_TAILLE, PHASES, avancement, type Mission } from '../../lib/domain/types';
import { getPack } from '../../lib/packs';

const AUJOURDHUI = new Date('2026-10-29T09:00:00Z');

function Cockpit() {
  const router = useRouter();
  const { clients, missions, client } = useStudio();
  const [vue, setVue] = useState<'missions' | 'clients'>('missions');
  const [grouper, setGrouper] = useState(true);
  const [selection, setSelection] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const actions = useMemo(
    () =>
      missions
        .flatMap((m) => m.actions.filter((a) => a.statut !== 'faite' && a.statut !== 'abandonnee').map((a) => ({ ...a, mission: m })))
        .sort((a, b) => a.echeance.localeCompare(b.echeance)),
    [missions],
  );
  const retenues = missions.flatMap((m) => m.solutions.filter((s) => s.decision === 'retenue'));
  const sansPreuve = missions.flatMap((m) => m.problemes.filter((p) => p.gravite >= 2 && p.preuves.length === 0).map((p) => ({ p, m })));
  const nonMesurees = missions.flatMap((m) => m.mesures.filter((x) => x.avant === undefined).map((x) => ({ x, m })));
  const missionSel = missions.find((m) => m.id === selection);

  const groupes = grouper ? PHASES.map((p) => ({ p, liste: missions.filter((m) => m.phase === p.id) })).filter((g) => g.liste.length) : [{ p: null, liste: missions }];

  const simuler = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  const Ligne = ({ m }: { m: Mission }) => {
    const c = client(m.clientId)!;
    const av = avancement(m);
    const prochaine = m.actions.find((a) => a.statut !== 'faite' && a.statut !== 'abandonnee');
    const bloquants = m.problemes.filter((p) => p.gravite === 3).length;
    return (
      <tr className="hx-rangee" aria-selected={selection === m.id} onClick={() => setSelection(m.id)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSelection(m.id)}>
        <td>
          <div className="hx-titre-cellule">{m.titre}</div>
          <div className="hx-mini">
            {nomCourt(c.nom)} · {getPack(m.packId).label}
          </div>
        </td>
        <td>
          <Tag ton="accent" point>
            {PHASES.find((p) => p.id === m.phase)?.label}
          </Tag>
        </td>
        <td>
          <Stepper avancement={av} courante={m.phase} />
        </td>
        <td>
          {prochaine ? (
            <>
              <div>{prochaine.texte.length > 60 ? prochaine.texte.slice(0, 59) + '…' : prochaine.texte}</div>
              <div className="hx-mini">{prochaine.responsable}</div>
            </>
          ) : (
            <span className="hx-mini">—</span>
          )}
        </td>
        <td>{prochaine ? <Tag ton={new Date(prochaine.echeance) < AUJOURDHUI ? 'rouge' : ''}>{dateCourte(prochaine.echeance)}</Tag> : null}</td>
        <td className="num">
          {m.problemes.length}
          {bloquants > 0 && (
            <span className="hx-mini" style={{ color: 'var(--hx-rouge)' }}>
              {' '}
              · {bloquants} bloq.
            </span>
          )}
        </td>
        <td className="num">{m.solutions.filter((s) => s.decision === 'retenue').length}</td>
        <td className="hx-mini">{dateCourte(m.misAJourLe)}</td>
      </tr>
    );
  };

  return (
    <Coque
      fil={<strong>Cockpit</strong>}
      actions={
        <>
          <div className="hx-segments" role="group" aria-label="Vue">
            <button type="button" aria-pressed={vue === 'missions'} onClick={() => setVue('missions')}>
              Missions
            </button>
            <button type="button" aria-pressed={vue === 'clients'} onClick={() => setVue('clients')}>
              Clients
            </button>
          </div>
          {vue === 'missions' && (
            <button type="button" className="hx-btn hx-cache-mobile" aria-pressed={grouper} onClick={() => setGrouper((g) => !g)} title="Regrouper par phase">
              {grouper ? <Rows3 size={14} /> : <LayoutList size={14} />} Par phase
            </button>
          )}
          <button type="button" className="hx-btn primaire" onClick={() => simuler('Création de mission : simulée dans ce prototype (fonctionnelle dans l’application).')}>
            <Plus size={14} /> Nouvelle mission
          </button>
        </>
      }
    >
      <div className="hx-chiffres" style={{ marginBottom: 18 }}>
        <div>
          <div className="hx-sur">Missions actives</div>
          <div className="hx-chiffre">{missions.length}</div>
          <div className="hx-tendance">{PHASES.filter((p) => missions.some((m) => m.phase === p.id)).map((p) => p.label).join(' · ')}</div>
        </div>
        <div>
          <div className="hx-sur">Problèmes</div>
          <div className="hx-chiffre">{missions.reduce((n, m) => n + m.problemes.length, 0)}</div>
          <div className="hx-tendance" style={{ color: 'var(--hx-rouge)' }}>
            {sansPreuve.length} coûteux sans preuve
          </div>
        </div>
        <div>
          <div className="hx-sur">Recommandations retenues</div>
          <div className="hx-chiffre">{retenues.length}</div>
          <div className="hx-tendance" style={{ color: 'var(--hx-vert)' }}>
            {retenues.filter((s) => s.priorite === 'quick_win').length} quick wins avec l’existant
          </div>
        </div>
        <div>
          <div className="hx-sur">Actions à mener</div>
          <div className="hx-chiffre">{actions.length}</div>
          <div className="hx-tendance">{actions.filter((a) => new Date(a.echeance) < AUJOURDHUI).length} en retard</div>
        </div>
      </div>

      <div className="hx-grille cockpit">
        <section>
          {vue === 'missions' && (
            <div className="hx-bloc">
              <div className="hx-corps serre">
                <table className="hx-table defilant" aria-label="Missions">
                  <thead>
                    <tr>
                      <th>Mission</th>
                      <th>Phase</th>
                      <th>Avancement</th>
                      <th>Prochaine action</th>
                      <th>Échéance</th>
                      <th className="num">Problèmes</th>
                      <th className="num">Retenues</th>
                      <th>Mis à jour</th>
                    </tr>
                  </thead>
                  {groupes.map((g) => (
                    <tbody key={g.p?.id ?? 'toutes'}>
                      {g.p && (
                        <tr>
                          <td colSpan={8} style={{ padding: 0, border: 0 }}>
                            <div className="hx-groupe">
                              <span className="hx-point" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--hx-accent)', display: 'inline-block' }} />
                              {g.p.label} <span className="hx-compte">{g.liste.length}</span>
                              <span className="hx-mini" style={{ fontWeight: 400 }}>
                                · {g.p.description}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                      {g.liste.map((m) => (
                        <Ligne key={m.id} m={m} />
                      ))}
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
          )}

          {vue === 'clients' && (
            <div className="hx-bloc">
              <div className="hx-corps serre">
                <table className="hx-table defilant" aria-label="Clients">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Secteur</th>
                      <th>Taille</th>
                      <th>Missions</th>
                      <th className="num">Problèmes</th>
                      <th>Outils sous-exploités</th>
                      <th>Dernière activité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c) => {
                      const ms = missions.filter((m) => m.clientId === c.id);
                      return (
                        <tr key={c.id} className="hx-rangee" onClick={() => router.push(`/studio/client/${c.id}`)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && router.push(`/studio/client/${c.id}`)}>
                          <td>
                            <div className="hx-ligne" style={{ gap: 8, flexWrap: 'nowrap' }}>
                              <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--hx-surface-3)', display: 'grid', placeItems: 'center' }}>
                                <Building2 size={13} />
                              </span>
                              <span className="hx-titre-cellule">{nomCourt(c.nom)}</span>
                              {c.fictif && <Tag ton="ambre">Fictif</Tag>}
                            </div>
                          </td>
                          <td className="hx-doux">{c.secteur}</td>
                          <td>
                            <Tag>{LIBELLES_TAILLE[c.taille]}</Tag>
                          </td>
                          <td>
                            <div className="hx-ligne" style={{ gap: 4 }}>
                              {ms.map((m) => (
                                <Tag key={m.id} ton="accent" point>
                                  {PHASES.find((p) => p.id === m.phase)?.label}
                                </Tag>
                              ))}
                            </div>
                          </td>
                          <td className="num">{ms.reduce((n, m) => n + m.problemes.length, 0)}</td>
                          <td>
                            <div className="hx-ligne" style={{ gap: 4 }}>
                              {c.outils
                                .filter((o) => o.sousExploite)
                                .map((o) => (
                                  <Tag key={o.id} ton="cuivre">
                                    {o.nom.length > 26 ? o.nom.slice(0, 25) + '…' : o.nom}
                                  </Tag>
                                ))}
                            </div>
                          </td>
                          <td className="hx-mini">{dateCourte(ms.map((m) => m.misAJourLe).sort().at(-1))}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <aside style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
          <div className="hx-bloc">
            <div className="hx-tete">
              <span className="hx-h3">Cette semaine</span>
              <span className="hx-mini">{actions.length} actions</span>
            </div>
            <div className="hx-corps serre">
              <div className="hx-liste">
                {actions.slice(0, 8).map((a) => (
                  <div key={a.id} className="hx-rang" onClick={() => setSelection(a.mission.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSelection(a.mission.id)}>
                    <Tag ton={new Date(a.echeance) < AUJOURDHUI ? 'rouge' : ''}>{dateCourte(a.echeance)}</Tag>
                    <span className="hx-titre" title={a.texte}>
                      {a.texte}
                    </span>
                    <span className="hx-meta">{a.responsable.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hx-bloc">
            <div className="hx-tete">
              <span className="hx-h3">Signaux</span>
              <Regle>Relus par règles</Regle>
            </div>
            <div className="hx-corps" style={{ display: 'grid', gap: 8 }}>
              {sansPreuve.map(({ p, m }) => (
                <div key={p.id} className="hx-alerte rouge">
                  <span aria-hidden>●</span>
                  <div>
                    <strong>Problème coûteux sans preuve</strong>
                    <div className="hx-mini">
                      « {p.texte} » — {nomCourt(client(m.clientId)!.nom)}
                    </div>
                  </div>
                </div>
              ))}
              {nonMesurees.map(({ x, m }) => (
                <div key={x.id} className="hx-alerte ambre">
                  <span aria-hidden>●</span>
                  <div>
                    <strong>Mesure sans valeur « avant »</strong>
                    <div className="hx-mini">
                      {x.indicateur} — {nomCourt(client(m.clientId)!.nom)}
                    </div>
                  </div>
                </div>
              ))}
              <div className="hx-alerte">
                <span aria-hidden>●</span>
                <div>
                  <strong>Restitution ARDAN à planifier</strong>
                  <div className="hx-mini">Six recommandations retenues, synthèse non validée.</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {missionSel && (
        <aside className="hx-volet" aria-label={`Mission ${missionSel.titre}`}>
          <div className="hx-volet-tete">
            <Tag ton="accent" point>
              {PHASES.find((p) => p.id === missionSel.phase)?.label}
            </Tag>
            <strong style={{ flex: 1, fontSize: 13 }}>{missionSel.titre}</strong>
            <button type="button" className="hx-btn fantome icone" aria-label="Fermer" onClick={() => setSelection(null)}>
              <X size={16} />
            </button>
          </div>
          <div className="hx-volet-corps">
            <div className="hx-props">
              <div className="hx-prop">
                <span>Client</span>
                <span className="hx-valeur">
                  <Link href={`/studio/client/${missionSel.clientId}`} style={{ color: 'var(--hx-accent-2)' }}>
                    {nomCourt(client(missionSel.clientId)!.nom)}
                  </Link>
                </span>
              </div>
              <div className="hx-prop">
                <span>Objectif</span>
                <span className="hx-valeur">{missionSel.objectif}</span>
              </div>
              <div className="hx-prop">
                <span>Trame</span>
                <span className="hx-valeur">
                  {getPack(missionSel.packId).label} · {missionSel.trame.length} questions
                </span>
              </div>
              <div className="hx-prop">
                <span>Atelier</span>
                <span className="hx-valeur">{missionSel.dateAtelier ? new Date(missionSel.dateAtelier).toLocaleDateString('fr-FR') : 'à planifier'}</span>
              </div>
              <div className="hx-prop">
                <span>Avancement</span>
                <span className="hx-valeur">
                  <Stepper avancement={avancement(missionSel)} courante={missionSel.phase} />
                </span>
              </div>
              <div className="hx-prop">
                <span>Problèmes</span>
                <span className="hx-valeur">
                  {missionSel.problemes.length} formalisés · {missionSel.problemes.filter((p) => p.gravite === 3).length} bloquants
                </span>
              </div>
              <div className="hx-prop">
                <span>Solutions</span>
                <span className="hx-valeur">
                  {missionSel.solutions.filter((s) => s.decision === 'retenue').length} retenues sur {missionSel.solutions.length}
                </span>
              </div>
              <div className="hx-prop">
                <span>Hypothèses</span>
                <span className="hx-valeur">
                  {missionSel.hypotheses.map((h) => (
                    <Tag key={h.id} ton={h.statut === 'confirmee' ? 'vert' : h.statut === 'infirmee' ? 'rouge' : 'contour'}>
                      {h.texte.length > 38 ? h.texte.slice(0, 37) + '…' : h.texte}
                    </Tag>
                  ))}
                </span>
              </div>
            </div>
            <div className="hx-sur" style={{ margin: '16px 0 8px' }}>
              Décisions
            </div>
            <div className="hx-fil-activite">
              {missionSel.decisions.map((d) => (
                <div key={d.id} className="hx-evt decision">
                  <div className="hx-quand">
                    {new Date(d.date).toLocaleDateString('fr-FR')} · {d.qui}
                  </div>
                  {d.texte}
                </div>
              ))}
            </div>
          </div>
          <div className="hx-volet-pied">
            <Link href={missionSel.phase === 'analyser' ? '/studio/analyse' : '/studio/atelier'} className="hx-btn primaire">
              Ouvrir {missionSel.phase === 'analyser' ? 'l’analyse' : 'l’atelier'} <ArrowRight size={14} />
            </Link>
            <Link href={`/studio/client/${missionSel.clientId}`} className="hx-btn">
              Fiche client
            </Link>
          </div>
        </aside>
      )}

      {toast && (
        <div className="hx-toast" role="status">
          {toast}
        </div>
      )}
    </Coque>
  );
}

export default function Page() {
  return <Cockpit />;
}
