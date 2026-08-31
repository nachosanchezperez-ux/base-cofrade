-- Hilo Cofrade · Autoridad editorial Front ↔ Panel para Hermandades
-- La autoridad se transfiere por sección cuando el Panel publica, retira o
-- archiva contenido. Las fichas todavía no migradas conservan sus fallbacks.

alter table public.brotherhoods
  add column if not exists history_text text;

create table if not exists public.brotherhood_section_authority (
  brotherhood_entity_id uuid not null references public.entities(id) on delete cascade,
  section_key text not null,
  source text not null default 'panel',
  managed_at timestamptz not null default now(),
  primary key (brotherhood_entity_id, section_key),
  constraint brotherhood_section_authority_section_key_check check (
    section_key = any (array[
      'identidad', 'colores', 'historia', 'enlaces', 'titulares', 'pasos',
      'salidas', 'cultos', 'patrimonio', 'estrenos', 'acontecimientos',
      'acompanamiento', 'jornada', 'fuentes'
    ]::text[])
  ),
  constraint brotherhood_section_authority_source_check check (
    source = any (array['panel', 'migration']::text[])
  )
);

alter table public.brotherhood_section_authority enable row level security;

grant select on table public.brotherhood_section_authority to anon;
grant select, insert, update, delete on table public.brotherhood_section_authority to authenticated;

create policy "Published brotherhood section authority"
  on public.brotherhood_section_authority
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.entities entity
      where entity.id = brotherhood_section_authority.brotherhood_entity_id
        and entity.entity_type = 'brotherhood'
        and entity.status = 'published'
    )
  );

create policy "Panel members can read brotherhood section authority"
  on public.brotherhood_section_authority
  for select
  to authenticated
  using ((select public.is_panel_member()));

create policy "Editors can create brotherhood section authority"
  on public.brotherhood_section_authority
  for insert
  to authenticated
  with check ((select public.can_edit_panel()));

create policy "Editors can update brotherhood section authority"
  on public.brotherhood_section_authority
  for update
  to authenticated
  using ((select public.can_edit_panel()))
  with check ((select public.can_edit_panel()));

create policy "Admins can delete brotherhood section authority"
  on public.brotherhood_section_authority
  for delete
  to authenticated
  using ((select public.can_admin_panel()));

create or replace function public.hc_set_brotherhood_section_authority(
  p_brotherhood_id uuid,
  p_section_key text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_brotherhood_id is null or p_section_key is null then
    return;
  end if;

  if not exists (
    select 1
    from public.entities entity
    where entity.id = p_brotherhood_id
      and entity.entity_type = 'brotherhood'
  ) then
    return;
  end if;

  insert into public.brotherhood_section_authority (
    brotherhood_entity_id, section_key, source, managed_at
  ) values (
    p_brotherhood_id, p_section_key, 'panel', now()
  )
  on conflict (brotherhood_entity_id, section_key)
  do update set source = excluded.source, managed_at = excluded.managed_at;
end;
$$;

revoke all on function public.hc_set_brotherhood_section_authority(uuid, text) from public;
revoke all on function public.hc_set_brotherhood_section_authority(uuid, text) from anon;
revoke all on function public.hc_set_brotherhood_section_authority(uuid, text) from authenticated;

create or replace function public.hc_authority_for_event_target(
  p_target_id uuid
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_type text;
  brotherhood_id uuid;
begin
  select entity_type into target_type
  from public.entities
  where id = p_target_id;

  if target_type = 'brotherhood' then
    perform public.hc_set_brotherhood_section_authority(p_target_id, 'acontecimientos');
    return;
  end if;

  if target_type = 'image' then
    for brotherhood_id in
      select distinct relation.brotherhood_entity_id
      from public.brotherhood_images relation
      where relation.image_entity_id = p_target_id
        and relation.status = 'published'
    loop
      perform public.hc_set_brotherhood_section_authority(brotherhood_id, 'acontecimientos');
    end loop;
  end if;
end;
$$;

revoke all on function public.hc_authority_for_event_target(uuid) from public;
revoke all on function public.hc_authority_for_event_target(uuid) from anon;
revoke all on function public.hc_authority_for_event_target(uuid) from authenticated;

create or replace function public.hc_mark_brotherhood_authority_from_audit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  brotherhood_id uuid;
  section_name text;
  recorded_status text;
  relation_type text;
  source_id uuid;
  target_id uuid;
  relation_row record;
begin
  if new.object_type = 'event' then
    if new.action_type not in ('publish', 'archive', 'unpublish')
      and coalesce(new.changed_fields -> 'entity' ->> 'status', new.changed_fields ->> 'status', '') <> 'published'
    then
      return new;
    end if;

    for relation_row in
      select relation.target_entity_id
      from public.entity_relations relation
      where relation.source_entity_id = new.entity_id
        and relation.relation_type = 'involves'
        and relation.status = 'published'
    loop
      perform public.hc_authority_for_event_target(relation_row.target_entity_id);
    end loop;
    return new;
  end if;

  if new.object_type = 'entity_relation' then
    relation_type := new.changed_fields ->> 'relation_type';
    if relation_type <> 'involves' then
      return new;
    end if;

    begin
      source_id := nullif(new.changed_fields ->> 'source_entity_id', '')::uuid;
      target_id := nullif(new.changed_fields ->> 'target_entity_id', '')::uuid;
    exception when invalid_text_representation then
      return new;
    end;

    if source_id is null or target_id is null then
      return new;
    end if;

    if not exists (
      select 1 from public.entities entity
      where entity.id = source_id and entity.entity_type = 'event'
    ) then
      return new;
    end if;

    recorded_status := coalesce(new.changed_fields ->> 'status', '');
    if new.action_type not in ('archive', 'unlink', 'unpublish', 'publish')
      and recorded_status <> 'published'
    then
      return new;
    end if;

    perform public.hc_authority_for_event_target(target_id);
    return new;
  end if;

  if new.entity_id is not null and exists (
    select 1
    from public.entities entity
    where entity.id = new.entity_id
      and entity.entity_type = 'brotherhood'
  ) then
    brotherhood_id := new.entity_id;
  end if;

  if brotherhood_id is null and new.changed_fields ? 'brotherhood_entity_id' then
    begin
      brotherhood_id := nullif(new.changed_fields ->> 'brotherhood_entity_id', '')::uuid;
    exception when invalid_text_representation then
      brotherhood_id := null;
    end;
  end if;

  if brotherhood_id is null then
    return new;
  end if;

  case new.object_type
    when 'brotherhood' then section_name := 'identidad';
    when 'brotherhood_history' then section_name := 'historia';
    when 'entity_social_link' then section_name := 'enlaces';
    when 'brotherhood_image' then section_name := 'titulares';
    when 'brotherhood_step' then section_name := 'pasos';
    when 'outing' then section_name := 'salidas';
    when 'outing_series' then section_name := 'salidas';
    when 'outing_series_movement' then section_name := 'salidas';
    when 'outing_music_position' then section_name := 'salidas';
    when 'outing_music_assignment' then section_name := 'salidas';
    when 'cult' then section_name := 'cultos';
    when 'cult_occurrence' then section_name := 'cultos';
    when 'heritage_asset' then section_name := 'patrimonio';
    when 'heritage_intervention' then section_name := 'patrimonio';
    when 'heritage_update' then section_name := 'estrenos';
    when 'music_accompaniment_period' then section_name := 'acompanamiento';
    when 'brotherhood_procession_stats' then section_name := 'jornada';
    when 'source_link' then section_name := 'fuentes';
    else section_name := null;
  end case;

  if section_name is null then
    return new;
  end if;

  if new.object_type = 'brotherhood' then
    recorded_status := coalesce(new.changed_fields -> 'entity' ->> 'status', '');
  else
    recorded_status := coalesce(new.changed_fields ->> 'status', '');
  end if;

  if new.object_type not in ('entity_social_link', 'source_link', 'brotherhood_history')
    and new.action_type not in ('archive', 'unlink', 'unpublish', 'publish')
    and recorded_status <> 'published'
  then
    return new;
  end if;

  perform public.hc_set_brotherhood_section_authority(brotherhood_id, section_name);

  if new.object_type = 'brotherhood' then
    perform public.hc_set_brotherhood_section_authority(brotherhood_id, 'colores');
  end if;

  return new;
end;
$$;

revoke all on function public.hc_mark_brotherhood_authority_from_audit() from public;
revoke all on function public.hc_mark_brotherhood_authority_from_audit() from anon;
revoke all on function public.hc_mark_brotherhood_authority_from_audit() from authenticated;

drop trigger if exists trg_hc_brotherhood_authority_from_audit on public.audit_log;
create trigger trg_hc_brotherhood_authority_from_audit
after insert on public.audit_log
for each row
execute function public.hc_mark_brotherhood_authority_from_audit();

comment on table public.brotherhood_section_authority is
  'Registra qué secciones de una Hermandad tienen a Supabase/Panel como fuente editorial autoritativa frente a fallbacks locales.';

comment on column public.brotherhoods.history_text is
  'Historia pública de la Hermandad administrada desde el Panel. Solo sustituye el fallback local cuando la sección historia tiene autoridad.';
