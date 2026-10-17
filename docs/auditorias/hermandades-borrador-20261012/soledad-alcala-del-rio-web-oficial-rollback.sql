-- Reversión de soledad-alcala-del-rio-web-oficial.sql. Valores anteriores consultados el 13/10/2026.
begin;
delete from public.source_links where source_id = '7a5c0e05-2026-4012-8000-00000000ca34';
update public.steps set description = 'Bordados en oro sobre terciopelo negro, con piezas de los siglos XVIII, XIX y XX (ArteSacro, 2016). Autores no documentados.'
where entity_id = '7a5c0e05-2026-4012-8000-000000000a06';
update public.steps set execution_date_text = '1987', description = 'Urna neobarroca de 1987 con el Señor de la Misericordia (21Noticias, 2026).'
where entity_id = '7a5c0e05-2026-4012-8000-000000000a05';
update public.entities set summary = 'Paso con la urna neobarroca de 1987 del Señor de la Misericordia.' where id = '7a5c0e05-2026-4012-8000-000000000a05';
update public.images set execution_date_text = 'Mediados del siglo XVI',
  description = 'Autor desconocido; datable hacia mediados del siglo XVI. Candelero restaurado en 1986 por Francisco de Paula. Coronada canónicamente en 1996 por el cardenal Carlos Amigo Vallejo.'
where entity_id = '7a5c0e05-2026-4012-8000-000000000a02';
update public.entities set summary = 'Dolorosa de autor desconocido, de mediados del siglo XVI. Coronada canónicamente en 1996. Titular de la Hermandad de la Soledad de Alcalá del Río.'
where id = '7a5c0e05-2026-4012-8000-000000000a02';
update public.brotherhoods set website_url = null where entity_id = 'c6100000-0000-4000-8000-000000000005';
delete from public.sources where id = '7a5c0e05-2026-4012-8000-00000000ca34';
commit;
