BEGIN;
SET LOCAL lock_timeout='5s';
DO $$ BEGIN PERFORM entity_id FROM brotherhoods WHERE entity_id='a1be680a-4f41-46e7-9a3d-03418fe9bb42' FOR UPDATE; IF (SELECT md5(to_jsonb(t)::text) FROM brotherhoods t WHERE entity_id='a1be680a-4f41-46e7-9a3d-03418fe9bb42') IS DISTINCT FROM 'c09292b2ac223287fd9a18600f38fa4e' THEN RAISE EXCEPTION 'Concurrent change brotherhoods'; END IF; END $$;
UPDATE brotherhoods SET foundation_text='Orígenes en 1991; grupo de oración en 1992; Agrupación Parroquial en 2001; Hermandad desde el 25 de enero de 2011',history_text='La historia oficial sitúa sus orígenes en 1991 y la organización del grupo de oración en 1992, en la parroquia de la O. En 2001 se constituyó como Agrupación Parroquial y se estableció en Nuestra Señora del Buen Aire. La primera salida del Cristo hacia Santa Ana tuvo lugar en 2004. Erigida Hermandad de Penitencia y Gloria el 25 de enero de 2011, estrenó ese año su cortejo de nazarenos, amadrinada por la Estrella. Desde 2012 celebra el Rosario público del Desconsuelo. La estación de penitencia parte de San Juan Bosco desde 2022.' WHERE entity_id='a1be680a-4f41-46e7-9a3d-03418fe9bb42';
INSERT INTO source_links(source_id,entity_id,scope) SELECT 'bd3eb2b1-9479-4efe-a0c1-cbc352e9e3d0','a1be680a-4f41-46e7-9a3d-03418fe9bb42','Ampliación editorial oficial' WHERE NOT EXISTS(SELECT 1 FROM source_links WHERE source_id='bd3eb2b1-9479-4efe-a0c1-cbc352e9e3d0' AND entity_id='a1be680a-4f41-46e7-9a3d-03418fe9bb42');
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id='a1be680a-4f41-46e7-9a3d-03418fe9bb42';
DO $$ BEGIN PERFORM entity_id FROM images WHERE entity_id='7838481a-1577-4ada-bfea-72e4b2056718' FOR UPDATE; IF (SELECT md5(to_jsonb(t)::text) FROM images t WHERE entity_id='7838481a-1577-4ada-bfea-72e4b2056718') IS DISTINCT FROM '0b319c382a284d1804838cfb7b7249c3' THEN RAISE EXCEPTION 'Concurrent change images'; END IF; END $$;
UPDATE images SET height_cm=182,iconography='Cristo recién expirado, clavado por separado en ambos pies y sin la herida de la lanzada.',description='Crucificado de José Antonio Navarro Arteaga, tallado en cedro, de 1,82 metros de altura. Evoca la imaginería del primer barroco sevillano. Presenta la cabeza vencida, párpados casi cerrados y policromía clara de escasa presencia de sangre. Participó en MUNARCO en 1998 y fue bendecido el 22 de marzo de 2002.',notes='La ficha oficial del titular fecha la talla en 1997; el apartado Historia menciona 1996. Se conserva 1997 a falta de aclaración documental.' WHERE entity_id='7838481a-1577-4ada-bfea-72e4b2056718';
INSERT INTO source_links(source_id,entity_id,scope) SELECT 'bf2b0928-17e4-4e98-906d-e7dbe4ef332b','7838481a-1577-4ada-bfea-72e4b2056718','Ampliación editorial oficial' WHERE NOT EXISTS(SELECT 1 FROM source_links WHERE source_id='bf2b0928-17e4-4e98-906d-e7dbe4ef332b' AND entity_id='7838481a-1577-4ada-bfea-72e4b2056718');
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id='7838481a-1577-4ada-bfea-72e4b2056718';
DO $$ BEGIN PERFORM entity_id FROM images WHERE entity_id='5eaf85d7-da14-4502-901c-93542ea9a62d' FOR UPDATE; IF (SELECT md5(to_jsonb(t)::text) FROM images t WHERE entity_id='5eaf85d7-da14-4502-901c-93542ea9a62d') IS DISTINCT FROM '5287afefa398afa4fad2056150bf4c37' THEN RAISE EXCEPTION 'Concurrent change images'; END IF; END $$;
UPDATE images SET description='Dolorosa de José Antonio Navarro Arteaga realizada en 2001, de rasgos maduros inspirados en la escuela granadina del siglo XVIII. Inclina la cabeza hacia la izquierda y entrelaza las manos; sus ojos azulados y tres lágrimas acentúan la expresión de aflicción. Fue bendecida junto al Cristo el 22 de marzo de 2002. Preside un Rosario público desde 2012, cuya primera edición visitó la capilla de la Estrella.',iconography='Dolorosa de manos entrelazadas, con dos lágrimas en la mejilla izquierda y una en la derecha.' WHERE entity_id='5eaf85d7-da14-4502-901c-93542ea9a62d';
INSERT INTO source_links(source_id,entity_id,scope) SELECT 'bf267bf5-b38a-4295-b602-9dfc7a94a5cb','5eaf85d7-da14-4502-901c-93542ea9a62d','Ampliación editorial oficial' WHERE NOT EXISTS(SELECT 1 FROM source_links WHERE source_id='bf267bf5-b38a-4295-b602-9dfc7a94a5cb' AND entity_id='5eaf85d7-da14-4502-901c-93542ea9a62d');
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id='5eaf85d7-da14-4502-901c-93542ea9a62d';
DO $$ BEGIN PERFORM entity_id FROM steps WHERE entity_id='30d3828d-b2ef-47bb-9765-2594249ccf41' FOR UPDATE; IF (SELECT md5(to_jsonb(t)::text) FROM steps t WHERE entity_id='30d3828d-b2ef-47bb-9765-2594249ccf41') IS DISTINCT FROM '0b572fa0f4e61726522a9981b6934910' THEN RAISE EXCEPTION 'Concurrent change steps'; END IF; END $$;
UPDATE steps SET style='Neobarroco',materials='Madera tallada con acabado en caoba; respiraderos bordados.',description='Paso estrenado en 2009, con canastilla de Manuel Toledano Gómez. Las cartelas de Mariano Sánchez del Pino representan la Resurrección, el Santísimo Sacramento, los Dolores de María y una nao alusiva al Buen Aire. Cuatro hachones morados iluminan el conjunto, sin maniguetas y con llamador plateado en el lado izquierdo.',notes='Cartelas y ángeles de Mariano Sánchez del Pino. El acabado en caoba fue concluido en 2016 por los Hermanos Caballero Farfán.' WHERE entity_id='30d3828d-b2ef-47bb-9765-2594249ccf41';
INSERT INTO source_links(source_id,entity_id,scope) SELECT 'bf2b0928-17e4-4e98-906d-e7dbe4ef332b','30d3828d-b2ef-47bb-9765-2594249ccf41','Ampliación editorial oficial' WHERE NOT EXISTS(SELECT 1 FROM source_links WHERE source_id='bf2b0928-17e4-4e98-906d-e7dbe4ef332b' AND entity_id='30d3828d-b2ef-47bb-9765-2594249ccf41');
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id='30d3828d-b2ef-47bb-9765-2594249ccf41';
INSERT INTO entities(id,name,slug,entity_type,status) VALUES('930a761e-7cdf-4053-85f8-5421a8916b48','Francisco Javier Navarro Blanco','francisco-javier-navarro-blanco','agent','published');
INSERT INTO agents(entity_id,agent_kind) VALUES('930a761e-7cdf-4053-85f8-5421a8916b48','person');
INSERT INTO sources(id,name,url,source_type,publication_date,accessed_at,author_or_publisher) VALUES('011ee5e1-7844-4e5e-aa71-ea1b2e827e3c','Marchas dedicadas a los titulares de Pasión y Muerte','https://hermandadpasionymuerte.es/?p=394','Fuente oficial','2023-03-17','2026-10-09','Hermandad de Pasión y Muerte');
INSERT INTO entities(id,name,slug,entity_type,status,summary,content_updated_at,editorial_reviewed_at) VALUES('73db76f5-7ff8-4b1b-b041-f391cdd332d7','Pasión y Muerte','pasion-y-muerte-francisco-javier-navarro-blanco','march','published','Marcha de Francisco Javier Navarro Blanco dedicada a un titular de Pasión y Muerte.',now(),now());
INSERT INTO marches(entity_id,music_type,composition_date_text,description,eligible_for_daily) VALUES('73db76f5-7ff8-4b1b-b041-f391cdd332d7','Cornetas y Tambores','Década de 1990','Compuesta para la Centuria Romana Macarena. La Hermandad recibió las partituras el 17 de marzo de 2023; no se precisa el año de composición.',false);
INSERT INTO march_authors(march_entity_id,agent_entity_id,author_role,status) VALUES('73db76f5-7ff8-4b1b-b041-f391cdd332d7','930a761e-7cdf-4053-85f8-5421a8916b48','composer','published');
WITH d AS (INSERT INTO march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,status) VALUES('73db76f5-7ff8-4b1b-b041-f391cdd332d7','7838481a-1577-4ada-bfea-72e4b2056718','dedicated_to','published') RETURNING id) INSERT INTO source_links(source_id,march_dedication_id,scope) SELECT '011ee5e1-7844-4e5e-aa71-ea1b2e827e3c',id,'Dedicatoria oficial' FROM d;
INSERT INTO source_links(source_id,entity_id,scope) VALUES('011ee5e1-7844-4e5e-aa71-ea1b2e827e3c','73db76f5-7ff8-4b1b-b041-f391cdd332d7','Autoría, datación y destinatario');
INSERT INTO entities(id,name,slug,entity_type,status,summary,content_updated_at,editorial_reviewed_at) VALUES('2975e9fe-d233-41be-b936-8ab3c9b8c17f','La Virgen del Desconsuelo y Visitación','la-virgen-del-desconsuelo-y-visitacion','march','published','Marcha de Francisco Javier Navarro Blanco dedicada a un titular de Pasión y Muerte.',now(),now());
INSERT INTO marches(entity_id,music_type,composition_date_text,description,eligible_for_daily) VALUES('2975e9fe-d233-41be-b936-8ab3c9b8c17f','Cornetas y Tambores','Década de 1990','Compuesta para la Centuria Romana Macarena. La Hermandad recibió las partituras el 17 de marzo de 2023; no se precisa el año de composición.',false);
INSERT INTO march_authors(march_entity_id,agent_entity_id,author_role,status) VALUES('2975e9fe-d233-41be-b936-8ab3c9b8c17f','930a761e-7cdf-4053-85f8-5421a8916b48','composer','published');
WITH d AS (INSERT INTO march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,status) VALUES('2975e9fe-d233-41be-b936-8ab3c9b8c17f','5eaf85d7-da14-4502-901c-93542ea9a62d','dedicated_to','published') RETURNING id) INSERT INTO source_links(source_id,march_dedication_id,scope) SELECT '011ee5e1-7844-4e5e-aa71-ea1b2e827e3c',id,'Dedicatoria oficial' FROM d;
INSERT INTO source_links(source_id,entity_id,scope) VALUES('011ee5e1-7844-4e5e-aa71-ea1b2e827e3c','2975e9fe-d233-41be-b936-8ab3c9b8c17f','Autoría, datación y destinatario');
INSERT INTO source_links(source_id,entity_id,scope) VALUES('011ee5e1-7844-4e5e-aa71-ea1b2e827e3c','930a761e-7cdf-4053-85f8-5421a8916b48','Autoría documentada'),('011ee5e1-7844-4e5e-aa71-ea1b2e827e3c','a1be680a-4f41-46e7-9a3d-03418fe9bb42','Patrimonio musical');
INSERT INTO audit_log(actor_label,action_type,object_type,entity_id,summary) VALUES('Codex','update','brotherhood','a1be680a-4f41-46e7-9a3d-03418fe9bb42','Ampliación oficial de historia, Cristo, Dolorosa y paso; dos marchas de Navarro Blanco y sus dedicatorias.');
-- Insertar después del DML y antes de ROLLBACK/COMMIT en la misma transacción.
DO $hc016_types$
DECLARE
  target_ids uuid[] := ARRAY['a1be680a-4f41-46e7-9a3d-03418fe9bb42']::uuid[];
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
SELECT count(*) new_marches FROM marches WHERE entity_id IN ('73db76f5-7ff8-4b1b-b041-f391cdd332d7','2975e9fe-d233-41be-b936-8ab3c9b8c17f');
ROLLBACK;
