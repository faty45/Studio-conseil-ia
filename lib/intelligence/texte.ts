/** Utilitaires de texte partagés par les règles. Aucune IA : normalisation et recherche de termes. */

export function normaliser(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, "'");
}

export function contientTerme(texte: string, terme: string): boolean {
  return normaliser(texte).includes(normaliser(terme));
}

export function termesTrouves(texte: string, termes: string[]): string[] {
  const n = normaliser(texte);
  return termes.filter((t) => n.includes(normaliser(t)));
}

/** Extrait court autour d'un terme, pour citer la source d'une règle. */
export function extraitAutour(texte: string, terme: string, marge = 55): string {
  const idx = normaliser(texte).indexOf(normaliser(terme));
  if (idx < 0) return texte.length > 2 * marge ? texte.slice(0, 2 * marge).trim() + '…' : texte;
  const debut = Math.max(0, idx - marge);
  const fin = Math.min(texte.length, idx + terme.length + marge);
  return (debut > 0 ? '…' : '') + texte.slice(debut, fin).trim() + (fin < texte.length ? '…' : '');
}

/** Détecte des nombres dans un texte (pour signaler un chiffre sans source). */
export function contientNombre(texte: string): boolean {
  return /(^|[^a-z])\d+([.,]\d+)?\s?(%|€|h|min|minutes|heures|jours|par jour|par semaine|fois)?/i.test(texte);
}

export const ABSOLUS = ['toujours', 'jamais', 'tout le temps', 'à chaque fois', 'personne ne', 'tout le monde', 'systématiquement'];
