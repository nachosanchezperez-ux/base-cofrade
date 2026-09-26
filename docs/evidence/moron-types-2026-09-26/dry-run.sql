BEGIN ISOLATION LEVEL REPEATABLE READ;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='30s';
-- HC-016 Morón: only ten canonical brotherhood_types rows.
-- No DDL, migrations, RLS changes, manual timestamps, or main batch replay.
DO $remediation$
DECLARE
  target_ids uuid[] := ARRAY[
    'c0160037-0301-4000-8000-000000000001'::uuid,
    'c0160037-0302-4000-8000-000000000002'::uuid,
    'c0160037-0303-4000-8000-000000000003'::uuid,
    'c0160037-0304-4000-8000-000000000004'::uuid,
    'c0160037-0305-4000-8000-000000000005'::uuid,
    'c0160037-0306-4000-8000-000000000006'::uuid,
    'c0160037-0307-4000-8000-000000000007'::uuid,
    'c0160037-0308-4000-8000-000000000008'::uuid,
    'c0160037-0309-4000-8000-000000000009'::uuid,
    'c0160037-0310-4000-8000-000000000010'::uuid
  ];
  desired jsonb := '[{"id":"c0160037-0301-4000-8000-000000000001","slug":"soberano-moron-de-la-frontera","required":["Penitencia"]},{"id":"c0160037-0302-4000-8000-000000000002","slug":"borriquita-moron-de-la-frontera","required":["Penitencia"]},{"id":"c0160037-0303-4000-8000-000000000003","slug":"cautivo-moron-de-la-frontera","required":["Penitencia"]},{"id":"c0160037-0304-4000-8000-000000000004","slug":"calvario-moron-de-la-frontera","required":["Penitencia"]},{"id":"c0160037-0305-4000-8000-000000000005","slug":"buena-muerte-moron-de-la-frontera","required":["Penitencia"]},{"id":"c0160037-0306-4000-8000-000000000006","slug":"loreto-moron-de-la-frontera","required":["Penitencia","Sacramental"]},{"id":"c0160037-0307-4000-8000-000000000007","slug":"santa-cruz-moron-de-la-frontera","required":["Penitencia","Gloria"]},{"id":"c0160037-0308-4000-8000-000000000008","slug":"jesus-nazareno-moron-de-la-frontera","required":["Penitencia"]},{"id":"c0160037-0309-4000-8000-000000000009","slug":"santo-entierro-moron-de-la-frontera","required":["Penitencia"]},{"id":"c0160037-0310-4000-8000-000000000010","slug":"soledad-moron-de-la-frontera","required":["Penitencia"]}]'::jsonb;
  before_rows jsonb;
  before_entities jsonb;
  before_import jsonb;
  after_rows jsonb;
  n integer;
  changed integer := 0;
  needs_change integer;
BEGIN
  PERFORM entity_id FROM public.brotherhoods WHERE entity_id=ANY(target_ids) ORDER BY entity_id FOR UPDATE;
  IF (SELECT count(*) FROM public.brotherhoods WHERE entity_id=ANY(target_ids)) <> 10
     OR (SELECT count(*) FROM public.brotherhoods WHERE municipality_id='c0160037-0201-4000-8000-000000000001') <> 10
     OR EXISTS (SELECT 1 FROM public.brotherhoods WHERE entity_id=ANY(target_ids) AND municipality_id IS DISTINCT FROM 'c0160037-0201-4000-8000-000000000001'::uuid)
  THEN RAISE EXCEPTION 'moron_target_scope_failed'; END IF;
  IF (SELECT count(*) FROM public.entities e JOIN jsonb_to_recordset(desired) AS d(id uuid,slug text) ON e.id=d.id AND e.slug=d.slug WHERE e.status='published' AND e.entity_type='brotherhood') <> 10
  THEN RAISE EXCEPTION 'moron_identity_failed'; END IF;
  IF EXISTS (SELECT 1 FROM public.brotherhoods b JOIN jsonb_to_recordset(desired) AS d(id uuid,required text[]) ON d.id=b.entity_id WHERE b.brotherhood_types IS NULL OR NOT (b.brotherhood_types <@ d.required) OR array_position(b.brotherhood_types,NULL) IS NOT NULL OR cardinality(b.brotherhood_types)<>(SELECT count(DISTINCT t) FROM unnest(b.brotherhood_types) t))
  THEN RAISE EXCEPTION 'moron_unvalidated_existing_types'; END IF;
  SELECT count(*) INTO needs_change FROM public.brotherhoods b JOIN jsonb_to_recordset(desired) AS d(id uuid,required text[]) ON d.id=b.entity_id WHERE NOT (b.brotherhood_types @> d.required);
  IF needs_change NOT IN (0,10) THEN RAISE EXCEPTION 'moron_partial_drift'; END IF;
  SELECT jsonb_object_agg(entity_id,to_jsonb(b)) INTO before_rows FROM public.brotherhoods b;
  SELECT jsonb_object_agg(id,to_jsonb(e)) INTO before_entities FROM public.entities e;
  SELECT to_jsonb(i) INTO before_import FROM public.bulk_imports i WHERE id='c0160037-0000-4000-8000-000000000001';
  IF before_import->>'status'<>'completed' OR (before_import->>'applied_items')::int<>504 OR (before_import->>'failed_items')::int<>0
  THEN RAISE EXCEPTION 'moron_main_batch_not_completed'; END IF;

  -- soberano-moron-de-la-frontera
  UPDATE public.brotherhoods b
  SET brotherhood_types = b.brotherhood_types || ARRAY(
    SELECT t FROM unnest(ARRAY['Penitencia']::text[]) WITH ORDINALITY AS wanted(t,n)
    WHERE NOT (t = ANY(b.brotherhood_types)) ORDER BY wanted.n
  )
  WHERE entity_id = 'c0160037-0301-4000-8000-000000000001'::uuid
    AND NOT (brotherhood_types @> ARRAY['Penitencia']::text[]);
  GET DIAGNOSTICS n = ROW_COUNT;
  changed := changed + n;

  -- borriquita-moron-de-la-frontera
  UPDATE public.brotherhoods b
  SET brotherhood_types = b.brotherhood_types || ARRAY(
    SELECT t FROM unnest(ARRAY['Penitencia']::text[]) WITH ORDINALITY AS wanted(t,n)
    WHERE NOT (t = ANY(b.brotherhood_types)) ORDER BY wanted.n
  )
  WHERE entity_id = 'c0160037-0302-4000-8000-000000000002'::uuid
    AND NOT (brotherhood_types @> ARRAY['Penitencia']::text[]);
  GET DIAGNOSTICS n = ROW_COUNT;
  changed := changed + n;

  -- cautivo-moron-de-la-frontera
  UPDATE public.brotherhoods b
  SET brotherhood_types = b.brotherhood_types || ARRAY(
    SELECT t FROM unnest(ARRAY['Penitencia']::text[]) WITH ORDINALITY AS wanted(t,n)
    WHERE NOT (t = ANY(b.brotherhood_types)) ORDER BY wanted.n
  )
  WHERE entity_id = 'c0160037-0303-4000-8000-000000000003'::uuid
    AND NOT (brotherhood_types @> ARRAY['Penitencia']::text[]);
  GET DIAGNOSTICS n = ROW_COUNT;
  changed := changed + n;

  -- calvario-moron-de-la-frontera
  UPDATE public.brotherhoods b
  SET brotherhood_types = b.brotherhood_types || ARRAY(
    SELECT t FROM unnest(ARRAY['Penitencia']::text[]) WITH ORDINALITY AS wanted(t,n)
    WHERE NOT (t = ANY(b.brotherhood_types)) ORDER BY wanted.n
  )
  WHERE entity_id = 'c0160037-0304-4000-8000-000000000004'::uuid
    AND NOT (brotherhood_types @> ARRAY['Penitencia']::text[]);
  GET DIAGNOSTICS n = ROW_COUNT;
  changed := changed + n;

  -- buena-muerte-moron-de-la-frontera
  UPDATE public.brotherhoods b
  SET brotherhood_types = b.brotherhood_types || ARRAY(
    SELECT t FROM unnest(ARRAY['Penitencia']::text[]) WITH ORDINALITY AS wanted(t,n)
    WHERE NOT (t = ANY(b.brotherhood_types)) ORDER BY wanted.n
  )
  WHERE entity_id = 'c0160037-0305-4000-8000-000000000005'::uuid
    AND NOT (brotherhood_types @> ARRAY['Penitencia']::text[]);
  GET DIAGNOSTICS n = ROW_COUNT;
  changed := changed + n;

  -- loreto-moron-de-la-frontera
  UPDATE public.brotherhoods b
  SET brotherhood_types = b.brotherhood_types || ARRAY(
    SELECT t FROM unnest(ARRAY['Penitencia','Sacramental']::text[]) WITH ORDINALITY AS wanted(t,n)
    WHERE NOT (t = ANY(b.brotherhood_types)) ORDER BY wanted.n
  )
  WHERE entity_id = 'c0160037-0306-4000-8000-000000000006'::uuid
    AND NOT (brotherhood_types @> ARRAY['Penitencia','Sacramental']::text[]);
  GET DIAGNOSTICS n = ROW_COUNT;
  changed := changed + n;

  -- santa-cruz-moron-de-la-frontera
  UPDATE public.brotherhoods b
  SET brotherhood_types = b.brotherhood_types || ARRAY(
    SELECT t FROM unnest(ARRAY['Penitencia','Gloria']::text[]) WITH ORDINALITY AS wanted(t,n)
    WHERE NOT (t = ANY(b.brotherhood_types)) ORDER BY wanted.n
  )
  WHERE entity_id = 'c0160037-0307-4000-8000-000000000007'::uuid
    AND NOT (brotherhood_types @> ARRAY['Penitencia','Gloria']::text[]);
  GET DIAGNOSTICS n = ROW_COUNT;
  changed := changed + n;

  -- jesus-nazareno-moron-de-la-frontera
  UPDATE public.brotherhoods b
  SET brotherhood_types = b.brotherhood_types || ARRAY(
    SELECT t FROM unnest(ARRAY['Penitencia']::text[]) WITH ORDINALITY AS wanted(t,n)
    WHERE NOT (t = ANY(b.brotherhood_types)) ORDER BY wanted.n
  )
  WHERE entity_id = 'c0160037-0308-4000-8000-000000000008'::uuid
    AND NOT (brotherhood_types @> ARRAY['Penitencia']::text[]);
  GET DIAGNOSTICS n = ROW_COUNT;
  changed := changed + n;

  -- santo-entierro-moron-de-la-frontera
  UPDATE public.brotherhoods b
  SET brotherhood_types = b.brotherhood_types || ARRAY(
    SELECT t FROM unnest(ARRAY['Penitencia']::text[]) WITH ORDINALITY AS wanted(t,n)
    WHERE NOT (t = ANY(b.brotherhood_types)) ORDER BY wanted.n
  )
  WHERE entity_id = 'c0160037-0309-4000-8000-000000000009'::uuid
    AND NOT (brotherhood_types @> ARRAY['Penitencia']::text[]);
  GET DIAGNOSTICS n = ROW_COUNT;
  changed := changed + n;

  -- soledad-moron-de-la-frontera
  UPDATE public.brotherhoods b
  SET brotherhood_types = b.brotherhood_types || ARRAY(
    SELECT t FROM unnest(ARRAY['Penitencia']::text[]) WITH ORDINALITY AS wanted(t,n)
    WHERE NOT (t = ANY(b.brotherhood_types)) ORDER BY wanted.n
  )
  WHERE entity_id = 'c0160037-0310-4000-8000-000000000010'::uuid
    AND NOT (brotherhood_types @> ARRAY['Penitencia']::text[]);
  GET DIAGNOSTICS n = ROW_COUNT;
  changed := changed + n;

  IF changed <> needs_change THEN RAISE EXCEPTION 'moron_wrong_changed_count: % expected %',changed,needs_change; END IF;
  IF (SELECT count(*) FROM public.brotherhoods b JOIN jsonb_to_recordset(desired) AS d(id uuid,required text[]) ON d.id=b.entity_id WHERE b.brotherhood_types @> d.required AND b.brotherhood_types <@ d.required AND array_position(b.brotherhood_types,NULL) IS NULL AND cardinality(b.brotherhood_types)=(SELECT count(DISTINCT t) FROM unnest(b.brotherhood_types) t))<>10
  THEN RAISE EXCEPTION 'moron_types_qa_failed'; END IF;
  SELECT jsonb_object_agg(entity_id,to_jsonb(b)) INTO after_rows FROM public.brotherhoods b;
  IF EXISTS (
    SELECT 1 FROM jsonb_each(before_rows) old FULL JOIN jsonb_each(after_rows) fresh USING(key)
    WHERE old.key IS NULL OR fresh.key IS NULL OR
      CASE WHEN COALESCE(old.key,fresh.key)::uuid=ANY(target_ids)
      THEN old.value-'brotherhood_types' IS DISTINCT FROM fresh.value-'brotherhood_types'
        OR NOT ((fresh.value->'brotherhood_types') @> (old.value->'brotherhood_types'))
      ELSE old.value IS DISTINCT FROM fresh.value END
  ) THEN RAISE EXCEPTION 'moron_other_column_row_or_type_loss'; END IF;
  IF before_entities IS DISTINCT FROM (SELECT jsonb_object_agg(id,to_jsonb(e)) FROM public.entities e)
     OR before_import IS DISTINCT FROM (SELECT to_jsonb(i) FROM public.bulk_imports i WHERE id='c0160037-0000-4000-8000-000000000001')
  THEN RAISE EXCEPTION 'moron_entities_or_main_batch_modified'; END IF;
  PERFORM set_config('hilo_moron.qa',jsonb_build_object('targets',10,'changed_rows',changed,'penitencia',10,'loreto_sacramental',true,'santa_cruz_gloria',true,'other_rows_changed',0,'other_columns_changed',0,'lost_types',0,'duplicates',0,'null_types',0,'unexpected_types',0)::text,true);
END $remediation$;
SELECT current_setting('hilo_moron.qa')::jsonb AS transactional_qa;

ROLLBACK;
SELECT 'MORON_TYPES_DRY_RUN_OK_ROLLED_BACK' AS result;
