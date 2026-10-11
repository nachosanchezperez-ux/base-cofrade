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
