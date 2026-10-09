-- Evidencia del correctivo autorizado el 9/10/2026. NO REEJECUTAR.
BEGIN;
SET LOCAL lock_timeout='5s';
SELECT pg_advisory_xact_lock(hashtext('paz-image-steps-20261009'));
DO $check$ BEGIN
IF NOT EXISTS(SELECT 1 FROM brotherhood_images bi JOIN entities e ON e.id=bi.image_entity_id WHERE bi.brotherhood_entity_id='a4220000-0000-0000-0000-000000000003' AND bi.image_entity_id='2d1f1259-e92c-4094-97a2-ab98a9bb1a82' AND bi.status='published' AND e.entity_type='image' AND e.status='published') OR NOT EXISTS(SELECT 1 FROM brotherhood_steps bs JOIN entities e ON e.id=bs.step_entity_id WHERE bs.brotherhood_entity_id='a4220000-0000-0000-0000-000000000003' AND bs.step_entity_id='b4220000-0000-0000-0000-000000000003' AND bs.status='published' AND e.entity_type='step' AND e.status='published') THEN RAISE EXCEPTION 'Endpoint drift'; END IF;
IF EXISTS(SELECT 1 FROM image_steps WHERE image_entity_id='2d1f1259-e92c-4094-97a2-ab98a9bb1a82' AND step_entity_id='b4220000-0000-0000-0000-000000000003') THEN RAISE EXCEPTION 'Relation exists; stop, do not reapply'; END IF;
IF NOT EXISTS(SELECT 1 FROM brotherhood_images bi JOIN entities e ON e.id=bi.image_entity_id WHERE bi.brotherhood_entity_id='a4220000-0000-0000-0000-000000000003' AND bi.image_entity_id='55663ce8-b243-477b-bb6e-54cec1ac980f' AND bi.status='published' AND e.entity_type='image' AND e.status='published') OR NOT EXISTS(SELECT 1 FROM brotherhood_steps bs JOIN entities e ON e.id=bs.step_entity_id WHERE bs.brotherhood_entity_id='a4220000-0000-0000-0000-000000000003' AND bs.step_entity_id='0cbcaf53-900b-4cc5-a889-ffc29544adbe' AND bs.status='published' AND e.entity_type='step' AND e.status='published') THEN RAISE EXCEPTION 'Endpoint drift'; END IF;
IF EXISTS(SELECT 1 FROM image_steps WHERE image_entity_id='55663ce8-b243-477b-bb6e-54cec1ac980f' AND step_entity_id='0cbcaf53-900b-4cc5-a889-ffc29544adbe') THEN RAISE EXCEPTION 'Relation exists; stop, do not reapply'; END IF;
IF NOT EXISTS(SELECT 1 FROM brotherhood_images bi JOIN entities e ON e.id=bi.image_entity_id WHERE bi.brotherhood_entity_id='a4220000-0000-0000-0000-000000000003' AND bi.image_entity_id='07f7a00b-2339-48d3-a768-122ad0767de1' AND bi.status='published' AND e.entity_type='image' AND e.status='published') OR NOT EXISTS(SELECT 1 FROM brotherhood_steps bs JOIN entities e ON e.id=bs.step_entity_id WHERE bs.brotherhood_entity_id='a4220000-0000-0000-0000-000000000003' AND bs.step_entity_id='6b14bec1-bc08-47fa-a821-ab80924bd08f' AND bs.status='published' AND e.entity_type='step' AND e.status='published') THEN RAISE EXCEPTION 'Endpoint drift'; END IF;
IF EXISTS(SELECT 1 FROM image_steps WHERE image_entity_id='07f7a00b-2339-48d3-a768-122ad0767de1' AND step_entity_id='6b14bec1-bc08-47fa-a821-ab80924bd08f') THEN RAISE EXCEPTION 'Relation exists; stop, do not reapply'; END IF;
END $check$;
INSERT INTO image_steps(id,image_entity_id,step_entity_id,relation_type,status,notes) VALUES ('0275e09f-2cae-43bf-bcd0-a52b3eda73f5','2d1f1259-e92c-4094-97a2-ab98a9bb1a82','b4220000-0000-0000-0000-000000000003','processes_on','published','Vinculación procesional documentada por la Hermandad de la Paz. Corrección relacional autorizada el 9/10/2026; sin fecha inicial acreditada.');
INSERT INTO source_links(id,source_id,image_step_id,scope,notes) VALUES ('851f13fe-1003-4801-9489-70f66728ce10','521aecc4-22fa-4410-9226-8151ed9849a8','0275e09f-2cae-43bf-bcd0-a52b3eda73f5','Relación Imagen–Paso','Fuente oficial existente reutilizada. Corrección relacional de La Paz · 9/10/2026.');
INSERT INTO image_steps(id,image_entity_id,step_entity_id,relation_type,status,notes) VALUES ('d019dd0c-47f5-401a-b1a2-1b67f476b3e6','55663ce8-b243-477b-bb6e-54cec1ac980f','0cbcaf53-900b-4cc5-a889-ffc29544adbe','processes_on','published','Vinculación procesional documentada por la Hermandad de la Paz. Corrección relacional autorizada el 9/10/2026; sin fecha inicial acreditada.');
INSERT INTO source_links(id,source_id,image_step_id,scope,notes) VALUES ('d9fb1d50-7dc3-4311-9d68-aa6a5f373988','af15eca4-1f2d-4f00-922f-bf9733a70147','d019dd0c-47f5-401a-b1a2-1b67f476b3e6','Relación Imagen–Paso','Fuente oficial existente reutilizada. Corrección relacional de La Paz · 9/10/2026.');
INSERT INTO image_steps(id,image_entity_id,step_entity_id,relation_type,status,notes) VALUES ('d0884b85-02d5-4d32-97ad-7daea82639d4','07f7a00b-2339-48d3-a768-122ad0767de1','6b14bec1-bc08-47fa-a821-ab80924bd08f','processes_on','published','Vinculación procesional documentada por la Hermandad de la Paz. Corrección relacional autorizada el 9/10/2026; sin fecha inicial acreditada.');
INSERT INTO source_links(id,source_id,image_step_id,scope,notes) VALUES ('0667ee76-d021-4660-9047-ee9f0b191a30','41656a4c-c6df-4947-9996-cf4a00aa828c','d0884b85-02d5-4d32-97ad-7daea82639d4','Relación Imagen–Paso','Fuente oficial existente reutilizada. Corrección relacional de La Paz · 9/10/2026.');
-- Insertar después del DML y antes de ROLLBACK/COMMIT en la misma transacción.
DO $hc016_types$
DECLARE
  target_ids uuid[] := ARRAY['a4220000-0000-0000-0000-000000000003']::uuid[];
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

DO $preserve$ BEGIN
IF (SELECT md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]')) FROM cults t WHERE brotherhood_entity_id='a4220000-0000-0000-0000-000000000003') <> '13f7228f865a56c99dc1102b636c4147' THEN RAISE EXCEPTION 'Preservation failed cults'; END IF;
IF (SELECT md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]')) FROM outings t WHERE brotherhood_entity_id='a4220000-0000-0000-0000-000000000003') <> '2e291cc5c9af99dcd0efa02a86f043d4' THEN RAISE EXCEPTION 'Preservation failed outings'; END IF;
IF (SELECT md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY id)::text,'[]')) FROM music_accompaniment_periods t WHERE brotherhood_entity_id='a4220000-0000-0000-0000-000000000003') <> '67472110b9861c6515d767ee4b2d4ec1' THEN RAISE EXCEPTION 'Preservation failed music_accompaniment_periods'; END IF;
IF (SELECT brotherhood_types FROM brotherhoods WHERE entity_id='a4220000-0000-0000-0000-000000000003') IS DISTINCT FROM ARRAY['Penitencia','Sacramental']::text[] THEN RAISE EXCEPTION 'Type drift'; END IF;
END $preserve$;
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id IN ('a4220000-0000-0000-0000-000000000003','2d1f1259-e92c-4094-97a2-ab98a9bb1a82','b4220000-0000-0000-0000-000000000003','55663ce8-b243-477b-bb6e-54cec1ac980f','0cbcaf53-900b-4cc5-a889-ffc29544adbe','07f7a00b-2339-48d3-a768-122ad0767de1','6b14bec1-bc08-47fa-a821-ab80924bd08f');
INSERT INTO audit_log(actor_label,action_type,object_type,object_id,entity_id,summary,changed_fields) VALUES ('Codex · orden directa 9/10/2026','link','brotherhood','a4220000-0000-0000-0000-000000000003','a4220000-0000-0000-0000-000000000003','La Paz: tres relaciones Imagen–Paso y tres enlaces de fuentes, sin reaplicar lotes anteriores.','{"operation":"PAZ-IMAGE-STEPS-20261009","image_steps":3,"source_links":3}'::jsonb);
SELECT 'PAZ_IMAGE_STEPS_PASS' result,count(*) relations FROM image_steps WHERE id IN ('0275e09f-2cae-43bf-bcd0-a52b3eda73f5','d019dd0c-47f5-401a-b1a2-1b67f476b3e6','d0884b85-02d5-4d32-97ad-7daea82639d4');
ROLLBACK;
