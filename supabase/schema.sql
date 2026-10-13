-- KlarDrive : schema Supabase.
-- A executer UNE FOIS dans : Supabase Dashboard, SQL Editor.
-- Puis seed.sql pour importer les 29 vehicules et 6 articles.

-- ---------- tables ----------
create table if not exists vehicles (
  id text primary key,
  marque text not null,
  modele text not null,
  version text default '',
  prix integer not null,
  annee integer,
  km integer,
  carburant text default '',
  boite text default '',
  puissance text default '',
  img text default '',
  gallery jsonb default '[]'::jsonb,
  cat text default '',
  badge text default '',
  description text default '',
  created_at timestamptz default now()
);

create table if not exists articles (
  slug text primary key,
  titre text not null,
  date date,
  img text default '',
  resume text default '',
  contenu jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- ---------- RLS : lecture publique, écriture admin connecté ----------
alter table vehicles enable row level security;
alter table articles enable row level security;

drop policy if exists "lecture publique" on vehicles;
create policy "lecture publique" on vehicles for select using (true);
drop policy if exists "lecture publique" on articles;
create policy "lecture publique" on articles for select using (true);

drop policy if exists "admin tout" on vehicles;
create policy "admin tout" on vehicles for all using (auth.role() = 'authenticated');
drop policy if exists "admin tout" on articles;
create policy "admin tout" on articles for all using (auth.role() = 'authenticated');

-- ---------- stockage photos (public en lecture, admin en écriture) ----------
insert into storage.buckets (id, name, public)
values ('vehicules', 'vehicules', true)
on conflict (id) do nothing;

drop policy if exists "photos publiques" on storage.objects;
create policy "photos publiques" on storage.objects
  for select using (bucket_id = 'vehicules');

drop policy if exists "admin photos" on storage.objects;
create policy "admin photos" on storage.objects
  for all using (bucket_id = 'vehicules' and auth.role() = 'authenticated');
