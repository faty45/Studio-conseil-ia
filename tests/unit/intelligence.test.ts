import { describe, expect, it } from 'vitest';
import { bibliotheque, patron, patronsPourProbleme } from '@/lib/bibliotheque';
import { classer } from '@/lib/intelligence/classification';
import { correspondances, proposerSolutions } from '@/lib/intelligence/correspondances';
import { prioriser } from '@/lib/intelligence/priorisation';
import { suggerer } from '@/lib/intelligence/copilote';
import { couloirs, diffProcessus, extraireEtapes, initialiserCible, segmenter } from '@/lib/intelligence/processus';
import { getPack, questionsPour, PackSchema } from '@/lib/packs';
import { CLIENT_BOULANGERIE, DEMO, MISSION_ARDAN, MISSION_BOULANGERIE } from '@/lib/domain/demo';
import { genererDiagnostic } from '@/lib/domain/diagnostic';
import { avancement, nouveauClient, nouvelleMission } from '@/lib/domain/types';
import { createDepotMemoire } from '@/lib/domain/store';

describe('bibliothèque intermétiers', () => {
  it('est valide et cohérente : chaque patron renvoie à des problèmes universels et des processus existants', () => {
    const universels = new Set(bibliotheque.problemesUniversels.map((u) => u.id));
    const processus = new Set(bibliotheque.processus.map((p) => p.id));
    expect(bibliotheque.patrons.length).toBeGreaterThanOrEqual(20);
    for (const p of bibliotheque.patrons) {
      for (const u of p.problemesUniversels) expect(universels.has(u), `${p.id} → ${u}`).toBe(true);
      for (const x of p.processusIds) expect(processus.has(x), `${p.id} → ${x}`).toBe(true);
      if (p.necessiteIA) expect(p.alternativeSansIA, `${p.id} doit avoir une alternative sans IA`).toBeTruthy();
    }
    expect(patronsPourProbleme('rebut-gaspillage').length).toBeGreaterThanOrEqual(3);
  });

  it('les packs référencent des processus de la bibliothèque', () => {
    const processus = new Set(bibliotheque.processus.map((p) => p.id));
    for (const id of ['ardan', 'boulangerie', 'general']) for (const x of getPack(id).processusIds) expect(processus.has(x)).toBe(true);
    expect(getPack('ardan').hypothesesTypiques.length).toBeGreaterThan(2);
    const nouveau = PackSchema.parse({ id: 'poissonnerie', version: '0.1.0', label: 'Poissonnerie', description: 'Test', questions: [], recettes: [] });
    expect(nouveau.processusIds).toEqual([]);
  });
});

describe('classification par règles', () => {
  it('reconnaît un problème universel à partir de ses signaux et explique pourquoi', () => {
    const c = classer('Le lundi on jette un tiers des baguettes et les invendus partent à la poubelle', ['production']);
    expect(c[0].universel.id).toBe('rebut-gaspillage');
    expect(c[0].signaux).toContain('jette');
    expect(c[0].explication[0]).toMatch(/Mots repérés/);
    expect(c[0].explication.some((x) => x.includes('Processus cohérent'))).toBe(true);
  });
  it('ne classe rien sans signal', () => {
    expect(classer('Tout va bien dans la boutique')).toEqual([]);
  });
});

describe('priorisation expliquée', () => {
  it('classe quick win une solution à effort faible et impact réel, et spécialiste un prestataire', () => {
    const base = { faisabilite: { effort: 'faible' as const, coutMensuel: 'nul' as const, dependances: [], risques: [], prerequis: [], outilDejaPresent: true }, gravites: [2 as const], frequences: [3 as const], necessiteIA: false, iaConfiguree: false };
    const qw = prioriser({ ...base, categorie: 'outil_existant' });
    expect(qw.priorite).toBe('quick_win');
    expect(qw.explication.join(' ')).toMatch(/déjà présent/);
    const sp = prioriser({ ...base, categorie: 'prestataire', faisabilite: { ...base.faisabilite, effort: 'fort', coutMensuel: 'moyen', outilDejaPresent: false } });
    expect(sp.priorite).toBe('specialiste');
    const ia = prioriser({ ...base, categorie: 'automatisation', necessiteIA: true });
    expect(ia.priorite).toBe('a_construire');
    expect(ia.explication.join(' ')).toMatch(/mode dégradé/);
  });
});

describe('correspondances problème → patron', () => {
  it('propose des patrons explicables, compatibles avec les outils du client, et aucun sans problème universel', () => {
    const pack = getPack('boulangerie');
    const cs = correspondances(MISSION_BOULANGERIE, CLIENT_BOULANGERIE, pack);
    expect(cs.length).toBeGreaterThan(5);
    const caisse = cs.find((c) => c.patron.id === 'lecture-export-caisse')!;
    expect(caisse.outilDejaPresent).toBe(true);
    expect(caisse.explication.join(' ')).toMatch(/Compatible avec ce que le client a déjà/);
    expect(cs.every((c) => c.problemes.length > 0)).toBe(true);
    const vide = { ...MISSION_BOULANGERIE, problemes: [] };
    expect(correspondances(vide, CLIENT_BOULANGERIE, pack)).toEqual([]);
  });
  it('ne repropose pas un patron déjà dans la mission', () => {
    const nouvelles = proposerSolutions(MISSION_BOULANGERIE, CLIENT_BOULANGERIE, getPack('boulangerie'));
    const deja = new Set(MISSION_BOULANGERIE.solutions.map((s) => s.patronId));
    expect(nouvelles.every((s) => !deja.has(s.patronId))).toBe(true);
    for (const s of nouvelles) expect(s.explication.length).toBeGreaterThan(2);
  });
});

describe('copilote par règles', () => {
  it('signale un absolu, un chiffre sans source, un problème sans cause, une question non couverte', () => {
    const pack = getPack('ardan');
    const m = nouvelleMission('c', 'Test', 'ardan', pack.version, ['q1', 'q4', 'q6', 'q8']);
    m.journal.push(
      { id: 'a', type: 'citation', texte: 'On relit toujours deux fois les newsletters.', horodatage: '2026-10-28T09:00:00Z', auteur: 'client' },
      { id: 'b', type: 'note', texte: 'Environ 40 newsletters par jour.', horodatage: '2026-10-28T09:01:00Z', auteur: 'consultante' },
      { id: 'c', type: 'note', texte: 'Le bulletin part le vendredi.', horodatage: '2026-10-28T09:02:00Z', auteur: 'consultante' },
    );
    m.problemes.push({ id: 'p', texte: 'Double lecture', etapeIds: [], gravite: 2, frequence: 3, preuves: [], causes: [] });
    const s = suggerer(m, pack, questionsPour(pack), pack.processusIds);
    const types = s.map((x) => x.type);
    expect(types).toContain('contradiction');
    expect(types).toContain('a_verifier');
    expect(types).toContain('question');
    expect(types).toContain('manque');
    expect(s.filter((x) => x.type === 'signal').map((x) => x.titre)).toContain('Même travail fait par deux personnes');
    for (const x of s) expect(x.regle.length).toBeGreaterThan(5);
  });
});

describe('processus : extraction, couloirs, cible et différence', () => {
  it('découpe et attribue acteur et outil', () => {
    expect(segmenter("D'abord on ouvre la boîte mail, puis on lit les newsletters.\n- Ensuite on trie")).toEqual(['on ouvre la boîte mail', 'on lit les newsletters', 'on trie']);
    const e = extraireEtapes([{ id: 'r', texte: 'Le boulanger pétrit à 4h, puis il enfourne. La vendeuse note les commandes sur le cahier.' }], getPack('boulangerie'));
    expect(e).toHaveLength(3);
    expect(e[0].acteur).toBe('Boulanger');
    expect(e[2].outil).toBe('Cahier');
    expect(e.every((x) => x.statut === 'propose' && x.version === 'actuel')).toBe(true);
  });
  it('calcule les couloirs et la différence actuel / cible de la démo ARDAN', () => {
    expect(couloirs(MISSION_ARDAN.etapes, 'actuel')).toEqual(['Chargée de veille A', 'Chargée de veille B', 'Responsable du dispositif']);
    const d = diffProcessus(MISSION_ARDAN.etapes);
    expect(d.ajoutees.length).toBeGreaterThanOrEqual(2);
    expect(d.retirees.length).toBeGreaterThanOrEqual(2);
    const sansCible = MISSION_BOULANGERIE.etapes;
    const avecCible = initialiserCible(sansCible);
    expect(avecCible.filter((x) => x.version === 'cible')).toHaveLength(sansCible.filter((x) => x.version === 'actuel').length);
  });
});

describe('données de démonstration et diagnostic', () => {
  it('les missions de démo sont cohérentes (références internes valides) et marquées fictives', () => {
    for (const m of DEMO.missions) {
      expect(m.fictif).toBe(true);
      const etapes = new Set(m.etapes.map((e) => e.id));
      const problemes = new Set(m.problemes.map((p) => p.id));
      for (const p of m.problemes) for (const id of p.etapeIds) expect(etapes.has(id), `${m.id} ${p.id} → ${id}`).toBe(true);
      for (const s of m.solutions) {
        for (const id of s.problemeIds) expect(problemes.has(id)).toBe(true);
        expect(patron(s.patronId!)).toBeTruthy();
      }
      const questions = new Set(questionsPour(getPack(m.packId)).map((q) => q.id));
      for (const q of m.trame) expect(questions.has(q)).toBe(true);
      const av = avancement(m);
      expect(av.preparer).toBe(100);
    }
  });
  it('le diagnostic range chaque chose à sa place et ne fabrique aucun chiffre', () => {
    const md = genererDiagnostic(MISSION_ARDAN, DEMO.clients[0], getPack('ardan'));
    expect(md).toContain('# Diagnostic — ARDAN (exemple fictif)');
    expect(md).toContain('Données fictives');
    const constats = md.split('## 5. Constats')[1].split('## 6.')[0];
    expect(constats).toContain('### Observé ou vérifié');
    expect(constats).toContain('### Déclaré, à vérifier');
    expect(constats).toContain('trois formats différents');
    expect(md.split('## 8. Recommandations')[1]).toContain('Trier automatiquement');
    expect(md).toContain('| Temps de tri par personne et par jour (minutes) | 75 | 30 |');
    expect(md).not.toMatch(/économie estimée|\bROI\b/);
  });
  it('le dépôt enregistre clients et missions et supprime en cascade', () => {
    const d = createDepotMemoire();
    const c = d.enregistrerClient(nouveauClient('Test', 'Secteur', '1-9', 'c1'));
    d.enregistrerMission(nouvelleMission(c.id, 'M1', 'general', '1.0.0', ['q1'], 'm1'));
    expect(d.missions()).toHaveLength(1);
    d.supprimerClient('c1');
    expect(d.missions()).toHaveLength(0);
    expect(d.clients()).toHaveLength(0);
  });
});
