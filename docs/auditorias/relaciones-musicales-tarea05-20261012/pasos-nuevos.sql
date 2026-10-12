-- TAREA 05 · Creación de los 3 pasos documentados de Hermandades publicadas (12/10/2026).
-- Autorizado por el propietario: «Publicados».
-- IDs fijos para una reversión exacta (pasos-nuevos-rollback.sql). Idempotente (on conflict do nothing).

-- Fuentes nuevas
insert into public.sources (id, name, url, source_type, author_or_publisher, publication_date, accessed_at, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca05',
  'El palio de la Virgen de la Salud del Santo Ángel avanza en Bordados Salteras',
  'https://www.andaluciainformacion.es/articulo/la-pasion/palio-virgen-salud-santo-angel-avanza-bordados-salteras/202605041244273253599.html',
  'Prensa cofrade', 'Andalucía Información', '2026-05-04', '2026-10-12',
  'Acredita el futuro paso de palio de María Santísima de la Salud (Agrupación de Fieles del Cristo de los Desamparados), en ejecución en mayo de 2026 como estreno para la Semana Santa siguiente.'),
 ('7a5c0e05-2026-4012-8000-00000000ca06',
  'Hermandad de la Soledad de Castilblanco · Las Nieves de Olivares',
  'https://lasnievesdeolivares.com/hermandad-de-la-soledad-de-castilblanco/',
  'Web oficial', 'A.M. Las Nieves de Olivares', null, '2026-10-12',
  'Titulares: Santísimo Cristo de la Misericordia en su Santo Entierro y Nuestra Señora de los Dolores en su Soledad. Estación de penitencia el Sábado Santo con «ambos pasos». La banda acompaña desde 2023.')
on conflict (id) do nothing;

-- Entidades de paso (publicadas)
insert into public.entities (id, entity_type, name, slug, summary, status) values
 ('7a5c0e05-2026-4012-8000-0000000057a1', 'step', 'Paso de palio de María Santísima de la Salud', 'paso-palio-salud-santo-angel',
  'Paso de palio de María Santísima de la Salud, de la Agrupación del Cristo de los Desamparados del Santo Ángel. En 2026 se ejecuta su techo de palio para estrenarlo en la Semana Santa siguiente.', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000057a2', 'step', 'Paso de la Pura y Limpia Concepción', 'paso-pura-limpia-postigo',
  'Paso de la procesión de la Pura y Limpia del Postigo en Sevilla.', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000057a3', 'step', 'Paso de Nuestra Señora de los Dolores en su Soledad', 'paso-soledad-castilblanco',
  'Paso de Nuestra Señora de los Dolores en su Soledad en la estación de penitencia del Sábado Santo de Castilblanco de los Arroyos.', 'published')
on conflict (id) do nothing;

insert into public.steps (entity_id, step_type, description, execution_date_text) values
 ('7a5c0e05-2026-4012-8000-0000000057a1', 'Paso de palio',
  'Futuro paso de palio de María Santísima de la Salud. En mayo de 2026 el techo de palio estaba en ejecución en Bordados Salteras, como estreno para la Semana Santa siguiente.',
  'En ejecución en 2026'),
 ('7a5c0e05-2026-4012-8000-0000000057a2', 'Paso procesional de Gloria',
  'Paso que porta a la Pura y Limpia Concepción en su procesión de diciembre.', null),
 ('7a5c0e05-2026-4012-8000-0000000057a3', 'Paso de Virgen',
  'Uno de los dos pasos de la estación de penitencia del Sábado Santo de la Hermandad. Sobre él procesiona Nuestra Señora de los Dolores en su Soledad.', null)
on conflict (entity_id) do nothing;

-- Relaciones Hermandad → Paso
insert into public.brotherhood_steps (id, brotherhood_entity_id, step_entity_id, relation_type, date_from_text, notes, status) values
 ('7a5c0e05-2026-4012-8000-0000000057b1', 'ced91e3c-e022-441f-af0f-5384a0e97acd', '7a5c0e05-2026-4012-8000-0000000057a1', 'processional_step', 'En ejecución en 2026', 'Palio en ejecución para su estreno.', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000057b2', '5d8d6faa-95b3-415e-9aab-42e38b813c6a', '7a5c0e05-2026-4012-8000-0000000057a2', 'processional_step', null, 'Paso de la procesión de la Pura y Limpia.', 'published'),
 ('7a5c0e05-2026-4012-8000-0000000057b3', 'c35cc7a2-c6fa-421a-8056-ff8e24b1529a', '7a5c0e05-2026-4012-8000-0000000057a3', 'processional_step', null, 'Paso de la Virgen en la estación de penitencia del Sábado Santo.', 'published')
on conflict (id) do nothing;

-- Imagen → Paso (solo donde la imagen existe en Hilo Cofrade)
insert into public.image_steps (id, image_entity_id, step_entity_id, relation_type, notes, status) values
 ('7a5c0e05-2026-4012-8000-0000000057c1', '40e14de2-02e7-4024-b628-528881b73b7e', '7a5c0e05-2026-4012-8000-0000000057a1', 'processes_on', 'María Santísima de la Salud procesionará bajo este palio.', 'published')
on conflict (id) do nothing;

-- Fuentes de los pasos y de sus relaciones
insert into public.source_links (source_id, entity_id, brotherhood_step_id, image_step_id, scope)
select v.source_id, v.entity_id, v.bs_id, v.is_id, v.scope
from (values
  ('7a5c0e05-2026-4012-8000-00000000ca05'::uuid, '7a5c0e05-2026-4012-8000-0000000057a1'::uuid, null::uuid, null::uuid, 'Identificación del paso'),
  ('7a5c0e05-2026-4012-8000-00000000ca05', null, '7a5c0e05-2026-4012-8000-0000000057b1', null, 'Identificación del paso'),
  ('7a5c0e05-2026-4012-8000-00000000ca05', null, null, '7a5c0e05-2026-4012-8000-0000000057c1', 'Identificación del paso'),
  ('b8b09ffc-717d-4cb3-86a7-7aed5d075cfa', '7a5c0e05-2026-4012-8000-0000000057a2', null, null, 'Identificación del paso'),
  ('b8b09ffc-717d-4cb3-86a7-7aed5d075cfa', null, '7a5c0e05-2026-4012-8000-0000000057b2', null, 'Identificación del paso'),
  ('7a5c0e05-2026-4012-8000-00000000ca06', '7a5c0e05-2026-4012-8000-0000000057a3', null, null, 'Identificación del paso'),
  ('7a5c0e05-2026-4012-8000-00000000ca06', null, '7a5c0e05-2026-4012-8000-0000000057b3', null, 'Identificación del paso')
) as v(source_id, entity_id, bs_id, is_id, scope)
where not exists (
  select 1 from public.source_links s
  where s.source_id = v.source_id
    and s.entity_id is not distinct from v.entity_id
    and s.brotherhood_step_id is not distinct from v.bs_id
    and s.image_step_id is not distinct from v.is_id);

-- Periodos musicales → paso
update public.music_accompaniment_periods set step_entity_id = '7a5c0e05-2026-4012-8000-0000000057a1'
where id = '82805953-88c0-4b37-ae31-f8f6dd7115d9' and step_entity_id is null;
update public.music_accompaniment_periods set step_entity_id = '7a5c0e05-2026-4012-8000-0000000057a2'
where id = '722fc020-a9f7-4303-a4bc-607fd18b9617' and step_entity_id is null;
update public.music_accompaniment_periods set step_entity_id = '7a5c0e05-2026-4012-8000-0000000057a3'
where id = 'b1a33d33-e6ad-4646-bcd3-f6821a7a26c6' and step_entity_id is null;
