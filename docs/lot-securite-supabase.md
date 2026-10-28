# Lot 2 — Sécurité : authentification, espaces clients isolés, sécurité par ligne, tests d'isolation

Proposition du 28 octobre 2026. **Rien n'est appliqué** : aucune base Supabase n'est créée ni migrée sans validation explicite de Faty (règle du dépôt). Ce document décrit ce que le lot ferait, pour revue par ChatGPT et décision.

## 1. Objectif

Remplacer le stockage local du navigateur (MVP v1) par un stockage serveur où **une personne du client A ne peut ni lire ni modifier le client B** (critère 6 de l'issue #2), avec export complet et suppression effective par espace.

## 2. Ce qui ne change pas

Les composants ne parlent qu'à l'interface `MissionStore` (`lib/domain/store.ts`). Le lot ajoute une implémentation `createSupabaseStore()` et un sélecteur par configuration ; l'implémentation locale reste disponible pour la démonstration et les tests.

## 3. Schéma proposé (Postgres, schéma `client`)

Toutes les tables portent `espace_id` et la sécurité par ligne est **forcée** (`ENABLE` + `FORCE ROW LEVEL SECURITY`).

```sql
create schema if not exists client;

create table client.espace (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  cree_le timestamptz not null default now(),
  conservation_jusquau date
);

create table client.membre (
  espace_id uuid not null references client.espace(id) on delete cascade,
  utilisateur_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('consultante','client','prestataire')),
  expire_le timestamptz,
  primary key (espace_id, utilisateur_id)
);

-- Une mission entière du MVP v1 est stockée en JSON pour ce lot ; l'éclatement en tables
-- (etape, probleme, preuve, cause, solution, action) est prévu au lot 4 sans changer l'interface.
create table client.mission (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references client.espace(id) on delete cascade,
  nom text not null,
  pack_id text not null,
  pack_version text not null,
  contenu jsonb not null,
  cree_le timestamptz not null default now(),
  mis_a_jour_le timestamptz not null default now()
);
create index on client.mission (espace_id, mis_a_jour_le desc);

create table client.journal (
  seq bigserial primary key,
  espace_id uuid not null references client.espace(id) on delete cascade,
  type text not null,
  acteur uuid,
  horodatage timestamptz not null default now(),
  avant jsonb,
  apres jsonb
);
create index on client.journal (espace_id, seq);
-- Journal en insertion seule : le rôle applicatif n'a ni UPDATE ni DELETE, un trigger lève une exception.
```

### Politiques de sécurité par ligne

```sql
alter table client.mission enable row level security;
alter table client.mission force row level security;

create policy mission_lecture on client.mission for select
  using (exists (select 1 from client.membre m
                 where m.espace_id = mission.espace_id
                   and m.utilisateur_id = (select auth.uid())
                   and (m.expire_le is null or m.expire_le > now())));

create policy mission_ecriture on client.mission for insert with check (
  exists (select 1 from client.membre m
          where m.espace_id = mission.espace_id
            and m.utilisateur_id = (select auth.uid())
            and m.role = 'consultante'));

create policy mission_modification on client.mission for update
  using (exists (select 1 from client.membre m
                 where m.espace_id = mission.espace_id
                   and m.utilisateur_id = (select auth.uid())
                   and m.role in ('consultante','client')));
-- Même modèle pour espace, membre (lecture seule hors consultante) et journal (insertion seule).
```

Règles non négociables : toute requête applicative passe par le jeton de l'utilisateur ; la clé de service est réservée aux tâches de fond listées (export, suppression, promotion de patrons) ; région Union européenne.

## 4. Authentification

Supabase Auth par lien magique (courriel), sans mot de passe à retenir sur le terrain. Un utilisateur = une ligne `auth.users` ; l'appartenance à un espace = une ligne `client.membre`. Le rôle `prestataire` ne voit qu'une recommandation partagée par lien à durée limitée (module 90 jours, hors de ce lot).

## 5. Export et suppression

- **Export** : une fonction serveur produit une archive JSON de toutes les lignes de l'espace (mission, journal) et des fichiers associés. Elle sert aussi de test d'isolation : ce qui sort pour l'espace A ne contient rien de B.
- **Suppression** : suppression physique en cascade de l'espace, puis événement `espace.supprime` dans un journal système hors espace, sans contenu.

## 6. Tests d'isolation automatiques (critère 6)

Dans la CI, contre une base de test jetable :

1. Créer deux utilisateurs U1, U2 et deux espaces A (membre U1) et B (membre U2).
2. Avec le jeton de U1 : `select` sur `client.mission` renvoie uniquement les missions de A ; `update` et `delete` sur une mission de B ne touchent aucune ligne ; `insert` avec `espace_id = B` est refusé.
3. Script de garde au déploiement : refuse la mise en ligne si une table du schéma `client` n'a pas la sécurité par ligne forcée.
4. Test de l'export : l'archive de A ne contient aucun identifiant de B.

## 7. Impact sur l'interface

- Écran de connexion (courriel, lien magique) ; sélection de l'espace.
- Bandeau « données locales » remplacé par « espace : {nom} » ; bouton d'export complet.
- Mode local conservé derrière un réglage pour la démonstration hors ligne.

## 8. Prérequis et décisions attendues

- Validation de Faty pour créer le projet Supabase (région UE) et appliquer la migration.
- Choix de la durée de conservation par défaut.
- Confirmation que, jusqu'à la livraison de ce lot, aucune donnée réelle de client n'est saisie dans l'application.
