-- La Macarena · horarios de invierno 2026-2027
-- Fuente: cartel oficial de la Hermandad aportado por Dirección el 14 de septiembre de 2026.
-- Solo DML sobre la sede, Fuentes y relaciones existentes. Sin DDL ni cambios RLS.

begin;

do $$
begin
  if (
    select count(*)
    from public.entities entity
    join public.brotherhoods brotherhood on brotherhood.entity_id = entity.id
    join public.places place on place.id = brotherhood.canonical_see_place_id
    where entity.slug = 'hermandad-de-la-macarena'
      and entity.status = 'published'
      and place.slug = 'basilica-esperanza-macarena'
  ) <> 1 then
    raise exception 'La Macarena no resuelve de forma unívoca su sede canónica publicada';
  end if;
end
$$;

update public.places
set opening_hours_text = E'Horario de invierno · 14 de septiembre de 2026–30 de mayo de 2027\nApertura · Lunes a sábado y vísperas de festivo: 08:00–14:00 y 17:00–21:00.\nApertura · Domingos y festivos: 09:30–14:00 y 17:00–21:00.\nMisas · Lunes a viernes: 09:00, 11:30, 19:00 y 20:00.\nMisas · Sábados: 09:00 y 20:00 (Santo Rosario, Salve y Sabatina).\nMisas · Domingos y festivos de precepto: 10:00, 12:30 y 20:00.\nRosario · Todos los días: 19:40.\nMisa de la Sentencia · Primer viernes de mes: 20:00.\nConfesiones · Media hora antes de cada misa.\nMuseo-Tesoro · Lunes a sábado y vísperas de festivo: 09:00–14:00 y 17:00–21:00.\nMuseo-Tesoro · Domingos y festivos: 09:30–14:00 y 17:00–21:00. El acceso finaliza 30 minutos antes de cada cierre.\nDespacho rectoral · Martes a jueves: 18:30–19:30.',
    opening_hours_verified_at = date '2026-09-14',
    updated_at = now()
where slug = 'basilica-esperanza-macarena';

insert into public.sources (
  id,
  name,
  url,
  source_type,
  author_or_publisher,
  publication_date,
  accessed_at,
  notes
)
values (
  '22652c92-2641-4a11-9f84-30ccf4adc08f',
  'Hermandad de la Macarena · horarios de invierno 2026-2027',
  null,
  'Cartel oficial',
  'Hermandad de la Macarena',
  null,
  date '2026-09-14',
  'Cartel oficial aportado por Dirección. Vigencia expresa: del 14 de septiembre de 2026 al 30 de mayo de 2027.'
)
on conflict (id) do update set
  name = excluded.name,
  url = excluded.url,
  source_type = excluded.source_type,
  author_or_publisher = excluded.author_or_publisher,
  publication_date = excluded.publication_date,
  accessed_at = excluded.accessed_at,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_id, scope, notes)
select
  '31fd0317-ac45-45a9-80ee-29a39c4772ec',
  '22652c92-2641-4a11-9f84-30ccf4adc08f',
  entity.id,
  'Sede y visita · horarios de invierno 2026-2027',
  'Apertura de la Basílica, misas, Rosario, confesiones, Museo-Tesoro y despacho rectoral.'
from public.entities entity
where entity.slug = 'hermandad-de-la-macarena'
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_id = excluded.entity_id,
  scope = excluded.scope,
  notes = excluded.notes;

insert into public.source_links (id, source_id, entity_location_id, scope, notes)
select
  '10ed2adc-084c-4871-9ffe-1e044f7bf924',
  '22652c92-2641-4a11-9f84-30ccf4adc08f',
  location.id,
  'Sede canónica · horario vigente',
  'Horario estacional comprobado el 14 de septiembre de 2026.'
from public.entity_locations location
join public.entities entity on entity.id = location.entity_id
join public.places place on place.id = location.place_id
where entity.slug = 'hermandad-de-la-macarena'
  and location.is_current = true
  and location.status = 'published'
  and place.slug = 'basilica-esperanza-macarena'
on conflict (id) do update set
  source_id = excluded.source_id,
  entity_location_id = excluded.entity_location_id,
  scope = excluded.scope,
  notes = excluded.notes;

do $$
begin
  if (
    select count(*)
    from public.places
    where slug = 'basilica-esperanza-macarena'
      and opening_hours_verified_at = date '2026-09-14'
      and opening_hours_text like '%14 de septiembre de 2026–30 de mayo de 2027%'
      and opening_hours_text like '%Rosario · Todos los días: 19:40.%'
      and opening_hours_text like '%Despacho rectoral · Martes a jueves: 18:30–19:30.%'
  ) <> 1 then
    raise exception 'El horario de invierno de la Macarena no quedó completo';
  end if;

  if (
    select count(*)
    from public.source_links
    where id in (
      '31fd0317-ac45-45a9-80ee-29a39c4772ec',
      '10ed2adc-084c-4871-9ffe-1e044f7bf924'
    )
      and source_id = '22652c92-2641-4a11-9f84-30ccf4adc08f'
  ) <> 2 then
    raise exception 'La Fuente del horario no quedó vinculada a Hermandad y sede';
  end if;
end
$$;

commit;
