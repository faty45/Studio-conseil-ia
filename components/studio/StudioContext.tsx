'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Client, Mission } from '../../lib/domain/types';
import { DEMO } from '../../lib/domain/demo';

/** Positions libres des éléments sur le canvas d'atelier, par mission. */
export type Position = { x: number; y: number };
export type Note = { id: string; texte: string; type: 'note' | 'citation' | 'copilote'; x: number; y: number; entreeId?: string };
export type EtatCanvas = { positions: Record<string, Position>; notes: Note[] };

type Etat = { clients: Client[]; missions: Mission[]; canvas: Record<string, EtatCanvas>; version: 1 };

const CLE = 'studio-conseil-ia.studio.v1';

function etatInitial(): Etat {
  return { clients: structuredClone(DEMO.clients), missions: structuredClone(DEMO.missions), canvas: {}, version: 1 };
}

type Contexte = {
  pret: boolean;
  clients: Client[];
  missions: Mission[];
  client(id: string): Client | undefined;
  mission(id: string): Mission | undefined;
  majMission(id: string, fn: (m: Mission) => Mission): void;
  majClient(id: string, fn: (c: Client) => Client): void;
  canvas(missionId: string): EtatCanvas;
  majCanvas(missionId: string, fn: (c: EtatCanvas) => EtatCanvas): void;
  reinitialiser(): void;
  sauvegarde: 'ok' | 'en-cours' | 'erreur';
  derniereSauvegarde?: string;
};

const Ctx = createContext<Contexte | null>(null);

/**
 * État du prototype « Studio » : données de démonstration chargées au premier affichage, modifications
 * conservées dans le navigateur (clé dédiée, indépendante de l'application). Fonctionnel : manipulation,
 * persistance locale, règles. Simulé : comptes, collaboration, synchronisation serveur.
 */
export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [etat, setEtat] = useState<Etat | null>(null);
  const [sauvegarde, setSauvegarde] = useState<Contexte['sauvegarde']>('ok');
  const [derniereSauvegarde, setDerniere] = useState<string>();
  const minuterie = useRef<number | null>(null);

  useEffect(() => {
    try {
      const brut = window.localStorage.getItem(CLE);
      const lu = brut ? (JSON.parse(brut) as Etat) : null;
      setEtat(lu && lu.version === 1 ? lu : etatInitial());
    } catch {
      setEtat(etatInitial());
    }
  }, []);

  const persister = useCallback((e: Etat) => {
    setSauvegarde('en-cours');
    if (minuterie.current) window.clearTimeout(minuterie.current);
    minuterie.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(CLE, JSON.stringify(e));
        setSauvegarde('ok');
        setDerniere(new Date().toISOString());
      } catch {
        setSauvegarde('erreur');
      }
    }, 300);
  }, []);

  const modifier = useCallback(
    (fn: (e: Etat) => Etat) => {
      setEtat((prev) => {
        if (!prev) return prev;
        const suivant = fn(prev);
        persister(suivant);
        return suivant;
      });
    },
    [persister],
  );

  const valeur = useMemo<Contexte>(() => {
    const clients = etat?.clients ?? [];
    const missions = etat?.missions ?? [];
    return {
      pret: !!etat,
      clients,
      missions,
      client: (id) => clients.find((c) => c.id === id),
      mission: (id) => missions.find((m) => m.id === id),
      majMission: (id, fn) => modifier((e) => ({ ...e, missions: e.missions.map((m) => (m.id === id ? { ...fn(m), misAJourLe: new Date().toISOString() } : m)) })),
      majClient: (id, fn) => modifier((e) => ({ ...e, clients: e.clients.map((c) => (c.id === id ? fn(c) : c)) })),
      canvas: (missionId) => etat?.canvas[missionId] ?? { positions: {}, notes: [] },
      majCanvas: (missionId, fn) => modifier((e) => ({ ...e, canvas: { ...e.canvas, [missionId]: fn(e.canvas[missionId] ?? { positions: {}, notes: [] }) } })),
      reinitialiser: () => {
        const neuf = etatInitial();
        setEtat(neuf);
        persister(neuf);
      },
      sauvegarde,
      derniereSauvegarde,
    };
  }, [etat, modifier, persister, sauvegarde, derniereSauvegarde]);

  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}

export function useStudio(): Contexte {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStudio hors du StudioProvider');
  return c;
}
