-- Hilo Cofrade · Archivo visual, trazabilidad y completitud
-- Migración 004
--
-- Completa el núcleo v1 del proyecto con:
-- 1) Archivo multimedia y derechos
-- 2) Registro de cambios
-- 3) Indicadores de completitud de fichas

-- -----------------------------------------------------------------------------
-- Archivo multimedia
-- -----------------------------------------------------------------------------

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  media_type text not null check (media_type in ('image','document','video','audio')),
  title text,
  caption text,
  alt_text text,
  author_name text,
  source_name text,
  source_url text,
  rights_status text not null default 'pending' check (rights_status in (
    'pending','owned','authorized','licensed','public_domain','restricted'
  )),
  rights_holder text,
  license text,
  permission_notes text,
  taken_or_created_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger media_assets_set_updated_at
before update on public.media_assets
for each row execute function public.set_updated_at();

create table public.entity_media (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  relation_type text not null default 'gallery',
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  notes text,
  unique (entity_id, media_asset_id, relation_type)
);

create index entity_media_entity_idx on public.entity_media(entity_id, sort_order);
create index entity_media_asset_idx on public.entity_media(media_asset_id);

-- -----------------------------------------------------------------------------
-- Registro de cambios / trazabilidad
-- -----------------------------------------------------------------------------

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_label text,
  action_type text not null check (action_type in (
    'create','update','publish','unpublish','archive','restore','delete','link','unlink'
  )),
  object_type text not null,
  object_id uuid,
  entity_id uuid references public.entities(id) on delete set null,
  summary text not null,
  changed_fields jsonb,
  created_at timestamptz not null default now()
);

create index audit_log_entity_idx on public.audit_log(entity_id, created_at desc);
create index audit_log_object_idx on public.audit_log(object_type, object_id, created_at desc);
create index audit_log_date_idx on public.audit_log(created_at desc);

-- -----------------------------------------------------------------------------
-- Reglas de completitud
-- No se obliga a que todas las fichas tengan los mismos módulos, pero sí se
-- puede medir el núcleo documental mínimo de una hermandad.
-- -----------------------------------------------------------------------------

create table public.completeness_rules (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  rule_key text not null,
  label text not null,
  section_name text not null,
  weight smallint not null default 1 check (weight > 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  unique (entity_type, rule_key)
);

insert into public.completeness_rules (entity_type, rule_key, label, section_name, weight, sort_order) values
('brotherhood','identity','Identidad básica','General',2,10),
('brotherhood','crest','Escudo','General',1,20),
('brotherhood','canonical_see','Sede canónica','General',1,30),
('brotherhood','procession_day','Día de salida','General',1,40),
('brotherhood','images','Titulares','Titulares',2,50),
('brotherhood','steps','Pasos','Pasos',2,60),
('brotherhood','cults','Cultos','Cultos',1,70),
('brotherhood','outings','Salidas','Salidas',1,80),
('brotherhood','music','Música','Música',1,90),
('brotherhood','sources','Fuentes','Fuentes',2,100)
on conflict (entity_type, rule_key) do nothing;

-- Vista de señales de completitud para Hermandades.
create or replace view public.brotherhood_completeness_signals as
select
  b.entity_id,
  (b.popular_name is not null and b.official_name is not null and b.foundation_text is not null) as identity,
  (b.crest_path is not null) as crest,
  (b.canonical_see_place_id is not null) as canonical_see,
  (b.current_procession_day is not null) as procession_day,
  exists (
    select 1 from public.brotherhood_images bi
    where bi.brotherhood_entity_id = b.entity_id and bi.status = 'published'
  ) as images,
  exists (
    select 1 from public.brotherhood_steps bs
    where bs.brotherhood_entity_id = b.entity_id and bs.status = 'published'
  ) as steps,
  exists (
    select 1 from public.cults c
    where c.brotherhood_entity_id = b.entity_id and c.status = 'published'
  ) as cults,
  exists (
    select 1 from public.outings o
    where o.brotherhood_entity_id = b.entity_id and o.status = 'published'
  ) as outings,
  exists (
    select 1
    from public.outings o
    join public.accompaniments a on a.outing_id = o.id
    where o.brotherhood_entity_id = b.entity_id
      and o.status = 'published'
      and a.status = 'published'
  ) as music,
  exists (
    select 1
    from public.source_links sl
    where sl.entity_id = b.entity_id
  ) as sources
from public.brotherhoods b;

-- Vista con porcentaje ponderado. Se mantiene simple y legible para que la app
-- pueda enseñar tanto el porcentaje como los bloques que faltan.
create or replace view public.brotherhood_completeness as
select
  s.entity_id,
  round(
    100.0 * (
      (case when s.identity then 2 else 0 end) +
      (case when s.crest then 1 else 0 end) +
      (case when s.canonical_see then 1 else 0 end) +
      (case when s.procession_day then 1 else 0 end) +
      (case when s.images then 2 else 0 end) +
      (case when s.steps then 2 else 0 end) +
      (case when s.cults then 1 else 0 end) +
      (case when s.outings then 1 else 0 end) +
      (case when s.music then 1 else 0 end) +
      (case when s.sources then 2 else 0 end)
    ) / 14.0
  )::int as completion_percentage,
  s.identity,
  s.crest,
  s.canonical_see,
  s.procession_day,
  s.images,
  s.steps,
  s.cults,
  s.outings,
  s.music,
  s.sources
from public.brotherhood_completeness_signals s;

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------

alter table public.media_assets enable row level security;
alter table public.entity_media enable row level security;
alter table public.audit_log enable row level security;
alter table public.completeness_rules enable row level security;

-- Solo se muestran públicamente archivos con derechos compatibles con publicación.
create policy "Publishable media assets"
on public.media_assets for select
using (rights_status in ('owned','authorized','licensed','public_domain'));

create policy "Public entity media"
on public.entity_media for select
using (
  exists (
    select 1 from public.entities e
    where e.id = entity_id and e.status = 'published'
  )
  and exists (
    select 1 from public.media_assets m
    where m.id = media_asset_id
      and m.rights_status in ('owned','authorized','licensed','public_domain')
  )
);

-- Audit log y reglas de completitud son datos internos; no se crea política pública.
-- El panel privado accederá mediante usuarios autenticados y políticas específicas
-- cuando conectemos Supabase Auth.
