'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Compass, FolderKanban, Home, MessagesSquare, Palette as PaletteIcon, RotateCcw, Search } from 'lucide-react';
import { useStudio } from './StudioContext';
import { PHASES } from '../../lib/domain/types';

type Commande = { id: string; groupe: string; libelle: string; detail?: string; icone?: React.ComponentType<{ size?: number }>; action: () => void; raccourci?: string };

function normaliser(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Palette de commandes (⌘K / Ctrl+K) : navigation, clients, missions, actions. Fonctionnelle. */
export function Palette({ ouverte, fermer }: { ouverte: boolean; fermer: () => void }) {
  const router = useRouter();
  const { clients, missions, reinitialiser } = useStudio();
  const [q, setQ] = useState('');
  const [index, setIndex] = useState(0);
  const champ = useRef<HTMLInputElement>(null);

  const commandes = useMemo<Commande[]>(() => {
    const nav: Commande[] = [
      { id: 'n-cockpit', groupe: 'Navigation', libelle: 'Cockpit', icone: Home, action: () => router.push('/studio'), raccourci: 'G C' },
      { id: 'n-atelier', groupe: 'Navigation', libelle: 'Atelier · canvas ARDAN', icone: MessagesSquare, action: () => router.push('/studio/atelier'), raccourci: 'G A' },
      { id: 'n-analyse', groupe: 'Navigation', libelle: 'Analyse · boulangerie', icone: Compass, action: () => router.push('/studio/analyse'), raccourci: 'G N' },
      { id: 'n-direction', groupe: 'Navigation', libelle: 'Direction visuelle (référence comparative)', icone: PaletteIcon, action: () => router.push('/direction') },
    ];
    const cl: Commande[] = clients.map((c) => ({ id: `c-${c.id}`, groupe: 'Clients', libelle: c.nom.replace(' (exemple fictif)', ''), detail: c.secteur, icone: Building2, action: () => router.push(`/studio/client/${c.id}`) }));
    const mi: Commande[] = missions.map((m) => ({ id: `m-${m.id}`, groupe: 'Missions', libelle: m.titre, detail: `${PHASES.find((p) => p.id === m.phase)?.label} · ${clients.find((c) => c.id === m.clientId)?.nom.replace(' (exemple fictif)', '')}`, icone: FolderKanban, action: () => router.push(m.phase === 'analyser' ? '/studio/analyse' : '/studio/atelier') }));
    const act: Commande[] = [{ id: 'a-reset', groupe: 'Actions', libelle: 'Réinitialiser la démonstration', detail: 'Recharge les données fictives et efface les modifications locales', icone: RotateCcw, action: () => reinitialiser() }];
    return [...nav, ...cl, ...mi, ...act];
  }, [clients, missions, router, reinitialiser]);

  const resultats = useMemo(() => {
    const n = normaliser(q.trim());
    if (!n) return commandes;
    return commandes.filter((c) => normaliser(`${c.libelle} ${c.detail ?? ''} ${c.groupe}`).includes(n));
  }, [q, commandes]);

  useEffect(() => {
    if (ouverte) {
      setQ('');
      setIndex(0);
      setTimeout(() => champ.current?.focus(), 10);
    }
  }, [ouverte]);

  useEffect(() => setIndex(0), [q]);

  if (!ouverte) return null;

  const executer = (c: Commande) => {
    fermer();
    c.action();
  };

  const groupes = [...new Set(resultats.map((r) => r.groupe))];
  let compteur = -1;

  return (
    <div className="hx-palette-fond" onClick={fermer} role="presentation">
      <div className="hx-palette" role="dialog" aria-label="Palette de commandes" onClick={(e) => e.stopPropagation()}>
        <input
          ref={champ}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Aller à, ouvrir, agir…"
          aria-label="Rechercher une commande"
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setIndex((i) => Math.min(resultats.length - 1, i + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setIndex((i) => Math.max(0, i - 1));
            } else if (e.key === 'Enter' && resultats[index]) executer(resultats[index]);
            else if (e.key === 'Escape') fermer();
          }}
        />
        <div className="hx-resultats" role="listbox">
          {resultats.length === 0 && <div className="hx-vide" style={{ margin: 6 }}>Aucun résultat pour « {q} ».</div>}
          {groupes.map((g) => (
            <div key={g}>
              <div className="hx-groupe">{g}</div>
              {resultats
                .filter((r) => r.groupe === g)
                .map((r) => {
                  compteur += 1;
                  const i = compteur;
                  const Icone = r.icone ?? Search;
                  return (
                    <div key={r.id} role="option" aria-selected={i === index} className="hx-item" onMouseEnter={() => setIndex(i)} onClick={() => executer(r)}>
                      <Icone size={15} />
                      <span>
                        {r.libelle}
                        {r.detail && <span className="hx-mini"> — {r.detail}</span>}
                      </span>
                      {r.raccourci && <span className="hx-meta">{r.raccourci}</span>}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
        <div className="hx-pied">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> naviguer
          </span>
          <span>
            <kbd>↵</kbd> ouvrir
          </span>
          <span>
            <kbd>Échap</kbd> fermer
          </span>
        </div>
      </div>
    </div>
  );
}
