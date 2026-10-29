'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowRight, Building2, FileText, Plus } from 'lucide-react';
import { Coque } from '../../../../components/studio/Coque';
import { useStudio } from '../../../../components/studio/StudioContext';
import { Niveaux, Regle, Stepper, TON_DECISION, TON_PRIORITE, Tag, dateCourte, nomCourt } from '../../../../components/studio/Elements';
import { LIBELLES_CATEGORIE_OUTIL, LIBELLES_DECISION, LIBELLES_PRIORITE, LIBELLES_TAILLE, PHASES, avancement, type TailleClient } from '../../../../lib/domain/types';
import { getPack } from '../../../../lib/packs';
import { problemeUniversel } from '../../../../lib/bibliotheque';

const ONGLETS = ['Aperçu', 'Missions', 'Problèmes', 'Solutions', 'Décisions', 'Documents'] as const;

function Fiche() {
  const params = useParams<{ id: string }>();
  const { client, missions, majClient } = useStudio();
  const c = client(params.id);
  const [onglet, setOnglet] = useState<(typeof ONGLETS)[number]>('Aperçu');
  const ms = useMemo(() => missions.filter((m) => m.clientId === params.id), [missions, params.id]);
  const problemes = ms.flatMap((m) => m.problemes.map((p) => ({ ...p, mission: m })));
  const solutions = ms.flatMap((m) => m.solutions.map((s) => ({ ...s, mission: m })));
  const decisions = ms.flatMap((m) => m.decisions.map((d) => ({ ...d, mission: m })));
  const activite = useMemo(
    () =>
      [
        ...ms.flatMap((m) => m.journal.map((e) => ({ id: e.id, quand: e.horodatage, type: e.auteur === 'client' ? 'client' : e.auteur === 'copilote' ? 'copilote' : 'moi', texte: e.type === 'citation' ? `« ${e.texte} »` : e.texte, mission: m }))),
        ...ms.flatMap((m) => m.decisions.map((d) => ({ id: d.id, quand: d.date + 'T18:00:00Z', type: 'decision', texte: `Décision : ${d.texte} (${d.qui})`, mission: m }))),
        ...ms.flatMap((m) => m.actions.map((a) => ({ id: a.id, quand: a.echeance + 'T08:00:00Z', type: 'action', texte: `Action prévue : ${a.texte} — ${a.responsable}`, mission: m }))),
      ].sort((a, b) => b.quand.localeCompare(a.quand)),
    [ms],
  );

  if (!c) {
    return (
      <Coque fil={<strong>Client introuvable</strong>}>
        <div className="hx-vide">
          <strong>Ce client n’existe pas dans l’espace.</strong>
          <Link href="/studio" className="hx-btn" style={{ marginTop: 10 }}>
            Retour au cockpit
          </Link>
        </div>
      </Coque>
    );
  }

  const compte = { Aperçu: activite.length, Missions: ms.length, Problèmes: problemes.length, Solutions: solutions.length, Décisions: decisions.length, Documents: c.documents.length } as const;

  return (
    <Coque
      fil={
        <>
          <Link href="/studio">Cockpit</Link>
          <span className="sep">/</span>
          <Link href="/studio" onClick={(e) => e.preventDefault()} className="hx-doux">
            Clients
          </Link>
          <span className="sep">/</span>
          <strong>{nomCourt(c.nom)}</strong>
        </>
      }
      actions={
        <>
          <Link href={ms[0]?.phase === 'analyser' ? '/studio/analyse' : '/studio/atelier'} className="hx-btn primaire">
            Ouvrir la mission <ArrowRight size={14} />
          </Link>
        </>
      }
    >
      <header className="hx-ligne" style={{ gap: 14, marginBottom: 18 }}>
        <span style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--hx-surface)', border: '1px solid var(--hx-bord)', display: 'grid', placeItems: 'center' }}>
          <Building2 size={20} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="hx-h1">{nomCourt(c.nom)}</h1>
          <div className="hx-ligne" style={{ marginTop: 4 }}>
            <Tag>{c.secteur}</Tag>
            <Tag>{LIBELLES_TAILLE[c.taille]}</Tag>
            {c.fictif && <Tag ton="ambre">Données fictives</Tag>}
            <span className="hx-mini">
              {ms.length} mission{ms.length > 1 ? 's' : ''} · {problemes.length} problèmes · {solutions.filter((s) => s.decision === 'retenue').length} recommandations retenues
            </span>
          </div>
        </div>
      </header>

      <div className="hx-grille fiche">
        <aside className="hx-bloc" style={{ alignSelf: 'start' }}>
          <div className="hx-tete">
            <span className="hx-h3">Propriétés</span>
            <span className="hx-mini">modifiables</span>
          </div>
          <div className="hx-corps serre">
            <div className="hx-props">
              <div className="hx-prop">
                <span>Secteur</span>
                <input aria-label="Secteur" value={c.secteur} onChange={(e) => majClient(c.id, (x) => ({ ...x, secteur: e.target.value }))} />
              </div>
              <div className="hx-prop">
                <span>Taille</span>
                <select aria-label="Taille" value={c.taille} onChange={(e) => majClient(c.id, (x) => ({ ...x, taille: e.target.value as TailleClient }))}>
                  {Object.entries(LIBELLES_TAILLE).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="hx-prop">
                <span>Contexte</span>
                <textarea aria-label="Contexte" rows={5} value={c.contexte} onChange={(e) => majClient(c.id, (x) => ({ ...x, contexte: e.target.value }))} />
              </div>
              <div className="hx-prop">
                <span>Enjeux</span>
                <span className="hx-valeur">
                  {c.enjeux.map((e, i) => (
                    <Tag key={i} ton="accent">
                      {e}
                    </Tag>
                  ))}
                </span>
              </div>
              <div className="hx-prop">
                <span>Parties prenantes</span>
                <span className="hx-valeur" style={{ display: 'grid', gap: 4 }}>
                  {c.partiesPrenantes.map((p) => (
                    <span key={p.id} style={{ fontSize: 12.5 }}>
                      <strong style={{ fontWeight: 500 }}>{p.role}</strong> <span className="hx-mini">· influence {p.influence}</span>
                      <div className="hx-mini">{p.attentes}</div>
                    </span>
                  ))}
                </span>
              </div>
              <div className="hx-prop">
                <span>Outils</span>
                <span className="hx-valeur" style={{ display: 'grid', gap: 4 }}>
                  {c.outils.map((o) => (
                    <label key={o.id} className="hx-ligne" style={{ gap: 6, fontSize: 12.5, flexWrap: 'nowrap' }}>
                      <input type="checkbox" checked={!!o.sousExploite} onChange={(e) => majClient(c.id, (x) => ({ ...x, outils: x.outils.map((y) => (y.id === o.id ? { ...y, sousExploite: e.target.checked } : y)) }))} aria-label={`${o.nom} sous-exploité`} />
                      <span style={{ minWidth: 0 }}>
                        {o.nom} <span className="hx-mini">· {LIBELLES_CATEGORIE_OUTIL[o.categorie]}</span>
                        {o.sousExploite && (
                          <>
                            {' '}
                            <Tag ton="cuivre">sous-exploité</Tag>
                          </>
                        )}
                      </span>
                    </label>
                  ))}
                </span>
              </div>
              <div className="hx-prop">
                <span>Créé le</span>
                <span className="hx-valeur hx-doux">{new Date(c.creeLe).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="hx-bloc">
          <div className="hx-onglets" role="tablist" aria-label="Sections de la fiche">
            {ONGLETS.map((o) => (
              <button key={o} type="button" role="tab" aria-selected={onglet === o} onClick={() => setOnglet(o)}>
                {o} <span className="hx-compte">{compte[o]}</span>
              </button>
            ))}
          </div>
          <div className="hx-corps">
            {onglet === 'Aperçu' && (
              <>
                <div className="hx-ligne espace" style={{ marginBottom: 12 }}>
                  <span className="hx-h3">Fil d’activité</span>
                  <span className="hx-mini">Conversation d’atelier, décisions, actions prévues</span>
                </div>
                <div className="hx-fil-activite">
                  {activite.slice(0, 14).map((e) => (
                    <div key={e.id} className={`hx-evt ${e.type}`}>
                      <div className="hx-quand">
                        {new Date(e.quand).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' })} · {e.mission.titre}
                      </div>
                      {e.texte}
                    </div>
                  ))}
                </div>
              </>
            )}
            {onglet === 'Missions' && (
              <table className="hx-table defilant">
                <thead>
                  <tr>
                    <th>Mission</th>
                    <th>Phase</th>
                    <th>Avancement</th>
                    <th>Objectif</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {ms.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div className="hx-titre-cellule">{m.titre}</div>
                        <div className="hx-mini">{getPack(m.packId).label}</div>
                      </td>
                      <td>
                        <Tag ton="accent" point>
                          {PHASES.find((p) => p.id === m.phase)?.label}
                        </Tag>
                      </td>
                      <td>
                        <Stepper avancement={avancement(m)} courante={m.phase} />
                      </td>
                      <td className="hx-doux">{m.objectif}</td>
                      <td>
                        <Link href={m.phase === 'analyser' ? '/studio/analyse' : '/studio/atelier'} className="hx-btn">
                          Ouvrir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {onglet === 'Problèmes' && (
              <table className="hx-table defilant">
                <thead>
                  <tr>
                    <th>Problème</th>
                    <th>Gravité</th>
                    <th>Fréquence</th>
                    <th>Universel</th>
                    <th className="num">Preuves</th>
                    <th className="num">Solutions</th>
                  </tr>
                </thead>
                <tbody>
                  {problemes.map((p) => (
                    <tr key={p.id}>
                      <td className="hx-titre-cellule">{p.texte}</td>
                      <td>
                        <Niveaux valeur={p.gravite} ton="rouge" label="Gravité" />
                      </td>
                      <td>
                        <Niveaux valeur={p.frequence} label="Fréquence" />
                      </td>
                      <td>{p.universelId && <Tag ton="cuivre">{problemeUniversel(p.universelId)?.label}</Tag>}</td>
                      <td className="num">{p.preuves.length}</td>
                      <td className="num">{p.mission.solutions.filter((s) => s.problemeIds.includes(p.id)).length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {onglet === 'Solutions' && (
              <table className="hx-table defilant">
                <thead>
                  <tr>
                    <th>Solution</th>
                    <th>Priorité</th>
                    <th>Décision</th>
                    <th>Responsable</th>
                    <th>Échéance</th>
                  </tr>
                </thead>
                <tbody>
                  {solutions.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div className="hx-titre-cellule">{s.titre}</div>
                        {s.origine === 'bibliotheque' || s.origine === 'demo' ? <Regle>Rapprochée par règles</Regle> : <span className="hx-mini">Ajoutée à la main</span>}
                      </td>
                      <td>
                        <Tag ton={TON_PRIORITE[s.priorite]}>{LIBELLES_PRIORITE[s.priorite]}</Tag>
                      </td>
                      <td>
                        <Tag ton={TON_DECISION[s.decision]}>{LIBELLES_DECISION[s.decision]}</Tag>
                      </td>
                      <td className="hx-doux">{s.responsable ?? '—'}</td>
                      <td className="hx-doux">{s.echeance ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {onglet === 'Décisions' && (
              <div className="hx-fil-activite">
                {decisions.map((d) => (
                  <div key={d.id} className="hx-evt decision">
                    <div className="hx-quand">
                      {new Date(d.date).toLocaleDateString('fr-FR')} · {d.qui} · {d.mission.titre}
                    </div>
                    {d.texte}
                  </div>
                ))}
              </div>
            )}
            {onglet === 'Documents' && (
              <>
                <div className="hx-liste">
                  {c.documents.map((d) => (
                    <div key={d.id} className="hx-rang">
                      <FileText size={15} />
                      <span>
                        <span className="hx-titre">{d.titre}</span>
                        <div className="hx-mini">{d.note}</div>
                      </span>
                      <Tag>{d.type}</Tag>
                    </div>
                  ))}
                </div>
                <div className="hx-vide" style={{ marginTop: 10 }}>
                  <strong>Dépôt de fichiers : simulé</strong>
                  Le stockage de documents demande un serveur et une isolation par client (prérequis Supabase).
                  <div>
                    <button type="button" className="hx-btn" style={{ marginTop: 8 }} disabled>
                      <Plus size={14} /> Ajouter un document
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      <p className="hx-mini" style={{ marginTop: 12 }}>
        Dernière mise à jour : {dateCourte(ms.map((m) => m.misAJourLe).sort().at(-1))}
      </p>
    </Coque>
  );
}

export default function Page() {
  return <Fiche />;
}
