-- Hilo Cofrade · Fichas editoriales de bandas y estrenos musicales

alter table public.bands
  add column if not exists primary_color text,
  add column if not exists secondary_color text,
  add column if not exists logo_path text,
  add column if not exists hero_image_path text,
  add column if not exists hero_image_alt text,
  add column if not exists hero_image_credit text,
  add column if not exists linked_brotherhood_name text,
  add column if not exists headquarters_text text;

alter table public.bands
  drop constraint if exists bands_primary_color_format,
  drop constraint if exists bands_secondary_color_format;

alter table public.bands
  add constraint bands_primary_color_format check (
    primary_color is null or primary_color ~ '^#[0-9A-Fa-f]{6}$'
  ),
  add constraint bands_secondary_color_format check (
    secondary_color is null or secondary_color ~ '^#[0-9A-Fa-f]{6}$'
  );

create table public.band_premieres (
  id uuid primary key default gen_random_uuid(),
  band_entity_id uuid not null references public.entities(id) on delete cascade,
  title text not null,
  composer_name text not null,
  premiere_year integer not null check (premiere_year between 1800 and 2200),
  premiere_date date,
  venue_text text,
  municipality_text text,
  video_url text,
  description text,
  source_id uuid references public.sources(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (band_entity_id, title, premiere_year)
);

create index band_premieres_band_idx
  on public.band_premieres(band_entity_id, premiere_year desc, display_order, title);

create trigger band_premieres_set_updated_at
before update on public.band_premieres
for each row execute function public.set_updated_at();

alter table public.source_links
  add column if not exists band_premiere_id uuid references public.band_premieres(id) on delete cascade;

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
      image_authorship_id,
      brotherhood_image_id,
      entity_location_id,
      entity_relation_id,
      step_phase_id,
      step_personnel_period_id,
      brotherhood_step_id,
      image_step_id,
      agent_name_id,
      agent_role_id,
      cult_occurrence_id,
      outing_music_position_id,
      outing_music_assignment_id,
      outing_series_id,
      band_premiere_id
    ) = 1
  );

alter table public.band_premieres enable row level security;

create policy "Published band premieres"
on public.band_premieres for select
using (
  status = 'published'
  and exists (
    select 1 from public.entities e
    where e.id = band_entity_id and e.status = 'published'
  )
);

create policy "Panel members can read band premieres"
on public.band_premieres for select to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create band premieres"
on public.band_premieres for insert to authenticated
with check ((select public.can_edit_panel()));

create policy "Editors can update band premieres"
on public.band_premieres for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

create policy "Admins can delete band premieres"
on public.band_premieres for delete to authenticated
using ((select public.can_admin_panel()));

grant select on public.band_premieres to anon, authenticated;
grant insert, update, delete on public.band_premieres to authenticated;

-- Las tablas musicales anteriores a la creación del panel conservaban solo
-- políticas públicas. Se habilita ahora su edición desde el panel.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'band_names', 'band_agents', 'music_accompaniment_periods',
    'outing_music_positions', 'outing_music_assignments'
  ]
  loop
    execute format(
      'create policy %I on public.%I for select to authenticated using ((select public.is_panel_member()))',
      'Panel members can read ' || table_name, table_name
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check ((select public.can_edit_panel()))',
      'Editors can create ' || table_name, table_name
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using ((select public.can_edit_panel())) with check ((select public.can_edit_panel()))',
      'Editors can update ' || table_name, table_name
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using ((select public.can_admin_panel()))',
      'Admins can delete ' || table_name, table_name
    );
    execute format('grant select, insert, update, delete on public.%I to authenticated', table_name);
  end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- Banda de Cornetas y Tambores Nuestra Señora de la Victoria · Las Cigarreras
-- ---------------------------------------------------------------------------

insert into public.entities (id, entity_type, name, slug, summary, status)
values (
  'b1000000-0000-0000-0000-000000000001',
  'band',
  'Las Cigarreras',
  'las-cigarreras',
  'Banda sevillana de cornetas y tambores vinculada a la Hermandad de la Columna y Azotes.',
  'published'
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  summary = excluded.summary,
  status = excluded.status;

insert into public.bands (
  entity_id, band_type, municipality_id, foundation_text,
  description, primary_color, secondary_color, logo_path,
  hero_image_path, hero_image_alt, hero_image_credit,
  linked_brotherhood_name, headquarters_text
)
select
  'b1000000-0000-0000-0000-000000000001',
  'Cornetas y Tambores',
  m.id,
  '1979',
  'Formación musical sevillana conocida popularmente como Las Cigarreras. Su ficha reúne identidad, trayectoria, acompañamientos, dirección, salidas extraordinarias y estrenos documentados.',
  '#63358B',
  '#29272C',
  '/bandas/las-cigarreras/imagotipo.svg',
  '/bandas/las-cigarreras/cigarreras-corneta.jpg',
  'Corneta de Las Cigarreras con la gala bordada de la formación',
  'Fotografía facilitada por la banda',
  'Hermandad de la Columna y Azotes (Las Cigarreras)',
  'Sevilla'
from public.municipalities m
where m.slug = 'sevilla'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  foundation_text = excluded.foundation_text,
  description = excluded.description,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  logo_path = excluded.logo_path,
  hero_image_path = excluded.hero_image_path,
  hero_image_alt = excluded.hero_image_alt,
  hero_image_credit = excluded.hero_image_credit,
  linked_brotherhood_name = excluded.linked_brotherhood_name,
  headquarters_text = excluded.headquarters_text;

insert into public.band_names (
  id, band_entity_id, name, short_name, name_type, is_current
)
values
  (
    'b1100000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Banda de Cornetas y Tambores Nuestra Señora de la Victoria',
    'BCT Ntra. Sra. de la Victoria',
    'official',
    true
  ),
  (
    'b1100000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'Las Cigarreras',
    'Las Cigarreras',
    'popular',
    true
  )
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  name_type = excluded.name_type,
  is_current = excluded.is_current;

insert into public.sources (
  id, name, url, source_type, author_or_publisher, accessed_at
)
values (
  'b1500000-0000-0000-0000-000000000001',
  'Yo soy la luz del mundo',
  'https://www.youtube.com/watch?v=JiEroqM_31w',
  'video',
  'Banda de Cornetas y Tambores Nuestra Señora de la Victoria',
  current_date
)
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  accessed_at = excluded.accessed_at;

insert into public.band_premieres (
  id, band_entity_id, title, composer_name, premiere_year,
  video_url, source_id, status, display_order
)
values (
  'b1400000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'Yo soy la luz del mundo',
  'Manuel Alejandro González Cruz',
  2026,
  'https://www.youtube.com/watch?v=JiEroqM_31w',
  'b1500000-0000-0000-0000-000000000001',
  'published',
  10
)
on conflict (id) do update set
  title = excluded.title,
  composer_name = excluded.composer_name,
  premiere_year = excluded.premiere_year,
  video_url = excluded.video_url,
  source_id = excluded.source_id,
  status = excluded.status,
  display_order = excluded.display_order;

insert into public.source_links (
  id, source_id, band_premiere_id, scope
)
values (
  'b1600000-0000-0000-0000-000000000001',
  'b1500000-0000-0000-0000-000000000001',
  'b1400000-0000-0000-0000-000000000001',
  'Estreno y grabación de referencia'
)
on conflict (id) do update set
  source_id = excluded.source_id,
  band_premiere_id = excluded.band_premiere_id,
  scope = excluded.scope;
