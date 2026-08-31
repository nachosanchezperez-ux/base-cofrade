-- Hilo Cofrade · La Cena · capataces actuales
-- Aportación directa del usuario · 20/08/2026
--
-- Rafael Díaz Talaverón → misterio del Señor de la Sagrada Cena
-- Alfonso Morillo Vázquez → Santísimo Cristo de la Humildad y Paciencia
-- Antonio Santiago Muñoz → palio de Nuestra Señora del Subterráneo
-- Antonio Santiago Muñoz → Nuestra Señora de la Encarnación
--
-- No se inventa una fecha de inicio: queda como "Inicio por documentar".

do $$
declare
  v_source_id uuid;
  v_agent_id uuid;
  v_role_id uuid;
  v_step_id uuid;
  v_period_id uuid;
  r record;
begin
  -- Fuente exacta de la aportación.
  select s.id into v_source_id
  from public.sources s
  where s.name = 'Capataces actuales de La Cena · aportación directa 20/08/2026'
  order by s.created_at
  limit 1;

  if v_source_id is null then
    insert into public.sources (
      name, source_type, author_or_publisher, accessed_at, notes
    ) values (
      'Capataces actuales de La Cena · aportación directa 20/08/2026',
      'Aportación directa',
      'Aportación directa al proyecto Hilo Cofrade',
      '2026-08-20',
      'Datos aportados directamente para la ficha de la Hermandad de la Cena.'
    ) returning id into v_source_id;
  end if;

  -- Personas y rol profesional.
  for r in
    select * from (values
      ('rafael-diaz-talaveron'::text, 'Rafael Díaz Talaverón'::text),
      ('alfonso-morillo-vazquez'::text, 'Alfonso Morillo Vázquez'::text),
      ('antonio-santiago-munoz'::text, 'Antonio Santiago Muñoz'::text)
    ) as a(slug, name)
  loop
    select e.id into v_agent_id
    from public.entities e
    where e.entity_type = 'agent'
      and (e.slug = r.slug or lower(e.name) = lower(r.name))
    order by case when e.slug = r.slug then 0 else 1 end
    limit 1;

    if v_agent_id is null then
      insert into public.entities (entity_type, name, slug, status)
      values ('agent', r.name, r.slug, 'published')
      returning id into v_agent_id;
    else
      update public.entities
      set name = r.name,
          slug = coalesce(slug, r.slug),
          status = 'published',
          updated_at = now()
      where id = v_agent_id;
    end if;

    insert into public.agents (entity_id, agent_kind, description)
    values (v_agent_id, 'person', 'Capataz de pasos procesionales.')
    on conflict (entity_id) do nothing;

    select ar.id into v_role_id
    from public.agent_roles ar
    where ar.agent_entity_id = v_agent_id
      and ar.role_name = 'Capataz'
    order by ar.id
    limit 1;

    if v_role_id is null then
      insert into public.agent_roles (
        agent_entity_id, role_name, date_from_text, notes
      ) values (
        v_agent_id,
        'Capataz',
        'Inicio por documentar',
        'Rol actual documentado por aportación directa al proyecto.'
      ) returning id into v_role_id;
    end if;

    if not exists (
      select 1
      from public.source_links sl
      where sl.source_id = v_source_id
        and sl.agent_role_id = v_role_id
    ) then
      insert into public.source_links (
        source_id, agent_role_id, scope, notes
      ) values (
        v_source_id,
        v_role_id,
        'rol profesional',
        'Aportación directa del rol actual de capataz.'
      );
    end if;
  end loop;

  -- Relaciones Paso ↔ Capataz.
  for r in
    select * from (values
      (
        'paso-misterio-sagrada-cena-sevilla'::text,
        'rafael-diaz-talaveron'::text,
        'Capataz actual del paso de misterio del Señor de la Sagrada Cena. Fecha de inicio pendiente de documentar.'::text
      ),
      (
        'paso-cristo-humildad-y-paciencia-la-cena'::text,
        'alfonso-morillo-vazquez'::text,
        'Capataz actual del paso del Santísimo Cristo de la Humildad y Paciencia. Fecha de inicio pendiente de documentar.'::text
      ),
      (
        'paso-palio-nuestra-senora-del-subterraneo'::text,
        'antonio-santiago-munoz'::text,
        'Capataz actual del paso de palio de Nuestra Señora del Subterráneo. Fecha de inicio pendiente de documentar.'::text
      ),
      (
        'paso-procesional-nuestra-senora-de-la-encarnacion-la-cena'::text,
        'antonio-santiago-munoz'::text,
        'Capataz actual del paso procesional de Nuestra Señora de la Encarnación. Fecha de inicio pendiente de documentar.'::text
      )
    ) as rel(step_slug, agent_slug, note)
  loop
    select e.id into v_step_id
    from public.entities e
    where e.entity_type = 'step'
      and e.slug = r.step_slug;

    select e.id into v_agent_id
    from public.entities e
    where e.entity_type = 'agent'
      and e.slug = r.agent_slug;

    if v_step_id is null or v_agent_id is null then
      raise exception 'No se pudo resolver la relación de capataz: paso %, agente %', r.step_slug, r.agent_slug;
    end if;

    select spp.id into v_period_id
    from public.step_personnel_periods spp
    where spp.step_entity_id = v_step_id
      and spp.agent_entity_id = v_agent_id
      and spp.role_name = 'Capataz'
      and spp.is_current
      and spp.status <> 'archived'
    order by spp.created_at
    limit 1;

    if v_period_id is null then
      insert into public.step_personnel_periods (
        step_entity_id,
        agent_entity_id,
        role_name,
        date_from_text,
        is_current,
        notes,
        status
      ) values (
        v_step_id,
        v_agent_id,
        'Capataz',
        'Inicio por documentar',
        true,
        r.note,
        'published'
      ) returning id into v_period_id;
    else
      update public.step_personnel_periods
      set date_to = null,
          date_to_text = null,
          year_to = null,
          is_current = true,
          notes = r.note,
          status = 'published',
          updated_at = now()
      where id = v_period_id;
    end if;

    if not exists (
      select 1
      from public.source_links sl
      where sl.source_id = v_source_id
        and sl.step_personnel_period_id = v_period_id
    ) then
      insert into public.source_links (
        source_id, step_personnel_period_id, scope, notes
      ) values (
        v_source_id,
        v_period_id,
        'cargo actual',
        'Aportación directa del cargo actual y del paso asignado.'
      );
    end if;
  end loop;
end
$$;
