-- Hilo Cofrade · ficha completa de la Banda de Música del Maestro Tejera
--
-- La banda ya existe en el grafo. Esta migración conserva su UUID y sus dos
-- acompañamientos de La Cena, completa su identidad y añade las relaciones
-- vigentes que están documentadas para 2026.

-- -----------------------------------------------------------------------------
-- 1. Identidad editorial
-- -----------------------------------------------------------------------------

insert into public.municipalities (
  name, slug, province, autonomous_community, country
)
values ('Dos Hermanas', 'dos-hermanas', 'Sevilla', 'Andalucía', 'España')
on conflict (slug) do update set
  name = excluded.name,
  province = excluded.province,
  autonomous_community = excluded.autonomous_community,
  country = excluded.country;

update public.entities
set
  name = 'Maestro Tejera',
  summary = 'Banda de música sevillana con origen documentado en 1901, formación titular de la Real Maestranza y una identidad especialmente vinculada al repertorio clásico y fúnebre.',
  status = 'published',
  updated_at = now()
where entity_type = 'band'
  and slug = 'banda-de-musica-del-maestro-tejera';

do $$
begin
  if not exists (
    select 1
    from public.entities
    where entity_type = 'band'
      and slug = 'banda-de-musica-del-maestro-tejera'
  ) then
    raise exception 'No existe la banda de Maestro Tejera que debe completarse';
  end if;
end $$;

update public.bands band
set
  band_type = 'Banda de Música',
  municipality_id = municipality.id,
  foundation_text = '1901 · denominación vinculada al Maestro Tejera desde 1912',
  instagram_url = 'https://www.instagram.com/bmmaestrotejera/',
  youtube_url = 'https://www.youtube.com/@bmmaestrotejera',
  description = 'La Banda de Música del Maestro Tejera hunde sus raíces en la Banda Infantil de las Escuelas de la Macarena, presentada públicamente en 1901. En 1912 quedó configurada con la denominación vinculada al maestro Manuel Pérez Tejera. Es la formación titular de la Real Maestranza desde 1942 y conserva una acusada identidad clásica y fúnebre en su repertorio procesional. En 2014 recibió la Medalla de la Ciudad de Sevilla y en 2026 conmemora 125 años desde aquel origen documentado.',
  primary_color = '#00001C',
  secondary_color = '#00001C',
  logo_path = '/bandas/maestro-tejera/emblema.webp',
  linked_brotherhood_name = null,
  headquarters_text = 'Sevilla'
from public.entities entity
join public.municipalities municipality on municipality.slug = 'sevilla'
where band.entity_id = entity.id
  and entity.entity_type = 'band'
  and entity.slug = 'banda-de-musica-del-maestro-tejera';

drop table if exists pg_temp._hc_tejera_names;
create temporary table _hc_tejera_names (
  name text primary key,
  short_name text,
  name_type text not null,
  date_from_text text,
  date_to_text text,
  is_current boolean not null,
  notes text
) on commit drop;

insert into _hc_tejera_names values
  (
    'Banda de Música del Maestro Tejera', 'B. M. Maestro Tejera', 'official',
    'Desde 1912', null, true,
    'Denominación histórica vinculada al maestro Manuel Pérez Tejera.'
  ),
  (
    'Maestro Tejera', 'Maestro Tejera', 'popular',
    null, null, true,
    'Nombre de uso público y cofrade.'
  ),
  (
    'Banda Infantil de las Escuelas de la Macarena', null, 'former',
    'Documentada desde 1901', 'Hasta 1912', false,
    'Germen histórico del que procede la formación actual.'
  );

update public.band_names current_name
set
  short_name = desired.short_name,
  name_type = desired.name_type,
  date_from_text = desired.date_from_text,
  date_to_text = desired.date_to_text,
  is_current = desired.is_current,
  notes = desired.notes
from _hc_tejera_names desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-del-maestro-tejera'
where current_name.band_entity_id = band.id
  and current_name.name = desired.name;

insert into public.band_names (
  band_entity_id, name, short_name, name_type,
  date_from_text, date_to_text, is_current, notes
)
select
  band.id, desired.name, desired.short_name, desired.name_type,
  desired.date_from_text, desired.date_to_text, desired.is_current, desired.notes
from _hc_tejera_names desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-del-maestro-tejera'
where not exists (
  select 1
  from public.band_names existing
  where existing.band_entity_id = band.id
    and existing.name = desired.name
);

insert into public.band_colors (
  band_entity_id, color_name, hex_value, color_role, sort_order, notes, status
)
select
  band.id, desired.color_name, desired.hex_value,
  desired.color_role, desired.sort_order, desired.notes, 'published'
from public.entities band
cross join (
  values
    ('Azul marino del emblema', '#00001C', 'primary', 1::smallint, 'Color dominante muestreado del emblema oficial.'),
    ('Blanco del emblema', '#FFFFFF', 'identity', 2::smallint, 'Color de la lira, la Giralda y la denominación del emblema oficial.')
) as desired(color_name, hex_value, color_role, sort_order, notes)
where band.entity_type = 'band'
  and band.slug = 'banda-de-musica-del-maestro-tejera'
on conflict (band_entity_id, color_name) do update set
  hex_value = excluded.hex_value,
  color_role = excluded.color_role,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

insert into public.entity_social_links (
  entity_id, platform, url, label, display_order, is_public
)
select
  band.id, desired.platform, desired.url, desired.label,
  desired.display_order, true
from public.entities band
cross join (
  values
    ('instagram', 'https://www.instagram.com/bmmaestrotejera/', 'Instagram oficial', 1::smallint),
    ('facebook', 'https://www.facebook.com/bmmaestrotejera/', 'Facebook oficial', 2::smallint),
    ('x', 'https://x.com/MaestroTejera', 'X oficial', 3::smallint),
    ('youtube', 'https://www.youtube.com/@bmmaestrotejera', 'YouTube oficial', 4::smallint),
    ('spotify', 'https://open.spotify.com/artist/1NHEuJrDVMZmcw1oPASjxW', 'Spotify', 5::smallint)
) as desired(platform, url, label, display_order)
where band.entity_type = 'band'
  and band.slug = 'banda-de-musica-del-maestro-tejera'
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public,
  updated_at = now();

-- -----------------------------------------------------------------------------
-- 2. Dirección actual e histórica
-- -----------------------------------------------------------------------------

insert into public.entities (entity_type, name, slug, summary, status)
values
  (
    'agent', 'Manuel Pérez Tejera', 'manuel-perez-tejera',
    'Músico y director vinculado a la consolidación y denominación histórica de la Banda del Maestro Tejera.',
    'published'
  ),
  (
    'agent', 'José Tristán Martín', 'jose-tristan-martin',
    'Director de la Banda del Maestro Tejera entre 1971 y 2007.',
    'published'
  ),
  (
    'agent', 'José Manuel Tristán Becerra', 'jose-manuel-tristan-becerra',
    'Tercera generación familiar al frente de la Banda del Maestro Tejera y presidente de la formación en 2026.',
    'published'
  ),
  (
    'agent', 'Manuel Pérez Hidalgo', 'manuel-perez-hidalgo',
    'Director musical de la Banda del Maestro Tejera durante cerca de treinta años, hasta 2024.',
    'published'
  ),
  (
    'agent', 'Sergio Jiménez Martín', 'sergio-jimenez-martin',
    'Director musical de la Banda del Maestro Tejera desde octubre de 2024.',
    'published'
  )
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status,
  updated_at = now();

insert into public.agents (entity_id, agent_kind, description)
select entity.id, 'person', entity.summary
from public.entities entity
where entity.entity_type = 'agent'
  and entity.slug in (
    'manuel-perez-tejera',
    'jose-tristan-martin',
    'jose-manuel-tristan-becerra',
    'manuel-perez-hidalgo',
    'sergio-jimenez-martin'
  )
on conflict (entity_id) do update set
  agent_kind = excluded.agent_kind,
  description = excluded.description;

drop table if exists pg_temp._hc_tejera_direction;
create temporary table _hc_tejera_direction (
  agent_slug text not null,
  role_name text not null,
  date_from date,
  date_from_text text,
  date_to date,
  date_to_text text,
  is_current boolean not null,
  notes text not null,
  primary key (agent_slug, role_name)
) on commit drop;

insert into _hc_tejera_direction values
  (
    'manuel-perez-tejera', 'Fundador y director', null, 'Desde 1912', null, 'Hasta 1971', false,
    'Consolidó la formación que adoptó la denominación histórica del Maestro Tejera.'
  ),
  (
    'jose-tristan-martin', 'Director', null, '1971', null, '2007', false,
    'Segunda generación al frente de la banda.'
  ),
  (
    'jose-manuel-tristan-becerra', 'Presidente', null, 'Vigente en 2026', null, null, true,
    'Responsabilidad institucional actual documentada por la federación andaluza de bandas.'
  ),
  (
    'manuel-perez-hidalgo', 'Director musical', null, 'Durante cerca de treinta años', null, 'Hasta 2024', false,
    'Cerró su etapa al frente de la dirección musical en 2024.'
  ),
  (
    'sergio-jimenez-martin', 'Director musical', '2024-10-23'::date, 'Desde octubre de 2024', null, null, true,
    'Nombrado director musical de la formación en octubre de 2024.'
  );

update public.band_agents assignment
set
  date_from = desired.date_from,
  date_from_text = desired.date_from_text,
  date_to = desired.date_to,
  date_to_text = desired.date_to_text,
  is_current = desired.is_current,
  notes = desired.notes,
  is_public = true
from _hc_tejera_direction desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-del-maestro-tejera'
join public.entities agent
  on agent.entity_type = 'agent'
 and agent.slug = desired.agent_slug
where assignment.band_entity_id = band.id
  and assignment.agent_entity_id = agent.id
  and assignment.role_name = desired.role_name;

insert into public.band_agents (
  band_entity_id, agent_entity_id, role_name,
  date_from, date_from_text, date_to, date_to_text,
  is_current, notes, is_public
)
select
  band.id, agent.id, desired.role_name,
  desired.date_from, desired.date_from_text, desired.date_to, desired.date_to_text,
  desired.is_current, desired.notes, true
from _hc_tejera_direction desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-del-maestro-tejera'
join public.entities agent
  on agent.entity_type = 'agent'
 and agent.slug = desired.agent_slug
where not exists (
  select 1
  from public.band_agents existing
  where existing.band_entity_id = band.id
    and existing.agent_entity_id = agent.id
    and existing.role_name = desired.role_name
);

-- -----------------------------------------------------------------------------
-- 3. Entidades auxiliares para el mapa musical vigente
-- -----------------------------------------------------------------------------

drop table if exists pg_temp._hc_tejera_brotherhoods;
create temporary table _hc_tejera_brotherhoods (
  slug text primary key,
  name text not null,
  official_name text not null,
  municipality_slug text not null,
  procession_day text not null,
  website_url text
) on commit drop;

insert into _hc_tejera_brotherhoods values
  (
    'las-penas-de-san-vicente', 'Las Penas de San Vicente',
    'Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús de las Penas y María Santísima de los Dolores',
    'sevilla', 'Lunes Santo', null
  ),
  (
    'santa-cruz', 'Santa Cruz',
    'Ilustre y Antigua Hermandad del Santísimo Sacramento y Nuestra Señora de la Paz; Fervorosa Cofradía de Nazarenos del Santísimo Cristo de las Misericordias, Santa María de la Antigua y Nuestra Señora de los Dolores',
    'sevilla', 'Martes Santo', null
  ),
  (
    'cristo-de-burgos', 'Cristo de Burgos',
    'Pontificia, Real, Ilustre y Fervorosa Hermandad y Cofradía de Nazarenos del Santísimo Cristo de Burgos, Negaciones y Lágrimas de San Pedro y Madre de Dios de la Palma',
    'sevilla', 'Miércoles Santo', 'https://www.cristodeburgos.es/'
  ),
  (
    'el-valle', 'El Valle',
    'Pontificia, Real, Ilustre y Primitiva Archicofradía de Nazarenos del Santísimo Cristo de la Coronación de Espinas, Nuestro Padre Jesús con la Cruz al Hombro, Nuestra Señora del Valle y Santa Mujer Verónica',
    'sevilla', 'Jueves Santo', null
  ),
  (
    'montserrat', 'Montserrat',
    'Pontificia, Real, Ilustre, Antigua y Primitiva Hermandad de Nuestra Señora del Rosario y Cofradía de Nazarenos del Santísimo Cristo de la Conversión del Buen Ladrón y Nuestra Señora de Montserrat',
    'sevilla', 'Viernes Santo', null
  ),
  (
    'santo-entierro-dos-hermanas', 'Santo Entierro de Dos Hermanas',
    'Antigua y Fervorosa Hermandad y Cofradía de Nazarenos del Triunfo de la Santa Cruz sobre la Muerte, Santo Entierro y Resurrección de Nuestro Señor Jesucristo y Nuestra Señora de la Soledad',
    'dos-hermanas', 'Sábado Santo', null
  );

insert into public.entities (entity_type, name, slug, status)
select 'brotherhood', desired.name, desired.slug, 'draft'
from _hc_tejera_brotherhoods desired
on conflict (slug) do update set
  name = excluded.name;

insert into public.brotherhoods (
  entity_id, official_name, popular_name, municipality_id,
  website_url, brotherhood_types, current_procession_day
)
select
  entity.id, desired.official_name, desired.name, municipality.id,
  desired.website_url, array['Penitencia']::text[], desired.procession_day
from _hc_tejera_brotherhoods desired
join public.entities entity
  on entity.entity_type = 'brotherhood'
 and entity.slug = desired.slug
join public.municipalities municipality
  on municipality.slug = desired.municipality_slug
on conflict (entity_id) do update set
  official_name = excluded.official_name,
  popular_name = excluded.popular_name,
  municipality_id = excluded.municipality_id,
  website_url = coalesce(excluded.website_url, public.brotherhoods.website_url),
  brotherhood_types = excluded.brotherhood_types,
  current_procession_day = excluded.current_procession_day;

drop table if exists pg_temp._hc_tejera_steps;
create temporary table _hc_tejera_steps (
  brotherhood_slug text not null,
  slug text primary key,
  name text not null
) on commit drop;

insert into _hc_tejera_steps values
  (
    'las-penas-de-san-vicente', 'paso-palio-maria-santisima-dolores-penas-san-vicente',
    'Paso de palio de María Santísima de los Dolores'
  ),
  (
    'santa-cruz', 'paso-palio-nuestra-senora-dolores-santa-cruz',
    'Paso de palio de Nuestra Señora de los Dolores'
  ),
  (
    'cristo-de-burgos', 'paso-palio-madre-dios-palma',
    'Paso de palio de Madre de Dios de la Palma'
  ),
  (
    'el-valle', 'paso-palio-nuestra-senora-valle',
    'Paso de palio de Nuestra Señora del Valle'
  ),
  (
    'montserrat', 'paso-palio-nuestra-senora-montserrat',
    'Paso de palio de Nuestra Señora de Montserrat'
  ),
  (
    'santo-entierro-dos-hermanas', 'paso-palio-nuestra-senora-soledad-santo-entierro-dos-hermanas',
    'Paso de palio de Nuestra Señora de la Soledad'
  );

insert into public.entities (entity_type, name, slug, status)
select 'step', desired.name, desired.slug, 'draft'
from _hc_tejera_steps desired
on conflict (slug) do update set
  name = excluded.name;

insert into public.steps (entity_id, step_type, current_condition)
select entity.id, 'Palio', 'preserved'
from _hc_tejera_steps desired
join public.entities entity
  on entity.entity_type = 'step'
 and entity.slug = desired.slug
on conflict (entity_id) do update set
  step_type = excluded.step_type,
  current_condition = excluded.current_condition;

insert into public.brotherhood_steps (
  brotherhood_entity_id, step_entity_id, relation_type, status
)
select brotherhood.id, step.id, 'processional_step', 'draft'
from _hc_tejera_steps desired
join public.entities brotherhood
  on brotherhood.entity_type = 'brotherhood'
 and brotherhood.slug = desired.brotherhood_slug
join public.entities step
  on step.entity_type = 'step'
 and step.slug = desired.slug
where not exists (
  select 1
  from public.brotherhood_steps existing
  where existing.brotherhood_entity_id = brotherhood.id
    and existing.step_entity_id = step.id
    and existing.relation_type = 'processional_step'
    and existing.status <> 'archived'
);

-- -----------------------------------------------------------------------------
-- 4. Ocho acompañamientos vigentes confirmados para 2026
-- -----------------------------------------------------------------------------

drop table if exists pg_temp._hc_tejera_accompaniments;
create temporary table _hc_tejera_accompaniments (
  brotherhood_slug text not null,
  step_slug text not null,
  outing_type text not null,
  position text not null,
  date_from_text text not null,
  public_brotherhood_name text not null,
  public_step_name text not null,
  notes text not null,
  source_url text not null,
  primary key (brotherhood_slug, step_slug)
) on commit drop;

insert into _hc_tejera_accompaniments values
  (
    'la-cena', 'paso-palio-nuestra-senora-del-subterraneo',
    'Domingo de Ramos', 'Tras el paso de palio de Nuestra Señora del Subterráneo',
    'Vigente en 2026', 'La Cena', 'Paso de palio de Nuestra Señora del Subterráneo',
    'Acompañamiento musical confirmado para la estación de penitencia del Domingo de Ramos de 2026.',
    'https://lacenadesevilla.es/datos-de-la-cofradia-domingo-ramos-2022/'
  ),
  (
    'las-penas-de-san-vicente', 'paso-palio-maria-santisima-dolores-penas-san-vicente',
    'Lunes Santo', 'Tras el paso de palio de María Santísima de los Dolores',
    'Vigente en 2026', 'Las Penas de San Vicente', 'Paso de palio de María Santísima de los Dolores',
    'Acompañamiento musical confirmado para la estación de penitencia del Lunes Santo de 2026.',
    'https://www.hermandades-de-sevilla.org/semanasanta/ls_las_penas.html'
  ),
  (
    'santa-cruz', 'paso-palio-nuestra-senora-dolores-santa-cruz',
    'Martes Santo', 'Tras el paso de palio de Nuestra Señora de los Dolores',
    'Vigente en 2026', 'Santa Cruz', 'Paso de palio de Nuestra Señora de los Dolores',
    'Acompañamiento musical confirmado para la estación de penitencia del Martes Santo de 2026.',
    'https://www.hermandades-de-sevilla.org/semanasanta/mt_santa_cruz.html'
  ),
  (
    'cristo-de-burgos', 'paso-palio-madre-dios-palma',
    'Miércoles Santo', 'Tras el paso de palio de Madre de Dios de la Palma',
    'Vigente en 2026', 'Cristo de Burgos', 'Paso de palio de Madre de Dios de la Palma',
    'Acompañamiento musical confirmado para la estación de penitencia del Miércoles Santo de 2026.',
    'https://www.diariodesevilla.es/semana_santa/bandas-musica-semana-santa-sevilla-2026_0_2006120681.html'
  ),
  (
    'el-valle', 'paso-palio-nuestra-senora-valle',
    'Jueves Santo', 'Tras el paso de palio de Nuestra Señora del Valle',
    'Vigente en 2026', 'El Valle', 'Paso de palio de Nuestra Señora del Valle',
    'Acompañamiento musical confirmado para la estación de penitencia del Jueves Santo de 2026.',
    'https://www.hermandades-de-sevilla.org/semanasanta/js_el_valle.html'
  ),
  (
    'montserrat', 'paso-palio-nuestra-senora-montserrat',
    'Viernes Santo', 'Tras el paso de palio de Nuestra Señora de Montserrat',
    'Vigente en 2026', 'Montserrat', 'Paso de palio de Nuestra Señora de Montserrat',
    'Acompañamiento musical confirmado para la estación de penitencia del Viernes Santo de 2026.',
    'https://www.hermandades-de-sevilla.org/semanasanta/vs_montserrat.html'
  ),
  (
    'santo-entierro-dos-hermanas', 'paso-palio-nuestra-senora-soledad-santo-entierro-dos-hermanas',
    'Sábado Santo', 'Tras el paso de palio de Nuestra Señora de la Soledad',
    'Vigente en 2026', 'Santo Entierro de Dos Hermanas', 'Paso de palio de Nuestra Señora de la Soledad',
    'Acompañamiento musical confirmado para la estación de penitencia del Sábado Santo de 2026 en Dos Hermanas.',
    'https://doshermanas.com/2026/03/25/semana-santa-2026-sabado-santo-santo-entierro/'
  ),
  (
    'la-cena', 'paso-procesional-nuestra-senora-de-la-encarnacion-la-cena',
    'Procesión de gloria', 'Tras el paso de gloria de Nuestra Señora de la Encarnación',
    'Vigente en 2026', 'La Cena', 'Paso procesional de Nuestra Señora de la Encarnación',
    'Acompañamiento musical confirmado para la procesión de gloria de Nuestra Señora de la Encarnación de 2026.',
    'https://lacenadesevilla.es/cultos-fiestas-y-salida-procesional-virgen-de-la-encarnacion/'
  );

update public.music_accompaniment_periods period
set
  position = desired.position,
  outing_type = desired.outing_type,
  date_from = null,
  date_from_text = desired.date_from_text,
  year_from = null,
  date_to = null,
  date_to_text = null,
  year_to = null,
  is_current = true,
  notes = desired.notes,
  status = 'published',
  public_brotherhood_name = desired.public_brotherhood_name,
  public_step_name = desired.public_step_name,
  public_brotherhood_slug = desired.brotherhood_slug,
  updated_at = now()
from _hc_tejera_accompaniments desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-del-maestro-tejera'
join public.entities brotherhood
  on brotherhood.entity_type = 'brotherhood'
 and brotherhood.slug = desired.brotherhood_slug
join public.entities step
  on step.entity_type = 'step'
 and step.slug = desired.step_slug
where period.band_entity_id = band.id
  and period.brotherhood_entity_id = brotherhood.id
  and period.step_entity_id = step.id
  and period.is_current
  and period.status <> 'archived';

insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id,
  position, outing_type, date_from_text,
  is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug
)
select
  brotherhood.id, band.id, step.id,
  desired.position, desired.outing_type, desired.date_from_text,
  true, desired.notes, 'published',
  desired.public_brotherhood_name, desired.public_step_name, desired.brotherhood_slug
from _hc_tejera_accompaniments desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-del-maestro-tejera'
join public.entities brotherhood
  on brotherhood.entity_type = 'brotherhood'
 and brotherhood.slug = desired.brotherhood_slug
join public.entities step
  on step.entity_type = 'step'
 and step.slug = desired.step_slug
where not exists (
  select 1
  from public.music_accompaniment_periods existing
  where existing.band_entity_id = band.id
    and existing.brotherhood_entity_id = brotherhood.id
    and existing.step_entity_id = step.id
    and existing.is_current
    and existing.status <> 'archived'
);

-- -----------------------------------------------------------------------------
-- 5. Fuentes de identidad y de cada acompañamiento
-- -----------------------------------------------------------------------------

drop table if exists pg_temp._hc_tejera_identity_sources;
create temporary table _hc_tejera_identity_sources (
  name text not null,
  url text primary key,
  source_type text not null,
  publisher text,
  publication_date date,
  license text,
  scope text not null,
  notes text
) on commit drop;

insert into _hc_tejera_identity_sources values
  (
    '125 años de la Banda de Tejera: historia y origen documentado',
    'https://www.diariodesevilla.es/semana_santa/125-anos-banda-tejera-libro_0_2006013815.html',
    'Prensa cofrade', 'Diario de Sevilla', '2026-02-27', null,
    'Origen en 1901, denominación histórica, Real Maestranza, repertorio, reconocimiento municipal y dirección institucional',
    null
  ),
  (
    'Sergio Jiménez, nuevo director musical de la banda del Maestro Tejera',
    'https://www.diariodesevilla.es/semana_santa/sergio-jimenez-nuevo-director-musical_0_2002625739.html',
    'Prensa cofrade', 'Diario de Sevilla', '2024-10-23', null,
    'Nombramiento de Sergio Jiménez Martín y cierre de la etapa de Manuel Pérez Hidalgo',
    null
  ),
  (
    'Ficha federativa de la Banda de Música Maestro Tejera',
    'https://federband.org/banda/banda-de-musica-maestro-tejera',
    'Directorio federativo', 'Federación Andaluza de Bandas de Música', null, null,
    'Responsabilidades actuales de presidencia y dirección musical',
    null
  ),
  (
    'Perfil oficial de Maestro Tejera en X',
    'https://x.com/MaestroTejera',
    'Red social oficial', 'Banda de Música del Maestro Tejera', null,
    'Identificación institucional',
    'Emblema usado para identificar a la formación; se conserva a resolución moderada y sin atribuir autoría gráfica.',
    'Procedencia del emblema y canal oficial'
  );

update public.sources source
set
  name = desired.name,
  source_type = desired.source_type,
  author_or_publisher = desired.publisher,
  publication_date = desired.publication_date,
  accessed_at = '2026-08-21'::date,
  license = desired.license,
  notes = desired.notes
from _hc_tejera_identity_sources desired
where source.url = desired.url;

insert into public.sources (
  name, url, source_type, author_or_publisher,
  publication_date, accessed_at, license, notes
)
select
  desired.name, desired.url, desired.source_type, desired.publisher,
  desired.publication_date, '2026-08-21'::date, desired.license, desired.notes
from _hc_tejera_identity_sources desired
where not exists (
  select 1 from public.sources source where source.url = desired.url
);

insert into public.source_links (source_id, entity_id, scope)
select source.id, band.id, desired.scope
from _hc_tejera_identity_sources desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-del-maestro-tejera'
join lateral (
  select candidate.id
  from public.sources candidate
  where candidate.url = desired.url
  order by candidate.created_at, candidate.id
  limit 1
) source on true
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.entity_id = band.id
);

drop table if exists pg_temp._hc_tejera_accompaniment_sources;
create temporary table _hc_tejera_accompaniment_sources (
  url text primary key,
  name text not null,
  source_type text not null,
  publisher text,
  publication_date date
) on commit drop;

insert into _hc_tejera_accompaniment_sources values
  (
    'https://lacenadesevilla.es/datos-de-la-cofradia-domingo-ramos-2022/',
    'Datos de la cofradía del Domingo de Ramos', 'Web oficial', 'Hermandad de la Sagrada Cena', null
  ),
  (
    'https://www.hermandades-de-sevilla.org/semanasanta/ls_las_penas.html',
    'Las Penas · ficha del Lunes Santo 2026', 'Web oficial', 'Consejo General de Hermandades y Cofradías de Sevilla', null
  ),
  (
    'https://www.hermandades-de-sevilla.org/semanasanta/mt_santa_cruz.html',
    'Santa Cruz · ficha del Martes Santo 2026', 'Web oficial', 'Consejo General de Hermandades y Cofradías de Sevilla', null
  ),
  (
    'https://www.diariodesevilla.es/semana_santa/bandas-musica-semana-santa-sevilla-2026_0_2006120681.html',
    'Bandas de música de la Semana Santa de Sevilla 2026', 'Prensa cofrade', 'Diario de Sevilla', null
  ),
  (
    'https://www.hermandades-de-sevilla.org/semanasanta/js_el_valle.html',
    'El Valle · ficha del Jueves Santo 2026', 'Web oficial', 'Consejo General de Hermandades y Cofradías de Sevilla', null
  ),
  (
    'https://www.hermandades-de-sevilla.org/semanasanta/vs_montserrat.html',
    'Montserrat · ficha del Viernes Santo 2026', 'Web oficial', 'Consejo General de Hermandades y Cofradías de Sevilla', null
  ),
  (
    'https://doshermanas.com/2026/03/25/semana-santa-2026-sabado-santo-santo-entierro/',
    'Semana Santa 2026 · Santo Entierro de Dos Hermanas', 'Información municipal', 'doshermanas.com', '2026-03-25'
  ),
  (
    'https://lacenadesevilla.es/cultos-fiestas-y-salida-procesional-virgen-de-la-encarnacion/',
    'Cultos, fiestas y salida procesional de Nuestra Señora de la Encarnación', 'Web oficial', 'Hermandad de la Sagrada Cena', null
  );

update public.sources source
set
  name = desired.name,
  source_type = desired.source_type,
  author_or_publisher = desired.publisher,
  publication_date = desired.publication_date,
  accessed_at = '2026-08-21'::date
from _hc_tejera_accompaniment_sources desired
where source.url = desired.url;

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at
)
select
  desired.name, desired.url, desired.source_type, desired.publisher,
  desired.publication_date, '2026-08-21'::date
from _hc_tejera_accompaniment_sources desired
where not exists (
  select 1 from public.sources source where source.url = desired.url
);

insert into public.source_links (
  source_id, music_accompaniment_period_id, scope
)
select
  source.id,
  period.id,
  'Vigencia y ubicación del acompañamiento musical en 2026'
from _hc_tejera_accompaniments desired
join public.entities band
  on band.entity_type = 'band'
 and band.slug = 'banda-de-musica-del-maestro-tejera'
join public.entities brotherhood
  on brotherhood.entity_type = 'brotherhood'
 and brotherhood.slug = desired.brotherhood_slug
join public.entities step
  on step.entity_type = 'step'
 and step.slug = desired.step_slug
join public.music_accompaniment_periods period
  on period.band_entity_id = band.id
 and period.brotherhood_entity_id = brotherhood.id
 and period.step_entity_id = step.id
 and period.is_current
 and period.status = 'published'
join lateral (
  select candidate.id
  from public.sources candidate
  where candidate.url = desired.source_url
  order by candidate.created_at, candidate.id
  limit 1
) source on true
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.music_accompaniment_period_id = period.id
);

-- -----------------------------------------------------------------------------
-- 6. Invariantes editoriales
-- -----------------------------------------------------------------------------

do $$
declare
  band_id uuid;
  current_count integer;
  sourced_count integer;
  duplicate_count integer;
begin
  select id into band_id
  from public.entities
  where entity_type = 'band'
    and slug = 'banda-de-musica-del-maestro-tejera';

  select count(*) into current_count
  from public.music_accompaniment_periods
  where band_entity_id = band_id
    and is_current
    and status = 'published';

  if current_count <> 8 then
    raise exception 'Maestro Tejera debe tener 8 acompañamientos vigentes publicados; encontrados: %', current_count;
  end if;

  select count(distinct period.id) into sourced_count
  from public.music_accompaniment_periods period
  join public.source_links link
    on link.music_accompaniment_period_id = period.id
  where period.band_entity_id = band_id
    and period.is_current
    and period.status = 'published';

  if sourced_count <> 8 then
    raise exception 'Los 8 acompañamientos vigentes de Maestro Tejera deben tener fuente; encontrados: %', sourced_count;
  end if;

  select count(*) into duplicate_count
  from (
    select brotherhood_entity_id, step_entity_id
    from public.music_accompaniment_periods
    where band_entity_id = band_id
      and is_current
      and status <> 'archived'
    group by brotherhood_entity_id, step_entity_id
    having count(*) > 1
  ) duplicates;

  if duplicate_count <> 0 then
    raise exception 'La migración ha generado acompañamientos vigentes duplicados';
  end if;

  if (
    select count(*)
    from public.band_agents
    where band_entity_id = band_id
      and is_current
      and is_public
  ) <> 2 then
    raise exception 'La dirección actual de Maestro Tejera debe contener presidencia y dirección musical';
  end if;
end $$;
