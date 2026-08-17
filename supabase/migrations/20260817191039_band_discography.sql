-- Hilo Cofrade · Discografía de Bandas
-- Migración 039
--
-- Modela publicaciones discográficas sin convertir Spotify en fuente de verdad.
-- Las pistas pueden enlazarse a Marchas cuando esas entidades existan.

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

create trigger band_releases_set_updated_at
before update on public.band_releases
for each row execute function public.set_updated_at();

alter table public.source_links
  add column if not exists band_release_id uuid references public.band_releases(id) on delete cascade;

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
      band_release_id
    ) = 1
  );

alter table public.band_releases enable row level security;
alter table public.band_release_tracks enable row level security;

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
