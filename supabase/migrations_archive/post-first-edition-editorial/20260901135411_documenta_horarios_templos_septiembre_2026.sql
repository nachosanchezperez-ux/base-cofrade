-- Lote editorial · Horarios de templos y sedes · septiembre de 2026
-- Solo DML sobre Lugares, relaciones y Fuentes ya existentes.
-- No introduce DDL, RLS ni publica fichas que continúan en borrador.

insert into public.municipalities (name, slug, province, autonomous_community, country)
select 'Sevilla', 'sevilla', 'Sevilla', 'Andalucía', 'España'
where not exists (
  select 1
  from public.municipalities
  where slug = 'sevilla' or lower(name) = 'sevilla'
);

with venue_data as (
  select *
  from (values
    (
      'Parroquia de la Milagrosa',
      'parroquia-de-la-milagrosa-sevilla',
      'parroquia',
      E'Septiembre de 2026\nApertura · Lunes a sábado: 19:00–21:00. Domingos: 10:00–13:00.\nEucaristías · Lunes a sábado: 20:00. Domingos: 10:00 y 12:00.\nDespacho parroquial · Lunes a viernes: 19:00–20:00.'
    ),
    (
      'Capilla de la Piedad',
      'capilla-de-la-piedad-sevilla',
      'capilla',
      E'Horario habitual reanudado el 1 de septiembre de 2026\nApertura · Lunes a viernes: 11:00–13:00 y 19:00–21:00. Sábados: 11:00–13:00. Sábados por la tarde y domingos: cerrado, salvo para la Santa Misa.\nMisas · Miércoles y sábados: 20:30. Domingos: 11:00.'
    ),
    (
      'Capilla Virgen de la Estrella',
      'capilla-virgen-de-la-estrella-sevilla',
      'capilla',
      E'Horario habitual comprobado el 1 de septiembre de 2026\nVisitas · Lunes a sábado: 10:00–13:30 y 18:00–21:00. Domingos: 10:30–14:00. Durante las misas no se realizan visitas.\nMisas · Lunes a sábado: 20:30. Domingos: Misa de Hermandad a las 13:00.\nJueves · Exposición del Santísimo desde las 18:00 y Santo Rosario a las 20:00. La tienda permanece abierta durante las visitas, salvo durante la Eucaristía y la exposición del Santísimo.'
    ),
    (
      'Basílica del Santísimo Cristo de la Expiración',
      'basilica-del-santisimo-cristo-de-la-expiracion-sevilla',
      'basílica',
      E'Septiembre de 2026\nApertura · Lunes a sábado: 10:00–13:30 y desde las 17:30 hasta la finalización de la misa. Domingos: 10:00–13:30; cerrado por la tarde. Durante las misas no se realizan visitas.\nMisas · De lunes a sábado: 11:30, excepto los jueves; y 20:00, excepto los viernes, que se celebra a las 20:30. Domingos: 10:30 y 12:30.'
    )
  ) as data(name, slug, place_type, opening_hours_text)
), sevilla as (
  select id
  from public.municipalities
  where slug = 'sevilla' or lower(name) = 'sevilla'
  order by (slug = 'sevilla') desc, created_at
  limit 1
)
insert into public.places (
  municipality_id,
  name,
  slug,
  place_type,
  opening_hours_text,
  opening_hours_verified_at
)
select
  sevilla.id,
  venue.name,
  venue.slug,
  venue.place_type,
  venue.opening_hours_text,
  date '2026-09-01'
from venue_data venue
cross join sevilla
on conflict (slug) do update set
  municipality_id = excluded.municipality_id,
  name = excluded.name,
  place_type = excluded.place_type,
  opening_hours_text = excluded.opening_hours_text,
  opening_hours_verified_at = excluded.opening_hours_verified_at,
  updated_at = now();

with entity_venues as (
  select *
  from (values
    ('hermandad-milagrosa-sevilla', 'parroquia-de-la-milagrosa-sevilla'),
    ('el-baratillo', 'capilla-de-la-piedad-sevilla'),
    ('hermandad-de-la-estrella', 'capilla-virgen-de-la-estrella-sevilla'),
    ('hermandad-del-cachorro', 'basilica-del-santisimo-cristo-de-la-expiracion-sevilla')
  ) as data(entity_slug, place_slug)
)
update public.brotherhoods brotherhood
set canonical_see_place_id = place.id,
    municipality_id = coalesce(brotherhood.municipality_id, place.municipality_id)
from entity_venues target
join public.entities entity on entity.slug = target.entity_slug
join public.places place on place.slug = target.place_slug
where brotherhood.entity_id = entity.id;

with entity_venues as (
  select *
  from (values
    ('hermandad-milagrosa-sevilla', 'parroquia-de-la-milagrosa-sevilla'),
    ('el-baratillo', 'capilla-de-la-piedad-sevilla'),
    ('hermandad-de-la-estrella', 'capilla-virgen-de-la-estrella-sevilla'),
    ('hermandad-del-cachorro', 'basilica-del-santisimo-cristo-de-la-expiracion-sevilla')
  ) as data(entity_slug, place_slug)
)
update public.entity_locations location
set place_id = place.id,
    municipality_id = place.municipality_id,
    notes = 'Sede vigente y horario comprobado el 1 de septiembre de 2026.'
from entity_venues target
join public.entities entity on entity.slug = target.entity_slug
join public.places place on place.slug = target.place_slug
where location.entity_id = entity.id
  and location.is_current = true
  and location.location_type = 'physical_location';

with entity_venues as (
  select *
  from (values
    ('hermandad-milagrosa-sevilla', 'parroquia-de-la-milagrosa-sevilla'),
    ('el-baratillo', 'capilla-de-la-piedad-sevilla'),
    ('hermandad-de-la-estrella', 'capilla-virgen-de-la-estrella-sevilla'),
    ('hermandad-del-cachorro', 'basilica-del-santisimo-cristo-de-la-expiracion-sevilla')
  ) as data(entity_slug, place_slug)
)
insert into public.entity_locations (
  entity_id,
  place_id,
  municipality_id,
  location_type,
  is_current,
  notes,
  status
)
select
  entity.id,
  place.id,
  place.municipality_id,
  'physical_location',
  true,
  'Sede vigente y horario comprobado el 1 de septiembre de 2026.',
  case when entity.status = 'published' then 'published' else 'draft' end
from entity_venues target
join public.entities entity on entity.slug = target.entity_slug
join public.places place on place.slug = target.place_slug
where not exists (
  select 1
  from public.entity_locations location
  where location.entity_id = entity.id
    and location.is_current = true
    and location.location_type = 'physical_location'
);

with source_data as (
  select *
  from (values
    (
      'Hermandad de La Milagrosa · horario parroquial de septiembre de 2026',
      'https://www.facebook.com/HdadMilagrosa/',
      'Red social oficial',
      'Hermandad de La Milagrosa',
      date '2026-09-01',
      'Apertura de la parroquia, Eucaristías y despacho parroquial durante septiembre de 2026; publicación oficial aportada por Dirección.'
    ),
    (
      'Hermandad del Baratillo · reapertura y horario habitual de la Capilla de la Piedad',
      'https://www.facebook.com/hdadbaratillo/posts/-apertura-de-la-capillatras-el-par%C3%A9ntesis-estival-del-mes-de-agosto-ma%C3%B1ana-1-de-/1515509160608493/',
      'Red social oficial',
      'Hermandad del Baratillo',
      date '2026-08-31',
      'Reapertura del 1 de septiembre de 2026, horarios habituales de visita y misas.'
    ),
    (
      'Hermandad de la Estrella · horarios de la Capilla Virgen de la Estrella',
      'https://www.instagram.com/p/DaPwJUwFCD7/',
      'Red social oficial',
      'Hermandad de la Estrella',
      null::date,
      'Horario de visitas, misas, exposición del Santísimo, Rosario y tienda; publicación oficial contrastada con la imagen aportada por Dirección.'
    ),
    (
      'Hermandad del Cachorro · horario de septiembre de 2026 de la Basílica',
      'https://www.facebook.com/HdadCachorro/posts/-%F0%9D%90%87%F0%9D%90%A8%F0%9D%90%AB%F0%9D%90%9A%F0%9D%90%AB%F0%9D%90%A2%F0%9D%90%A8-%F0%9D%90%9D%F0%9D%90%9E-%F0%9D%90%AC%F0%9D%90%9E%F0%9D%90%A9%F0%9D%90%AD%F0%9D%90%A2%F0%9D%90%9E%F0%9D%90%A6%F0%9D%90%9B%F0%9D%90%AB%F0%9D%90%9E-la-bas%C3%ADlica-del-sant%C3%ADsimo-cristo-de-la-expiraci%C3%B3n-modific/1518557933634860/',
      'Red social oficial',
      'Hermandad del Cachorro',
      date '2026-09-01',
      'Apertura y misas de la Basílica durante septiembre de 2026; publicación oficial contrastada con la imagen aportada por Dirección.'
    )
  ) as data(name, url, source_type, publisher, publication_date, notes)
)
insert into public.sources (
  name,
  url,
  source_type,
  author_or_publisher,
  publication_date,
  accessed_at,
  notes
)
select
  source.name,
  source.url,
  source.source_type,
  source.publisher,
  source.publication_date,
  date '2026-09-01',
  source.notes
from source_data source
where not exists (
  select 1 from public.sources existing where existing.url = source.url
);

with source_data as (
  select *
  from (values
    ('hermandad-milagrosa-sevilla', 'https://www.facebook.com/HdadMilagrosa/', 'Sede y visita · horario de septiembre de 2026'),
    ('el-baratillo', 'https://www.facebook.com/hdadbaratillo/posts/-apertura-de-la-capillatras-el-par%C3%A9ntesis-estival-del-mes-de-agosto-ma%C3%B1ana-1-de-/1515509160608493/', 'Sede y visita · apertura y misas'),
    ('hermandad-de-la-estrella', 'https://www.instagram.com/p/DaPwJUwFCD7/', 'Sede y visita · visitas, misas y adoración'),
    ('hermandad-del-cachorro', 'https://www.facebook.com/HdadCachorro/posts/-%F0%9D%90%87%F0%9D%90%A8%F0%9D%90%AB%F0%9D%90%9A%F0%9D%90%AB%F0%9D%90%A2%F0%9D%90%A8-%F0%9D%90%9D%F0%9D%90%9E-%F0%9D%90%AC%F0%9D%90%9E%F0%9D%90%A9%F0%9D%90%AD%F0%9D%90%A2%F0%9D%90%9E%F0%9D%90%A6%F0%9D%90%9B%F0%9D%90%AB%F0%9D%90%9E-la-bas%C3%ADlica-del-sant%C3%ADsimo-cristo-de-la-expiraci%C3%B3n-modific/1518557933634860/', 'Sede y visita · horario de septiembre de 2026')
  ) as data(entity_slug, source_url, scope)
)
insert into public.source_links (source_id, entity_id, scope, notes)
select
  source.id,
  entity.id,
  data.scope,
  'Horario oficial del templo comprobado el 1 de septiembre de 2026.'
from source_data data
join public.entities entity on entity.slug = data.entity_slug
join public.sources source on source.url = data.source_url
where not exists (
  select 1
  from public.source_links existing
  where existing.source_id = source.id
    and existing.entity_id = entity.id
);

do $$
declare
  available_targets integer;
begin
  if (
    select count(*)
    from public.places
    where slug in (
      'parroquia-de-la-milagrosa-sevilla',
      'capilla-de-la-piedad-sevilla',
      'capilla-virgen-de-la-estrella-sevilla',
      'basilica-del-santisimo-cristo-de-la-expiracion-sevilla'
    )
      and opening_hours_text is not null
      and opening_hours_verified_at = date '2026-09-01'
  ) <> 4 then
    raise exception 'El lote de horarios no ha dejado cuatro Lugares verificados';
  end if;

  select count(*) into available_targets
  from public.entities
  where slug in (
    'hermandad-milagrosa-sevilla',
    'el-baratillo',
    'hermandad-de-la-estrella',
    'hermandad-del-cachorro'
  );

  if available_targets > 0 and (
    select count(*)
    from public.entity_locations location
    join public.entities entity on entity.id = location.entity_id
    where entity.slug in (
      'hermandad-milagrosa-sevilla',
      'el-baratillo',
      'hermandad-de-la-estrella',
      'hermandad-del-cachorro'
    )
      and location.is_current = true
      and location.location_type = 'physical_location'
  ) <> available_targets then
    raise exception 'No todas las entidades disponibles conservan una Sede vigente';
  end if;
end $$;
