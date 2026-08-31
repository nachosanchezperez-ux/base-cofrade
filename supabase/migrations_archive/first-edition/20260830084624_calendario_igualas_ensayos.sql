-- Hilo Cofrade · Calendario de Igualás y Ensayos
--
-- Cada convocatoria conserva su identidad dentro del grafo mediante
-- public.entities/public.events. Las relaciones tipadas evitan duplicar
-- Hermandades, Pasos y Personas ya documentadas.

alter table public.events
  add column event_category text not null default 'historical',
  add column brotherhood_entity_id uuid references public.entities(id) on delete restrict,
  add column municipality_id uuid references public.municipalities(id) on delete set null,
  add column start_time time,
  add column end_time time,
  add column time_text text,
  add column event_status text not null default 'announced',
  add column location_text text,
  add column requirements text,
  add column public_notes text,
  add column created_at timestamptz not null default now(),
  add column updated_at timestamptz not null default now(),
  add constraint events_category_check check (
    event_category in ('historical', 'crew_call')
  ),
  add constraint events_status_check check (
    event_status in ('announced', 'postponed', 'cancelled', 'held')
  ),
  add constraint events_time_order_check check (
    end_time is null or start_time is null or end_time >= start_time
  ),
  add constraint crew_event_required_fields_check check (
    event_category <> 'crew_call'
    or (
      event_date is not null
      and brotherhood_entity_id is not null
      and event_type in (
        'iguala',
        'ensayo',
        'muda',
        'retranqueo',
        'desarma',
        'reunion_cuadrilla',
        'acto_costalero'
      )
    )
  );

create index events_category_date_idx
  on public.events (event_category, event_date, start_time);

create index events_crew_brotherhood_date_idx
  on public.events (brotherhood_entity_id, event_date)
  where event_category = 'crew_call';

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create table public.crew_event_steps (
  id uuid primary key default gen_random_uuid(),
  event_entity_id uuid not null references public.events(entity_id) on delete cascade,
  step_entity_id uuid not null references public.entities(id) on delete restrict,
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  notes text,
  status text not null default 'draft' check (
    status in ('draft', 'review', 'published', 'archived')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index crew_event_steps_event_idx
  on public.crew_event_steps (event_entity_id, sort_order);

create index crew_event_steps_step_idx
  on public.crew_event_steps (step_entity_id, event_entity_id);

create unique index crew_event_steps_active_key
  on public.crew_event_steps (event_entity_id, step_entity_id)
  where status <> 'archived';

create trigger crew_event_steps_set_updated_at
before update on public.crew_event_steps
for each row execute function public.set_updated_at();

create table public.crew_event_agents (
  id uuid primary key default gen_random_uuid(),
  event_entity_id uuid not null references public.events(entity_id) on delete cascade,
  agent_entity_id uuid not null references public.entities(id) on delete restrict,
  role_name text not null default 'Capataz',
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  notes text,
  status text not null default 'draft' check (
    status in ('draft', 'review', 'published', 'archived')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crew_event_agents_role_present check (btrim(role_name) <> '')
);

create index crew_event_agents_event_idx
  on public.crew_event_agents (event_entity_id, sort_order);

create index crew_event_agents_agent_idx
  on public.crew_event_agents (agent_entity_id, event_entity_id);

create unique index crew_event_agents_active_key
  on public.crew_event_agents (event_entity_id, agent_entity_id, lower(role_name))
  where status <> 'archived';

create trigger crew_event_agents_set_updated_at
before update on public.crew_event_agents
for each row execute function public.set_updated_at();

create or replace function public.guard_crew_event_record()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  event_entity_type text;
  event_entity_status text;
  brotherhood_type text;
  brotherhood_status text;
begin
  select entity_type, status
    into event_entity_type, event_entity_status
  from public.entities
  where id = new.entity_id;

  if event_entity_type is distinct from 'event' then
    raise exception 'crew_event_entity_type_invalid';
  end if;

  if new.brotherhood_entity_id is not null then
    select entity_type, status
      into brotherhood_type, brotherhood_status
    from public.entities
    where id = new.brotherhood_entity_id;

    if brotherhood_type is distinct from 'brotherhood' then
      raise exception 'crew_event_brotherhood_type_invalid';
    end if;
  end if;

  if new.event_category = 'crew_call'
     and event_entity_status = 'published'
     and brotherhood_status is distinct from 'published' then
    raise exception 'crew_event_published_brotherhood_required';
  end if;

  return new;
end;
$$;

revoke all on function public.guard_crew_event_record() from public;
grant execute on function public.guard_crew_event_record() to authenticated, service_role;

create trigger guard_crew_event_record
before insert or update on public.events
for each row execute function public.guard_crew_event_record();

create or replace function public.guard_published_crew_event_entity()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  stored_category text;
  stored_brotherhood_id uuid;
  stored_brotherhood_status text;
begin
  if new.entity_type = 'event' and new.status = 'published' then
    select event_category, brotherhood_entity_id
      into stored_category, stored_brotherhood_id
    from public.events
    where entity_id = new.id;

    if stored_category = 'crew_call' then
      select status
        into stored_brotherhood_status
      from public.entities
      where id = stored_brotherhood_id
        and entity_type = 'brotherhood';

      if stored_brotherhood_status is distinct from 'published' then
        raise exception 'crew_event_published_brotherhood_required';
      end if;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.guard_published_crew_event_entity() from public;
grant execute on function public.guard_published_crew_event_entity() to authenticated, service_role;

create trigger guard_published_crew_event_entity
before insert or update of status, entity_type on public.entities
for each row execute function public.guard_published_crew_event_entity();

create or replace function public.guard_crew_event_link()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  event_type text;
  event_status text;
  event_category text;
  target_type text;
  target_status text;
  target_id uuid;
begin
  select entity.entity_type, entity.status, event.event_category
    into event_type, event_status, event_category
  from public.entities entity
  join public.events event on event.entity_id = entity.id
  where entity.id = new.event_entity_id;

  if event_type is distinct from 'event'
     or event_category is distinct from 'crew_call' then
    raise exception 'crew_event_link_source_invalid';
  end if;

  target_id := case
    when tg_table_name = 'crew_event_steps' then new.step_entity_id
    else new.agent_entity_id
  end;

  select entity_type, status
    into target_type, target_status
  from public.entities
  where id = target_id;

  if target_type is distinct from tg_argv[0] then
    raise exception 'crew_event_link_target_invalid';
  end if;

  if new.status = 'published'
     and (event_status is distinct from 'published'
       or target_status is distinct from 'published') then
    raise exception 'crew_event_link_publication_invalid';
  end if;

  return new;
end;
$$;

revoke all on function public.guard_crew_event_link() from public;
grant execute on function public.guard_crew_event_link() to authenticated, service_role;

create trigger guard_crew_event_step
before insert or update on public.crew_event_steps
for each row execute function public.guard_crew_event_link('step');

create trigger guard_crew_event_agent
before insert or update on public.crew_event_agents
for each row execute function public.guard_crew_event_link('agent');

alter table public.crew_event_steps enable row level security;
alter table public.crew_event_agents enable row level security;

revoke all on table public.events from anon, authenticated;
grant select on table public.events to anon;
grant select, insert, update, delete on table public.events to authenticated;
grant all on table public.events to service_role;

revoke all on table public.crew_event_steps from anon, authenticated;
grant select on table public.crew_event_steps to anon;
grant select, insert, update, delete on table public.crew_event_steps to authenticated;
grant all on table public.crew_event_steps to service_role;

revoke all on table public.crew_event_agents from anon, authenticated;
grant select on table public.crew_event_agents to anon;
grant select, insert, update, delete on table public.crew_event_agents to authenticated;
grant all on table public.crew_event_agents to service_role;

drop policy if exists "Published events" on public.events;
create policy "Published events"
on public.events for select to anon, authenticated
using (
  exists (
    select 1 from public.entities event_entity
    where event_entity.id = events.entity_id
      and event_entity.entity_type = 'event'
      and event_entity.status = 'published'
  )
  and (
    events.event_category <> 'crew_call'
    or exists (
      select 1 from public.entities brotherhood
      where brotherhood.id = events.brotherhood_entity_id
        and brotherhood.entity_type = 'brotherhood'
        and brotherhood.status = 'published'
    )
  )
);

create policy "Panel members can read events"
on public.events for select to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create events"
on public.events for insert to authenticated
with check ((select public.can_edit_panel()));

create policy "Editors can update events"
on public.events for update to authenticated
using ((select public.can_edit_panel()))
with check ((select public.can_edit_panel()));

create policy "Admins can delete events"
on public.events for delete to authenticated
using ((select public.can_admin_panel()));

create policy "Published crew event steps"
on public.crew_event_steps for select to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.events event
    join public.entities event_entity on event_entity.id = event.entity_id
    where event.entity_id = crew_event_steps.event_entity_id
      and event.event_category = 'crew_call'
      and event_entity.entity_type = 'event'
      and event_entity.status = 'published'
  )
  and exists (
    select 1 from public.entities step
    where step.id = crew_event_steps.step_entity_id
      and step.entity_type = 'step'
      and step.status = 'published'
  )
);

create policy "Panel members can read crew event steps"
on public.crew_event_steps for select to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create crew event steps"
on public.crew_event_steps for insert to authenticated
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Editors can update crew event steps"
on public.crew_event_steps for update to authenticated
using (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
)
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Admins can delete crew event steps"
on public.crew_event_steps for delete to authenticated
using ((select public.can_admin_panel()));

create policy "Published crew event agents"
on public.crew_event_agents for select to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.events event
    join public.entities event_entity on event_entity.id = event.entity_id
    where event.entity_id = crew_event_agents.event_entity_id
      and event.event_category = 'crew_call'
      and event_entity.entity_type = 'event'
      and event_entity.status = 'published'
  )
  and exists (
    select 1 from public.entities agent
    where agent.id = crew_event_agents.agent_entity_id
      and agent.entity_type = 'agent'
      and agent.status = 'published'
  )
);

create policy "Panel members can read crew event agents"
on public.crew_event_agents for select to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create crew event agents"
on public.crew_event_agents for insert to authenticated
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Editors can update crew event agents"
on public.crew_event_agents for update to authenticated
using (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
)
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Admins can delete crew event agents"
on public.crew_event_agents for delete to authenticated
using ((select public.can_admin_panel()));

comment on column public.events.event_category is
  'Distingue los acontecimientos históricos de las convocatorias de cuadrilla.';

comment on table public.crew_event_steps is
  'Pasos vinculados a una igualá, ensayo u otra convocatoria de cuadrilla.';

comment on table public.crew_event_agents is
  'Capataces y responsables vinculados a una convocatoria de cuadrilla.';
