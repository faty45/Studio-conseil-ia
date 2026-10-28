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

  it('refuse un pack mal formé', () => {
    expect(() => PackSchema.parse({ id: 'Mauvais ID', version: '1', label: '', description: '' })).toThrow();
  });
});
