-- Hilo Cofrade · San Benito · consolidación de identidad y Pasos
-- Migración 048
--
-- Corrige la duplicidad introducida por la carga técnica de Encarnación (042)
-- cuando ya existía un borrador real de San Benito creado desde el Panel.
--
-- Registro canónico de la Hermandad:
--   206cf962-fd63-4fae-ad0d-9454554283d8
-- Registro técnico duplicado:
--   a4220000-0000-0000-0000-000000000004
--
-- También consolida los dos Pasos técnicos duplicados de 042 sobre los Pasos
-- que ya existían y estaban relacionados con sus Imágenes.
--
-- Principio: mover relaciones y fuentes antes de borrar; abortar si queda una
-- referencia viva a cualquier duplicado.

begin;

-- -----------------------------------------------------------------------------
-- PRECONDICIONES
-- -----------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from public.entities
    where id = '206cf962-fd63-4fae-ad0d-9454554283d8'
      and entity_type = 'brotherhood'
  ) then
    raise exception '048: no existe el registro canónico de San Benito';
  end if;

  if not exists (
    select 1 from public.entities
    where id = 'a4220000-0000-0000-0000-000000000004'
      and entity_type = 'brotherhood'
  ) then
    raise exception '048: no existe el registro duplicado de San Benito que se esperaba consolidar';
  end if;

  if not exists (
    select 1 from public.entities
    where id = '2c49d077-e377-492d-8e30-25fa823bdcd8'
      and entity_type = 'step'
  ) then
    raise exception '048: falta el Paso canónico de la Sagrada Presentación';
  end if;

  if not exists (
    select 1 from public.entities
    where id = 'ddda6dd4-a9d6-44f6-b269-02c40903d5ea'
      and entity_type = 'step'
  ) then
    raise exception '048: falta el Paso canónico del Cristo de la Sangre';
  end if;

  if not exists (
    select 1 from public.entities
    where id = 'b4220000-0000-0000-0000-000000000004'
      and entity_type = 'step'
  ) then
    raise exception '048: falta el Paso técnico duplicado de la Sagrada Presentación';
  end if;

  if not exists (
    select 1 from public.entities
    where id = 'b4220000-0000-0000-0000-000000000005'
      and entity_type = 'step'
  ) then
    raise exception '048: falta el Paso técnico duplicado del Cristo de la Sangre';
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- 1. FUENTES DE LAS RELACIONES HERMANDAD → PASO
-- -----------------------------------------------------------------------------

-- Si alguna Fuente se hubiera vinculado a las relaciones creadas por 042,
-- se conserva y pasa a documentar la relación canónica equivalente.
update public.source_links
set brotherhood_step_id = case brotherhood_step_id
  when 'b4221000-0000-0000-0000-000000000004'::uuid
    then '0b489dbb-12ea-49ec-be83-e152e3c7dcff'::uuid
  when 'b4221000-0000-0000-0000-000000000005'::uuid
    then 'f7724bd4-6326-4d76-ac46-863c6fc29a9f'::uuid
  else brotherhood_step_id
end
where brotherhood_step_id in (
  'b4221000-0000-0000-0000-000000000004'::uuid,
  'b4221000-0000-0000-0000-000000000005'::uuid
);

-- No debe quedar ninguna referencia externa a las dos relaciones duplicadas.
do $$
declare
  r record;
  reference_count bigint;
begin
  for r in
    select
      ns.nspname as schema_name,
      cls.relname as table_name,
      att.attname as column_name
    from pg_constraint con
    join pg_class cls on cls.oid = con.conrelid
    join pg_namespace ns on ns.oid = cls.relnamespace
    join pg_class ref_cls on ref_cls.oid = con.confrelid
    join pg_namespace ref_ns on ref_ns.oid = ref_cls.relnamespace
    join lateral unnest(con.conkey) with ordinality as fk(attnum, ord) on true
    join lateral unnest(con.confkey) with ordinality as pk(attnum, ord) on pk.ord = fk.ord
    join pg_attribute att on att.attrelid = cls.oid and att.attnum = fk.attnum
    join pg_attribute ref_att on ref_att.attrelid = ref_cls.oid and ref_att.attnum = pk.attnum
    where con.contype = 'f'
      and ns.nspname = 'public'
      and ref_ns.nspname = 'public'
      and ref_cls.relname = 'brotherhood_steps'
      and ref_att.attname = 'id'
  loop
    execute format(
      'select count(*) from %I.%I where %I = any($1)',
      r.schema_name,
      r.table_name,
      r.column_name
    )
    into reference_count
    using array[
      'b4221000-0000-0000-0000-000000000004'::uuid,
      'b4221000-0000-0000-0000-000000000005'::uuid
    ];

    if reference_count > 0 then
      raise exception '048: quedan % referencias a brotherhood_steps duplicados en %.%',
        reference_count, r.table_name, r.column_name;
    end if;
  end loop;
end
$$;

-- Las relaciones canónicas ya existen; se eliminan únicamente las dos creadas
-- sobre los Pasos técnicos de 042.
delete from public.brotherhood_steps
where id in (
  'b4221000-0000-0000-0000-000000000004'::uuid,
  'b4221000-0000-0000-0000-000000000005'::uuid
);

-- -----------------------------------------------------------------------------
-- 2. ACOMPAÑAMIENTOS MUSICALES
-- -----------------------------------------------------------------------------

-- Conservamos los mismos periodos (y por tanto sus source_links) pero cambiamos
-- sus extremos a la Hermandad y los Pasos canónicos.
update public.music_accompaniment_periods
set
  brotherhood_entity_id = case
    when brotherhood_entity_id = 'a4220000-0000-0000-0000-000000000004'::uuid
      then '206cf962-fd63-4fae-ad0d-9454554283d8'::uuid
    else brotherhood_entity_id
  end,
  step_entity_id = case step_entity_id
    when 'b4220000-0000-0000-0000-000000000004'::uuid
      then '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
    when 'b4220000-0000-0000-0000-000000000005'::uuid
      then 'ddda6dd4-a9d6-44f6-b269-02c40903d5ea'::uuid
    else step_entity_id
  end
where brotherhood_entity_id = 'a4220000-0000-0000-0000-000000000004'::uuid
   or step_entity_id in (
     'b4220000-0000-0000-0000-000000000004'::uuid,
     'b4220000-0000-0000-0000-000000000005'::uuid
   );

-- -----------------------------------------------------------------------------
-- 3. PASOS DUPLICADOS
-- -----------------------------------------------------------------------------

-- Antes de borrar los dos Pasos técnicos, comprobamos dinámicamente todos los
-- FK que apuntan a entities(id). La única referencia permitida en este punto es
-- su propia fila de subtipo en public.steps, que caerá en cascada con la entidad.
do $$
declare
  r record;
  reference_count bigint;
begin
  for r in
    select
      ns.nspname as schema_name,
      cls.relname as table_name,
      att.attname as column_name
    from pg_constraint con
    join pg_class cls on cls.oid = con.conrelid
    join pg_namespace ns on ns.oid = cls.relnamespace
    join pg_class ref_cls on ref_cls.oid = con.confrelid
    join pg_namespace ref_ns on ref_ns.oid = ref_cls.relnamespace
    join lateral unnest(con.conkey) with ordinality as fk(attnum, ord) on true
    join lateral unnest(con.confkey) with ordinality as pk(attnum, ord) on pk.ord = fk.ord
    join pg_attribute att on att.attrelid = cls.oid and att.attnum = fk.attnum
    join pg_attribute ref_att on ref_att.attrelid = ref_cls.oid and ref_att.attnum = pk.attnum
    where con.contype = 'f'
      and ns.nspname = 'public'
      and ref_ns.nspname = 'public'
      and ref_cls.relname = 'entities'
      and ref_att.attname = 'id'
  loop
    if r.table_name = 'steps' and r.column_name = 'entity_id' then
      continue;
    end if;

    execute format(
      'select count(*) from %I.%I where %I = any($1)',
      r.schema_name,
      r.table_name,
      r.column_name
    )
    into reference_count
    using array[
      'b4220000-0000-0000-0000-000000000004'::uuid,
      'b4220000-0000-0000-0000-000000000005'::uuid
    ];

    if reference_count > 0 then
      raise exception '048: quedan % referencias a Pasos duplicados en %.%',
        reference_count, r.table_name, r.column_name;
    end if;
  end loop;
end
$$;

delete from public.entities
where id in (
  'b4220000-0000-0000-0000-000000000004'::uuid,
  'b4220000-0000-0000-0000-000000000005'::uuid
)
  and entity_type = 'step';

-- -----------------------------------------------------------------------------
-- 4. HERMANDAD DUPLICADA
-- -----------------------------------------------------------------------------

-- A estas alturas el duplicado técnico no debe ser extremo de ninguna relación.
-- Su fila de public.brotherhoods es la única referencia permitida y caerá en
-- cascada al eliminar la entidad.
do $$
declare
  r record;
  reference_count bigint;
begin
  for r in
    select
      ns.nspname as schema_name,
      cls.relname as table_name,
      att.attname as column_name
    from pg_constraint con
    join pg_class cls on cls.oid = con.conrelid
    join pg_namespace ns on ns.oid = cls.relnamespace
    join pg_class ref_cls on ref_cls.oid = con.confrelid
    join pg_namespace ref_ns on ref_ns.oid = ref_cls.relnamespace
    join lateral unnest(con.conkey) with ordinality as fk(attnum, ord) on true
    join lateral unnest(con.confkey) with ordinality as pk(attnum, ord) on pk.ord = fk.ord
    join pg_attribute att on att.attrelid = cls.oid and att.attnum = fk.attnum
    join pg_attribute ref_att on ref_att.attrelid = ref_cls.oid and ref_att.attnum = pk.attnum
    where con.contype = 'f'
      and ns.nspname = 'public'
      and ref_ns.nspname = 'public'
      and ref_cls.relname = 'entities'
      and ref_att.attname = 'id'
  loop
    if r.table_name = 'brotherhoods' and r.column_name = 'entity_id' then
      continue;
    end if;

    execute format(
      'select count(*) from %I.%I where %I = $1',
      r.schema_name,
      r.table_name,
      r.column_name
    )
    into reference_count
    using 'a4220000-0000-0000-0000-000000000004'::uuid;

    if reference_count > 0 then
      raise exception '048: quedan % referencias a la Hermandad duplicada en %.%',
        reference_count, r.table_name, r.column_name;
    end if;
  end loop;
end
$$;

delete from public.entities
where id = 'a4220000-0000-0000-0000-000000000004'::uuid
  and entity_type = 'brotherhood';

-- El slug corto queda libre y pasa al registro canónico. La Hermandad todavía
-- está en borrador, por lo que no existe una URL pública indexada que redirigir.
update public.entities
set slug = 'san-benito'
where id = '206cf962-fd63-4fae-ad0d-9454554283d8'::uuid
  and entity_type = 'brotherhood';

-- -----------------------------------------------------------------------------
-- 5. VALIDACIÓN FINAL DEL GRAFO
-- -----------------------------------------------------------------------------

do $$
begin
  if exists (
    select 1 from public.entities
    where id in (
      'a4220000-0000-0000-0000-000000000004'::uuid,
      'b4220000-0000-0000-0000-000000000004'::uuid,
      'b4220000-0000-0000-0000-000000000005'::uuid
    )
  ) then
    raise exception '048: todavía existe alguna entidad duplicada';
  end if;

  if not exists (
    select 1
    from public.entities e
    join public.brotherhoods b on b.entity_id = e.id
    where e.id = '206cf962-fd63-4fae-ad0d-9454554283d8'::uuid
      and e.slug = 'san-benito'
      and b.canonical_see_place_id = '5996cf32-7c15-4d70-8019-0e6258228803'::uuid
      and b.neighborhood = 'La Calzada'
  ) then
    raise exception '048: el San Benito canónico no conserva sede, barrio o slug esperado';
  end if;

  if (
    select count(*)
    from public.brotherhood_steps bs
    where bs.brotherhood_entity_id = '206cf962-fd63-4fae-ad0d-9454554283d8'::uuid
      and bs.step_entity_id in (
        '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid,
        'ddda6dd4-a9d6-44f6-b269-02c40903d5ea'::uuid,
        '9bd34c93-150e-40b7-9e99-2b66f3bd0f25'::uuid
      )
      and bs.relation_type = 'processional_step'
      and bs.status <> 'archived'
  ) <> 3 then
    raise exception '048: San Benito no conserva exactamente sus tres Pasos canónicos';
  end if;

  if not exists (
    select 1
    from public.music_accompaniment_periods
    where id = 'd4220000-0000-0000-0000-000000000004'::uuid
      and brotherhood_entity_id = '206cf962-fd63-4fae-ad0d-9454554283d8'::uuid
      and step_entity_id = '2c49d077-e377-492d-8e30-25fa823bdcd8'::uuid
  ) then
    raise exception '048: no se consolidó el acompañamiento actual de la Sagrada Presentación';
  end if;

  if not exists (
    select 1
    from public.music_accompaniment_periods
    where id = 'd4220000-0000-0000-0000-000000000005'::uuid
      and brotherhood_entity_id = '206cf962-fd63-4fae-ad0d-9454554283d8'::uuid
      and step_entity_id = 'ddda6dd4-a9d6-44f6-b269-02c40903d5ea'::uuid
  ) then
    raise exception '048: no se consolidó el acompañamiento histórico del Cristo de la Sangre';
  end if;

  if not exists (
    select 1
    from public.entity_relations relation
    where relation.source_entity_id = 'cb04a5d8-e81e-4405-a001-9d5a60840924'::uuid
      and relation.target_entity_id = '206cf962-fd63-4fae-ad0d-9454554283d8'::uuid
      and relation.relation_type = 'belongs_to_brotherhood'
      and relation.status <> 'archived'
  ) then
    raise exception '048: Encarnación no queda vinculada al San Benito canónico';
  end if;
end
$$;

commit;
