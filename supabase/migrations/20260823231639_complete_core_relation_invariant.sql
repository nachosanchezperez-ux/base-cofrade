-- Hilo Cofrade · Salud del grafo · ciclo 1 · cierre del invariante
--
-- Completa la protección de las relaciones nucleares en ambos sentidos:
-- 1. una relación no puede publicarse con extremos no publicables;
-- 2. si un extremo publicado vuelve a borrador o cambia de tipo, las
--    relaciones nucleares afectadas vuelven automáticamente a borrador.
--
-- Los bloqueos FOR SHARE cierran la carrera entre publicar una relación y
-- despublicar simultáneamente uno de sus extremos.

create or replace function public.guard_core_relation_publication()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  source_entity_id uuid;
  target_entity_id uuid;
  source_entity_type text;
  target_entity_type text;
  source_status text;
  target_status text;
begin
  if new.status <> 'published' then
    return new;
  end if;

  source_entity_id := (to_jsonb(new) ->> tg_argv[0])::uuid;
  target_entity_id := (to_jsonb(new) ->> tg_argv[1])::uuid;

  select entity_type, status
    into source_entity_type, source_status
  from public.entities
  where id = source_entity_id
  for share;

  select entity_type, status
    into target_entity_type, target_status
  from public.entities
  where id = target_entity_id
  for share;

  if source_entity_type is distinct from tg_argv[2]
     or target_entity_type is distinct from tg_argv[3]
     or source_status is distinct from 'published'
     or target_status is distinct from 'published' then
    new.status := 'draft';
  end if;

  return new;
end;
$$;

revoke all on function public.guard_core_relation_publication() from public;

create or replace function public.demote_invalid_core_relations_after_entity_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.brotherhood_images relation
  set status = 'draft'
  where relation.status = 'published'
    and (
      relation.brotherhood_entity_id = new.id
      or relation.image_entity_id = new.id
    )
    and not exists (
      select 1
      from public.entities brotherhood
      join public.entities image
        on image.id = relation.image_entity_id
      where brotherhood.id = relation.brotherhood_entity_id
        and brotherhood.entity_type = 'brotherhood'
        and brotherhood.status = 'published'
        and image.entity_type = 'image'
        and image.status = 'published'
    );

  update public.brotherhood_steps relation
  set status = 'draft'
  where relation.status = 'published'
    and (
      relation.brotherhood_entity_id = new.id
      or relation.step_entity_id = new.id
    )
    and not exists (
      select 1
      from public.entities brotherhood
      join public.entities step
        on step.id = relation.step_entity_id
      where brotherhood.id = relation.brotherhood_entity_id
        and brotherhood.entity_type = 'brotherhood'
        and brotherhood.status = 'published'
        and step.entity_type = 'step'
        and step.status = 'published'
    );

  update public.image_steps relation
  set status = 'draft'
  where relation.status = 'published'
    and (
      relation.image_entity_id = new.id
      or relation.step_entity_id = new.id
    )
    and not exists (
      select 1
      from public.entities image
      join public.entities step
        on step.id = relation.step_entity_id
      where image.id = relation.image_entity_id
        and image.entity_type = 'image'
        and image.status = 'published'
        and step.entity_type = 'step'
        and step.status = 'published'
    );

  return new;
end;
$$;

revoke all on function public.demote_invalid_core_relations_after_entity_change() from public;

drop trigger if exists entities_demote_invalid_core_relations
  on public.entities;
create trigger entities_demote_invalid_core_relations
after update of status, entity_type on public.entities
for each row
when (
  old.status is distinct from new.status
  or old.entity_type is distinct from new.entity_type
)
execute function public.demote_invalid_core_relations_after_entity_change();
