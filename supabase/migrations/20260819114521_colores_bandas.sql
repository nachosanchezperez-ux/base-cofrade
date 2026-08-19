create table if not exists public.band_colors (
  id uuid primary key default gen_random_uuid(),
  band_entity_id uuid not null references public.entities(id) on delete cascade,
  color_name text not null,
  hex_value text,
  color_role text not null default 'identity',
  sort_order smallint not null default 0,
  notes text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint band_colors_band_entity_id_color_name_key unique (band_entity_id, color_name),
  constraint band_colors_color_role_check check (color_role = any (array['primary'::text, 'secondary'::text, 'accent'::text, 'identity'::text])),
  constraint band_colors_hex_format check (hex_value is null or hex_value ~ '^#[0-9A-Fa-f]{6}$'),
  constraint band_colors_status_check check (status = any (array['draft'::text, 'review'::text, 'published'::text, 'archived'::text]))
);

create index if not exists band_colors_band_idx on public.band_colors (band_entity_id, sort_order);
create index if not exists band_colors_status_idx on public.band_colors (status);

create trigger band_colors_set_updated_at
before update on public.band_colors
for each row execute function public.set_updated_at();

alter table public.band_colors enable row level security;

create policy "Published band colors"
on public.band_colors for select
to public
using (status = 'published');

create policy "Panel members can read band_colors"
on public.band_colors for select
to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create band_colors"
on public.band_colors for insert
to authenticated
with check ((select public.can_edit_panel()) and (status <> 'published' or (select public.can_publish_panel())));

create policy "Editors can update band_colors"
on public.band_colors for update
to authenticated
using ((select public.can_edit_panel()) and (status <> 'published' or (select public.can_publish_panel())))
with check ((select public.can_edit_panel()) and (status <> 'published' or (select public.can_publish_panel())));

create policy "Admins can delete band_colors"
on public.band_colors for delete
to authenticated
using ((select public.can_admin_panel()));

create or replace view public.published_band_colors as
select
  bc.id,
  bc.band_entity_id,
  e.name as band_name,
  bc.color_name,
  bc.hex_value,
  bc.color_role,
  bc.sort_order,
  bc.notes
from public.band_colors bc
join public.entities e on e.id = bc.band_entity_id
where bc.status = 'published'
  and e.status = 'published';
