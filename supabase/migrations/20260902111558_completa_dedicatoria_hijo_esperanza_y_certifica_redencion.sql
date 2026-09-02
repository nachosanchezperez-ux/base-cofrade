-- Tres Caídas de Triana + La Redención · cierre relacional y editorial
-- Solo DML sobre el modelo First Edition existente.
-- No introduce DDL, tablas, RLS ni cambios de arquitectura.

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date, accessed_at, notes
)
select d.name, d.url, d.source_type, d.publisher, d.publication_date,
       date '2026-09-02', d.notes
from (values
  ('El Hijo de la Esperanza · dedicatoria',
   'https://www.facebook.com/oficialtrescaidasdetriana/videos/948178128150408/',
   'Canal oficial', 'Tres Caídas de Triana', null::date,
   'La formación identifica la marcha como una obra dedicada al Santísimo Cristo de las Cinco Llagas de la Hermandad de la Trinidad.'),
  ('La Redención · Semana Santa',
   'https://www.amredencion.com/semana-santa/',
   'Web oficial', 'Agrupación Musical Nuestro Padre Jesús de la Redención', null::date,
   'Calendario vigente de acompañamientos de Semana Santa de la formación.'),
  ('Santa Cruz de la Victoria de Cristo · identidad oficial',
   'https://www.facebook.com/cruzdelavictoriadecristo.paternadelcampo/',
   'Red oficial', 'Hermandad de la Santa Cruz de la Victoria de Cristo', null::date,
   'Denominación y localidad publicadas por la propia Hermandad.')
) as d(name, url, source_type, publisher, publication_date, notes)
where not exists (select 1 from public.sources s where s.url = d.url);

update public.sources
set accessed_at = date '2026-09-02'
where url in (
  'https://www.facebook.com/oficialtrescaidasdetriana/videos/948178128150408/',
  'https://www.amredencion.com/historia/',
  'https://www.amredencion.com/semana-santa/',
  'https://www.facebook.com/cruzdelavictoriadecristo.paternadelcampo/'
);

do $$
declare
  v_tres_caidas uuid;
  v_redencion uuid;
  v_trinidad uuid;
  v_hijo_esperanza uuid;
  v_source_hijo uuid;
  v_source_redencion_history uuid;
  v_source_redencion_semana_santa uuid;
  v_source_cruz_victoria uuid;
  v_monte_sion_period uuid;
  v_milagrosa_period uuid;
  v_cruz_victoria uuid;
  v_con_humildad uuid;
  v_por_siempre uuid;
  v_exaltatio uuid;
  v_humildad uuid;
  v_salud_remedios uuid;
  v_cerro uuid;
  v_tomares uuid;
  v_humildad_sevilla_este uuid;
  v_salud_remedios_image uuid;
begin
  select id into v_tres_caidas from public.entities
  where slug = 'banda-cornetas-tambores-santisimo-cristo-tres-caidas-sevilla'
    and entity_type = 'band';
  select id into v_redencion from public.entities
  where slug = 'agrupacion-musical-nuestro-padre-jesus-redencion-sevilla'
    and entity_type = 'band';
  select id into v_trinidad from public.entities
  where slug = 'hermandad-de-la-trinidad-sevilla' and entity_type = 'brotherhood';
  select id into v_hijo_esperanza from public.entities
  where slug = 'marcha-el-hijo-de-la-esperanza' and entity_type = 'march';

  if v_tres_caidas is null or v_redencion is null
     or v_trinidad is null or v_hijo_esperanza is null then
    raise exception 'Falta una entidad canónica del lote Tres Caídas + La Redención';
  end if;

  select id into v_source_hijo from public.sources
  where url = 'https://www.facebook.com/oficialtrescaidasdetriana/videos/948178128150408/'
  order by created_at limit 1;
  select id into v_source_redencion_history from public.sources
  where url = 'https://www.amredencion.com/historia/'
  order by created_at limit 1;
  select id into v_source_redencion_semana_santa from public.sources
  where url = 'https://www.amredencion.com/semana-santa/'
  order by created_at limit 1;
  select id into v_source_cruz_victoria from public.sources
  where url = 'https://www.facebook.com/cruzdelavictoriadecristo.paternadelcampo/'
  order by created_at limit 1;

  -- La interpretación se estrenó ante los titulares de la Esperanza de Triana,
  -- pero la dedicatoria pertenece al Cristo de las Cinco Llagas de la Trinidad.
  update public.entities
  set summary = 'Marcha de Francisco Javier Cebrero Arias y José María Sánchez Martín dedicada al Santísimo Cristo de las Cinco Llagas de la Hermandad de la Trinidad.',
      updated_at = now()
  where id = v_hijo_esperanza;

  update public.marches
  set description = 'Marcha de Francisco Javier Cebrero Arias y José María Sánchez Martín dedicada al Santísimo Cristo de las Cinco Llagas de la Hermandad de la Trinidad.'
  where entity_id = v_hijo_esperanza;

  update public.band_premieres
  set description = 'Tipo de novedad: estreno absoluto. Dedicada al Santísimo Cristo de las Cinco Llagas de la Hermandad de la Trinidad; fue estrenada ante los titulares de la Esperanza de Triana.',
      source_id = v_source_hijo
  where band_entity_id = v_tres_caidas
    and march_entity_id = v_hijo_esperanza
    and premiere_year = 2026;

  insert into public.march_dedications (
    march_entity_id, dedicatee_entity_id, dedication_type, dedication_text,
    date_from, date_from_text, notes, status
  )
  select v_hijo_esperanza, v_trinidad, 'dedicated_to',
         'Santísimo Cristo de las Cinco Llagas de la Hermandad de la Trinidad',
         date '2026-03-16', '16 de marzo de 2026',
         'El nodo relacional es la Hermandad; el texto conserva el titular exacto de la dedicatoria.',
         'published'
  where not exists (
    select 1 from public.march_dedications md
    where md.march_entity_id = v_hijo_esperanza
      and md.dedicatee_entity_id = v_trinidad
      and md.dedication_type = 'dedicated_to'
  );

  insert into public.source_links (source_id, entity_id, scope, notes)
  select v_source_hijo, v_hijo_esperanza, 'Dedicatoria',
         'La publicación oficial identifica al Santísimo Cristo de las Cinco Llagas como destinatario de la marcha.'
  where v_source_hijo is not null and not exists (
    select 1 from public.source_links sl
    where sl.source_id = v_source_hijo
      and sl.entity_id = v_hijo_esperanza
      and sl.scope = 'Dedicatoria'
  );

  -- Acompañamientos actuales: la posición expresa la categoría y el campo
  -- público del paso conserva la identidad, sin repetir frases completas.
  update public.music_accompaniment_periods
  set position = case public_brotherhood_slug
        when 'cristo-amor-entrada-triunfal-huevar' then 'Tras el paso de misterio'
        when 'hermandad-sacramental-tomares' then 'Tras el paso de Cristo'
        else 'Tras el paso de misterio'
      end,
      public_step_name = case public_brotherhood_slug
        when 'dulce-nombre-bellavista' then 'Nuestro Padre Jesús de la Salud y Remedios'
        when 'agrupacion-parroquial-humildad-sevilla-este' then 'Nuestro Padre Jesús de la Humildad'
        when 'cristo-amor-entrada-triunfal-huevar' then 'Santísimo Cristo del Amor en su Entrada Triunfal en Jerusalén'
        when 'hermandad-de-la-redencion' then 'Nuestro Padre Jesús de la Redención'
        when 'hermandad-servita-cautivo-alcala-guadaira' then 'Nuestro Padre Jesús Cautivo y Rescatado'
        when 'hermandad-sacramental-tomares' then 'Santísimo Cristo de la Vera Cruz'
        else public_step_name
      end,
      notes = case public_brotherhood_slug
        when 'cristo-amor-entrada-triunfal-huevar' then 'La fecha de inicio está pendiente de documentación.'
        else null
      end,
      updated_at = now()
  where band_entity_id = v_redencion and is_current = true;

  -- La historia oficial permite cerrar los dos periodos que aún carecían
  -- de año inicial, sin inferir duraciones ni sumar interrupciones.
  update public.music_accompaniment_periods
  set year_from = 2006,
      date_from = date '2006-01-01',
      date_from_text = 'Desde 2006',
      public_step_name = 'Señor de la Sagrada Oración en el Huerto',
      notes = 'Acompañamiento mantenido desde 2006 hasta la Semana Santa de 2025.',
      updated_at = now()
  where band_entity_id = v_redencion
    and public_brotherhood_name = 'Hermandad de Monte-Sión'
    and year_to = 2025 and is_current = false
  returning id into v_monte_sion_period;

  update public.music_accompaniment_periods
  set year_from = 2008,
      date_from = date '2008-01-01',
      date_from_text = 'Desde 2008',
      public_step_name = 'Nuestro Padre Jesús de la Esperanza en el Puente Cedrón',
      notes = 'La banda acompañó la primera salida procesional del Señor en 2008 y mantuvo el vínculo hasta 2025.',
      updated_at = now()
  where band_entity_id = v_redencion
    and public_brotherhood_name = 'Hermandad de la Milagrosa'
    and year_to = 2025 and is_current = false
  returning id into v_milagrosa_period;

  insert into public.source_links (
    source_id, music_accompaniment_period_id, scope, notes
  )
  select v_source_redencion_history, d.period_id, 'Inicio del acompañamiento', d.notes
  from (values
    (v_monte_sion_period, 'La historia oficial sitúa el inicio del vínculo con Monte-Sión en 2006.'),
    (v_milagrosa_period, 'La historia oficial documenta la primera salida del Puente Cedrón con la banda en 2008.')
  ) as d(period_id, notes)
  where v_source_redencion_history is not null and d.period_id is not null
    and not exists (
      select 1 from public.source_links sl
      where sl.source_id = v_source_redencion_history
        and sl.music_accompaniment_period_id = d.period_id
        and sl.scope = 'Inicio del acompañamiento'
    );

  insert into public.source_links (source_id, entity_id, scope, notes)
  select v_source_redencion_semana_santa, v_redencion, 'Acompañamientos vigentes',
         'Calendario de Semana Santa publicado por la formación.'
  where v_source_redencion_semana_santa is not null and not exists (
    select 1 from public.source_links sl
    where sl.source_id = v_source_redencion_semana_santa
      and sl.entity_id = v_redencion
      and sl.scope = 'Acompañamientos vigentes'
  );

  -- Voz editorial de los estrenos. El prefijo conserva la taxonomía que
  -- interpreta la interfaz; el texto visible evita repeticiones mecánicas.
  update public.band_premieres bp
  set description = d.description
  from (values
    ('Con Humildad, ¡al cielo!', 2026, 'Tipo de novedad: estreno absoluto. Dedicada al Señor de la Humildad del Cerro del Águila y ofrecida por su cuadrilla de costaleros.'),
    ('Con tu espíritu', 2026, 'Tipo de novedad: estreno absoluto. Dedicada a la memoria del músico Francisco de Paula Aranda «Paquito».'),
    ('Por siempre de ti', 2026, 'Tipo de novedad: estreno absoluto. Dedicada a la Santa Cruz de la Victoria de Cristo de Paterna del Campo.'),
    ('El Día del Señor', 2026, 'Tipo de novedad: adaptación. Versión para agrupación musical de la marcha compuesta en 2024 para la Hermandad de la Cena de Málaga.'),
    ('Nanas del Baratillo', 2026, 'Tipo de novedad: adaptación. Versión para agrupación musical de la obra de David Hurtado Torres, dedicada a Nuestra Señora de la Piedad del Baratillo. La autoría de la adaptación sigue pendiente de documentación.'),
    ('Judío', 2026, 'Tipo de novedad: estreno absoluto. Dedicada a Nuestro Padre y Señor de las Penas de la Hermandad del Desconsuelo de Jerez de la Frontera.'),
    ('Exaltatio', 2026, 'Tipo de novedad: estreno por la formación. La Redención la incorporó a su repertorio y la interpretó por primera vez en 2026. Está dedicada al Santísimo Cristo de la Vera Cruz de Tomares.'),
    ('Humildad', 2026, 'Tipo de novedad: incorporación al repertorio. Obra estrenada en 2025 por la Agrupación Musical de la Encarnación y dedicada a Nuestro Padre Jesús de la Humildad de Sevilla Este.'),
    ('Salud y Remedios', 2025, 'Tipo de novedad: estreno absoluto. Dedicada a Nuestro Padre Jesús de la Salud y Remedios de Bellavista; la Hermandad la incorporó a su patrimonio musical en la Semana Santa de 2026.')
  ) as d(title, premiere_year, description)
  where bp.band_entity_id = v_redencion
    and bp.title = d.title
    and bp.premiere_year = d.premiere_year;

  update public.entities e
  set summary = d.summary,
      updated_at = now()
  from (values
    ('marcha-con-humildad-al-cielo', 'Marcha de Raúl Delgado Perera dedicada al Señor de la Humildad del Cerro del Águila y ofrecida por su cuadrilla de costaleros.'),
    ('marcha-con-tu-espiritu', 'Marcha de Emilio Muñoz Serna dedicada a la memoria del músico Francisco de Paula Aranda «Paquito».'),
    ('marcha-por-siempre-de-ti', 'Marcha de Alfonso López Cortés dedicada a la Santa Cruz de la Victoria de Cristo de Paterna del Campo.'),
    ('marcha-el-dia-del-senor', 'Adaptación para agrupación musical de la obra compuesta por Alfonso López Cortés en 2024 para la Hermandad de la Cena de Málaga.'),
    ('marcha-nanas-del-baratillo', 'Adaptación para agrupación musical de la obra de David Hurtado Torres dedicada a Nuestra Señora de la Piedad del Baratillo.'),
    ('marcha-judio', 'Marcha de Manuel Otero Rodríguez dedicada a Nuestro Padre y Señor de las Penas de la Hermandad del Desconsuelo de Jerez de la Frontera.'),
    ('marcha-exaltatio', 'Marcha de Yeray López Vela dedicada al Santísimo Cristo de la Vera Cruz de la Hermandad Sacramental de Tomares.'),
    ('marcha-humildad', 'Marcha de Manuel Alejandro González Cruz dedicada a Nuestro Padre Jesús de la Humildad de Sevilla Este.'),
    ('marcha-salud-y-remedios', 'Marcha de Ignacio José García Pérez dedicada a Nuestro Padre Jesús de la Salud y Remedios de Bellavista.')
  ) as d(slug, summary)
  where e.slug = d.slug and e.entity_type = 'march';

  update public.marches m
  set description = e.summary
  from public.entities e
  where e.id = m.entity_id
    and e.slug in (
      'marcha-con-humildad-al-cielo', 'marcha-con-tu-espiritu',
      'marcha-por-siempre-de-ti', 'marcha-el-dia-del-senor',
      'marcha-nanas-del-baratillo', 'marcha-judio', 'marcha-exaltatio',
      'marcha-humildad', 'marcha-salud-y-remedios'
    );

  -- Se crea únicamente el nodo mínimo que necesita la dedicatoria y cuya
  -- denominación está confirmada por el canal oficial de la corporación.
  insert into public.entities (entity_type, name, slug, summary, status)
  values (
    'brotherhood', 'Hermandad de la Santa Cruz de la Victoria de Cristo',
    'hermandad-santa-cruz-victoria-cristo-paterna-campo',
    'Hermandad de gloria de Paterna del Campo vinculada a la Santa Cruz de la Victoria de Cristo.',
    'draft'
  )
  on conflict (slug) do update set
    entity_type = excluded.entity_type,
    name = excluded.name,
    summary = excluded.summary,
    updated_at = now();

  select id into v_cruz_victoria from public.entities
  where slug = 'hermandad-santa-cruz-victoria-cristo-paterna-campo';
  select id into v_con_humildad from public.entities where slug = 'marcha-con-humildad-al-cielo';
  select id into v_por_siempre from public.entities where slug = 'marcha-por-siempre-de-ti';
  select id into v_exaltatio from public.entities where slug = 'marcha-exaltatio';
  select id into v_humildad from public.entities where slug = 'marcha-humildad';
  select id into v_salud_remedios from public.entities where slug = 'marcha-salud-y-remedios';
  select id into v_cerro from public.entities where slug = 'hermandad-cerro-del-aguila-sevilla';
  select id into v_tomares from public.entities where slug = 'hermandad-sacramental-tomares';
  select id into v_humildad_sevilla_este from public.entities where slug = 'agrupacion-parroquial-humildad-sevilla-este';
  select id into v_salud_remedios_image from public.entities where slug = 'jesus-salud-remedios-bellavista';

  insert into public.source_links (source_id, entity_id, scope, notes)
  select v_source_cruz_victoria, v_cruz_victoria, 'Identidad institucional',
         'Canal oficial de la Hermandad.'
  where v_source_cruz_victoria is not null and v_cruz_victoria is not null
    and not exists (
      select 1 from public.source_links sl
      where sl.source_id = v_source_cruz_victoria and sl.entity_id = v_cruz_victoria
    );

  insert into public.march_dedications (
    march_entity_id, dedicatee_entity_id, dedication_type,
    dedication_text, date_from, date_from_text, notes, status
  )
  select d.march_id, d.dedicatee_id, 'dedicated_to', d.dedication_text,
         d.dedication_date, to_char(d.dedication_date, 'DD/MM/YYYY'),
         'Relación creada con una entidad canónica ya existente o documentada en este lote.',
         'published'
  from (values
    (v_con_humildad, v_cerro, 'Señor de la Humildad de la Hermandad del Cerro del Águila', date '2026-01-10'),
    (v_por_siempre, v_cruz_victoria, 'Santa Cruz de la Victoria de Cristo de Paterna del Campo', date '2026-02-14'),
    (v_exaltatio, v_tomares, 'Santísimo Cristo de la Vera Cruz de la Hermandad Sacramental de Tomares', date '2026-03-12'),
    (v_humildad, v_humildad_sevilla_este, 'Nuestro Padre Jesús de la Humildad de Sevilla Este', date '2026-03-12'),
    (v_salud_remedios, v_salud_remedios_image, 'Nuestro Padre Jesús de la Salud y Remedios de Bellavista', date '2025-11-28')
  ) as d(march_id, dedicatee_id, dedication_text, dedication_date)
  where d.march_id is not null and d.dedicatee_id is not null
    and not exists (
      select 1 from public.march_dedications md
      where md.march_entity_id = d.march_id
        and md.dedicatee_entity_id = d.dedicatee_id
        and md.dedication_type = 'dedicated_to'
    );

  -- Postcondiciones documentales del lote.
  if not exists (
    select 1 from public.march_dedications md
    where md.march_entity_id = v_hijo_esperanza
      and md.dedicatee_entity_id = v_trinidad
      and md.status = 'published'
  ) then
    raise exception 'El Hijo de la Esperanza no quedó relacionado con la Trinidad';
  end if;

  if exists (
    select 1 from public.music_accompaniment_periods mp
    where mp.band_entity_id = v_redencion
      and mp.public_brotherhood_name in ('Hermandad de Monte-Sión', 'Hermandad de la Milagrosa')
      and (mp.year_from is null or mp.year_to <> 2025 or mp.is_current)
  ) then
    raise exception 'Los periodos históricos de La Redención siguen incompletos';
  end if;

  if exists (
    select 1 from public.band_premieres bp
    where bp.band_entity_id = v_redencion and bp.status = 'published'
      and bp.premiere_year in (2025, 2026)
      and bp.description ~* '^Tipo de novedad:[^.]+[.][[:space:]]*(Estreno absoluto|Estreno por La Redención|Incorporación y estreno)'
  ) then
    raise exception 'Persisten repeticiones mecánicas en los estrenos de La Redención';
  end if;

  if (select count(*) from public.band_releases
      where band_entity_id = v_redencion and status = 'published') <> 12
     or (select count(*)
         from public.band_release_tracks t
         join public.band_releases r on r.id = t.release_id
         where r.band_entity_id = v_redencion) <> 149 then
    raise exception 'La discografía certificada de La Redención ha sufrido una regresión';
  end if;
end $$;
