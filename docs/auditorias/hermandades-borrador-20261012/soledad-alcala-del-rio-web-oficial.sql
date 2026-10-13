-- Soledad de Alcalá del Río · ampliación con la web oficial (13/10/2026). Propietario: envía https://lasoledad.org/.
-- Aporta: web oficial, datación y coronación de la Dolorosa, urna de 2016 y datos del palio.
-- Las secciones «Música» y «Señor de la Misericordia» de la web están en preparación: no aportan datos.
-- Reversión: soledad-alcala-del-rio-web-oficial-rollback.sql.

insert into public.sources (id, name, url, source_type, author_or_publisher, accessed_at, notes) values
 ('7a5c0e05-2026-4012-8000-00000000ca34', 'Real Hermandad de la Soledad de Alcalá del Río · web oficial', 'https://lasoledad.org/',
  'Web oficial de la Hermandad', 'Real Hermandad de la Soledad (Alcalá del Río)', '2026-10-13',
  'Nombre oficial; Dolorosa renacentista hacia 1570 (atribución tradicional a Gaspar Becerra, 1566, sin prueba documental), coronada el 15/06/1996; urna de Orfebrería Andaluza (2016); reforma del palio de 1912 atribuida al taller de Miguel del Olmo; caídas interiores atribuidas a Patrocinio López.')
on conflict (id) do nothing;

update public.brotherhoods set website_url = 'https://lasoledad.org/'
where entity_id = 'c6100000-0000-4000-8000-000000000005' and website_url is null;

update public.entities set summary = 'Dolorosa renacentista del siglo XVI, que la Hermandad sitúa hacia 1570. Coronada canónicamente el 15 de junio de 1996. Titular de la Hermandad de la Soledad de Alcalá del Río.'
where id = '7a5c0e05-2026-4012-8000-000000000a02' and summary like 'Dolorosa de autor desconocido, de mediados del siglo XVI.%';
update public.images set execution_date_text = 'Siglo XVI (hacia 1570, según la Hermandad)',
  description = 'Autor no documentado. La Hermandad la sitúa a comienzos del último tercio del siglo XVI (hacia 1570); la tradición la atribuye a Gaspar Becerra (1566), sin prueba documental. ArteSacro (2016) y 21Noticias (2026) la datan a mediados del XVI. Busto tallado en un solo bloque; lágrimas, ojos de cristal y pelo natural añadidos en los siglos XVIII y XIX. En 1986 Francisco de Paula sustituyó el candelero y añadió articulaciones en brazos y hombros. Coronada canónicamente el 15 de junio de 1996 por el cardenal Carlos Amigo Vallejo.'
where entity_id = '7a5c0e05-2026-4012-8000-000000000a02' and execution_date_text = 'Mediados del siglo XVI';

update public.entities set summary = 'Paso del Señor de la Misericordia, con urna de metal plateado de Orfebrería Andaluza (2016).'
where id = '7a5c0e05-2026-4012-8000-000000000a05' and summary = 'Paso con la urna neobarroca de 1987 del Señor de la Misericordia.';
update public.steps set execution_date_text = null,
  description = 'Urna de metal bañado en plata (200 × 85 cm) de Manuel y Joaquín de los Ríos (Orfebrería Andaluza), de 2016, donada por un grupo de hermanos a iniciativa de la Juventud Cofrade (web de la Hermandad). 21Noticias (2026) habla de una urna neobarroca de 1987; la diferencia queda pendiente de aclarar.'
where entity_id = '7a5c0e05-2026-4012-8000-000000000a05' and execution_date_text = '1987';

update public.steps set description = 'Bordados en oro sobre terciopelo negro, con piezas de los siglos XVIII, XIX y XX (ArteSacro, 2016). La Hermandad atribuye la reforma del palio de 1912, costeada por Encarnación Osuna, al taller de Miguel del Olmo, y las caídas interiores a la bordadora Patrocinio López.'
where entity_id = '7a5c0e05-2026-4012-8000-000000000a06' and description like 'Bordados en oro sobre terciopelo negro%Autores no documentados.';

insert into public.source_links (source_id, entity_id, scope)
select '7a5c0e05-2026-4012-8000-00000000ca34'::uuid, v.e, 'Web oficial de la Hermandad de la Soledad de Alcalá del Río' from (values
  ('c6100000-0000-4000-8000-000000000005'::uuid), ('7a5c0e05-2026-4012-8000-000000000a02'::uuid),
  ('7a5c0e05-2026-4012-8000-000000000a05'::uuid), ('7a5c0e05-2026-4012-8000-000000000a06'::uuid)) v(e)
where not exists (select 1 from public.source_links x where x.source_id = '7a5c0e05-2026-4012-8000-00000000ca34' and x.entity_id = v.e);
