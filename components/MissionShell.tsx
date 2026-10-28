'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMissions } from './MissionContext';
import { Atelier } from './Atelier';
import { Trouver } from './Trouver';
import { Suivre } from './Suivre';
import { getPack } from '../lib/packs';
import type { Mission } from '../lib/domain/types';

const ONGLETS = [
  { id: 'atelier', label: 'Démarrer · Atelier' },
  { id: 'trouver', label: 'Trouver · Problèmes et pistes' },
  { id: 'suivre', label: 'Suivre · Actions et synthèse' },
] as const;

type Onglet = (typeof ONGLETS)[number]['id'];

export function MissionShell() {
  const params = useParams<{ id: string; onglet: string }>();
  const { pret, obtenir, modifier } = useMissions();
  const id = params?.id ?? '';
  const onglet = (ONGLETS.some((o) => o.id === params?.onglet) ? params?.onglet : 'atelier') as Onglet;
  const mission = obtenir(id);

  if (!pret) {
    return (
      <main className="page" id="contenu">
        <p className="doux">Chargement…</p>
      </main>
    );
  }

  if (!mission) {
    return (
      <main className="page" id="contenu">
        <h1>Mission introuvable</h1>
        <p>Elle a peut-être été supprimée, ou créée dans un autre navigateur.</p>
        <Link href="/">Retour à l’accueil</Link>
      </main>
    );
  }

  const pack = getPack(mission.packId);
  const maj = (fn: (m: Mission) => Mission) => modifier(mission.id, fn);

  return (
    <main className="page" id="contenu">
      <header className="entete">
        <div>
          <div className="marque">
            <Link href="/">Studio Conseil IA</Link>
          </div>
          <h1>
            <input
              aria-label="Nom de la mission"
              className="titre-mission"
              value={mission.nom}
              onChange={(e) => maj((m) => ({ ...m, nom: e.target.value }))}
              style={{ fontSize: '1.4rem', fontWeight: 700, border: 'none', padding: '0.2rem 0', background: 'transparent' }}
            />
          </h1>
          <p className="doux">
            {pack.label} · version {mission.packVersion} · sauvegarde automatique dans ce navigateur
          </p>
        </div>
      </header>
      <nav className="onglets" aria-label="Étapes de la mission">
        {ONGLETS.map((o) => (
          <Link key={o.id} href={`/mission/${mission.id}/${o.id}`} aria-current={o.id === onglet ? 'page' : undefined}>
            {o.label}
          </Link>
        ))}
      </nav>
      {onglet === 'atelier' && <Atelier mission={mission} pack={pack} maj={maj} />}
      {onglet === 'trouver' && <Trouver mission={mission} pack={pack} maj={maj} />}
      {onglet === 'suivre' && <Suivre mission={mission} pack={pack} maj={maj} />}
    </main>
  );
}
