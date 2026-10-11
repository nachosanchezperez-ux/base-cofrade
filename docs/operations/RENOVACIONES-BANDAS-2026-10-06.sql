-- Hilo Cofrade · Renovaciones de bandas · 6 de octubre de 2026.
-- Operación editorial DML, fuera de la cadena de migraciones.
-- Cinco periodos existentes; cuatro actualizaciones y ninguna relación nueva.
-- Ensayo: sustituir únicamente el COMMIT final por ROLLBACK.
-- La huella de cada periodo bloquea reejecuciones y cambios concurrentes no reconciliados.

BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

DO $operation$
DECLARE
  v_specs constant jsonb := '[{"id":"79511741-cf06-4d8e-8640-5c89e91101a2","expected_hash":"520f6bc5c459613530d31947b3cd8c9b","patch":{"notes":"La guía de 2026 acredita este acompañamiento. Renovación para el Lunes Santo de 2027 tras el palio de Nuestra Señora del Amor y Sacrificio, comunicada a Hilo Cofrade el 6 de octubre de 2026. El plazo completo del contrato no está documentado."}},{"id":"9d5bab12-c743-4fde-a2cb-93e6c00137eb","expected_hash":"4d5decf36c093d3e09fe1f5b6e2954b5","patch":{}},{"id":"a6a2fef0-2c70-4d1b-90ac-4915ebfbc4f1","expected_hash":"37925d14a55efce99fa0dea6c93c1107","patch":{"notes":"Acompañamiento musical renovado para los Miércoles Santos de 2027, 2028 y 2029. No implica pertenencia ni asociación institucional con el Baratillo.\n\nLa Hermandad del Baratillo ratificó esta continuidad en su comunicado del 24 de septiembre de 2026."}},{"id":"e8cd8c55-00e0-4e8b-826a-f046ddf45df4","expected_hash":"d956f3d6fb52a88b46ec019e49596927","patch":{"year_to":2029,"date_to_text":"Hasta el Miércoles Santo de 2029","notes":"Acompañamiento ininterrumpido desde 1980. Es un contrato musical y no una asociación institucional con el Baratillo.\n\nRenovación por tres años más, hasta 2029, anunciada por la formación el 24 de septiembre de 2026. El Carmen de Salteras continuará tras el palio de María Santísima de la Caridad en su Soledad."}},{"id":"13ddbd73-ac98-4d1d-871e-34ed8e77bcd2","expected_hash":"8ee88dff26af7956c2f1b83f29f33212","patch":{"notes":"La Agrupación Musical Juvenil María Santísima de las Angustias Coronada (Los Gitanos Juvenil) renueva el acompañamiento de la Cruz de Guía del Baratillo para el Miércoles Santo de 2027. La Hermandad ratificó la continuidad en su comunicado del 24 de septiembre de 2026."}}]'::jsonb;
  v_sources constant jsonb := '[{"name":"El Baratillo · renovación del acompañamiento musical","url":"https://hermandadelbaratillo.es/renovacion-del-acompanamiento-musical/","source_type":"Web oficial","publisher":"Hermandad del Baratillo","publication_date":"2026-09-24","notes":"Ratificación de las tres formaciones para la próxima estación de penitencia: Los Gitanos Juvenil en la Cruz de Guía, El Sol tras el misterio y El Carmen de Salteras tras el palio. La referencia a la próxima estación corresponde a 2027; este comunicado no precisa el plazo total de cada contrato.","period_ids":["a6a2fef0-2c70-4d1b-90ac-4915ebfbc4f1","e8cd8c55-00e0-4e8b-826a-f046ddf45df4","13ddbd73-ac98-4d1d-871e-34ed8e77bcd2"],"scope":"Renovación del acompañamiento musical para 2027"},{"name":"El Carmen de Salteras · renovación con el Baratillo hasta 2029","url":"https://x.com/CarmenDSalteras/status/2103055199698923564/photo/1","source_type":"Red social oficial","publisher":"Sociedad Filarmónica Nuestra Señora del Carmen de Salteras","publication_date":"2026-09-24","notes":"Anuncio oficial de la formación: renovación por tres años más, hasta 2029, para el acompañamiento del Miércoles Santo.","period_ids":["e8cd8c55-00e0-4e8b-826a-f046ddf45df4"],"scope":"Duración de la renovación hasta 2029"},{"name":"Confirmación editorial · renovación de Las Cigarreras con Santa Cruz de Dos Hermanas para 2027","url":null,"source_type":"Información editorial directa","publisher":"Hilo Cofrade · información facilitada por su editor","publication_date":"2026-10-06","notes":"Renovación comunicada directamente por el editor de Hilo Cofrade el 6 de octubre de 2026. Se conserva como fuente editorial: no se ha recuperado el comunicado público ni se fija la duración contractual. La guía de Dos Hermanas de 2026 acredita el acompañamiento previo, no esta renovación.","period_ids":["79511741-cf06-4d8e-8640-5c89e91101a2"],"scope":"Renovación editorialmente confirmada para el Lunes Santo de 2027"}]'::jsonb;
  v_spec jsonb;
  v_source jsonb;
  v_target text;
  v_before public.music_accompaniment_periods%ROWTYPE;
  v_after public.music_accompaniment_periods%ROWTYPE;
  v_source_id uuid;
  v_count integer;
  v_updated integer := 0;
  v_inserted_sources integer := 0;
  v_inserted_links integer := 0;
  v_original_links jsonb;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended('hilo:renovaciones:2026-10-06',0));

  IF (SELECT count(*) FROM public.brotherhoods h JOIN public.entities e ON e.id=h.entity_id
      WHERE h.entity_id IN ('10000000-0000-0000-0000-000000000001','a4220000-0000-0000-0000-000000000003','1f517f03-4ee7-4b29-8eeb-d2732ba01095')
      AND e.entity_type='brotherhood' AND e.status='published'
      AND h.brotherhood_types @> ARRAY['Penitencia']::text[]) <> 3
  THEN RAISE EXCEPTION 'Identidades o clasificación de Hermandad distintas del preflight'; END IF;
  IF (SELECT count(*) FROM public.music_accompaniment_periods p
      JOIN public.entities b ON b.id=p.band_entity_id AND b.entity_type='band' AND b.status='published'
      LEFT JOIN public.entities s ON s.id=p.step_entity_id
      WHERE p.id IN ('79511741-cf06-4d8e-8640-5c89e91101a2','9d5bab12-c743-4fde-a2cb-93e6c00137eb','a6a2fef0-2c70-4d1b-90ac-4915ebfbc4f1','e8cd8c55-00e0-4e8b-826a-f046ddf45df4','13ddbd73-ac98-4d1d-871e-34ed8e77bcd2') AND p.status='published' AND p.is_current
        AND (p.step_entity_id IS NULL OR (s.entity_type='step' AND s.status='published'))) <> 5
  THEN RAISE EXCEPTION 'Identidad o publicación de Banda/Paso distinta del preflight'; END IF;
  IF (SELECT count(*) FROM public.music_accompaniment_periods) <> 551
  THEN RAISE EXCEPTION 'El conjunto de periodos ha cambiado; reconciliar'; END IF;

  SELECT coalesce(jsonb_agg(to_jsonb(sl) ORDER BY sl.id),'[]'::jsonb)
  INTO v_original_links
  FROM public.source_links sl
  WHERE sl.music_accompaniment_period_id IN ('79511741-cf06-4d8e-8640-5c89e91101a2','9d5bab12-c743-4fde-a2cb-93e6c00137eb','a6a2fef0-2c70-4d1b-90ac-4915ebfbc4f1','e8cd8c55-00e0-4e8b-826a-f046ddf45df4','13ddbd73-ac98-4d1d-871e-34ed8e77bcd2');

  FOR v_spec IN SELECT value FROM jsonb_array_elements(v_specs) ORDER BY value->>'id' LOOP
    SELECT * INTO STRICT v_before FROM public.music_accompaniment_periods
    WHERE id=(v_spec->>'id')::uuid FOR UPDATE;
    IF md5(to_jsonb(v_before)::text) <> v_spec->>'expected_hash'
    THEN RAISE EXCEPTION 'Periodo % distinto del preflight; detener y reconciliar',v_before.id; END IF;

    IF v_spec->'patch' <> '{}'::jsonb THEN
      UPDATE public.music_accompaniment_periods
      SET notes = v_spec->'patch'->>'notes',
          year_to = CASE WHEN v_spec->'patch' ? 'year_to'
            THEN (v_spec->'patch'->>'year_to')::integer ELSE v_before.year_to END,
          date_to_text = CASE WHEN v_spec->'patch' ? 'date_to_text'
            THEN v_spec->'patch'->>'date_to_text' ELSE v_before.date_to_text END
      WHERE id=v_before.id;
      GET DIAGNOSTICS v_count = ROW_COUNT;
      IF v_count<>1 THEN RAISE EXCEPTION 'Actualización distinta de una fila'; END IF;
      v_updated := v_updated+v_count;
    END IF;

    SELECT * INTO STRICT v_after FROM public.music_accompaniment_periods WHERE id=v_before.id;
    IF (to_jsonb(v_after)-ARRAY['notes','year_to','date_to_text','updated_at']::text[])
       IS DISTINCT FROM
       (to_jsonb(v_before)-ARRAY['notes','year_to','date_to_text','updated_at']::text[])
    THEN RAISE EXCEPTION 'Alteración de identidad, inicio, posición o contexto del periodo %',v_before.id; END IF;
    IF NOT (to_jsonb(v_after) @> (v_spec->'patch'))
    THEN RAISE EXCEPTION 'El periodo % no conserva el resultado previsto',v_before.id; END IF;
    IF NOT (v_spec->'patch' ? 'year_to') AND
       (v_after.year_to IS DISTINCT FROM v_before.year_to OR v_after.date_to_text IS DISTINCT FROM v_before.date_to_text)
    THEN RAISE EXCEPTION 'Plazo contractual alterado sin evidencia'; END IF;
    IF v_spec->'patch'='{}'::jsonb AND to_jsonb(v_after) IS DISTINCT FROM to_jsonb(v_before)
    THEN RAISE EXCEPTION 'La Puebla ya estaba renovada y debe quedar intacta'; END IF;
  END LOOP;
  IF v_updated<>4 THEN RAISE EXCEPTION 'Se esperaban cuatro actualizaciones'; END IF;

  FOR v_source IN SELECT value FROM jsonb_array_elements(v_sources) LOOP
    SELECT count(*),min(id::text)::uuid INTO v_count,v_source_id
    FROM public.sources
    WHERE (v_source->>'url' IS NOT NULL AND url=v_source->>'url')
       OR (v_source->>'url' IS NULL AND url IS NULL AND name=v_source->>'name'
           AND publication_date=(v_source->>'publication_date')::date);
    IF v_count>1 THEN RAISE EXCEPTION 'Fuente duplicada: %',v_source->>'name'; END IF;
    IF v_source_id IS NULL THEN
      INSERT INTO public.sources(name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
      VALUES(v_source->>'name',v_source->>'url',v_source->>'source_type',v_source->>'publisher',
        (v_source->>'publication_date')::date,'2026-10-06',v_source->>'notes')
      RETURNING id INTO v_source_id;
      v_inserted_sources := v_inserted_sources+1;
    END IF;
    FOR v_target IN SELECT jsonb_array_elements_text(v_source->'period_ids') LOOP
      INSERT INTO public.source_links(source_id,music_accompaniment_period_id,scope)
      SELECT v_source_id,v_target::uuid,v_source->>'scope'
      WHERE NOT EXISTS (SELECT 1 FROM public.source_links
        WHERE source_id=v_source_id AND music_accompaniment_period_id=v_target::uuid);
      GET DIAGNOSTICS v_count = ROW_COUNT;
      v_inserted_links := v_inserted_links+v_count;
      IF (SELECT count(*) FROM public.source_links
          WHERE source_id=v_source_id AND music_accompaniment_period_id=v_target::uuid)<>1
      THEN RAISE EXCEPTION 'Enlace de fuente ausente o duplicado'; END IF;
    END LOOP;
  END LOOP;
  IF v_inserted_sources<>3 OR v_inserted_links<>5
  THEN RAISE EXCEPTION 'La trazabilidad no coincide con las tres fuentes y cinco enlaces del preflight'; END IF;

  IF EXISTS (SELECT 1 FROM jsonb_array_elements(v_original_links) old_link
    LEFT JOIN public.source_links sl ON sl.id=(old_link->>'id')::uuid
    WHERE to_jsonb(sl) IS DISTINCT FROM old_link)
  THEN RAISE EXCEPTION 'Se ha alterado documentación anterior'; END IF;

  IF (SELECT count(*) FROM public.music_accompaniment_periods)<>551
  THEN RAISE EXCEPTION 'Una renovación no debe crear ni borrar periodos'; END IF;
  IF (SELECT count(*) FROM public.music_accompaniment_periods p
      LEFT JOIN public.brotherhoods h ON h.entity_id=p.brotherhood_entity_id
      LEFT JOIN public.municipalities m ON m.id=h.municipality_id
      WHERE p.year_from=2027 AND p.status='published'
      AND (coalesce(p.public_province,m.province)='Sevilla' OR coalesce(p.public_municipality_name,m.name)='Sevilla'))<>44
  THEN RAISE EXCEPTION 'Las renovaciones han alterado el contador de Cambios musicales'; END IF;
  IF (SELECT md5(coalesce(jsonb_agg(to_jsonb(p) ORDER BY p.id)::text,'[]'))
      FROM public.music_accompaniment_periods p WHERE p.brotherhood_entity_id IN ('10000000-0000-0000-0000-000000000001','a4220000-0000-0000-0000-000000000003','1f517f03-4ee7-4b29-8eeb-d2732ba01095')
      AND p.id NOT IN ('79511741-cf06-4d8e-8640-5c89e91101a2','9d5bab12-c743-4fde-a2cb-93e6c00137eb','a6a2fef0-2c70-4d1b-90ac-4915ebfbc4f1','e8cd8c55-00e0-4e8b-826a-f046ddf45df4','13ddbd73-ac98-4d1d-871e-34ed8e77bcd2'))<>'4a6296300e467afdd1f753791d5e59e4'
  THEN RAISE EXCEPTION 'Se ha alterado otro periodo musical'; END IF;
  IF (SELECT md5(coalesce(jsonb_agg(to_jsonb(o) ORDER BY o.id)::text,'[]'))
      FROM public.outings o WHERE o.brotherhood_entity_id IN ('10000000-0000-0000-0000-000000000001','a4220000-0000-0000-0000-000000000003','1f517f03-4ee7-4b29-8eeb-d2732ba01095'))<>'2d58cd5278cf5ca990663bbc6ba77c96'
  THEN RAISE EXCEPTION 'Se ha alterado una salida concreta'; END IF;
  IF (SELECT md5(coalesce(jsonb_agg(to_jsonb(p) ORDER BY p.id)::text,'[]'))
      FROM public.outing_music_positions p JOIN public.outings o ON o.id=p.outing_id
      WHERE o.brotherhood_entity_id IN ('10000000-0000-0000-0000-000000000001','a4220000-0000-0000-0000-000000000003','1f517f03-4ee7-4b29-8eeb-d2732ba01095'))<>'4a7a921a58c7bee4e75d34fb6a17c3b7'
  THEN RAISE EXCEPTION 'Se ha alterado una posición de salida'; END IF;
  IF (SELECT md5(coalesce(jsonb_agg(to_jsonb(a) ORDER BY a.id)::text,'[]'))
      FROM public.outing_music_assignments a JOIN public.outing_music_positions p ON p.id=a.music_position_id
      JOIN public.outings o ON o.id=p.outing_id WHERE o.brotherhood_entity_id IN ('10000000-0000-0000-0000-000000000001','a4220000-0000-0000-0000-000000000003','1f517f03-4ee7-4b29-8eeb-d2732ba01095'))<>'e3cb38fd83aa8d6d29bc2994862bbb2d'
  THEN RAISE EXCEPTION 'Se ha alterado una asignación de salida'; END IF;
END
$operation$;

SELECT id,notes,year_from,year_to,date_to_text FROM public.music_accompaniment_periods
WHERE id IN ('79511741-cf06-4d8e-8640-5c89e91101a2','9d5bab12-c743-4fde-a2cb-93e6c00137eb','a6a2fef0-2c70-4d1b-90ac-4915ebfbc4f1','e8cd8c55-00e0-4e8b-826a-f046ddf45df4','13ddbd73-ac98-4d1d-871e-34ed8e77bcd2') ORDER BY id;

COMMIT;

