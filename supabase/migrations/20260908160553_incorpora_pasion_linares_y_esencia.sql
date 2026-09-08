-- Hilo Cofrade · Pasión de Linares y Esencia en la Semana Santa de Sevilla
--
-- Solo DML sobre el modelo First Edition existente. Publica las dos bandas y
-- documenta tres periodos de acompañamiento. El vínculo de Pasión de Linares
-- con El Carmen queda cerrado en 2026 para no presentarlo como contrato de 2027.

do $$
begin
  if exists (
    select 1
    from public.entities
    where slug in (
      'agrupacion-musical-pasion-de-linares',
      'banda-cornetas-tambores-esencia-sevilla'
    )
      and entity_type <> 'band'
  ) then
    raise exception 'Uno de los slugs reservados para las bandas pertenece a otro tipo de entidad';
  end if;

  if (select count(*) from public.entities where slug = 'santa-genoveva') <> 1 then
    raise exception 'Santa Genoveva no es una entidad canónica unívoca';
  end if;

  if (select count(*) from public.entities where slug = 'carmen-doloroso') <> 1 then
    raise exception 'El Carmen no es una entidad canónica unívoca';
  end if;

  if (select count(*) from public.entities where slug = 'siete-palabras-sevilla') <> 1 then
    raise exception 'Las Siete Palabras no es una entidad canónica unívoca';
  end if;
end $$;

insert into public.municipalities (
  name, slug, province, autonomous_community, country
)
select 'Linares', 'linares', 'Jaén', 'Andalucía', 'España'
where not exists (
  select 1 from public.municipalities where slug = 'linares'
);

create temporary table _hc_bandas_sevilla_catalog (
  slug text primary key,
  popular_name text not null,
  official_name text not null,
  short_name text not null,
  summary text not null,
  band_type text not null,
  municipality_slug text not null,
  foundation_text text not null,
  description text not null,
  website_url text,
  instagram_url text,
  youtube_url text,
  spotify_url text,
  headquarters_text text not null
) on commit drop;

insert into _hc_bandas_sevilla_catalog values
  (
    'agrupacion-musical-pasion-de-linares',
    'Pasión de Linares',
    'Agrupación Musical Nuestro Padre Jesús de la Pasión de Linares',
    'A. M. Pasión de Linares',
    'Agrupación musical fundada en Linares en 1996 y presente en la Semana Santa de Sevilla tras Santa Genoveva y, entre 2022 y 2026, tras El Carmen.',
    'Agrupación Musical',
    'linares',
    '1996',
    'La Agrupación Musical Nuestro Padre Jesús de la Pasión de Linares nació en 1996. En la Semana Santa de Sevilla acompaña al paso de Nuestro Padre Jesús Cautivo de Santa Genoveva desde 2019 y acompañó al Señor de la Paz del Carmen entre 2022 y 2026.',
    null,
    'https://www.instagram.com/pasiondelinares/',
    'https://www.youtube.com/channel/UCAQeYo6-kSYPl9pEmKqi4iQ',
    'https://open.spotify.com/intl-es/artist/6e1RCo7MFOPgzkzx31M0rs',
    'Linares · Jaén'
  ),
  (
    'banda-cornetas-tambores-esencia-sevilla',
    'Esencia',
    'Banda de Cornetas y Tambores Esencia',
    'B. C. T. Esencia',
    'Banda sevillana de cornetas y tambores fundada en 2006, vinculada al estilo clásico de la Policía Armada y a las Siete Palabras desde 2011.',
    'Cornetas y Tambores',
    'sevilla',
    '18 de septiembre de 2006',
    'La Banda de Cornetas y Tambores Esencia se creó en Sevilla en septiembre de 2006 para conservar el sonido clásico de la corneta y el tambor. Acompaña al Santísimo Cristo de las Siete Palabras desde 2011.',
    'https://amigosdeesencia.com/',
    null,
    'https://www.youtube.com/@ccyttesencia',
    'https://open.spotify.com/intl-es/artist/6UbYDRlpEz2zb0j1N3H92v',
    'Sevilla'
  );

insert into public.entities (entity_type, name, slug, summary, status)
select 'band', popular_name, slug, summary, 'published'
from _hc_bandas_sevilla_catalog
on conflict (slug) do update set
  entity_type = excluded.entity_type,
  name = excluded.name,
  summary = excluded.summary,
  status = excluded.status,
  updated_at = now();

insert into public.bands (
  entity_id, band_type, municipality_id, foundation_text, website_url,
  instagram_url, youtube_url, description, headquarters_text
)
select
  entity.id,
  catalog.band_type,
  municipality.id,
  catalog.foundation_text,
  catalog.website_url,
  catalog.instagram_url,
  catalog.youtube_url,
  catalog.description,
  catalog.headquarters_text
from _hc_bandas_sevilla_catalog catalog
join public.entities entity
  on entity.slug = catalog.slug and entity.entity_type = 'band'
join public.municipalities municipality
  on municipality.slug = catalog.municipality_slug
on conflict (entity_id) do update set
  band_type = excluded.band_type,
  municipality_id = excluded.municipality_id,
  foundation_text = excluded.foundation_text,
  website_url = coalesce(excluded.website_url, public.bands.website_url),
  instagram_url = coalesce(excluded.instagram_url, public.bands.instagram_url),
  youtube_url = coalesce(excluded.youtube_url, public.bands.youtube_url),
  description = excluded.description,
  headquarters_text = excluded.headquarters_text;

with desired_names as (
  select
    entity.id as band_entity_id,
    catalog.official_name as name,
    catalog.short_name,
    'official'::text as name_type
  from _hc_bandas_sevilla_catalog catalog
  join public.entities entity on entity.slug = catalog.slug

  union all

  select
    entity.id,
    catalog.popular_name,
    catalog.popular_name,
    'popular'::text
  from _hc_bandas_sevilla_catalog catalog
  join public.entities entity on entity.slug = catalog.slug
)
update public.band_names existing
set
  short_name = desired.short_name,
  is_current = true,
  date_to = null,
  date_to_text = null
from desired_names desired
where existing.band_entity_id = desired.band_entity_id
  and lower(existing.name) = lower(desired.name)
  and existing.name_type = desired.name_type;

with desired_names as (
  select
    entity.id as band_entity_id,
    catalog.official_name as name,
    catalog.short_name,
    'official'::text as name_type
  from _hc_bandas_sevilla_catalog catalog
  join public.entities entity on entity.slug = catalog.slug

  union all

  select
    entity.id,
    catalog.popular_name,
    catalog.popular_name,
    'popular'::text
  from _hc_bandas_sevilla_catalog catalog
  join public.entities entity on entity.slug = catalog.slug
)
insert into public.band_names (
  band_entity_id, name, short_name, name_type, is_current
)
select
  desired.band_entity_id,
  desired.name,
  desired.short_name,
  desired.name_type,
  true
from desired_names desired
where not exists (
  select 1
  from public.band_names existing
  where existing.band_entity_id = desired.band_entity_id
    and lower(existing.name) = lower(desired.name)
    and existing.name_type = desired.name_type
);

insert into public.entity_social_links (
  entity_id, platform, url, label, display_order, is_public
)
select
  entity.id,
  link.platform,
  link.url,
  link.label,
  link.display_order,
  true
from _hc_bandas_sevilla_catalog catalog
join public.entities entity on entity.slug = catalog.slug
cross join lateral (
  values
    ('website'::text, catalog.website_url, 'Web oficial'::text, 10::smallint),
    ('instagram', catalog.instagram_url, 'Instagram', 30::smallint),
    ('youtube', catalog.youtube_url, 'YouTube', 40::smallint),
    ('spotify', catalog.spotify_url, 'Spotify', 50::smallint)
) link(platform, url, label, display_order)
where link.url is not null
on conflict (entity_id, platform) do update set
  url = excluded.url,
  label = excluded.label,
  display_order = excluded.display_order,
  is_public = excluded.is_public,
  updated_at = now();

insert into public.sources (
  name, url, source_type, author_or_publisher, publication_date,
  accessed_at, notes
)
select
  source.name,
  source.url,
  source.source_type,
  source.publisher,
  source.publication_date,
  date '2026-09-08',
  source.notes
from (values
  (
    'BOJA · Bandera de Andalucía a Pasión de Linares',
    'https://www.juntadeandalucia.es/boja/2026/35/30',
    'Fuente institucional',
    'Junta de Andalucía',
    date '2026-02-20',
    'Denominación, fundación en 1996 y trayectoria de la formación.'
  ),
  (
    'Santa Genoveva renueva a Pasión de Linares',
    'https://inriinformacion.com/2022/03/31/santa-genoveva-renueva-a-pasion-de-linares-para-los-proximos-cuatro-anos/',
    'Prensa especializada',
    'INRI Información',
    date '2022-03-31',
    'Documenta la incorporación para el Lunes Santo de 2019 y la renovación posterior.'
  ),
  (
    'Pasión de Linares · Cautivo de Santa Genoveva 2026',
    'https://www.youtube.com/watch?v=AJpsHWMFgFU',
    'Canal oficial',
    'Pasión de Linares',
    null::date,
    'Registro oficial del acompañamiento al Cautivo en el Lunes Santo de 2026.'
  ),
  (
    'El Carmen · La música de Pasión de Linares',
    'https://www.hermandaddelcarmen.es/la-musica-de-pasion-de-linares/',
    'Web oficial',
    'Hermandad del Carmen',
    null::date,
    'La Hermandad documenta la identidad musical de la formación vinculada al Señor de la Paz.'
  ),
  (
    'El Carmen renueva a Pasión de Linares para 2026',
    'https://inriinformacion.com/2025/07/02/el-carmen-renueva-a-pasion-de-linares-y-a-la-soledad-de-cantillana-para-2026/',
    'Prensa especializada',
    'INRI Información',
    date '2025-07-02',
    'Confirma el acompañamiento tras el Señor de la Paz en 2026.'
  ),
  (
    'Pasión de Linares no seguirá tras El Carmen en 2027',
    'https://www.101tv.es/sevilla-semana-santa/pasion-de-linares-no-seguira-acompanando-al-senor-de-la-paz-del-carmen-doloroso/',
    'Prensa especializada',
    '101TV Sevilla',
    date '2026-07-02',
    'Documenta el cierre del periodo con El Carmen después de la Semana Santa de 2026.'
  ),
  (
    'Esencia · Nuestra historia',
    'https://amigosdeesencia.com/historia',
    'Web oficial',
    'Banda de Cornetas y Tambores Esencia',
    null::date,
    'Denominación, fundación en septiembre de 2006 y estilo musical de la formación.'
  ),
  (
    'Esencia · Nuestra Semana Santa',
    'https://amigosdeesencia.com/nuestra-semana-santa',
    'Web oficial',
    'Banda de Cornetas y Tambores Esencia',
    null::date,
    'Incluye a las Siete Palabras entre los acompañamientos actuales de la formación.'
  ),
  (
    'Esencia · Histórico de acompañamientos',
    'https://amigosdeesencia.com/nuestra-semana-santa/historico',
    'Web oficial',
    'Banda de Cornetas y Tambores Esencia',
    null::date,
    'Documenta el acompañamiento al Cristo de las Siete Palabras desde 2011 hasta 2026.'
  )
) as source(name, url, source_type, publisher, publication_date, notes)
where not exists (
  select 1 from public.sources existing where existing.url = source.url
);

update public.sources
set accessed_at = date '2026-09-08'
where url in (
  'https://www.juntadeandalucia.es/boja/2026/35/30',
  'https://inriinformacion.com/2022/03/31/santa-genoveva-renueva-a-pasion-de-linares-para-los-proximos-cuatro-anos/',
  'https://www.youtube.com/watch?v=AJpsHWMFgFU',
  'https://www.hermandaddelcarmen.es/la-musica-de-pasion-de-linares/',
  'https://inriinformacion.com/2025/07/02/el-carmen-renueva-a-pasion-de-linares-y-a-la-soledad-de-cantillana-para-2026/',
  'https://www.101tv.es/sevilla-semana-santa/pasion-de-linares-no-seguira-acompanando-al-senor-de-la-paz-del-carmen-doloroso/',
  'https://amigosdeesencia.com/historia',
  'https://amigosdeesencia.com/nuestra-semana-santa',
  'https://amigosdeesencia.com/nuestra-semana-santa/historico'
);

with entity_sources as (
  select * from (values
    (
      'agrupacion-musical-pasion-de-linares',
      'https://www.juntadeandalucia.es/boja/2026/35/30',
      'Identidad, fundación y trayectoria'
    ),
    (
      'agrupacion-musical-pasion-de-linares',
      'https://www.youtube.com/watch?v=AJpsHWMFgFU',
      'Actividad oficial en la Semana Santa de Sevilla de 2026'
    ),
    (
      'banda-cornetas-tambores-esencia-sevilla',
      'https://amigosdeesencia.com/historia',
      'Identidad, fundación y estilo musical'
    ),
    (
      'banda-cornetas-tambores-esencia-sevilla',
      'https://amigosdeesencia.com/nuestra-semana-santa',
      'Agenda penitencial vigente'
    )
  ) as data(band_slug, source_url, scope)
)
insert into public.source_links (source_id, entity_id, scope, notes)
select
  source.id,
  band.id,
  data.scope,
  'Fuente incorporada en el lote de bandas de la Semana Santa de Sevilla del 8 de septiembre de 2026.'
from entity_sources data
join public.entities band on band.slug = data.band_slug
join public.sources source on source.url = data.source_url
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.entity_id = band.id
    and existing.scope = data.scope
);

create temporary table _hc_bandas_sevilla_music (
  band_slug text not null,
  brotherhood_slug text not null,
  position text not null,
  outing_type text not null,
  date_from_text text not null,
  year_from integer not null,
  date_to_text text,
  year_to integer,
  is_current boolean not null,
  notes text not null,
  public_brotherhood_name text not null,
  public_step_name text not null,
  public_brotherhood_slug text not null,
  public_municipality_name text not null,
  public_municipality_slug text not null,
  public_province text not null,
  primary key (band_slug, brotherhood_slug, outing_type, year_from)
) on commit drop;

insert into _hc_bandas_sevilla_music values
  (
    'agrupacion-musical-pasion-de-linares',
    'santa-genoveva',
    'Tras el paso de misterio de Nuestro Padre Jesús Cautivo',
    'Lunes Santo',
    'Desde 2019',
    2019,
    null,
    null,
    true,
    'La formación se incorporó al acompañamiento del Cautivo en el Lunes Santo de 2019 y continúa vinculada en 2026.',
    'Hermandad de Santa Genoveva',
    'Paso de misterio de Nuestro Padre Jesús Cautivo',
    'santa-genoveva',
    'Sevilla',
    'sevilla',
    'Sevilla'
  ),
  (
    'agrupacion-musical-pasion-de-linares',
    'carmen-doloroso',
    'Tras el paso de misterio de Nuestro Padre Jesús de la Paz',
    'Miércoles Santo',
    'Desde 2022',
    2022,
    'Hasta 2026',
    2026,
    false,
    'Vinculación desarrollada entre 2022 y 2026; la formación no continuará tras el Señor de la Paz en 2027.',
    'El Carmen',
    'Paso de misterio de Nuestro Padre Jesús de la Paz',
    'carmen-doloroso',
    'Sevilla',
    'sevilla',
    'Sevilla'
  ),
  (
    'banda-cornetas-tambores-esencia-sevilla',
    'siete-palabras-sevilla',
    'Tras el paso de misterio del Santísimo Cristo de las Siete Palabras',
    'Miércoles Santo',
    'Desde 2011',
    2011,
    null,
    null,
    true,
    'Acompañamiento documentado de forma continuada en el histórico oficial de la banda desde 2011 hasta 2026.',
    'Las Siete Palabras',
    'Paso de misterio del Santísimo Cristo de las Siete Palabras',
    'siete-palabras-sevilla',
    'Sevilla',
    'sevilla',
    'Sevilla'
  );

update public.music_accompaniment_periods existing
set
  step_entity_id = null,
  position = desired.position,
  date_from_text = desired.date_from_text,
  year_from = desired.year_from,
  date_to_text = desired.date_to_text,
  year_to = desired.year_to,
  is_current = desired.is_current,
  notes = desired.notes,
  status = 'published',
  public_brotherhood_name = desired.public_brotherhood_name,
  public_step_name = desired.public_step_name,
  public_brotherhood_slug = desired.public_brotherhood_slug,
  public_municipality_name = desired.public_municipality_name,
  public_municipality_slug = desired.public_municipality_slug,
  public_province = desired.public_province,
  updated_at = now()
from _hc_bandas_sevilla_music desired
join public.entities band on band.slug = desired.band_slug
join public.entities brotherhood on brotherhood.slug = desired.brotherhood_slug
where existing.band_entity_id = band.id
  and existing.brotherhood_entity_id = brotherhood.id
  and existing.outing_type = desired.outing_type
  and existing.year_from = desired.year_from;

insert into public.music_accompaniment_periods (
  brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type,
  date_from_text, year_from, date_to_text, year_to, is_current, notes, status,
  public_brotherhood_name, public_step_name, public_brotherhood_slug,
  public_municipality_name, public_municipality_slug, public_province
)
select
  brotherhood.id,
  band.id,
  null,
  desired.position,
  desired.outing_type,
  desired.date_from_text,
  desired.year_from,
  desired.date_to_text,
  desired.year_to,
  desired.is_current,
  desired.notes,
  'published',
  desired.public_brotherhood_name,
  desired.public_step_name,
  desired.public_brotherhood_slug,
  desired.public_municipality_name,
  desired.public_municipality_slug,
  desired.public_province
from _hc_bandas_sevilla_music desired
join public.entities band on band.slug = desired.band_slug
join public.entities brotherhood on brotherhood.slug = desired.brotherhood_slug
where not exists (
  select 1
  from public.music_accompaniment_periods existing
  where existing.band_entity_id = band.id
    and existing.brotherhood_entity_id = brotherhood.id
    and existing.outing_type = desired.outing_type
    and existing.year_from = desired.year_from
);

with period_sources as (
  select * from (values
    (
      'agrupacion-musical-pasion-de-linares',
      'santa-genoveva',
      'Lunes Santo',
      2019,
      'https://inriinformacion.com/2022/03/31/santa-genoveva-renueva-a-pasion-de-linares-para-los-proximos-cuatro-anos/',
      'Inicio del periodo'
    ),
    (
      'agrupacion-musical-pasion-de-linares',
      'santa-genoveva',
      'Lunes Santo',
      2019,
      'https://www.youtube.com/watch?v=AJpsHWMFgFU',
      'Continuidad en 2026'
    ),
    (
      'agrupacion-musical-pasion-de-linares',
      'carmen-doloroso',
      'Miércoles Santo',
      2022,
      'https://www.hermandaddelcarmen.es/la-musica-de-pasion-de-linares/',
      'Vinculación musical'
    ),
    (
      'agrupacion-musical-pasion-de-linares',
      'carmen-doloroso',
      'Miércoles Santo',
      2022,
      'https://inriinformacion.com/2025/07/02/el-carmen-renueva-a-pasion-de-linares-y-a-la-soledad-de-cantillana-para-2026/',
      'Vigencia en 2026'
    ),
    (
      'agrupacion-musical-pasion-de-linares',
      'carmen-doloroso',
      'Miércoles Santo',
      2022,
      'https://www.101tv.es/sevilla-semana-santa/pasion-de-linares-no-seguira-acompanando-al-senor-de-la-paz-del-carmen-doloroso/',
      'Cierre del periodo en 2026'
    ),
    (
      'banda-cornetas-tambores-esencia-sevilla',
      'siete-palabras-sevilla',
      'Miércoles Santo',
      2011,
      'https://amigosdeesencia.com/nuestra-semana-santa',
      'Vigencia del acompañamiento'
    ),
    (
      'banda-cornetas-tambores-esencia-sevilla',
      'siete-palabras-sevilla',
      'Miércoles Santo',
      2011,
      'https://amigosdeesencia.com/nuestra-semana-santa/historico',
      'Cronología desde 2011'
    )
  ) as data(
    band_slug, brotherhood_slug, outing_type, year_from,
    source_url, scope
  )
)
insert into public.source_links (
  source_id, music_accompaniment_period_id, scope, notes
)
select
  source.id,
  period.id,
  data.scope,
  'Fuente de la relación musical incorporada el 8 de septiembre de 2026.'
from period_sources data
join public.entities band on band.slug = data.band_slug
join public.entities brotherhood on brotherhood.slug = data.brotherhood_slug
join public.music_accompaniment_periods period
  on period.band_entity_id = band.id
 and period.brotherhood_entity_id = brotherhood.id
 and period.outing_type = data.outing_type
 and period.year_from = data.year_from
join public.sources source on source.url = data.source_url
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.music_accompaniment_period_id = period.id
    and existing.scope = data.scope
);

do $$
declare
  v_pasion uuid;
  v_esencia uuid;
begin
  select id into strict v_pasion
  from public.entities
  where slug = 'agrupacion-musical-pasion-de-linares'
    and entity_type = 'band'
    and status = 'published';

  select id into strict v_esencia
  from public.entities
  where slug = 'banda-cornetas-tambores-esencia-sevilla'
    and entity_type = 'band'
    and status = 'published';

  if not exists (select 1 from public.bands where entity_id = v_pasion) then
    raise exception 'La ficha de Pasión de Linares no quedó creada';
  end if;

  if not exists (select 1 from public.bands where entity_id = v_esencia) then
    raise exception 'La ficha de Esencia no quedó creada';
  end if;

  if (
    select count(*)
    from public.music_accompaniment_periods period
    join public.entities brotherhood on brotherhood.id = period.brotherhood_entity_id
    where period.band_entity_id = v_pasion
      and brotherhood.slug in ('santa-genoveva', 'carmen-doloroso')
      and period.status = 'published'
  ) <> 2 then
    raise exception 'Pasión de Linares no conserva exactamente las dos relaciones solicitadas';
  end if;

  if not exists (
    select 1
    from public.music_accompaniment_periods period
    join public.entities brotherhood on brotherhood.id = period.brotherhood_entity_id
    where period.band_entity_id = v_pasion
      and brotherhood.slug = 'santa-genoveva'
      and period.year_from = 2019
      and period.is_current
      and period.status = 'published'
  ) then
    raise exception 'Santa Genoveva no quedó vigente con Pasión de Linares';
  end if;

  if not exists (
    select 1
    from public.music_accompaniment_periods period
    join public.entities brotherhood on brotherhood.id = period.brotherhood_entity_id
    where period.band_entity_id = v_pasion
      and brotherhood.slug = 'carmen-doloroso'
      and period.year_from = 2022
      and period.year_to = 2026
      and not period.is_current
      and period.status = 'published'
  ) then
    raise exception 'El periodo de El Carmen no quedó cerrado en 2026';
  end if;

  if not exists (
    select 1
    from public.music_accompaniment_periods period
    join public.entities brotherhood on brotherhood.id = period.brotherhood_entity_id
    where period.band_entity_id = v_esencia
      and brotherhood.slug = 'siete-palabras-sevilla'
      and period.year_from = 2011
      and period.is_current
      and period.status = 'published'
  ) then
    raise exception 'Las Siete Palabras no quedó vigente con Esencia';
  end if;

  if exists (
    select 1
    from public.music_accompaniment_periods period
    join public.entities brotherhood on brotherhood.id = period.brotherhood_entity_id
    where period.band_entity_id = v_pasion
      and brotherhood.slug = 'carmen-doloroso'
      and period.is_current
  ) then
    raise exception 'El Carmen no puede figurar como acompañamiento futuro de Pasión de Linares';
  end if;

  if exists (
    select 1
    from public.music_accompaniment_periods period
    where period.id in (
      select candidate.id
      from public.music_accompaniment_periods candidate
      join public.entities band on band.id = candidate.band_entity_id
      join public.entities brotherhood on brotherhood.id = candidate.brotherhood_entity_id
      where (
          band.slug = 'agrupacion-musical-pasion-de-linares'
          and brotherhood.slug in ('santa-genoveva', 'carmen-doloroso')
        ) or (
          band.slug = 'banda-cornetas-tambores-esencia-sevilla'
          and brotherhood.slug = 'siete-palabras-sevilla'
        )
    )
      and not exists (
        select 1
        from public.source_links source_link
        where source_link.music_accompaniment_period_id = period.id
      )
  ) then
    raise exception 'Alguna relación musical nueva quedó sin fuente';
  end if;
end $$;
