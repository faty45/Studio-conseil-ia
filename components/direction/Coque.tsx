import Link from 'next/link';
import type { ReactNode } from 'react';
import { BookOpen, ClipboardList, Compass, Home, Lightbulb, MessagesSquare, Palette, Search, Target, TrendingUp } from 'lucide-react';
import { PHASES, type PhaseMission } from '../../lib/domain/types';

const ICONES: Record<PhaseMission, React.ComponentType<{ size?: number }>> = {
  preparer: ClipboardList,
  atelier: MessagesSquare,
  analyser: Search,
  decider: Target,
  restituer: Lightbulb,
  suivre: TrendingUp,
};

type Props = {
  children: ReactNode;
  panneau?: ReactNode;
  page: 'direction' | 'cockpit' | 'atelier' | 'analyse';
  /** Dossier de mission affiché dans le rail, si on est dans une mission. */
  mission?: { client: string; titre: string; phase: PhaseMission; avancement: Record<PhaseMission, number> };
};

/**
 * Coquille de la direction visuelle : rail d'encre à gauche, canevas de travail, panneau contextuel à droite.
 * Statique : c'est une proposition à juger, pas l'application.
 */
export function Coque({ children, panneau, page, mission }: Props) {
  return (
    <div className={`dv-coque${panneau ? ' avec-panneau' : ''}`}>
      <aside className="dv-rail" aria-label="Navigation">
        <Link href="/direction" className="marque">
          <span className="sceau" aria-hidden>
            S
          </span>
          <span>
            <strong>Studio Conseil IA</strong>
            <span>Dossier de mission</span>
          </span>
        </Link>
        <nav aria-label="Principal">
          <Link href="/direction/cockpit" className="lien" aria-current={page === 'cockpit' ? 'page' : undefined}>
            <Home size={17} /> Cockpit
          </Link>
          <Link href="/direction" className="lien" aria-current={page === 'direction' ? 'page' : undefined}>
            <Palette size={17} /> Direction visuelle
          </Link>
          <span className="lien" style={{ opacity: 0.45 }}>
            <BookOpen size={17} /> Bibliothèque intermétiers
          </span>
        </nav>
        {mission && (
          <>
            <div className="dossier">
              <strong>{mission.client}</strong>
              {mission.titre}
            </div>
            <nav aria-label="Phases de la mission">
              <div className="section">Phases</div>
              {PHASES.map((p, i) => {
                const Icone = ICONES[p.id];
                const pct = mission.avancement[p.id];
                const href = p.id === 'atelier' ? '/direction/atelier' : p.id === 'analyser' ? '/direction/analyse' : undefined;
                const contenu = (
                  <>
                    <span className={`num ${pct >= 100 ? 'fait' : pct > 0 ? 'en-cours' : ''}`}>{i + 1}</span>
                    <Icone size={15} /> {p.label}
                  </>
                );
                return href ? (
                  <Link key={p.id} href={href} className="lien" aria-current={(page === 'atelier' && p.id === 'atelier') || (page === 'analyse' && p.id === 'analyser') ? 'page' : undefined}>
                    {contenu}
                  </Link>
                ) : (
                  <span key={p.id} className="lien" style={{ opacity: 0.45 }}>
                    {contenu}
                  </span>
                );
              })}
            </nav>
          </>
        )}
        <div className="pied">Proposition de direction visuelle. Données fictives. Rien n’est appliqué à l’application tant qu’elle n’est pas validée.</div>
      </aside>

      <main className="dv-canevas">{children}</main>

      {panneau && <aside className="dv-panneau">{panneau}</aside>}

      <nav className="dv-mobile-nav" aria-label="Navigation mobile">
        <Link href="/direction/cockpit" aria-current={page === 'cockpit' ? 'page' : undefined}>
          <Home size={20} /> Cockpit
        </Link>
        <Link href="/direction/atelier" aria-current={page === 'atelier' ? 'page' : undefined}>
          <MessagesSquare size={20} /> Atelier
        </Link>
        <Link href="/direction/analyse" aria-current={page === 'analyse' ? 'page' : undefined}>
          <Compass size={20} /> Analyse
        </Link>
        <Link href="/direction" aria-current={page === 'direction' ? 'page' : undefined}>
          <Palette size={20} /> Direction
        </Link>
      </nav>
    </div>
  );
}
