'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useDepot } from '../DepotContext';
import { Badge, Progression, dateCourte } from '../ui';
import { PHASES, avancement, type Client, type Mission, type PhaseMission } from '../../lib/domain/types';
import { getPack, type Pack } from '../../lib/packs';
import { Preparer } from './Preparer';
import { Atelier } from './Atelier';
import { Analyser } from './Analyser';
import { Decider } from './Decider';
import { Restituer } from './Restituer';
import { Suivre } from './Suivre';

export type PropsPhase = { mission: Mission; client: Client; pack: Pack; maj: (fn: (m: Mission) => Mission) => void; majClient: (fn: (c: Client) => Client) => void };

export function MissionShell() {
  const params = useParams<{ id: string; phase: string }>();
  const { pret, mission, client, modifierMission, modifierClient } = useDepot();
  const [editionTitre, setEditionTitre] = useState(false);
  const m = params?.id ? mission(params.id) : undefined;
  const phase = (PHASES.some((p) => p.id === params?.phase) ? params?.phase : 'preparer') as PhaseMission;

  if (!pret) return <p className="doux">Chargement…</p>;
  if (!m) {
    return (
      <>
        <h1>Mission introuvable</h1>
        <p>Elle a peut-être été supprimée, ou créée dans un autre navigateur.</p>
        <Link href="/" className="bouton">
          Retour au cockpit
        </Link>
      </>
    );
  }
  const c = client(m.clientId);
  if (!c) return <p>Client introuvable.</p>;
  const pack = getPack(m.packId);
  const av = avancement(m);
  const maj = (fn: (x: Mission) => Mission) => modifierMission(m.id, fn);
  const majClient = (fn: (x: Client) => Client) => modifierClient(c.id, fn);
  const props: PropsPhase = { mission: m, client: c, pack, maj, majClient };
  const info = PHASES.find((p) => p.id === phase)!;

  return (
    <>
      <header className="entete-page">
        <div>
          <div className="sur-titre">
            <Link href="/">Cockpit</Link> · {c.nom} {c.fictif && <Badge ton="or">Fictif</Badge>}
          </div>
          {editionTitre ? (
            <form
              className="ligne"
              onSubmit={(e) => {
                e.preventDefault();
                setEditionTitre(false);
              }}
            >
              <input aria-label="Titre de la mission" autoFocus value={m.titre} onChange={(e) => maj((x) => ({ ...x, titre: e.target.value }))} style={{ fontSize: '1.1rem', fontWeight: 600 }} />
              <button type="submit" className="bouton petit primaire" aria-label="Valider le titre">
                <Check size={16} />
              </button>
            </form>
          ) : (
            <h1>
              {m.titre}{' '}
              <button type="button" className="bouton petit discret pas-imprime" style={{ verticalAlign: 'middle', marginLeft: '0.25rem' }} aria-label="Modifier le titre de la mission" onClick={() => setEditionTitre(true)}>
                <Pencil size={16} />
              </button>
            </h1>
          )}
          <p>
            {pack.label} · {info.label} : {info.description} · enregistré le {dateCourte(m.misAJourLe)}
          </p>
        </div>
        <div style={{ minWidth: 220 }}>
          <div className="petit doux" style={{ marginBottom: '0.3rem' }}>
            Avancement de la phase : {av[phase]} %
          </div>
          <Progression valeur={av[phase]} label={`Avancement ${info.label}`} />
        </div>
      </header>

      <nav className="onglets-mission" aria-label="Phases de la mission">
        {PHASES.map((p, i) => (
          <Link key={p.id} href={`/mission/${m.id}/${p.id}`} aria-current={p.id === phase ? 'page' : undefined}>
            <span className="badge contour" style={{ padding: '0 0.45rem' }}>
              {i + 1}
            </span>
            {p.label}
            {av[p.id] >= 100 && <span aria-label="terminée">✓</span>}
          </Link>
        ))}
      </nav>

      {phase === 'preparer' && <Preparer {...props} />}
      {phase === 'atelier' && <Atelier {...props} />}
      {phase === 'analyser' && <Analyser {...props} />}
      {phase === 'decider' && <Decider {...props} />}
      {phase === 'restituer' && <Restituer {...props} />}
      {phase === 'suivre' && <Suivre {...props} />}
    </>
  );
}
