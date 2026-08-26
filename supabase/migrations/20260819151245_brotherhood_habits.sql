-- Hilo Cofrade · Indumentaria nazarena relacional
--
-- Modela varias túnicas por hermandad y documenta cada variante con fuente.

create table public.brotherhood_habits (
  id uuid primary key default gen_random_uuid(),
  brotherhood_entity_id uuid not null references public.entities(id) on delete cascade,
  name text not null,
  tunic_description text,
  hood_description text,
  cord_description text,
  buttons_description text,
  shield_description text,
  footwear_description text,
  image_path text,
  image_alt text,
  sort_order smallint not null default 0,
  notes text,
  status text not null default 'published' check (
    status in ('draft','review','published','archived')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brotherhood_entity_id, name)
);

create index brotherhood_habits_brotherhood_idx
  on public.brotherhood_habits(brotherhood_entity_id, sort_order);

create trigger brotherhood_habits_set_updated_at
before update on public.brotherhood_habits
for each row execute function public.set_updated_at();

alter table public.brotherhood_habits enable row level security;

create policy "Published brotherhood habits"
on public.brotherhood_habits for select
to anon, authenticated
using (status = 'published');

create policy "Panel members can read brotherhood_habits"
on public.brotherhood_habits for select
to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create brotherhood_habits"
on public.brotherhood_habits for insert
to authenticated
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Editors can update brotherhood_habits"
on public.brotherhood_habits for update
to authenticated
using (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
)
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Admins can delete brotherhood_habits"
on public.brotherhood_habits for delete
to authenticated
using ((select public.can_admin_panel()));

grant select on public.brotherhood_habits to anon;
grant select, insert, update, delete on public.brotherhood_habits to authenticated;
grant select, insert, update, delete on public.brotherhood_habits to service_role;

alter table public.source_links
  add column brotherhood_habit_id uuid
  references public.brotherhood_habits(id) on delete cascade;

create index source_links_brotherhood_habit_idx
  on public.source_links(brotherhood_habit_id);

alter table public.source_links
  drop constraint source_links_one_target;

alter table public.source_links
  add constraint source_links_one_target check (
    num_nonnulls(
      entity_id,
      outing_id,
      cult_id,
      intervention_id,
      heritage_update_id,
      editorial_content_id,
      music_accompaniment_period_id,
      march_dedication_id,
      march_recording_id,
      image_authorship_id,
      brotherhood_image_id,
      entity_location_id,
      entity_relation_id,
      step_phase_id,
      step_personnel_period_id,
      brotherhood_step_id,
      image_step_id,
      agent_name_id,
      agent_role_id,
      cult_occurrence_id,
      outing_music_position_id,
      outing_music_assignment_id,
      outing_series_id,
      band_premiere_id,
      brotherhood_habit_id
    ) = 1
  );

insert into public.brotherhood_habits (
  brotherhood_entity_id,
  name,
  tunic_description,
  hood_description,
  cord_description,
  buttons_description,
  shield_description,
  footwear_description,
  image_path,
  image_alt,
  sort_order,
  notes,
  status
)
select
  e.id,
  habit.name,
  'Azul de cola',
  'Azul',
  habit.cord_description,
  habit.buttons_description,
  habit.shield_description,
  'Zapato negro',
  habit.image_path,
  habit.image_alt,
  habit.sort_order,
  'Indumentaria documentada por la Hermandad del Baratillo.',
  'published'
from public.entities e
cross join (
  values
    (
      'Cortejo del paso de Cristo',
      'Rojo',
      'Roja',
      'Serigrafiado con borde rojo',
      '/hermandades/el-baratillo/tunicas/cortejo-cristo.svg',
      'Túnica de nazareno azul del cortejo del paso de Cristo del Baratillo, con cíngulo y botonadura rojos',
      1::smallint
    ),
    (
      'Cortejo del paso de palio',
      'Blanco',
      'Blanca',
      'Serigrafiado con borde blanco',
      '/hermandades/el-baratillo/tunicas/cortejo-palio.svg',
      'Túnica de nazareno azul del cortejo del paso de palio del Baratillo, con cíngulo y botonadura blancos',
      2::smallint
    )
) as habit(
  name,
  cord_description,
  buttons_description,
  shield_description,
  image_path,
  image_alt,
  sort_order
)
where e.entity_type = 'brotherhood'
  and e.slug = 'el-baratillo'
on conflict (brotherhood_entity_id, name) do update set
  tunic_description = excluded.tunic_description,
  hood_description = excluded.hood_description,
  cord_description = excluded.cord_description,
  buttons_description = excluded.buttons_description,
  shield_description = excluded.shield_description,
  footwear_description = excluded.footwear_description,
  image_path = excluded.image_path,
  image_alt = excluded.image_alt,
  sort_order = excluded.sort_order,
  notes = excluded.notes,
  status = excluded.status,
  updated_at = now();

insert into public.source_links (
  source_id,
  brotherhood_habit_id,
  scope,
  notes
)
select
  source.id,
  habit.id,
  'Indumentaria nazarena',
  'Cartel oficial de indumentaria del nazareno aportado por la Hermandad.'
from public.sources source
join public.entities brotherhood
  on brotherhood.slug = 'el-baratillo'
 and brotherhood.entity_type = 'brotherhood'
join public.brotherhood_habits habit
  on habit.brotherhood_entity_id = brotherhood.id
where source.url = 'https://hermandadelbaratillo.es/'
  and not exists (
    select 1
    from public.source_links existing
    where existing.source_id = source.id
      and existing.brotherhood_habit_id = habit.id
  );
