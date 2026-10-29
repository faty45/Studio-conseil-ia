'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { BookOpen, Building2, Compass, FolderKanban, Home, MessagesSquare, Palette as PaletteIcon, Search } from 'lucide-react';
import { useStudio } from './StudioContext';
import { Palette } from './Palette';
import { PHASES } from '../../lib/domain/types';

function Nav({ ouvrirPalette }: { ouvrirPalette: () => void }) {
  const pathname = usePathname();
  const { clients, missions } = useStudio();
  const actif = (href: string, exact = false) => (exact ? pathname === href : pathname.startsWith(href)) || undefined;
  return (
    <aside className="hx-nav" aria-label="Navigation">
      <button type="button" className="hx-espace" onClick={ouvrirPalette} title="Changer d’espace (simulé)">
        <span className="hx-logo" aria-hidden>
          S
        </span>
        <span>
          <strong>Studio Conseil IA</strong>
          <span className="hx-mini" style={{ display: 'block' }}>
            Espace de la consultante
          </span>
        </span>
      </button>
      <button type="button" className="hx-recherche" onClick={ouvrirPalette}>
        <Search size={14} /> Rechercher, aller à… <kbd>⌘K</kbd>
      </button>
      <nav aria-label="Principal">
        <Link href="/studio" className="hx-lien" aria-current={actif('/studio', true) ? 'page' : undefined}>
          <Home size={15} /> Cockpit
        </Link>
        <Link href="/studio/atelier" className="hx-lien" aria-current={actif('/studio/atelier') ? 'page' : undefined}>
          <MessagesSquare size={15} /> Atelier
          <span className="hx-compte">canvas</span>
        </Link>
        <Link href="/studio/analyse" className="hx-lien" aria-current={actif('/studio/analyse') ? 'page' : undefined}>
          <Compass size={15} /> Analyse
        </Link>
        <span className="hx-lien" style={{ opacity: 0.5 }}>
          <BookOpen size={15} /> Bibliothèque
          <span className="hx-compte">25</span>
        </span>
      </nav>
      <nav aria-label="Clients">
        <div className="hx-section">
          <span>Clients</span>
          <span>{clients.length}</span>
        </div>
        {clients.map((c) => (
          <Link key={c.id} href={`/studio/client/${c.id}`} className="hx-lien" aria-current={actif(`/studio/client/${c.id}`) ? 'page' : undefined}>
            <Building2 size={15} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nom.replace(' (exemple fictif)', '')}</span>
            <span className="hx-compte">{missions.filter((m) => m.clientId === c.id).length}</span>
          </Link>
        ))}
      </nav>
      <nav aria-label="Missions par phase">
        <div className="hx-section">
          <span>Missions</span>
          <span>{missions.length}</span>
        </div>
        {PHASES.map((p) => {
          const n = missions.filter((m) => m.phase === p.id).length;
          return (
            <Link key={p.id} href="/studio" className="hx-lien" style={n ? undefined : { opacity: 0.45 }}>
              <FolderKanban size={15} /> {p.label}
              <span className="hx-compte">{n}</span>
            </Link>
          );
        })}
      </nav>
      <nav aria-label="Références">
        <div className="hx-section">
          <span>Références</span>
        </div>
        <Link href="/direction" className="hx-lien">
          <PaletteIcon size={15} /> Direction « dossier »
        </Link>
      </nav>
      <div className="hx-pied">Prototype interactif. Données fictives, enregistrées dans ce navigateur seulement. Les suggestions marquées en cuivre viennent de règles, pas d’une IA.</div>
    </aside>
  );
}

function Raccourcis({ ouvrirPalette }: { ouvrirPalette: () => void }) {
  const router = useRouter();
  useEffect(() => {
    let attente = false;
    let minuterie = 0;
    const sur = (e: KeyboardEvent) => {
      const cible = e.target as HTMLElement | null;
      const dansChamp = cible && (cible.tagName === 'INPUT' || cible.tagName === 'TEXTAREA' || cible.tagName === 'SELECT' || cible.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        ouvrirPalette();
        return;
      }
      if (dansChamp) return;
      if (attente) {
        attente = false;
        window.clearTimeout(minuterie);
        const k = e.key.toLowerCase();
        if (k === 'c') router.push('/studio');
        if (k === 'a') router.push('/studio/atelier');
        if (k === 'n') router.push('/studio/analyse');
        return;
      }
      if (e.key.toLowerCase() === 'g') {
        attente = true;
        minuterie = window.setTimeout(() => (attente = false), 900);
      }
    };
    window.addEventListener('keydown', sur);
    return () => window.removeEventListener('keydown', sur);
  }, [ouvrirPalette, router]);
  return null;
}

function Interieur({ children, fil, actions, serre }: { children: ReactNode; fil: ReactNode; actions?: ReactNode; serre?: boolean }) {
  const pathname = usePathname();
  const [palette, setPalette] = useState(false);
  const { sauvegarde, pret } = useStudio();
  const ouvrir = () => setPalette(true);
  return (
    <div className="hx-coque">
      <Nav ouvrirPalette={ouvrir} />
      <Raccourcis ouvrirPalette={ouvrir} />
      <div className="hx-principal">
        <header className="hx-barre">
          <div className="hx-fil">{fil}</div>
          <div className="hx-droite">
            <span className="hx-sauvegarde hx-cache-mobile" title="Les modifications sont conservées dans ce navigateur">
              <span className="hx-point" style={sauvegarde === 'erreur' ? { background: 'var(--hx-rouge)' } : sauvegarde === 'en-cours' ? { background: 'var(--hx-ambre)' } : undefined} />
              {sauvegarde === 'erreur' ? 'Enregistrement impossible' : sauvegarde === 'en-cours' ? 'Enregistrement…' : 'Enregistré localement'}
            </span>
            {actions}
          </div>
        </header>
        <main className={`hx-contenu${serre ? ' serre' : ''}`}>{pret ? children : <div className="hx-vide">Chargement de l’espace…</div>}</main>
      </div>
      <Palette ouverte={palette} fermer={() => setPalette(false)} />
      <nav className="hx-nav-mobile" aria-label="Navigation mobile">
        <Link href="/studio" aria-current={pathname === '/studio' ? 'page' : undefined}>
          <Home size={20} /> Cockpit
        </Link>
        <Link href="/studio/atelier" aria-current={pathname.startsWith('/studio/atelier') ? 'page' : undefined}>
          <MessagesSquare size={20} /> Atelier
        </Link>
        <Link href="/studio/analyse" aria-current={pathname.startsWith('/studio/analyse') ? 'page' : undefined}>
          <Compass size={20} /> Analyse
        </Link>
        <button type="button" onClick={ouvrir} style={{ flex: '1 1 0', minHeight: 48, border: 0, background: 'transparent', color: 'var(--hx-texte-3)', fontSize: '10.5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Search size={20} /> Chercher
        </button>
      </nav>
    </div>
  );
}

/** Coquille « Studio » : navigation latérale claire, barre de contexte, palette ⌘K, raccourcis G+C / G+A / G+N. */
export function Coque(props: { children: ReactNode; fil: ReactNode; actions?: ReactNode; serre?: boolean }) {
  return <Interieur {...props} />;
}
