-- Certificación editorial de la Centuria Romana Macarena.
-- Lote exclusivamente DML: normaliza identidad, completa acompañamientos
-- documentados y relaciona los estrenos 2025-2026 con obras y autores.

insert into public.sources (name, url, source_type, author_or_publisher, publication_date, accessed_at, notes)
select d.name, d.url, d.source_type, d.publisher, d.publication_date, date '2026-09-02', d.notes
from (values
  ('Pino Montano · concierto y vínculo con la Centuria Juvenil', 'https://hermandadpinomontano.es/cuaresma-2026-pregon-y-concierto-de-la-centuria-macarena-juvenil/', 'Web oficial', 'Hermandad de Pino Montano', null, 'Confirma el acompañamiento anual de la sección juvenil en la Cruz de Guía.'),
  ('La Paz · acuerdo con la Centuria Juvenil', 'https://www.hermandaddelamacarena.es/2026/02/la-hermandad-de-la-paz-y-la-banda-juvenil-de-la-centuria-romana-macarena-firman-el-acuerdo-para-el-proximo-domingo-de-ramos/', 'Web oficial', 'Hermandad de la Macarena', null, 'Confirma el acuerdo para el Domingo de Ramos de 2026.'),
  ('Transporte · renovación de bandas para 2026', 'https://hermandaddeltransporte.com/2025/11/02/renov-bandascctt2026/', 'Web oficial', 'Hermandad del Transporte', date '2025-11-02', 'Confirma la renovación de la Centuria para 2026.'),
  ('Acompañamientos musicales de Sevilla 2026', 'https://musicofrades.com/acompanamientos-musicales-de-la-semana-santa-de-sevilla-2026/', 'Medio especializado', 'Musicofrades', null, 'Relación de acompañamientos de la Semana Santa de Sevilla de 2026.'),
  ('El Cerro · contratación de la Centuria', 'https://consejodebandas.es/la-bcctt-centuria-romana-macarena-acompanara-al-cristo-del-desamparo-y-abandono', 'Institucional', 'Consejo de Bandas de Música Procesional de Sevilla', null, 'Documenta el contrato para 2025 y 2026.'),
  ('Buen Fin · renovación de la Centuria', 'https://www.diariodesevilla.es/semana_santa/centuria-continuara-acompanando-misterio-buen_0_2003331944.html', 'Prensa', 'Diario de Sevilla', date '2025-02-11', 'Documenta la renovación del acompañamiento hasta 2026.'),
  ('Buen Fin · Centuria Juvenil en la Cruz de Guía', 'https://hermandadbuenfin.es/2023/02/la-centuria-romana-macarena-juvenil-nos-acompanara-en-la-cruz-de-guia-el-proximo-miercoles-santo/', 'Web oficial', 'Hermandad del Buen Fin', null, 'Documenta el inicio del acompañamiento juvenil en 2023.'),
  ('Sentencia de Córdoba · contrato con la Centuria', 'https://www.eldiadecordoba.es/cordoba/hermandad-Sentencia-Cordoba-Centuria-Romana-Macarena_0_1792021312.html', 'Prensa', 'El Día de Córdoba', null, 'Documenta el contrato para 2024 y 2025.'),
  ('San Roque · memoria del acompañamiento de la Centuria', 'https://www.facebook.com/100052439733859/videos/541506195141157/', 'Fuente secundaria', 'Memoria cofrade', null, 'Recoge el periodo continuado 1962-2015; se conserva como fuente secundaria contrastable.'),
  ('Centuria Romana Macarena · historia y repertorio', 'https://www.hermandaddelamacarena.es/banda-de-cornetas-y-tambores-de-la-centuria-romana-de-la-hermandad-de-la-macarena/', 'Web oficial', 'Hermandad de la Macarena', null, 'Fuente institucional de identidad, historia y vinculación con la Hermandad.')
) d(name,url,source_type,publisher,publication_date,notes)
where not exists (select 1 from public.sources s where s.url=d.url);

update public.sources s set
  accessed_at=date '2026-09-02',
  name=d.name, source_type=d.source_type, author_or_publisher=d.publisher,
  publication_date=coalesce(d.publication_date,s.publication_date), notes=d.notes
from (values
  ('Pino Montano · concierto y vínculo con la Centuria Juvenil', 'https://hermandadpinomontano.es/cuaresma-2026-pregon-y-concierto-de-la-centuria-macarena-juvenil/', 'Web oficial', 'Hermandad de Pino Montano', null::date, 'Confirma el acompañamiento anual de la sección juvenil en la Cruz de Guía.'),
  ('La Paz · acuerdo con la Centuria Juvenil', 'https://www.hermandaddelamacarena.es/2026/02/la-hermandad-de-la-paz-y-la-banda-juvenil-de-la-centuria-romana-macarena-firman-el-acuerdo-para-el-proximo-domingo-de-ramos/', 'Web oficial', 'Hermandad de la Macarena', null, 'Confirma el acuerdo para el Domingo de Ramos de 2026.'),
  ('Transporte · renovación de bandas para 2026', 'https://hermandaddeltransporte.com/2025/11/02/renov-bandascctt2026/', 'Web oficial', 'Hermandad del Transporte', date '2025-11-02', 'Confirma la renovación de la Centuria para 2026.'),
  ('Acompañamientos musicales de Sevilla 2026', 'https://musicofrades.com/acompanamientos-musicales-de-la-semana-santa-de-sevilla-2026/', 'Medio especializado', 'Musicofrades', null, 'Relación de acompañamientos de la Semana Santa de Sevilla de 2026.'),
  ('El Cerro · contratación de la Centuria', 'https://consejodebandas.es/la-bcctt-centuria-romana-macarena-acompanara-al-cristo-del-desamparo-y-abandono', 'Institucional', 'Consejo de Bandas de Música Procesional de Sevilla', null, 'Documenta el contrato para 2025 y 2026.'),
  ('Buen Fin · renovación de la Centuria', 'https://www.diariodesevilla.es/semana_santa/centuria-continuara-acompanando-misterio-buen_0_2003331944.html', 'Prensa', 'Diario de Sevilla', date '2025-02-11', 'Documenta la renovación del acompañamiento hasta 2026.'),
  ('Buen Fin · Centuria Juvenil en la Cruz de Guía', 'https://hermandadbuenfin.es/2023/02/la-centuria-romana-macarena-juvenil-nos-acompanara-en-la-cruz-de-guia-el-proximo-miercoles-santo/', 'Web oficial', 'Hermandad del Buen Fin', null, 'Documenta el inicio del acompañamiento juvenil en 2023.'),
  ('Sentencia de Córdoba · contrato con la Centuria', 'https://www.eldiadecordoba.es/cordoba/hermandad-Sentencia-Cordoba-Centuria-Romana-Macarena_0_1792021312.html', 'Prensa', 'El Día de Córdoba', null, 'Documenta el contrato para 2024 y 2025.'),
  ('San Roque · memoria del acompañamiento de la Centuria', 'https://www.facebook.com/100052439733859/videos/541506195141157/', 'Fuente secundaria', 'Memoria cofrade', null, 'Recoge el periodo continuado 1962-2015; se conserva como fuente secundaria contrastable.'),
  ('Centuria Romana Macarena · historia y repertorio', 'https://www.hermandaddelamacarena.es/banda-de-cornetas-y-tambores-de-la-centuria-romana-de-la-hermandad-de-la-macarena/', 'Web oficial', 'Hermandad de la Macarena', null, 'Fuente institucional de identidad, historia y vinculación con la Hermandad.')
) d(name,url,source_type,publisher,publication_date,notes)
where s.url=d.url;

do $$
declare
  v_band uuid;
  v_macarena uuid;
  v_march uuid;
  v_source uuid;
  v_period uuid;
  v_lowell uuid;
  v_hidalgo uuid;
begin
  select id into v_band from public.entities where slug = 'centuria-romana-macarena';
  select id into v_macarena from public.entities where slug = 'hermandad-de-la-macarena';
  if v_band is null or v_macarena is null then
    raise exception 'No se localizaron la Centuria o la Hermandad de la Macarena';
  end if;

  -- Una identidad institucional, una popular y una paleta sin primarios duplicados.
  delete from public.band_names
  where band_entity_id = v_band
    and name_type = 'official'
    and name = 'Banda de Cornetas y Tambores de la Centuria Romana Macarena';

  update public.band_names
  set short_name = 'Centuria Romana Macarena',
      notes = 'Denominación institucional publicada por la Hermandad de la Macarena.'
  where band_entity_id = v_band
    and name = 'Banda de Cornetas y Tambores de la Centuria Romana de la Hermandad de la Macarena';

  delete from public.band_colors
  where band_entity_id = v_band and color_role = 'primary' and hex_value = '#0F6848';
  update public.bands set primary_color = '#006400' where entity_id = v_band;

  update public.entity_relations
  set status = 'published',
      notes = 'La formación pertenece a la Hermandad de la Macarena.'
  where id = (
    select id from public.entity_relations
    where source_entity_id = v_band and target_entity_id = v_macarena
      and relation_type = 'belongs_to_brotherhood'
    order by created_at, id limit 1
  );
  delete from public.entity_relations
  where source_entity_id = v_band and target_entity_id = v_macarena
    and relation_type = 'belongs_to_brotherhood'
    and id <> (
      select id from public.entity_relations
      where source_entity_id = v_band and target_entity_id = v_macarena
        and relation_type = 'belongs_to_brotherhood'
      order by created_at, id limit 1
    );

  -- 1897 corresponde a la reorganización de los armaos, no al comienzo
  -- demostrado del acompañamiento musical actual.
  update public.music_accompaniment_periods
  set position = 'Tras el paso de misterio',
      public_step_name = 'Nuestro Padre Jesús de la Sentencia',
      year_from = null, date_from = null,
      date_from_text = 'Vigente en 2026; inicio del acompañamiento actual por documentar',
      notes = 'La banda titular acompaña al paso de misterio. La reorganización de 1897 pertenece a la historia de la formación y no se presenta como inicio de este periodo.',
      public_municipality_name = 'Sevilla', public_municipality_slug = 'sevilla',
      public_province = 'Sevilla', updated_at = now()
  where band_entity_id = v_band and brotherhood_entity_id = v_macarena and is_current;

  -- Acompañamientos actuales: la fila distingue la banda titular de la juvenil.
  insert into public.music_accompaniment_periods (
    brotherhood_entity_id, band_entity_id, position, outing_type,
    date_from, date_from_text, year_from, is_current, notes, status,
    public_brotherhood_name, public_step_name, public_brotherhood_slug,
    public_municipality_name, public_municipality_slug, public_province
  )
  select e.id, v_band, d.position, d.outing_type,
         case when d.year_from is null then null else make_date(d.year_from,1,1) end,
         d.date_from_text, d.year_from, true, d.notes, 'published',
         d.brotherhood_name, d.step_name, d.brotherhood_slug,
         d.municipality, d.municipality_slug, d.province
  from (values
    ('hermandad-de-pino-montano','Hermandad de Pino Montano','Viernes de Dolores','Cruz de Guía · sección juvenil','Cruz de Guía',null::int,'Vigente en 2026; vínculo documentado al menos desde 2016','La sección juvenil abre el cortejo. El inicio ininterrumpido exacto queda pendiente de documentar.','Sevilla','sevilla','Sevilla'),
    ('hermandad-de-la-paz','Hermandad de la Paz','Domingo de Ramos','Cruz de Guía · sección juvenil','Cruz de Guía',2026,'Desde 2026','La sección juvenil abre el cortejo.','Sevilla','sevilla','Sevilla'),
    ('hermandad-transporte-jerez','Hermandad del Transporte','Domingo de Ramos','Tras el paso de misterio','Nuestro Padre Jesús del Consuelo en el Desprecio de Herodes',2024,'Desde 2024','La Centuria acompaña desde la salida hasta la Catedral; Presentación al Pueblo cubre el regreso.','Jerez de la Frontera','jerez-de-la-frontera','Cádiz'),
    ('hermandad-candelaria-sevilla','Hermandad de la Candelaria','Martes Santo','Cruz de Guía · sección juvenil','Cruz de Guía',null,'Vigente en 2026; inicio por documentar','La sección juvenil abre el cortejo.','Sevilla','sevilla','Sevilla'),
    ('hermandad-cerro-del-aguila-sevilla','Hermandad del Cerro del Águila','Martes Santo','Tras el paso de Cristo','Santísimo Cristo del Desamparo y Abandono',2025,'2025 — 2026','El acuerdo documentado comprende las estaciones de penitencia de 2025 y 2026.','Sevilla','sevilla','Sevilla'),
    ('hermandad-buen-fin-sevilla','Hermandad del Buen Fin','Miércoles Santo','Tras el paso de Cristo','Santísimo Cristo del Buen Fin',null,'Vinculación desde comienzos de la década de 1990','La renovación documentada mantiene el vínculo en 2025 y 2026; el inicio exacto queda pendiente.','Sevilla','sevilla','Sevilla'),
    ('hermandad-buen-fin-sevilla','Hermandad del Buen Fin','Miércoles Santo','Cruz de Guía · sección juvenil','Cruz de Guía',2023,'Desde 2023','La sección juvenil abre el cortejo.','Sevilla','sevilla','Sevilla'),
    ('hermandad-de-la-macarena','La Macarena','Madrugá','Cruz de Guía · sección juvenil','Cruz de Guía',null,'Vigente en 2026; inicio por documentar','La sección juvenil abre el cortejo de la Hermandad.','Sevilla','sevilla','Sevilla')
  ) d(brotherhood_slug,brotherhood_name,outing_type,position,step_name,year_from,date_from_text,notes,municipality,municipality_slug,province)
  join public.entities e on e.slug = d.brotherhood_slug
  where not exists (
    select 1 from public.music_accompaniment_periods mp
    where mp.band_entity_id = v_band and mp.brotherhood_entity_id = e.id
      and mp.position = d.position and mp.is_current
  );

  -- Dos periodos históricos con límites documentados.
  insert into public.music_accompaniment_periods (
    brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type,
    date_from, date_from_text, year_from, date_to, date_to_text, year_to,
    is_current, notes, status, public_brotherhood_name, public_step_name,
    public_brotherhood_slug, public_municipality_name, public_municipality_slug, public_province
  )
  select e.id, v_band, st.id, 'Tras el paso de misterio', d.outing_type,
         make_date(d.year_from,1,1), d.year_from::text, d.year_from,
         make_date(d.year_to,12,31), d.year_to::text, d.year_to,
         false, d.notes, 'published', d.brotherhood_name, d.step_name,
         d.brotherhood_slug, d.municipality, d.municipality_slug, d.province
  from (values
    ('hermandad-sentencia-cordoba','Hermandad de la Sentencia de Córdoba','Lunes Santo','Nuestro Padre Jesús de la Sentencia',2024,2025,'El contrato comprendió las estaciones de penitencia de 2024 y 2025.','paso-jesus-sentencia-cordoba','Córdoba','cordoba','Córdoba'),
    ('hermandad-san-roque-sevilla','Hermandad de San Roque','Domingo de Ramos','Nuestro Padre Jesús de las Penas',1962,2015,'Acompañamiento continuado durante 53 años.','', 'Sevilla','sevilla','Sevilla')
  ) d(brotherhood_slug,brotherhood_name,outing_type,step_name,year_from,year_to,notes,step_slug,municipality,municipality_slug,province)
  join public.entities e on e.slug = d.brotherhood_slug
  left join public.entities st on st.slug = nullif(d.step_slug,'')
  where not exists (
    select 1 from public.music_accompaniment_periods mp
    where mp.band_entity_id=v_band and mp.brotherhood_entity_id=e.id
      and mp.year_from=d.year_from and mp.year_to=d.year_to
  );

  -- Fuentes de cada acompañamiento, enlazadas al periodo exacto.
  for v_period, v_source in
    select mp.id, s.id
    from public.music_accompaniment_periods mp
    join public.entities bh on bh.id=mp.brotherhood_entity_id
    join (values
      ('hermandad-de-pino-montano','https://hermandadpinomontano.es/cuaresma-2026-pregon-y-concierto-de-la-centuria-macarena-juvenil/',null::int,null::int),
      ('hermandad-de-la-paz','https://www.hermandaddelamacarena.es/2026/02/la-hermandad-de-la-paz-y-la-banda-juvenil-de-la-centuria-romana-macarena-firman-el-acuerdo-para-el-proximo-domingo-de-ramos/',2026,null),
      ('hermandad-transporte-jerez','https://hermandaddeltransporte.com/2025/11/02/renov-bandascctt2026/',2024,null),
      ('hermandad-candelaria-sevilla','https://musicofrades.com/acompanamientos-musicales-de-la-semana-santa-de-sevilla-2026/',null,null),
      ('hermandad-cerro-del-aguila-sevilla','https://consejodebandas.es/la-bcctt-centuria-romana-macarena-acompanara-al-cristo-del-desamparo-y-abandono',2025,null),
      ('hermandad-buen-fin-sevilla','https://www.diariodesevilla.es/semana_santa/centuria-continuara-acompanando-misterio-buen_0_2003331944.html',null,null),
      ('hermandad-sentencia-cordoba','https://www.eldiadecordoba.es/cordoba/hermandad-Sentencia-Cordoba-Centuria-Romana-Macarena_0_1792021312.html',2024,2025),
      ('hermandad-san-roque-sevilla','https://www.facebook.com/100052439733859/videos/541506195141157/',1962,2015)
    ) d(slug,url,year_from,year_to) on d.slug=bh.slug
    join public.sources s on s.url=d.url
    where mp.band_entity_id=v_band
      and (d.year_from is null or mp.year_from=d.year_from)
      and (d.year_to is null or mp.year_to=d.year_to)
  loop
    insert into public.source_links(source_id,music_accompaniment_period_id,scope,notes)
    select v_source,v_period,'Acompañamiento musical','Fuente del periodo y su vigencia.'
    where not exists(select 1 from public.source_links where source_id=v_source and music_accompaniment_period_id=v_period);
  end loop;

  -- Agentes necesarios para que autor y adaptador no permanezcan como texto plano.
  insert into public.entities(entity_type,name,slug,summary,status) values
    ('agent','Lowell Mason','lowell-mason','Compositor estadounidense, autor de la melodía «Bethany».','published'),
    ('agent','José Hidalgo López','jose-hidalgo-lopez','Músico, director y cabo tambor histórico de la Centuria Romana Macarena.','published')
  on conflict(slug) do update set name=excluded.name,summary=excluded.summary,updated_at=now();
  select id into v_lowell from public.entities where slug='lowell-mason';
  select id into v_hidalgo from public.entities where slug='jose-hidalgo-lopez';
  insert into public.agents(entity_id,agent_kind,description)
  values (v_lowell,'person','Compositor de la melodía «Bethany».'),(v_hidalgo,'person','Director y cabo tambor histórico de la Centuria.')
  on conflict(entity_id) do update set agent_kind=excluded.agent_kind,description=excluded.description;
  insert into public.agent_names(agent_entity_id,name,name_type,is_current)
  select d.id,d.name,'official',true from (values(v_lowell,'Lowell Mason'),(v_hidalgo,'José Hidalgo López')) d(id,name)
  where not exists(select 1 from public.agent_names n where n.agent_entity_id=d.id and lower(n.name)=lower(d.name));

  -- Obras canónicas y clasificación editorial de los cinco estrenos.
  insert into public.entities(entity_type,name,slug,summary,status)
  values
    ('march','A morir por Ti','marcha-a-morir-por-ti','Marcha de José María Sánchez Martín dedicada a Nuestro Padre Jesús de la Sentencia.','published'),
    ('march','Cerca de Ti, Señor','marcha-cerca-de-ti-senor-centuria','Adaptación de Francisco Moraza Cienfuegos para la Centuria sobre la melodía «Bethany» de Lowell Mason.','published'),
    ('march','Desprecio','marcha-desprecio-centuria','Marcha de José Manuel Sánchez Crespillo dedicada al Señor del Consuelo de la Hermandad del Transporte.','published'),
    ('march','Tambor de Sevilla','marcha-tambor-de-sevilla','Marcha ordinaria de Manuel Jesús Guerrero Marín dedicada a José Hidalgo López.','published'),
    ('march','Dios en la tierra','marcha-dios-en-la-tierra','Marcha de Francisco Moraza Cienfuegos dedicada al Cristo del Desamparo y Abandono.','published')
  on conflict(slug) do update set name=excluded.name,summary=excluded.summary,status='published',updated_at=now();

  insert into public.marches(entity_id,composition_year,composition_date_text,music_type,description,premiere_date,premiere_date_text,premiered_by_band_entity_id)
  select e.id,d.year,d.year::text,'Cornetas y Tambores',e.summary,d.premiere_date,to_char(d.premiere_date,'DD/MM/YYYY'),v_band
  from (values
    ('marcha-a-morir-por-ti',2026,date '2026-03-01'),
    ('marcha-cerca-de-ti-senor-centuria',2026,date '2026-03-01'),
    ('marcha-desprecio-centuria',2025,date '2025-02-15'),
    ('marcha-tambor-de-sevilla',2025,date '2025-03-08'),
    ('marcha-dios-en-la-tierra',2025,date '2025-11-22')
  ) d(slug,year,premiere_date) join public.entities e on e.slug=d.slug
  on conflict(entity_id) do update set composition_year=excluded.composition_year,music_type=excluded.music_type,
    description=excluded.description,premiere_date=excluded.premiere_date,premiere_date_text=excluded.premiere_date_text,
    premiered_by_band_entity_id=excluded.premiered_by_band_entity_id;

  update public.band_premieres bp set
    march_entity_id=e.id,
    description=d.description
  from (values
    ('A morir por Ti','marcha-a-morir-por-ti','Tipo de novedad: estreno absoluto. Compuesta expresamente para la Centuria y dedicada a Nuestro Padre Jesús de la Sentencia.'),
    ('Cerca de Ti, Señor','marcha-cerca-de-ti-senor-centuria','Tipo de novedad: adaptacion. Versión de Francisco Moraza Cienfuegos para la Centuria sobre la melodía «Bethany» de Lowell Mason.'),
    ('Desprecio','marcha-desprecio-centuria','Tipo de novedad: estreno absoluto. Dedicada a Nuestro Padre Jesús del Consuelo en el Desprecio de Herodes, de la Hermandad del Transporte.'),
    ('Tambor de Sevilla','marcha-tambor-de-sevilla','Tipo de novedad: estreno absoluto. Marcha ordinaria dedicada a José Hidalgo López, histórico director y cabo tambor de la formación.'),
    ('Dios en la tierra','marcha-dios-en-la-tierra','Tipo de novedad: estreno absoluto. Dedicada al Santísimo Cristo del Desamparo y Abandono de la Hermandad del Cerro del Águila.')
  ) d(title,slug,description)
  join public.entities e on e.slug=d.slug
  where bp.band_entity_id=v_band and bp.title=d.title and bp.premiere_year in (2025,2026);

  insert into public.march_authors(march_entity_id,agent_entity_id,author_role,notes,status)
  select m.id,a.id,d.role,'Autoría documentada en la fuente del estreno.','published'
  from (values
    ('marcha-a-morir-por-ti','agente-jose-maria-sanchez-martin','composer'),
    ('marcha-cerca-de-ti-senor-centuria','lowell-mason','composer'),
    ('marcha-cerca-de-ti-senor-centuria','francisco-moraza-cienfuegos','adapter'),
    ('marcha-desprecio-centuria','agente-jose-manuel-sanchez-crespillo','composer'),
    ('marcha-tambor-de-sevilla','manuel-jesus-guerrero-marin','composer'),
    ('marcha-dios-en-la-tierra','francisco-moraza-cienfuegos','composer')
  ) d(march_slug,agent_slug,role)
  join public.entities m on m.slug=d.march_slug join public.entities a on a.slug=d.agent_slug
  on conflict(march_entity_id,agent_entity_id,author_role) do update set status='published',notes=excluded.notes;

  insert into public.march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,dedication_text,date_from,date_from_text,notes,status)
  select m.id,ded.id,'dedicated_to',d.dedication,d.premiere_date,to_char(d.premiere_date,'DD/MM/YYYY'),
         'El nodo relacional representa a la Hermandad o a la persona; el texto conserva el titular exacto.','published'
  from (values
    ('marcha-a-morir-por-ti','hermandad-de-la-macarena','Nuestro Padre Jesús de la Sentencia de la Hermandad de la Macarena',date '2026-03-01'),
    ('marcha-desprecio-centuria','hermandad-transporte-jerez','Nuestro Padre Jesús del Consuelo en el Desprecio de Herodes de la Hermandad del Transporte',date '2025-02-15'),
    ('marcha-tambor-de-sevilla','jose-hidalgo-lopez','José Hidalgo López, histórico director y cabo tambor de la Centuria',date '2025-03-08'),
    ('marcha-dios-en-la-tierra','hermandad-cerro-del-aguila-sevilla','Santísimo Cristo del Desamparo y Abandono de la Hermandad del Cerro del Águila',date '2025-11-22')
  ) d(march_slug,dedicatee_slug,dedication,premiere_date)
  join public.entities m on m.slug=d.march_slug join public.entities ded on ded.slug=d.dedicatee_slug
  on conflict(march_entity_id,dedicatee_entity_id,dedication_type) do update set dedication_text=excluded.dedication_text,
    date_from=excluded.date_from,date_from_text=excluded.date_from_text,notes=excluded.notes,status='published';

  update public.band_release_tracks t set march_entity_id=e.id
  from public.band_releases r, public.entities e
  where t.release_id=r.id and r.band_entity_id=v_band
    and ((lower(t.title)=lower('Desprecio') and e.slug='marcha-desprecio-centuria')
      or (lower(t.title)=lower('Dios en la tierra') and e.slug='marcha-dios-en-la-tierra'));

  -- Cada fuente de estreno se reaprovecha para la obra relacionada.
  insert into public.source_links(source_id,entity_id,scope,notes)
  select distinct sl.source_id,bp.march_entity_id,'Estreno, autoría y dedicatoria','Fuente ya vinculada a la ficha del estreno.'
  from public.band_premieres bp join public.source_links sl on sl.band_premiere_id=bp.id
  where bp.band_entity_id=v_band and bp.premiere_year in (2025,2026) and bp.march_entity_id is not null
    and not exists(select 1 from public.source_links x where x.source_id=sl.source_id and x.entity_id=bp.march_entity_id);

  -- Postcondiciones de certificación.
  if (select count(*) from public.band_names where band_entity_id=v_band and name_type='official' and is_current) <> 1 then
    raise exception 'La Centuria conserva más de un nombre oficial vigente';
  end if;
  if (select count(*) from public.band_colors where band_entity_id=v_band and color_role='primary' and status='published') <> 1 then
    raise exception 'La Centuria conserva más de un color primario';
  end if;
  if (select count(*) from public.entity_relations where source_entity_id=v_band and target_entity_id=v_macarena and relation_type='belongs_to_brotherhood') <> 1 then
    raise exception 'La relación con la Macarena no quedó consolidada';
  end if;
  if (select count(*) from public.music_accompaniment_periods where band_entity_id=v_band and is_current and status='published') <> 10 then
    raise exception 'El mapa actual de acompañamientos no contiene diez posiciones';
  end if;
  if exists(select 1 from public.music_accompaniment_periods where band_entity_id=v_band and is_current and year_from=1897) then
    raise exception '1897 continúa tratado como inicio del acompañamiento actual';
  end if;
  if (select count(*) from public.band_premieres where band_entity_id=v_band and premiere_year in (2025,2026) and status='published' and march_entity_id is not null) <> 5 then
    raise exception 'No quedaron relacionadas las cinco novedades 2025-2026';
  end if;
  if exists(select 1 from public.band_premieres where band_entity_id=v_band and premiere_year in (2025,2026) and description !~* '^Tipo de novedad:') then
    raise exception 'Algún estreno sigue sin clasificación editorial';
  end if;
  if (select count(*) from public.band_releases where band_entity_id=v_band and status='published') <> 38
     or (select count(*) from public.band_release_tracks t join public.band_releases r on r.id=t.release_id where r.band_entity_id=v_band) <> 119 then
    raise exception 'La discografía certificada ha sufrido una regresión';
  end if;
end $$;
