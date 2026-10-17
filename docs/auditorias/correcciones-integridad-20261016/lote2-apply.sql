-- Lote 2 · 17/10/2026 · autorizado por el propietario.
--   A) Publicar 9 relaciones entre fichas ya publicadas (retenidas «hasta el cierre
--      editorial de la Imagen»; las imágenes ya están publicadas).
--   B) Archivar Moriles (Córdoba, fuera del ámbito del proyecto): Hermandad, imagen
--      titular y salida del 19/09/2026. Su relación en revisión se archiva también.
-- Solo cambia `status`. Idempotente. Reversión exacta: lote2-rollback.sql.

do $$
declare
  n int;
begin
  -- A · Titulares: Los Rosales, Aznalcázar, El Castillo de las Guardas, Paradas, Sanlúcar la Mayor.
  update brotherhood_images set status = 'published'
   where id in ('9230b6eb-cf1d-404f-a8ba-902d40bf7611', 'c6f69335-84c1-4b3f-83c8-a621ea122848',
                'c9e93a12-1e91-487d-9d18-dfaeb246ff15', 'cc5943f8-39b7-4a86-935f-6c5689f460e1',
                '578e9990-74a5-4548-a16f-39746912fd80')
     and status in ('draft', 'review');
  -- A · Pasos: Divino Perdón y Desamparados del Santo Ángel (el paso ya lleva al titular de la misma Hermandad).
  update brotherhood_steps set status = 'published'
   where id in ('b4221000-0000-0000-0000-000000000002', 'bb41d993-0179-4b05-9dc1-7bc55ca8509f')
     and status = 'draft';
  -- A · Santa Elena y Santa Cruz de Abajo → paso de la Cruz de Abajo de Aznalcóllar.
  update image_steps set status = 'published'
   where id in ('ae95bec8-91e2-4524-a35c-b2857c064fd2', '9235cb9b-bf38-4143-8012-497e2810fb35')
     and status = 'review';

  -- B · Moriles.
  update outings set status = 'archived'
   where id = 'b2300000-0000-0000-0000-000000000001' and status = 'published';
  update brotherhood_images set status = 'archived'
   where id = 'ad945631-daab-48fa-a953-85d97eecb2d8' and status = 'review';
  update entities set status = 'archived'
   where id in ('3d77cf1c-9adb-4389-8def-bb034892dfd3', 'b148db62-a504-4600-9a52-2def66e5497a') and status = 'published';

  -- Comprobación del estado final.
  select count(*) into n from brotherhood_images
   where status = 'published' and id in ('9230b6eb-cf1d-404f-a8ba-902d40bf7611', 'c6f69335-84c1-4b3f-83c8-a621ea122848',
     'c9e93a12-1e91-487d-9d18-dfaeb246ff15', 'cc5943f8-39b7-4a86-935f-6c5689f460e1', '578e9990-74a5-4548-a16f-39746912fd80');
  if n <> 5 then raise exception 'Titulares publicados: % (esperados 5)', n; end if;
  select count(*) into n from brotherhood_steps
   where status = 'published' and id in ('b4221000-0000-0000-0000-000000000002', 'bb41d993-0179-4b05-9dc1-7bc55ca8509f');
  if n <> 2 then raise exception 'Pasos publicados: % (esperados 2)', n; end if;
  select count(*) into n from image_steps
   where status = 'published' and id in ('ae95bec8-91e2-4524-a35c-b2857c064fd2', '9235cb9b-bf38-4143-8012-497e2810fb35');
  if n <> 2 then raise exception 'Imagen↔Paso publicados: % (esperados 2)', n; end if;
  select count(*) into n from entities
   where status = 'published' and id in ('3d77cf1c-9adb-4389-8def-bb034892dfd3', 'b148db62-a504-4600-9a52-2def66e5497a');
  if n <> 0 then raise exception 'Moriles: % fichas siguen publicadas', n; end if;
  select count(*) into n from outings o join municipalities m on m.id = o.municipality_id
   where o.status = 'published' and m.province is distinct from 'Sevilla';
  if n <> 0 then raise exception 'Quedan % salidas publicadas fuera de la provincia de Sevilla', n; end if;
  select count(*) into n from brotherhoods b join entities e on e.id = b.entity_id join municipalities m on m.id = b.municipality_id
   where e.status = 'published' and m.province is distinct from 'Sevilla';
  if n <> 0 then raise exception 'Quedan % Hermandades publicadas fuera de la provincia de Sevilla', n; end if;

  raise notice 'Lote 2 (17/10/2026): estado final verificado.';
end $$;
