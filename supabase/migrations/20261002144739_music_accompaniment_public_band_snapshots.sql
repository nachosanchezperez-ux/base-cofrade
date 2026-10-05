alter table public.music_accompaniment_periods
  add column if not exists public_band_name text,
  add column if not exists public_band_slug text;

comment on column public.music_accompaniment_periods.public_band_name is
  'Public snapshot of the formation name, used when its entity profile is not yet publishable.';

comment on column public.music_accompaniment_periods.public_band_slug is
  'Optional canonical slug snapshot for the formation; never implies that the band entity is published.';
