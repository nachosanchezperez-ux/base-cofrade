-- Reversión de tejera-castilleja.sql.
begin;
update public.music_accompaniment_periods
set status = 'published', notes = 'Acompañamiento musical de la procesión de la Patrona de Benacazón.'
where id = '828e5709-d3fd-41bd-bf87-2120e3dfe626';
update public.brotherhoods set municipality_id = null where entity_id = '38d9322f-d3b1-42e4-91bf-dc4cd606d002';
commit;
