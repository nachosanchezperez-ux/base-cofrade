-- HC Hero System: presentation metadata belongs to the media relation, not to a slug.
alter table public.media_assets
  add column if not exists width_px integer,
  add column if not exists height_px integer;

alter table public.media_assets
  drop constraint if exists media_assets_width_px_check,
  add constraint media_assets_width_px_check
    check (width_px is null or width_px > 0),
  drop constraint if exists media_assets_height_px_check,
  add constraint media_assets_height_px_check
    check (height_px is null or height_px > 0);

alter table public.entity_media
  add column if not exists focus_x numeric(5,2) not null default 50,
  add column if not exists focus_y numeric(5,2) not null default 50,
  add column if not exists mobile_focus_x numeric(5,2),
  add column if not exists mobile_focus_y numeric(5,2),
  add column if not exists fit_mode text not null default 'auto';

alter table public.entity_media
  drop constraint if exists entity_media_focus_x_check,
  add constraint entity_media_focus_x_check check (focus_x between 0 and 100),
  drop constraint if exists entity_media_focus_y_check,
  add constraint entity_media_focus_y_check check (focus_y between 0 and 100),
  drop constraint if exists entity_media_mobile_focus_x_check,
  add constraint entity_media_mobile_focus_x_check
    check (mobile_focus_x is null or mobile_focus_x between 0 and 100),
  drop constraint if exists entity_media_mobile_focus_y_check,
  add constraint entity_media_mobile_focus_y_check
    check (mobile_focus_y is null or mobile_focus_y between 0 and 100),
  drop constraint if exists entity_media_fit_mode_check,
  add constraint entity_media_fit_mode_check check (fit_mode in ('auto', 'cover', 'contain'));

-- Keep the earliest explicit cover if legacy content contains more than one.
with ranked_covers as (
  select
    id,
    row_number() over (
      partition by entity_id
      order by sort_order asc, id asc
    ) as cover_rank
  from public.entity_media
  where is_cover = true
)
update public.entity_media as relation
set is_cover = false
from ranked_covers
where relation.id = ranked_covers.id
  and ranked_covers.cover_rank > 1;

create unique index if not exists entity_media_one_cover_per_entity_idx
  on public.entity_media(entity_id)
  where is_cover = true;

-- Preserve the two carefully tuned legacy crops as data. Future crops are edited in the panel.
update public.entity_media as relation
set focus_y = case entity.slug
    when 'paso-misterio-sagrada-cena-sevilla' then 40
    when 'paso-cristo-humildad-y-paciencia-la-cena' then 28
    else relation.focus_y
  end,
  mobile_focus_y = case entity.slug
    when 'paso-misterio-sagrada-cena-sevilla' then 38
    when 'paso-cristo-humildad-y-paciencia-la-cena' then 26
    else relation.mobile_focus_y
  end
from public.entities as entity
where entity.id = relation.entity_id
  and relation.is_cover = true
  and entity.slug in (
    'paso-misterio-sagrada-cena-sevilla',
    'paso-cristo-humildad-y-paciencia-la-cena'
  );

comment on column public.entity_media.focus_x is
  'Horizontal focal point (0-100) used by editorial crops.';
comment on column public.entity_media.focus_y is
  'Vertical focal point (0-100) used by editorial crops.';
comment on column public.entity_media.mobile_focus_x is
  'Optional mobile horizontal focal point. Falls back to focus_x.';
comment on column public.entity_media.mobile_focus_y is
  'Optional mobile vertical focal point. Falls back to focus_y.';
comment on column public.entity_media.fit_mode is
  'Editorial rendering mode: auto, cover or contain.';

update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
where id = 'hilo-media';
