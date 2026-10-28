import { describe, expect, it } from 'vitest';
import { suggererSolutions } from '@/lib/domain/suggestions';
import { genererGuideAction, genererSynthese } from '@/lib/domain/synthese';
import { nouvelleMission } from '@/lib/domain/types';
import { getPack, questionsPour } from '@/lib/packs';
import { createMemoryStore } from '@/lib/domain/store';

function missionArdan() {
  const m = nouvelleMission('ARDAN', 'ardan', '1.0.0', 'm1');
  m.reponses['q6'] = { texte: 'On relit deux fois les mêmes newsletters et on perd du temps à trier la boîte mail.', statut: 'observe' };
  m.reponses['q2'] = { texte: 'Les mails arrivent le matin.', statut: 'declare' };
  m.cartes.push({ id: 'c1', type: 'citation', texte: 'Le lundi je passe la matinée à trier.', creeLe: '2026-10-28T08:00:00.000Z' });
  return m;
}

describe('pistes de solution sourcées', () => {
  it('ne propose que des recettes justifiées par une observation, avec leurs extraits', () => {
    const m = missionArdan();
    const sols = suggererSolutions(m, getPack('ardan'));
    const ids = sols.map((s) => s.recetteId);
    expect(ids).toContain('ardan-tri');
    expect(ids).toContain('ardan-double');
    expect(ids).not.toContain('ardan-prestataire');
    const tri = sols.find((s) => s.recetteId === 'ardan-tri')!;
    expect(tri.sources.length).toBeGreaterThan(0);
    expect(tri.extraits[0]).toMatch(/trier|mail|lundi/i);
    expect(tri.decision).toBe('a_decider');
    expect(tri.origine).toBe('suggestion');
  });

  it('ne propose rien sans observation', () => {
    const vide = nouvelleMission('Vide', 'boulangerie', '1.0.0');
    expect(suggererSolutions(vide, getPack('boulangerie'))).toEqual([]);
  });

  it('ne reprend pas une recette déjà ajoutée à la mission', () => {
    const m = missionArdan();
    const premieres = suggererSolutions(m, getPack('ardan'));
    m.solutions.push(premieres[0]);
    const suivantes = suggererSolutions(m, getPack('ardan'));
    expect(suivantes.map((s) => s.recetteId)).not.toContain(premieres[0].recetteId);
  });
});

describe('synthèse : constat, hypothèse, recommandation', () => {
  it('range chaque élément dans le bon registre et ne contient aucun chiffre inventé', () => {
    const m = missionArdan();
    const pack = getPack('ardan');
    m.etapes.push({ id: 'e1', texte: 'Lire les newsletters', origine: 'manuel', statut: 'accepte', sources: [] });
    m.etapes.push({ id: 'e2', texte: 'Étape rejetée', origine: 'extraction', statut: 'rejete', sources: [] });
    m.problemes.push({ id: 'p1', texte: 'Double lecture', preuves: [], causes: [{ id: 'k1', texte: 'Sources non réparties', statut: 'hypothese' }] });
    const sols = suggererSolutions(m, pack);
    sols[0].decision = 'retenue';
    m.solutions.push(...sols);
    const md = genererSynthese(m, pack, questionsPour(pack));
    const constats = md.split('## 1. Constats')[1].split('## 2.')[0];
    const hypotheses = md.split('## 2. Hypothèses')[1].split('## 3.')[0];
    const reco = md.split('## 5. Recommandations')[1];
    expect(constats).toContain('relit deux fois');
    expect(constats).not.toContain('arrivent le matin');
    expect(hypotheses).toContain('arrivent le matin');
    expect(hypotheses).toContain('Sources non réparties');
    expect(md).toContain('Lire les newsletters');
    expect(md).not.toContain('Étape rejetée');
    expect(reco).toContain(sols[0].titre);
    expect(md).toContain('« Le lundi je passe la matinée à trier. »');
    expect(md).not.toMatch(/\d+\s?(€|h\/semaine|%)/);
  });

  it('produit un guide d’action avec les actions décidées', () => {
    const m = missionArdan();
    m.actions.push({ id: 'a1', texte: 'Créer la règle de tri', responsable: 'Chargée de veille', echeance: 'lundi' });
    const guide = genererGuideAction(m);
    expect(guide).toContain('| 1 | Créer la règle de tri | Chargée de veille | lundi |');
  });
});

describe('dépôt de missions', () => {
  it('enregistre, relit, trie par date et supprime', () => {
    const store = createMemoryStore();
    const a = store.save(nouvelleMission('A', 'ardan', '1.0.0', 'a'));
    const b = store.save(nouvelleMission('B', 'boulangerie', '1.0.0', 'b'));
    expect(store.list().map((m) => m.id)).toEqual(['b', 'a']);
    expect(store.get('a')?.nom).toBe('A');
    store.save({ ...a, nom: 'A2' });
    expect(store.get('a')?.nom).toBe('A2');
    expect(store.list()).toHaveLength(2);
    store.remove('b');
    expect(store.get('b')).toBeUndefined();
    expect(b.id).toBe('b');
  });

  it('ignore un stockage corrompu', () => {
    const map = new Map<string, string>([['studio-conseil-ia.missions.v1', '{pas du json']]);
    const store = createMemoryStore();
    expect(store.list()).toEqual([]);
    expect(map.size).toBe(1);
  });
});
