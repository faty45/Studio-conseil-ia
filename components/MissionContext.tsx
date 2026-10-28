'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createLocalStore, type MissionStore } from '../lib/domain/store';
import { nouvelleMission, type Mission } from '../lib/domain/types';
import { getPack } from '../lib/packs';

type Contexte = {
  pret: boolean;
  missions: Mission[];
  creer(nom: string, packId: string): Mission;
  obtenir(id: string): Mission | undefined;
  modifier(id: string, fn: (m: Mission) => Mission): void;
  supprimer(id: string): void;
};

const MissionCtx = createContext<Contexte | null>(null);

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<MissionStore | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    const s = createLocalStore();
    setStore(s);
    setMissions(s.list());
  }, []);

  const rafraichir = useCallback((s: MissionStore) => setMissions(s.list()), []);

  const creer = useCallback(
    (nom: string, packId: string) => {
      if (!store) throw new Error('Dépôt non prêt');
      const pack = getPack(packId);
      const m = store.save(nouvelleMission(nom.trim() || 'Mission sans nom', pack.id, pack.version));
      rafraichir(store);
      return m;
    },
    [store, rafraichir],
  );

  const obtenir = useCallback((id: string) => missions.find((m) => m.id === id), [missions]);

  const modifier = useCallback(
    (id: string, fn: (m: Mission) => Mission) => {
      if (!store) return;
      const actuelle = store.get(id);
      if (!actuelle) return;
      store.save(fn(actuelle));
      rafraichir(store);
    },
    [store, rafraichir],
  );

  const supprimer = useCallback(
    (id: string) => {
      if (!store) return;
      store.remove(id);
      rafraichir(store);
    },
    [store, rafraichir],
  );

  const valeur = useMemo<Contexte>(
    () => ({ pret: store !== null, missions, creer, obtenir, modifier, supprimer }),
    [store, missions, creer, obtenir, modifier, supprimer],
  );

  return <MissionCtx.Provider value={valeur}>{children}</MissionCtx.Provider>;
}

export function useMissions(): Contexte {
  const ctx = useContext(MissionCtx);
  if (!ctx) throw new Error('useMissions doit être utilisé dans MissionProvider');
  return ctx;
}
