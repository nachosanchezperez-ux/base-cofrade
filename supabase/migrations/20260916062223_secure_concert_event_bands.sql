create policy "Published concert event bands"
on public.concert_event_bands
for select
to anon, authenticated
using (
  status = 'published'::text
  and exists (
    select 1
    from public.events event
    join public.entities event_entity on event_entity.id = event.entity_id
    where event.entity_id = concert_event_bands.event_entity_id
      and event.event_category = 'concert'::text
      and event_entity.entity_type = 'event'::text
      and event_entity.status = 'published'::text
  )
  and exists (
    select 1
    from public.entities band
    where band.id = concert_event_bands.band_entity_id
      and band.entity_type = 'band'::text
      and band.status = 'published'::text
  )
);

create policy "Panel members can read concert event bands"
on public.concert_event_bands
for select
to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create concert event bands"
on public.concert_event_bands
for insert
to authenticated
with check (
  (select public.can_edit_panel())
  and (status <> 'published'::text or (select public.can_publish_panel()))
);

create policy "Editors can update concert event bands"
on public.concert_event_bands
for update
to authenticated
using (
  (select public.can_edit_panel())
  and (status <> 'published'::text or (select public.can_publish_panel()))
)
with check (
  (select public.can_edit_panel())
  and (status <> 'published'::text or (select public.can_publish_panel()))
);

create policy "Admins can delete concert event bands"
on public.concert_event_bands
for delete
to authenticated
using ((select public.can_admin_panel()));
