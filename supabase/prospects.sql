-- KlarDrive : prospects B2C (à exécuter après schema.sql)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nom text,
  tel text,
  canal text default 'email',
  langue text default 'de',
  modele_recherche text,
  budget_max integer,
  delai text,
  financement boolean default false,
  reprise boolean default false,
  message_origine text,
  score integer default 0,
  statut text default 'nouveau',
  prochaine_action text,
  relance_1_at timestamptz,
  relance_2_at timestamptz,
  relance_3_at timestamptz,
  vendu boolean default false
);
create index if not exists leads_score_idx on leads (score desc);
create index if not exists leads_statut_idx on leads (statut);
