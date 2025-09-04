-- Crear tabla de ideas para el Ideatorio
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  categories text[] not null default '{}',
  problem text not null,
  solution text not null,
  mvp_features text[] not null default '{}',
  technologies text[] default '{}',
  audience text,
  business_model text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_ideas_updated_at on public.ideas;
create trigger set_ideas_updated_at
before update on public.ideas
for each row execute function public.set_updated_at();

-- Habilitar RLS
alter table public.ideas enable row level security;

-- Política de lectura pública
drop policy if exists "Public read access for ideas" on public.ideas;
create policy "Public read access for ideas"
on public.ideas for select
to public
using (true);

-- Política de inserción solo para usuarios autenticados
drop policy if exists "Authenticated insert ideas" on public.ideas;
create policy "Authenticated insert ideas"
on public.ideas for insert
to authenticated
with check (true);

-- Política de actualización solo para usuarios autenticados
drop policy if exists "Authenticated update ideas" on public.ideas;
create policy "Authenticated update ideas"
on public.ideas for update
to authenticated
using (true)
with check (true);

-- Política de borrado solo para usuarios autenticados
drop policy if exists "Authenticated delete ideas" on public.ideas;
create policy "Authenticated delete ideas"
on public.ideas for delete
to authenticated
using (true);


