'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Pack } from '../lib/packs/schema';
import { questionsPour } from '../lib/packs';
import { genId, type Mission } from '../lib/domain/types';
import { genererGuideAction, genererSynthese } from '../lib/domain/synthese';
import { useMissions } from './MissionContext';

type Props = { mission: Mission; pack: Pack; maj: (fn: (m: Mission) => Mission) => void };

function telecharger(nom: string, contenu: string) {
  const blob = new Blob([contenu], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nom;
  a.click();
  URL.revokeObjectURL(url);
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'mission';
}

export function Suivre({ mission, pack, maj }: Props) {
  const router = useRouter();
  const { supprimer } = useMissions();
  const [action, setAction] = useState({ texte: '', responsable: '', echeance: '' });
  const [apercu, setApercu] = useState<'aucun' | 'synthese' | 'guide'>('aucun');
  const [relu, setRelu] = useState(false);
  const questions = useMemo(() => questionsPour(pack), [pack]);
  const synthese = useMemo(() => genererSynthese(mission, pack, questions), [mission, pack, questions]);
  const guide = useMemo(() => genererGuideAction(mission), [mission]);

  const ajouterAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!action.texte.trim()) return;
    maj((m) => ({ ...m, actions: [...m.actions, { id: genId(), ...action, texte: action.texte.trim() }] }));
    setAction({ texte: '', responsable: '', echeance: '' });
  };

  return (
    <div className="grille-2">
      <section className="panneau" aria-labelledby="titre-actions">
        <h2 id="titre-actions">Les prochaines actions</h2>
        <p className="aide">Trois actions valent mieux que dix. Un rôle responsable, une date.</p>
        <ol style={{ paddingLeft: '1.2rem' }} aria-label="Actions décidées">
          {mission.actions.map((a) => (
            <li key={a.id} className="ligne espace" style={{ marginBottom: '0.5rem' }}>
              <span>
                <strong>{a.texte}</strong>
                <span className="petit doux">
                  {' '}
                  · {a.responsable || 'responsable à désigner'} · {a.echeance || 'date à fixer'}
                </span>
              </span>
              <button type="button" className="icone" aria-label={`Supprimer l’action ${a.texte.slice(0, 30)}`} onClick={() => maj((m) => ({ ...m, actions: m.actions.filter((x) => x.id !== a.id) }))}>
                ×
              </button>
            </li>
          ))}
        </ol>
        <form onSubmit={ajouterAction}>
          <div className="champ">
            <label htmlFor="action-texte">Action</label>
            <input id="action-texte" value={action.texte} onChange={(e) => setAction({ ...action, texte: e.target.value })} placeholder="Ex. Créer la règle de tri des newsletters" />
          </div>
          <div className="ligne">
            <input aria-label="Responsable (rôle)" placeholder="Qui (rôle)" value={action.responsable} onChange={(e) => setAction({ ...action, responsable: e.target.value })} />
            <input aria-label="Échéance" placeholder="Pour quand" value={action.echeance} onChange={(e) => setAction({ ...action, echeance: e.target.value })} />
            <button type="submit">Ajouter l’action</button>
          </div>
        </form>
        <div className="champ" style={{ marginTop: '1rem' }}>
          <label htmlFor="notes-suivi">Points de suivi (J+10, J+30, J+90)</label>
          <textarea id="notes-suivi" value={mission.notesSuivi} onChange={(e) => maj((m) => ({ ...m, notesSuivi: e.target.value }))} placeholder="Indicateur choisi, ce qui a été appliqué, ce qui a coincé…" />
        </div>
      </section>

      <section className="panneau" aria-labelledby="titre-livrables">
        <h2 id="titre-livrables">Synthèse et guide d’action</h2>
        <p className="aide">
          La synthèse sépare constats, hypothèses et recommandations. Elle se relit avant tout envoi : rien ne part sans validation humaine.
        </p>
        <div className="actions">
          <button type="button" onClick={() => setApercu(apercu === 'synthese' ? 'aucun' : 'synthese')} aria-expanded={apercu === 'synthese'}>
            {apercu === 'synthese' ? 'Masquer la synthèse' : 'Afficher la synthèse'}
          </button>
          <button type="button" onClick={() => setApercu(apercu === 'guide' ? 'aucun' : 'guide')} aria-expanded={apercu === 'guide'}>
            {apercu === 'guide' ? 'Masquer le guide' : 'Afficher le guide d’action'}
          </button>
        </div>
        {apercu === 'synthese' && <pre className="apercu" aria-label="Aperçu de la synthèse">{synthese}</pre>}
        {apercu === 'guide' && <pre className="apercu" aria-label="Aperçu du guide d’action">{guide}</pre>}
        <div className="champ" style={{ marginTop: '1rem' }}>
          <label className="ligne" htmlFor="relu" style={{ fontWeight: 600 }}>
            <input id="relu" type="checkbox" checked={relu} onChange={(e) => setRelu(e.target.checked)} style={{ width: 24, minHeight: 24 }} />
            J’ai relu la synthèse et le guide avant export
          </label>
        </div>
        <div className="actions">
          <button type="button" className="primaire" disabled={!relu} onClick={() => telecharger(`synthese-${slug(mission.nom)}.md`, synthese)}>
            Exporter la synthèse (.md)
          </button>
          <button type="button" disabled={!relu} onClick={() => telecharger(`guide-action-${slug(mission.nom)}.md`, guide)}>
            Exporter le guide d’action (.md)
          </button>
        </div>
        <hr style={{ margin: '1.5rem 0', border: 0, borderTop: '1px solid var(--bord)' }} />
        <button
          type="button"
          className="danger"
          onClick={() => {
            if (window.confirm(`Supprimer définitivement la mission « ${mission.nom} » de ce navigateur ?`)) {
              supprimer(mission.id);
              router.push('/');
            }
          }}
        >
          Supprimer cette mission
        </button>
      </section>
    </div>
  );
}
