'use client';

import type { ReactNode } from 'react';
import type { Niveau } from '../lib/domain/types';

export function Badge({ children, ton = '', title }: { children: ReactNode; ton?: '' | 'accent' | 'sauge' | 'rouge' | 'or' | 'bleu' | 'encre' | 'contour'; title?: string }) {
  return (
    <span className={`badge ${ton}`} title={title}>
      {children}
    </span>
  );
}

export function Carte({ children, titre, sousTitre, actions, className = '', id, nom }: { children: ReactNode; titre?: ReactNode; sousTitre?: ReactNode; actions?: ReactNode; className?: string; id?: string; /** Nom accessible quand le titre n'est pas un simple texte. */ nom?: string }) {
  return (
    <section className={`carte ${className}`} id={id} aria-label={nom ?? (typeof titre === 'string' ? titre : undefined)}>
      {(titre || actions) && (
        <div className="carte-tete">
          <div>
            {titre && <h2>{titre}</h2>}
            {sousTitre && <p>{sousTitre}</p>}
          </div>
          {actions && <div className="actions">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Metrique({ valeur, libelle, ton }: { valeur: ReactNode; libelle: string; ton?: 'sauge' | 'accent' | 'rouge' }) {
  return (
    <div className="metrique">
      <div className="libelle">{libelle}</div>
      <div className="valeur" style={ton ? { color: `var(--${ton})` } : undefined}>
        {valeur}
      </div>
    </div>
  );
}

export function Progression({ valeur, label }: { valeur: number; label?: string }) {
  return (
    <div className="progression" role="progressbar" aria-valuenow={valeur} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${Math.max(0, Math.min(100, valeur))}%` }} />
    </div>
  );
}

export function Champ({ label, children, aide }: { label: string; children: ReactNode; aide?: string }) {
  return (
    <label className="champ">
      <span>{label}</span>
      {children}
      {aide && <small className="doux petit">{aide}</small>}
    </label>
  );
}

export function Encart({ children, ton = '' }: { children: ReactNode; ton?: '' | 'info' | 'ok' | 'alerte' }) {
  return <div className={`encart ${ton}`}>{children}</div>;
}

export function Vide({ titre, texte, action }: { titre: string; texte: string; action?: ReactNode }) {
  return (
    <div className="item" style={{ textAlign: 'center', padding: '1.5rem' }}>
      <h3>{titre}</h3>
      <p className="doux">{texte}</p>
      {action}
    </div>
  );
}

export function SelecteurNiveau({ valeur, onChange, libelles, label }: { valeur: Niveau; onChange: (n: Niveau) => void; libelles: Record<Niveau, string>; label: string }) {
  return (
    <div className="puce-niveau" role="group" aria-label={label}>
      {([1, 2, 3] as Niveau[]).map((n) => (
        <button key={n} type="button" aria-pressed={valeur === n} title={libelles[n]} aria-label={`${label} : ${libelles[n]}`} onClick={() => onChange(n)}>
          {n}
        </button>
      ))}
    </div>
  );
}

export function tonPriorite(p: string): 'sauge' | 'bleu' | 'accent' | 'or' | '' {
  switch (p) {
    case 'quick_win':
      return 'sauge';
    case 'a_planifier':
      return 'bleu';
    case 'a_construire':
      return 'accent';
    case 'specialiste':
      return 'or';
    default:
      return '';
  }
}

export function tonDecision(d: string): 'sauge' | 'rouge' | 'or' | 'contour' {
  switch (d) {
    case 'retenue':
      return 'sauge';
    case 'ecartee':
      return 'rouge';
    case 'plus_tard':
      return 'or';
    default:
      return 'contour';
  }
}

export function heureCourte(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function dateCourte(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('fr-FR');
}

export function telecharger(nom: string, contenu: string, type = 'text/markdown;charset=utf-8') {
  const blob = new Blob([contenu], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nom;
  a.click();
  URL.revokeObjectURL(url);
}

export function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'document'
  );
}
