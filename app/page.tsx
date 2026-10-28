'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ArrowRight, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useDepot } from '../components/DepotContext';
import { Badge, Carte, Champ, Encart, Metrique, Progression, Vide, dateCourte } from '../components/ui';
import { PHASES, LIBELLES_TAILLE, avancement, type TailleClient } from '../lib/domain/types';
import { getPack, packs } from '../lib/packs';

export default function Cockpit() {
  const { pret, clients, missions, creerClient, creerMission, supprimerMission, supprimerClient, chargerDemo, demoChargee } = useDepot();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState({ clientId: '', nouveauClient: '', secteur: '', taille: '1-9' as TailleClient, titre: '', packId: packs[0].id });

  const ouvrir = () => {
    setForm((f) => ({ ...f, clientId: clients[0]?.id ?? '' }));
    dialog.current?.showModal();
  };

  const creer = (e: React.FormEvent) => {
    e.preventDefault();
    let clientId = form.clientId;
    if (!clientId) {
      if (!form.nouveauClient.trim()) return;
      clientId = creerClient(form.nouveauClient, form.secteur, form.taille).id;
    }
    const m = creerMission(clientId, form.titre, form.packId);
    dialog.current?.close();
    router.push(`/mission/${m.id}/preparer`);
  };

  const quickWinsTotal = missions.reduce((n, m) => n + m.solutions.filter((s) => s.priorite === 'quick_win' && s.decision === 'retenue').length, 0);
  const actionsOuvertes = missions.reduce((n, m) => n + m.actions.filter((a) => a.statut !== 'faite' && a.statut !== 'abandonnee').length, 0);

  return (
    <>
      <header className="entete-page">
        <div>
          <div className="sur-titre">Cockpit</div>
          <h1>Vos clients et vos missions</h1>
          <p>Préparer, animer, analyser, décider, restituer, suivre : chaque mission avance phase par phase, avec la bibliothèque intermétiers en appui.</p>
        </div>
        <div className="actions">
          {!demoChargee && (
            <button type="button" className="bouton" onClick={chargerDemo} disabled={!pret}>
              <Sparkles size={18} /> Charger la démonstration
            </button>
          )}
          <button type="button" className="bouton primaire" onClick={ouvrir} disabled={!pret}>
            <Plus size={18} /> Nouvelle mission
          </button>
        </div>
      </header>

      {!pret && <p className="doux">Chargement…</p>}

      {pret && missions.length === 0 && (
        <Carte>
          <Vide
            titre="Aucune mission pour l’instant"
            texte="Charge la démonstration pour voir deux missions fictives complètes (ARDAN et une boulangerie), ou crée ta première mission."
            action={
              <div className="actions" style={{ justifyContent: 'center', marginTop: '0.75rem' }}>
                <button type="button" className="bouton accent" onClick={chargerDemo}>
                  <Sparkles size={18} /> Charger la démonstration
                </button>
                <button type="button" className="bouton" onClick={ouvrir}>
                  <Plus size={18} /> Nouvelle mission
                </button>
              </div>
            }
          />
        </Carte>
      )}

      {missions.length > 0 && (
        <>
          <div className="grille trois" style={{ marginBottom: '1.25rem' }}>
            <Metrique valeur={missions.length} libelle="Missions en cours" />
            <Metrique valeur={quickWinsTotal} libelle="Quick wins retenus" ton="sauge" />
            <Metrique valeur={actionsOuvertes} libelle="Actions à mener" ton="accent" />
          </div>

          <div className="grille deux">
            {clients.map((c) => {
              const ms = missions.filter((m) => m.clientId === c.id);
              return (
                <Carte
                  key={c.id}
                  titre={
                    <span className="ligne">
                      {c.nom} {c.fictif && <Badge ton="or">Fictif</Badge>}
                    </span>
                  }
                  sousTitre={`${c.secteur} · ${LIBELLES_TAILLE[c.taille]}`}
                  actions={
                    <button
                      type="button"
                      className="bouton petit danger"
                      aria-label={`Supprimer le client ${c.nom}`}
                      onClick={() => {
                        if (window.confirm(`Supprimer « ${c.nom} » et ses ${ms.length} mission(s) de ce navigateur ?`)) supprimerClient(c.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  }
                >
                  {ms.length === 0 && <p className="doux petit">Aucune mission.</p>}
                  <ul className="liste">
                    {ms.map((m) => {
                      const av = avancement(m);
                      const phase = PHASES.find((p) => p.id === m.phase) ?? PHASES[0];
                      const prochaine = m.actions.find((a) => a.statut !== 'faite' && a.statut !== 'abandonnee');
                      return (
                        <li key={m.id} className="item">
                          <div className="ligne espace">
                            <div>
                              <strong>{m.titre}</strong>
                              <div className="petit doux">
                                {getPack(m.packId).label} · phase : {phase.label} · mise à jour le {dateCourte(m.misAJourLe)}
                              </div>
                            </div>
                            <Link href={`/mission/${m.id}/${m.phase}`} className="bouton petit primaire">
                              Ouvrir <ArrowRight size={16} />
                            </Link>
                          </div>
                          <div className="grille" style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.3rem', margin: '0.6rem 0 0.4rem' }}>
                            {PHASES.map((p) => (
                              <Progression key={p.id} valeur={av[p.id]} label={`${p.label} : ${av[p.id]} %`} />
                            ))}
                          </div>
                          <div className="ligne petit">
                            <Badge>{m.problemes.length} problème(s)</Badge>
                            <Badge ton="sauge">{m.solutions.filter((s) => s.decision === 'retenue').length} retenue(s)</Badge>
                            {prochaine ? <span className="doux">Prochaine action : {prochaine.texte}</span> : <span className="doux">Aucune action planifiée</span>}
                            <button type="button" className="bouton petit discret" aria-label={`Supprimer la mission ${m.titre}`} onClick={() => window.confirm(`Supprimer la mission « ${m.titre} » ?`) && supprimerMission(m.id)}>
                              Supprimer
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Carte>
              );
            })}
          </div>
        </>
      )}

      <Encart ton="info">
        Prototype en démonstration : les données restent dans ce navigateur, sans compte ni serveur. Aucune donnée réelle de client tant que l’authentification, l’isolation
        et la politique de confidentialité ne sont pas en place. Les rapprochements et suggestions sont produits par des règles explicites, pas par une IA externe.
      </Encart>

      <dialog ref={dialog} className="modale" aria-labelledby="titre-nouvelle">
        <form onSubmit={creer}>
          <h2 id="titre-nouvelle">Nouvelle mission</h2>
          <p className="doux petit">Une mission appartient à un client et suit une trame métier. Tout reste modifiable ensuite.</p>
          <Champ label="Client">
            <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              <option value="">Nouveau client…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </Champ>
          {!form.clientId && (
            <>
              <Champ label="Nom du client">
                <input value={form.nouveauClient} onChange={(e) => setForm({ ...form, nouveauClient: e.target.value })} placeholder="Ex. Boulangerie du Marché (fictif)" />
              </Champ>
              <div className="grille deux">
                <Champ label="Secteur">
                  <input value={form.secteur} onChange={(e) => setForm({ ...form, secteur: e.target.value })} placeholder="Ex. boulangerie artisanale" />
                </Champ>
                <Champ label="Taille">
                  <select value={form.taille} onChange={(e) => setForm({ ...form, taille: e.target.value as TailleClient })}>
                    {Object.entries(LIBELLES_TAILLE).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </Champ>
              </div>
            </>
          )}
          <Champ label="Titre de la mission">
            <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} placeholder="Ex. Diagnostic de la veille" />
          </Champ>
          <Champ label="Trame métier" aide={getPack(form.packId).description}>
            <select value={form.packId} onChange={(e) => setForm({ ...form, packId: e.target.value })}>
              {packs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </Champ>
          <div className="actions droite">
            <button type="button" className="bouton" onClick={() => dialog.current?.close()}>
              Annuler
            </button>
            <button type="submit" className="bouton primaire">
              Créer et préparer
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
