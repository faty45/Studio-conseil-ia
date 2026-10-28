import type { Mission } from './types';

/**
 * Dépôt de missions. Le MVP utilise le stockage local du navigateur.
 * Une implémentation Supabase (espaces isolés, sécurité par ligne) remplacera celle-ci dans le lot sécurité,
 * sans changer les composants : ils ne parlent qu'à cette interface.
 */
export interface MissionStore {
  list(): Mission[];
  get(id: string): Mission | undefined;
  save(mission: Mission): Mission;
  remove(id: string): void;
  /** Vide le dépôt (utilisé par les tests et par le bouton « tout effacer »). */
  clear(): void;
}

export const CLE_STOCKAGE = 'studio-conseil-ia.missions.v1';

function estMission(x: unknown): x is Mission {
  if (!x || typeof x !== 'object') return false;
  const m = x as Record<string, unknown>;
  return typeof m.id === 'string' && typeof m.nom === 'string' && typeof m.packId === 'string' && Array.isArray(m.cartes) && Array.isArray(m.etapes);
}

type Stockage = { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void };

export function createStore(stockage: Stockage): MissionStore {
  const lire = (): Mission[] => {
    try {
      const brut = stockage.getItem(CLE_STOCKAGE);
      if (!brut) return [];
      const data = JSON.parse(brut);
      return Array.isArray(data) ? data.filter(estMission) : [];
    } catch {
      return [];
    }
  };
  const ecrire = (missions: Mission[]) => stockage.setItem(CLE_STOCKAGE, JSON.stringify(missions));
  return {
    list: () => lire().sort((a, b) => b.misAJourLe.localeCompare(a.misAJourLe)),
    get: (id) => lire().find((m) => m.id === id),
    save: (mission) => {
      const maj = { ...mission, misAJourLe: new Date().toISOString() };
      const autres = lire().filter((m) => m.id !== mission.id);
      ecrire([maj, ...autres]);
      return maj;
    },
    remove: (id) => ecrire(lire().filter((m) => m.id !== id)),
    clear: () => stockage.removeItem(CLE_STOCKAGE),
  };
}

/** Dépôt en mémoire, pour les tests et le rendu côté serveur. */
export function createMemoryStore(): MissionStore {
  const map = new Map<string, string>();
  return createStore({
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  });
}

export function createLocalStore(): MissionStore {
  if (typeof window === 'undefined' || !('localStorage' in window)) return createMemoryStore();
  return createStore(window.localStorage);
}
