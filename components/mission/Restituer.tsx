'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Download, Printer } from 'lucide-react';
import type { PropsPhase } from './MissionShell';
import { CarteProcessus } from './CarteProcessus';
import { Markdown } from './Markdown';
import { Badge, Carte, Encart, Metrique, dateCourte, slug, telecharger } from '../ui';
import { genererDiagnostic } from '../../lib/domain/diagnostic';

export function Restituer({ mission, client, pack, maj }: PropsPhase) {
  const markdown = useMemo(() => genererDiagnostic(mission, client, pack), [mission, client, pack]);
  const [vue, setVue] = useState<'document' | 'cartes'>('document');
  const retenues = mission.solutions.filter((s) => s.decision === 'retenue');
  const quickWins = retenues.filter((s) => s.priorite === 'quick_win');
  const cible = mission.etapes.filter((e) => e.version === 'cible' && e.statut === 'accepte');
  const aCible = cible.length > 0;
  const resumeCible = `${cible.length} étape(s) : ${cible.filter((e) => e.changement === 'nouvelle').length} nouvelle(s), ${cible.filter((e) => e.changement === 'modifiee').length} modifiée(s), ${cible.filter((e) => !e.changement || e.changement === 'inchangee').length} inchangée(s). Vert : nouvelle ; bleu : modifiée.`;
  const manques = [
    !mission.objectif.trim() && 'l’objectif de la mission',
    mission.problemes.length === 0 && 'au moins un problème formalisé',
    retenues.length === 0 && 'au moins une recommandation retenue',
    mission.actions.length === 0 && 'un plan d’action',
    !aCible && 'une carte cible',
    mission.problemes.some((p) => p.gravite >= 2 && p.preuves.length === 0) && 'des preuves pour les problèmes coûteux ou bloquants',
  ].filter(Boolean) as string[];

  return (
    <>
      <div className="grille trois pas-imprime" style={{ marginBottom: '1rem' }}>
        <Metrique valeur={mission.problemes.length} libelle="Problèmes formalisés" />
        <Metrique valeur={retenues.length} libelle={`Recommandations retenues, dont ${quickWins.length} quick win(s)`} ton="sauge" />
        <Metrique valeur={mission.actions.length} libelle="Actions planifiées" ton="accent" />
      </div>

      <div className="ligne espace pas-imprime" style={{ marginBottom: '1rem' }}>
        <div className="ligne">
          <button type="button" className={`bouton petit${vue === 'document' ? ' primaire' : ''}`} onClick={() => setVue('document')} aria-pressed={vue === 'document'}>
            Diagnostic
          </button>
          <button type="button" className={`bouton petit${vue === 'cartes' ? ' primaire' : ''}`} onClick={() => setVue('cartes')} aria-pressed={vue === 'cartes'}>
            Cartes aujourd’hui / cible
          </button>
        </div>
        <div className="ligne">
          <button type="button" className="bouton" onClick={() => telecharger(`diagnostic-${slug(client.nom)}-${slug(mission.titre)}.md`, markdown)}>
            <Download size={16} /> Télécharger (.md)
          </button>
          <button type="button" className="bouton" onClick={() => window.print()}>
            <Printer size={16} /> Imprimer / PDF
          </button>
        </div>
      </div>

      {manques.length > 0 && (
        <Encart ton="alerte">
          <strong>Avant de restituer, il manque :</strong> {manques.join(', ')}. Le document se génère quand même, avec des mentions « à compléter ».
        </Encart>
      )}

      {vue === 'cartes' && (
        <div className="grille deux">
          <Carte titre="Aujourd’hui" sousTitre="Processus tel qu’il a été décrit et accepté en atelier.">
            <CarteProcessus etapes={mission.etapes} version="actuel" problemes={mission.problemes} compact titre="Carte du processus actuel" />
          </Carte>
          <Carte titre="Cible proposée" sousTitre={aCible ? resumeCible : 'À construire dans l’atelier, onglet Cible.'}>
            <CarteProcessus etapes={mission.etapes} version="cible" compact titre="Carte du processus cible" />
          </Carte>
        </div>
      )}

      {vue === 'document' && (
        <article className="diagnostic" aria-label="Diagnostic">
          <div className="ligne espace pas-imprime" style={{ marginBottom: '1rem' }}>
            <Badge ton="contour">Généré depuis les données de la mission</Badge>
            {mission.syntheseValideeLe ? <Badge ton="sauge">Validé avec le client le {dateCourte(mission.syntheseValideeLe)}</Badge> : <Badge ton="or">Non encore validé</Badge>}
          </div>
          <Markdown source={markdown} />
          {aCible && (
            <>
              <h2>Cartes du processus</h2>
              <h3>Aujourd’hui</h3>
              <CarteProcessus etapes={mission.etapes} version="actuel" problemes={mission.problemes} compact titre="Carte du processus actuel" />
              <h3>Cible</h3>
              <CarteProcessus etapes={mission.etapes} version="cible" compact titre="Carte du processus cible" />
            </>
          )}
          <div className="colophon">
            Document produit avec Studio Conseil IA. Les rapprochements et priorisations sont issus de règles explicites, confirmés par la consultante ; aucune estimation chiffrée n’est produite par l’outil. Les rôles remplacent
            les noms.{client.fictif ? ' Données fictives de démonstration.' : ''}
          </div>
        </article>
      )}

      <Carte titre="Validation avec le client" sousTitre="La synthèse est relue ensemble en fin de restitution. Elle devient le point de départ du suivi." className="pas-imprime">
        <label className="ligne" style={{ gap: '0.6rem' }}>
          <input type="checkbox" checked={!!mission.syntheseValideeLe} onChange={(e) => maj((m) => ({ ...m, syntheseValideeLe: e.target.checked ? new Date().toISOString() : undefined, decisions: e.target.checked ? [...m.decisions, { id: crypto.randomUUID(), date: new Date().toISOString(), texte: 'Synthèse de restitution validée', qui: 'Client et consultante' }] : m.decisions }))} />
          <span>
            <CheckCircle2 size={16} style={{ verticalAlign: 'text-bottom' }} /> Synthèse relue et validée avec le client
            {mission.syntheseValideeLe && <span className="doux"> — le {dateCourte(mission.syntheseValideeLe)}</span>}
          </span>
        </label>
      </Carte>

      <div className="actions droite pas-imprime" style={{ marginTop: '1.25rem' }}>
        <Link href={`/mission/${mission.id}/suivre`} className="bouton primaire" onClick={() => maj((m) => (m.phase !== 'suivre' ? { ...m, phase: 'suivre' } : m))}>
          Passer au suivi <ArrowRight size={18} />
        </Link>
      </div>
    </>
  );
}
