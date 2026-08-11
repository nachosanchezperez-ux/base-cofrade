-- Hilo Cofrade · Modelo relacional v0.6
-- Primera migración para Supabase / PostgreSQL
-- Diseñado para conservar realidad actual e histórica sin borrar relaciones anteriores.

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Geografía y lugares
-- -----------------------------------------------------------------------------

create table public.municipalities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  province text not null default 'Sevilla',
  autonomous_community text not null default 'Andalucía',
  country text not null default 'España',
  created_at timestamptz not null default now()
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  municipality_id uuid references public.municipalities(id) on delete set null,
  name text not null,
  slug text unique,
  place_type text,
  address text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger places_set_updated_at
before update on public.places
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Entidad común: el punto de entrada para búsqueda, navegación y relaciones
-- -----------------------------------------------------------------------------

create table public.entities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in (
    'brotherhood', 'advocation', 'image', 'step', 'agent', 'band', 'march',
    'event', 'heritage_asset'
  )),
  name text not null,
  slug text unique,
  summary text,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index entities_type_idx on public.entities(entity_type);
create index entities_status_idx on public.entities(status);

create trigger entities_set_updated_at
before update on public.entities
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Hermandades
-- -----------------------------------------------------------------------------

create table public.brotherhoods (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  official_name text not null,
  popular_name text not null,
  foundation_text text,
  municipality_id uuid references public.municipalities(id) on delete set null,
  canonical_see_place_id uuid references public.places(id) on delete set null,
  neighborhood text,
  website_url text,
  instagram_url text,
  crest_path text,
  brotherhood_types text[] not null default '{}',
  current_procession_day text,
  notes text
);

-- -----------------------------------------------------------------------------
-- Advocaciones e imágenes físicas
-- La advocación permanece aunque la talla concreta cambie.
-- -----------------------------------------------------------------------------

create table public.advocations (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  advocation_type text,
  description text
);

create table public.images (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  advocation_entity_id uuid references public.entities(id) on delete set null,
  image_type text,
  execution_date date,
  execution_date_text text,
  material text,
  current_condition text check (current_condition is null or current_condition in (
    'extant','lost','destroyed','unknown'
  )),
  description text,
  notes text
);

-- Titularidad y otras relaciones históricas Hermandad ↔ Imagen.
-- No se usa un booleano "antigua titular": se deduce de las fechas.
create table public.brotherhood_images (
  id uuid primary key default gen_random_uuid(),
  brotherhood_entity_id uuid not null references public.entities(id) on delete cascade,
  image_entity_id uuid not null references public.entities(id) on delete cascade,
  relation_type text not null default 'titular',
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  unique (brotherhood_entity_id, image_entity_id, relation_type, date_from)
);

create index brotherhood_images_brotherhood_idx on public.brotherhood_images(brotherhood_entity_id);
create index brotherhood_images_image_idx on public.brotherhood_images(image_entity_id);

-- -----------------------------------------------------------------------------
-- Agentes: personas, talleres, empresas artesanales e instituciones
-- -----------------------------------------------------------------------------

create table public.agents (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  agent_kind text not null check (agent_kind in ('person','workshop','company','institution')),
  municipality_id uuid references public.municipalities(id) on delete set null,
  foundation_or_birth_text text,
  death_or_end_text text,
  website_url text,
  instagram_url text,
  description text
);

create table public.agent_roles (
  id uuid primary key default gen_random_uuid(),
  agent_entity_id uuid not null references public.entities(id) on delete cascade,
  role_name text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  notes text,
  unique (agent_entity_id, role_name, date_from)
);

-- -----------------------------------------------------------------------------
-- Pasos y evolución histórica
-- -----------------------------------------------------------------------------

create table public.steps (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  step_type text,
  current_condition text check (current_condition is null or current_condition in (
    'in_use','stored','transferred','sold','dismantled','partially_preserved','lost','unknown'
  )),
  description text,
  notes text
);

create table public.brotherhood_steps (
  id uuid primary key default gen_random_uuid(),
  brotherhood_entity_id uuid not null references public.entities(id) on delete cascade,
  step_entity_id uuid not null references public.entities(id) on delete cascade,
  relation_type text not null default 'processional_step',
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  unique (brotherhood_entity_id, step_entity_id, relation_type, date_from)
);

create table public.image_steps (
  id uuid primary key default gen_random_uuid(),
  image_entity_id uuid not null references public.entities(id) on delete cascade,
  step_entity_id uuid not null references public.entities(id) on delete cascade,
  relation_type text not null default 'processes_on',
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  unique (image_entity_id, step_entity_id, relation_type, date_from)
);

-- Relaciones entre pasos: sustituye_a, vendido_a, reutiliza_elementos_de, etc.
create table public.entity_relations (
  id uuid primary key default gen_random_uuid(),
  source_entity_id uuid not null references public.entities(id) on delete cascade,
  relation_type text not null,
  target_entity_id uuid not null references public.entities(id) on delete cascade,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  constraint entity_relations_not_self check (source_entity_id <> target_entity_id)
);

create index entity_relations_source_idx on public.entity_relations(source_entity_id);
create index entity_relations_target_idx on public.entity_relations(target_entity_id);
create index entity_relations_type_idx on public.entity_relations(relation_type);

-- Ubicación y custodia actual o histórica de imágenes, pasos y otras entidades.
-- location_type distingue ubicación física, custodia, depósito, colección, etc.
create table public.entity_locations (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.entities(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,
  municipality_id uuid references public.municipalities(id) on delete set null,
  custodian_entity_id uuid references public.entities(id) on delete set null,
  location_type text not null default 'physical_location',
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean not null default false,
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now()
);

create index entity_locations_entity_idx on public.entity_locations(entity_id);
create index entity_locations_current_idx on public.entity_locations(entity_id, is_current);

-- -----------------------------------------------------------------------------
-- Patrimonio e intervenciones
-- Sirve para paso, imagen y futuros elementos patrimoniales.
-- -----------------------------------------------------------------------------

create table public.heritage_assets (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  parent_entity_id uuid references public.entities(id) on delete set null,
  asset_type text,
  description text,
  current_condition text,
  notes text
);

create table public.heritage_interventions (
  id uuid primary key default gen_random_uuid(),
  target_entity_id uuid not null references public.entities(id) on delete cascade,
  agent_entity_id uuid not null references public.entities(id) on delete restrict,
  discipline text not null,
  element_name text,
  intervention_type text,
  phase text,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  description text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index heritage_interventions_target_idx on public.heritage_interventions(target_entity_id);
create index heritage_interventions_agent_idx on public.heritage_interventions(agent_entity_id);

create trigger heritage_interventions_set_updated_at
before update on public.heritage_interventions
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Bandas y marchas
-- -----------------------------------------------------------------------------

create table public.bands (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  band_type text,
  municipality_id uuid references public.municipalities(id) on delete set null,
  foundation_text text,
  website_url text,
  instagram_url text,
  description text
);

create table public.marches (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  composition_year integer,
  composition_date_text text,
  music_type text,
  youtube_video_id text,
  description text
);

create table public.march_authors (
  id uuid primary key default gen_random_uuid(),
  march_entity_id uuid not null references public.entities(id) on delete cascade,
  agent_entity_id uuid not null references public.entities(id) on delete restrict,
  author_role text not null default 'composer',
  notes text,
  unique (march_entity_id, agent_entity_id, author_role)
);

-- -----------------------------------------------------------------------------
-- Salidas y acompañamientos
-- -----------------------------------------------------------------------------

create table public.outings (
  id uuid primary key default gen_random_uuid(),
  brotherhood_entity_id uuid not null references public.entities(id) on delete cascade,
  outing_type text not null,
  character text not null default 'ordinary' check (character in ('ordinary','extraordinary')),
  title text,
  outing_date date,
  year integer,
  departure_time time,
  return_time time,
  municipality_id uuid references public.municipalities(id) on delete set null,
  origin_place_id uuid references public.places(id) on delete set null,
  destination_place_id uuid references public.places(id) on delete set null,
  reason text,
  route jsonb,
  description text,
  event_status text not null default 'announced' check (event_status in ('announced','held','cancelled')),
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index outings_date_idx on public.outings(outing_date);
create index outings_extraordinary_idx on public.outings(character, outing_date);

create trigger outings_set_updated_at
before update on public.outings
for each row execute function public.set_updated_at();

create table public.outing_entities (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings(id) on delete cascade,
  entity_id uuid not null references public.entities(id) on delete cascade,
  role text not null,
  notes text,
  unique (outing_id, entity_id, role)
);

create table public.accompaniments (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings(id) on delete cascade,
  band_entity_id uuid not null references public.entities(id) on delete restrict,
  step_entity_id uuid references public.entities(id) on delete set null,
  position text not null,
  year integer,
  notes text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Cultos y acontecimientos
-- -----------------------------------------------------------------------------

create table public.cults (
  id uuid primary key default gen_random_uuid(),
  brotherhood_entity_id uuid not null references public.entities(id) on delete cascade,
  image_entity_id uuid references public.entities(id) on delete set null,
  cult_type text not null,
  title text not null,
  cult_date date,
  date_rule text,
  month smallint check (month between 1 and 12),
  time_text text,
  place_id uuid references public.places(id) on delete set null,
  description text,
  status text not null default 'published' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now()
);

create table public.events (
  entity_id uuid primary key references public.entities(id) on delete cascade,
  event_type text not null,
  event_date date,
  event_date_text text,
  place_id uuid references public.places(id) on delete set null,
  description text
);

-- -----------------------------------------------------------------------------
-- Fuentes
-- -----------------------------------------------------------------------------

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text,
  source_type text not null,
  author_or_publisher text,
  publication_date date,
  accessed_at date,
  license text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.source_links (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete cascade,
  entity_id uuid references public.entities(id) on delete cascade,
  outing_id uuid references public.outings(id) on delete cascade,
  cult_id uuid references public.cults(id) on delete cascade,
  intervention_id uuid references public.heritage_interventions(id) on delete cascade,
  scope text,
  notes text,
  created_at timestamptz not null default now(),
  constraint source_links_one_target check (
    num_nonnulls(entity_id, outing_id, cult_id, intervention_id) = 1
  )
);

-- -----------------------------------------------------------------------------
-- Contenido diario de la Home
-- La Home consulta la fecha; no es necesario modificar código a las 00:00.
-- -----------------------------------------------------------------------------

create table public.daily_content (
  id uuid primary key default gen_random_uuid(),
  publish_date date not null,
  content_type text not null check (content_type in ('ephemeris','fact','curiosity','march')),
  title text,
  summary text,
  entity_id uuid references public.entities(id) on delete set null,
  sort_order smallint not null default 0,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (publish_date, content_type)
);

create index daily_content_date_idx on public.daily_content(publish_date, status);

create trigger daily_content_set_updated_at
before update on public.daily_content
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Colaboraciones
-- Nunca editan la enciclopedia directamente.
-- -----------------------------------------------------------------------------

create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  contribution_type text not null,
  entity_id uuid references public.entities(id) on delete set null,
  title text,
  description text not null,
  source_url text,
  contact_name text,
  contact_email text,
  status text not null default 'pending' check (status in ('pending','review','accepted','rejected','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger contributions_set_updated_at
before update on public.contributions
for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- Lectura pública solo de contenido publicado. Aportaciones: inserción pública,
-- sin lectura pública.
-- -----------------------------------------------------------------------------

alter table public.municipalities enable row level security;
alter table public.places enable row level security;
alter table public.entities enable row level security;
alter table public.brotherhoods enable row level security;
alter table public.advocations enable row level security;
alter table public.images enable row level security;
alter table public.brotherhood_images enable row level security;
alter table public.agents enable row level security;
alter table public.agent_roles enable row level security;
alter table public.steps enable row level security;
alter table public.brotherhood_steps enable row level security;
alter table public.image_steps enable row level security;
alter table public.entity_relations enable row level security;
alter table public.entity_locations enable row level security;
alter table public.heritage_assets enable row level security;
alter table public.heritage_interventions enable row level security;
alter table public.bands enable row level security;
alter table public.marches enable row level security;
alter table public.march_authors enable row level security;
alter table public.outings enable row level security;
alter table public.outing_entities enable row level security;
alter table public.accompaniments enable row level security;
alter table public.cults enable row level security;
alter table public.events enable row level security;
alter table public.sources enable row level security;
alter table public.source_links enable row level security;
alter table public.daily_content enable row level security;
alter table public.contributions enable row level security;

create policy "Public municipalities" on public.municipalities for select using (true);
create policy "Public places" on public.places for select using (true);
create policy "Published entities" on public.entities for select using (status = 'published');

create policy "Published brotherhoods" on public.brotherhoods for select using (
  exists (select 1 from public.entities e where e.id = entity_id and e.status = 'published')
);
create policy "Published advocations" on public.advocations for select using (
  exists (select 1 from public.entities e where e.id = entity_id and e.status = 'published')
);
create policy "Published images" on public.images for select using (
  exists (select 1 from public.entities e where e.id = entity_id and e.status = 'published')
);
create policy "Published agents" on public.agents for select using (
  exists (select 1 from public.entities e where e.id = entity_id and e.status = 'published')
);
create policy "Published steps" on public.steps for select using (
  exists (select 1 from public.entities e where e.id = entity_id and e.status = 'published')
);
create policy "Published assets" on public.heritage_assets for select using (
  exists (select 1 from public.entities e where e.id = entity_id and e.status = 'published')
);
create policy "Published bands" on public.bands for select using (
  exists (select 1 from public.entities e where e.id = entity_id and e.status = 'published')
);
create policy "Published marches" on public.marches for select using (
  exists (select 1 from public.entities e where e.id = entity_id and e.status = 'published')
);
create policy "Published events" on public.events for select using (
  exists (select 1 from public.entities e where e.id = entity_id and e.status = 'published')
);

create policy "Published brotherhood image relations" on public.brotherhood_images for select using (status = 'published');
create policy "Published brotherhood step relations" on public.brotherhood_steps for select using (status = 'published');
create policy "Published image step relations" on public.image_steps for select using (status = 'published');
create policy "Published entity relations" on public.entity_relations for select using (status = 'published');
create policy "Published entity locations" on public.entity_locations for select using (status = 'published');
create policy "Published heritage interventions" on public.heritage_interventions for select using (status = 'published');
create policy "Public agent roles" on public.agent_roles for select using (true);
create policy "Public march authors" on public.march_authors for select using (true);
create policy "Published outings" on public.outings for select using (status = 'published');
create policy "Public outing entities" on public.outing_entities for select using (true);
create policy "Published accompaniments" on public.accompaniments for select using (status = 'published');
create policy "Published cults" on public.cults for select using (status = 'published');
create policy "Public sources" on public.sources for select using (true);
create policy "Public source links" on public.source_links for select using (true);
create policy "Published daily content" on public.daily_content for select using (
  status = 'published' and publish_date <= current_date
);

create policy "Anyone can submit contributions" on public.contributions
for insert with check (status = 'pending');

-- -----------------------------------------------------------------------------
-- Primer municipio: Sevilla capital
-- -----------------------------------------------------------------------------

insert into public.municipalities (name, slug, province, autonomous_community, country)
values ('Sevilla', 'sevilla', 'Sevilla', 'Andalucía', 'España')
on conflict (slug) do nothing;
