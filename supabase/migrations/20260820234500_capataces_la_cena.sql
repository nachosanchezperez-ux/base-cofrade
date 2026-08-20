-- Hilo Cofrade · La Cena · capataces actuales
-- Aportación directa del usuario · 20/08/2026
--
-- Relaciones actuales:
--   · Rafael Díaz Talaverón → paso de misterio del Señor de la Sagrada Cena
--   · Alfonso Morillo Vázquez → paso del Santísimo Cristo de la Humildad y Paciencia
--   · Antonio Santiago Muñoz → paso de palio de Nuestra Señora del Subterráneo
--   · Antonio Santiago Muñoz → paso procesional de Nuestra Señora de la Encarnación
--
-- No se atribuye una fecha de inicio no aportada: se conserva como
-- "Inicio por documentar".

do $$
declare
  misterio_id uuid;
  humildad_id uuid;
  palio_id uuid;
  encarnacion_id uuid;

  rafael_id uuid;
  alfonso_id uuid;
  antonio_id uuid;

  rafael_role_id uuid;
  alfonso_role_id uuid;
  antonio_role_id uuid;

  source_id uuid;

  periodo_misterio_id uuid;
  periodo_humildad_id uuid;
  periodo_palio_id uuid;
  periodo_encarnacion_id uuid;
begin
  select id into misterio_id
  from public.entities
  where entity_type = 'step'
    and slug = 'paso-misterio-sagrada-cena-sevilla';

  select id into humildad_id
  from public.entities
  where entity_type = 'step'
    and slug = 'paso-cristo-humildad-y-paciencia-la-cena';

  select id into palio_id
  from public.entities
  where entity_type = 'step'
    and slug = 'paso-palio-nuestra-senora-del-subterraneo';

  select id into encarnacion_id
  from public.entities
  where entity_type = 'step'
    and slug = 'paso-procesional-nuestra-senora-de-la-encarnacion-la-cena';

  if misterio_id is null or humildad_id is null or palio_id is null or encarnacion_id is null then
    raise exception 'No están disponibles todos los pasos de La Cena necesarios para registrar sus capataces';
  end if;

  select id into rafael_id
  from public.entities
  where entity_type = 'agent'
    and (slug = 'rafael-diaz-talaveron' or lower(name) = lower('Rafael Díaz Talaverón'))
  order by case when slug = 'rafael-diaz-talaveron' then 0 else 1 end
  limit 1;

  if rafael_id is null then
    insert into public.entities (entity_type, name, slug, status)
    values ('agent', 'Rafael Díaz Talaverón', 'rafael-diaz-talaveron', 'published')
    returning id into rafael_id;
  end if;

  insert into public.agents (entity_id, agent_kind, description)
  values (rafael_id, 'person', 'Capataz de pasos procesionales.')
  on conflict (entity_id) do nothing;

  select id into alfonso_id
  from public.entities
  where entity_type = 'agent'
    and (slug = 'alfonso-morillo-vazquez' or lower(name) = lower('Alfonso Morillo Vázquez'))
  order by case when slug = 'alfonso-morillo-vazquez' then 0 else 1 end
  limit 1;

  if alfonso_id is null then
    insert into public.entities (entity_type, name, slug, status)
    values ('agent', 'Alfonso Morillo Vázquez', 'alfonso-morillo-vazquez', 'published')
    returning id into alfonso_id;
  else
    update public.entities
    set name = 'Alfonso Morillo Vázquez',
        slug = coalesce(slug, 'alfonso-morillo-vazquez'),
        status = 'published',
        updated_at = now()
    where id = alfonso_id;
  end if;

  insert into public.agents (entity_id, agent_kind, description)
  values (alfonso_id, 'person', 'Capataz de pasos procesionales.')
  on conflict (entity_id) do nothing;

  select id into antonio_id
  from public.entities
  where entity_type = 'agent'
    and (slug = 'antonio-santiago-munoz' or lower(name) = lower('Antonio Santiago Muñoz'))
  order by case when slug = 'antonio-santiago-munoz' then 0 else 1 end
  limit 1;

  if antonio_id is null then
    insert into public.entities (entity_type, name, slug, status)
    values ('agent', 'Antonio Santiago Muñoz', 'antonio-santiago-munoz', 'published')
    returning id into antonio_id;
  end if;

  insert into public.agents (entity_id, agent_kind, description)
  values (antonio_id, 'person', 'Capataz de pasos procesionales.')
  on conflict (entity_id) do nothing;

  -- Roles profesionales: se reutilizan si ya existen.
  select id into rafael_role_id
  from public.agent_roles
  where agent_entity_id = rafael_id and role_name = 'Capataz'
  order by id
  limit 1;

  if rafael_role_id is null then
    insert into public.agent_roles (agent_entity_id, role_name, date_from_text, notes)
    values (rafael_id, 'Capataz', 'Inicio por documentar', 'Rol actual documentado por aportación directa al proyecto.')
    returning id into rafael_role_id;
  end if;

  select id into alfonso_role_id
  from public.agent_roles
  where agent_entity_id = alfonso_id and role_name = 'Capataz'
  order by id
  limit 1;

  if alfonso_role_id is null then
    insert into public.agent_roles (agent_entity_id, role_name, date_from_text, notes)
    values (alfonso_id, 'Capataz', 'Inicio por documentar', 'Rol actual documentado por aportación directa al proyecto.')
    returning id into alfonso_role_id;
  end if;

  select id into antonio_role_id
  from public.agent_roles
  where agent_entity_id = antonio_id and role_name = 'Capataz'
  order by id
  limit 1;

  if antonio_role_id is null then
    insert into public.agent_roles (agent_entity_id, role_name, date_from_text, notes)
    values (antonio_id, 'Capataz', 'Inicio por documentar', 'Rol actual documentado por aportación directa al proyecto.')
    returning id into antonio_role_id;
  end if;

  -- Fuente exacta de esta aportación.
  select id into source_id
  from public.sources
  where name = 'Capataces actuales de La Cena · aportación directa 20/08/2026'
  order by created_at
  limit 1;

  if source_id is null then
    insert into public.sources (
      name, source_type, author_or_publisher, accessed_at, notes
    ) values (
      'Capataces actuales de La Cena · aportación directa 20/08/2026',
      'Aportación directa',
      'Aportación directa al proyecto Hilo Cofrade',
      '2026-08-20',
      'Datos aportados directamente por el usuario para la ficha de la Hermandad de la Cena.'
    ) returning id into source_id;
  end if;

  -- Paso de misterio · Rafael Díaz Talaverón.
  select id into periodo_misterio_id
  from public.step_personnel_periods
  where step_entity_id = misterio_id
    and agent_entity_id = rafael_id
    and role_name = 'Capataz'
    and is_current
    and status <> 'archived'
  order by created_at
  limit 1;

  if periodo_misterio_id is null then
    insert into public.step_personnel_periods (
      step_entity_id, agent_entity_id, role_name, date_from_text,
      is_current, notes, status
    ) values (
      misterio_id, rafael_id, 'Capataz', 'Inicio por documentar',
      true,
      'Capataz actual del paso de misterio del Señor de la Sagrada Cena. Fecha de inicio pendiente de documentar.',
      'published'
    ) returning id into periodo_misterio_id;
  else
    update public.step_personnel_periods
    set date_to = null,
        date_to_text = null,
        year_to = null,
        is_current = true,
        status = 'published',
        notes = 'Capataz actual del paso de misterio del Señor de la Sagrada Cena. Fecha de inicio pendiente de documentar.',
        updated_at = now()
    where id = periodo_misterio_id;
  end if;

  -- Cristo de la Humildad y Paciencia · Alfonso Morillo Vázquez.
  select id into periodo_humildad_id
  from public.step_personnel_periods
  where step_entity_id = humildad_id
    and agent_entity_id = alfonso_id
    and role_name = 'Capataz'
    and is_current
    and status <> 'archived'
  order by created_at
  limit 1;

  if periodo_humildad_id is null then
    insert into public.step_personnel_periods (
      step_entity_id, agent_entity_id, role_name, date_from_text,
      is_current, notes, status
    ) values (
      humildad_id, alfonso_id, 'Capataz', 'Inicio por documentar',
      true,
      'Capataz actual del paso del Santísimo Cristo de la Humildad y Paciencia. Fecha de inicio pendiente de documentar.',
      'published'
    ) returning id into periodo_humildad_id;
  else
    update public.step_personnel_periods
    set date_to = null,
        date_to_text = null,
        year_to = null,
        is_current = true,
        status = 'published',
        notes = 'Capataz actual del paso del Santísimo Cristo de la Humildad y Paciencia. Fecha de inicio pendiente de documentar.',
        updated_at = now()
    where id = periodo_humildad_id;
  end if;

  -- Palio del Subterráneo · Antonio Santiago Muñoz.
  select id into periodo_palio_id
  from public.step_personnel_periods
  where step_entity_id = palio_id
    and agent_entity_id = antonio_id
    and role_name = 'Capataz'
    and is_current
    and status <> 'archived'
  order by created_at
  limit 1;

  if periodo_palio_id is null then
    insert into public.step_personnel_periods (
      step_entity_id, agent_entity_id, role_name, date_from_text,
      is_current, notes, status
    ) values (
      palio_id, antonio_id, 'Capataz', 'Inicio por documentar',
      true,
      'Capataz actual del paso de palio de Nuestra Señora del Subterráneo. Fecha de inicio pendiente de documentar.',
      'published'
    ) returning id into periodo_palio_id;
  else
    update public.step_personnel_periods
    set date_to = null,
        date_to_text = null,
        year_to = null,
        is_current = true,
        status = 'published',
        notes = 'Capataz actual del paso de palio de Nuestra Señora del Subterráneo. Fecha de inicio pendiente de documentar.',
        updated_at = now()
    where id = periodo_palio_id;
  end if;

  -- Nuestra Señora de la Encarnación · Antonio Santiago Muñoz.
  select id into periodo_encarnacion_id
  from public.step_personnel_periods
  where step_entity_id = encarnacion_id
    and agent_entity_id = antonio_id
    and role_name = 'Capataz'
    and is_current
    and status <> 'archived'
  order by created_at
  limit 1;

  if periodo_encarnacion_id is null then
    insert into public.step_personnel_periods (
      step_entity_id, agent_entity_id, role_name, date_from_text,
      is_current, notes, status
    ) values (
      encarnacion_id, antonio_id, 'Capataz', 'Inicio por documentar',
      true,
      'Capataz actual del paso procesional de Nuestra Señora de la Encarnación. Fecha de inicio pendiente de documentar.',
      'published'
    ) returning id into periodo_encarnacion_id;
  else
    update public.step_personnel_periods
    set date_to = null,
        date_to_text = null,
        year_to = null,
        is_current = true,
        status = 'published',
        notes = 'Capataz actual del paso procesional de Nuestra Señora de la Encarnación. Fecha de inicio pendiente de documentar.',
        updated_at = now()
    where id = periodo_encarnacion_id;
  end if;

  -- Enlace de la fuente a los cuatro cargos concretos.
  if not exists (
    select 1 from public.source_links
    where source_id = source_id and step_personnel_period_id = periodo_misterio_id
  ) then
    insert into public.source_links (source_id, step_personnel_period_id, scope, notes)
    values (source_id, periodo_misterio_id, 'cargo actual', 'Aportación directa del cargo actual y del paso asignado.');
  end if;

  if not exists (
    select 1 from public.source_links
    where source_id = source_id and step_personnel_period_id = periodo_humildad_id
  ) then
    insert into public.source_links (source_id, step_personnel_period_id, scope, notes)
    values (source_id, periodo_humildad_id, 'cargo actual', 'Aportación directa del cargo actual y del paso asignado.');
  end if;

  if not exists (
    select 1 from public.source_links
    where source_id = source_id and step_personnel_period_id = periodo_palio_id
  ) then
    insert into public.source_links (source_id, step_personnel_period_id, scope, notes)
    values (source_id, periodo_palio_id, 'cargo actual', 'Aportación directa del cargo actual y del paso asignado.');
  end if;

  if not exists (
    select 1 from public.source_links
    where source_id = source_id and step_personnel_period_id = periodo_encarnacion_id
  ) then
    insert into public.source_links (source_id, step_personnel_period_id, scope, notes)
    values (source_id, periodo_encarnacion_id, 'cargo actual', 'Aportación directa del cargo actual y del paso asignado.');
  end if;

  -- Enlace de la misma fuente a los roles profesionales, evitando duplicados.
  if rafael_role_id is not null and not exists (
    select 1 from public.source_links
    where source_id = source_id and agent_role_id = rafael_role_id
  ) then
    insert into public.source_links (source_id, agent_role_id, scope, notes)
    values (source_id, rafael_role_id, 'rol profesional', 'Aportación directa del rol actual de capataz.');
  end if;

  if alfonso_role_id is not null and not exists (
    select 1 from public.source_links
    where source_id = source_id and agent_role_id = alfonso_role_id
  ) then
    insert into public.source_links (source_id, agent_role_id, scope, notes)
    values (source_id, alfonso_role_id, 'rol profesional', 'Aportación directa del rol actual de capataz.');
  end if;

  if antonio_role_id is not null and not exists (
    select 1 from public.source_links
    where source_id = source_id and agent_role_id = antonio_role_id
  ) then
    insert into public.source_links (source_id, agent_role_id, scope, notes)
    values (source_id, antonio_role_id, 'rol profesional', 'Aportación directa del rol actual de capataz.');
  end if;
end
$$;
