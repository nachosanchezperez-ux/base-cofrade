create table if not exists public.cult_media (
  id uuid primary key default gen_random_uuid(),
  cult_id uuid not null references public.cults(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  role text not null default 'gallery',
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  focus_x numeric not null default 50,
  focus_y numeric not null default 50,
  mobile_focus_x numeric,
  mobile_focus_y numeric,
  fit_mode text not null default 'cover',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cult_media_role_check check (role in ('cover', 'gallery')),
  constraint cult_media_fit_mode_check check (fit_mode in ('auto', 'cover', 'contain')),
  constraint cult_media_focus_x_check check (focus_x between 0 and 100),
  constraint cult_media_focus_y_check check (focus_y between 0 and 100),
  constraint cult_media_mobile_focus_x_check check (mobile_focus_x is null or mobile_focus_x between 0 and 100),
  constraint cult_media_mobile_focus_y_check check (mobile_focus_y is null or mobile_focus_y between 0 and 100),
  constraint cult_media_cover_role_check check (not is_cover or role = 'cover'),
  constraint cult_media_cult_asset_role_key unique (cult_id, media_asset_id, role)
);

create index if not exists cult_media_cult_id_idx
  on public.cult_media (cult_id, sort_order);

create unique index if not exists cult_media_single_cover_idx
  on public.cult_media (cult_id)
  where is_cover;

drop trigger if exists set_cult_media_updated_at on public.cult_media;
create trigger set_cult_media_updated_at
  before update on public.cult_media
  for each row execute function public.set_updated_at();

alter table public.cult_media enable row level security;

revoke all on table public.cult_media from anon, authenticated;
grant select on table public.cult_media to anon;
grant select, insert, update, delete on table public.cult_media to authenticated;
grant all on table public.cult_media to service_role;

drop policy if exists "Public cult media" on public.cult_media;
create policy "Public cult media"
  on public.cult_media
  for select
  to public
  using (
    exists (
      select 1
      from public.cults c
      where c.id = cult_media.cult_id
        and c.status = 'published'
    )
    and exists (
      select 1
      from public.media_assets m
      where m.id = cult_media.media_asset_id
        and m.rights_status in ('owned', 'authorized', 'licensed', 'public_domain')
    )
  );

drop policy if exists "Panel members can read cult media" on public.cult_media;
create policy "Panel members can read cult media"
  on public.cult_media
  for select
  to authenticated
  using ((select public.is_panel_member()));

drop policy if exists "Editors can create cult media" on public.cult_media;
create policy "Editors can create cult media"
  on public.cult_media
  for insert
  to authenticated
  with check ((select public.can_publish_panel()));

drop policy if exists "Editors can update cult media" on public.cult_media;
create policy "Editors can update cult media"
  on public.cult_media
  for update
  to authenticated
  using ((select public.can_publish_panel()))
  with check ((select public.can_publish_panel()));

drop policy if exists "Editors can delete cult media" on public.cult_media;
create policy "Editors can delete cult media"
  on public.cult_media
  for delete
  to authenticated
  using ((select public.can_publish_panel()));

comment on table public.cult_media is
  'Archivo visual vinculado a cultos recurrentes o concretos, con portada y encuadre editorial.';
