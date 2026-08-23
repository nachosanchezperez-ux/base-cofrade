-- Cierra la autoridad pública de Personas / agentes.
-- Las relaciones públicas solo son visibles cuando todos sus extremos
-- representables como entidades están publicados. Las políticas editoriales
-- autenticadas se mantienen separadas y continúan dando acceso al Panel.

drop policy if exists "Public agent roles" on public.agent_roles;
create policy "Public agent roles"
on public.agent_roles
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.entities agent
    where agent.id = agent_roles.agent_entity_id
      and agent.entity_type = 'agent'
      and agent.status = 'published'
  )
);

drop policy if exists "Published image authorships" on public.image_authorships;
create policy "Published image authorships"
on public.image_authorships
for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.entities image
    where image.id = image_authorships.image_entity_id
      and image.entity_type = 'image'
      and image.status = 'published'
  )
  and (
    agent_entity_id is null
    or exists (
      select 1
      from public.entities agent
      where agent.id = image_authorships.agent_entity_id
        and agent.entity_type = 'agent'
        and agent.status = 'published'
    )
  )
);

drop policy if exists "Published march authors" on public.march_authors;
create policy "Published march authors"
on public.march_authors
for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.entities march
    where march.id = march_authors.march_entity_id
      and march.entity_type = 'march'
      and march.status = 'published'
  )
  and exists (
    select 1
    from public.entities agent
    where agent.id = march_authors.agent_entity_id
      and agent.entity_type = 'agent'
      and agent.status = 'published'
  )
);

drop policy if exists "Published step personnel periods" on public.step_personnel_periods;
create policy "Published step personnel periods"
on public.step_personnel_periods
for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.entities step
    where step.id = step_personnel_periods.step_entity_id
      and step.entity_type = 'step'
      and step.status = 'published'
  )
  and exists (
    select 1
    from public.entities agent
    where agent.id = step_personnel_periods.agent_entity_id
      and agent.entity_type = 'agent'
      and agent.status = 'published'
  )
);

drop policy if exists "Public step phase agents" on public.step_phase_agents;
create policy "Public step phase agents"
on public.step_phase_agents
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.step_phases phase
    join public.entities step on step.id = phase.step_entity_id
    where phase.id = step_phase_agents.step_phase_id
      and phase.status = 'published'
      and step.entity_type = 'step'
      and step.status = 'published'
  )
  and exists (
    select 1
    from public.entities agent
    where agent.id = step_phase_agents.agent_entity_id
      and agent.entity_type = 'agent'
      and agent.status = 'published'
  )
  and (
    element_entity_id is null
    or exists (
      select 1
      from public.entities element
      where element.id = step_phase_agents.element_entity_id
        and element.status = 'published'
    )
  )
);

drop policy if exists "Published heritage interventions" on public.heritage_interventions;
create policy "Published heritage interventions"
on public.heritage_interventions
for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.entities target
    where target.id = heritage_interventions.target_entity_id
      and target.status = 'published'
  )
  and (
    agent_entity_id is null
    or exists (
      select 1
      from public.entities agent
      where agent.id = heritage_interventions.agent_entity_id
        and agent.entity_type = 'agent'
        and agent.status = 'published'
    )
  )
);

drop policy if exists "Public heritage update agents" on public.heritage_update_agents;
create policy "Public heritage update agents"
on public.heritage_update_agents
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.heritage_updates heritage_update
    join public.entities brotherhood
      on brotherhood.id = heritage_update.brotherhood_entity_id
    where heritage_update.id = heritage_update_agents.heritage_update_id
      and heritage_update.status = 'published'
      and brotherhood.entity_type = 'brotherhood'
      and brotherhood.status = 'published'
      and (
        heritage_update.target_entity_id is null
        or exists (
          select 1
          from public.entities target
          where target.id = heritage_update.target_entity_id
            and target.status = 'published'
        )
      )
  )
  and exists (
    select 1
    from public.entities agent
    where agent.id = heritage_update_agents.agent_entity_id
      and agent.entity_type = 'agent'
      and agent.status = 'published'
  )
);

drop policy if exists "Public band agents" on public.band_agents;
create policy "Public band agents"
on public.band_agents
for select
to anon, authenticated
using (
  is_public
  and exists (
    select 1
    from public.entities band
    where band.id = band_agents.band_entity_id
      and band.entity_type = 'band'
      and band.status = 'published'
  )
  and exists (
    select 1
    from public.entities agent
    where agent.id = band_agents.agent_entity_id
      and agent.entity_type = 'agent'
      and agent.status = 'published'
  )
);

drop policy if exists "Published entity relations" on public.entity_relations;
create policy "Published entity relations"
on public.entity_relations
for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.entities source
    where source.id = entity_relations.source_entity_id
      and source.status = 'published'
  )
  and exists (
    select 1
    from public.entities target
    where target.id = entity_relations.target_entity_id
      and target.status = 'published'
  )
);
