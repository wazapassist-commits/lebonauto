-- KlarDrive : messagerie du site (formulaire contact -> table messages)
-- À exécuter après schema.sql. RLS : insertion publique, lecture/modif admin connecté.
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nom text,
  email text,
  tel text,
  sujet text,
  message text,
  lu boolean default false,
  traite boolean default false
);
alter table messages enable row level security;
drop policy if exists "messages_insert_public" on messages;
create policy "messages_insert_public" on messages
  for insert to anon with check (true);
drop policy if exists "messages_admin_all" on messages;
create policy "messages_admin_all" on messages
  for all to authenticated using (true) with check (true);
create index if not exists messages_created_idx on messages (created_at desc);
