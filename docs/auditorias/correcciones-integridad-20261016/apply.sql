-- Correcciones de integridad · 16/10/2026 · autorizadas por el propietario.
-- Origen: informe de la Tarea 07 (docs/auditorias/integridad-tarea07-20261012).
--
-- Solo cambia `status` de filas concretas y el destino de cuatro enlaces de fuente.
-- No borra nada. Idempotente: si ya está aplicado, no cambia nada y lo indica.
-- Reversión exacta: rollback.sql.

do $$
declare
  n int;
begin
  -- 1 · Cigarreras · Jueves Santo 2026 duplicada.
  --     Se conserva 195e7c51 (salida desde Los Terceros por obras, fuente oficial de la
  --     Hermandad, serie anual y tramo de Sagrada Columna y Azotes). Se archiva ec8adb13
  --     (origen equivocado e incluía al Cristo de la Púrpura, que no procesiona).
  --     Sus dos fuentes pasan a la salida conservada.
  update source_links set outing_id = '195e7c51-4e9d-4a1e-a653-2a264b26b33c'
   where id in ('378e6785-9769-4b42-b87b-ba749e7b2798', '5741a20d-c368-43fb-9cd8-9601a5232944')
     and outing_id = 'ec8adb13-766f-43bb-9d65-f9273d8679fa';
  update outing_music_assignments set status = 'archived'
   where id in ('57b3e622-e91e-d751-f594-ef42e2844a18', '63e46c8e-aea8-5bfa-9958-aabead81fb86') and status = 'published';
  update outing_music_positions set status = 'archived'
   where id in ('74cc02a9-8aa9-bdae-b640-23c38e94ae97', '1452b95e-80dd-b326-709d-cf621ce842e6') and status = 'published';
  update outings set status = 'archived'
   where id = 'ec8adb13-766f-43bb-9d65-f9273d8679fa' and status = 'published';

  -- 2 · El Cachorro: relaciones Imagen ↔ Paso repetidas. Se conservan las canónicas
  --     con nota (6978634d, a4895ec2) y se archivan las repetidas sin nota.
  update image_steps set status = 'archived'
   where id in ('ec160000-0000-4000-8000-000000000009', 'ec160000-0000-4000-8000-000000000010') and status = 'published';

  -- 3 · San Esteban: el periodo «2009–2020» contradice al acreditado «2009–2026»
  --     (dos fuentes y relevo de Santa Ana en 2027). Se archiva el de 2020.
  update music_accompaniment_periods set status = 'archived'
   where id = 'a9562180-be62-4a83-bf1e-b7651795cbc3' and status = 'published';

  -- 4 · Valvanera: el periodo 2026 de Las Nieves repite el vigente «desde 2014».
  --     Se archiva y su fuente (aportación 2026) pasa al periodo conservado.
  update source_links set music_accompaniment_period_id = '6f5a60f6-6b7d-45a5-b1cf-96ca46b09ff1'
   where id = '2a54ba3b-dedc-43f4-8c9c-97b7c86e08b2'
     and music_accompaniment_period_id = '8f1650c1-b57c-44ce-b893-acdc87460738';
  update music_accompaniment_periods set status = 'archived'
   where id = '8f1650c1-b57c-44ce-b893-acdc87460738' and status = 'published';

  -- 5 · Confalón de Écija: el periodo 2026 (sin fuente) está contenido en «2020–2026».
  update music_accompaniment_periods set status = 'archived'
   where id = 'c0160036-1313-4000-8000-000000000013' and status = 'published';

  -- 6 · Montserrat: titular (Cristo de la Conversión) y paso de palio vinculados en
  --     borrador entre fichas ya publicadas. Se publican.
  update brotherhood_images set status = 'published'
   where id = '4b8fd019-ae5f-4c11-9735-fc2a1554b759' and status = 'draft';
  update brotherhood_steps set status = 'published'
   where id = '3fef1b12-b050-40f4-9495-3c9b997db59a' and status = 'draft';

  -- Comprobación del estado final (aborta todo si algo no cuadra).
  select count(*) into n from outings
   where status = 'published' and brotherhood_entity_id = 'b2000000-0000-0000-0000-000000000001' and outing_date = '2026-04-02';
  if n <> 1 then raise exception 'Cigarreras: % salidas publicadas el 02/04/2026 (esperada 1)', n; end if;

  select count(*) into n from source_links where outing_id = '195e7c51-4e9d-4a1e-a653-2a264b26b33c';
  if n <> 3 then raise exception 'Cigarreras: % fuentes en la salida conservada (esperadas 3)', n; end if;

  select count(*) into n from image_steps
   where status = 'published' and date_to is null
     and (image_entity_id, step_entity_id) in (('68cf0ffb-0497-4365-9ab0-1fdcf3dabf94', 'c127626e-2015-4d8d-b657-7a658ff0ea19'),
                                               ('dd65020c-8232-486e-b802-c2b5c7bde277', '2814d4d4-5adf-4d07-982f-2c7772802a6d'));
  if n <> 2 then raise exception 'Cachorro: % relaciones vigentes (esperadas 2, una por pareja)', n; end if;

  select count(*) into n from music_accompaniment_periods
   where status = 'published' and id in ('18ca9f4a-7c87-4f2d-b5eb-27b6bdd4734c', '6f5a60f6-6b7d-45a5-b1cf-96ca46b09ff1', 'a5cdcae8-f2d2-4b6b-9f2a-1acfd2c833df');
  if n <> 3 then raise exception 'Periodos conservados publicados: % (esperados 3)', n; end if;

  select count(*) into n from music_accompaniment_periods
   where status = 'published' and id in ('a9562180-be62-4a83-bf1e-b7651795cbc3', '8f1650c1-b57c-44ce-b893-acdc87460738', 'c0160036-1313-4000-8000-000000000013');
  if n <> 0 then raise exception 'Periodos duplicados aún publicados: %', n; end if;

  select count(*) into n from source_links where music_accompaniment_period_id = '6f5a60f6-6b7d-45a5-b1cf-96ca46b09ff1';
  if n <> 2 then raise exception 'Valvanera: % fuentes en el periodo conservado (esperadas 2)', n; end if;

  select count(*) into n from brotherhood_images where id = '4b8fd019-ae5f-4c11-9735-fc2a1554b759' and status = 'published';
  if n <> 1 then raise exception 'Montserrat: titular no publicado'; end if;
  select count(*) into n from brotherhood_steps where id = '3fef1b12-b050-40f4-9495-3c9b997db59a' and status = 'published';
  if n <> 1 then raise exception 'Montserrat: paso de palio no publicado'; end if;

  raise notice 'Correcciones de integridad 16/10/2026: estado final verificado.';
end $$;
