-- Permite que cada cruceta conserve la identidad cromática de su documento
-- original sin alterar la paleta general de la Hermandad o de la Banda.

alter table public.musical_repertoires
  add column if not exists primary_color text,
  add column if not exists accent_color text;

alter table public.musical_repertoires
  drop constraint if exists musical_repertoires_primary_color_format,
  drop constraint if exists musical_repertoires_accent_color_format;

alter table public.musical_repertoires
  add constraint musical_repertoires_primary_color_format
    check (primary_color is null or primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  add constraint musical_repertoires_accent_color_format
    check (accent_color is null or accent_color ~ '^#[0-9A-Fa-f]{6}$');

comment on column public.musical_repertoires.primary_color is
  'Color principal documentado en la fuente visual de la cruceta.';
comment on column public.musical_repertoires.accent_color is
  'Color de acento documentado en la fuente visual de la cruceta.';
