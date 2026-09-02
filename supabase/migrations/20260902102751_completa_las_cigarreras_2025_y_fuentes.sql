-- Las Cigarreras · cierre documental de la ficha patrón
-- Solo DML sobre el modelo First Edition existente.
-- No introduce DDL, tablas, RLS ni cambios de arquitectura.

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select d.name, d.url, d.source_type, d.publisher, d.publication_date,
       date '2026-09-02', d.notes
from (values
  ('Las Cigarreras · historia', 'https://lascigarreras.net/historia/', 'Web oficial', 'Banda de Las Cigarreras', null::date, 'Fundación, evolución musical y pertenencia institucional.'),
  ('Las Cigarreras · segunda década', 'https://lascigarreras.net/historia/1989-1999/', 'Web oficial', 'Banda de Las Cigarreras', null::date, 'Cronología institucional y acompañamientos de la década de 1990.'),
  ('Las Cigarreras · tercera década', 'https://lascigarreras.net/historia/1999-2009/', 'Web oficial', 'Banda de Las Cigarreras', null::date, 'Cronología institucional y cambio de acompañamiento de 2003.'),
  ('Sanctae Crucis · ficha de repertorio', 'https://lascigarreras.net/repertorio/sanctae-crucis/', 'Web oficial', 'Banda de Las Cigarreras', null::date, 'Autoría, fecha, lugar, dedicatoria y naturaleza del estreno.'),
  ('Soberano · ficha de repertorio', 'https://lascigarreras.net/repertorio/soberano/', 'Web oficial', 'Banda de Las Cigarreras', null::date, 'Autoría, fecha, lugar, dedicatoria y naturaleza del estreno.'),
  ('Las Cigarreras · Apple Music', 'https://music.apple.com/es/artist/las-cigarreras/206850846', 'Plataforma musical', 'Apple Music', null::date, 'Perfil oficial y catálogo digital de la formación.'),
  ('Sanctae Crucis · edición digital', 'https://music.apple.com/es/album/sanctae-crucis-estreno-2025-single/1798502587', 'Plataforma musical', 'Apple Music', date '2025-02-21', 'Fecha y metadatos editoriales de la edición digital.'),
  ('Soberano · edición digital', 'https://music.apple.com/es/album/soberano-estreno-2025-single/1795758577', 'Plataforma musical', 'Apple Music', date '2025-02-07', 'Fecha y metadatos editoriales de la edición digital.')
) as d(name, url, source_type, publisher, publication_date, notes)
where not exists (select 1 from public.sources s where s.url = d.url);

update public.sources
set accessed_at = date '2026-09-02'
where url in (
  'https://lascigarreras.net/historia/',
  'https://lascigarreras.net/historia/1989-1999/',
  'https://lascigarreras.net/historia/1999-2009/',
  'https://lascigarreras.net/repertorio/sanctae-crucis/',
  'https://lascigarreras.net/repertorio/soberano/',
  'https://music.apple.com/es/artist/las-cigarreras/206850846',
  'https://music.apple.com/es/album/sanctae-crucis-estreno-2025-single/1798502587',
  'https://music.apple.com/es/album/soberano-estreno-2025-single/1795758577',
  'https://lascigarreras.net/direccion/',
  'https://lascigarreras.net/nuestra-semana-santa-2025-2/'
);

do $$
declare
  v_band uuid;
  v_sanctae uuid;
  v_soberano uuid;
  v_cristobal uuid;
  v_pacheco uuid;
  v_cerrillo uuid;
  v_san_gonzalo uuid;
  v_source_history uuid;
  v_source_second_decade uuid;
  v_source_third_decade uuid;
  v_source_semana_santa uuid;
  v_source_direction uuid;
  v_source_sanctae uuid;
  v_source_soberano uuid;
  v_source_apple uuid;
  v_source_sanctae_release uuid;
  v_source_soberano_release uuid;
begin
  select id into v_band
  from public.entities
  where slug = 'las-cigarreras' and entity_type = 'band';

  if v_band is null then
    raise exception 'No se ha encontrado la Banda canónica de Las Cigarreras';
  end if;

  select id into v_cristobal from public.entities
  where slug = 'cristobal-lopez-gandara' and entity_type = 'agent';
  select id into v_pacheco from public.entities
  where slug = 'pedro-manuel-pacheco-palomo' and entity_type = 'agent';
  select id into v_cerrillo from public.entities
  where slug = 'santa-cruz-cerrillo-santa-elena-villalba-alcor' and entity_type = 'brotherhood';
  select id into v_san_gonzalo from public.entities
  where slug = 'hermandad-de-san-gonzalo' and entity_type = 'brotherhood';

  if v_cristobal is null or v_pacheco is null or v_cerrillo is null or v_san_gonzalo is null then
    raise exception 'Faltan autores o hermandades canónicas para los estrenos de 2025';
  end if;

  select id into v_source_history from public.sources where url = 'https://lascigarreras.net/historia/' order by created_at limit 1;
  select id into v_source_second_decade from public.sources where url = 'https://lascigarreras.net/historia/1989-1999/' order by created_at limit 1;
  select id into v_source_third_decade from public.sources where url = 'https://lascigarreras.net/historia/1999-2009/' order by created_at limit 1;
  select id into v_source_semana_santa from public.sources where url = 'https://lascigarreras.net/nuestra-semana-santa-2025-2/' order by created_at limit 1;
  select id into v_source_direction from public.sources where url = 'https://lascigarreras.net/direccion/' order by created_at limit 1;
  select id into v_source_sanctae from public.sources where url = 'https://lascigarreras.net/repertorio/sanctae-crucis/' order by created_at limit 1;
  select id into v_source_soberano from public.sources where url = 'https://lascigarreras.net/repertorio/soberano/' order by created_at limit 1;
  select id into v_source_apple from public.sources where url = 'https://music.apple.com/es/artist/las-cigarreras/206850846' order by created_at limit 1;
  select id into v_source_sanctae_release from public.sources where url = 'https://music.apple.com/es/album/sanctae-crucis-estreno-2025-single/1798502587' order by created_at limit 1;
  select id into v_source_soberano_release from public.sources where url = 'https://music.apple.com/es/album/soberano-estreno-2025-single/1795758577' order by created_at limit 1;

  update public.bands
  set description = 'Nacida en 1979 en el seno de la Hermandad de la Sagrada Columna y Azotes, la Banda de Cornetas y Tambores Nuestra Señora de la Victoria evolucionó desde una formación de estilo mixto hasta desarrollar el sonido propio conocido como estilo de Las Cigarreras. Pertenece a su Hermandad y tiene su sede en el Parque Empresarial Arte Sacro de Sevilla.',
      instagram_url = 'https://www.instagram.com/lascigarreras/'
  where entity_id = v_band;

  insert into public.entity_social_links (
    entity_id, platform, url, label, display_order, is_public
  ) values
    (v_band, 'instagram', 'https://www.instagram.com/lascigarreras/', 'Instagram oficial', 20, true),
    (v_band, 'facebook', 'https://www.facebook.com/lascigarreras/', 'Facebook oficial', 30, true),
    (v_band, 'youtube', 'https://www.youtube.com/lascigarreras', 'YouTube oficial', 40, true)
  on conflict (entity_id, platform) do update set
    url = excluded.url,
    label = excluded.label,
    display_order = excluded.display_order,
    is_public = excluded.is_public,
    updated_at = now();

  insert into public.source_links (source_id, entity_id, scope, notes)
  select d.source_id, d.entity_id, d.scope, d.notes
  from (values
    (v_source_history, v_band, 'Historia institucional', 'Relato publicado por la propia formación.'),
    (v_source_direction, v_band, 'Dirección vigente', 'Equipo de dirección publicado por la propia formación.'),
    (v_source_apple, v_band, 'Catálogo digital', 'Perfil oficial de la formación en Apple Music.')
  ) as d(source_id, entity_id, scope, notes)
  where d.source_id is not null
    and not exists (
      select 1 from public.source_links sl
      where sl.source_id = d.source_id and sl.entity_id = d.entity_id and sl.scope = d.scope
    );

  -- La vigencia ya se expresa en el estado del período. Conservamos solo
  -- contexto histórico que añade información documental.
  update public.music_accompaniment_periods
  set notes = null, updated_at = now()
  where band_entity_id = v_band
    and id in (
      'c1300000-0000-0000-0000-000000000002'::uuid,
      'c1300000-0000-0000-0000-000000000006'::uuid
    );

  insert into public.source_links (
    source_id, music_accompaniment_period_id, scope, notes
  )
  select v_source_semana_santa, p.id, 'Período histórico',
         'La cronología oficial sitúa a la formación en San Bernardo entre 1993 y 2003.'
  from public.music_accompaniment_periods p
  where p.band_entity_id = v_band
    and p.id = 'e1300000-0000-0000-0000-000000000001'::uuid
    and v_source_semana_santa is not null
    and not exists (
      select 1 from public.source_links sl
      where sl.source_id = v_source_semana_santa
        and sl.music_accompaniment_period_id = p.id
    );

  -- La página de dirección sigue mostrando los seis miembros. Eliminamos
  -- el curso antiguo y la nota de carga, que ya no aportan contexto público.
  update public.band_agents
  set date_from_text = null,
      notes = null
  where band_entity_id = v_band
    and role_name = 'Dirección musical'
    and is_current = true;

  insert into public.source_links (source_id, entity_id, scope, notes)
  select v_source_direction, ba.agent_entity_id, 'Dirección musical de Las Cigarreras',
         'La formación incluye a esta persona en su equipo actual de dirección musical.'
  from public.band_agents ba
  where ba.band_entity_id = v_band
    and ba.role_name = 'Dirección musical'
    and ba.is_current = true
    and v_source_direction is not null
    and not exists (
      select 1 from public.source_links sl
      where sl.source_id = v_source_direction
        and sl.entity_id = ba.agent_entity_id
        and sl.scope = 'Dirección musical de Las Cigarreras'
    );

  insert into public.entities (entity_type, name, slug, summary, status)
  values
    ('march', 'Sanctae Crucis', 'marcha-sanctae-crucis', 'Marcha de Cristóbal López Gándara estrenada por Las Cigarreras en 2025 y dedicada a la Santa Cruz del Cerrillo de Villalba del Alcor y a la memoria de Elia Campillo Mañas.', 'published'),
    ('march', 'Soberano', 'marcha-soberano-las-cigarreras', 'Marcha de Pedro Manuel Pacheco Palomo estrenada por Las Cigarreras en 2025 y dedicada a Nuestro Padre Jesús en su Soberano Poder ante Caifás.', 'published')
  on conflict (slug) do update set
    entity_type = excluded.entity_type,
    name = excluded.name,
    summary = excluded.summary,
    status = excluded.status,
    updated_at = now();

  select id into v_sanctae from public.entities where slug = 'marcha-sanctae-crucis';
  select id into v_soberano from public.entities where slug = 'marcha-soberano-las-cigarreras';

  insert into public.marches (
    entity_id, composition_year, composition_date_text, music_type,
    youtube_video_id, description, premiere_date, premiere_date_text,
    premiered_by_band_entity_id, notes, work_type
  ) values
    (v_sanctae, 2025, '2025', 'Cornetas y Tambores', 'vLq9anIOk1w',
     'Marcha procesional de Cristóbal López Gándara dedicada a la Hermandad de la Santa Cruz del Cerrillo y Santa Elena Emperatriz de Villalba del Alcor y a Elia Campillo Mañas, in memoriam.',
     date '2025-02-21', '21 de febrero de 2025', v_band,
     'Estreno absoluto en el XII Concierto Manolo Pardo… In Memoriam.', 'Marcha procesional'),
    (v_soberano, 2025, '2025', 'Cornetas y Tambores', null,
     'Marcha procesional de Pedro Manuel Pacheco Palomo dedicada a Nuestro Padre Jesús en su Soberano Poder ante Caifás, por el cincuentenario de su hechura y bendición.',
     date '2025-02-07', '7 de febrero de 2025', v_band,
     'Estreno absoluto en un concierto conmemorativo de la Hermandad de San Gonzalo.', 'Marcha procesional')
  on conflict (entity_id) do update set
    composition_year = excluded.composition_year,
    composition_date_text = excluded.composition_date_text,
    music_type = excluded.music_type,
    youtube_video_id = excluded.youtube_video_id,
    description = excluded.description,
    premiere_date = excluded.premiere_date,
    premiere_date_text = excluded.premiere_date_text,
    premiered_by_band_entity_id = excluded.premiered_by_band_entity_id,
    notes = excluded.notes,
    work_type = excluded.work_type;

  insert into public.march_authors (
    march_entity_id, agent_entity_id, author_role, notes, status
  ) values
    (v_sanctae, v_cristobal, 'composer', 'Autoría publicada en la ficha oficial de la obra.', 'published'),
    (v_soberano, v_pacheco, 'composer', 'Autoría publicada en la ficha oficial de la obra.', 'published')
  on conflict (march_entity_id, agent_entity_id, author_role) do update set
    notes = excluded.notes,
    status = excluded.status;

  insert into public.march_dedications (
    march_entity_id, dedicatee_entity_id, dedication_type, dedication_text,
    date_from, date_from_text, notes, status
  ) values
    (v_sanctae, v_cerrillo, 'dedicated_to', 'Hermandad de la Santa Cruz del Cerrillo y Santa Elena Emperatriz de Villalba del Alcor; Elia Campillo Mañas, in memoriam.', date '2025-02-21', '21/02/2025', 'El nodo relacional representa a la Hermandad; el texto conserva también la dedicatoria personal.', 'published'),
    (v_soberano, v_san_gonzalo, 'dedicated_to', 'Nuestro Padre Jesús en su Soberano Poder ante Caifás, por el 50.º aniversario de su hechura y bendición.', date '2025-02-07', '07/02/2025', 'El nodo relacional es la Hermandad; el texto conserva el titular y la efeméride exactos.', 'published')
  on conflict (march_entity_id, dedicatee_entity_id, dedication_type) do update set
    dedication_text = excluded.dedication_text,
    date_from = excluded.date_from,
    date_from_text = excluded.date_from_text,
    notes = excluded.notes,
    status = excluded.status;

  insert into public.band_premieres (
    band_entity_id, title, composer_name, premiere_year, premiere_date,
    venue_text, municipality_text, video_url, description, source_id,
    status, display_order, march_entity_id
  ) values
    (v_band, 'Soberano', 'Pedro Manuel Pacheco Palomo', 2025, date '2025-02-07',
     'Parroquia de San Gonzalo', 'Sevilla', null,
     'Tipo de novedad: estreno absoluto. Dedicada a Nuestro Padre Jesús en su Soberano Poder ante Caifás por el cincuentenario de su hechura y bendición.',
     v_source_soberano, 'published', 10, v_soberano),
    (v_band, 'Sanctae Crucis', 'Cristóbal López Gándara', 2025, date '2025-02-21',
     'Iglesia Conventual del Santo Ángel', 'Sevilla', 'https://www.youtube.com/watch?v=vLq9anIOk1w',
     'Tipo de novedad: estreno absoluto. Dedicada a la Hermandad de la Santa Cruz del Cerrillo y a Elia Campillo Mañas, in memoriam.',
     v_source_sanctae, 'published', 20, v_sanctae)
  on conflict (band_entity_id, title, premiere_year) do update set
    composer_name = excluded.composer_name,
    premiere_date = excluded.premiere_date,
    venue_text = excluded.venue_text,
    municipality_text = excluded.municipality_text,
    video_url = excluded.video_url,
    description = excluded.description,
    source_id = excluded.source_id,
    status = excluded.status,
    display_order = excluded.display_order,
    march_entity_id = excluded.march_entity_id;

  insert into public.source_links (source_id, entity_id, scope, notes)
  select d.source_id, d.entity_id, d.scope, d.notes
  from (values
    (v_source_sanctae, v_sanctae, 'Estreno, autoría y dedicatoria', 'Ficha oficial de la obra.'),
    (v_source_sanctae_release, v_sanctae, 'Edición digital', 'Metadatos editoriales de la edición oficial.'),
    (v_source_soberano, v_soberano, 'Estreno, autoría y dedicatoria', 'Ficha oficial de la obra.'),
    (v_source_soberano_release, v_soberano, 'Edición digital', 'Metadatos editoriales de la edición oficial.')
  ) as d(source_id, entity_id, scope, notes)
  where d.source_id is not null
    and not exists (
      select 1 from public.source_links sl
      where sl.source_id = d.source_id and sl.entity_id = d.entity_id and sl.scope = d.scope
    );

  insert into public.source_links (source_id, band_premiere_id, scope, notes)
  select bp.source_id, bp.id, 'Estreno absoluto', 'Ficha oficial de la obra y de su estreno.'
  from public.band_premieres bp
  where bp.band_entity_id = v_band
    and bp.premiere_year = 2025
    and bp.title in ('Sanctae Crucis', 'Soberano')
    and bp.source_id is not null
    and not exists (
      select 1 from public.source_links sl
      where sl.source_id = bp.source_id and sl.band_premiere_id = bp.id
    );

  -- Relacionamos las pistas ya publicadas con su marcha canónica; no se
  -- crean grabaciones duplicadas ni se alteran los títulos editoriales.
  update public.band_release_tracks t
  set march_entity_id = v_sanctae
  from public.band_releases r
  where t.release_id = r.id
    and r.band_entity_id = v_band
    and t.title in ('Sanctae Crucis - Santo Ángel 2025', 'Sanctae Crucis');

  update public.band_release_tracks t
  set march_entity_id = v_soberano
  from public.band_releases r
  where t.release_id = r.id
    and r.band_entity_id = v_band
    and t.title = 'Soberano - San Gonzalo 2025';
end
$$;
