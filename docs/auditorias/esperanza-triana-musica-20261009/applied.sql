-- HISTÓRICO YA APLICADO: NO REEJECUTAR.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='45s';
INSERT INTO sources(id,name,url,source_type,author_or_publisher,accessed_at,notes) VALUES ('5e9014dc-5628-45e4-a71b-2ec42ba3ab22','Esperanza de Triana · catálogo de marchas dedicadas','https://www.cofradiasyhermandades.es/fichaimagineriaytallas.php?ii=7594602','Catálogo especializado','Cofradías y Hermandades','2026-10-09',NULL);
INSERT INTO sources(id,name,url,source_type,author_or_publisher,accessed_at,notes) VALUES ('63ffc2bb-93ec-4eab-85a1-411f4760de0b','Cristo de las Tres Caídas · Ángel Alcaide · 1996','https://discografiasdemarchasprocesionales.com/marchas/7016/','Catálogo musical','Discografías de Marchas Procesionales','2026-10-09',NULL);
INSERT INTO sources(id,name,url,source_type,author_or_publisher,accessed_at,notes) VALUES ('b41dcfc0-5a4e-4579-b1e8-60a3ad496330','Soleá, dame la mano · dedicatoria e inspiración','https://www.lalineacofrade.com/patrimonio-musica/manuel-font-de-anta/','Fuente especializada','La Línea Cofrade','2026-10-09',NULL);
INSERT INTO sources(id,name,url,source_type,author_or_publisher,accessed_at,notes) VALUES ('4cfbcd58-9369-44f4-a437-d624fbebc171','Santa Ana · programa del concierto en la Esperanza de Triana · 9/10/2026',NULL,'Aportación directa','Banda de Música Santa Ana de Dos Hermanas','2026-10-09','Lámina del programa aportada por la redacción el 9/10/2026 (IMG_4272.jpeg). Documenta ocho títulos y sus autores; acredita programación, no ejecución efectiva ni estreno. No se dispone de URL pública de la lámina.');
DO $$ BEGIN
UPDATE marches SET composition_year=2004,description='Marcha de Claudio Gómez Calado dedicada a Nuestra Señora de la Esperanza de Triana. Incluida en el programa del concierto de Santa Ana en la Capilla de los Marineros del 9 de octubre de 2026. Interpretada por la Banda de Música Virgen de las Angustias durante la procesión triunfal de Nuestra Señora de las Angustias de Utrera el 3 de octubre de 2026.' WHERE entity_id='64c18d72-705c-4456-9fa2-21ab7f2d7072' AND composition_year IS NULL AND description IS NOT DISTINCT FROM 'Interpretada por la Banda de Música Virgen de las Angustias durante la procesión triunfal de Nuestra Señora de las Angustias de Utrera el 3 de octubre de 2026.';
IF NOT FOUND THEN RAISE EXCEPTION 'Marcha modificada concurrentemente: 64c18d72-705c-4456-9fa2-21ab7f2d7072'; END IF;
UPDATE entities SET name='Triana de Esperanza',summary='Marcha de Claudio Gómez Calado dedicada a Nuestra Señora de la Esperanza de Triana.',content_updated_at=now(),editorial_reviewed_at=now() WHERE id='64c18d72-705c-4456-9fa2-21ab7f2d7072' AND name='Triana de Esperanza' AND summary IS NOT DISTINCT FROM 'Obra documentada en el repertorio interpretado por la Banda de Música Virgen de las Angustias en Utrera el 3 de octubre de 2026.';
IF NOT FOUND THEN RAISE EXCEPTION 'Entidad modificada concurrentemente: 64c18d72-705c-4456-9fa2-21ab7f2d7072'; END IF;
END $$;
INSERT INTO source_links(source_id,entity_id,scope) VALUES('5e9014dc-5628-45e4-a71b-2ec42ba3ab22','64c18d72-705c-4456-9fa2-21ab7f2d7072','Patrimonio musical'),('4cfbcd58-9369-44f4-a437-d624fbebc171','64c18d72-705c-4456-9fa2-21ab7f2d7072','Programa del concierto');
WITH d AS (
INSERT INTO march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,dedication_text,date_from_text,status)
SELECT '64c18d72-705c-4456-9fa2-21ab7f2d7072','f3f06e37-23cd-4ab4-8129-21c9f8acadd3','dedicated_to','Marcha de Claudio Gómez Calado dedicada a Nuestra Señora de la Esperanza de Triana.','2004','published'
WHERE NOT EXISTS(SELECT 1 FROM march_dedications WHERE march_entity_id='64c18d72-705c-4456-9fa2-21ab7f2d7072' AND dedicatee_entity_id='f3f06e37-23cd-4ab4-8129-21c9f8acadd3') RETURNING id)
INSERT INTO source_links(source_id,march_dedication_id,scope) SELECT '5e9014dc-5628-45e4-a71b-2ec42ba3ab22',id,'Dedicatoria' FROM d;
DO $$ BEGIN
UPDATE marches SET composition_year=1918,description='Marcha de Manuel Font de Anta vinculada tradicionalmente a las saetas de los presos al paso de la Esperanza de Triana por la cárcel del Pópulo. La dedicatoria original se dirige a los presos de Sevilla, por lo que no se registra como dedicatoria formal a la Hermandad. Incluida en el programa del concierto de Santa Ana en la Capilla de los Marineros del 9 de octubre de 2026. Interpretada y documentada en una cruceta musical sevillana del 4 de octubre de 2026.' WHERE entity_id='fcc73b91-38f4-48ed-90cd-5c7fbdb0bc9f' AND composition_year IS NULL AND description IS NOT DISTINCT FROM 'Interpretada y documentada en una cruceta musical sevillana del 4 de octubre de 2026.';
IF NOT FOUND THEN RAISE EXCEPTION 'Marcha modificada concurrentemente: fcc73b91-38f4-48ed-90cd-5c7fbdb0bc9f'; END IF;
UPDATE entities SET name='Soleá, dame la mano',summary='Marcha de Manuel Font de Anta vinculada tradicionalmente a las saetas de los presos al paso de la Esperanza de Triana por la cárcel del Pópulo. La dedicatoria original se dirige a los presos de Sevilla, por lo que no se registra como dedicatoria formal a la Hermandad.',content_updated_at=now(),editorial_reviewed_at=now() WHERE id='fcc73b91-38f4-48ed-90cd-5c7fbdb0bc9f' AND name='Soleá, dame la mano' AND summary IS NOT DISTINCT FROM 'Obra documentada en una cruceta musical sevillana del 4 de octubre de 2026.';
IF NOT FOUND THEN RAISE EXCEPTION 'Entidad modificada concurrentemente: fcc73b91-38f4-48ed-90cd-5c7fbdb0bc9f'; END IF;
END $$;
INSERT INTO source_links(source_id,entity_id,scope) VALUES('b41dcfc0-5a4e-4579-b1e8-60a3ad496330','fcc73b91-38f4-48ed-90cd-5c7fbdb0bc9f','Patrimonio musical'),('4cfbcd58-9369-44f4-a437-d624fbebc171','fcc73b91-38f4-48ed-90cd-5c7fbdb0bc9f','Programa del concierto');
DO $$ BEGIN
UPDATE marches SET composition_year=1925,description='Marcha de Manuel López Farfán dedicada a Nuestra Señora de la Esperanza de Triana. Incluida en el programa del concierto de Santa Ana en la Capilla de los Marineros del 9 de octubre de 2026. Interpretada en la procesión de Gloria de Nuestra Señora del Castillo Coronada de Lebrija en 2026.' WHERE entity_id='f8d09b0c-a76c-4737-8e4f-a2199a4e6f0f' AND composition_year IS NULL AND description IS NOT DISTINCT FROM 'Interpretada en la procesión de Gloria de Nuestra Señora del Castillo Coronada de Lebrija en 2026.';
IF NOT FOUND THEN RAISE EXCEPTION 'Marcha modificada concurrentemente: f8d09b0c-a76c-4737-8e4f-a2199a4e6f0f'; END IF;
UPDATE entities SET name='La Esperanza de Triana',summary='Marcha de Manuel López Farfán dedicada a Nuestra Señora de la Esperanza de Triana.',content_updated_at=now(),editorial_reviewed_at=now() WHERE id='f8d09b0c-a76c-4737-8e4f-a2199a4e6f0f' AND name='La Esperanza de Triana' AND summary IS NOT DISTINCT FROM 'Obra documentada en el repertorio interpretado tras Nuestra Señora del Castillo Coronada el 12 de septiembre de 2026.';
IF NOT FOUND THEN RAISE EXCEPTION 'Entidad modificada concurrentemente: f8d09b0c-a76c-4737-8e4f-a2199a4e6f0f'; END IF;
END $$;
INSERT INTO source_links(source_id,entity_id,scope) VALUES('5e9014dc-5628-45e4-a71b-2ec42ba3ab22','f8d09b0c-a76c-4737-8e4f-a2199a4e6f0f','Patrimonio musical'),('4cfbcd58-9369-44f4-a437-d624fbebc171','f8d09b0c-a76c-4737-8e4f-a2199a4e6f0f','Programa del concierto');
WITH d AS (
INSERT INTO march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,dedication_text,date_from_text,status)
SELECT 'f8d09b0c-a76c-4737-8e4f-a2199a4e6f0f','f3f06e37-23cd-4ab4-8129-21c9f8acadd3','dedicated_to','Marcha de Manuel López Farfán dedicada a Nuestra Señora de la Esperanza de Triana.','1925','published'
WHERE NOT EXISTS(SELECT 1 FROM march_dedications WHERE march_entity_id='f8d09b0c-a76c-4737-8e4f-a2199a4e6f0f' AND dedicatee_entity_id='f3f06e37-23cd-4ab4-8129-21c9f8acadd3') RETURNING id)
INSERT INTO source_links(source_id,march_dedication_id,scope) SELECT '5e9014dc-5628-45e4-a71b-2ec42ba3ab22',id,'Dedicatoria' FROM d;
INSERT INTO entities(id,entity_type,name,slug,summary,status,content_updated_at,editorial_reviewed_at) VALUES('14207a63-0863-4c62-a6ad-85e35d6584a6','march','Cristo de las Tres Caídas','cristo-de-las-tres-caidas-angel-alcaide','Marcha para banda de música de Ángel Alcaide Barroso Vázquez dedicada al Santísimo Cristo de las Tres Caídas de la Hermandad de la Esperanza de Triana.','published',now(),now());
INSERT INTO marches(entity_id,composition_year,music_type,description,eligible_for_daily) VALUES('14207a63-0863-4c62-a6ad-85e35d6584a6',1996,'Banda de Música','Marcha para banda de música de Ángel Alcaide Barroso Vázquez dedicada al Santísimo Cristo de las Tres Caídas de la Hermandad de la Esperanza de Triana. Incluida en el programa del concierto de Santa Ana en la Capilla de los Marineros del 9 de octubre de 2026.',false);
INSERT INTO march_authors(march_entity_id,agent_entity_id,author_role,status) VALUES('14207a63-0863-4c62-a6ad-85e35d6584a6','616c8db3-41ca-4f6d-90e2-b10b08d1a312','composer','published');
INSERT INTO source_links(source_id,entity_id,scope) VALUES('63ffc2bb-93ec-4eab-85a1-411f4760de0b','14207a63-0863-4c62-a6ad-85e35d6584a6','Patrimonio musical'),('4cfbcd58-9369-44f4-a437-d624fbebc171','14207a63-0863-4c62-a6ad-85e35d6584a6','Programa del concierto');
WITH d AS (
INSERT INTO march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,dedication_text,date_from_text,status)
SELECT '14207a63-0863-4c62-a6ad-85e35d6584a6','f3f06e37-23cd-4ab4-8129-21c9f8acadd3','dedicated_to','Marcha para banda de música de Ángel Alcaide Barroso Vázquez dedicada al Santísimo Cristo de las Tres Caídas de la Hermandad de la Esperanza de Triana.','1996','published'
WHERE NOT EXISTS(SELECT 1 FROM march_dedications WHERE march_entity_id='14207a63-0863-4c62-a6ad-85e35d6584a6' AND dedicatee_entity_id='f3f06e37-23cd-4ab4-8129-21c9f8acadd3') RETURNING id)
INSERT INTO source_links(source_id,march_dedication_id,scope) SELECT '63ffc2bb-93ec-4eab-85a1-411f4760de0b',id,'Dedicatoria' FROM d;
INSERT INTO entities(id,entity_type,name,slug,summary,status,content_updated_at,editorial_reviewed_at) VALUES('c9a6941e-4047-4d51-ab28-4b1883321914','march','Yo soy la Esperanza','yo-soy-la-esperanza-daniel-albarran','Marcha de Daniel Albarrán Acosta dedicada a Nuestra Señora de la Esperanza de Triana.','published',now(),now());
INSERT INTO marches(entity_id,composition_year,music_type,description,eligible_for_daily) VALUES('c9a6941e-4047-4d51-ab28-4b1883321914',2015,'Banda de Música','Marcha de Daniel Albarrán Acosta dedicada a Nuestra Señora de la Esperanza de Triana. Incluida en el programa del concierto de Santa Ana en la Capilla de los Marineros del 9 de octubre de 2026.',false);
INSERT INTO march_authors(march_entity_id,agent_entity_id,author_role,status) VALUES('c9a6941e-4047-4d51-ab28-4b1883321914','d87b6f73-60a5-4b9a-9919-414954ee1da9','composer','published');
INSERT INTO source_links(source_id,entity_id,scope) VALUES('5e9014dc-5628-45e4-a71b-2ec42ba3ab22','c9a6941e-4047-4d51-ab28-4b1883321914','Patrimonio musical'),('4cfbcd58-9369-44f4-a437-d624fbebc171','c9a6941e-4047-4d51-ab28-4b1883321914','Programa del concierto');
WITH d AS (
INSERT INTO march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,dedication_text,date_from_text,status)
SELECT 'c9a6941e-4047-4d51-ab28-4b1883321914','f3f06e37-23cd-4ab4-8129-21c9f8acadd3','dedicated_to','Marcha de Daniel Albarrán Acosta dedicada a Nuestra Señora de la Esperanza de Triana.','2015','published'
WHERE NOT EXISTS(SELECT 1 FROM march_dedications WHERE march_entity_id='c9a6941e-4047-4d51-ab28-4b1883321914' AND dedicatee_entity_id='f3f06e37-23cd-4ab4-8129-21c9f8acadd3') RETURNING id)
INSERT INTO source_links(source_id,march_dedication_id,scope) SELECT '5e9014dc-5628-45e4-a71b-2ec42ba3ab22',id,'Dedicatoria' FROM d;
DO $$ BEGIN
UPDATE marches SET composition_year=2003,description='Marcha de José de la Vega Sánchez dedicada a Nuestra Señora de la Esperanza de Triana. Incluida en el programa del concierto de Santa Ana en la Capilla de los Marineros del 9 de octubre de 2026. Interpretada en la procesión triunfal de la Divina Pastora de Cantillana de 2026.' WHERE entity_id='b38dc0b2-f79b-49c6-9d3d-5a1d869fdaab' AND composition_year IS NULL AND description IS NOT DISTINCT FROM 'Interpretada en la procesión triunfal de la Divina Pastora de Cantillana de 2026.';
IF NOT FOUND THEN RAISE EXCEPTION 'Marcha modificada concurrentemente: b38dc0b2-f79b-49c6-9d3d-5a1d869fdaab'; END IF;
UPDATE entities SET name='Triana, tu Esperanza',summary='Marcha de José de la Vega Sánchez dedicada a Nuestra Señora de la Esperanza de Triana.',content_updated_at=now(),editorial_reviewed_at=now() WHERE id='b38dc0b2-f79b-49c6-9d3d-5a1d869fdaab' AND name='Triana, tú Esperanza' AND summary IS NOT DISTINCT FROM 'Obra documentada en el repertorio interpretado tras la Divina Pastora de Cantillana el 8 de septiembre de 2026.';
IF NOT FOUND THEN RAISE EXCEPTION 'Entidad modificada concurrentemente: b38dc0b2-f79b-49c6-9d3d-5a1d869fdaab'; END IF;
END $$;
INSERT INTO source_links(source_id,entity_id,scope) VALUES('5e9014dc-5628-45e4-a71b-2ec42ba3ab22','b38dc0b2-f79b-49c6-9d3d-5a1d869fdaab','Patrimonio musical'),('4cfbcd58-9369-44f4-a437-d624fbebc171','b38dc0b2-f79b-49c6-9d3d-5a1d869fdaab','Programa del concierto');
WITH d AS (
INSERT INTO march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,dedication_text,date_from_text,status)
SELECT 'b38dc0b2-f79b-49c6-9d3d-5a1d869fdaab','f3f06e37-23cd-4ab4-8129-21c9f8acadd3','dedicated_to','Marcha de José de la Vega Sánchez dedicada a Nuestra Señora de la Esperanza de Triana.','2003','published'
WHERE NOT EXISTS(SELECT 1 FROM march_dedications WHERE march_entity_id='b38dc0b2-f79b-49c6-9d3d-5a1d869fdaab' AND dedicatee_entity_id='f3f06e37-23cd-4ab4-8129-21c9f8acadd3') RETURNING id)
INSERT INTO source_links(source_id,march_dedication_id,scope) SELECT '5e9014dc-5628-45e4-a71b-2ec42ba3ab22',id,'Dedicatoria' FROM d;
DO $$ BEGIN
UPDATE marches SET composition_year=2012,description='Marcha de Jesús Joaquín Espinosa de los Monteros Pérez dedicada a Nuestra Señora de la Esperanza de Triana. Incluida en el programa del concierto de Santa Ana en la Capilla de los Marineros del 9 de octubre de 2026. Interpretada en la procesión triunfal de la Divina Pastora de Cantillana de 2026.' WHERE entity_id='bf3ec24f-6026-4690-ad4f-e7e3920f158f' AND composition_year IS NULL AND description IS NOT DISTINCT FROM 'Interpretada en la procesión triunfal de la Divina Pastora de Cantillana de 2026.';
IF NOT FOUND THEN RAISE EXCEPTION 'Marcha modificada concurrentemente: bf3ec24f-6026-4690-ad4f-e7e3920f158f'; END IF;
UPDATE entities SET name='Siempre la Esperanza',summary='Marcha de Jesús Joaquín Espinosa de los Monteros Pérez dedicada a Nuestra Señora de la Esperanza de Triana.',content_updated_at=now(),editorial_reviewed_at=now() WHERE id='bf3ec24f-6026-4690-ad4f-e7e3920f158f' AND name='Siempre la Esperanza' AND summary IS NOT DISTINCT FROM 'Obra documentada en el repertorio interpretado tras la Divina Pastora de Cantillana el 8 de septiembre de 2026.';
IF NOT FOUND THEN RAISE EXCEPTION 'Entidad modificada concurrentemente: bf3ec24f-6026-4690-ad4f-e7e3920f158f'; END IF;
END $$;
INSERT INTO source_links(source_id,entity_id,scope) VALUES('5e9014dc-5628-45e4-a71b-2ec42ba3ab22','bf3ec24f-6026-4690-ad4f-e7e3920f158f','Patrimonio musical'),('4cfbcd58-9369-44f4-a437-d624fbebc171','bf3ec24f-6026-4690-ad4f-e7e3920f158f','Programa del concierto');
WITH d AS (
INSERT INTO march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,dedication_text,date_from_text,status)
SELECT 'bf3ec24f-6026-4690-ad4f-e7e3920f158f','f3f06e37-23cd-4ab4-8129-21c9f8acadd3','dedicated_to','Marcha de Jesús Joaquín Espinosa de los Monteros Pérez dedicada a Nuestra Señora de la Esperanza de Triana.','2012','published'
WHERE NOT EXISTS(SELECT 1 FROM march_dedications WHERE march_entity_id='bf3ec24f-6026-4690-ad4f-e7e3920f158f' AND dedicatee_entity_id='f3f06e37-23cd-4ab4-8129-21c9f8acadd3') RETURNING id)
INSERT INTO source_links(source_id,march_dedication_id,scope) SELECT '5e9014dc-5628-45e4-a71b-2ec42ba3ab22',id,'Dedicatoria' FROM d;
DO $$ BEGIN
UPDATE marches SET composition_year=2019,description='Marcha para banda de música de David Hurtado Torres dedicada a Nuestra Señora de la Esperanza de Triana. Incluida en el programa del concierto de Santa Ana en la Capilla de los Marineros del 9 de octubre de 2026. Interpretada en la procesión triunfal de la Divina Pastora de Cantillana de 2026.' WHERE entity_id='7557fb74-5f52-45a7-b49a-fc86ed8f88c1' AND composition_year IS NULL AND description IS NOT DISTINCT FROM 'Interpretada en la procesión triunfal de la Divina Pastora de Cantillana de 2026.';
IF NOT FOUND THEN RAISE EXCEPTION 'Marcha modificada concurrentemente: 7557fb74-5f52-45a7-b49a-fc86ed8f88c1'; END IF;
UPDATE entities SET name='Se arrodilla Triana',summary='Marcha para banda de música de David Hurtado Torres dedicada a Nuestra Señora de la Esperanza de Triana.',content_updated_at=now(),editorial_reviewed_at=now() WHERE id='7557fb74-5f52-45a7-b49a-fc86ed8f88c1' AND name='Se arrodilla Triana' AND summary IS NOT DISTINCT FROM 'Obra documentada en el repertorio interpretado tras la Divina Pastora de Cantillana el 8 de septiembre de 2026.';
IF NOT FOUND THEN RAISE EXCEPTION 'Entidad modificada concurrentemente: 7557fb74-5f52-45a7-b49a-fc86ed8f88c1'; END IF;
END $$;
INSERT INTO source_links(source_id,entity_id,scope) VALUES('5e9014dc-5628-45e4-a71b-2ec42ba3ab22','7557fb74-5f52-45a7-b49a-fc86ed8f88c1','Patrimonio musical'),('4cfbcd58-9369-44f4-a437-d624fbebc171','7557fb74-5f52-45a7-b49a-fc86ed8f88c1','Programa del concierto');
WITH d AS (
INSERT INTO march_dedications(march_entity_id,dedicatee_entity_id,dedication_type,dedication_text,date_from_text,status)
SELECT '7557fb74-5f52-45a7-b49a-fc86ed8f88c1','f3f06e37-23cd-4ab4-8129-21c9f8acadd3','dedicated_to','Marcha para banda de música de David Hurtado Torres dedicada a Nuestra Señora de la Esperanza de Triana.','2019','published'
WHERE NOT EXISTS(SELECT 1 FROM march_dedications WHERE march_entity_id='7557fb74-5f52-45a7-b49a-fc86ed8f88c1' AND dedicatee_entity_id='f3f06e37-23cd-4ab4-8129-21c9f8acadd3') RETURNING id)
INSERT INTO source_links(source_id,march_dedication_id,scope) SELECT '5e9014dc-5628-45e4-a71b-2ec42ba3ab22',id,'Dedicatoria' FROM d;
INSERT INTO source_links(source_id,entity_id,scope) VALUES('4cfbcd58-9369-44f4-a437-d624fbebc171','f3f06e37-23cd-4ab4-8129-21c9f8acadd3','Programa de Santa Ana · patrimonio musical');
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id='f3f06e37-23cd-4ab4-8129-21c9f8acadd3';
INSERT INTO audit_log(actor_label,action_type,object_type,entity_id,summary,changed_fields) VALUES('Hilo Cofrade · revisión editorial','update','brotherhood','f3f06e37-23cd-4ab4-8129-21c9f8acadd3','Patrimonio musical desde programa Santa Ana 9/10/2026: dos marchas nuevas, seis ampliadas y siete dedicatorias. Soleá conserva vínculo histórico sin dedicatoria formal.','{"new_marches":2,"enriched":6,"dedications":7,"programme":["Triana de Esperanza","Soleá, dame la mano","La Esperanza de Triana","Cristo de las Tres Caídas","Yo soy la Esperanza","Triana, tu Esperanza","Siempre la Esperanza","Se arrodilla Triana"]}'::jsonb);
-- Insertar después del DML y antes de ROLLBACK/COMMIT en la misma transacción.
DO $hc016_types$
DECLARE
  target_ids uuid[] := ARRAY['f3f06e37-23cd-4ab4-8129-21c9f8acadd3']::uuid[];
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

DO $$ BEGIN
IF (SELECT count(*) FROM march_dedications WHERE dedicatee_entity_id='f3f06e37-23cd-4ab4-8129-21c9f8acadd3' AND march_entity_id IN ('64c18d72-705c-4456-9fa2-21ab7f2d7072','f8d09b0c-a76c-4737-8e4f-a2199a4e6f0f','14207a63-0863-4c62-a6ad-85e35d6584a6','c9a6941e-4047-4d51-ab28-4b1883321914','b38dc0b2-f79b-49c6-9d3d-5a1d869fdaab','bf3ec24f-6026-4690-ad4f-e7e3920f158f','7557fb74-5f52-45a7-b49a-fc86ed8f88c1')) <> 7 THEN RAISE EXCEPTION 'Dedicatorias incompletas'; END IF;
IF EXISTS(SELECT 1 FROM march_dedications WHERE march_entity_id='fcc73b91-38f4-48ed-90cd-5c7fbdb0bc9f' AND dedicatee_entity_id='f3f06e37-23cd-4ab4-8129-21c9f8acadd3') THEN RAISE EXCEPTION 'No atribuir dedicatoria formal de Solea'; END IF;
END $$;
SELECT 'MUSICA_ESPERANZA_OK' AS resultado;
ROLLBACK;
