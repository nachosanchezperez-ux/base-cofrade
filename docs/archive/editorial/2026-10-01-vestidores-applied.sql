-- HISTÓRICO: APLICADO Y COMMIT CONFIRMADO EL 2026-10-01. NO REEJECUTAR.
-- Fuera de supabase/migrations: no es migración ni cola ejecutable.
-- CICLO 1: continuación autorizada por el usuario el 1/10/2026.
-- Apply acotado: 6 INSERT disciplinas + 3 INSERT fuentes.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
DO $guard$
BEGIN
  IF (SELECT count(*) FROM (VALUES ('820efd82-7b76-4b7f-9636-f82c2f7139bb'::uuid,'Antonio Bejarano Ruiz',true,'Fuente primaria San José Obrero: auxiliares de la Junta; ámbito limitado a las imágenes documentadas.'),
('d96aa7c8-bf49-4028-96e2-eddfa06fce96'::uuid,'Antonio Jesús del Castillo Fernández',true,'Fuente primaria La Cena: datos de la cofradía 2023; no se amplía ni se altera la vigencia de las relaciones.'),
('07a19f3a-1f6f-4996-b189-4019e00daaea'::uuid,'Leandro González Ruiz',true,'Fuente primaria La Milagrosa: nombramiento de 1/12/2025; ratificación de La Estrella de 23/7/2025.'),
('ee85cb65-95b5-4da4-8106-536e4ee60ea2'::uuid,'Manuel Vespia Román',true,'Fuente primaria Torreblanca: ficha de la cofradía de 28/3/2026.'),
('f53ed7b5-c819-4c96-9a0e-cca0c32e6ea4'::uuid,'José Manuel Lozano Rivero',true,'Fuente primaria San Bernardo: renovación acordada el 14/7/2025 y publicada el 15/7/2025.'),
('64b7fcf0-376a-40ec-b197-8e2d629ad88b'::uuid,'José Antonio Grande de León',false,'Actividad de vestidor documentada en su web profesional; se conserva Bordado como principal. No se generaliza la vigencia de cada imagen.')) v(id,name,primary_flag,note)
      JOIN public.entities e ON e.id=v.id AND e.name=v.name AND e.status='published') <> 6 THEN
    RAISE EXCEPTION 'Ha cambiado el universo de seis agentes';
  END IF;
  IF EXISTS (SELECT 1 FROM public.agent_disciplines d JOIN (VALUES ('820efd82-7b76-4b7f-9636-f82c2f7139bb'::uuid,'Antonio Bejarano Ruiz',true,'Fuente primaria San José Obrero: auxiliares de la Junta; ámbito limitado a las imágenes documentadas.'),
('d96aa7c8-bf49-4028-96e2-eddfa06fce96'::uuid,'Antonio Jesús del Castillo Fernández',true,'Fuente primaria La Cena: datos de la cofradía 2023; no se amplía ni se altera la vigencia de las relaciones.'),
('07a19f3a-1f6f-4996-b189-4019e00daaea'::uuid,'Leandro González Ruiz',true,'Fuente primaria La Milagrosa: nombramiento de 1/12/2025; ratificación de La Estrella de 23/7/2025.'),
('ee85cb65-95b5-4da4-8106-536e4ee60ea2'::uuid,'Manuel Vespia Román',true,'Fuente primaria Torreblanca: ficha de la cofradía de 28/3/2026.'),
('f53ed7b5-c819-4c96-9a0e-cca0c32e6ea4'::uuid,'José Manuel Lozano Rivero',true,'Fuente primaria San Bernardo: renovación acordada el 14/7/2025 y publicada el 15/7/2025.'),
('64b7fcf0-376a-40ec-b197-8e2d629ad88b'::uuid,'José Antonio Grande de León',false,'Actividad de vestidor documentada en su web profesional; se conserva Bordado como principal. No se generaliza la vigencia de cada imagen.')) v(id,name,primary_flag,note)
     ON d.agent_entity_id=v.id WHERE lower(d.discipline)='vestidor' OR (v.primary_flag AND d.is_primary)) THEN
    RAISE EXCEPTION 'Disciplina ya existente o principal en conflicto';
  END IF;
  IF (SELECT count(*) FROM public.agent_disciplines WHERE agent_entity_id='64b7fcf0-376a-40ec-b197-8e2d629ad88b' AND discipline='Bordado' AND is_primary)<>1 THEN
    RAISE EXCEPTION 'Grande de León ya no conserva la principal auditada';
  END IF;
  IF (SELECT count(*) FROM (VALUES ('d96aa7c8-bf49-4028-96e2-eddfa06fce96'::uuid,'c9297069-36c3-415f-a447-ac3ccf155bf7'::uuid),
('ee85cb65-95b5-4da4-8106-536e4ee60ea2'::uuid,'c4e50255-8c85-478f-a075-ad0324dd2b85'::uuid),
('f53ed7b5-c819-4c96-9a0e-cca0c32e6ea4'::uuid,'4565ecf1-7774-49ad-991e-1d8cb70b6202'::uuid)) v(agent_id,source_id) JOIN public.sources s ON s.id=v.source_id)<>3 THEN
    RAISE EXCEPTION 'Falta una fuente existente';
  END IF;
  IF EXISTS (SELECT 1 FROM public.source_links sl JOIN (VALUES ('d96aa7c8-bf49-4028-96e2-eddfa06fce96'::uuid,'c9297069-36c3-415f-a447-ac3ccf155bf7'::uuid),
('ee85cb65-95b5-4da4-8106-536e4ee60ea2'::uuid,'c4e50255-8c85-478f-a075-ad0324dd2b85'::uuid),
('f53ed7b5-c819-4c96-9a0e-cca0c32e6ea4'::uuid,'4565ecf1-7774-49ad-991e-1d8cb70b6202'::uuid)) v(agent_id,source_id)
     ON sl.entity_id=v.agent_id AND sl.source_id=v.source_id) THEN
    RAISE EXCEPTION 'Ya existe un enlace directo de fuente; recalcular lote';
  END IF;
END $guard$;
WITH inserted AS (
INSERT INTO public.agent_disciplines (agent_entity_id,discipline,is_primary,notes)
SELECT id,'Vestidor',primary_flag,note FROM (VALUES ('820efd82-7b76-4b7f-9636-f82c2f7139bb'::uuid,'Antonio Bejarano Ruiz',true,'Fuente primaria San José Obrero: auxiliares de la Junta; ámbito limitado a las imágenes documentadas.'),
('d96aa7c8-bf49-4028-96e2-eddfa06fce96'::uuid,'Antonio Jesús del Castillo Fernández',true,'Fuente primaria La Cena: datos de la cofradía 2023; no se amplía ni se altera la vigencia de las relaciones.'),
('07a19f3a-1f6f-4996-b189-4019e00daaea'::uuid,'Leandro González Ruiz',true,'Fuente primaria La Milagrosa: nombramiento de 1/12/2025; ratificación de La Estrella de 23/7/2025.'),
('ee85cb65-95b5-4da4-8106-536e4ee60ea2'::uuid,'Manuel Vespia Román',true,'Fuente primaria Torreblanca: ficha de la cofradía de 28/3/2026.'),
('f53ed7b5-c819-4c96-9a0e-cca0c32e6ea4'::uuid,'José Manuel Lozano Rivero',true,'Fuente primaria San Bernardo: renovación acordada el 14/7/2025 y publicada el 15/7/2025.'),
('64b7fcf0-376a-40ec-b197-8e2d629ad88b'::uuid,'José Antonio Grande de León',false,'Actividad de vestidor documentada en su web profesional; se conserva Bordado como principal. No se generaliza la vigencia de cada imagen.')) v(id,name,primary_flag,note)
RETURNING agent_entity_id,discipline,is_primary
) SELECT 'disciplinas_insertadas' AS check_name,count(*) AS operations FROM inserted;
WITH inserted AS (
INSERT INTO public.source_links (source_id,entity_id,scope,notes)
SELECT source_id,agent_id,'Oficio documentado: Vestidor','AUDITORIA-0-AUTORES-20260930: fuente primaria ya existente; oficio y vinculación específica, sin inferir trayectoria ni fechas.'
FROM (VALUES ('d96aa7c8-bf49-4028-96e2-eddfa06fce96'::uuid,'c9297069-36c3-415f-a447-ac3ccf155bf7'::uuid),
('ee85cb65-95b5-4da4-8106-536e4ee60ea2'::uuid,'c4e50255-8c85-478f-a075-ad0324dd2b85'::uuid),
('f53ed7b5-c819-4c96-9a0e-cca0c32e6ea4'::uuid,'4565ecf1-7774-49ad-991e-1d8cb70b6202'::uuid)) v(agent_id,source_id)
RETURNING entity_id
) SELECT 'fuentes_insertadas' AS check_name,count(*) AS operations FROM inserted;
SELECT 'QA_principales' AS check_name, e.name,count(*) FILTER (WHERE d.is_primary) AS primary_count
FROM public.entities e JOIN public.agent_disciplines d ON d.agent_entity_id=e.id
WHERE e.id IN (SELECT id FROM (VALUES ('820efd82-7b76-4b7f-9636-f82c2f7139bb'::uuid,'Antonio Bejarano Ruiz',true,'Fuente primaria San José Obrero: auxiliares de la Junta; ámbito limitado a las imágenes documentadas.'),
('d96aa7c8-bf49-4028-96e2-eddfa06fce96'::uuid,'Antonio Jesús del Castillo Fernández',true,'Fuente primaria La Cena: datos de la cofradía 2023; no se amplía ni se altera la vigencia de las relaciones.'),
('07a19f3a-1f6f-4996-b189-4019e00daaea'::uuid,'Leandro González Ruiz',true,'Fuente primaria La Milagrosa: nombramiento de 1/12/2025; ratificación de La Estrella de 23/7/2025.'),
('ee85cb65-95b5-4da4-8106-536e4ee60ea2'::uuid,'Manuel Vespia Román',true,'Fuente primaria Torreblanca: ficha de la cofradía de 28/3/2026.'),
('f53ed7b5-c819-4c96-9a0e-cca0c32e6ea4'::uuid,'José Manuel Lozano Rivero',true,'Fuente primaria San Bernardo: renovación acordada el 14/7/2025 y publicada el 15/7/2025.'),
('64b7fcf0-376a-40ec-b197-8e2d629ad88b'::uuid,'José Antonio Grande de León',false,'Actividad de vestidor documentada en su web profesional; se conserva Bordado como principal. No se generaliza la vigencia de cada imagen.')) v(id,name,primary_flag,note)) GROUP BY e.id,e.name ORDER BY e.name;
DO $qa$
BEGIN
 IF (SELECT count(*) FROM public.agent_disciplines WHERE discipline='Vestidor' AND notes IN (
  'Fuente primaria San José Obrero: auxiliares de la Junta; ámbito limitado a las imágenes documentadas.',
  'Fuente primaria La Cena: datos de la cofradía 2023; no se amplía ni se altera la vigencia de las relaciones.',
  'Fuente primaria La Milagrosa: nombramiento de 1/12/2025; ratificación de La Estrella de 23/7/2025.',
  'Fuente primaria Torreblanca: ficha de la cofradía de 28/3/2026.',
  'Fuente primaria San Bernardo: renovación acordada el 14/7/2025 y publicada el 15/7/2025.',
  'Actividad de vestidor documentada en su web profesional; se conserva Bordado como principal. No se generaliza la vigencia de cada imagen.'
 )) <> 6 THEN RAISE EXCEPTION 'No hay exactamente seis disciplinas del lote'; END IF;
 IF (SELECT count(*) FROM public.source_links WHERE notes='AUDITORIA-0-AUTORES-20260930: fuente primaria ya existente; oficio y vinculación específica, sin inferir trayectoria ni fechas.') <> 3 THEN RAISE EXCEPTION 'No hay exactamente tres fuentes del lote'; END IF;
END $qa$;
SELECT 'VESTIDORES_APPLY_QA_OK' AS result,6 AS disciplines,3 AS sources,9 AS operations;
COMMIT;

