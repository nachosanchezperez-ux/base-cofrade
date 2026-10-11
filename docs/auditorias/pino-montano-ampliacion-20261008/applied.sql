-- HISTORICAL EVIDENCE: already applied. Do not reapply.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='45s';
SELECT pg_advisory_xact_lock(hashtext('hilo-pino-montano-20261008'));
INSERT INTO public.entities (id,entity_type,name,slug,summary,status) VALUES ('b2082026-1008-4a91-8d62-000000000001','march','Amor y Esperanza','amor-y-esperanza-alejandro-blanco','Marcha dedicada al hermanamiento entre Pino Montano y la Macarena.','published');
INSERT INTO public.marches (entity_id,music_type,premiere_date_text,premiered_by_band_entity_id,description,notes) VALUES ('b2082026-1008-4a91-8d62-000000000001','Banda de Música','2015','c6000000-0000-4000-8000-000000000001','Obra de Alejandro Blanco Hernández, con letra de Luis Castejón López, estrenada por la Banda de la Cruz Roja en 2015 para conmemorar el hermanamiento de ambas corporaciones.','La historia oficial fecha el estreno, sin precisar el día ni la fecha de composición.');
INSERT INTO public.march_authors (id,march_entity_id,agent_entity_id,author_role,status) VALUES ('b2082026-1008-4a91-8d62-000000000002','b2082026-1008-4a91-8d62-000000000001','bc4a2ac0-cf0e-4290-9232-bf70faf37f52','composer','published');
INSERT INTO public.march_dedications (id,march_entity_id,dedicatee_entity_id,dedication_type,dedication_text,status) VALUES ('b2082026-1008-4a91-8d62-000000000003','b2082026-1008-4a91-8d62-000000000001','a4220000-0000-0000-0000-000000000001','dedicated_to','Hermanamiento de Pino Montano con la Hermandad de la Macarena','published');
INSERT INTO public.source_links (id,source_id,entity_id,scope,notes) VALUES ('b2082026-1008-4a91-8d62-000000000004','16b06e33-22ea-4b31-b25b-02d8db6bf25d','b2082026-1008-4a91-8d62-000000000001','Ampliación documental · Pino Montano','Contraste con la web oficial el 8 de octubre de 2026.');
INSERT INTO public.source_links (id,source_id,march_dedication_id,scope,notes) VALUES ('b2082026-1008-4a91-8d62-000000000005','16b06e33-22ea-4b31-b25b-02d8db6bf25d','b2082026-1008-4a91-8d62-000000000003','Ampliación documental · Pino Montano','Contraste con la web oficial el 8 de octubre de 2026.');
INSERT INTO public.entities (id,entity_type,name,slug,summary,status) VALUES ('b2082026-1008-4a91-8d62-000000000006','heritage_asset','Miniatura de la Esperanza Macarena del palio del Amor','miniatura-macarena-palio-amor-pino-montano','Réplica para la delantera del palio, realizada por Fernando Marmolejo y terminada por sus hijos. Fue donada por la Hermandad de la Macarena.','published');
INSERT INTO public.heritage_assets (entity_id,parent_entity_id,asset_type,description,date_from_text,materials,usage_text,notes,display_order) VALUES ('b2082026-1008-4a91-8d62-000000000006','a4220000-0000-0000-0000-000000000001','Miniatura','Réplica para la delantera del palio, realizada por Fernando Marmolejo y terminada por sus hijos. Fue donada por la Hermandad de la Macarena.','Estrenada en 2008','Plata y marfil','Paso de palio de María Santísima del Amor','Pieza documentada históricamente; la fuente no acredita su situación dentro del proyecto de renovación aprobado en 2025.',5);
INSERT INTO public.entity_relations (id,source_entity_id,relation_type,target_entity_id,notes,status) VALUES ('b2082026-1008-4a91-8d62-000000000007','b2082026-1008-4a91-8d62-000000000006','part_of','33d9e835-056f-4801-8cc2-773c0fc69ce8','Vinculación histórica documentada en el año de estreno.','published');
INSERT INTO public.source_links (id,source_id,entity_id,scope,notes) VALUES ('b2082026-1008-4a91-8d62-000000000008','16b06e33-22ea-4b31-b25b-02d8db6bf25d','b2082026-1008-4a91-8d62-000000000006','Ampliación documental · Pino Montano','Contraste con la web oficial el 8 de octubre de 2026.');
INSERT INTO public.source_links (id,source_id,entity_relation_id,scope,notes) VALUES ('b2082026-1008-4a91-8d62-000000000009','16b06e33-22ea-4b31-b25b-02d8db6bf25d','b2082026-1008-4a91-8d62-000000000007','Ampliación documental · Pino Montano','Contraste con la web oficial el 8 de octubre de 2026.');
INSERT INTO public.entities (id,entity_type,name,slug,summary,status) VALUES ('b2082026-1008-4a91-8d62-000000000010','heritage_asset','Candelabros de cola del palio de María Santísima del Amor','candelabros-cola-palio-amor-pino-montano','Candelabros de cola realizados en el taller de Emilio Méndez para el palio de la Virgen del Amor.','published');
INSERT INTO public.heritage_assets (entity_id,parent_entity_id,asset_type,description,date_from_text,materials,usage_text,notes,display_order) VALUES ('b2082026-1008-4a91-8d62-000000000010','a4220000-0000-0000-0000-000000000001','Candelabros','Candelabros de cola realizados en el taller de Emilio Méndez para el palio de la Virgen del Amor.','Estrenados en 2009',NULL,'Paso de palio de María Santísima del Amor','Pieza documentada históricamente; la fuente no acredita su situación dentro del proyecto de renovación aprobado en 2025.',6);
INSERT INTO public.entity_relations (id,source_entity_id,relation_type,target_entity_id,notes,status) VALUES ('b2082026-1008-4a91-8d62-000000000011','b2082026-1008-4a91-8d62-000000000010','part_of','33d9e835-056f-4801-8cc2-773c0fc69ce8','Vinculación histórica documentada en el año de estreno.','published');
INSERT INTO public.source_links (id,source_id,entity_id,scope,notes) VALUES ('b2082026-1008-4a91-8d62-000000000012','16b06e33-22ea-4b31-b25b-02d8db6bf25d','b2082026-1008-4a91-8d62-000000000010','Ampliación documental · Pino Montano','Contraste con la web oficial el 8 de octubre de 2026.');
INSERT INTO public.source_links (id,source_id,entity_relation_id,scope,notes) VALUES ('b2082026-1008-4a91-8d62-000000000013','16b06e33-22ea-4b31-b25b-02d8db6bf25d','b2082026-1008-4a91-8d62-000000000011','Ampliación documental · Pino Montano','Contraste con la web oficial el 8 de octubre de 2026.');
DO $u$ BEGIN UPDATE public.images SET height_cm=165,dimensions_text='1,65 m de altura',technique='Talla en madera y policromía al óleo',polychromy='Al óleo',anatomical_type='Candelero',iconography='Virgen Dolorosa.' WHERE entity_id='4da6958b-fc11-43f4-bbd5-7fac291fae93' AND height_cm IS NOT DISTINCT FROM NULL AND dimensions_text IS NOT DISTINCT FROM NULL AND technique IS NOT DISTINCT FROM NULL AND polychromy IS NOT DISTINCT FROM NULL AND anatomical_type IS NOT DISTINCT FROM NULL AND iconography IS NOT DISTINCT FROM NULL; IF NOT FOUND THEN RAISE EXCEPTION 'Concurrent drift 4da6958b-fc11-43f4-bbd5-7fac291fae93'; END IF; END $u$;
INSERT INTO public.source_links (id,source_id,entity_id,scope,notes) VALUES ('b2082026-1008-4a91-8d62-000000000014','ca3bc6d5-7d89-471f-938f-3cd73337bbae','4da6958b-fc11-43f4-bbd5-7fac291fae93','Ampliación documental · Pino Montano','Contraste con la web oficial el 8 de octubre de 2026.');
DO $u$ BEGIN UPDATE public.images SET height_cm=175,dimensions_text='1,75 m de altura',technique='Talla en madera y policromía al óleo',polychromy='Al óleo',anatomical_type='Cuerpo anatómico completo',iconography='Jesús apresado en el huerto de los Olivos, conducido por un sayón.' WHERE entity_id='f4700000-0000-0000-0000-000000000003' AND height_cm IS NOT DISTINCT FROM NULL AND dimensions_text IS NOT DISTINCT FROM NULL AND technique IS NOT DISTINCT FROM NULL AND polychromy IS NOT DISTINCT FROM NULL AND anatomical_type IS NOT DISTINCT FROM NULL AND iconography IS NOT DISTINCT FROM NULL; IF NOT FOUND THEN RAISE EXCEPTION 'Concurrent drift f4700000-0000-0000-0000-000000000003'; END IF; END $u$;
INSERT INTO public.source_links (id,source_id,entity_id,scope,notes) VALUES ('b2082026-1008-4a91-8d62-000000000015','a615caf8-733e-493f-82de-57b87b103d66','f4700000-0000-0000-0000-000000000003','Ampliación documental · Pino Montano','Contraste con la web oficial el 8 de octubre de 2026.');
-- Insertar después del DML y antes de ROLLBACK/COMMIT en la misma transacción.
DO $hc016_types$
DECLARE
  target_ids uuid[] := ARRAY['a4220000-0000-0000-0000-000000000001']::uuid[];
  allowed_types text[] := ARRAY['Penitencia', 'Gloria', 'Sacramental', 'Agrupación Parroquial']::text[];
BEGIN
  PERFORM entity_id FROM public.brotherhoods WHERE entity_id = ANY(target_ids) ORDER BY entity_id FOR SHARE;
  IF (SELECT count(*) FROM public.brotherhoods WHERE entity_id = ANY(target_ids)) <> cardinality(target_ids) THEN
    RAISE EXCEPTION 'HC016_SCOPE: faltan Hermandades del universo explícito';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.brotherhoods b WHERE b.entity_id = ANY(target_ids)
      AND (b.brotherhood_types IS NULL OR cardinality(b.brotherhood_types) = 0
        OR array_ndims(b.brotherhood_types) <> 1
        OR NOT (b.brotherhood_types <@ allowed_types)
        OR EXISTS (SELECT 1 FROM unnest(b.brotherhood_types) t WHERE t IS NULL)
        OR cardinality(b.brotherhood_types) <> (SELECT count(DISTINCT t) FROM unnest(b.brotherhood_types) t))
  ) THEN
    RAISE EXCEPTION 'HC016_TYPES: tipos vacíos, no canónicos, NULL o duplicados';
  END IF;
END
$hc016_types$;
DO $v$ BEGIN IF (select brotherhood_types from brotherhoods where entity_id='a4220000-0000-0000-0000-000000000001') IS DISTINCT FROM ARRAY['Penitencia']::text[] THEN RAISE EXCEPTION 'types drift'; END IF; END $v$;
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id IN ('a4220000-0000-0000-0000-000000000001','f4700000-0000-0000-0000-000000000003','4da6958b-fc11-43f4-bbd5-7fac291fae93');
INSERT INTO audit_log(actor_label,action_type,object_type,object_id,entity_id,summary,changed_fields) VALUES ('Codex · ampliación web oficial 8/10/2026','update','brotherhood','a4220000-0000-0000-0000-000000000001','a4220000-0000-0000-0000-000000000001','Pino Montano: Amor y Esperanza, dos piezas históricas y datos técnicos de titulares.','{"operation":"PINO-AMPLIACION-20261008","operations":20,"preserved":{"music":"e5085aa139a2f3139ca1dc7f51207d1d","outings":"457e7ca85ab3ca0895b3869518c29488"}}'::jsonb);
SELECT 'PINO_AMPLIACION_OK' AS result;
ROLLBACK;
