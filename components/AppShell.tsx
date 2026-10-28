'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { BookOpen, ClipboardList, Compass, Home, Lightbulb, MessagesSquare, Search, Target, TrendingUp } from 'lucide-react';
import { useDepot } from './DepotContext';
import { PHASES, avancement, type PhaseMission } from '../lib/domain/types';

const ICONES: Record<PhaseMission, React.ComponentType<{ size?: number }>> = {
  preparer: ClipboardList,
  atelier: MessagesSquare,
  analyser: Search,
  decider: Target,
  restituer: Lightbulb,
  suivre: TrendingUp,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ id?: string; phase?: string }>();
  const { mission, client } = useDepot();
  const m = params?.id ? mission(params.id) : undefined;
  const c = m ? client(m.clientId) : undefined;
  const av = m ? avancement(m) : undefined;
  const phaseCourante = params?.phase as PhaseMission | undefined;

  return (
    <div className="app">
      <aside className="barre" aria-label="Navigation principale">
        <Link href="/" className="marque">
          <span className="logo" aria-hidden>
            S
          </span>
          <span>
            <strong>Studio Conseil IA</strong>
            <span>Cockpit de mission</span>
          </span>
        </Link>
        <nav>
          <Link href="/" className="lien" aria-current={pathname === '/' ? 'page' : undefined}>
            <Home size={18} /> Cockpit
          </Link>
          <Link href="/bibliotheque" className="lien" aria-current={pathname.startsWith('/bibliotheque') ? 'page' : undefined}>
            <BookOpen size={18} /> Bibliothèque intermétiers
          </Link>
        </nav>
        {m && (
          <nav aria-label="Phases de la mission">
            <div className="section">{c?.nom ?? 'Mission'}</div>
            {PHASES.map((p, i) => {
              const Icone = ICONES[p.id];
              const pct = av?.[p.id] ?? 0;
              return (
                <Link key={p.id} href={`/mission/${m.id}/${p.id}`} className="lien" aria-current={phaseCourante === p.id ? 'page' : undefined} title={p.description}>
                  <span className={`num ${pct >= 100 ? 'fait' : pct > 0 ? 'en-cours' : ''}`}>{i + 1}</span>
                  <Icone size={16} /> {p.label}
                </Link>
              );
            })}
          </nav>
        )}
        <div className="pied">
          Prototype : données dans ce navigateur, sans compte. Démonstration sur données fictives uniquement.
        </div>
      </aside>

      <main className="contenu" id="contenu">
        {children}
      </main>

      <nav className="nav-mobile" aria-label="Navigation mobile">
        <Link href="/" aria-current={pathname === '/' ? 'page' : undefined}>
          <Home size={20} /> Cockpit
        </Link>
        {m ? (
          <>
            <Link href={`/mission/${m.id}/preparer`} aria-current={phaseCourante === 'preparer' ? 'page' : undefined}>
              <ClipboardList size={20} /> Préparer
            </Link>
            <Link href={`/mission/${m.id}/atelier`} aria-current={phaseCourante === 'atelier' ? 'page' : undefined}>
              <MessagesSquare size={20} /> Atelier
            </Link>
            <Link href={`/mission/${m.id}/analyser`} aria-current={phaseCourante === 'analyser' ? 'page' : undefined}>
              <Search size={20} /> Analyser
            </Link>
            <Link href={`/mission/${m.id}/decider`} aria-current={phaseCourante === 'decider' || phaseCourante === 'restituer' || phaseCourante === 'suivre' ? 'page' : undefined}>
              <Compass size={20} /> Décider
            </Link>
          </>
        ) : (
          <Link href="/bibliotheque" aria-current={pathname.startsWith('/bibliotheque') ? 'page' : undefined}>
            <BookOpen size={20} /> Bibliothèque
          </Link>
        )}
      </nav>
    </div>
  );
}
