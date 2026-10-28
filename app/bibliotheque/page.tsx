'use client';

import { useMemo, useState } from 'react';
import { bibliotheque, patronsPourProbleme } from '../../lib/bibliotheque';
import { Badge, Carte, Champ, Encart } from '../../components/ui';
import { LIBELLES_CATEGORIE, LIBELLES_EFFORT } from '../../lib/domain/types';

export default function Bibliotheque() {
  const [processusId, setProcessusId] = useState('');
  const [recherche, setRecherche] = useState('');
  const [selection, setSelection] = useState<string | null>(null);

  const problemes = useMemo(
    () =>
      bibliotheque.problemesUniversels.filter((u) => (!processusId || u.processusIds.includes(processusId)) && (!recherche || `${u.label} ${u.description} ${u.signaux.join(' ')}`.toLowerCase().includes(recherche.toLowerCase()))),
    [processusId, recherche],
  );
  const patrons = useMemo(() => (selection ? patronsPourProbleme(selection) : bibliotheque.patrons.filter((p) => !processusId || p.processusIds.includes(processusId))), [selection, processusId]);
  const u = selection ? bibliotheque.problemesUniversels.find((x) => x.id === selection) : undefined;

  return (
    <>
      <header className="entete-page">
        <div>
          <div className="sur-titre">Bibliothèque intermétiers</div>
          <h1>Problèmes universels et patrons de solution</h1>
          <p>
            Le même problème porte des noms différents selon les métiers. La bibliothèque les ramène à {bibliotheque.problemesUniversels.length} problèmes universels et{' '}
            {bibliotheque.patrons.length} patrons transférables, avec leurs limites. Version {bibliotheque.version}, contenu générique sans aucune donnée client.
          </p>
        </div>
      </header>

      <div className="grille analyse">
        <div>
          <Carte titre="Problèmes universels" sousTitre="Cliquer un problème pour voir les patrons qui y répondent.">
            <div className="grille deux" style={{ marginBottom: '0.75rem' }}>
              <Champ label="Famille de processus">
                <select value={processusId} onChange={(e) => setProcessusId(e.target.value)}>
                  <option value="">Toutes</option>
                  {bibliotheque.processus.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </Champ>
              <Champ label="Recherche">
                <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Ex. invendus, relecture, validation" />
              </Champ>
            </div>
            <ul className="liste">
              {problemes.map((p) => (
                <li key={p.id}>
                  <button type="button" className={`item${selection === p.id ? ' selectionne' : ''}`} style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => setSelection(selection === p.id ? null : p.id)} aria-pressed={selection === p.id}>
                    <strong>{p.label}</strong>
                    <div className="petit doux">{p.description}</div>
                    <div className="ligne mini" style={{ marginTop: '0.35rem' }}>
                      <Badge ton="contour">{patronsPourProbleme(p.id).length} patron(s)</Badge>
                      <span className="doux">Signaux : {p.signaux.slice(0, 4).join(', ')}…</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </Carte>
        </div>
        <div>
          {u && (
            <Encart>
              <strong>{u.label}</strong> — {u.coutTypique} <br />
              <span className="petit">Question de confirmation en atelier : {u.questionDeConfirmation}</span>
            </Encart>
          )}
          <Carte titre={selection ? `Patrons pour « ${u?.label} »` : 'Patrons de solution'} sousTitre="Chaque patron indique ses prérequis, ses risques, ses limites et son alternative sans IA.">
            {patrons.map((p) => (
              <article key={p.id} className="item" aria-label={p.titre}>
                <div className="ligne" style={{ marginBottom: '0.3rem' }}>
                  <Badge ton={p.categorie === 'prestataire' ? 'or' : p.categorie === 'automatisation' ? 'accent' : p.categorie === 'outil_existant' ? 'bleu' : 'sauge'}>{LIBELLES_CATEGORIE[p.categorie]}</Badge>
                  <Badge ton="contour">Effort {LIBELLES_EFFORT[p.effort].toLowerCase()}</Badge>
                  <Badge ton="contour">Coût {p.coutMensuel}</Badge>
                  {p.necessiteIA && <Badge ton="or">Dépend d’une IA</Badge>}
                  {p.statut === 'candidat' && <Badge ton="rouge">Candidat</Badge>}
                </div>
                <h3>{p.titre}</h3>
                <p className="petit">{p.detail}</p>
                {p.alternativeSansIA && (
                  <p className="petit">
                    <strong>Alternative sans IA :</strong> {p.alternativeSansIA}
                  </p>
                )}
                {p.limites.length > 0 && (
                  <p className="petit doux">
                    <strong>Limites :</strong> {p.limites.join(' ')}
                  </p>
                )}
                {p.exemples.length > 0 && (
                  <p className="petit doux">
                    <strong>Exemples :</strong> {p.exemples.map((e) => `${e.metier} : ${e.texte}`).join(' · ')}
                  </p>
                )}
                <div className="ligne mini doux">
                  Métiers : {p.metiers.join(', ') || '—'} · version {p.version}
                </div>
              </article>
            ))}
          </Carte>
        </div>
      </div>
    </>
  );
}
