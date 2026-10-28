'use client';

import type { ReactNode } from 'react';

/** Mise en forme en ligne : gras, italique, code. Suffisant pour le diagnostic généré. */
function enLigne(texte: string, cle: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g;
  let dernier = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(texte))) {
    if (m.index > dernier) parts.push(texte.slice(dernier, m.index));
    const t = m[0];
    if (t.startsWith('**')) parts.push(<strong key={`${cle}-${i++}`}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith('_')) parts.push(<em key={`${cle}-${i++}`}>{t.slice(1, -1)}</em>);
    else parts.push(<code key={`${cle}-${i++}`}>{t.slice(1, -1)}</code>);
    dernier = m.index + t.length;
  }
  if (dernier < texte.length) parts.push(texte.slice(dernier));
  return parts;
}

/**
 * Rendu minimal du Markdown produit par `genererDiagnostic` : titres, paragraphes, listes, tableaux, citations.
 * Volontairement sans dépendance ; ne vise pas la compatibilité Markdown complète.
 */
export function Markdown({ source }: { source: string }) {
  const lignes = source.split('\n');
  const blocs: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < lignes.length) {
    const l = lignes[i];
    if (!l.trim()) {
      i++;
      continue;
    }
    const titre = /^(#{1,3})\s+(.*)$/.exec(l);
    if (titre) {
      const niveau = titre[1].length;
      const contenu = enLigne(titre[2], `t${k}`);
      blocs.push(niveau === 1 ? <h1 key={k++}>{contenu}</h1> : niveau === 2 ? <h2 key={k++}>{contenu}</h2> : <h3 key={k++}>{contenu}</h3>);
      i++;
      continue;
    }
    if (l.startsWith('|')) {
      const rangs: string[][] = [];
      while (i < lignes.length && lignes[i].startsWith('|')) {
        const cellules = lignes[i].slice(1, lignes[i].endsWith('|') ? -1 : undefined).split('|').map((c) => c.trim());
        if (!cellules.every((c) => /^-+$/.test(c))) rangs.push(cellules);
        i++;
      }
      const [tete, ...corps] = rangs;
      blocs.push(
        <table key={k++}>
          <thead>
            <tr>
              {tete.map((c, j) => (
                <th key={j}>{enLigne(c, `th${k}-${j}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {corps.map((r, ri) => (
              <tr key={ri}>
                {r.map((c, j) => (
                  <td key={j}>{enLigne(c, `td${k}-${ri}-${j}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      );
      continue;
    }
    if (l.startsWith('> ')) {
      const q: string[] = [];
      while (i < lignes.length && lignes[i].startsWith('> ')) q.push(lignes[i++].slice(2));
      blocs.push(
        <blockquote key={k++}>
          {q.map((t, j) => (
            <p key={j}>{enLigne(t, `q${k}-${j}`)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }
    if (/^- /.test(l)) {
      const items: string[] = [];
      while (i < lignes.length && /^- /.test(lignes[i])) items.push(lignes[i++].slice(2));
      blocs.push(
        <ul key={k++}>
          {items.map((t, j) => (
            <li key={j}>{enLigne(t, `ul${k}-${j}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\d+\. /.test(l)) {
      const items: string[] = [];
      while (i < lignes.length && /^\d+\. /.test(lignes[i])) items.push(lignes[i++].replace(/^\d+\. /, ''));
      blocs.push(
        <ol key={k++}>
          {items.map((t, j) => (
            <li key={j}>{enLigne(t, `ol${k}-${j}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    if (l.startsWith('---')) {
      blocs.push(<hr key={k++} />);
      i++;
      continue;
    }
    const para: string[] = [];
    while (i < lignes.length && lignes[i].trim() && !/^(#{1,3}\s|\||> |- |\d+\. |---)/.test(lignes[i])) para.push(lignes[i++].replace(/\s{2}$/, ''));
    blocs.push(<p key={k++}>{enLigne(para.join(' '), `p${k}`)}</p>);
  }
  return <>{blocs}</>;
}
