'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createDepotLocal, type Depot } from '../lib/domain/store';
import { nouveauClient, nouvelleMission, type Client, type Mission, type TailleClient } from '../lib/domain/types';
import { getPack, questionsPour } from '../lib/packs';
import { DEMO } from '../lib/domain/demo';

type Contexte = {
  pret: boolean;
  clients: Client[];
  missions: Mission[];
  client(id: string): Client | undefined;
  mission(id: string): Mission | undefined;
  creerClient(nom: string, secteur: string, taille: TailleClient): Client;
  modifierClient(id: string, fn: (c: Client) => Client): void;
  supprimerClient(id: string): void;
  creerMission(clientId: string, titre: string, packId: string): Mission;
  modifierMission(id: string, fn: (m: Mission) => Mission): void;
  supprimerMission(id: string): void;
  chargerDemo(): void;
  demoChargee: boolean;
  toutEffacer(): void;
};

const Ctx = createContext<Contexte | null>(null);

export function DepotProvider({ children }: { children: React.ReactNode }) {
  const [depot, setDepot] = useState<Depot | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);

  const rafraichir = useCallback((d: Depot) => {
    setClients(d.clients());
    setMissions(d.missions());
  }, []);

  useEffect(() => {
    const d = createDepotLocal();
    setDepot(d);
    rafraichir(d);
  }, [rafraichir]);

  const client = useCallback((id: string) => clients.find((c) => c.id === id), [clients]);
  const mission = useCallback((id: string) => missions.find((m) => m.id === id), [missions]);

  const creerClient = useCallback(
    (nom: string, secteur: string, taille: TailleClient) => {
      if (!depot) throw new Error('Dépôt non prêt');
      const c = depot.enregistrerClient(nouveauClient(nom.trim() || 'Client sans nom', secteur.trim() || 'Secteur à préciser', taille));
      rafraichir(depot);
      return c;
    },
    [depot, rafraichir],
  );

  const modifierClient = useCallback(
    (id: string, fn: (c: Client) => Client) => {
      if (!depot) return;
      const actuel = depot.client(id);
      if (!actuel) return;
      depot.enregistrerClient(fn(actuel));
      rafraichir(depot);
    },
    [depot, rafraichir],
  );

  const supprimerClient = useCallback(
    (id: string) => {
      if (!depot) return;
      depot.supprimerClient(id);
      rafraichir(depot);
    },
    [depot, rafraichir],
  );

  const creerMission = useCallback(
    (clientId: string, titre: string, packId: string) => {
      if (!depot) throw new Error('Dépôt non prêt');
      const pack = getPack(packId);
      const trame = questionsPour(pack).map((q) => q.id);
      const m = nouvelleMission(clientId, titre.trim() || 'Mission sans titre', pack.id, pack.version, trame);
      m.hypotheses = pack.hypothesesTypiques.map((t, i) => ({ id: `h-${i}-${m.id.slice(0, 6)}`, texte: t, statut: 'a_tester', origine: 'bibliotheque' }));
      depot.enregistrerMission(m);
      rafraichir(depot);
      return m;
    },
    [depot, rafraichir],
  );

  const modifierMission = useCallback(
    (id: string, fn: (m: Mission) => Mission) => {
      if (!depot) return;
      const actuelle = depot.mission(id);
      if (!actuelle) return;
      depot.enregistrerMission(fn(actuelle));
      rafraichir(depot);
    },
    [depot, rafraichir],
  );

  const supprimerMission = useCallback(
    (id: string) => {
      if (!depot) return;
      depot.supprimerMission(id);
      rafraichir(depot);
    },
    [depot, rafraichir],
  );

  const chargerDemo = useCallback(() => {
    if (!depot) return;
    for (const c of DEMO.clients) depot.enregistrerClient(c);
    for (const m of DEMO.missions) depot.enregistrerMission(m);
    rafraichir(depot);
  }, [depot, rafraichir]);

  const toutEffacer = useCallback(() => {
    if (!depot) return;
    depot.toutEffacer();
    rafraichir(depot);
  }, [depot, rafraichir]);

  const demoChargee = useMemo(() => DEMO.missions.every((m) => missions.some((x) => x.id === m.id)), [missions]);

  const valeur = useMemo<Contexte>(
    () => ({ pret: depot !== null, clients, missions, client, mission, creerClient, modifierClient, supprimerClient, creerMission, modifierMission, supprimerMission, chargerDemo, demoChargee, toutEffacer }),
    [depot, clients, missions, client, mission, creerClient, modifierClient, supprimerClient, creerMission, modifierMission, supprimerMission, chargerDemo, demoChargee, toutEffacer],
  );

  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}

export function useDepot(): Contexte {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDepot doit être utilisé dans DepotProvider');
  return ctx;
}
