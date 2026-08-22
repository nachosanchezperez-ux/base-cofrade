-- Metadatos de presentación de portadas. Esta migración ya está aplicada en producción.
alter table public.media_assets
  add column if not exists width_px integer,
  add column if not exists height_px integer;

alter table public.media_assets
  drop constraint if exists media_assets_width_px_check,
  add constraint media_assets_width_px_check check (width_px is null or width_px > 0),
  drop constraint if exists media_assets_height_px_check,
  add constraint media_assets_height_px_check check (height_px is null or height_px > 0);

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
  add constraint entity_media_mobile_focus_x_check check (mobile_focus_x is null or mobile_focus_x between 0 and 100),
  drop constraint if exists entity_media_mobile_focus_y_check,
  add constraint entity_media_mobile_focus_y_check check (mobile_focus_y is null or mobile_focus_y between 0 and 100),
  drop constraint if exists entity_media_fit_mode_check,
  add constraint entity_media_fit_mode_check check (fit_mode in ('auto', 'cover', 'contain'));

with ranked_covers as (
  select id, row_number() over (partition by entity_id order by sort_order asc, id asc) as cover_rank
  from public.entity_media
  where is_cover = true
)
update public.entity_media as relation
set is_cover = false
from ranked_covers
where relation.id = ranked_covers.id and ranked_covers.cover_rank > 1;

create unique index if not exists entity_media_one_cover_per_entity_idx
  on public.entity_media(entity_id)
  where is_cover = true;

comment on column public.entity_media.focus_x is 'Horizontal focal point (0-100) used by editorial crops.';
comment on column public.entity_media.focus_y is 'Vertical focal point (0-100) used by editorial crops.';
comment on column public.entity_media.mobile_focus_x is 'Optional mobile horizontal focal point. Falls back to focus_x.';
comment on column public.entity_media.mobile_focus_y is 'Optional mobile vertical focal point. Falls back to focus_y.';
comment on column public.entity_media.fit_mode is 'Editorial rendering mode: auto, cover or contain.';

update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
where id = 'hilo-media';
