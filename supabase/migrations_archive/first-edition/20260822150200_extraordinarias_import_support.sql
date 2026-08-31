-- Hilo Cofrade · Soporte de importación para Extraordinarias 2026
-- Conserva la REF de origen y permite lugares/bandas aún no normalizados sin crear fichas públicas incompletas.

alter table public.outings
  add column if not exists reference_code text,
  add column if not exists origin_text text,
  add column if not exists destination_text text;

create unique index if not exists outings_reference_code_uidx
  on public.outings(reference_code);

alter table public.outing_schedule_items
  add column if not exists place_text text;

alter table public.outing_music_assignments
  alter column band_entity_id drop not null;

alter table public.outing_music_assignments
  add column if not exists band_name_text text;

alter table public.outing_music_assignments
  drop constraint if exists outing_music_assignments_band_required;

alter table public.outing_music_assignments
  add constraint outing_music_assignments_band_required check (
    band_entity_id is not null or nullif(btrim(band_name_text), '') is not null
  );

create or replace view public.outing_music_details
with (security_invoker = true) as
select
  omp.id as music_position_id,
  omp.outing_id,
  omp.sequence_no as position_order,
  omp.position_code,
  omp.position_label,
  omp.step_entity_id,
  se.name as step_name,
  oma.id as music_assignment_id,
  oma.sequence_no as band_order,
  oma.band_entity_id,
  coalesce(be.name, oma.band_name_text) as band_name,
  oma.participation_mode,
  oma.segment_start_label,
  oma.segment_end_label,
  oma.notes
from public.outing_music_positions omp
left join public.entities se on se.id = omp.step_entity_id
join public.outing_music_assignments oma on oma.music_position_id = omp.id
left join public.entities be on be.id = oma.band_entity_id
where omp.status = 'published'
  and oma.status = 'published'
order by omp.outing_id, omp.sequence_no, oma.sequence_no;

drop view if exists public.extraordinary_outings_directory;
create view public.extraordinary_outings_directory
with (security_invoker = true) as
select
  o.id,
  o.slug,
  o.brotherhood_entity_id,
  coalesce(be.name, o.organizer_name) as brotherhood_name,
  o.organizer_name,
  o.title,
  o.outing_type,
  o.outing_date,
  o.year,
  o.departure_time,
  o.return_date,
  o.return_time,
  o.reason,
  o.description,
  o.public_notes,
  o.event_status,
  o.municipality_id,
  m.name as municipality_name,
  m.province,
  o.origin_place_id,
  coalesce(op.name, o.origin_text) as origin_place_name,
  o.destination_place_id,
  coalesce(dp.name, o.destination_text) as destination_place_name,
  o.route_summary,
  o.hero_image_path,
  o.hero_image_alt,
  o.hero_image_credit,
  o.reference_code
from public.outings o
left join public.entities be on be.id = o.brotherhood_entity_id
left join public.municipalities m on m.id = o.municipality_id
left join public.places op on op.id = o.origin_place_id
left join public.places dp on dp.id = o.destination_place_id
where o.status = 'published'
  and o.character = 'extraordinary';

drop view if exists public.upcoming_extraordinary_outings;
create view public.upcoming_extraordinary_outings
with (security_invoker = true) as
select
  o.id,
  o.brotherhood_entity_id,
  coalesce(be.name, o.organizer_name) as brotherhood_name,
  o.organizer_name,
  o.title,
  o.outing_type,
  o.outing_date,
  o.departure_time,
  o.return_date,
  o.return_time,
  o.reason,
  o.municipality_id,
  m.name as municipality_name,
  o.origin_place_id,
  coalesce(op.name, o.origin_text) as origin_place_name,
  o.destination_place_id,
  coalesce(dp.name, o.destination_text) as destination_place_name,
  o.route_summary,
  o.hero_image_path,
  o.hero_image_alt,
  o.hero_image_credit,
  o.slug,
  m.province,
  o.reference_code
from public.outings o
left join public.entities be on be.id = o.brotherhood_entity_id
left join public.municipalities m on m.id = o.municipality_id
left join public.places op on op.id = o.origin_place_id
left join public.places dp on dp.id = o.destination_place_id
where o.status = 'published'
  and o.event_status = 'announced'
  and o.character = 'extraordinary'
  and o.outing_date >= (now() at time zone 'Europe/Madrid')::date
  and m.province = 'Sevilla'
order by o.outing_date, o.departure_time nulls last;
