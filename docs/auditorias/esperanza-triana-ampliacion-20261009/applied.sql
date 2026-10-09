-- HISTÓRICO: ya aplicado y verificado el 9/10/2026. NO REEJECUTAR.
-- Se conserva con cierre ROLLBACK por seguridad documental.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='45s';
DO $u$ BEGIN UPDATE steps SET description='Paso de Manuel Guzmán Bejarano, realizado por fases entre 1970 y 1973: respiraderos en 1970, canastilla y candelabros en 1971, y dorado de Antonio Sánchez y cartelas de plata de Villarreal en 1973. Los faldones bordados de los talleres de Caro, según dibujo de Juan Antonio Borrero, se incorporaron en 1993–1994.',execution_date_text='1970–1973; faldones de 1993–1994',materials='Madera tallada y dorada, cartelas de plata y faldones de terciopelo burdeos bordado' WHERE entity_id='75f532f3-f458-47e6-a18b-f7d5a3e9c799' AND description IS NOT DISTINCT FROM 'Paso de misterio del Santísimo Cristo de las Tres Caídas, con una historia material documentada desde comienzos del siglo XVIII.' AND execution_date_text IS NOT DISTINCT FROM NULL AND materials IS NOT DISTINCT FROM NULL; IF NOT FOUND THEN RAISE EXCEPTION 'drift 75f532f3-f458-47e6-a18b-f7d5a3e9c799'; END IF; END $u$;
DO $u$ BEGIN UPDATE steps SET description='Palio regionalista de inspiración cerámica trianera y simbología marinera. Su evolución reúne diseños de José Recio del Rivero y labores de Miguel Olmo, Santa Isabel y los talleres de Caro. Las bambalinas exteriores son de Caro (1971) y las interiores de Santa Isabel (1951). Los varales de plata son de Orfebrería Triana (1988), la peana de Villarreal (1962) y la candelería, de noventa piezas, de Orfebrería Triana (1991).',execution_date_text='Conjunto formado y enriquecido por fases durante el siglo XX',materials='Orfebrería en plata de ley y bordados en oro y sedas, con terciopelo y malla' WHERE entity_id='81f272ef-3d6c-41cd-a0cd-251fe7990231' AND description IS NOT DISTINCT FROM 'Conjunto regionalista inspirado en la cerámica y la simbología marinera de Triana.' AND execution_date_text IS NOT DISTINCT FROM NULL AND materials IS NOT DISTINCT FROM 'Orfebrería y bordados'; IF NOT FOUND THEN RAISE EXCEPTION 'drift 81f272ef-3d6c-41cd-a0cd-251fe7990231'; END IF; END $u$;
DO $u$ BEGIN UPDATE images SET description='Nazareno caído de comienzos del siglo XVII, de autoría no documentada. La atribución tradicional a Marcos Cabrera ha sido discutida por estudios posteriores; la web de la Hermandad propone una datación entre 1608 y 1616. Apoya la rodilla y la mano derechas en el suelo, mientras sostiene la cruz con la izquierda.',execution_date_text='Comienzos del siglo XVII; propuesta de datación 1608–1616',iconography='Cristo caído bajo la cruz, con la pierna izquierda flexionada en ademán de incorporarse.',notes='Se conserva la atribución histórica a Marcos Cabrera como atribución, no como autoría probada. La ficha oficial también recoge la consideración de obra anónima.' WHERE entity_id='2889b9e9-8d41-447d-aed1-0922a7ae9c19' AND description IS NOT DISTINCT FROM 'Talla policromada realizada en torno a 1607 y atribuida tradicionalmente a Marcos de Cabrera.' AND execution_date_text IS NOT DISTINCT FROM 'En torno a 1607' AND iconography IS NOT DISTINCT FROM NULL AND notes IS NOT DISTINCT FROM NULL; IF NOT FOUND THEN RAISE EXCEPTION 'drift 2889b9e9-8d41-447d-aed1-0922a7ae9c19'; END IF; END $u$;
DO $u$ BEGIN UPDATE images SET height_cm=170,anatomical_type='Candelero',description='Dolorosa de 1,70 m y autoría incierta, con rasgos formales del siglo XVII. Su aspecto actual es fruto de sucesivas intervenciones: Gumersindo Jiménez Astorga tras el incendio de 1898, José Ordóñez en 1913 y Castillo Lastrucci en 1929. Luis Álvarez Duarte sustituyó el candelero y los brazos en 1981.',iconography='Dolorosa de vestir; la disposición tradicional de sus manos ofrece el pañuelo al pueblo y señala el ancla de la pechera.' WHERE entity_id='8acc8be8-ad29-4fc6-a778-8688920a32fc' AND height_cm IS NOT DISTINCT FROM NULL AND anatomical_type IS NOT DISTINCT FROM NULL AND description IS NOT DISTINCT FROM 'Dolorosa de 1,70 m que conserva cuerpo y cuello de origen y responde a rasgos formales del siglo XVII; su autoría permanece incierta.' AND iconography IS NOT DISTINCT FROM NULL; IF NOT FOUND THEN RAISE EXCEPTION 'drift 8acc8be8-ad29-4fc6-a778-8688920a32fc'; END IF; END $u$;
DO $u$ BEGIN UPDATE image_authorships SET notes='Atribución histórica a Marcos Cabrera sin respaldo documental, discutida por parte de la historiografía recogida en la web oficial. Se conserva como atribución, no como autoría probada.',date_from_text='Comienzos del siglo XVII' WHERE id='889793a0-d2e9-4066-a6e4-e5552096841f' AND notes IS NOT DISTINCT FROM 'Atribución mantenida por especialistas; no consta documentación de autoría.' AND date_from_text IS NOT DISTINCT FROM 'En torno a 1607'; IF NOT FOUND THEN RAISE EXCEPTION 'drift 889793a0-d2e9-4066-a6e4-e5552096841f'; END IF; END $u$;
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

UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id IN ('f3f06e37-23cd-4ab4-8129-21c9f8acadd3','8acc8be8-ad29-4fc6-a778-8688920a32fc','2889b9e9-8d41-447d-aed1-0922a7ae9c19','81f272ef-3d6c-41cd-a0cd-251fe7990231','75f532f3-f458-47e6-a18b-f7d5a3e9c799');
INSERT INTO audit_log(actor_label,action_type,object_type,object_id,entity_id,summary) VALUES ('Codex · web oficial 9/10/2026','update','brotherhood','f3f06e37-23cd-4ab4-8129-21c9f8acadd3','f3f06e37-23cd-4ab4-8129-21c9f8acadd3','Esperanza de Triana: amplía dos pasos y dos titulares; matiza atribución histórica del Cristo sin declararla probada.');
SELECT 'ESPERANZA_TRIANA_OK' result;

ROLLBACK;
