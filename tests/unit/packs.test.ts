import { describe, expect, it } from 'vitest';
import { PackSchema, coreQuestions, getPack, packs, questionsPour } from '@/lib/packs';

describe('packs métier en configuration', () => {
  it('valide les trois packs livrés et les huit questions cœur', () => {
    expect(coreQuestions.questions).toHaveLength(8);
    expect(packs.map((p) => p.id)).toEqual(['ardan', 'boulangerie', 'general']);
    for (const p of packs) expect(p.recettes.length).toBeGreaterThan(0);
  });

  it('compose les questions cœur puis celles du pack', () => {
    const q = questionsPour(getPack('boulangerie'));
    expect(q).toHaveLength(12);
    expect(q[0].id).toBe('q1');
    expect(q[8].id).toBe('boul-1');
  });

  it('retombe sur le pack général si l’identifiant est inconnu', () => {
    expect(getPack('inconnu').id).toBe('general');
  });

  it('accepte un nouveau pack ajouté par configuration, sans toucher au composant', () => {
    const nouveau = PackSchema.parse({
      id: 'poissonnerie',
      version: '0.1.0',
      label: 'Poissonnerie',
      description: 'Test de configuration',
      questions: [{ id: 'poi-1', texte: 'Comment arrivent les arrivages ?' }],
      recettes: [
        { id: 'poi-r1', titre: 'Fiche d’arrivage', categorie: 'simplification', detail: 'Une feuille par arrivage.', motsCles: ['arrivage'] },
      ],
    });
    expect(nouveau.vocabulaire.acteurs).toEqual([]);
    expect(nouveau.recettes[0].hypotheses).toEqual([]);
  });

  it('refuse un pack mal formé', () => {
    expect(() => PackSchema.parse({ id: 'Mauvais ID', version: '1', label: '', description: '' })).toThrow();
  });
});
