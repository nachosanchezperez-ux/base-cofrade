-- HISTORICAL: applied, do not reapply.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='45s';
SELECT pg_advisory_xact_lock(hashtext('hilo-mision-20261008'));
DO $u$ BEGIN UPDATE public.brotherhoods SET history_text='La Archicofradía matriz del Inmaculado Corazón de María se fundó en Nuestra Señora de las Victorias de París el 11 de diciembre de 1836. La devoción tuvo una primera implantación sevillana en 1907. Tras la llegada de los claretianos a Heliópolis en 1940, la reorganización comenzó en 1948; el 27 de febrero de 1949 se celebraron las primeras imposiciones de escapularios y el 1 de marzo quedó agregada a la matriz parisina. El decreto de 25 de marzo de 1987 incorporó el carácter sacramental. El Cristo de la Misión fue bendecido el 3 de marzo de 1988 y realizó su primera salida el día 25 de ese mes. Las reglas aprobadas el 25 de diciembre de 2007 reconocieron el carácter penitencial, y la corporación estrenó túnicas el Viernes de Dolores de 2008. El fervorín de la procesión gloriosa recuerda la consagración de Heliópolis al Inmaculado Corazón de María.' WHERE entity_id='c1000000-0000-0000-0000-000000000001' AND history_text IS NOT DISTINCT FROM 'La devoción al Inmaculado Corazón de María nació en la iglesia parisina de Saint-Eugène en 1836 y tuvo una primera implantación sevillana en 1907. Tras la llegada de los claretianos a Heliópolis en 1940, la reorganización comenzó en 1948 y la Archicofradía quedó agregada y estatutariamente configurada en 1949. Incorporó su carácter sacramental en 1987 y el penitencial en 2007; estrenó túnicas el Viernes de Dolores de 2008.'; IF NOT FOUND THEN RAISE EXCEPTION 'Concurrent drift c1000000-0000-0000-0000-000000000001'; END IF; END $u$;
DO $u$ BEGIN UPDATE public.images SET anatomical_type='Talla completa',dimensions_text='Tamaño natural',iconography='San Juan representado como un adolescente, concebido para situarse a la derecha de la Virgen.',notes='Obra de Antonio Eslava Rubio de 1970. Llegó a La Misión el 28 de mayo de 1986, procedente de Jesús Despojado, donde había procesionado en el paso de palio.' WHERE entity_id='3ad88fc9-8647-4d4a-b4bb-0d61574027c4' AND anatomical_type IS NOT DISTINCT FROM NULL AND dimensions_text IS NOT DISTINCT FROM NULL AND iconography IS NOT DISTINCT FROM NULL AND notes IS NOT DISTINCT FROM 'Llegó a La Misión en 1986 procedente de Jesús Despojado.'; IF NOT FOUND THEN RAISE EXCEPTION 'Concurrent drift 3ad88fc9-8647-4d4a-b4bb-0d61574027c4'; END IF; END $u$;
DO $u$ BEGIN UPDATE public.images SET anatomical_type='Candelero',dimensions_text='Tamaño natural',iconography='Virgen Dolorosa.',notes='La titular actual fue realizada por José Manuel Bonilla Cornejo en el verano de 1999 como réplica de la imagen anterior de Miguel Laínez Capote (1967), remodelada por Alfonso Berraquero en 1975. Aquella imagen procedía de Santa Rosalía y fue cedida por Gabriel Solís Carvajal en depósito en 1983 y a perpetuidad en 1987. Las intervenciones de 1967 y 1975 corresponden a la imagen precedente.' WHERE entity_id='bf663726-2602-43df-b43d-d7911617eb8f' AND anatomical_type IS NOT DISTINCT FROM NULL AND dimensions_text IS NOT DISTINCT FROM NULL AND iconography IS NOT DISTINCT FROM NULL AND notes IS NOT DISTINCT FROM 'La imagen actual es réplica de la anterior de 1967.'; IF NOT FOUND THEN RAISE EXCEPTION 'Concurrent drift bf663726-2602-43df-b43d-d7911617eb8f'; END IF; END $u$;
DO $u$ BEGIN UPDATE public.images SET height_cm=172,dimensions_text='172 cm de altura',anatomical_type='Talla completa con brazos articulados',technique='Talla en madera policromada',iconography='Nazareno que carga la cruz sobre el hombro derecho y extiende la mano izquierda hacia el pueblo.',description='Nazareno de José Manuel Bonilla Cornejo, entregado en 1988. Representa el encuentro con su Madre y las Santas Mujeres. La peana incorpora piedras de la Vía Sacra y una lagartija tallada junto al pie derecho identifica la firma del escultor.' WHERE entity_id='7219955c-09d9-4917-828a-545d0dee7ec7' AND height_cm IS NOT DISTINCT FROM NULL AND dimensions_text IS NOT DISTINCT FROM NULL AND anatomical_type IS NOT DISTINCT FROM NULL AND technique IS NOT DISTINCT FROM NULL AND iconography IS NOT DISTINCT FROM NULL AND description IS NOT DISTINCT FROM 'Nazareno de talla completa salvo los brazos articulados, con la cruz sobre el hombro derecho.'; IF NOT FOUND THEN RAISE EXCEPTION 'Concurrent drift 7219955c-09d9-4917-828a-545d0dee7ec7'; END IF; END $u$;
DO $u$ BEGIN UPDATE public.images SET dimensions_text='165 × 80 × 79 cm',technique='Talla en madera, policromía al óleo, dorado y estofado',polychromy='Al óleo, con dorado y estofado',anatomical_type='Talla completa sedente',iconography='Virgen sentada sobre un escabel con el Niño Jesús sobre las rodillas en actitud de bendecir.',description='Obra neobarroca de Rafael Barbero Medina, realizada en 1960. Durante su procesión los hermanos colocan en las manos de la Virgen el escapulario cordimariano.' WHERE entity_id='456764e0-88c1-4814-ad7b-9dab1e030269' AND dimensions_text IS NOT DISTINCT FROM NULL AND technique IS NOT DISTINCT FROM NULL AND polychromy IS NOT DISTINCT FROM NULL AND anatomical_type IS NOT DISTINCT FROM NULL AND iconography IS NOT DISTINCT FROM NULL AND description IS NOT DISTINCT FROM 'Imagen neobarroca sedente del Inmaculado Corazón de María con el Niño Jesús.'; IF NOT FOUND THEN RAISE EXCEPTION 'Concurrent drift 456764e0-88c1-4814-ad7b-9dab1e030269'; END IF; END $u$;
DO $u$ BEGIN UPDATE public.brotherhood_habits SET notes='Indumentaria penitencial. Las normas oficiales prohíben los guantes de cualquier color. La medalla se lleva sobre el escapulario. Se permite realizar la estación descalzo, sin calcetines.',cord_description='Cíngulo de seda trenzada, con un hilo blanco y dos azul pavo, rematado en borlas y anudado al lado izquierdo.',hood_description='Antifaz azul pavo con el escudo a la altura del pecho; capirote de hasta 70 cm.',tunic_description='Túnica de sarga blanca sin cola, con escapulario azul pavo hasta las rodillas y de hasta 30 cm de ancho.' WHERE id='4c1f4a4a-cee0-4075-902a-1043a33c0b2b' AND notes IS NOT DISTINCT FROM 'Indumentaria penitencial.' AND cord_description IS NOT DISTINCT FROM 'Cíngulo azul y blanco.' AND hood_description IS NOT DISTINCT FROM 'Antifaz azul pavo.' AND tunic_description IS NOT DISTINCT FROM 'Túnica de sarga blanca con escapulario azul pavo.'; IF NOT FOUND THEN RAISE EXCEPTION 'Concurrent drift 4c1f4a4a-cee0-4075-902a-1043a33c0b2b'; END IF; END $u$;
-- Insertar después del DML y antes de ROLLBACK/COMMIT en la misma transacción.
DO $hc016_types$
DECLARE
  target_ids uuid[] := ARRAY['c1000000-0000-0000-0000-000000000001']::uuid[];
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
DO $v$ BEGIN IF (select brotherhood_types from brotherhoods where entity_id='c1000000-0000-0000-0000-000000000001') IS DISTINCT FROM ARRAY['Gloria','Sacramental','Penitencia']::text[] THEN RAISE EXCEPTION 'types drift'; END IF; END $v$;
UPDATE entities SET content_updated_at=now(),editorial_reviewed_at=now() WHERE id IN ('c1000000-0000-0000-0000-000000000001','3ad88fc9-8647-4d4a-b4bb-0d61574027c4','bf663726-2602-43df-b43d-d7911617eb8f','7219955c-09d9-4917-828a-545d0dee7ec7','456764e0-88c1-4814-ad7b-9dab1e030269');
INSERT INTO audit_log(actor_label,action_type,object_type,object_id,entity_id,summary,changed_fields) VALUES ('Codex · web oficial 8/10/2026','update','brotherhood','c1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000001','La Misión: corrección de historia, ampliación técnica de cuatro titulares y normas del hábito.','{"operation":"MISION-AMPLIACION-20261008","updates":6,"preserved":{"cults":"b34c3c7fd7d09decf618ee1a831fb4cc","music":"b1613fc964bfbc9163a144c4616f4833","outings":"5bdadd3ca57de55380a105a8a0746f6a"}}'::jsonb);
SELECT 'MISION_AMPLIACION_OK' result;
ROLLBACK;
BEGIN;
DO $u$ BEGIN UPDATE brotherhood_habits SET tunic_description='Túnica de sarga blanca sin cola, con escapulario azul pavo hasta las rodillas y de hasta 30 cm de ancho. No se permite llevar guantes de ningún color.' WHERE id='4c1f4a4a-cee0-4075-902a-1043a33c0b2b' AND tunic_description IS NOT DISTINCT FROM 'Túnica de sarga blanca sin cola, con escapulario azul pavo hasta las rodillas y de hasta 30 cm de ancho.'; IF NOT FOUND THEN RAISE EXCEPTION 'drift'; END IF; END $u$;
DO $u$ BEGIN UPDATE images SET description='Dolorosa de candelero a tamaño natural, realizada por José Manuel Bonilla Cornejo en 1999 como réplica de la imagen de Miguel Laínez Capote de 1967, remodelada por Alfonso Berraquero en 1975.' WHERE entity_id='bf663726-2602-43df-b43d-d7911617eb8f' AND description IS NOT DISTINCT FROM 'Dolorosa de candelero a tamaño natural.'; IF NOT FOUND THEN RAISE EXCEPTION 'drift'; END IF; END $u$;
DO $u$ BEGIN UPDATE images SET description='San Juan adolescente, de talla completa, realizado por Antonio Eslava Rubio en 1970. Llegó a La Misión el 28 de mayo de 1986 desde Jesús Despojado, en cuyo palio había procesionado.' WHERE entity_id='3ad88fc9-8647-4d4a-b4bb-0d61574027c4' AND description IS NOT DISTINCT FROM 'San Juan Evangelista representado como un joven adolescente.'; IF NOT FOUND THEN RAISE EXCEPTION 'drift'; END IF; END $u$;
-- Insertar después del DML y antes de ROLLBACK/COMMIT en la misma transacción.
DO $hc016_types$
DECLARE
  target_ids uuid[] := ARRAY['c1000000-0000-0000-0000-000000000001']::uuid[];
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

INSERT INTO audit_log(actor_label,action_type,object_type,object_id,entity_id,summary) VALUES ('Codex','update','brotherhood','c1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000001','La Misión: lleva la precisión de las notas a campos descriptivos públicos del hábito, Amparo y San Juan.');
SELECT 'MISION_PUBLIC_FIELDS_OK' result;
ROLLBACK;
