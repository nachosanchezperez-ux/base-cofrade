-- Hilo Cofrade · Editorial, estrenos/restauraciones y automatización diaria
-- Migración 003
--
-- Objetivos:
-- 1) Gestionar Estrenos y Restauraciones como registros estructurados.
-- 2) Permitir Artículos y Curiosidades vinculados a cualquier entidad.
-- 3) Convertir el contenido diario manual en EXCEPCIONES editoriales.
-- 4) Preparar la selección automática de "Hoy en Hilo Cofrade".

-- -----------------------------------------------------------------------------
-- Estrenos y restauraciones
-- -----------------------------------------------------------------------------

create table public.heritage_updates (
  id uuid primary key default gen_random_uuid(),
  brotherhood_entity_id uuid not null references public.entities(id) on delete cascade,
  update_type text not null check (update_type in ('estreno','restauracion')),
  title text not null,
  update_date date,
  year integer,
  target_entity_id uuid references public.entities(id) on delete set null,
  element_name text,
  discipline text,
  description text,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint heritage_updates_date_or_year check (update_date is not null or year is not null)
);

create index heritage_updates_brotherhood_idx
  on public.heritage_updates(brotherhood_entity_id, year desc);

create index heritage_updates_target_idx
  on public.heritage_updates(target_entity_id);

create index heritage_updates_type_idx
  on public.heritage_updates(update_type, year desc);

create trigger heritage_updates_set_updated_at
before update on public.heritage_updates
for each row execute function public.set_updated_at();

-- Un estreno/restauración puede tener varios agentes/talleres y cada uno un papel.
create table public.heritage_update_agents (
  id uuid primary key default gen_random_uuid(),
  heritage_update_id uuid not null references public.heritage_updates(id) on delete cascade,
  agent_entity_id uuid not null references public.entities(id) on delete restrict,
  role_name text not null,
  discipline text,
  notes text,
  unique (heritage_update_id, agent_entity_id, role_name)
);

create index heritage_update_agents_update_idx
  on public.heritage_update_agents(heritage_update_id);

create index heritage_update_agents_agent_idx
  on public.heritage_update_agents(agent_entity_id);

-- -----------------------------------------------------------------------------
-- Contenido editorial: artículos, noticias, curiosidades, datos y efemérides
-- -----------------------------------------------------------------------------

create table public.editorial_content (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in (
    'article','news','curiosity','fact','ephemeris'
  )),
  title text not null,
  subtitle text,
  summary text,
  body text,
  publish_date date,
  author_name text,
  cover_image_path text,
  eligible_for_daily boolean not null default false,
  daily_priority smallint not null default 0,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index editorial_content_type_idx
  on public.editorial_content(content_type, status);

create index editorial_content_publish_date_idx
  on public.editorial_content(publish_date desc);

create index editorial_content_daily_idx
  on public.editorial_content(eligible_for_daily, content_type, daily_priority desc)
  where status = 'published';

create trigger editorial_content_set_updated_at
before update on public.editorial_content
for each row execute function public.set_updated_at();

-- Un mismo artículo o curiosidad puede aparecer en varias fichas sin duplicarse.
create table public.editorial_content_links (
  id uuid primary key default gen_random_uuid(),
  editorial_content_id uuid not null references public.editorial_content(id) on delete cascade,
  entity_id uuid not null references public.entities(id) on delete cascade,
  relation_type text not null default 'related',
  is_primary boolean not null default false,
  notes text,
  unique (editorial_content_id, entity_id, relation_type)
);

create index editorial_content_links_content_idx
  on public.editorial_content_links(editorial_content_id);

create index editorial_content_links_entity_idx
  on public.editorial_content_links(entity_id);

-- -----------------------------------------------------------------------------
-- Marchas elegibles para selección automática del día
-- -----------------------------------------------------------------------------

alter table public.marches
  add column if not exists eligible_for_daily boolean not null default true,
  add column if not exists daily_priority smallint not null default 0;

-- -----------------------------------------------------------------------------
-- "Hoy en Hilo Cofrade": automático por defecto, manual solo como excepción
-- -----------------------------------------------------------------------------

-- La tabla creada en 001 deja de significar "contenido que hay que cargar cada día".
-- A partir de ahora solo contiene excepciones editoriales para una fecha concreta.
alter table public.daily_content rename to daily_overrides;

alter table public.daily_overrides
  add column editorial_content_id uuid references public.editorial_content(id) on delete set null,
  add column march_entity_id uuid references public.entities(id) on delete set null,
  add column event_entity_id uuid references public.entities(id) on delete set null,
  add column reason text;

-- Un override puede apuntar a contenido editorial, marcha, acontecimiento o entidad genérica.
-- Los antiguos campos title/summary se mantienen para permitir excepciones redactadas a mano.
alter table public.daily_overrides
  add constraint daily_overrides_single_reference check (
    num_nonnulls(editorial_content_id, march_entity_id, event_entity_id, entity_id) <= 1
  );

create index daily_overrides_editorial_idx
  on public.daily_overrides(editorial_content_id);

create index daily_overrides_march_idx
  on public.daily_overrides(march_entity_id);

create index daily_overrides_event_idx
  on public.daily_overrides(event_entity_id);

-- Vista de candidatos editoriales para Dato Cofrade y Curiosidad.
-- La selección final puede hacerse de forma determinista desde Next.js usando la fecha.
create or replace view public.daily_editorial_candidates as
select
  ec.id,
  ec.content_type,
  ec.title,
  ec.summary,
  ec.daily_priority,
  ec.publish_date
from public.editorial_content ec
where ec.status = 'published'
  and ec.eligible_for_daily = true
  and ec.content_type in ('fact','curiosity');

-- Vista de efemérides cuyo mes y día coinciden con la fecha actual.
-- El año original se conserva en el acontecimiento, pero la coincidencia es por aniversario.
create or replace view public.today_ephemeris_candidates as
select
  e.entity_id,
  en.name as title,
  e.event_type,
  e.event_date,
  e.event_date_text,
  e.description
from public.events e
join public.entities en on en.id = e.entity_id
where en.status = 'published'
  and e.event_date is not null
  and extract(month from e.event_date) = extract(month from current_date)
  and extract(day from e.event_date) = extract(day from current_date);

-- Vista de marchas disponibles para rotación automática.
create or replace view public.daily_march_candidates as
select
  en.id as entity_id,
  en.name,
  m.composition_year,
  m.composition_date_text,
  m.youtube_video_id,
  m.daily_priority
from public.marches m
join public.entities en on en.id = m.entity_id
where en.status = 'published'
  and m.eligible_for_daily = true;

-- -----------------------------------------------------------------------------
-- Fuentes para nuevos tipos de registro
-- -----------------------------------------------------------------------------

alter table public.source_links
  add column heritage_update_id uuid references public.heritage_updates(id) on delete cascade,
  add column editorial_content_id uuid references public.editorial_content(id) on delete cascade;

alter table public.source_links
  drop constraint source_links_one_target;

alter table public.source_links
  add constraint source_links_one_target check (
    num_nonnulls(
      entity_id,
      outing_id,
      cult_id,
      intervention_id,
      heritage_update_id,
      editorial_content_id
    ) = 1
  );

-- -----------------------------------------------------------------------------
-- Seguridad
-- -----------------------------------------------------------------------------

alter table public.heritage_updates enable row level security;
alter table public.heritage_update_agents enable row level security;
alter table public.editorial_content enable row level security;
alter table public.editorial_content_links enable row level security;

create policy "Published heritage updates"
on public.heritage_updates for select
using (status = 'published');

create policy "Public heritage update agents"
on public.heritage_update_agents for select
using (
  exists (
    select 1
    from public.heritage_updates hu
    where hu.id = heritage_update_id
      and hu.status = 'published'
  )
);

create policy "Published editorial content"
on public.editorial_content for select
using (status = 'published' and (publish_date is null or publish_date <= current_date));

create policy "Public editorial content links"
on public.editorial_content_links for select
using (
  exists (
    select 1
    from public.editorial_content ec
    where ec.id = editorial_content_id
      and ec.status = 'published'
      and (ec.publish_date is null or ec.publish_date <= current_date)
  )
);

-- Comentario funcional:
-- La aplicación deberá seguir este orden para cada bloque de "Hoy":
-- 1. Buscar daily_overrides para la fecha y tipo.
-- 2. Si existe, mostrar la excepción fijada por el editor.
-- 3. Si no existe, seleccionar automáticamente entre los candidatos publicados.
-- De esta forma no es necesario entrar al panel todos los días.
