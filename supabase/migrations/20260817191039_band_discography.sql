-- Hilo Cofrade · Discografía de Bandas
-- Migración 039
--
-- Modela publicaciones discográficas sin convertir Spotify en fuente de verdad.
-- Las pistas pueden enlazarse a Marchas cuando esas entidades existan.
-- Marcha conserva fuera de esta tabla sus relaciones de autoría y dedicatoria.

create table public.band_releases (
  id uuid primary key default gen_random_uuid(),
  band_entity_id uuid not null references public.entities(id) on delete cascade,
  title text not null,
  release_type text not null default 'album' check (release_type in ('album','ep','single','live','compilation','other')),
  release_year integer,
  release_date date,
  release_date_text text,
  ordinal_number integer,
  description text,
  cover_image_path text,
  cover_image_alt text,
  cover_image_credit text,
  spotify_url text,
  external_url text,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (band_entity_id, title, release_year)
);

create index band_releases_band_idx on public.band_releases(band_entity_id, release_year desc);

create table public.band_release_tracks (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.band_releases(id) on delete cascade,
  sequence_no integer not null,
  title text not null,
  march_entity_id uuid references public.entities(id) on delete set null,
  duration_text text,
  notes text,
  created_at timestamptz not null default now(),
  unique (release_id, sequence_no)
);

create index band_release_tracks_release_idx on public.band_release_tracks(release_id, sequence_no);
create index band_release_tracks_march_idx on public.band_release_tracks(march_entity_id);

-- Fuente documental del lanzamiento. Se mantiene separada de source_links para no
-- reabrir su restricción polimórfica cada vez que nace un nuevo objeto documental.
create table public.band_release_sources (
  release_id uuid not null references public.band_releases(id) on delete cascade,
  source_id uuid not null references public.sources(id) on delete cascade,
  scope text,
  created_at timestamptz not null default now(),
  primary key (release_id, source_id)
);

create trigger band_releases_set_updated_at
before update on public.band_releases
for each row execute function public.set_updated_at();

alter table public.band_releases enable row level security;
alter table public.band_release_tracks enable row level security;
alter table public.band_release_sources enable row level security;

create policy "Published band releases"
on public.band_releases for select
using (
  status = 'published'
  and exists (
    select 1 from public.entities e
    where e.id = band_entity_id and e.status = 'published'
  )
);

create policy "Tracks of published band releases"
on public.band_release_tracks for select
using (
  exists (
    select 1 from public.band_releases release
    join public.entities band on band.id = release.band_entity_id
    where release.id = release_id
      and release.status = 'published'
      and band.status = 'published'
  )
);

create policy "Sources of published band releases"
on public.band_release_sources for select
using (
  exists (
    select 1 from public.band_releases release
    join public.entities band on band.id = release.band_entity_id
    where release.id = release_id
      and release.status = 'published'
      and band.status = 'published'
  )
);
