-- Hilo Cofrade · Colores corporativos de las hermandades
-- Migración 012
--
-- Los colores se modelan como registros ordenados porque una corporación puede
-- tener más de dos colores y el tono hexadecimal exacto puede estar pendiente
-- de confirmación documental.

create table public.brotherhood_colors (
  id uuid primary key default gen_random_uuid(),
  brotherhood_entity_id uuid not null references public.entities(id) on delete cascade,
  color_name text not null,
  hex_value text,
  color_role text not null default 'identity' check (
    color_role in ('primary','secondary','accent','identity')
  ),
  sort_order smallint not null default 0,
  notes text,
  status text not null default 'published' check (
    status in ('draft','review','published','archived')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint brotherhood_colors_hex_format check (
    hex_value is null or hex_value ~ '^#[0-9A-Fa-f]{6}$'
  ),
  unique (brotherhood_entity_id, color_name)
);

create index brotherhood_colors_brotherhood_idx
  on public.brotherhood_colors(brotherhood_entity_id, sort_order);

create trigger brotherhood_colors_set_updated_at
before update on public.brotherhood_colors
for each row execute function public.set_updated_at();

alter table public.brotherhood_colors enable row level security;

create policy "Published brotherhood colors"
on public.brotherhood_colors for select
using (status = 'published');

create or replace view public.published_brotherhood_colors as
select
  bc.id,
  bc.brotherhood_entity_id,
  e.name as brotherhood_name,
  bc.color_name,
  bc.hex_value,
  bc.color_role,
  bc.sort_order,
  bc.notes
from public.brotherhood_colors bc
join public.entities e on e.id = bc.brotherhood_entity_id
where bc.status = 'published'
  and e.status = 'published';

