-- Operación editorial autorizada: San Esteban, Las Cigarreras -> Santa Ana, 2027.
-- No pertenece a la cadena de migraciones de esquema. IDs nuevos generados en DB.
-- Ensayo: sustituir únicamente el COMMIT final por ROLLBACK.
-- La repetición se bloquea si el relevo ya existe; no crea duplicados.
-- Fuente: https://www.elpespunte.es/articulo/cofrade/apuesta-san-esteban-santa-ana-reordena-mapa-musical-martes-santo/20261006104411155178.html

BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

DO $operation$
DECLARE
  v_brotherhood constant uuid := '36b4d5c1-f7bb-4025-a09a-948e0d5d188f';
  v_step constant uuid := 'e2049c29-7e46-4b69-bd54-bd1c45ba18d2';
  v_previous_band constant uuid := 'a23934c9-93e9-4bf1-886e-d98ec170b74f';
  v_new_band constant uuid := '49b5a3e0-c7d6-4dac-980e-3eddc355a7d1';
  v_previous_id constant uuid := '18ca9f4a-7c87-4f2d-b5eb-27b6bdd4734c';
  v_source_url constant text := 'https://www.elpespunte.es/articulo/cofrade/apuesta-san-esteban-santa-ana-reordena-mapa-musical-martes-santo/20261006104411155178.html';
  v_previous public.music_accompaniment_periods%ROWTYPE;
  v_new_id uuid;
  v_source_id uuid;
  v_count integer;
  v_before_count integer;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended('hilo:san-esteban:palio:2027', 0));

  SELECT count(*) INTO v_count
  FROM (VALUES
    (v_brotherhood, 'brotherhood', 'san-esteban'),
    (v_step, 'step', 'paso-palio-madre-desamparados-san-esteban'),
    (v_previous_band, 'band', 'banda-musica-maria-santisima-victoria-las-cigarreras'),
    (v_new_band, 'band', 'banda-musica-santa-ana-dos-hermanas')
  ) expected(id, entity_type, slug)
  JOIN public.entities e ON e.id=expected.id
    AND e.entity_type=expected.entity_type AND e.slug=expected.slug
    AND e.status='published';
  IF v_count<>4 THEN RAISE EXCEPTION 'Identidades públicas distintas del preflight'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.brotherhoods WHERE entity_id=v_brotherhood
      AND current_procession_day='Martes Santo'
      AND brotherhood_types @> ARRAY['Penitencia']::text[]
  ) THEN RAISE EXCEPTION 'Clasificación o jornada de San Esteban distinta del preflight'; END IF;
  IF (SELECT count(*) FROM public.bands
      WHERE entity_id IN (v_previous_band,v_new_band) AND band_type='Banda de Música')<>2
  THEN RAISE EXCEPTION 'Tipos de formación distintos del preflight'; END IF;

  SELECT * INTO STRICT v_previous
  FROM public.music_accompaniment_periods WHERE id=v_previous_id FOR UPDATE;
  IF md5(to_jsonb(v_previous)::text)<>'156a940d1296b8e0c7629f5578cfdb85'
    OR v_previous.brotherhood_entity_id<>v_brotherhood
    OR v_previous.step_entity_id<>v_step OR v_previous.band_entity_id<>v_previous_band
  THEN RAISE EXCEPTION 'El periodo saliente ha cambiado; reconciliar antes de aplicar'; END IF;
  IF EXISTS (SELECT 1 FROM public.music_accompaniment_periods
      WHERE brotherhood_entity_id=v_brotherhood AND step_entity_id=v_step AND year_from>=2027)
  THEN RAISE EXCEPTION 'Ya existe un acompañamiento futuro para este palio'; END IF;
  SELECT count(*) INTO v_before_count FROM public.music_accompaniment_periods
    WHERE year_from=2027 AND status='published';

  UPDATE public.music_accompaniment_periods
  SET year_to=2026, date_to_text='Hasta el Martes Santo de 2026', is_current=false,
      public_band_name='Banda de Música María Santísima de la Victoria (Las Cigarreras)',
      public_band_slug='banda-musica-maria-santisima-victoria-las-cigarreras',
      notes=concat_ws(E'\n\n', notes,
        'El acompañamiento concluye en 2026. La Banda de Música Santa Ana de Dos Hermanas toma el relevo tras el palio desde el Martes Santo de 2027, según el anuncio del 6 de octubre de 2026.')
  WHERE id=v_previous_id;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  IF v_count<>1 THEN RAISE EXCEPTION 'Cierre saliente distinto de una fila'; END IF;

  INSERT INTO public.music_accompaniment_periods (
    id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type,
    year_from, date_from_text, is_current, notes, status,
    public_brotherhood_name, public_brotherhood_slug, public_step_name,
    public_band_name, public_band_slug, public_municipality_name,
    public_municipality_slug, public_province
  ) VALUES (
    gen_random_uuid(), v_brotherhood, v_new_band, v_step, 'Tras el paso de palio', 'Martes Santo',
    2027, 'Desde el Martes Santo de 2027', true,
    'La Banda de Música Santa Ana de Dos Hermanas sustituye a la Banda de Música María Santísima de la Victoria (Las Cigarreras) tras María Santísima Madre de los Desamparados desde el Martes Santo de 2027. Anuncio del 6 de octubre de 2026; duración contractual no precisada.',
    'published', 'Hermandad de San Esteban', 'san-esteban',
    'Paso de palio de María Santísima Madre de los Desamparados',
    'Banda de Música Santa Ana de Dos Hermanas', 'banda-musica-santa-ana-dos-hermanas',
    'Sevilla', 'sevilla', 'Sevilla'
  ) RETURNING id INTO v_new_id;

  SELECT count(*) INTO v_count FROM public.sources WHERE url=v_source_url;
  IF v_count>1 THEN RAISE EXCEPTION 'Fuente duplicada por URL'; END IF;
  SELECT id INTO v_source_id FROM public.sources WHERE url=v_source_url;
  IF v_source_id IS NULL THEN
    INSERT INTO public.sources (id,name,url,source_type,author_or_publisher,publication_date,accessed_at,notes)
    VALUES (gen_random_uuid(), 'San Esteban incorpora a Santa Ana para el Martes Santo de 2027',
      v_source_url, 'Prensa digital', 'Nacho Sánchez · El Pespunte', '2026-10-06', '2026-10-06',
      'Noticia que recoge el relevo confirmado y el comunicado de no renovación. Se utiliza exclusivamente para documentar San Esteban; las posibilidades sobre otras Hermandades no se incorporan como acuerdos.')
    RETURNING id INTO v_source_id;
  END IF;

  INSERT INTO public.source_links (id,source_id,music_accompaniment_period_id,scope,notes)
  VALUES
    (gen_random_uuid(),v_source_id,v_previous_id,'Cierre de acompañamiento','Fin del acompañamiento de Las Cigarreras y relevo para 2027.'),
    (gen_random_uuid(),v_source_id,v_new_id,'Cambio musical de 2027','Santa Ana tras el palio de Madre de los Desamparados el Martes Santo de 2027.');
  INSERT INTO public.source_links (id,source_id,entity_id,scope,notes)
  SELECT gen_random_uuid(),v_source_id,v_brotherhood,'Cambio musical de 2027',
    'Documentación del relevo de Las Cigarreras por Santa Ana.'
  WHERE NOT EXISTS (SELECT 1 FROM public.source_links WHERE source_id=v_source_id AND entity_id=v_brotherhood);

  IF (SELECT count(*) FROM public.music_accompaniment_periods
      WHERE brotherhood_entity_id=v_brotherhood AND step_entity_id=v_step
        AND band_entity_id=v_new_band AND year_from=2027 AND year_to IS NULL
        AND is_current AND status='published' AND public_province='Sevilla')<>1
  THEN RAISE EXCEPTION 'El entrante no cumple el contrato público'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.music_accompaniment_periods
      WHERE id=v_previous_id AND year_from=2009 AND year_to=2026
        AND NOT is_current AND status='published' AND created_at=v_previous.created_at)
  THEN RAISE EXCEPTION 'No se conserva el periodo saliente'; END IF;
  IF (SELECT count(*) FROM public.music_accompaniment_periods
      WHERE year_from=2027 AND status='published')<>v_before_count+1
  THEN RAISE EXCEPTION 'Incremento de cambios distinto de uno'; END IF;
  IF (SELECT count(*) FROM public.source_links
      WHERE source_id=v_source_id AND music_accompaniment_period_id IN (v_previous_id,v_new_id))<>2
  THEN RAISE EXCEPTION 'Falta documentación de los dos periodos'; END IF;

  IF (SELECT md5(coalesce(jsonb_agg(to_jsonb(p) ORDER BY id)::text,'[]'))
      FROM public.music_accompaniment_periods p WHERE brotherhood_entity_id=v_brotherhood
      AND id NOT IN (v_previous_id,v_new_id))<>'e0386c6022abbda427f11745fa6282af'
  THEN RAISE EXCEPTION 'Se ha alterado otro periodo de San Esteban'; END IF;
  IF (SELECT md5(coalesce(jsonb_agg(to_jsonb(o) ORDER BY id)::text,'[]'))
      FROM public.outings o WHERE brotherhood_entity_id=v_brotherhood)<>'d86c248cb80d6bbc89379b61958d73cb'
  THEN RAISE EXCEPTION 'Se ha alterado una salida'; END IF;
  IF (SELECT md5(coalesce(jsonb_agg(to_jsonb(p) ORDER BY p.id)::text,'[]'))
      FROM public.outing_music_positions p JOIN public.outings o ON o.id=p.outing_id
      WHERE o.brotherhood_entity_id=v_brotherhood)<>'6e3e65c3606966b05f86e5bd72c9713e'
  THEN RAISE EXCEPTION 'Se ha alterado una posición de salida'; END IF;
  IF (SELECT md5(coalesce(jsonb_agg(to_jsonb(a) ORDER BY a.id)::text,'[]'))
      FROM public.outing_music_assignments a JOIN public.outing_music_positions p ON p.id=a.music_position_id
      JOIN public.outings o ON o.id=p.outing_id
      WHERE o.brotherhood_entity_id=v_brotherhood)<>'b8a1757dc640fb4033607960954278e2'
  THEN RAISE EXCEPTION 'Se ha alterado una asignación de salida'; END IF;
END
$operation$;

COMMIT;

SELECT jsonb_build_object(
  'incoming', (SELECT jsonb_agg(to_jsonb(p)) FROM public.music_accompaniment_periods p
    WHERE brotherhood_entity_id='36b4d5c1-f7bb-4025-a09a-948e0d5d188f'
      AND step_entity_id='e2049c29-7e46-4b69-bd54-bd1c45ba18d2' AND year_from=2027),
  'previous', (SELECT to_jsonb(p) FROM public.music_accompaniment_periods p
    WHERE id='18ca9f4a-7c87-4f2d-b5eb-27b6bdd4734c'),
  'eligible_count', (SELECT count(*) FROM public.music_accompaniment_periods p
    LEFT JOIN public.brotherhoods b ON b.entity_id=p.brotherhood_entity_id
    LEFT JOIN public.municipalities m ON m.id=b.municipality_id
    WHERE p.year_from=2027 AND p.status='published'
      AND (coalesce(p.public_province,m.province)='Sevilla' OR coalesce(p.public_municipality_name,m.name)='Sevilla'))
) AS result;
