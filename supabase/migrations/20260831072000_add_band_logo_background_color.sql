-- Evolución posterior al baseline canónico de la Primera Edición.
alter table public.bands
  add column if not exists logo_background_color text;

alter table public.bands
  drop constraint if exists bands_logo_background_color_format;

alter table public.bands
  add constraint bands_logo_background_color_format check (
    logo_background_color is null
    or logo_background_color ~ '^#[0-9A-F]{6}$'
  );

comment on column public.bands.logo_background_color is
  'Color HEX opcional y exclusivo de la pastilla del logotipo. NULL conserva la presentación pública predeterminada y no sustituye los colores corporativos.';
