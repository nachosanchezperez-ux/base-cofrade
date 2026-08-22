-- Hilo Cofrade · Slots multimedia para Extraordinarias

create table public.outing_media (
  id uuid primary key default gen_random_uuid(),
  outing_id uuid not null references public.outings(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  role text not null check (role = any (array['poster'::text, 'gallery'::text])),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (outing_id, media_asset_id, role)
);

create unique index outing_media_one_poster_idx
  on public.outing_media (outing_id)
  where role = 'poster';

alter table public.outing_media enable row level security;

grant select on public.outing_media to anon, authenticated;
grant insert, update, delete on public.outing_media to authenticated;

create policy "Public outing media"
  on public.outing_media
  for select
  to public
  using (
    exists (
      select 1
      from public.outings o
      where o.id = outing_media.outing_id
        and o.status = 'published'
    )
    and exists (
      select 1
      from public.media_assets m
      where m.id = outing_media.media_asset_id
        and m.rights_status = any (array['owned'::text, 'authorized'::text, 'licensed'::text, 'public_domain'::text])
    )
  );

create policy "Panel members can read outing media"
  on public.outing_media
  for select
  to authenticated
  using ((select is_panel_member()));

create policy "Editors can create outing media"
  on public.outing_media
  for insert
  to authenticated
  with check ((select can_publish_panel()));

create policy "Editors can update outing media"
  on public.outing_media
  for update
  to authenticated
  using ((select can_publish_panel()))
  with check ((select can_publish_panel()));

create policy "Editors can delete outing media"
  on public.outing_media
  for delete
  to authenticated
  using ((select can_publish_panel()));
