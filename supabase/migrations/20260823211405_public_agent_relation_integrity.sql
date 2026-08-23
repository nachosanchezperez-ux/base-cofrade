drop policy if exists "Published image authorships" on public.image_authorships;
create policy "Published image authorships"
on public.image_authorships
for select
to public
using (
  status = 'published'
  and exists (
    select 1 from public.entities image_entity
    where image_entity.id = image_authorships.image_entity_id
      and image_entity.status = 'published'
  )
  and (
    agent_entity_id is null
    or exists (
      select 1 from public.entities agent_entity
      where agent_entity.id = image_authorships.agent_entity_id
        and agent_entity.status = 'published'
    )
  )
);

drop policy if exists "Published heritage interventions" on public.heritage_interventions;
create policy "Published heritage interventions"
on public.heritage_interventions
for select
to public
using (
  status = 'published'
  and exists (
    select 1 from public.entities target_entity
    where target_entity.id = heritage_interventions.target_entity_id
      and target_entity.status = 'published'
  )
  and (
    agent_entity_id is null
    or exists (
      select 1 from public.entities agent_entity
      where agent_entity.id = heritage_interventions.agent_entity_id
        and agent_entity.status = 'published'
    )
  )
);

drop policy if exists "Published step personnel periods" on public.step_personnel_periods;
create policy "Published step personnel periods"
on public.step_personnel_periods
for select
to public
using (
  status = 'published'
  and exists (
    select 1 from public.entities step_entity
    where step_entity.id = step_personnel_periods.step_entity_id
      and step_entity.status = 'published'
  )
  and exists (
    select 1 from public.entities agent_entity
    where agent_entity.id = step_personnel_periods.agent_entity_id
      and agent_entity.status = 'published'
  )
);

drop policy if exists "Public step phase agents" on public.step_phase_agents;
create policy "Public step phase agents"
on public.step_phase_agents
for select
to public
using (
  exists (
    select 1 from public.step_phases phase
    join public.entities step_entity on step_entity.id = phase.step_entity_id
    where phase.id = step_phase_agents.step_phase_id
      and phase.status = 'published'
      and step_entity.status = 'published'
  )
  and exists (
    select 1 from public.entities agent_entity
    where agent_entity.id = step_phase_agents.agent_entity_id
      and agent_entity.status = 'published'
  )
  and (
    element_entity_id is null
    or exists (
      select 1 from public.entities element_entity
      where element_entity.id = step_phase_agents.element_entity_id
        and element_entity.status = 'published'
    )
  )
);

drop policy if exists "Public heritage update agents" on public.heritage_update_agents;
create policy "Public heritage update agents"
on public.heritage_update_agents
for select
to public
using (
  exists (
    select 1 from public.heritage_updates update_row
    where update_row.id = heritage_update_agents.heritage_update_id
      and update_row.status = 'published'
  )
  and exists (
    select 1 from public.entities agent_entity
    where agent_entity.id = heritage_update_agents.agent_entity_id
      and agent_entity.status = 'published'
  )
);

drop policy if exists "Published march authors" on public.march_authors;
create policy "Published march authors"
on public.march_authors
for select
to public
using (
  status = 'published'
  and exists (
    select 1 from public.entities march_entity
    where march_entity.id = march_authors.march_entity_id
      and march_entity.status = 'published'
  )
  and exists (
    select 1 from public.entities agent_entity
    where agent_entity.id = march_authors.agent_entity_id
      and agent_entity.status = 'published'
  )
);

drop policy if exists "Published entity relations" on public.entity_relations;
create policy "Published entity relations"
on public.entity_relations
for select
to public
using (
  status = 'published'
  and exists (
    select 1 from public.entities source_entity
    where source_entity.id = entity_relations.source_entity_id
      and source_entity.status = 'published'
  )
  and exists (
    select 1 from public.entities target_entity
    where target_entity.id = entity_relations.target_entity_id
      and target_entity.status = 'published'
  )
);
