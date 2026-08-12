-- Hilo Cofrade · Imágenes
-- Migración 006
--
-- Completa el modelo de imágenes físicas con:
-- 1) Autoría y atribuciones
-- 2) Datos materiales y medidas
-- 3) Histórico de titularidades y ubicaciones con fuentes específicas
-- 4) Relaciones entre imágenes de una misma advocación
-- 5) Vistas prácticas para ficha pública y panel admin

-- -----------------------------------------------------------------------------
-- Datos físicos adicionales
-- -----------------------------------------------------------------------------

alter table public.images
  add column if not exists technique text,
  add column if not exists polychromy text,
  add column if not exists dimensions_text text,
  add column if not exists height_cm numeric(7,2),
  add column if not exists width_cm numeric(7,2),
  add column if not exists depth_cm numeric(7,2),
  add column if not exists iconography text,
  add column if not exists anatomical_type text,
  add column if not exists is_dress_image boolean,
  add column if not exists current_state_notes text;

-- -----------------------------------------------------------------------------
-- Autoría y atribuciones
-- -----------------------------------------------------------------------------

create table public.image_authorships (
  id uuid primary key default gen_random_uuid(),
  image_entity_id uuid not null references public.entities(id) on delete cascade,
  agent_entity_id uuid not null references public.entities(id) on delete restrict,
  authorship_type text not null check (authorship_type in (
    'author','attributed_to','workshop_of','circle_of','school_of','anonymous'
  )),
  role_name text not null default 'autor',
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  certainty text not null default 'documented' check (certainty in (
    'documented','attributed','traditional','unknown'
  )),
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  unique (image_entity_id, agent_entity_id, authorship_type, role_name)
);

create index image_authorships_image_idx on public.image_authorships(image_entity_id);
create index image_authorships_agent_idx on public.image_authorships(agent_entity_id);

-- -----------------------------------------------------------------------------
-- Nombres históricos o alternativos de una imagen física
-- -----------------------------------------------------------------------------

create table public.image_names (
  id uuid primary key default gen_random_uuid(),
  image_entity_id uuid not null references public.entities(id) on delete cascade,
  name text not null,
  name_type text not null default 'popular' check (name_type in (
    'official','popular','former','catalogue','devotional'
  )),
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  unique (image_entity_id, name, date_from)
);

create index image_names_image_idx on public.image_names(image_entity_id, is_current);

-- -----------------------------------------------------------------------------
-- Fuentes específicas de relaciones históricas
-- -----------------------------------------------------------------------------

alter table public.source_links
  add column if not exists image_authorship_id uuid references public.image_authorships(id) on delete cascade,
  add column if not exists brotherhood_image_id uuid references public.brotherhood_images(id) on delete cascade,
  add column if not exists entity_location_id uuid references public.entity_locations(id) on delete cascade,
  add column if not exists entity_relation_id uuid references public.entity_relations(id) on delete cascade;

alter table public.source_links
  drop constraint if exists source_links_one_target;

alter table public.source_links
  add constraint source_links_one_target check (
    num_nonnulls(
      entity_id,
      outing_id,
      cult_id,
      intervention_id,
      heritage_update_id,
      editorial_content_id,
      music_accompaniment_period_id,
      march_dedication_id,
      march_recording_id,
      image_authorship_id,
      brotherhood_image_id,
      entity_location_id,
      entity_relation_id
    ) = 1
  );

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.image_authorships enable row level security;
alter table public.image_names enable row level security;

create policy "Published image authorships"
on public.image_authorships for select
using (status = 'published');

create policy "Public image names"
on public.image_names for select
using (
  exists (
    select 1 from public.entities e
    where e.id = image_entity_id and e.status = 'published'
  )
);

-- -----------------------------------------------------------------------------
-- Vistas útiles
-- -----------------------------------------------------------------------------

-- Todas las imágenes físicas que representan una misma advocación.
create or replace view public.advocation_images as
select
  a.entity_id as advocation_entity_id,
  ae.name as advocation_name,
  i.entity_id as image_entity_id,
  ie.name as image_name,
  i.execution_date,
  i.execution_date_text,
  i.current_condition
from public.advocations a
join public.entities ae on ae.id = a.entity_id
join public.images i on i.advocation_entity_id = a.entity_id
join public.entities ie on ie.id = i.entity_id
where ae.status = 'published'
  and ie.status = 'published';

-- Histórico de hermandades a las que ha pertenecido o estado vinculada una imagen.
create or replace view public.image_brotherhood_history as
select
  bi.id as relation_id,
  bi.image_entity_id,
  ie.name as image_name,
  bi.brotherhood_entity_id,
  be.name as brotherhood_name,
  bi.relation_type,
  bi.date_from,
  bi.date_from_text,
  bi.date_to,
  bi.date_to_text,
  (bi.date_to is null and bi.date_to_text is null) as is_current,
  bi.notes
from public.brotherhood_images bi
join public.entities ie on ie.id = bi.image_entity_id
join public.entities be on be.id = bi.brotherhood_entity_id
where bi.status = 'published';

-- Ubicación física/custodia actual de cada imagen.
create or replace view public.current_image_locations as
select
  el.id as location_relation_id,
  el.entity_id as image_entity_id,
  ie.name as image_name,
  el.place_id,
  p.name as place_name,
  el.municipality_id,
  m.name as municipality_name,
  el.custodian_entity_id,
  ce.name as custodian_name,
  el.location_type,
  el.notes
from public.entity_locations el
join public.entities ie on ie.id = el.entity_id and ie.entity_type = 'image'
left join public.places p on p.id = el.place_id
left join public.municipalities m on m.id = el.municipality_id
left join public.entities ce on ce.id = el.custodian_entity_id
where el.status = 'published'
  and el.is_current = true;

-- Restauraciones publicadas de imágenes.
create or replace view public.image_restorations as
select
  hu.id,
  hu.target_entity_id as image_entity_id,
  ie.name as image_name,
  hu.title,
  hu.update_date,
  hu.year,
  hu.discipline,
  hu.description
from public.heritage_updates hu
join public.entities ie on ie.id = hu.target_entity_id
where hu.status = 'published'
  and hu.update_type = 'restauracion'
  and ie.entity_type = 'image';

-- Autoría principal y atribuciones de una imagen.
create or replace view public.image_authorship_details as
select
  ia.id,
  ia.image_entity_id,
  ie.name as image_name,
  ia.agent_entity_id,
  ae.name as agent_name,
  ia.authorship_type,
  ia.role_name,
  ia.certainty,
  ia.date_from,
  ia.date_from_text,
  ia.notes
from public.image_authorships ia
join public.entities ie on ie.id = ia.image_entity_id
join public.entities ae on ae.id = ia.agent_entity_id
where ia.status = 'published';

-- Nota funcional:
-- Las sustituciones entre imágenes no requieren tabla nueva. Se registran en
-- public.entity_relations con relation_type como 'sustituye_a', 'sustituida_por',
-- 'procede_de' u otras relaciones documentadas.
