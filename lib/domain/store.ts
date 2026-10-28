import type { Client, Mission } from './types';

/**
 * Dépôt des clients et des missions.
 * Le prototype utilise le stockage local du navigateur. L'implémentation Supabase (espaces isolés,
 * sécurité par ligne) remplacera celle-ci au lot sécurité sans changer les composants.
 */
export interface Depot {
  clients(): Client[];
  client(id: string): Client | undefined;
  enregistrerClient(c: Client): Client;
  supprimerClient(id: string): void;
  missions(): Mission[];
  mission(id: string): Mission | undefined;
  enregistrerMission(m: Mission): Mission;
  supprimerMission(id: string): void;
  toutEffacer(): void;
}

export const CLE_STOCKAGE = 'studio-conseil-ia.cockpit.v2';

type Stockage = { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void };

type Etat = { clients: Client[]; missions: Mission[] };

function estEtat(x: unknown): x is Etat {
  if (!x || typeof x !== 'object') return false;
  const e = x as Record<string, unknown>;
  return Array.isArray(e.clients) && Array.isArray(e.missions);
}

export function createDepot(stockage: Stockage): Depot {
  const lire = (): Etat => {
    try {
      const brut = stockage.getItem(CLE_STOCKAGE);
      if (!brut) return { clients: [], missions: [] };
      const data = JSON.parse(brut);
      return estEtat(data) ? data : { clients: [], missions: [] };
    } catch {
      return { clients: [], missions: [] };
    }
  };
  const ecrire = (e: Etat) => stockage.setItem(CLE_STOCKAGE, JSON.stringify(e));
  return {
    clients: () => lire().clients.sort((a, b) => a.nom.localeCompare(b.nom, 'fr')),
    client: (id) => lire().clients.find((c) => c.id === id),
    enregistrerClient: (c) => {
      const e = lire();
      e.clients = [c, ...e.clients.filter((x) => x.id !== c.id)];
      ecrire(e);
      return c;
    },
    supprimerClient: (id) => {
      const e = lire();
      e.clients = e.clients.filter((c) => c.id !== id);
      e.missions = e.missions.filter((m) => m.clientId !== id);
      ecrire(e);
    },
    missions: () => lire().missions.sort((a, b) => b.misAJourLe.localeCompare(a.misAJourLe)),
    mission: (id) => lire().missions.find((m) => m.id === id),
    enregistrerMission: (m) => {
      const maj = { ...m, misAJourLe: new Date().toISOString() };
      const e = lire();
      e.missions = [maj, ...e.missions.filter((x) => x.id !== m.id)];
      ecrire(e);
      return maj;
    },
    supprimerMission: (id) => {
      const e = lire();
      e.missions = e.missions.filter((m) => m.id !== id);
      ecrire(e);
    },
    toutEffacer: () => stockage.removeItem(CLE_STOCKAGE),
  };
}

export function createDepotMemoire(): Depot {
  const map = new Map<string, string>();
  return createDepot({
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  });
}

export function createDepotLocal(): Depot {
  if (typeof window === 'undefined' || !('localStorage' in window)) return createDepotMemoire();
  return createDepot(window.localStorage);
}
