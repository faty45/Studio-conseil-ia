'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMissions } from '../components/MissionContext';
import { getPack, packs } from '../lib/packs';

function dateCourte(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('fr-FR');
}

export default function Accueil() {
  const { pret, missions, creer, supprimer } = useMissions();
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [packId, setPackId] = useState(packs[0].id);
  const [ouvert, setOuvert] = useState(false);

  const demarrer = (e: React.FormEvent) => {
    e.preventDefault();
    const m = creer(nom, packId);
    router.push(`/mission/${m.id}/atelier`);
  };

  return (
    <main className="page" id="contenu">
      <header className="entete">
        <div>
          <div className="marque">Studio Conseil IA</div>
          <h1>Comprendre, trouver, agir.</h1>
          <p className="doux">Ateliers hybrides pour améliorer les processus avec les outils déjà présents.</p>
        </div>
        <span className="badge accent">Prototype local, sans partage</span>
      </header>

      <div className="grille-3">
        <button className="carte-verbe" onClick={() => setOuvert(true)} aria-expanded={ouvert} aria-controls="nouvelle-mission">
          <strong>Démarrer</strong>
          Ouvrir un atelier : huit questions cœur, questions du métier, tableau libre, carte du processus.
        </button>
        <Link className="carte-verbe" href={missions[0] ? `/mission/${missions[0].id}/trouver` : '#missions'}>
          <strong>Trouver</strong>
          Problèmes, preuves, causes et pistes de solution fondées sur ce qui a été observé.
        </Link>
        <Link className="carte-verbe" href={missions[0] ? `/mission/${missions[0].id}/suivre` : '#missions'}>
          <strong>Suivre</strong>
          Actions décidées, synthèse et guide d’action à relire avant envoi.
        </Link>
      </div>

      {ouvert && (
        <form id="nouvelle-mission" className="panneau" onSubmit={demarrer}>
          <h2>Nouvelle mission</h2>
          <div className="champ">
            <label htmlFor="nom-mission">Nom de la mission (client ou atelier)</label>
            <input id="nom-mission" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex. ARDAN — veille" autoFocus />
          </div>
          <div className="champ">
            <label htmlFor="pack-mission">Pack métier</label>
            <select id="pack-mission" value={packId} onChange={(e) => setPackId(e.target.value)}>
              {packs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <p className="aide">{getPack(packId).description}</p>
          </div>
          <div className="actions">
            <button type="submit" className="primaire" disabled={!pret}>
              Ouvrir l’atelier
            </button>
            <button type="button" onClick={() => setOuvert(false)}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <section className="panneau" id="missions" aria-labelledby="titre-missions">
        <h2 id="titre-missions">Missions enregistrées dans ce navigateur</h2>
        {!pret && <p className="doux">Chargement…</p>}
        {pret && missions.length === 0 && <p className="doux">Aucune mission pour l’instant. Commence par « Démarrer ».</p>}
        <ul className="liste-missions">
          {missions.map((m) => (
            <li key={m.id}>
              <div>
                <strong>{m.nom}</strong>
                <div className="petit doux">
                  {getPack(m.packId).label} · mise à jour le {dateCourte(m.misAJourLe)}
                </div>
              </div>
              <div className="ligne" aria-label={`Ouvrir la mission ${m.nom}`}>
                <Link className="lien-bouton" href={`/mission/${m.id}/atelier`}>
                  Atelier
                </Link>
                <Link className="lien-bouton" href={`/mission/${m.id}/trouver`}>
                  Trouver
                </Link>
                <Link className="lien-bouton" href={`/mission/${m.id}/suivre`}>
                  Suivre
                </Link>
                <button
                  type="button"
                  className="danger"
                  aria-label={`Supprimer la mission ${m.nom}`}
                  onClick={() => {
                    if (window.confirm(`Supprimer la mission « ${m.nom} » de ce navigateur ?`)) supprimer(m.id);
                  }}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="note attention">
        Les données restent dans ce navigateur, sans compte ni serveur. Ne saisis aucune donnée personnelle ni information confidentielle de
        client tant que l’authentification et le stockage sécurisé (lot suivant) ne sont pas en place. Utilise des rôles, pas des noms.
      </div>
    </main>
  );
}
