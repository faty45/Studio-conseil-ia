import { describe, expect, it } from 'vitest';
import { extraireEtapes, segmenter } from '@/lib/domain/extraction';
import { getPack } from '@/lib/packs';

describe('extraction d’étapes sans IA', () => {
  it('découpe sur les lignes, les puces et les marqueurs de séquence', () => {
    const segs = segmenter("D'abord on ouvre la boîte mail, puis on lit les newsletters.\n- Ensuite on trie par thème\n2. Enfin on envoie le bulletin");
    expect(segs).toEqual(['on ouvre la boîte mail', 'on lit les newsletters', 'on trie par thème', 'on envoie le bulletin']);
  });

  it('propose des étapes avec acteur et outil du vocabulaire du pack, en statut « proposé »', () => {
    const pack = getPack('boulangerie');
    const etapes = extraireEtapes(
      [
        { id: 'reponse:q4', texte: 'Le boulanger pétrit à 4h, puis il enfourne. La vendeuse note les commandes sur le cahier.' },
        { id: 'carte:1', texte: 'Le patron recopie les commandes dans le tableur le soir' },
      ],
      pack,
    );
    expect(etapes.length).toBe(4);
    expect(etapes.every((e) => e.statut === 'propose' && e.origine === 'extraction')).toBe(true);
    expect(etapes[0].acteur).toBe('Boulanger');
    expect(etapes[2].acteur).toBe('Vendeuse');
    expect(etapes[2].outil).toBe('Cahier');
    expect(etapes[3].sources).toEqual(['carte:1']);
    expect(etapes[3].outil).toBe('Tableur');
  });

  it('ne duplique pas une étape déjà vue et respecte le plafond', () => {
    const pack = getPack('general');
    const etapes = extraireEtapes([{ id: 'a', texte: 'on lit le mail. on lit le mail. on répond au client.' }], pack, 1);
    expect(etapes).toHaveLength(1);
  });

  it('ignore les fragments d’un seul mot', () => {
    expect(segmenter('Oui. Non. Vraiment pas simple.')).toEqual(['Vraiment pas simple']);
  });
});
