import { ArrowRight, GitBranch, Mic, Sparkles } from 'lucide-react';
import { Coque } from '../../../components/direction/Coque';
import { Pastille, Propose, Stepper } from '../../../components/direction/Elements';
import { CarteProcessusDV } from '../../../components/direction/CarteProcessusDV';
import { CLIENT_ARDAN, MISSION_ARDAN } from '../../../lib/domain/demo';
import { LIBELLES_STATUT_FAIT, LIBELLES_TYPE_ENTREE, avancement } from '../../../lib/domain/types';
import { getPack, questionsPour } from '../../../lib/packs';
import { LIBELLES_SUGGESTION, suggerer } from '../../../lib/intelligence/copilote';

const heure = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });

export default function AtelierDirection() {
  const m = MISSION_ARDAN;
  const c = CLIENT_ARDAN;
  const pack = getPack(m.packId);
  const questions = questionsPour(pack).filter((q) => m.trame.includes(q.id));
  const av = avancement(m);
  const suggestions = suggerer(m, pack, questionsPour(pack), pack.processusIds).slice(0, 4);
  const etapeSelection = 'e2';

  const panneau = (
    <>
      <section>
        <div className="dv-ligne espace" style={{ marginBottom: 10 }}>
          <div className="t-sur cuivre">Copilote</div>
          <Propose />
        </div>
        <p className="t-petit" style={{ marginBottom: 12 }}>
          Relit ce qui est saisi et propose discrètement. Chaque suggestion dit quelle règle l’a produite.
        </p>
        {suggestions.map((s) => (
          <article key={s.id} className="dv-suggestion">
            <Pastille ton={s.type === 'signal' ? 'cuivre' : s.type === 'contradiction' ? 'garance' : s.type === 'a_verifier' ? 'cobalt' : 'contour'} point={false}>
              {LIBELLES_SUGGESTION[s.type]}
            </Pastille>
            <div className="titre">{s.titre}</div>
            <div className="detail">{s.detail.length > 180 ? s.detail.slice(0, 179) + '…' : s.detail}</div>
            <div className="regle">Règle : {s.regle}</div>
            <div className="dv-actions">
              <span className="dv-btn petit cuivre">{s.type === 'signal' ? 'Créer le problème' : s.type === 'manque' ? 'Ouvrir la question' : 'Noter la question'}</span>
              <span className="dv-btn petit fantome">Ignorer</span>
            </div>
          </article>
        ))}
      </section>
      <section>
        <div className="t-sur" style={{ marginBottom: 10 }}>
          Faits et points à vérifier
        </div>
        <ul style={{ display: 'grid', gap: 10 }}>
          {m.faits.map((f) => (
            <li key={f.id} style={{ fontSize: 'var(--dv-t-14)' }}>
              <div className="dv-ligne" style={{ marginBottom: 2 }}>
                <Pastille ton={f.statut === 'verifie' ? 'sauge' : f.statut === 'observe' ? 'cobalt' : 'ocre'} point={false}>
                  {LIBELLES_STATUT_FAIT[f.statut]}
                </Pastille>
                <span className="t-mini">{f.source}</span>
              </div>
              {f.texte}
            </li>
          ))}
        </ul>
      </section>
    </>
  );

  return (
    <Coque page="atelier" panneau={panneau} mission={{ client: c.nom.replace(' (exemple fictif)', ''), titre: m.titre, phase: 'atelier', avancement: av }}>
      <header className="dv-entete">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="fil">
            <span className="t-sur">Atelier</span>
            <span className="t-sur" style={{ opacity: 0.5 }}>
              ·
            </span>
            <span className="t-sur">{c.nom.replace(' (exemple fictif)', '')}</span>
            <Pastille ton="ocre" point={false}>
              Fictif
            </Pastille>
          </div>
          <h1 className="t-affiche">{m.titre}</h1>
          <div className="meta">
            <span>Atelier du 27 octobre 2026 · 09 h 12 → 10 h 15</span>
            <span>Participants : chargées de veille A et B, responsable du dispositif</span>
            <span>Observation déclarative et consentie</span>
          </div>
          <div style={{ marginTop: 20, maxWidth: 720 }}>
            <Stepper avancement={av} courante="atelier" />
          </div>
        </div>
        <div className="dv-actions">
          <span className="dv-btn">
            <Mic size={16} /> Noter
          </span>
          <span className="dv-btn primaire">
            Passer à l’analyse <ArrowRight size={16} />
          </span>
        </div>
      </header>

      <section className="dv-section" aria-label="Trame">
        <div className="dv-ligne espace" style={{ marginBottom: 10 }}>
          <span className="t-sur">Trame · 12 questions, 12 couvertes</span>
          <span className="t-mini">Un fil, pas un questionnaire : les réponses se rattachent au fil de la conversation.</span>
        </div>
        <div className="dv-trame">
          {questions.map((q, i) => {
            const r = m.reponses[q.id];
            return (
              <span key={q.id} className={q.id === 'q6' ? 'courante' : r?.texte ? 'fait' : ''} title={q.texte}>
                <b>Q{i + 1}</b> {q.texte.length > 30 ? q.texte.slice(0, 29) + '…' : q.texte}
              </span>
            );
          })}
        </div>
      </section>

        <section className="dv-section" aria-label="Carte du processus">
          <div className="tete">
            <div>
              <h2 className="t-section">
                <GitBranch size={18} style={{ verticalAlign: '-3px', marginRight: 8 }} />
                Carte du processus · aujourd’hui
              </h2>
              <p>Acteurs en couloirs, étapes dans l’ordre. Les pastilles rouges comptent les problèmes rattachés à chaque étape.</p>
            </div>
            <div className="dv-ligne">
              <span className="dv-btn petit primaire">Aujourd’hui</span>
              <span className="dv-btn petit">Cible · 6 étapes</span>
              <span className="dv-btn petit cuivre">
                <Sparkles size={14} /> Extraire des notes
              </span>
            </div>
          </div>
          <CarteProcessusDV etapes={m.etapes} version="actuel" problemes={m.problemes} selection={etapeSelection} titre="Carte du processus actuel (ARDAN, fictif)" />
          <div className="dv-legende">
            <span>
              <i /> Étape acceptée
            </span>
            <span>
              <i className="propose" /> Proposée par règles, à accepter
            </span>
            <span>
              <i className="douleur" /> Problèmes rattachés
            </span>
            <span>
              <i className="nouvelle" /> Nouvelle (cible)
            </span>
            <span>
              <i className="modifiee" /> Modifiée (cible)
            </span>
          </div>

        </section>

      <div className="dv-grille atelier">
        <section className="dv-section" aria-label="Journal">
          <div className="tete">
            <div>
              <h2 className="t-section">Conversation</h2>
              <p>Horodatée. Chaque entrée devient un fait, une étape ou un problème.</p>
            </div>
          </div>
          <div className="dv-journal">
            {m.journal.map((e) => (
              <article key={e.id} className={`dv-entree ${e.type} ${e.auteur}`}>
                <div className="dv-heure">
                  {heure(e.horodatage)}
                  <b>{e.auteur === 'client' ? 'Client' : e.auteur === 'copilote' ? 'Copilote' : 'Moi'}</b>
                </div>
                <div>
                  <div className="dv-texte">{e.type === 'citation' ? `« ${e.texte} »` : e.texte}</div>
                  <div className="dv-ligne" style={{ marginTop: 4 }}>
                    <span className="t-mini">{LIBELLES_TYPE_ENTREE[e.type]}</span>
                    {m.problemes.some((p) => p.entreeId === e.id) && (
                      <Pastille ton="garance" point={false}>
                        Problème formalisé
                      </Pastille>
                    )}
                    {m.faits.some((f) => f.entreeId === e.id) && (
                      <Pastille ton="cobalt" point={false}>
                        Fait
                      </Pastille>
                    )}
                  </div>
                  <div className="outils">
                    <span className="dv-btn petit fantome">→ Fait</span>
                    <span className="dv-btn petit fantome">→ Étape</span>
                    <span className="dv-btn petit fantome">→ Problème</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="dv-saisie">
            <span>Ce que dit le client, ce que tu observes…</span>
            <span className="t-mini">Ctrl + Entrée</span>
          </div>
        </section>

        <section className="dv-section" aria-label="Étape sélectionnée">
          <div className="tete">
            <div>
              <h2 className="t-section">Étape sélectionnée</h2>
              <p>Cliquer une étape de la carte ouvre sa fiche : qui, avec quoi, quels problèmes, quelles sources.</p>
            </div>
          </div>
          <div className="dv-bloc">
            <div className="tete">
              <div>
                <div className="t-sur">Étape 2 · sélectionnée</div>
                <h3 className="t-section" style={{ marginTop: 4 }}>
                  Ouvrir la messagerie et lire les mêmes newsletters
                </h3>
              </div>
              <Pastille ton="garance">2 problèmes</Pastille>
            </div>
            <div className="corps">
              <div className="dv-grille deux">
                <div>
                  <div className="t-sur" style={{ marginBottom: 6 }}>
                    Qui, avec quoi
                  </div>
                  <div style={{ fontSize: 'var(--dv-t-14)' }}>Chargée de veille B · Messagerie · durée non relevée</div>
                  <div className="t-mini" style={{ marginTop: 4 }}>
                    Source : note de 09 h 20 (« aucune répartition écrite des sources »)
                  </div>
                </div>
                <div>
                  <div className="t-sur" style={{ marginBottom: 6 }}>
                    Problèmes à cette étape
                  </div>
                  <ul style={{ display: 'grid', gap: 6, fontSize: 'var(--dv-t-14)' }}>
                    <li>Les deux chargées lisent les mêmes newsletters sans le savoir</li>
                    <li>Le tri de la boîte mail occupe la matinée du lundi</li>
                  </ul>
                </div>
              </div>
              <div className="dv-ligne" style={{ marginTop: 16 }}>
                <span className="dv-btn petit">Modifier</span>
                <span className="dv-btn petit">← Déplacer →</span>
                <span className="dv-btn petit">Signaler un problème ici</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Coque>
  );
}
