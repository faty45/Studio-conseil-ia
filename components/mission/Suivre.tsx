'use client';

import { useMemo, useState } from 'react';
import { Archive, Download, Plus, Trash2 } from 'lucide-react';
import type { PropsPhase } from './MissionShell';
import { Badge, Carte, Champ, Encart, Metrique, dateCourte, slug, telecharger } from '../ui';
import { LIBELLES_CATEGORIE, LIBELLES_STATUT_ACTION, genId, type Mesure, type StatutAction } from '../../lib/domain/types';
import { patron } from '../../lib/bibliotheque';

function Barre({ libelle, valeur, max, couleur }: { libelle: string; valeur?: number; max: number; couleur: string }) {
  const pct = valeur === undefined || max === 0 ? 0 : Math.min(100, Math.round((valeur / max) * 100));
  return (
    <div className="ligne-barre">
      <span className="doux">{libelle}</span>
      <div className="fond" role="img" aria-label={`${libelle} : ${valeur ?? 'non renseigné'}`}>
        <span style={{ width: `${pct}%`, background: couleur }} />
      </div>
      <strong>{valeur ?? '—'}</strong>
    </div>
  );
}

export function Suivre({ mission, client, pack, maj }: PropsPhase) {
  const [decision, setDecision] = useState({ texte: '', qui: '' });
  const [capital, setCapital] = useState<{ solutionId: string; titre: string; resume: string; limites: string; checks: boolean[] } | null>(null);

  const faites = mission.actions.filter((a) => a.statut === 'faite').length;
  const mesurees = mission.mesures.filter((m) => m.a30 !== undefined || m.a90 !== undefined).length;
  const retenues = mission.solutions.filter((s) => s.decision === 'retenue');
  const majMesure = (id: string, fn: (x: Mesure) => Mesure) => maj((m) => ({ ...m, mesures: m.mesures.map((x) => (x.id === id ? fn(x) : x)) }));
  const prochaine = mission.actions.find((a) => a.statut !== 'faite' && a.statut !== 'abandonnee');

  const CHECKS = ['Aucun nom de personne ni d’entreprise', 'Aucun chiffre propre au client', 'Aucun document ou extrait client', 'Formulation transférable à un autre métier'];
  const patronCandidat = useMemo(() => {
    if (!capital) return null;
    const s = mission.solutions.find((x) => x.id === capital.solutionId);
    if (!s) return null;
    return {
      id: slug(capital.titre),
      titre: capital.titre,
      categorie: s.categorie,
      resume: capital.resume,
      detail: capital.resume,
      problemesUniversels: [...new Set(mission.problemes.filter((p) => s.problemeIds.includes(p.id) && p.universelId).map((p) => p.universelId!))],
      processusIds: pack.processusIds,
      outilsRequis: [] as string[],
      alternativeSansIA: s.alternativeSansIA,
      necessiteIA: s.necessiteIA,
      effort: s.faisabilite.effort,
      coutMensuel: s.faisabilite.coutMensuel,
      prerequis: s.faisabilite.prerequis,
      risques: s.faisabilite.risques,
      limites: capital.limites ? [capital.limites] : [],
      adaptations: {},
      exemples: [{ metier: pack.id, texte: capital.resume }],
      metiers: [pack.id],
      statut: 'candidat' as const,
      version: '0.1.0',
    };
  }, [capital, mission, pack]);

  return (
    <>
      <div className="grille trois" style={{ marginBottom: '1rem' }}>
        <Metrique valeur={`${faites}/${mission.actions.length}`} libelle="Actions faites" ton="sauge" />
        <Metrique valeur={`${mesurees}/${mission.mesures.length}`} libelle="Indicateurs relevés après" ton="accent" />
        <Metrique valeur={mission.decisions.length} libelle="Décisions tracées" />
      </div>

      <Encart ton={mission.syntheseValideeLe ? 'ok' : 'info'}>
        {mission.syntheseValideeLe ? `Synthèse validée le ${dateCourte(mission.syntheseValideeLe)}. ` : 'Synthèse non encore validée avec le client. '}
        {prochaine ? `Prochaine action : ${prochaine.texte}${prochaine.responsable ? ` (${prochaine.responsable}${prochaine.echeance ? `, ${dateCourte(prochaine.echeance)}` : ''})` : ''}.` : 'Toutes les actions sont closes.'}
      </Encart>

      <div className="grille deux">
        <Carte titre="Résultats avant / après" sousTitre="À J+30 et J+90, on relève la même mesure, à la même source. L’écart se constate, il ne s’estime pas.">
          {mission.mesures.length === 0 && <p className="doux petit">Aucun indicateur défini en phase Décider.</p>}
          {mission.mesures.map((x) => {
            const max = Math.max(1, ...[x.avant, x.cible, x.a30, x.a90].filter((v): v is number => v !== undefined));
            return (
              <div key={x.id} className="item" style={{ marginBottom: '0.6rem' }}>
                <div className="ligne espace">
                  <strong>
                    {x.indicateur} <span className="doux petit">({x.unite})</span>
                  </strong>
                  <span className="petit doux">Source : {x.source || '—'}</span>
                </div>
                <div className="barres" style={{ marginTop: '0.5rem' }}>
                  <Barre libelle="Avant" valeur={x.avant} max={max} couleur="var(--encre-3)" />
                  <Barre libelle="Cible" valeur={x.cible} max={max} couleur="var(--bleu)" />
                  <Barre libelle="J+30" valeur={x.a30} max={max} couleur="var(--sauge)" />
                  <Barre libelle="J+90" valeur={x.a90} max={max} couleur="var(--accent)" />
                </div>
                <div className="ligne petit" style={{ marginTop: '0.5rem' }}>
                  <label className="ligne" style={{ gap: '0.3rem' }}>
                    Relevé J+30 <input type="number" aria-label={`Relevé J+30 pour ${x.indicateur}`} value={x.a30 ?? ''} onChange={(e) => majMesure(x.id, (y) => ({ ...y, a30: e.target.value === '' ? undefined : Number(e.target.value) }))} style={{ width: 90, minHeight: 32 }} />
                  </label>
                  <label className="ligne" style={{ gap: '0.3rem' }}>
                    Relevé J+90 <input type="number" aria-label={`Relevé J+90 pour ${x.indicateur}`} value={x.a90 ?? ''} onChange={(e) => majMesure(x.id, (y) => ({ ...y, a90: e.target.value === '' ? undefined : Number(e.target.value) }))} style={{ width: 90, minHeight: 32 }} />
                  </label>
                  {x.avant !== undefined && x.cible !== undefined && (x.a30 ?? x.a90) !== undefined && (
                    <Badge ton={Math.abs((x.a90 ?? x.a30!) - x.cible) <= Math.abs(x.avant - x.cible) * 0.25 ? 'sauge' : 'or'}>{Math.abs((x.a90 ?? x.a30!) - x.cible) <= Math.abs(x.avant - x.cible) * 0.25 ? 'Cible atteinte ou proche' : 'En progrès, cible non atteinte'}</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </Carte>

        <div>
          <Carte titre="État des actions" sousTitre="Mise à jour à chaque point de suivi.">
            {mission.actions.length === 0 && <p className="doux petit">Aucune action planifiée.</p>}
            <ul className="liste">
              {mission.actions.map((a) => (
                <li key={a.id} className="item ligne espace">
                  <span className="petit">
                    <strong>{a.texte}</strong>
                    <br />
                    <span className="doux">
                      {a.responsable || 'Responsable à définir'} · {a.echeance ? dateCourte(a.echeance) : 'sans échéance'}
                    </span>
                  </span>
                  <select aria-label={`Statut de ${a.texte}`} value={a.statut} onChange={(e) => maj((m) => ({ ...m, actions: m.actions.map((x) => (x.id === a.id ? { ...x, statut: e.target.value as StatutAction } : x)) }))} style={{ width: 'auto', minHeight: 36 }}>
                    {Object.entries(LIBELLES_STATUT_ACTION).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </Carte>

          <Carte titre="Décisions" sousTitre="Ce qui a été décidé depuis la restitution.">
            <ul className="liste">
              {[...mission.decisions].reverse().map((d) => (
                <li key={d.id} className="item ligne espace">
                  <span className="petit">
                    <span className="doux">{dateCourte(d.date)}</span> · {d.texte} <span className="doux">— {d.qui}</span>
                  </span>
                  <button type="button" className="bouton petit discret" aria-label="Supprimer la décision" onClick={() => maj((m) => ({ ...m, decisions: m.decisions.filter((x) => x.id !== d.id) }))}>
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
            <form
              className="ligne"
              onSubmit={(e) => {
                e.preventDefault();
                if (!decision.texte.trim()) return;
                maj((m) => ({ ...m, decisions: [...m.decisions, { id: genId(), date: new Date().toISOString(), texte: decision.texte.trim(), qui: decision.qui.trim() || 'Point de suivi' }] }));
                setDecision({ texte: '', qui: '' });
              }}
              style={{ marginTop: '0.5rem' }}
            >
              <input value={decision.texte} onChange={(e) => setDecision({ ...decision, texte: e.target.value })} placeholder="Décision prise au point de suivi…" aria-label="Décision" />
              <input value={decision.qui} onChange={(e) => setDecision({ ...decision, qui: e.target.value })} placeholder="Par qui" aria-label="Qui a décidé" style={{ maxWidth: 160 }} />
              <button type="submit" className="bouton petit" disabled={!decision.texte.trim()}>
                <Plus size={14} />
              </button>
            </form>
          </Carte>
        </div>
      </div>

      <Carte
        titre={
          <span className="ligne">
            <Archive size={18} /> Capitalisation intermétiers
          </span>
        }
        nom="Capitalisation intermétiers"
        sousTitre="Ce qui a marché devient un patron candidat, anonymisé, versionné. Il n’entre dans la bibliothèque qu’après une seconde mission qui le confirme."
      >
        {retenues.length === 0 && <p className="doux petit">Aucune recommandation retenue à capitaliser.</p>}
        <ul className="liste">
          {retenues.map((s) => {
            const p = s.patronId ? patron(s.patronId) : undefined;
            const action = mission.actions.find((a) => a.solutionId === s.id);
            return (
              <li key={s.id} className="item ligne espace">
                <span className="petit">
                  <strong>{s.titre}</strong> <Badge ton="contour">{LIBELLES_CATEGORIE[s.categorie]}</Badge>
                  <br />
                  <span className="doux">{p ? `Patron existant « ${p.id} » v${p.version} : cette mission compte comme application dans le métier « ${pack.id} ».` : 'Solution ajoutée à la main : peut devenir un patron candidat.'}</span>
                  {action && <span className="doux"> · Action : {LIBELLES_STATUT_ACTION[action.statut].toLowerCase()}</span>}
                </span>
                {!p && (
                  <button type="button" className="bouton petit" onClick={() => setCapital({ solutionId: s.id, titre: s.titre, resume: s.detail, limites: '', checks: [false, false, false, false] })}>
                    <Plus size={14} /> Proposer comme patron
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {capital && patronCandidat && (
          <div className="item" style={{ marginTop: '0.75rem' }}>
            <h3 style={{ marginTop: 0 }}>Patron candidat</h3>
            <Champ label="Titre générique (sans référence au client)">
              <input value={capital.titre} onChange={(e) => setCapital({ ...capital, titre: e.target.value })} />
            </Champ>
            <Champ label="Résumé transférable">
              <textarea rows={3} value={capital.resume} onChange={(e) => setCapital({ ...capital, resume: e.target.value })} />
            </Champ>
            <Champ label="Limites observées">
              <input value={capital.limites} onChange={(e) => setCapital({ ...capital, limites: e.target.value })} placeholder="Dans quelles conditions cela ne marche pas" />
            </Champ>
            <div className="champ">
              <span>Contrôle de confidentialité</span>
              {CHECKS.map((c, i) => (
                <label key={c} className="ligne petit" style={{ gap: '0.4rem' }}>
                  <input type="checkbox" checked={capital.checks[i]} onChange={(e) => setCapital({ ...capital, checks: capital.checks.map((v, j) => (j === i ? e.target.checked : v)) })} /> {c}
                </label>
              ))}
            </div>
            <div className="petit doux">Problèmes universels rattachés : {patronCandidat.problemesUniversels.join(', ') || 'aucun (à rattacher en analyse)'} · processus : {patronCandidat.processusIds.join(', ')}</div>
            <div className="actions droite" style={{ marginTop: '0.5rem' }}>
              <button type="button" className="bouton petit" onClick={() => setCapital(null)}>
                Annuler
              </button>
              <button type="button" className="bouton petit primaire" disabled={!capital.checks.every(Boolean) || !capital.titre.trim()} onClick={() => telecharger(`patron-candidat-${patronCandidat.id}.json`, JSON.stringify(patronCandidat, null, 2), 'application/json')}>
                <Download size={14} /> Exporter le patron candidat (.json)
              </button>
            </div>
            <p className="petit doux" style={{ margin: '0.5rem 0 0' }}>
              Le fichier respecte le schéma de la bibliothèque. Il est relu puis ajouté à la bibliothèque par une mise à jour versionnée, jamais automatiquement. {client.fictif ? 'Mission fictive : export à titre de démonstration.' : ''}
            </p>
          </div>
        )}
      </Carte>
    </>
  );
}
