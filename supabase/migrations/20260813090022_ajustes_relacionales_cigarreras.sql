-- Hilo Cofrade · Ajustes relacionales y contenidos de Las Cigarreras

-- La clasificación y la localidad ya se apoyan en bands.band_type y
-- bands.municipality_id. Esta migración completa la vinculación con una
-- hermandad real, incorpora la próxima extraordinaria y añade el segundo
-- estreno de 2026.

create policy "Panel members can read entity relations"
on public.entity_relations for select to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create entity relations"
on public.entity_relations for insert to authenticated
with check ((select public.can_edit_panel()));

create policy "Editors can update entity relations"
on public.entity_relations for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

create policy "Admins can delete entity relations"
on public.entity_relations for delete to authenticated
using ((select public.can_admin_panel()));

grant select, insert, update, delete on public.entity_relations to authenticated;

-- ---------------------------------------------------------------------------
-- Hermandad vinculada · ficha en preparación
-- ---------------------------------------------------------------------------

insert into public.entities (
  id, entity_type, name, slug, summary, status
)
values (
  'b2000000-0000-0000-0000-000000000001',
  'brotherhood',
  'Hermandad de Las Cigarreras',
  'hermandad-de-las-cigarreras',
  'Hermandad sevillana vinculada históricamente a la Banda de Cornetas y Tambores Nuestra Señora de la Victoria.',
  'draft'
)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary;

insert into public.brotherhoods (
  entity_id, official_name, popular_name, municipality_id, brotherhood_types
)
select
  e.id,
  'Hermandad de Las Cigarreras',
  'Las Cigarreras',
  m.id,
  array['Penitencia']::text[]
from public.entities e
join public.municipalities m on m.slug = 'sevilla'
where e.slug = 'hermandad-de-las-cigarreras'
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  municipality_id = excluded.municipality_id,
  brotherhood_types = excluded.brotherhood_types;

insert into public.entity_relations (
  id, source_entity_id, relation_type, target_entity_id, notes, status
)
select
  'b2100000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'belongs_to_brotherhood',
  e.id,
  'Vinculación institucional de la banda con la Hermandad de Las Cigarreras.',
  'published'
from public.entities e
where e.slug = 'hermandad-de-las-cigarreras'
on conflict (id) do update set
  target_entity_id = excluded.target_entity_id,
  notes = excluded.notes,
  status = excluded.status;

update public.bands
set
  band_type = 'Cornetas y Tambores',
  municipality_id = (select id from public.municipalities where slug = 'sevilla'),
  website_url = 'https://lascigarreras.net/',
  linked_brotherhood_name = 'Hermandad de Las Cigarreras'
where entity_id = 'b1000000-0000-0000-0000-000000000001';

update public.entities
set summary = 'Banda sevillana de cornetas y tambores vinculada a la Hermandad de Las Cigarreras.'
where id = 'b1000000-0000-0000-0000-000000000001';

-- ---------------------------------------------------------------------------
-- Próxima salida extraordinaria · Moriles, 19 de septiembre de 2026
-- ---------------------------------------------------------------------------

insert into public.municipalities (
  id, name, slug, province, autonomous_community, country
)
values (
  'b2200000-0000-0000-0000-000000000001',
  'Moriles',
  'moriles',
  'Córdoba',
  'Andalucía',
  'España'
)
on conflict (slug) do update set
  name = excluded.name,
  province = excluded.province,
  autonomous_community = excluded.autonomous_community,
  country = excluded.country;

insert into public.outings (
  id, brotherhood_entity_id, organizer_name, outing_type, character,
  title, outing_date, year, municipality_id, reason,
  event_status, status
)
select
  'b2300000-0000-0000-0000-000000000001',
  null,
  'Hermandad de Nuestro Padre Jesús Preso',
  'Procesión extraordinaria',
  'extraordinary',
  'Nuestro Padre Jesús Preso',
  date '2026-09-19',
  2026,
  m.id,
  '125.º aniversario de su primera salida procesional',
  'announced',
  'published'
from public.municipalities m
where m.slug = 'moriles'
on conflict (id) do update set
  organizer_name = excluded.organizer_name,
  outing_type = excluded.outing_type,
  character = excluded.character,
  title = excluded.title,
  outing_date = excluded.outing_date,
  year = excluded.year,
  municipality_id = excluded.municipality_id,
  reason = excluded.reason,
  event_status = excluded.event_status,
  status = excluded.status;

insert into public.outing_music_positions (
  id, outing_id, position_code, position_label, sequence_no, notes, status
)
values (
  'b2400000-0000-0000-0000-000000000001',
  'b2300000-0000-0000-0000-000000000001',
  'other',
  null,
  1,
  'La ubicación concreta de la banda no está documentada.',
  'published'
)
on conflict (id) do update set
  position_code = excluded.position_code,
  position_label = excluded.position_label,
  notes = excluded.notes,
  status = excluded.status;

insert into public.outing_music_assignments (
  id, music_position_id, band_entity_id, participation_mode,
  sequence_no, notes, status
)
values (
  'b2500000-0000-0000-0000-000000000001',
  'b2400000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'unspecified',
  1,
  'Participación confirmada; recorrido o tramo sin precisar.',
  'published'
)
on conflict (id) do update set
  participation_mode = excluded.participation_mode,
  notes = excluded.notes,
  status = excluded.status;

-- ---------------------------------------------------------------------------
-- Estreno 2026 · Ánima Christi
-- ---------------------------------------------------------------------------

insert into public.sources (
  id, name, url, source_type, author_or_publisher, accessed_at
)
values (
  'b2600000-0000-0000-0000-000000000001',
  'Ánima Christi',
  'https://www.youtube.com/watch?v=fJ7ID-pC9gI',
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
  'b2700000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'Ánima Christi',
  'Marco Frisina · Adaptación: Cristóbal López Gándara',
  2026,
  'https://www.youtube.com/watch?v=fJ7ID-pC9gI',
  'b2600000-0000-0000-0000-000000000001',
  'published',
  20
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
  'b2800000-0000-0000-0000-000000000001',
  'b2600000-0000-0000-0000-000000000001',
  'b2700000-0000-0000-0000-000000000001',
  'Adaptación y grabación de referencia'
)
on conflict (id) do update set
  source_id = excluded.source_id,
  band_premiere_id = excluded.band_premiere_id,
  scope = excluded.scope;
