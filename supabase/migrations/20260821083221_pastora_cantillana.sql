-- Hilo Cofrade · La Pastora de Cantillana
-- Alta relacional de la hermandad, titular, paso, patrimonio, cultos,
-- salidas estables y acompañamiento vigente de la Banda de la Soledad.

-- -----------------------------------------------------------------------------
-- 1. Geografía y lugares
-- -----------------------------------------------------------------------------

insert into public.municipalities (
  name, slug, province, autonomous_community, country
)
values ('Cantillana', 'cantillana', 'Sevilla', 'Andalucía', 'España')
on conflict (slug) do update set
  name = excluded.name,
  province = excluded.province,
  autonomous_community = excluded.autonomous_community,
  country = excluded.country;

insert into public.places (
  municipality_id, name, slug, place_type, address, notes
)
select
  municipality.id,
  'Iglesia Parroquial de Nuestra Señora de la Asunción',
  'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
  'iglesia parroquial',
  'Calle Iglesia, 1',
  coalesce(
    (select place.notes from public.places place
     where place.slug = 'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana'),
    'Templo parroquial de Cantillana.'
  )
from public.municipalities municipality
where municipality.slug = 'cantillana'
on conflict (slug) do update set
  municipality_id = excluded.municipality_id,
  name = excluded.name,
  place_type = excluded.place_type,
  address = coalesce(public.places.address, excluded.address),
  updated_at = now();

insert into public.places (
  municipality_id, name, slug, place_type, notes
)
select
  municipality.id,
  'Santuario de la Divina Pastora',
  'santuario-divina-pastora-cantillana',
  'santuario',
  'Santuario situado en Los Pajares, destino de la romería anual de la Hermandad.'
from public.municipalities municipality
where municipality.slug = 'cantillana'
on conflict (slug) do update set
  municipality_id = excluded.municipality_id,
  name = excluded.name,
  place_type = excluded.place_type,
  notes = excluded.notes,
  updated_at = now();

-- -----------------------------------------------------------------------------
-- 2. Entidades principales
-- -----------------------------------------------------------------------------

drop table if exists pg_temp._hc_pastora_entities;
create temporary table _hc_pastora_entities (
  entity_type text not null,
  name text not null,
  slug text primary key,
  summary text not null,
  status text not null
) on commit drop;

insert into _hc_pastora_entities values
  (
    'brotherhood',
    'La Pastora de Cantillana',
    'pastora-de-cantillana',
    'Hermandad de gloria de Cantillana, fundada en 1720 y establecida canónicamente en la iglesia parroquial de Nuestra Señora de la Asunción.',
    'published'
  ),
  (
    'advocation',
    'Divina Pastora de las Almas',
    'advocacion-divina-pastora-de-las-almas-cantillana',
    'Advocación mariana titular de la Hermandad de la Divina Pastora de Cantillana.',
    'published'
  ),
  (
    'image',
    'Divina Pastora de las Almas de Cantillana',
    'divina-pastora-de-las-almas-de-cantillana',
    'Imagen titular de gloria de la Hermandad de la Divina Pastora de Cantillana.',
    'published'
  ),
  (
    'step',
    'Paso procesional de la Divina Pastora de Cantillana',
    'paso-procesional-divina-pastora-cantillana',
    'Paso de gloria de la Divina Pastora de Cantillana, singularizado por su iluminación eléctrica y por sus adaptaciones técnicas para el uso procesional.',
    'published'
  ),
  (
    'heritage_asset',
    'Risco de la Divina Pastora de Cantillana',
    'risco-divina-pastora-cantillana',
    'Arquitectura efímera de culto que transforma el presbiterio parroquial durante las fiestas de septiembre y mantiene una tradición documentada desde el siglo XVIII.',
    'published'
  ),
  (
    'band',
    'Banda de Música Ntra. Sra. de la Soledad de Cantillana',
    'banda-de-musica-nuestra-senora-de-la-soledad-cantillana',
    'Banda de música de Cantillana vinculada al acompañamiento de la Divina Pastora y a otros cultos y celebraciones de la localidad.',
    'published'
  ),
  (
    'event',
    'Fundación de la Hermandad de la Divina Pastora de Cantillana',
    'fundacion-hermandad-divina-pastora-cantillana-1720',
    'Fundación de la corporación pastoreña de Cantillana en 1720.',
    'published'
  ),
  (
    'event',
    'Regreso de la Banda de la Soledad tras la Divina Pastora',
    'regreso-banda-soledad-divina-pastora-cantillana-2016',
    'La Banda de la Soledad volvió a acompañar a la Divina Pastora en 2016.',
    'published'
  );

insert into public.entities (entity_type, name, slug, summary, status)
select entity_type, name, slug, summary, status
from _hc_pastora_entities
on conflict (slug) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status,
  updated_at = now();

insert into public.brotherhoods (
  entity_id, official_name, popular_name, foundation_text,
  municipality_id, canonical_see_place_id, brotherhood_types,
  current_procession_day, notes
)
select
  brotherhood.id,
  'Pontificia, Real, Ilustre, Franciscana y Muy Antigua Hermandad del Santo Rosario de la Divina Pastora de las Almas y Redil Eucarístico',
  'La Pastora de Cantillana',
  '1720',
  municipality.id,
  parish.id,
  array['Gloria']::text[],
  '8 de septiembre',
  'La corporación celebra sus cultos principales durante septiembre y la romería al Santuario de la Divina Pastora al final del mismo mes.'
from public.entities brotherhood
join public.municipalities municipality on municipality.slug = 'cantillana'
join public.places parish
  on parish.slug = 'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana'
where brotherhood.slug = 'pastora-de-cantillana'
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  foundation_text = excluded.foundation_text,
  municipality_id = excluded.municipality_id,
  canonical_see_place_id = excluded.canonical_see_place_id,
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day,
  notes = excluded.notes;

insert into public.advocations (entity_id, advocation_type, description)
select
  advocation.id,
  'Virgen',
  'Representación de la Virgen María como Divina Pastora de las Almas.'
from public.entities advocation
where advocation.slug = 'advocacion-divina-pastora-de-las-almas-cantillana'
on conflict (entity_id) do update set
  advocation_type = excluded.advocation_type,
  description = excluded.description;

insert into public.images (
  entity_id, advocation_entity_id, image_type, current_condition,
  description, iconography, notes
)
select
  image.id,
  advocation.id,
  'Virgen · Gloriosa',
  'extant',
  'Imagen de la Divina Pastora de las Almas venerada en la parroquia de Nuestra Señora de la Asunción y protagonista de las fiestas de septiembre.',
  'La Virgen aparece bajo la iconografía de la Divina Pastora de las Almas.',
  'Autoría, datación e historial material pendientes de una fuente documental de primera mano.'
from public.entities image
join public.entities advocation
  on advocation.slug = 'advocacion-divina-pastora-de-las-almas-cantillana'
where image.slug = 'divina-pastora-de-las-almas-de-cantillana'
on conflict (entity_id) do update set
  advocation_entity_id = excluded.advocation_entity_id,
  image_type = excluded.image_type,
  current_condition = excluded.current_condition,
  description = excluded.description,
  iconography = excluded.iconography,
  notes = excluded.notes;

insert into public.steps (
  entity_id, step_type, current_condition, description,
  execution_date_text, current_state_notes
)
select
  step.id,
  'Paso procesional de Gloria',
  'preserved',
  'Paso sobre el que la Divina Pastora de las Almas realiza su procesión triunfal del 8 de septiembre.',
  'Configuración histórica con iluminación eléctrica documentada desde 1919',
  'En uso procesional; incorpora un sistema de ventilación desde 2008.'
from public.entities step
where step.slug = 'paso-procesional-divina-pastora-cantillana'
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition,
  description = excluded.description,
  execution_date_text = excluded.execution_date_text,
  current_state_notes = excluded.current_state_notes;

insert into public.heritage_assets (
  entity_id, parent_entity_id, asset_type, description, iconography,
  historical_context, date_from_text, is_current, display_order,
  is_featured, origin_notes
)
select
  asset.id,
  brotherhood.id,
  'Arquitectura efímera de culto',
  'El Risco sirve de escenario cultual a la Divina Pastora durante septiembre y ordena visualmente el presbiterio parroquial en torno a la imagen titular.',
  'Escenografía pastoril y celestial articulada alrededor de la Divina Pastora de las Almas.',
  'La Hermandad conserva esta tradición de montaje efímero desde el siglo XVIII.',
  'Tradición conservada desde el siglo XVIII',
  true,
  10,
  true,
  'El ascenso anual de la imagen al Risco marca el inicio del mes pastoreño.'
from public.entities asset
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
where asset.slug = 'risco-divina-pastora-cantillana'
on conflict (entity_id) do update set
  parent_entity_id = excluded.parent_entity_id,
  asset_type = excluded.asset_type,
  description = excluded.description,
  iconography = excluded.iconography,
  historical_context = excluded.historical_context,
  date_from_text = excluded.date_from_text,
  is_current = excluded.is_current,
  display_order = excluded.display_order,
  is_featured = excluded.is_featured,
  origin_notes = excluded.origin_notes;

insert into public.bands (
  entity_id, band_type, municipality_id, description, headquarters_text
)
select
  band.id,
  'Banda de Música',
  municipality.id,
  'Formación musical de Cantillana que regresó tras la Divina Pastora en 2016 y renovó su vinculación para los cultos y fiestas de 2026.',
  'Cantillana'
from public.entities band
join public.municipalities municipality on municipality.slug = 'cantillana'
where band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  description = excluded.description,
  headquarters_text = excluded.headquarters_text;

-- -----------------------------------------------------------------------------
-- 3. Titularidad, ubicación y paso
-- -----------------------------------------------------------------------------

insert into public.brotherhood_images (
  brotherhood_entity_id, image_entity_id, relation_type, notes, status
)
select brotherhood.id, image.id, 'titular', 'Imagen titular de la Hermandad.', 'published'
from public.entities brotherhood
join public.entities image on image.slug = 'divina-pastora-de-las-almas-de-cantillana'
where brotherhood.slug = 'pastora-de-cantillana'
  and not exists (
    select 1 from public.brotherhood_images existing
    where existing.brotherhood_entity_id = brotherhood.id
      and existing.image_entity_id = image.id
      and existing.relation_type = 'titular'
  );

insert into public.entity_locations (
  entity_id, place_id, municipality_id, custodian_entity_id,
  location_type, is_current, notes, status
)
select
  image.id, parish.id, municipality.id, brotherhood.id,
  'physical_location', true,
  'La imagen recibe culto en la iglesia parroquial de Nuestra Señora de la Asunción.',
  'published'
from public.entities image
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
join public.municipalities municipality on municipality.slug = 'cantillana'
join public.places parish
  on parish.slug = 'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana'
where image.slug = 'divina-pastora-de-las-almas-de-cantillana'
  and not exists (
    select 1 from public.entity_locations existing
    where existing.entity_id = image.id
      and existing.location_type = 'physical_location'
      and existing.is_current
  );

insert into public.brotherhood_steps (
  brotherhood_entity_id, step_entity_id, relation_type, notes, status
)
select brotherhood.id, step.id, 'processional_step', 'Paso procesional actual de la imagen titular.', 'published'
from public.entities brotherhood
join public.entities step on step.slug = 'paso-procesional-divina-pastora-cantillana'
where brotherhood.slug = 'pastora-de-cantillana'
  and not exists (
    select 1 from public.brotherhood_steps existing
    where existing.brotherhood_entity_id = brotherhood.id
      and existing.step_entity_id = step.id
      and existing.relation_type = 'processional_step'
  );

insert into public.image_steps (
  image_entity_id, step_entity_id, relation_type, notes, status
)
select image.id, step.id, 'processes_on', 'La imagen procesiona sobre este paso cada 8 de septiembre.', 'published'
from public.entities image
join public.entities step on step.slug = 'paso-procesional-divina-pastora-cantillana'
where image.slug = 'divina-pastora-de-las-almas-de-cantillana'
  and not exists (
    select 1 from public.image_steps existing
    where existing.image_entity_id = image.id
      and existing.step_entity_id = step.id
      and existing.relation_type = 'processes_on'
  );

drop table if exists pg_temp._hc_pastora_step_phases;
create temporary table _hc_pastora_step_phases (
  phase_name text primary key,
  phase_type text,
  date_from_text text,
  description text
) on commit drop;

insert into _hc_pastora_step_phases values
  (
    'Incorporación de la iluminación eléctrica',
    'Adecuación técnica',
    '1919',
    'El paso empleó por primera vez iluminación eléctrica en 1919.'
  ),
  (
    'Instalación del sistema de ventilación',
    'Conservación preventiva',
    '2008',
    'Se instaló un sistema de ventilación para favorecer la conservación y el uso procesional del conjunto.'
  );

update public.step_phases phase
set
  phase_type = desired.phase_type,
  date_from_text = desired.date_from_text,
  description = desired.description,
  status = 'published',
  updated_at = now()
from _hc_pastora_step_phases desired
join public.entities step on step.slug = 'paso-procesional-divina-pastora-cantillana'
where phase.step_entity_id = step.id
  and phase.phase_name = desired.phase_name;

insert into public.step_phases (
  step_entity_id, phase_name, phase_type, date_from_text, description, status
)
select step.id, desired.phase_name, desired.phase_type, desired.date_from_text, desired.description, 'published'
from _hc_pastora_step_phases desired
join public.entities step on step.slug = 'paso-procesional-divina-pastora-cantillana'
where not exists (
  select 1 from public.step_phases existing
  where existing.step_entity_id = step.id
    and existing.phase_name = desired.phase_name
);

-- -----------------------------------------------------------------------------
-- 4. Cultos estables
-- -----------------------------------------------------------------------------

drop table if exists pg_temp._hc_pastora_cults;
create temporary table _hc_pastora_cults (
  title text primary key,
  cult_type text not null,
  date_rule text,
  month smallint,
  time_text text,
  description text,
  recurrence_label text,
  display_order integer
) on commit drop;

insert into _hc_pastora_cults values
  (
    'Solemne Novena a la Divina Pastora de las Almas',
    'Novena',
    'Del 6 al 14 de septiembre',
    9,
    null,
    'Novena anual celebrada en honor de la imagen titular durante las fiestas de septiembre.',
    'Septiembre',
    10
  ),
  (
    'Función Solemne de la Divina Pastora',
    'Función Solemne',
    '8 de septiembre',
    9,
    'Horario matinal',
    'Función solemne celebrada en la festividad de la Divina Pastora, antes de la procesión triunfal de la noche.',
    '8 de septiembre',
    20
  );

update public.cults cult
set
  image_entity_id = image.id,
  cult_type = desired.cult_type,
  date_rule = desired.date_rule,
  month = desired.month,
  time_text = desired.time_text,
  place_id = parish.id,
  description = desired.description,
  status = 'published',
  is_recurring = true,
  recurrence_label = desired.recurrence_label,
  display_order = desired.display_order
from _hc_pastora_cults desired
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
join public.entities image on image.slug = 'divina-pastora-de-las-almas-de-cantillana'
join public.places parish
  on parish.slug = 'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana'
where cult.brotherhood_entity_id = brotherhood.id
  and cult.title = desired.title;

insert into public.cults (
  brotherhood_entity_id, image_entity_id, cult_type, title,
  date_rule, month, time_text, place_id, description, status,
  is_recurring, recurrence_label, display_order
)
select
  brotherhood.id, image.id, desired.cult_type, desired.title,
  desired.date_rule, desired.month, desired.time_text, parish.id,
  desired.description, 'published', true,
  desired.recurrence_label, desired.display_order
from _hc_pastora_cults desired
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
join public.entities image on image.slug = 'divina-pastora-de-las-almas-de-cantillana'
join public.places parish
  on parish.slug = 'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana'
where not exists (
  select 1 from public.cults existing
  where existing.brotherhood_entity_id = brotherhood.id
    and existing.title = desired.title
);

insert into public.cult_entities (cult_id, entity_id, role)
select cult.id, image.id, 'honoree'
from public.cults cult
join public.entities brotherhood on brotherhood.id = cult.brotherhood_entity_id
join public.entities image on image.slug = 'divina-pastora-de-las-almas-de-cantillana'
where brotherhood.slug = 'pastora-de-cantillana'
  and not exists (
    select 1 from public.cult_entities existing
    where existing.cult_id = cult.id
      and existing.entity_id = image.id
      and existing.role = 'honoree'
  );

-- -----------------------------------------------------------------------------
-- 5. Salidas recurrentes y procesión de 2026
-- -----------------------------------------------------------------------------

drop table if exists pg_temp._hc_pastora_series;
create temporary table _hc_pastora_series (
  title text primary key,
  outing_type text not null,
  month smallint,
  date_rule text,
  time_text text,
  origin_slug text,
  destination_slug text,
  route_summary text,
  description text,
  display_order integer
) on commit drop;

insert into _hc_pastora_series values
  (
    'Traslado de la Divina Pastora al camarín',
    'Traslado', 5, 'Durante los cultos de mayo', 'Horario por anunciar',
    'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
    'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
    'Traslado interior en la parroquia',
    'Traslado anual de la imagen al camarín durante el ciclo de cultos de mayo.', 10
  ),
  (
    'Ascenso de la Divina Pastora al Risco',
    'Traslado', 8, '31 de agosto', '23:00 h',
    'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
    'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
    'Del camarín al Risco, en el interior de la parroquia',
    'Traslado que abre el mes pastoreño y sitúa a la imagen titular en el Risco.', 20
  ),
  (
    'Rosario de Hermanas de víspera',
    'Santo Rosario', 9, '7 de septiembre', 'Horario por anunciar',
    'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
    'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
    'Recorrido por Cantillana con el Simpecado',
    'Rosario de Hermanas celebrado en la víspera de la festividad de la Divina Pastora.', 30
  ),
  (
    'Procesión triunfal de la Divina Pastora',
    'Procesión de Gloria', 9, '8 de septiembre', 'Horario nocturno',
    'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
    'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
    'Procesión anual por las calles de Cantillana',
    'Salida procesional anual de la Divina Pastora de las Almas en la noche del 8 de septiembre.', 40
  ),
  (
    'Rosario de Hermanas del último día de la Novena',
    'Santo Rosario', 9, '14 de septiembre', 'Tras la Novena',
    'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
    'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
    'Recorrido por Cantillana con el Simpecado',
    'Rosario de Hermanas que cierra la Solemne Novena de septiembre.', 50
  ),
  (
    'Romería de la Divina Pastora',
    'Romería', 9, 'Último fin de semana de septiembre', 'Horario por anunciar',
    'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana',
    'santuario-divina-pastora-cantillana',
    'Cantillana → Santuario de la Divina Pastora, en Los Pajares',
    'Romería anual al santuario con el Simpecado sobre su carreta de plata.', 60
  );

update public.outing_series series
set
  outing_type = desired.outing_type,
  character = 'ordinary',
  month = desired.month,
  date_rule = desired.date_rule,
  time_text = desired.time_text,
  municipality_id = municipality.id,
  origin_place_id = origin.id,
  destination_place_id = destination.id,
  route_summary = desired.route_summary,
  description = desired.description,
  display_order = desired.display_order,
  status = 'published',
  updated_at = now()
from _hc_pastora_series desired
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
join public.municipalities municipality on municipality.slug = 'cantillana'
left join public.places origin on origin.slug = desired.origin_slug
left join public.places destination on destination.slug = desired.destination_slug
where series.brotherhood_entity_id = brotherhood.id
  and series.title = desired.title;

insert into public.outing_series (
  brotherhood_entity_id, outing_type, character, title, month,
  date_rule, time_text, municipality_id, origin_place_id,
  destination_place_id, route_summary, description, display_order, status
)
select
  brotherhood.id, desired.outing_type, 'ordinary', desired.title,
  desired.month, desired.date_rule, desired.time_text, municipality.id,
  origin.id, destination.id, desired.route_summary, desired.description,
  desired.display_order, 'published'
from _hc_pastora_series desired
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
join public.municipalities municipality on municipality.slug = 'cantillana'
left join public.places origin on origin.slug = desired.origin_slug
left join public.places destination on destination.slug = desired.destination_slug
where not exists (
  select 1 from public.outing_series existing
  where existing.brotherhood_entity_id = brotherhood.id
    and existing.title = desired.title
);

update public.outings outing
set
  title = 'Procesión triunfal de la Divina Pastora 2026',
  year = 2026,
  municipality_id = municipality.id,
  origin_place_id = parish.id,
  destination_place_id = parish.id,
  route_summary = 'Procesión anual por las calles de Cantillana.',
  description = 'Salida procesional anual de la Divina Pastora de las Almas en la noche del 8 de septiembre.',
  event_status = 'announced',
  status = 'published',
  outing_series_id = series.id,
  updated_at = now()
from public.entities brotherhood
join public.municipalities municipality on municipality.slug = 'cantillana'
join public.places parish
  on parish.slug = 'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana'
join public.outing_series series
  on series.brotherhood_entity_id = brotherhood.id
 and series.title = 'Procesión triunfal de la Divina Pastora'
where brotherhood.slug = 'pastora-de-cantillana'
  and outing.brotherhood_entity_id = brotherhood.id
  and outing.outing_date = '2026-09-08'
  and outing.outing_type = 'Procesión de Gloria';

insert into public.outings (
  brotherhood_entity_id, outing_type, character, title, outing_date,
  year, municipality_id, origin_place_id, destination_place_id,
  route_summary, description, event_status, status, outing_series_id
)
select
  brotherhood.id, 'Procesión de Gloria', 'ordinary',
  'Procesión triunfal de la Divina Pastora 2026', '2026-09-08', 2026,
  municipality.id, parish.id, parish.id,
  'Procesión anual por las calles de Cantillana.',
  'Salida procesional anual de la Divina Pastora de las Almas en la noche del 8 de septiembre.',
  'announced', 'published', series.id
from public.entities brotherhood
join public.municipalities municipality on municipality.slug = 'cantillana'
join public.places parish
  on parish.slug = 'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana'
join public.outing_series series
  on series.brotherhood_entity_id = brotherhood.id
 and series.title = 'Procesión triunfal de la Divina Pastora'
where brotherhood.slug = 'pastora-de-cantillana'
  and not exists (
    select 1 from public.outings existing
    where existing.brotherhood_entity_id = brotherhood.id
      and existing.outing_date = '2026-09-08'
      and existing.outing_type = 'Procesión de Gloria'
  );

insert into public.outing_entities (outing_id, entity_id, role)
select outing.id, related.id, desired.role
from public.outings outing
join public.entities brotherhood on brotherhood.id = outing.brotherhood_entity_id
cross join (
  values
    ('divina-pastora-de-las-almas-de-cantillana', 'processional_image'),
    ('paso-procesional-divina-pastora-cantillana', 'processional_step')
) desired(slug, role)
join public.entities related on related.slug = desired.slug
where brotherhood.slug = 'pastora-de-cantillana'
  and outing.outing_date = '2026-09-08'
  and outing.outing_type = 'Procesión de Gloria'
  and not exists (
    select 1 from public.outing_entities existing
    where existing.outing_id = outing.id
      and existing.entity_id = related.id
      and existing.role = desired.role
  );

-- -----------------------------------------------------------------------------
-- 6. Acompañamiento musical e hitos
-- -----------------------------------------------------------------------------

insert into public.band_names (
  band_entity_id, name, short_name, name_type, is_current, notes
)
select band.id, desired.name, desired.short_name, desired.name_type, true, desired.notes
from public.entities band
cross join (
  values
    (
      'Banda de Música Nuestra Señora de la Soledad de Cantillana',
      'B. M. Ntra. Sra. de la Soledad', 'official',
      'Denominación pública de la formación.'
    ),
    (
      'Banda de la Soledad', 'Banda de la Soledad', 'popular',
      'Nombre de uso habitual.'
    )
) desired(name, short_name, name_type, notes)
where band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
  and not exists (
    select 1 from public.band_names existing
    where existing.band_entity_id = band.id
      and existing.name = desired.name
  );

update public.music_accompaniment_periods period
set
  step_entity_id = step.id,
  position = 'Tras el paso de la Divina Pastora',
  outing_type = 'Fiestas de septiembre y cultos anuales',
  date_from_text = 'Desde 2016 · renovado para 2026',
  year_from = 2016,
  date_to = null,
  date_to_text = null,
  year_to = null,
  is_current = true,
  notes = 'La renovación de 2026 comprende la procesión triunfal del 8 de septiembre, los rosarios de víspera y final de Novena, el ascenso al Risco, el traslado al camarín, la coronación de las Romeras y la Romería tras el Simpecado.',
  status = 'published',
  public_brotherhood_name = 'La Pastora de Cantillana',
  public_step_name = 'Paso de la Divina Pastora',
  public_brotherhood_slug = 'pastora-de-cantillana',
  updated_at = now()
from public.entities brotherhood
join public.entities band
  on band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
join public.entities step on step.slug = 'paso-procesional-divina-pastora-cantillana'
where brotherhood.slug = 'pastora-de-cantillana'
  and period.brotherhood_entity_id = brotherhood.id
  and period.band_entity_id = band.id
  and period.is_current
  and period.status <> 'archived';

insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id,
  position, outing_type, date_from_text, year_from,
  is_current, notes, status, public_brotherhood_name,
  public_step_name, public_brotherhood_slug
)
select
  brotherhood.id, band.id, step.id,
  'Tras el paso de la Divina Pastora',
  'Fiestas de septiembre y cultos anuales',
  'Desde 2016 · renovado para 2026', 2016, true,
  'La renovación de 2026 comprende la procesión triunfal del 8 de septiembre, los rosarios de víspera y final de Novena, el ascenso al Risco, el traslado al camarín, la coronación de las Romeras y la Romería tras el Simpecado.',
  'published', 'La Pastora de Cantillana',
  'Paso de la Divina Pastora', 'pastora-de-cantillana'
from public.entities brotherhood
join public.entities band
  on band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
join public.entities step on step.slug = 'paso-procesional-divina-pastora-cantillana'
where brotherhood.slug = 'pastora-de-cantillana'
  and not exists (
    select 1 from public.music_accompaniment_periods existing
    where existing.brotherhood_entity_id = brotherhood.id
      and existing.band_entity_id = band.id
      and existing.is_current
      and existing.status <> 'archived'
  );

insert into public.events (
  entity_id, event_type, event_date_text, place_id, description
)
select event.id, desired.event_type, desired.event_date_text, parish.id, desired.description
from (
  values
    (
      'fundacion-hermandad-divina-pastora-cantillana-1720',
      'Fundación', '1720',
      'La Hermandad de la Divina Pastora de Cantillana fue fundada en 1720.'
    ),
    (
      'regreso-banda-soledad-divina-pastora-cantillana-2016',
      'Acompañamiento musical', '2016',
      'La Banda de la Soledad regresó tras la Divina Pastora en 2016.'
    )
) desired(slug, event_type, event_date_text, description)
join public.entities event on event.slug = desired.slug
join public.places parish
  on parish.slug = 'iglesia-parroquial-nuestra-senora-de-la-asuncion-cantillana'
on conflict (entity_id) do update set
  event_type = excluded.event_type,
  event_date_text = excluded.event_date_text,
  place_id = excluded.place_id,
  description = excluded.description;

insert into public.entity_relations (
  source_entity_id, relation_type, target_entity_id,
  date_from_text, notes, status
)
select source.id, desired.relation_type, target.id,
  desired.date_from_text, desired.notes, 'published'
from (
  values
    (
      'banda-de-musica-nuestra-senora-de-la-soledad-cantillana',
      'associated_with_brotherhood', 'pastora-de-cantillana',
      'Desde 2016', 'Acompañamiento musical vigente.'
    ),
    (
      'fundacion-hermandad-divina-pastora-cantillana-1720',
      'involves', 'pastora-de-cantillana', '1720', null::text
    ),
    (
      'regreso-banda-soledad-divina-pastora-cantillana-2016',
      'involves', 'pastora-de-cantillana', '2016', null::text
    ),
    (
      'regreso-banda-soledad-divina-pastora-cantillana-2016',
      'involves', 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana',
      '2016', null::text
    )
) desired(source_slug, relation_type, target_slug, date_from_text, notes)
join public.entities source on source.slug = desired.source_slug
join public.entities target on target.slug = desired.target_slug
where not exists (
  select 1 from public.entity_relations existing
  where existing.source_entity_id = source.id
    and existing.target_entity_id = target.id
    and existing.relation_type = desired.relation_type
);

-- -----------------------------------------------------------------------------
-- 7. Fuentes y trazabilidad
-- -----------------------------------------------------------------------------

drop table if exists pg_temp._hc_pastora_sources;
create temporary table _hc_pastora_sources (
  url text primary key,
  name text not null,
  source_type text not null,
  author_or_publisher text,
  publication_date date,
  accessed_at date
) on commit drop;

insert into _hc_pastora_sources values
  (
    'https://www.cofradiasyhermandades.es/fichacofradia-COFRADIAS-Cantillana-PontificiaRealIlustreFranciscanaYMuyAntiguaHermandadDelSantoRosarioDeLaDivinaPastoraDeLasAlmasYRedilEucaristico-RGQxREhBbTZqK21iemdqQlVJcVpGZz09',
    'Directorio de hermandades · Divina Pastora de Cantillana',
    'Directorio institucional', 'Consejo General de Hermandades y Cofradías',
    null, '2026-08-21'
  ),
  (
    'https://www.elpespunte.es/articulo/cofrade/pastora-cantillana-renueva-banda-soledad-decimo-aniversario-regreso-virgen/20260515162137134152.html',
    'La Pastora de Cantillana renueva con la Banda de la Soledad en el décimo aniversario de su regreso',
    'Prensa', 'Nacho Sánchez · El Pespunte', '2026-05-15', '2026-08-21'
  ),
  (
    'https://www.elpespunte.es/articulo/cofrade/cantillana-celebra-sus-fiestas-mayores-en-honor-a-la-divina-pastora/20240907135512068226.html',
    'Cantillana celebra sus fiestas en honor a la Divina Pastora',
    'Prensa', 'El Pespunte', '2024-09-07', '2026-08-21'
  ),
  (
    'https://www.elpespunte.es/articulo/provincia/la-divina-pastora-inicia-en-cantillana-el-mes-pastoreno-con-su-ascenso-al-risco/20250831162230107206.html',
    'La Divina Pastora inicia en Cantillana el mes pastoreño con su ascenso al Risco',
    'Prensa', 'El Pespunte', '2025-08-31', '2026-08-21'
  ),
  (
    'https://sevillaentubolsillo.dipusevilla.es/node/61126',
    'Ermita de la Divina Pastora de Cantillana',
    'Web institucional', 'Diputación de Sevilla', null, '2026-08-21'
  ),
  (
    'https://www.mundocofrade.es/articulo/actualidad/procesion-y-actos-en-honor-de-la-divina-pastora-de-cantillana/20250902115047005364.html',
    'Procesión y actos en honor de la Divina Pastora de Cantillana',
    'Prensa', 'Mundo Cofrade', '2025-09-02', '2026-08-21'
  ),
  (
    'https://en.andalucia.org/event/fiestas-y-romer%C3%ADa-de-la-divina-pastora-de-cantillana/20288101/',
    'Fiestas y Romería de la Divina Pastora de Cantillana',
    'Web institucional', 'Turismo de Andalucía', null, '2026-08-21'
  );

update public.sources source
set
  name = desired.name,
  source_type = desired.source_type,
  author_or_publisher = desired.author_or_publisher,
  publication_date = desired.publication_date,
  accessed_at = desired.accessed_at
from _hc_pastora_sources desired
where source.url = desired.url;

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at
)
select name, url, source_type, author_or_publisher, publication_date, accessed_at
from _hc_pastora_sources desired
where not exists (
  select 1 from public.sources existing where existing.url = desired.url
);

drop table if exists pg_temp._hc_pastora_entity_sources;
create temporary table _hc_pastora_entity_sources (
  source_url text not null,
  entity_slug text not null,
  scope text not null,
  primary key (source_url, entity_slug, scope)
) on commit drop;

insert into _hc_pastora_entity_sources values
  (
    'https://www.cofradiasyhermandades.es/fichacofradia-COFRADIAS-Cantillana-PontificiaRealIlustreFranciscanaYMuyAntiguaHermandadDelSantoRosarioDeLaDivinaPastoraDeLasAlmasYRedilEucaristico-RGQxREhBbTZqK21iemdqQlVJcVpGZz09',
    'pastora-de-cantillana',
    'Denominación oficial, fundación y sede canónica'
  ),
  (
    'https://www.cofradiasyhermandades.es/fichacofradia-COFRADIAS-Cantillana-PontificiaRealIlustreFranciscanaYMuyAntiguaHermandadDelSantoRosarioDeLaDivinaPastoraDeLasAlmasYRedilEucaristico-RGQxREhBbTZqK21iemdqQlVJcVpGZz09',
    'fundacion-hermandad-divina-pastora-cantillana-1720',
    'Fundación de la Hermandad en 1720'
  ),
  (
    'https://www.elpespunte.es/articulo/cofrade/cantillana-celebra-sus-fiestas-mayores-en-honor-a-la-divina-pastora/20240907135512068226.html',
    'paso-procesional-divina-pastora-cantillana',
    'Paso, iluminación eléctrica de 1919 y sistema de ventilación de 2008'
  ),
  (
    'https://www.elpespunte.es/articulo/provincia/la-divina-pastora-inicia-en-cantillana-el-mes-pastoreno-con-su-ascenso-al-risco/20250831162230107206.html',
    'risco-divina-pastora-cantillana',
    'Historia, iconografía y uso cultual del Risco'
  ),
  (
    'https://sevillaentubolsillo.dipusevilla.es/node/61126',
    'pastora-de-cantillana',
    'Santuario de la Divina Pastora en Los Pajares'
  ),
  (
    'https://www.elpespunte.es/articulo/cofrade/pastora-cantillana-renueva-banda-soledad-decimo-aniversario-regreso-virgen/20260515162137134152.html',
    'banda-de-musica-nuestra-senora-de-la-soledad-cantillana',
    'Regreso en 2016 y renovación para 2026'
  ),
  (
    'https://www.elpespunte.es/articulo/cofrade/pastora-cantillana-renueva-banda-soledad-decimo-aniversario-regreso-virgen/20260515162137134152.html',
    'regreso-banda-soledad-divina-pastora-cantillana-2016',
    'Regreso de la Banda de la Soledad en 2016'
  );

insert into public.source_links (source_id, entity_id, scope)
select source.id, entity.id, desired.scope
from _hc_pastora_entity_sources desired
join public.sources source on source.url = desired.source_url
join public.entities entity on entity.slug = desired.entity_slug
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = source.id
    and existing.entity_id = entity.id
    and existing.scope = desired.scope
);

insert into public.source_links (source_id, step_phase_id, scope)
select source.id, phase.id, 'Hito técnico del paso procesional'
from public.sources source
join public.entities step on step.slug = 'paso-procesional-divina-pastora-cantillana'
join public.step_phases phase on phase.step_entity_id = step.id
where source.url = 'https://www.elpespunte.es/articulo/cofrade/cantillana-celebra-sus-fiestas-mayores-en-honor-a-la-divina-pastora/20240907135512068226.html'
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id
      and existing.step_phase_id = phase.id
      and existing.scope = 'Hito técnico del paso procesional'
  );

insert into public.source_links (source_id, cult_id, scope)
select source.id, cult.id, 'Calendario anual de cultos de septiembre'
from public.sources source
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
join public.cults cult on cult.brotherhood_entity_id = brotherhood.id
where source.url = 'https://www.mundocofrade.es/articulo/actualidad/procesion-y-actos-en-honor-de-la-divina-pastora-de-cantillana/20250902115047005364.html'
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id
      and existing.cult_id = cult.id
      and existing.scope = 'Calendario anual de cultos de septiembre'
  );

drop table if exists pg_temp._hc_pastora_series_sources;
create temporary table _hc_pastora_series_sources (
  source_url text not null,
  series_title text not null,
  scope text not null,
  primary key (source_url, series_title, scope)
) on commit drop;

insert into _hc_pastora_series_sources values
  (
    'https://www.elpespunte.es/articulo/cofrade/pastora-cantillana-renueva-banda-soledad-decimo-aniversario-regreso-virgen/20260515162137134152.html',
    'Traslado de la Divina Pastora al camarín',
    'Traslado anual al camarín y acompañamiento de 2026'
  ),
  (
    'https://www.elpespunte.es/articulo/provincia/la-divina-pastora-inicia-en-cantillana-el-mes-pastoreno-con-su-ascenso-al-risco/20250831162230107206.html',
    'Ascenso de la Divina Pastora al Risco',
    'Ascenso anual al Risco'
  ),
  (
    'https://www.mundocofrade.es/articulo/actualidad/procesion-y-actos-en-honor-de-la-divina-pastora-de-cantillana/20250902115047005364.html',
    'Rosario de Hermanas de víspera',
    'Rosario de Hermanas de víspera'
  ),
  (
    'https://www.elpespunte.es/articulo/cofrade/cantillana-celebra-sus-fiestas-mayores-en-honor-a-la-divina-pastora/20240907135512068226.html',
    'Procesión triunfal de la Divina Pastora',
    'Procesión anual del 8 de septiembre'
  ),
  (
    'https://www.mundocofrade.es/articulo/actualidad/procesion-y-actos-en-honor-de-la-divina-pastora-de-cantillana/20250902115047005364.html',
    'Rosario de Hermanas del último día de la Novena',
    'Rosario de cierre de la Novena'
  ),
  (
    'https://en.andalucia.org/event/fiestas-y-romer%C3%ADa-de-la-divina-pastora-de-cantillana/20288101/',
    'Romería de la Divina Pastora',
    'Romería anual del último fin de semana de septiembre'
  );

insert into public.source_links (source_id, outing_series_id, scope)
select source.id, series.id, desired.scope
from _hc_pastora_series_sources desired
join public.sources source on source.url = desired.source_url
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
join public.outing_series series
  on series.brotherhood_entity_id = brotherhood.id
 and series.title = desired.series_title
where not exists (
  select 1 from public.source_links existing
  where existing.source_id = source.id
    and existing.outing_series_id = series.id
    and existing.scope = desired.scope
);

insert into public.source_links (source_id, outing_id, scope)
select source.id, outing.id,
  'Procesión triunfal del 8 de septiembre incluida en la renovación musical de 2026'
from public.sources source
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
join public.outings outing
  on outing.brotherhood_entity_id = brotherhood.id
 and outing.outing_date = '2026-09-08'
 and outing.outing_type = 'Procesión de Gloria'
where source.url = 'https://www.elpespunte.es/articulo/cofrade/pastora-cantillana-renueva-banda-soledad-decimo-aniversario-regreso-virgen/20260515162137134152.html'
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id
      and existing.outing_id = outing.id
  );

insert into public.source_links (source_id, music_accompaniment_period_id, scope)
select source.id, period.id,
  'Acompañamiento vigente desde 2016 y renovación para los actos de 2026'
from public.sources source
join public.entities brotherhood on brotherhood.slug = 'pastora-de-cantillana'
join public.entities band
  on band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
join public.music_accompaniment_periods period
  on period.brotherhood_entity_id = brotherhood.id
 and period.band_entity_id = band.id
 and period.is_current
 and period.status = 'published'
where source.url = 'https://www.elpespunte.es/articulo/cofrade/pastora-cantillana-renueva-banda-soledad-decimo-aniversario-regreso-virgen/20260515162137134152.html'
  and not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id
      and existing.music_accompaniment_period_id = period.id
  );

-- -----------------------------------------------------------------------------
-- 8. Comprobaciones editoriales
-- -----------------------------------------------------------------------------

do $$
declare
  brotherhood_id uuid;
begin
  select id into brotherhood_id
  from public.entities
  where entity_type = 'brotherhood'
    and slug = 'pastora-de-cantillana'
    and status = 'published';

  if brotherhood_id is null then
    raise exception 'No se ha creado la ficha publicada de la Pastora de Cantillana';
  end if;

  if not exists (
    select 1 from public.brotherhoods
    where entity_id = brotherhood_id
      and brotherhood_types = array['Gloria']::text[]
  ) then
    raise exception 'La Pastora debe quedar clasificada únicamente como Gloria';
  end if;

  if (select count(*) from public.brotherhood_images
      where brotherhood_entity_id = brotherhood_id and status = 'published') <> 1 then
    raise exception 'La primera carga debe contener una imagen titular publicada';
  end if;

  if (select count(*) from public.brotherhood_steps
      where brotherhood_entity_id = brotherhood_id and status = 'published') <> 1 then
    raise exception 'La primera carga debe contener un paso publicado';
  end if;

  if (select count(*) from public.outing_series
      where brotherhood_entity_id = brotherhood_id and status = 'published') <> 6 then
    raise exception 'La Pastora debe tener seis series de salidas publicadas';
  end if;

  if not exists (
    select 1
    from public.music_accompaniment_periods period
    join public.entities band on band.id = period.band_entity_id
    where period.brotherhood_entity_id = brotherhood_id
      and period.is_current
      and period.status = 'published'
      and band.slug = 'banda-de-musica-nuestra-senora-de-la-soledad-cantillana'
  ) then
    raise exception 'Falta el acompañamiento vigente de la Banda de la Soledad';
  end if;
end $$;
