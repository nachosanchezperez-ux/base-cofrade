BEGIN;
SET LOCAL lock_timeout='5s';
INSERT INTO sources(id,name,url,source_type,accessed_at) VALUES('2397b43d-3d38-49be-a3c5-83872766c823','Nuestro Padre Jesús de la Pasión','https://www.hermandaddepasion.org/ntro-padre-jesus-la-pasion/','Fuente oficial','2026-10-09');
INSERT INTO sources(id,name,url,source_type,accessed_at) VALUES('eee7b4dc-54ba-478b-a8cf-b4e55de1e07c','Nuestra Madre y Señora de la Merced','https://www.hermandaddepasion.org/ntra-madre-sra-la-merced/','Fuente oficial','2026-10-09');
INSERT INTO sources(id,name,url,source_type,accessed_at) VALUES('5e75eae8-ddc4-41df-93e3-3b1de18f6937','Paso del Señor','https://www.hermandaddepasion.org/pasos/','Fuente oficial','2026-10-09');
INSERT INTO sources(id,name,url,source_type,accessed_at) VALUES('67974275-e80d-4b6b-95d3-c1338ce4e608','Paso de la Santísima Virgen','https://www.hermandaddepasion.org/paso-palio-la-stma-virgen/','Fuente oficial','2026-10-09');
INSERT INTO sources(id,name,url,source_type,accessed_at) VALUES('1af6ad3d-8a01-44d1-9c45-38dbfcd7fc88','El Señor de Pasión, marcha de 1897','https://www.hermandaddepasion.org/noticias/la-marcha-procesional-mas-antigua-que-conserva-nuestra-archicofradia/','Fuente oficial','2026-10-09');
INSERT INTO sources(id,name,url,source_type,accessed_at) VALUES('5e1829d3-f34e-492e-9200-1adb3503c92d','Merced, Luz de Pasión: estreno','https://www.hermandaddepasion.org/noticias/marcha-procesional-merced-luz-pasion-cristobal-lopez-gandara/','Fuente oficial','2026-10-09');
INSERT INTO sources(id,name,url,source_type,accessed_at) VALUES('285f8d6b-d25e-4470-9609-303344eabd6e','Noche grande en el Salvador','https://laolivadesalteras.com/noche-grande-en-el-salvador/','Fuente oficial','2026-10-09');
DO $$ BEGIN PERFORM entity_id FROM images WHERE entity_id='a658cd94-3577-4953-a98c-2657c9d6222a' FOR UPDATE; IF (SELECT md5(to_jsonb(t)::text) FROM images t WHERE entity_id='a658cd94-3577-4953-a98c-2657c9d6222a') IS DISTINCT FROM '0351a17bf0c6c03d4921d959957b245f' THEN RAISE EXCEPTION 'Concurrent change'; END IF; END $$;
UPDATE images SET material='Madera policromada',description='Nazareno de vestir fechado hacia 1610–1615, vinculado a Juan Martínez Montañés por testimonios históricos y estudios estilísticos. La Hermandad señala que no se conserva el contrato de ejecución. Tiene hombros y codos articulados, cabeza inclinada hacia la derecha y el peso del cuerpo apoyado sobre la pierna izquierda. Se venera en la capilla sacramental del Salvador.',iconography='Jesús camino del Calvario con la cruz a cuestas.' WHERE entity_id='a658cd94-3577-4953-a98c-2657c9d6222a';
INSERT INTO source_links(source_id,entity_id,scope) VALUES('2397b43d-3d38-49be-a3c5-83872766c823','a658cd94-3577-4953-a98c-2657c9d6222a','Descripción artística');
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id='a658cd94-3577-4953-a98c-2657c9d6222a';
DO $$ BEGIN PERFORM entity_id FROM images WHERE entity_id='cb0b275f-a57b-4bee-88cb-d52aaf17dcc5' FOR UPDATE; IF (SELECT md5(to_jsonb(t)::text) FROM images t WHERE entity_id='cb0b275f-a57b-4bee-88cb-d52aaf17dcc5') IS DISTINCT FROM '9d269479de141913a4b0fada413f84ff' THEN RAISE EXCEPTION 'Concurrent change'; END IF; END $$;
UPDATE images SET material='Madera de ciprés en rostro y manos',description='Dolorosa de Sebastián Santos incorporada a la Hermandad en 1966. Su expresión serena combina ojos de cristal de color miel, siete lágrimas y labios entreabiertos. El rostro y las manos muestran carnaciones pálidas y rosadas. La sustitución de la imagen anterior fue aprobada en cabildo el 6 de febrero de 1966.' WHERE entity_id='cb0b275f-a57b-4bee-88cb-d52aaf17dcc5';
INSERT INTO source_links(source_id,entity_id,scope) VALUES('eee7b4dc-54ba-478b-a8cf-b4e55de1e07c','cb0b275f-a57b-4bee-88cb-d52aaf17dcc5','Descripción artística');
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id='cb0b275f-a57b-4bee-88cb-d52aaf17dcc5';
DO $$ BEGIN PERFORM entity_id FROM steps WHERE entity_id='fefa1e26-3c40-42c5-b3d9-445b7bdd757b' FOR UPDATE; IF (SELECT md5(to_jsonb(t)::text) FROM steps t WHERE entity_id='fefa1e26-3c40-42c5-b3d9-445b7bdd757b') IS DISTINCT FROM '60dc04bff568f597d8e49c2d4f156cfa' THEN RAISE EXCEPTION 'Concurrent change'; END IF; END $$;
UPDATE steps SET materials='Plata, marfil y madera dorada',description='Paso diseñado y ejecutado por Cayetano González Gómez, cuya canastilla se estrenó en 1943. Sus cuatro capillas representan el Triunfo de la Eucaristía, la Virgen de la Merced como Madre de Misericordia, la Transfiguración y la Exaltación de la Santa Cruz. Los ángulos incorporan a san Miguel, san Rafael, san Gabriel y el Ángel Custodio; cuatro faroles octogonales completan la iluminación.',notes='La web oficial menciona el conjunto terminado en 1946 y la conclusión de los respiraderos en 1949. Se conserva la cronología por fases 1943–1949.' WHERE entity_id='fefa1e26-3c40-42c5-b3d9-445b7bdd757b';
INSERT INTO source_links(source_id,entity_id,scope) VALUES('5e75eae8-ddc4-41df-93e3-3b1de18f6937','fefa1e26-3c40-42c5-b3d9-445b7bdd757b','Descripción artística');
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id='fefa1e26-3c40-42c5-b3d9-445b7bdd757b';
DO $$ BEGIN PERFORM entity_id FROM steps WHERE entity_id='ea34723d-ab74-482a-b7ff-776afda6f50a' FOR UPDATE; IF (SELECT md5(to_jsonb(t)::text) FROM steps t WHERE entity_id='ea34723d-ab74-482a-b7ff-776afda6f50a') IS DISTINCT FROM '523d94d133f8ae7558869e845dd42429' THEN RAISE EXCEPTION 'Concurrent change'; END IF; END $$;
UPDATE steps SET materials='Terciopelo azul, bordados en oro y orfebrería de plata; candelería de alpaca plateada',description='Palio de concepción neogótica estrenado en 1929. Antonio Amiáns diseñó los bordados ejecutados por el taller de Carmen Capmany, con la hoja de cardina como motivo destacado. Los varales de Cayetano González, incorporados en 1956, desarrollan escenas de la vida de María. Los respiraderos actuales son obra de los Hermanos Delgado, estrenados en 2000 en sustitución de los originales.' WHERE entity_id='ea34723d-ab74-482a-b7ff-776afda6f50a';
INSERT INTO source_links(source_id,entity_id,scope) VALUES('67974275-e80d-4b6b-95d3-c1338ce4e608','ea34723d-ab74-482a-b7ff-776afda6f50a','Descripción artística');
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id='ea34723d-ab74-482a-b7ff-776afda6f50a';
DO $$ BEGIN IF (SELECT md5(to_jsonb(b)::text) FROM brotherhoods b WHERE entity_id='e9391be0-b38a-4667-bd58-92c5368c8666') IS DISTINCT FROM '6584b83a7e37e7f3e396e0c1872c5547' THEN RAISE EXCEPTION 'Brotherhood changed'; END IF; END $$;
UPDATE brotherhoods SET brotherhood_types=ARRAY['Penitencia','Sacramental'] WHERE entity_id='e9391be0-b38a-4667-bd58-92c5368c8666';
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id='e9391be0-b38a-4667-bd58-92c5368c8666';
INSERT INTO entities(id,name,slug,entity_type,status) VALUES('5cbd62ce-558f-4329-97bd-fb79a45b2753','Ramón González Varela','ramon-gonzalez-varela','agent','published');
INSERT INTO agents(entity_id,agent_kind) VALUES('5cbd62ce-558f-4329-97bd-fb79a45b2753','person');
INSERT INTO entities(id,name,slug,entity_type,status,summary,content_updated_at,editorial_reviewed_at) VALUES('a5c5bd29-51f8-40c1-a128-62580a0b9db5','El Señor de Pasión','el-senor-de-pasion-ramon-gonzalez-varela','march','published','Marcha firmada el 20 de marzo de 1897. Sus partituras se recuperaron en 1995, año en que La Oliva de Salteras la grabó.',now(),now());
INSERT INTO marches(entity_id,music_type,composition_year,description,eligible_for_daily) VALUES('a5c5bd29-51f8-40c1-a128-62580a0b9db5','Banda de Música',1897,'Marcha firmada el 20 de marzo de 1897. Sus partituras se recuperaron en 1995, año en que La Oliva de Salteras la grabó.',false);
INSERT INTO march_authors(march_entity_id,agent_entity_id,author_role,status) VALUES('a5c5bd29-51f8-40c1-a128-62580a0b9db5','5cbd62ce-558f-4329-97bd-fb79a45b2753','composer','published');
WITH d AS (INSERT INTO march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,status) VALUES('a5c5bd29-51f8-40c1-a128-62580a0b9db5','a658cd94-3577-4953-a98c-2657c9d6222a','dedicated_to','published') RETURNING id) INSERT INTO source_links(source_id,march_dedication_id,scope) SELECT '1af6ad3d-8a01-44d1-9c45-38dbfcd7fc88',id,'Dedicatoria' FROM d;
INSERT INTO source_links(source_id,entity_id,scope) VALUES('1af6ad3d-8a01-44d1-9c45-38dbfcd7fc88','a5c5bd29-51f8-40c1-a128-62580a0b9db5','Patrimonio musical');
INSERT INTO entities(id,name,slug,entity_type,status,summary,content_updated_at,editorial_reviewed_at) VALUES('5f4a5628-0675-48cf-94f3-c531c0df5166','Merced, Luz de Pasión','merced-luz-de-pasion-cristobal-lopez-gandara','march','published','Marcha dedicada a Nuestra Madre y Señora de la Merced y estrenada por La Oliva de Salteras en marzo de 2020, en la Colegial del Salvador.',now(),now());
INSERT INTO marches(entity_id,music_type,composition_year,description,eligible_for_daily) VALUES('5f4a5628-0675-48cf-94f3-c531c0df5166','Banda de Música',NULL,'Marcha dedicada a Nuestra Madre y Señora de la Merced y estrenada por La Oliva de Salteras en marzo de 2020, en la Colegial del Salvador.',false);
INSERT INTO march_authors(march_entity_id,agent_entity_id,author_role,status) VALUES('5f4a5628-0675-48cf-94f3-c531c0df5166','d1000000-0000-0000-0000-000000000003','composer','published');
WITH d AS (INSERT INTO march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,status) VALUES('5f4a5628-0675-48cf-94f3-c531c0df5166','cb0b275f-a57b-4bee-88cb-d52aaf17dcc5','dedicated_to','published') RETURNING id) INSERT INTO source_links(source_id,march_dedication_id,scope) SELECT '285f8d6b-d25e-4470-9609-303344eabd6e',id,'Dedicatoria' FROM d;
INSERT INTO source_links(source_id,entity_id,scope) VALUES('285f8d6b-d25e-4470-9609-303344eabd6e','5f4a5628-0675-48cf-94f3-c531c0df5166','Patrimonio musical');
UPDATE marches SET youtube_video_id='irVKMDl9rCU',composition_date_text='20 de marzo de 1897' WHERE entity_id='a5c5bd29-51f8-40c1-a128-62580a0b9db5';
UPDATE marches SET premiere_date_text='Marzo de 2020',premiered_by_band_entity_id='a2208260-0000-0000-0000-000000000041',premiere_place_id='cb5dc8bf-87a8-45be-b1e5-0aa2a5c331d3' WHERE entity_id='5f4a5628-0675-48cf-94f3-c531c0df5166';
INSERT INTO source_links(source_id,entity_id,scope) VALUES('5e1829d3-f34e-492e-9200-1adb3503c92d','5f4a5628-0675-48cf-94f3-c531c0df5166','Estreno'),('1af6ad3d-8a01-44d1-9c45-38dbfcd7fc88','5cbd62ce-558f-4329-97bd-fb79a45b2753','Autoría');
INSERT INTO audit_log(actor_label,action_type,object_type,entity_id,summary) VALUES('Codex','update','brotherhood','e9391be0-b38a-4667-bd58-92c5368c8666','Ampliación oficial de titulares, pasos, carácter sacramental y dos marchas.');
-- Insertar después del DML y antes de ROLLBACK/COMMIT en la misma transacción.
WITH s AS (INSERT INTO sources(name,url,source_type,accessed_at) VALUES('Hermandad Sacramental del Salvador','https://www.hermandaddepasion.org/hermandad-sacramental-del-salvador/','Fuente oficial','2026-10-09') RETURNING id) INSERT INTO source_links(source_id,entity_id,scope) SELECT id,'e9391be0-b38a-4667-bd58-92c5368c8666','Fusión de 1918 y carácter sacramental' FROM s;
DO $hc016_types$
DECLARE
  target_ids uuid[] := ARRAY['e9391be0-b38a-4667-bd58-92c5368c8666']::uuid[];
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
ROLLBACK;
