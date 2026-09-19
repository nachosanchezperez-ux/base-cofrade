-- HC-016 · Coria del Río · reconciliación final post-Apply
-- Fecha: 2026-09-19
-- Naturaleza: DML archivado, NO migración estructural activa.
-- Auditoría productiva: bulk_import c0160041-0000-4000-8000-000000000001
-- Resultado certificado previo al merge: 22/22, 0 inválidas, 0 fallos.
-- Desglose: 21 operaciones DML + 1 reutilización canónica.
--
-- Este delta NO recrea el grafo municipal base c0160031. Reutiliza sus IDs
-- canónicos, eleva San José · Martes Santo 2026 a held con evidencia
-- retrospectiva, consolida siete periodos musicales y reconcilia la sede
-- duplicada de Santa María de la Estrella.
--
-- Huecos legítimos preservados:
-- - Piedad del Sábado Santo 2026: sin música inferida.
-- - AM San Lucas: sin asignación forzada a Resurrección.
-- - No DDL. No RLS.

begin;

insert into public.sources
(id,name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
values
(
 '56c72364-3efc-4d8d-abb8-6cd7a48087d2'::uuid,
 'Martes Santo 2026 Coria del Río',
 'https://sevillanoviajero.blogspot.com/2026/04/martes-santo-2026-coria-del-rio.html',
 'Crónica posterior',
 'Sevillano Viajero',
 '2026-04-17'::date,
 '2026-09-18'::date,
 'Crónica posterior que acredita la salida de San José el Martes Santo de 2026.'
)
on conflict (id) do update set
 name=excluded.name,
 url=excluded.url,
 source_type=excluded.source_type,
 author_or_publisher=excluded.author_or_publisher,
 publication_date=excluded.publication_date,
 accessed_at=excluded.accessed_at,
 notes=excluded.notes;

do $reuse$
begin
 if not exists (
   select 1
   from public.sources
   where id='c0160031-0112-4000-8000-000000000012'::uuid
     and url='https://aljarafeymas.com/system/images/20386/original/EL_MU%C3%91IDOR_DEL_ALJARAFE_2026_-_EDICION_DIGITAL.pdf'
 ) then
   raise exception 'HC016_CORIA: fuente canónica El Muñidor 2026 no disponible';
 end if;
end
$reuse$;

update public.outings
set event_status='held', updated_at=now()
where id='c0160031-0923-4000-8000-000000000023'::uuid
  and reference_code='HC016-CORIA-SJ-TUE-2026';

insert into public.source_links
(id,source_id,outing_id,scope,notes)
values
(
 'c0160041-2001-4000-8000-000000000001'::uuid,
 '56c72364-3efc-4d8d-abb8-6cd7a48087d2'::uuid,
 'c0160031-0923-4000-8000-000000000023'::uuid,
 'Crónica posterior que acredita la celebración del Martes Santo 2026',
 null
)
on conflict (id) do update set
 source_id=excluded.source_id,
 outing_id=excluded.outing_id,
 scope=excluded.scope,
 notes=excluded.notes;

insert into public.music_accompaniment_periods
(id,brotherhood_entity_id,band_entity_id,step_entity_id,position,outing_type,date_from,date_from_text,year_from,date_to,date_to_text,year_to,is_current,notes,status)
values
('388b7e0a-e1f9-4b7f-b82a-b5c4097cc14f'::uuid,'c0160031-0301-4000-8000-000000000001'::uuid,'de6bb885-b80e-4c26-a176-7f72af419d63'::uuid,'c0160031-0703-4000-8000-000000000003'::uuid,'Tras el paso del Cristo','Lunes Santo',null,'Vigente en la Semana Santa de 2026; inicio no acreditado',2026,null,null,null,true,'No se infiere continuidad para 2027.','published'),
('c891e096-eae9-4c34-917c-e62510de7aae'::uuid,'c0160031-0303-4000-8000-000000000003'::uuid,'c0160031-0402-4000-8000-000000000002'::uuid,'c0160031-0708-4000-8000-000000000008'::uuid,'Tras el paso del Señor','Miércoles Santo',null,'Vigente en la Semana Santa de 2026; inicio no acreditado',2026,null,null,null,true,'No se infiere continuidad para 2027.','published'),
('cd740f82-5fc2-427c-a028-460fea684d90'::uuid,'c0160031-0303-4000-8000-000000000003'::uuid,'63f719d8-61ab-4357-a43f-cc7977bdda43'::uuid,'c0160031-0709-4000-8000-000000000009'::uuid,'Tras el paso de la Virgen','Miércoles Santo',null,'Vigente en la Semana Santa de 2026; inicio no acreditado',2026,null,null,null,true,'No se infiere continuidad para 2027.','published'),
('b3489705-9502-4221-b80e-1dd286c74bf5'::uuid,'c0160031-0304-4000-8000-000000000004'::uuid,'63f719d8-61ab-4357-a43f-cc7977bdda43'::uuid,'c0160031-0711-4000-8000-000000000011'::uuid,'Tras el paso de la Virgen','Jueves Santo',null,'Vigente en la Semana Santa de 2026; inicio no acreditado',2026,null,null,null,true,'No se infiere continuidad para 2027.','published'),
('d0726cc2-7c98-44ee-b2cb-da1d0d1547a3'::uuid,'c0160031-0305-4000-8000-000000000005'::uuid,'63f719d8-61ab-4357-a43f-cc7977bdda43'::uuid,'c0160031-0713-4000-8000-000000000013'::uuid,'Tras el paso de la Soledad','Viernes Santo',null,'Vigente en la Semana Santa de 2026; inicio no acreditado',2026,null,null,null,true,'No se infiere continuidad para 2027.','published'),
('b2ade060-7757-4660-a4ed-0b5dc5735782'::uuid,'c0160031-0305-4000-8000-000000000005'::uuid,'6d6ceee7-53d0-4705-a58c-fadc364cb322'::uuid,'c0160031-0714-4000-8000-000000000014'::uuid,'Tras el Cristo Resucitado','Domingo de Resurrección',null,'Vigente en la Semana Santa de 2026; inicio no acreditado',2026,null,null,null,true,'No se infiere continuidad para 2027.','published'),
('db8710ea-0ffc-4657-b278-ff39032d69fc'::uuid,'c0160031-0305-4000-8000-000000000005'::uuid,'63f719d8-61ab-4357-a43f-cc7977bdda43'::uuid,'c0160031-0715-4000-8000-000000000015'::uuid,'Tras el paso de gloria de la Soledad','Domingo de Resurrección',null,'Vigente en la Semana Santa de 2026; inicio no acreditado',2026,null,null,null,true,'No se infiere continuidad para 2027.','published')
on conflict (id) do update set
 brotherhood_entity_id=excluded.brotherhood_entity_id,
 band_entity_id=excluded.band_entity_id,
 step_entity_id=excluded.step_entity_id,
 position=excluded.position,
 outing_type=excluded.outing_type,
 date_from=excluded.date_from,
 date_from_text=excluded.date_from_text,
 year_from=excluded.year_from,
 date_to=excluded.date_to,
 date_to_text=excluded.date_to_text,
 year_to=excluded.year_to,
 is_current=excluded.is_current,
 notes=excluded.notes,
 status=excluded.status;

insert into public.source_links
(id,source_id,music_accompaniment_period_id,scope,notes)
values
('d657baa8-0d83-4eb5-bb95-63ca016dccfd'::uuid,'c0160031-0112-4000-8000-000000000012'::uuid,'388b7e0a-e1f9-4b7f-b82a-b5c4097cc14f'::uuid,'Vigencia documentada en 2026',null),
('4aa44f31-6b33-40b3-9fa4-83a707861c62'::uuid,'c0160031-0112-4000-8000-000000000012'::uuid,'c891e096-eae9-4c34-917c-e62510de7aae'::uuid,'Vigencia documentada en 2026',null),
('338f6a39-5363-4cc5-aea4-fda39d81520b'::uuid,'c0160031-0112-4000-8000-000000000012'::uuid,'cd740f82-5fc2-427c-a028-460fea684d90'::uuid,'Vigencia documentada en 2026',null),
('ce30f728-788d-4106-bd95-a61177aad3f0'::uuid,'c0160031-0112-4000-8000-000000000012'::uuid,'b3489705-9502-4221-b80e-1dd286c74bf5'::uuid,'Vigencia documentada en 2026',null),
('1364c125-0f93-4e61-8a77-8a12011dfeca'::uuid,'c0160031-0112-4000-8000-000000000012'::uuid,'d0726cc2-7c98-44ee-b2cb-da1d0d1547a3'::uuid,'Vigencia documentada en 2026',null),
('e536a89f-5cdf-4798-a4cc-5ca008a0b246'::uuid,'c0160031-0112-4000-8000-000000000012'::uuid,'b2ade060-7757-4660-a4ed-0b5dc5735782'::uuid,'Vigencia documentada en 2026',null),
('88a18b59-0610-4c68-9620-5174bfcbb7c4'::uuid,'c0160031-0112-4000-8000-000000000012'::uuid,'db8710ea-0ffc-4657-b278-ff39032d69fc'::uuid,'Vigencia documentada en 2026',null)
on conflict (id) do update set
 source_id=excluded.source_id,
 music_accompaniment_period_id=excluded.music_accompaniment_period_id,
 scope=excluded.scope,
 notes=excluded.notes;

update public.brotherhoods
set canonical_see_place_id='5317981f-4be1-4bbd-a4c8-943d178d247e'::uuid
where entity_id='20f519f8-54ee-46e0-a4ab-aa524c13227b'::uuid;

update public.outings
set origin_place_id=case
      when origin_place_id='c54894e3-7090-4c69-952c-3fb6a9148a68'::uuid
      then '5317981f-4be1-4bbd-a4c8-943d178d247e'::uuid
      else origin_place_id
    end,
    destination_place_id=case
      when destination_place_id='c54894e3-7090-4c69-952c-3fb6a9148a68'::uuid
      then '5317981f-4be1-4bbd-a4c8-943d178d247e'::uuid
      else destination_place_id
    end,
    updated_at=now()
where origin_place_id='c54894e3-7090-4c69-952c-3fb6a9148a68'::uuid
   or destination_place_id='c54894e3-7090-4c69-952c-3fb6a9148a68'::uuid;

update public.outing_series
set origin_place_id=case
      when origin_place_id='c54894e3-7090-4c69-952c-3fb6a9148a68'::uuid
      then '5317981f-4be1-4bbd-a4c8-943d178d247e'::uuid
      else origin_place_id
    end,
    destination_place_id=case
      when destination_place_id='c54894e3-7090-4c69-952c-3fb6a9148a68'::uuid
      then '5317981f-4be1-4bbd-a4c8-943d178d247e'::uuid
      else destination_place_id
    end,
    updated_at=now()
where origin_place_id='c54894e3-7090-4c69-952c-3fb6a9148a68'::uuid
   or destination_place_id='c54894e3-7090-4c69-952c-3fb6a9148a68'::uuid;

do $place_guard$
declare
  r record;
  has_ref boolean;
begin
  for r in
    select n.nspname schema_name, cl.relname table_name, a.attname column_name
    from pg_constraint fk
    join pg_class cl on cl.oid=fk.conrelid
    join pg_namespace n on n.oid=cl.relnamespace
    join unnest(fk.conkey) ck(attnum) on true
    join pg_attribute a on a.attrelid=fk.conrelid and a.attnum=ck.attnum
    where fk.contype='f'
      and fk.confrelid='public.places'::regclass
      and array_length(fk.conkey,1)=1
      and n.nspname='public'
  loop
    execute format(
      'select exists(select 1 from %I.%I where %I=$1)',
      r.schema_name, r.table_name, r.column_name
    )
    into has_ref
    using 'c54894e3-7090-4c69-952c-3fb6a9148a68'::uuid;

    if has_ref then
      raise exception 'HC016_CORIA: sede duplicada aún referenciada por %.%.%',
        r.schema_name, r.table_name, r.column_name;
    end if;
  end loop;
end
$place_guard$;

delete from public.places
where id='c54894e3-7090-4c69-952c-3fb6a9148a68'::uuid;

commit;
